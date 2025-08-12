import {
  Truck,
  LayoutDashboard,
  Mail,
  Map,
  Calendar,
  CreditCard,
  BarChart2,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";

const SIDEBAR_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/home/dashboard" },

  { name: "Fleet Booking", icon: Mail, path: "/home/fleetbook" },
  { name: "Live Tracking", icon: Map, path: "/home/livetracking" },
  { name: "WareHouse slots", icon: Calendar, path: "/home/slots" },
  { name: "Inventory Upload", icon: CreditCard, path: "/home/reports" },

];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="bg-white border-r border-gray-200 min-h-screen flex flex-col w-[250px]">
      {/* Logo & App Name */}
      <div className="flex items-center px-6 py-7 gap-2">
        <Truck className="h-8 w-8 text-black" />
        <span className="font-bold text-lg tracking-wide text-black">
          TrakIndia
        </span>
      </div>

      {/* User Info */}
      <div className="flex items-center px-6 py-2 gap-3">
        <div className="rounded-full w-9 h-9 bg-gray-100 flex items-center justify-center text-gray-400 text-xl font-bold">A</div>
        <div>
          <div className="font-medium text-black text-sm">Ramesh Gupta</div>
          <div className="text-xs text-gray-400">Guptaramesh@gmail.com</div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="mt-6 flex-1">
        <ul className="px-2 space-y-1">
          {SIDEBAR_ITEMS.map(({ name, icon: Icon, path }) => (
            <li key={name}>
              <Link
                to={path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-colors
                  ${
                    location.pathname === path
                      ? "bg-gray-100 text-black font-semibold"
                      : "text-gray-500 hover:bg-gray-50"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${
                    location.pathname === path ? "text-black" : "text-gray-500"
                  }`}
                />
                <span>{name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
 
      {/* New Shipment Card */}
      <div className="mt-auto px-6 pb-4 w-full">
        <div className="bg-gray-50 rounded-xl shadow-sm p-4 flex items-center gap-4">
          <Truck className="w-9 h-9 text-black" />
          <div>
            <div className="font-bold text-lg text-black">1332</div>
            <div className="text-xs text-black">+678 km</div>
            <div className="text-xs text-cyan-700 mt-1 font-medium">
              New shipment available
            </div>
            <button className="mt-1 text-xs text-cyan-600 underline">
              Details ...
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
