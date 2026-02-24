import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { X, LayoutDashboard, BookOpen, Mail, Users, BarChart3, Award } from "lucide-react";
import { LogoutIcon } from "./icons";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import NewLetterIconImg from '../assets/news-sidebar.png'
import SwapPartnerIconImg from '../assets/swap-parter.png'
import SwapManagementIconImg from '../assets/swap-manegement.png'
import CommunicationIconImg from '../assets/communication-tools.png'
import SubscribeIconImg from '../assets/subscribe.png'
import ReputationIconImg from '../assets/repotation.png'
import DashboardIconImg from '../assets/dashboard.png'
import BookManegementIconImg from '../assets/open-book.png'


export default function Sidebar({ isOpen, setIsOpen }) {
  const location = useLocation();
  const navigate = useNavigate();

  const NewLetterIcon = ({ size, isActive, className }) => {
    return (
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        <img
          src={NewLetterIconImg}
          alt="Newsletter Slot"
          style={{
            width: size,
            height: size,
            filter: isActive ? 'brightness(0) invert(1)' : 'none',
            objectFit: 'contain'
          }}
          className={className}
        />
      </div>
    )
  }

  const SwapPartnerIcon = ({ size, isActive, className }) => {
    return (
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        <img
          src={SwapPartnerIconImg}
          alt="Swap Partner"
          style={{
            width: "26px",
            height: "27px",
            filter: isActive ? 'brightness(0) invert(1)' : 'none',
            objectFit: 'contain'
          }}
          className={className}
        />
      </div>
    )
  }

  const SwapManagementIcon = ({ size, isActive, className }) => {
    return (
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        <img
          src={SwapManagementIconImg}
          alt="Swap Management"
          style={{
            width: "37px",
            height: "29px",
            filter: isActive ? 'brightness(0) invert(1)' : 'none',
          }}
          className={className}
        />
      </div>
    )
  }

  const CommunicationIcon = ({ size, isActive, className }) => {
    return (
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        <img
          src={CommunicationIconImg}
          alt="Communication Tools"
          style={{
            width: "31px",
            height: "29px",
            filter: isActive ? 'brightness(0) invert(1)' : 'none',
            objectFit: 'contain'
          }}
          className={className}
        />
      </div>
    )
  }
  const SubscribeIcon = ({ size, isActive, className }) => {
    return (
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        <img
          src={SubscribeIconImg}
          alt="Subscriber & Analytics"
          style={{
            width: "32px",
            height: "24px",
            filter: isActive ? 'brightness(0) invert(1)' : 'none',
            objectFit: 'contain'
          }}
          className={className}
        />
      </div>
    )
  }

  const ReputationIcon = ({ size, isActive, className }) => {
    return (
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        <img
          src={ReputationIconImg}
          alt="Author Reputation"
          style={{
            width: "23px",
            height: "21px",
            filter: isActive ? 'brightness(0) invert(1)' : 'none',
            objectFit: 'contain'
          }}
          className={className}
        />
      </div>
    )
  }
  const BookManegementIcon = ({ size, isActive, className }) => {
    return (
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        <img
          src={BookManegementIconImg}
          alt="Books Management"
          style={{
            width: "26px",
            height: "30px",
            filter: isActive ? 'brightness(0) invert(1)' : 'none',
          }}
          className={className}
        />
      </div>
    )
  }

  const DashboardIcon = ({ size, isActive, className }) => {
    return (
      <div className="w-6 h-6 flex items-center justify-center shrink-0">
        <img
          src={DashboardIconImg}
          alt="Dashboard"
          style={{
            width: size,
            height: size,
            filter: isActive ? 'brightness(0) invert(1)' : 'none',
            objectFit: 'contain'
          }}
          className={className}
        />
      </div>
    )
  }


  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: DashboardIcon },
    { name: "Books Management", path: "/books", icon: BookManegementIcon },
    { name: "Newsletter Slot", path: "/newsletter", icon: NewLetterIcon },
    { name: "Swap Partner", path: "/swap-partner", icon: SwapPartnerIcon },
    { name: "Swap Management", path: "/swap-management", icon: SwapManagementIcon },
    { name: "Communication Tools", path: "/communication-list", icon: CommunicationIcon },
    { name: "Subscriber & Analytics", path: "/subscription", icon: SubscribeIcon },
    { name: "Author Reputation", path: "/reputation", icon: ReputationIcon },
  ];

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
                    ? "bg-[#1F4F4D] text-white rounded-[8px] shadow-md shadow-[#1F4F4D]/20 z-10"
                    : "hover:bg-[#1F4F4D]/5 text-[#111827] hover:text-[#1F4F4D] active:bg-[#1F4F4D]/10"
                  }`
                }
              >
                {({ isActive }) => {
                  const isReallyActive = isActive || extraActive;
                  return (
                    <>
                      <Icon
                        size={18}
                        isActive={isReallyActive}
                        className={`transition-all duration-200 group-hover:scale-110 block`}
                      />
                      <span className="relative z-10">{item.name}</span>
                    </>
                  );
                }}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 mt-auto mb-6">
          <button onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("isprofilecompleted");
            navigate("/login");
          }} className="w-full flex items-center gap-3 rounded-xl py-3 px-6 transition-all duration-200 text-[15px] font-semibold text-[#111827] cursor-pointer border border-[#2F6F6D] rounded-[8px]">
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <LogoutIcon size={18} color="#111827" />
            </div>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
