import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="h-screen overflow-hidden bg-white flex">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Right Side */}
      <div
        className={`flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ${isSidebarOpen ? "lg:ml-72" : "lg:ml-20"}`}
      >
        {/* Fixed Header */}
        <Header
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Scrollable Content Area */}
        <main className="mt-[72px] flex-1 overflow-y-auto bg-white p-4 md:p-6 px-4 md:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
