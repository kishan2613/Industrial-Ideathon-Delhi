import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing";
import Main from "../pages/Main";
import Dashboard from "../pages/Dashboard";
import Fleet from "../pages/Fleet";
import Track from "../pages/Livetracking";


function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Main Layout with Sidebar */}
        <Route path="/home" element={<Main />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="fleetbook" element={<Fleet />} />
          <Route path="livetracking" element={<Track />} />       
        </Route>

    
      </Routes>
    </Router>
  );
}

export default App;
