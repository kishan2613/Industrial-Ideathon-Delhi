import React, { useState, useEffect } from "react";
import { MapPin, Clock, BarChart3, Navigation, X, Route } from "lucide-react";
import data from "../src/assets/Data.json";
// Mock data for demonstration
 

const pastelColors = [
  "rgba(134, 182, 255, 0.8)", // pastel blue
  "rgba(120, 211, 164, 0.8)", // pastel green  
  "rgba(255, 205, 150, 0.8)", // pastel yellow
  "rgba(255, 153, 170, 0.8)"  // pastel pink
];

export default function RouteSuggestion() {
  const [showInputs, setShowInputs] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [suggestionsStart, setSuggestionsStart] = useState([]);
  const [suggestionsEnd, setSuggestionsEnd] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showAllModal, setShowAllModal] = useState(false);
  const [showBestModal, setShowBestModal] = useState(false);
  const [bestRoute, setBestRoute] = useState(null);

  // Sample areas for demonstration
  const allAreas = [
    "Bawana Industrial Estate",
    "Narela Industrial Estate",
    "Karol Bagh",
    "Tilak Nagar Industrial Area",
    "Gurgaon Industrial Area",
    "Noida Industrial Area", 
    "Faridabad Industrial Complex",
    "Manesar Industrial Area",
    "Greater Noida Industrial Zone",
    "Okhla Industrial Estate",
    "Mayapuri Industrial Area"
  ];

  const handleStartInput = (value) => {
    setStart(value);
    if (value.trim() === "") {
      setSuggestionsStart([]);
      return;
    }
    setSuggestionsStart(allAreas.filter(a =>
      a.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5));
  };

  const handleEndInput = (value) => {
    setEnd(value);
    if (value.trim() === "") {
      setSuggestionsEnd([]);
      return;
    }
    setSuggestionsEnd(allAreas.filter(a =>
      a.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5));
  };

  const handleSearch = () => {
    if (start === "" || end === "") {
      alert("Please select both start and destination industrial areas.");
      return;
    }
     setShowInputs(false);
    // Using mock data for demonstration
    const match = data.industrial_area_routes.find(
      r => r.pair.start === start && r.pair.end === end
    );
    if (match) {
      setRoutes(match.routes);
      setShowAllModal(true);
    } else {
      // For demo, show sample routes
      setRoutes(data.industrial_area_routes[0].routes);
      setShowAllModal(true);
    }
  };

  const findBestRoute = () => {
    if (!routes.length) return;
    const best = [...routes].reduce((min, route) =>
      route.predicted_time_hr < min.predicted_time_hr ? route : min
    , routes[0]);
    setBestRoute(best);
    setShowBestModal(true);
  };

  const MetricCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white bg-opacity-70 rounded-lg p-4 shadow-md backdrop-blur-sm border border-white border-opacity-20">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <Icon className={`w-4 h-4 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  );

  const RouteComparisonTable = () => (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
        <Route className="w-5 h-5" />
        Route Comparison
      </h3>
      <div className="bg-white bg-opacity-70 rounded-lg overflow-hidden shadow-md backdrop-blur-sm border border-white border-opacity-20">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 bg-opacity-80">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Distance</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Time</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signals</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {routes.map((route, idx) => (
                <tr key={route.route_id} className="hover:bg-gray-50 hover:bg-opacity-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{route.route_id}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 max-w-xs truncate">{route.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{route.total_distance_km} km</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{route.average_time_hr} hr</td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">{route.predicted_time_hr} hr</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{route.traffic_signals.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full relative">
      {/* Top-right button - properly positioned */}
      <div className="flex justify-end p-4">
        <button
          className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-lg shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200 flex items-center gap-2"
          onClick={() => setShowInputs(!showInputs)}
        >
          <Navigation className="w-4 h-4" />
          Route Suggestion
        </button>
      </div>

      {/* Inputs panel */}
      {showInputs && (
        <div className="px-4 pb-4">
          <div className="max-w-md mx-auto bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-lg p-6 border border-white border-opacity-20">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Find Best Route
            </h3>
            
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Start Industrial Area"
                value={start}
                onChange={e => handleStartInput(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white bg-opacity-80"
              />
              {suggestionsStart.length > 0 && (
                <ul className="absolute z-40 bg-white rounded-lg border border-gray-200 w-full max-h-36 overflow-y-auto shadow-xl mt-1">
                  {suggestionsStart.map((s, i) => (
                    <li
                      key={i}
                      className="cursor-pointer px-4 py-2 hover:bg-blue-50 transition-colors text-sm"
                      onClick={() => {
                        setStart(s);
                        setSuggestionsStart([]);
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Destination Industrial Area"
                value={end}
                onChange={e => handleEndInput(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white bg-opacity-80"
              />
              {suggestionsEnd.length > 0 && (
                <ul className="absolute z-40 bg-white rounded-lg border border-gray-200 w-full max-h-36 overflow-y-auto shadow-xl mt-1">
                  {suggestionsEnd.map((s, i) => (
                    <li
                      key={i}
                      className="cursor-pointer px-4 py-2 hover:bg-blue-50 transition-colors text-sm"
                      onClick={() => {
                        setEnd(s);
                        setSuggestionsEnd([]);
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <button
              onClick={handleSearch}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-lg py-3 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              Search Routes
            </button>
          </div>
        </div>
      )}

      {/* All Possible Routes Modal */}
      {showAllModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-auto border border-white border-opacity-30">
            <div className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm p-6 border-b border-gray-200 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Route className="w-6 h-6 text-blue-500" />
                  All Possible Routes
                </h2>
                <button
                  onClick={() => setShowAllModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard 
                  title="Total Routes" 
                  value={routes.length} 
                  icon={Route}
                  color="text-blue-500"
                />
                <MetricCard 
                  title="Best Time" 
                  value={`${Math.min(...routes.map(r => r.predicted_time_hr))}h`}
                  icon={Clock}
                  color="text-green-500"
                />
                <MetricCard 
                  title="Shortest Distance" 
                  value={`${Math.min(...routes.map(r => r.total_distance_km))}km`}
                  icon={MapPin}
                  color="text-purple-500"
                />
                <MetricCard 
                  title="Total Signals" 
                  value={routes.reduce((acc, r) => acc + r.traffic_signals.length, 0)}
                  icon={BarChart3}
                  color="text-orange-500"
                />
              </div>

              <RouteComparisonTable />

              <div className="flex justify-center mt-8">
                <button
                  onClick={findBestRoute}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <span className="text-lg">🤖</span>
                  Find Best Route
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Best Route Modal - Horizontally Scrollable */}
      {showBestModal && bestRoute && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] border border-white border-opacity-30">
            <div className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm p-6 border-b border-gray-200 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-2xl">🏆</span>
                  Best Route - {bestRoute.route_id}
                </h2>
                <button
                  onClick={() => setShowBestModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-auto max-h-[calc(90vh-120px)]">
              {/* Route Details */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6 border border-green-200">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Route Description</p>
                    <p className="font-semibold text-gray-800">{bestRoute.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Distance</p>
                    <p className="text-2xl font-bold text-blue-600">{bestRoute.total_distance_km} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average Time</p>
                    <p className="text-2xl font-bold text-orange-600">{bestRoute.average_time_hr} hr</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Predicted Time</p>
                    <p className="text-2xl font-bold text-green-600">{bestRoute.predicted_time_hr} hr</p>
                  </div>
                </div>
              </div>

              {/* Traffic Signals - Horizontally Scrollable */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">Traffic Signals Analysis</h3>
                <div className="overflow-x-auto pb-4">
                  <div className="flex gap-6 min-w-max">
                    {bestRoute.traffic_signals.map((sig, idx) => (
                      <div key={idx} className="bg-white bg-opacity-80 rounded-xl p-6 shadow-lg backdrop-blur-sm border border-white border-opacity-30 min-w-[300px]">
                        <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                          🚦 Signal {sig.signal_id}
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{sig.vehicles}</div>
                              <div className="text-xs text-gray-600">Vehicles</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{sig.flow_per_min}</div>
                              <div className="text-xs text-gray-600">Flow/min</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-red-600">{sig.red_light_duration_sec}s</div>
                              <div className="text-xs text-gray-600">Red Light</div>
                            </div>
                          </div>

                          {/* Simple visual bars */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs w-16 text-gray-600">Traffic:</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${Math.min((sig.vehicles / 300) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs w-16 text-gray-600">Flow:</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${Math.min((sig.flow_per_min / 50) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs w-16 text-gray-600">Delay:</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                                  style={{ width: `${Math.min((sig.red_light_duration_sec / 120) * 100, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}