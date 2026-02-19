import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Right Side */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-72 h-full">
        {/* Fixed Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Scrollable Content Area */}
        <main className="mt-[72px] flex-1 overflow-y-auto bg-white p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
