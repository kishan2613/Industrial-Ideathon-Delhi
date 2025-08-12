import React, { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart, CategoryScale, LinearScale, PointElement,
  BarElement, LineElement, Title, Tooltip, Legend
} from 'chart.js';
import { Upload, FileText, BarChart3, Package } from 'lucide-react';

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
  const [predictedData, setPredictedData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);

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
      setPredictedData(data.predictions);
      setHistoryData(mockHistory); // Replace with data.history if needed
      setSelectedWarehouse(null);
    } catch (err) {
      alert(`Error uploading file: ${err.message}`);
      setFileName('');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileChange(file);
  };

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
        backgroundColor: 'rgba(59,130,246,0.8)',
        borderColor: 'rgb(59,130,246)',
        tension: 0.4
      }]
    };
  }, [predictedData]);

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
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
<header className="bg-gradient-to-r from-black to-gray-800 text-white py-3 shadow">
        <div className="flex items-center justify-center space-x-3">
          <BarChart3 className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Inventory Forecasting Dashboard</h1>
        </div>
      </header>

      {/* Top layout: Upload + History */}
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        {/* Upload Section */}
        <section
          className={`flex flex-col items-center justify-center md:w-2/5 w-full border-2 rounded-lg p-4
          ${dragOver ? 'border-blue-400 bg-blue-50 shadow' : 'border-gray-300 bg-white'}
          ${isUploading ? 'opacity-60 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragOver(false); }}
          onClick={() => !isUploading && document.getElementById('fileInput').click()}
        >
          <input id="fileInput" type="file" accept=".csv" className="hidden"
            onChange={e => handleFileChange(e.target.files[0])} disabled={isUploading} />
          {isUploading ? (
            <div className="flex flex-col items-center py-8">
              <div className="animate-spin h-14 w-14 border-4 border-blue-300 border-t-blue-700 rounded-full" />
              <p className="text-blue-700 font-semibold mt-4">Processing your data...</p>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center text-green-700 py-8">
              <FileText className="h-12 w-12" />
              <p className="font-semibold mt-2">{fileName} uploaded successfully!</p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-700 py-8">
              <Upload className="h-14 w-14" />
              <p className="font-semibold mt-2">Upload Your Sales Data</p>
              <p className="text-sm">Drag & drop or click to select CSV file</p>
            </div>
          )}
        </section>

        {/* History Table */}
        <section className="bg-white rounded shadow md:w-3/5 w-full">
          <h3 className="font-semibold p-3 border-b">Historical Sales Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-gray-700">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">SKU</th>
                  <th className="px-4 py-2">Warehouse</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Units Sold</th>
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
      </main>

      {/* Prediction Analytics */}
      {predictedData && (
        <section className="p-4 space-y-6">
          {/* Line Chart */}
          {lineChartData && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Daily Predictions (All Warehouses)</h3>
              <div className="h-64">
                <Line data={lineChartData} />
              </div>
            </div>
          )}

          {/* Warehouse Chart */}
          {!selectedWarehouse && warehouseChartData && (
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-2">Warehouse-wise Total Stock</h3>
              <div className="h-64">
                <Bar data={warehouseChartData} options={barChartOptions} />
              </div>
              <p className="text-xs text-gray-500 mt-1">Click a bar to drill down to SKU view</p>
            </div>
          )}

          {/* SKU-level Chart */}
          {selectedWarehouse && skuChartData && (
            <div className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Stock by SKU in {selectedWarehouse}</h3>
                <button onClick={() => setSelectedWarehouse(null)}
                  className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">← Back</button>
              </div>
              <div className="h-64">
                <Bar data={skuChartData} options={skuBarChartOptions} />
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
