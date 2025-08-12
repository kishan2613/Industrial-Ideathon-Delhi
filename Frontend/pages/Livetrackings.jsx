import React from "react";
import { MapPin, Truck, Package } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

export default function Track() {
  const start = [28.6519, 77.1907]; // Karol Bagh coords
  const end = [28.6692, 77.4538];   // Ghaziabad coords

  return (
    <div className=" min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Live Tracking</h1>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Map Section */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-100 p-4 font-semibold text-gray-700 border-b">
            Current Route: Karol Bagh → Ghaziabad
          </div>
          <MapContainer center={start} zoom={11} className="w-full h-[400px]">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={start}>
              <Popup>Karol Bagh (Pickup)</Popup>
            </Marker>
            <Marker position={end}>
              <Popup>Ghaziabad (Destination)</Popup>
            </Marker>
            <Polyline positions={[start, end]} color="blue" />
          </MapContainer>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Shipment Timeline</h2>
          <div className="space-y-6">
            <TimelineStep
              icon={<MapPin className="w-6 h-6 text-green-500" />}
              title="Pickup Completed"
              desc="Karol Bagh"
              time="10:30 AM"
              active
            />
            <TimelineStep
              icon={<Truck className="w-6 h-6 text-blue-500" />}
              title="Left Karol Bagh"
              desc="Karol Bagh"
              time="11:00 AM"
              active
            />
            <TimelineStep
              icon={<Truck className="w-6 h-6 text-blue-500" />}
              title="In Transit"
              desc="Heading towards Ghaziabad"
              time="12:45 PM"
            />
             <TimelineStep
              icon={<Truck className="w-6 h-6 text-blue-500" />}
              title="In Transit"
              desc="Heading towards Noida"
              time="01:15 PM"
            />
            <TimelineStep
              icon={<Package className="w-6 h-6 text-gray-500" />}
              title="Out for Delivery"
              desc="Expected by 3:00 PM"
              time="—"
            />
          </div>
        </div>
      </div>

      {/* Shipments Section */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Active Shipments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ShipmentCard
            title="Karol Bagh → Ghaziabad"
            status="In Transit"
            date="Today, 12:45 PM"
          />
          <ShipmentCard
            title="Dwarka → Noida"
            status="Delivered"
            date="Yesterday, 3:15 PM"
          />
          <ShipmentCard
            title="Rohini → Gurugram"
            status="Delivered"
            date="Aug 8, 2:00 PM"
          />
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ icon, title, desc, time, active }) {
  return (
    <div className="flex items-start space-x-4">
      <div
        className={`p-2 rounded-full ${
          active ? "bg-green-100" : "bg-gray-100"
        }`}
      >
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-500 text-sm">{desc}</p>
        <p className="text-xs text-gray-400">{time}</p>
      </div>
    </div>
  );
}

function ShipmentCard({ title, status, date }) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-100">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500">Status: {status}</p>
      <p className="text-xs text-gray-400">Updated: {date}</p>
    </div>
  );
}
