import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";

export default function MainLayout() {
  return (
    <div className="h-screen overflow-hidden bg-gray-100">
      
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Right Side */}
      <div className="ml-72 flex flex-col h-full">
        
        {/* Fixed Header */}
        <Header />

        {/* Scrollable Content Area */}
        <main className="mt-20 flex-1 overflow-y-auto bg-white p-6">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
