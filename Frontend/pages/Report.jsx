import React, { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart, CategoryScale, LinearScale, PointElement,
  BarElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { Upload, FileText, TrendingUp, BarChart3, X, Calendar, Package } from 'lucide-react';

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Report() {
  const [fileName, setFileName] = useState('');
  const [showPanel, setShowPanel] = useState(false);
  const [predictedData, setPredictedData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null); // drill-down view

  const mockHistory = [
    { date: '2024-01-01', sku: 'SKU_101', warehouse: 'WH_EAST', sold: 120, category: 'Electronics' },
    { date: '2024-01-02', sku: 'SKU_102', warehouse: 'WH_WEST', sold: 90, category: 'Clothing' },
    { date: '2024-01-03', sku: 'SKU_103', warehouse: 'WH_CENTRAL', sold: 130, category: 'Home & Garden' }
  ];

  const handleFileChange = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://127.0.0.1:8000/uploadfile/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Upload failed: ${response.statusText}`);

      const data = await response.json();
      console.log(data);

      setPredictedData(data.predictions); // store raw predictions
      setHistoryData(mockHistory);
      setIsUploading(false);
      setShowPanel(true);
      setSelectedWarehouse(null);

    } catch (err) {
      setIsUploading(false);
      alert(`Error uploading file: ${err.message}`);
      setFileName('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

  // Line chart: sum across all warehouses for each date
  const lineChartData = useMemo(() => {
    if (!predictedData) return null;
    const dateMap = new Map();
    predictedData.forEach(p => {
      if (!dateMap.has(p.date)) dateMap.set(p.date, 0);
      dateMap.set(p.date, dateMap.get(p.date) + p.predicted_stock);
    });
    return {
      labels: Array.from(dateMap.keys()).map(dateStr =>
        new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      ),
      datasets: [{
        label: 'Predicted Stock Units (All Warehouses)',
        data: Array.from(dateMap.values()).map(v => Math.round(v)),
        fill: false,
        backgroundColor: 'rgba(59,130,246,0.8)',
        borderColor: 'rgb(59,130,246)',
        tension: 0.4
      }]
    };
  }, [predictedData]);

  // Aggregate by warehouse
  const warehouseChartData = useMemo(() => {
    if (!predictedData) return null;
    const map = new Map();
    predictedData.forEach(p => {
      if (!map.has(p.Warehouse_ID)) map.set(p.Warehouse_ID, 0);
      map.set(p.Warehouse_ID, map.get(p.Warehouse_ID) + p.predicted_stock);
    });
    return {
      labels: Array.from(map.keys()),
      datasets: [{
        label: 'Total Stock Needed per Warehouse',
        data: Array.from(map.values()).map(v => Math.round(v)),
        backgroundColor: 'rgba(99,102,241,0.8)',
        borderRadius: 6
      }]
    };
  }, [predictedData]);

  // Aggregate by SKU within selected warehouse
  const skuChartData = useMemo(() => {
    if (!predictedData || !selectedWarehouse) return null;
    const map = new Map();
    predictedData
      .filter(p => p.Warehouse_ID === selectedWarehouse)
      .forEach(p => {
        if (!map.has(p.SKU_ID)) map.set(p.SKU_ID, 0);
        map.set(p.SKU_ID, map.get(p.SKU_ID) + p.predicted_stock);
      });
    return {
      labels: Array.from(map.keys()),
      datasets: [{
        label: `Stock per SKU in ${selectedWarehouse}`,
        data: Array.from(map.values()).map(v => Math.round(v)),
        backgroundColor: 'rgba(34,197,94,0.8)',
        borderRadius: 6
      }]
    };
  }, [predictedData, selectedWarehouse]);

  // Chart click handler for drill-down
  const handleWarehouseClick = (evt, elements) => {
    if (!elements.length) return;
    const chartIndex = elements[0].index;
    const wh = warehouseChartData.labels[chartIndex];
    setSelectedWarehouse(wh);
  };

  const barChartOptions = {
    responsive: true,
    plugins: { legend: { display: true } },
    indexAxis: 'y',
    onClick: handleWarehouseClick
  };

  const skuBarChartOptions = {
    responsive: true,
    plugins: { legend: { display: true } },
    indexAxis: 'y'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 shadow-lg">
        <div className="flex items-center justify-center space-x-3">
          <BarChart3 className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Inventory Forecasting Dashboard</h1>
        </div>
      </header>

      <main className="flex-grow flex relative overflow-hidden">
        {/* Upload section */}
        <section
          className={`flex flex-col items-center justify-center w-full md:w-2/5 p-8 border-4 rounded-xl cursor-pointer select-none
          ${dragOver ? 'border-blue-400 bg-blue-50 shadow-lg' : 'border-gray-300 bg-white'}
          ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
          onClick={() => !isUploading && document.getElementById('fileInput').click()}
        >
          <input id="fileInput" type="file" accept=".csv" className="hidden"
            onChange={e => handleFileChange(e.target.files[0])} disabled={isUploading} />
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin h-14 w-14 border-4 border-blue-300 border-t-blue-700 rounded-full" />
              <p className="text-blue-700 font-semibold mt-4">Processing your data...</p>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center text-green-700">
              <FileText className="h-12 w-12" />
              <p className="font-semibold mt-2">{fileName} uploaded successfully!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-700">
              <Upload className="h-14 w-14" />
              <p className="font-semibold mt-2">Upload Your Sales Data</p>
              <p className="text-sm">Drag & drop or click to select CSV file</p>
            </div>
          )}
        </section>

        {/* Sliding panel */}
        <section
          className={`fixed top-0 right-0 h-full bg-white shadow-2xl max-w-5xl w-full md:w-3/5
          transform transition-all duration-500 ease-out z-50
          ${showPanel ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        >
          <div className="flex justify-between items-center p-6 bg-gray-100 sticky top-0 border-b">
            <h2 className="text-xl font-bold">Prediction Analytics</h2>
            {selectedWarehouse && (
              <button onClick={() => setSelectedWarehouse(null)}
                className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">← Back</button>
            )}
            <button onClick={() => setShowPanel(false)} className="text-gray-600 hover:text-gray-900">
              <X />
            </button>
          </div>

          <div className="p-6 space-y-8 overflow-y-auto h-full">
            {lineChartData && (
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Daily Predictions (All Warehouses)</h3>
                <div className="h-64">
                  <Line data={lineChartData} />
                </div>
              </div>
            )}

            {!selectedWarehouse && warehouseChartData && (
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Warehouse-wise Total Stock</h3>
                <div className="h-64">
                  <Bar data={warehouseChartData} options={barChartOptions} />
                </div>
                <p className="text-xs text-gray-500 mt-2">Click a bar to drill down to SKU view</p>
              </div>
            )}

            {selectedWarehouse && skuChartData && (
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold mb-2">Stock by SKU in {selectedWarehouse}</h3>
                <div className="h-64">
                  <Bar data={skuChartData} options={skuBarChartOptions} />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* History Table */}
      <section className="p-6 bg-white">
        <h3 className="font-semibold mb-2">Historical Sales Data</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm text-gray-700">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Warehouse</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Units Sold</th>
              </tr>
            </thead>
            <tbody>
              {historyData.length > 0 ? historyData.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-2">{new Date(row.date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 font-mono">{row.sku}</td>
                  <td className="px-4 py-2">{row.warehouse}</td>
                  <td className="px-4 py-2">{row.category}</td>
                  <td className="px-4 py-2 font-semibold">{row.sold}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="text-center p-6 text-gray-400">
                    <Package className="mx-auto mb-2 h-12 w-12 opacity-50" />
                    No historical data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
