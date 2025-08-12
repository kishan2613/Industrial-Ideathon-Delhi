from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import joblib
from datetime import timedelta
import io

# --- FastAPI app ---
app = FastAPI()

# Enable CORS so React can talk to backend
app.add_middleware(
    CORSMiddleware,
allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174"
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained ML model & encoder
model = joblib.load("xgb_inventory_model.pkl")
encoder = joblib.load("onehot_encoder.pkl")


@app.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):
    # Only allow CSV
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed")

    # Read uploaded CSV into DataFrame
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    # --- Validate ---
    required_cols = {'ds', 'SKU_ID', 'Warehouse_ID', 'Price', 'Stock_On_Hand', 'Festival'}
    if not required_cols.issubset(df.columns):
        missing_cols = required_cols - set(df.columns)
        raise HTTPException(status_code=400, detail=f"Missing columns: {missing_cols}")

    # --- Feature Engineering ---
    df['ds'] = pd.to_datetime(df['ds'])
    df['day_of_week'] = df['ds'].dt.dayofweek
    df['month'] = df['ds'].dt.month
    df['week_of_year'] = df['ds'].dt.isocalendar().week.astype(int)
    df['is_weekend'] = (df['day_of_week'] >= 5).astype(int)

    # --- Prepare prediction dates ---
    future_start = df['ds'].max() + timedelta(days=1)
    future_dates = [future_start + timedelta(days=i) for i in range(10)]

    predictions = []

    # --- Loop over SKU + Warehouse combinations ---
    for (sku, wh), group in df.groupby(["SKU_ID", "Warehouse_ID"]):
        last_row = group.iloc[-1]  # last row for that SKU & Warehouse

        for date in future_dates:
            # Create new feature row for prediction
            new_row = {
                "Price": last_row["Price"],
                "Stock_On_Hand": last_row["Stock_On_Hand"],
                "Festival": 0,  # You can add real mapping if needed
                "day_of_week": date.weekday(),
                "month": date.month,
                "week_of_year": date.isocalendar()[1],
                "is_weekend": 1 if date.weekday() >= 5 else 0,
                "SKU_ID": sku,
                "Warehouse_ID": wh
            }

            # One-hot encode SKU and Warehouse
            row_df = pd.DataFrame([new_row])
            encoded = encoder.transform(row_df[["SKU_ID", "Warehouse_ID"]])
            encoded_df = pd.DataFrame(
                encoded,
                columns=encoder.get_feature_names_out(["SKU_ID", "Warehouse_ID"])
            )

            # Merge non-categorical features with encoded
            final_row = pd.concat([row_df.drop(columns=["SKU_ID", "Warehouse_ID"]), encoded_df], axis=1)

            # Predict stock for this SKU+Warehouse+Date
            pred_value = float(model.predict(final_row)[0])

            predictions.append({
                "date": date.strftime("%Y-%m-%d"),
                "SKU_ID": sku,
                "Warehouse_ID": wh,
                "predicted_stock": pred_value
            })

    return {"predictions": predictions}
