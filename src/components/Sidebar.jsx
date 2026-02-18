import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard, BookOpen, Mail, Users, BarChart3, Award, LogOut } from "lucide-react";
import Logo from "../assets/logo.png";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Books Management", path: "/books", icon: BookOpen },
  { name: "Newsletter Slot", path: "/newsletter", icon: Mail },
  { name: "Swap Partner", path: "/swap-partner", icon: Users },
  { name: "Swap Management", path: "/swap-management", icon: Users },
  { name: "Communication Tools", path: "/communication", icon: Mail },
  { name: "Subscriber & Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Author Reputation", path: "/reputation", icon: Award },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          w-64 md:w-72
          bg-[#EBF1F0]
          min-h-screen
          flex-shrink-0
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
          lg:translate-x-0
          fixed lg:static
          top-0 left-0 z-50
          border-r border-gray-100
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 mb-6 mt-3">
          <img src={Logo} alt="Logo" className="h-6 md:h-10" />
          <button className="lg:hidden p-1 hover:bg-black/5 rounded-full" onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            // Keep Swap Partner active for both /swap-partner and /swap-details
            const extraActive =
              item.path === "/swap-partner" &&
              location.pathname.startsWith("/swap-details");
            return (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-[15px] font-semibold active:scale-[0.98] group relative
                  ${isActive || extraActive
                    ? "bg-[#1F4F4D] text-white shadow-md shadow-[#1F4F4D]/20 z-10"
                    : "hover:bg-[#1F4F4D]/5 text-gray-700 hover:text-[#1F4F4D] active:bg-[#1F4F4D]/10"
                  }`
                }
              >
                {({ isActive }) => {
                  const isReallyActive = isActive || extraActive;
                  return (
                    <>
                      {/* Active Indicator Dot */}
                      <div className={`absolute left-0 w-1.5 h-1.5 rounded-full bg-white transition-all duration-300 ${isReallyActive ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />

                      <Icon size={14} className={`transition-transform duration-200 group-hover:scale-110 ${isReallyActive ? "" : "text-gray-400 group-hover:text-[#1F4F4D]"}`} />
                      <span className="relative z-10">{item.name}</span>
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-4">
          <button className="w-full flex items-center justify-center gap-2 rounded-2xl text-white py-2.5 bg-slate-800 hover:bg-slate-700 transition text-[15px] font-semibold shadow-lg shadow-black/10">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
