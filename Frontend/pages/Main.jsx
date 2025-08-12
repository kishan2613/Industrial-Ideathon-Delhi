import Sidebar from "../src/Leftbar";
import { Outlet } from "react-router-dom";

export default function Main() {
  return (
    <div className="h-screen flex bg-white text-black overflow-hidden">
      {/* Sidebar (fixed height, does not scroll) */}
      <Sidebar />

      {/* Right content area scrolls */}
      <main className="flex-1 pl-2 pt-1 pr-2  overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
