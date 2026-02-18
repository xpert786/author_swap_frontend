import React, { useState } from "react";
import { NavLink } from "react-router-dom";
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

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md flex items-center justify-between px-4 py-3">
        <img src={Logo} alt="Logo" className="h-8" />
        <button onClick={() => setIsOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

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
    w-72
    h-screen
    bg-[#2F6F6D33]
    fixed
    top-0
    left-0
    z-50
    transform transition-transform duration-300
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    lg:translate-x-0
  `}
      >
        <div className="flex items-center justify-between px-6 py-5 mb-6 mt-3">
          <img src={Logo} alt="Logo" className="h-10" />
          <button className="lg:hidden" onClick={() => setIsOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition text-lg font-semibold
                  ${isActive
                    ? "bg-[#1F4F4D] text-white"
                    : "hover:bg-slate-200 text-gray-800"
                  }`
                }
              >
                <Icon size={18} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* <div className="absolute bottom-6 left-0 w-full px-4">
          <button className="w-full flex items-center justify-center gap-2 rounded-2xl text-white py-3 hover:bg-slate-700 transition">
            <LogOut size={ 16 } /> Logout
          </button>
        </div> */}
      </aside>
    </>
  );
}
