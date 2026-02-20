import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { X, LayoutDashboard, BookOpen, Mail, Users, BarChart3, Award } from "lucide-react";
import { LogoutIcon } from "./icons";
import Logo from "../assets/logo.png";

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Books Management", path: "/books", icon: BookOpen },
  { name: "Newsletter Slot", path: "/newsletter", icon: Mail },
  { name: "Swap Partner", path: "/swap-partner", icon: Users },
  { name: "Swap Management", path: "/swap-management", icon: Users },
  { name: "Communication Tools", path: "/communication-list", icon: Mail },
  { name: "Subscriber & Analytics", path: "/subscription", icon: BarChart3 },
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
          h-screen
          fixed
          top-0
          left-0
          z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0 shadow-2xl lg:shadow-none" : "-translate-x-full"}
          border-r border-gray-100
          flex flex-col
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 mb-6 mt-2">
          <img src={Logo} alt="Logo" className="h-6 md:h-10" />
          <button className="lg:hidden p-1 hover:bg-black/5 rounded-full" onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const extraActive =
              item.path === "/swap-partner" &&
              location.pathname.startsWith("/swap-details");
            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-[15px] font-semibold active:scale-[0.98] group relative
                  ${isActive || extraActive
                    ? "bg-[#1F4F4D] text-white shadow-md shadow-[#1F4F4D]/20 z-10"
                    : "hover:bg-[#1F4F4D]/5 text-[#111827] hover:text-[#1F4F4D] active:bg-[#1F4F4D]/10"
                  }`
                }
              >
                {({ isActive }) => {
                  const isReallyActive = isActive || extraActive;
                  return (
                    <>
                      <Icon size={14} className={`transition-transform duration-200 group-hover:scale-110 ${isReallyActive ? "" : "text-[#111827] group-hover:text-[#1F4F4D]"}`} />
                      <span className="relative z-10">{item.name}</span>
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>

        {/* <div className="px-4 mt-auto mb-6">
          <button className="w-full flex items-center gap-3 rounded-xl py-3 px-6 transition-all duration-200 text-[15px] font-semibold text-[#111827]" style={{ border: "1px solid rgba(47, 111, 109, 1)", background: "transparent" }}>
            <LogoutIcon size={16} color="#111827" /> Logout
          </button>
        </div> */}
      </aside>
    </>
  );
}
