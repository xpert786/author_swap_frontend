import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Header Always Visible */}
        <Header />

        {/* Page Content Changes */}
        <div className="flex-1 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
