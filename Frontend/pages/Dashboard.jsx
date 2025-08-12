import { useState, useEffect } from "react";
import { User, Truck, TrendingUp, ArrowUpRight } from "lucide-react";
import RouteSuggestion from "./RouteSuggestion";

const PROFILE = {
  name: "Ramesh",
  img: "https://randomuser.me/api/portraits/men/75.jpg",
};

const RECENT_SHIPMENTS = [
  {
    from: "Karol Bagh",
    to: "Ghaziabad",
    status: "In Transit",
    time: "2 hrs",
    amount: 1200,
  },
  {
    from: "Lajpat Nagar",
    to: "Noida",
    status: "Delivered",
    time: "Completed",
    amount: 850,
  },
  {
    from: "Saket",
    to: "Gurugram",
    status: "Pickup",
    time: "30 min",
    amount: 950,
  },
];

const COST_SAVINGS = 105000;
const EFFICIENCY = 92;

const SAVINGS_TREND = [
  { label: "Fleet Optimization", amount: 40000 },
  { label: "Route Efficiency", amount: 35000 },
  { label: "Warehouse Sharing", amount: 30000 },
];

export default function Dashboard() {
  const [typedText, setTypedText] = useState("");

  const FULL_TEXT = "Smarter Logistics, Faster Deliveries";

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index <= FULL_TEXT.length) {
        setTypedText(FULL_TEXT.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white min-h-screen relative">
      {/* Route Suggestion Component - positioned absolutely */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <RouteSuggestion />
      </div>
      
      <div className="p-8 pt-20">
        {/* Welcome Profile */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <img
              src={PROFILE.img}
              alt="Profile"
              className="w-14 h-14 rounded-full border-2 border-cyan-500 object-cover"
            />
            <div>
              <div className="text-lg text-black font-semibold">
                Welcome back, {PROFILE.name} <span role="img" aria-label="wave">👋</span>
              </div>
              <div className="text-gray-500 text-sm">Here's your logistics update</div>
            </div>
          </div>
          
          {/* Typing Animation */}
          <div className="hidden md:block">
            <div className="text-xl font-bold text-cyan-600">
              {typedText}
              <span className="animate-pulse">|</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="rounded-xl bg-gray-50 px-7 py-6 shadow flex flex-col gap-2">
            <div className="text-xs text-gray-400 font-medium">Active Shipments</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-black">{RECENT_SHIPMENTS.length * 9}</span>
              <Truck className="w-5 h-5 text-cyan-500" />
            </div>
            <span className="text-xs mt-1 font-medium text-green-600 bg-green-50 px-2 rounded">+15% from last month</span>
          </div>
          <div className="rounded-xl bg-gray-50 px-7 py-6 shadow flex flex-col gap-2">
            <div className="text-xs text-gray-400 font-medium">Cost Savings</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-black">₹{(COST_SAVINGS / 100000).toFixed(2)}L</span>
              <TrendingUp className="w-5 h-5 text-cyan-500" />
            </div>
            <span className="text-xs mt-1 font-medium text-green-600 bg-green-50 px-2 rounded">
              +20% from last month
            </span>
          </div>
          <div className="rounded-xl bg-gray-50 px-7 py-6 shadow flex flex-col gap-2">
            <div className="text-xs text-gray-400 font-medium">Efficiency</div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-black">{EFFICIENCY}%</span>
              <ArrowUpRight className="w-5 h-5 text-cyan-500" />
            </div>
            <span className="text-xs mt-1 font-medium text-green-600 bg-green-50 px-2 rounded">
              +10% from last month
            </span>
          </div>
        </div>

        {/* Recent Shipments + Savings Trend */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-4">
          {/* Recent Shipments */}
          <div className="bg-white border border-gray-100 rounded-xl shadow p-6">
            <div className="font-semibold text-black mb-4">Recent Shipments</div>
            <ul className="divide-y divide-gray-100">
              {RECENT_SHIPMENTS.map((s, i) => (
                <li className="flex items-center justify-between py-3" key={i}>
                  <div>
                    <div className="font-medium text-black">{s.from} → {s.to}</div>
                    <div className="text-xs text-gray-500">{s.status} · {s.time}</div>
                  </div>
                  <div className="text-cyan-700 font-bold text-md">₹{s.amount}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Cost Savings Trend */}
          <div className="bg-white border border-gray-100 rounded-xl shadow p-6">
            <div className="font-semibold text-black mb-4">Cost Savings Trend</div>
            <div className="text-2xl font-bold text-cyan-700 mb-2">₹{(COST_SAVINGS / 100000).toFixed(2)}L</div>
            <div className="text-xs text-gray-500 mb-4">Total savings this month</div>
            <ul className="space-y-2">
              {SAVINGS_TREND.map(({ label, amount }, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span className="text-sm text-black">{label}</span>
                  <span className="text-md font-bold text-gray-900">₹{amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}