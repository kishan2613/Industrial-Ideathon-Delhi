import { useState, useEffect } from "react";
import { Truck, Search, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Trucks from "../src/assets/Truck.png";

const SHIPMENTS = [
  {
    shipmentNo: "UA-145009BS",
    from: "Gtb Nagar, India",
    to: "Bawana, India",
    buyer: "Milton Hines",
    status: "On way",
    truck: "Iveco 80E190",
    weight: "7,340 kg",
    pallets: "13/20",
    space: "65% / 35%",
    volume: "18 m³",
    load: 65,
  },
  {
    shipmentNo: "MK-549893XC",
    from: "Ghaziabad, India",
    to: "Bawana, India",
    buyer: "Gary Muncy",
    status: "On way",
    truck: "Mahindra Blazo",
    weight: "7,800 kg",
    pallets: "14/20",
    space: "70% / 30%",
    volume: "19 m³",
    load: 70,
  },
  {
    shipmentNo: "KB-GZB-001",
    from: "Karol Bagh, India",
    to: "Ghaziabad, India",
    buyer: "Rajesh Kumar",
    status: "Available",
    truck: "Tata 407",
    weight: "5,000 kg",
    pallets: "10/15",
    space: "67% / 33%",
    volume: "15 m³",
    load: 67,
  },
  {
    shipmentNo: "KB-1002",
    from: "Karol Bagh, India",
    to: "Yamuna vihar, India",
    buyer: "Amit Sharma",
    status: "Available",
    truck: "Ashok Leyland Dost",
    weight: "4,800 kg",
    pallets: "9/15",
    space: "60% / 40%",
    volume: "14 m³",
    load: 60,
  },
];

// Helper function to get coordinates from location name
async function getCoordinates(location) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      location
    )}`
  );
  const data = await res.json();
  if (data.length > 0) {
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  }
  return null;
}

// Component to adjust map bounds
function MapBounds({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length > 0) {
      map.fitBounds(coords);
    }
  }, [coords, map]);
  return null;
}

export default function Fleet() {
  const [shipments] = useState(SHIPMENTS);
  const [filteredShipments, setFilteredShipments] = useState(SHIPMENTS);
  const [selected, setSelected] = useState(SHIPMENTS[0]);
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [mapCoords, setMapCoords] = useState([]);

  // Load coordinates when selected changes
  useEffect(() => {
    async function fetchCoords() {
      if (!selected) return;
      const fromCoords = await getCoordinates(selected.from);
      const toCoords = await getCoordinates(selected.to);
      const coords = [];
      if (fromCoords) coords.push(fromCoords);
      if (toCoords) coords.push(toCoords);
      setMapCoords(coords);
    }
    fetchCoords();
  }, [selected]);

  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      if (!fromInput.trim() && !toInput.trim()) {
        setFilteredShipments(shipments);
        setSelected(shipments[0]);
      } else {
        const results = shipments.filter(
          (s) =>
            (!fromInput.trim() ||
              s.from.toLowerCase().includes(fromInput.trim().toLowerCase())) &&
            (!toInput.trim() ||
              s.to.toLowerCase().includes(toInput.trim().toLowerCase()))
        );
        setFilteredShipments(results);
        setSelected(results.length > 0 ? results[0] : null);
      }
      setLoading(false);
    }, 500);
  };

  const markerIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
  });

  return (
    <div className="flex w-full min-h-screen bg-white">
      {/* Left grid */}
      <section className="flex-1 max-w-[550px] border-r border-gray-200 p-3 overflow-y-auto">
        <h1 className="text-2xl font-bold text-black mb-4">Fleet Management</h1>
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="From"
            value={fromInput}
            onChange={(e) => setFromInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
          />
          <input
            type="text"
            placeholder="Destination"
            value={toInput}
            onChange={(e) => setToInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
          />
          <button
            onClick={handleSearch}
            className="p-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 transition flex items-center justify-center"
          >
            <Search className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredShipments.length > 0 ? (
            filteredShipments.map((item) => (
              <div
                key={item.shipmentNo}
                onClick={() => setSelected(item)}
                className={`bg-white rounded-2xl shadow-sm p-5 border cursor-pointer transition ${
                  selected?.shipmentNo === item.shipmentNo
                    ? "ring-2 ring-cyan-500"
                    : "hover:ring-1 hover:ring-cyan-300"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Shipment number</p>
                    <p className="font-bold text-black text-lg">
                      {item.shipmentNo}
                    </p>
                  </div>
                  <img
                    src={Trucks}
                    alt="truck"
                    className="w-12 h-12 object-contain"
                  />
                </div>
                <div className="mb-3">
                  <p className="font-medium text-black">{item.from}</p>
                </div>
                <div>
                  <p className="font-medium text-black">{item.to}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No trucks found</p>
          )}
        </div>
      </section>

      {/* Right panel */}
      <section className="flex-[0.7] min-w-[280px] p-8 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin w-10 h-10 text-cyan-600" />
          </div>
        ) : selected ? (
          <>
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <Truck className="w-6 h-6 text-cyan-600" />
                  <span className="font-semibold text-lg text-black">
                    {selected.shipmentNo}
                  </span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-cyan-100 text-cyan-700 font-medium capitalize">
                    {selected.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {selected.from} → {selected.to}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  Buyer:{" "}
                  <span className="text-black font-semibold">
                    {selected.buyer}
                  </span>
                </div>
              </div>
              <button className="bg-cyan-600 text-white px-4 py-1.5 rounded-lg font-semibold shadow hover:bg-cyan-700 transition text-sm">
                Book Now
              </button>
            </div>

            {/* Load capacity */}
            <div className="mb-7">
              <div className="mb-2 font-semibold text-black">Load capacity</div>
              <div className="relative h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center">
                <img
                  src={Trucks}
                  alt="truck"
                  className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  style={{ width: `${selected.load}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-bold text-xl text-white drop-shadow">
                  {selected.load}%
                </span>
              </div>
            </div>

            {/* OpenStreetMap */}
            <div className="mb-7">
              <div className="mb-2 font-semibold text-black">Route Map</div>
              {mapCoords.length > 0 ? (
                <MapContainer
                  style={{ height: "250px", borderRadius: "12px" }}
                  center={mapCoords[0]}
                  zoom={5}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  />
                  {mapCoords.map((pos, idx) => (
                    <Marker key={idx} position={pos} icon={markerIcon}>
                      <Popup>
                        {idx === 0 ? selected.from : selected.to}
                      </Popup>
                    </Marker>
                  ))}
                  <MapBounds coords={mapCoords} />
                </MapContainer>
              ) : (
                <p className="text-gray-500">Loading map...</p>
              )}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a truck to view details</p>
        )}
      </section>
    </div>
  );
}
