import Sidebar from "../components/main/Sidebar";
import { Outlet } from "react-router-dom";

export default function Main() {
  return (
    <div className="h-screen flex bg-white text-black overflow-hidden">
      {/* Sidebar (fixed height, does not scroll) */}
      <Sidebar />

      {/* Right content area scrolls */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
