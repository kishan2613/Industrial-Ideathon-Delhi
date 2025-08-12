import React, { useState } from "react";
import { MapPinIcon, StarIcon } from "@heroicons/react/24/solid";

const warehousesData = [
  {
    id: 1,
    name: "Okhla Industrial Area",
    location: "Okhla, South Delhi",
    rating: 4.8,
    available: 23,
    pricePerDay: 150,
    occupancy: 54,
    features: ["24/7 Security", "CCTV Monitoring", "Fire Safety", "Climate Control"],
    distance: 12,
  },
  {
    id: 2,
    name: "Bawana Industrial Area",
    location: "Bawana, North West Delhi",
    rating: 4.6,
    available: 35,
    pricePerDay: 120,
    occupancy: 53,
    features: ["Automated Systems", "Loading Docks", "Packaging Services", "Quality Control"],
    distance: 25,
  },
];

export default function WarehouseSlots() {
  const [warehouses, setWarehouses] = useState(warehousesData);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [slotsToBook, setSlotsToBook] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);

  const handleBooking = () => {
    if (!slotsToBook || slotsToBook <= 0) return;

    setWarehouses((prev) =>
      prev.map((w) =>
        w.id === selectedWarehouse.id
          ? { ...w, available: w.available - Number(slotsToBook) }
          : w
      )
    );
    setSelectedWarehouse(null);
    setSlotsToBook("");
    setSuccessPopup(true);
    setTimeout(() => setSuccessPopup(false), 2000);
  };

  return (
    <div className=" min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Warehouse Slots</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {warehouses.map((wh) => (
          <div
            key={wh.id}
            className="bg-white rounded-xl shadow p-5 flex flex-col justify-between"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{wh.name}</h2>
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPinIcon className="w-4 h-4 mr-1 text-gray-400" />
                  {wh.location}
                </div>
              </div>
              <div className="flex items-center bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-sm">
                <StarIcon className="w-4 h-4 mr-1" />
                {wh.rating}
              </div>
            </div>

            {/* Slots + Price */}
            <div className="flex justify-between items-center mt-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-center">
                <p className="text-xl font-bold">{wh.available}</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-center">
                <p className="text-lg font-bold text-yellow-600">
                  ₹{wh.pricePerDay}/day
                </p>
                <p className="text-sm text-gray-500">per day</p>
              </div>
            </div>

            {/* Occupancy */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Occupancy</span>
                <span>{wh.occupancy}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${wh.occupancy}%` }}
                ></div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-4">
              <h3 className="font-semibold text-sm mb-2">Features:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                {wh.features.map((f, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Distance */}
            

            {/* Buttons */}
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => setSelectedWarehouse(wh)}
                className="bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800"
              >
                Reserve Slot
              </button>
              
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedWarehouse && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">          <div className="bg-white p-6 rounded-xl shadow-xl w-80">
            <h2 className="text-lg font-semibold mb-4">
              Reserve Slots for {selectedWarehouse.name}
            </h2>
            <input
              type="number"
              min="1"
              max={selectedWarehouse.available}
              value={slotsToBook}
              onChange={(e) => setSlotsToBook(e.target.value)}
              placeholder="Enter number of slots"
              className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedWarehouse(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {/* Success Popup */}
{successPopup && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
    <div className="bg-white px-8 py-6 rounded-2xl shadow-2xl text-center max-w-sm w-full animate-fadeIn">
      <h2 className="text-lg font-semibold text-gray-800">
        Slots booked successfully!
      </h2>
      <button
        onClick={() => setSuccessPopup(false)}
        className="mt-4 px-5 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
      >
        OK
      </button>
    </div>
  </div>
)}

    </div>
  );
}
