import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiUser, FiLogOut, FiMenu, FiSearch } from "react-icons/fi";
import { TbBell } from "react-icons/tb";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { LayoutDashboard, BookOpen, Mail, Users, BarChart3, Award } from "lucide-react";
import { getProfile } from "../apis/profile";

import { useNotifications } from "../context/NotificationContext";
import { useProfile } from "../context/ProfileContext";

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

export default function Header({ onMenuClick, isOpen, onToggle }) {
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);
    const { profile } = useProfile();

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim()) {
            const filtered = menuItems.filter(item =>
                item.name.toLowerCase().includes(query.toLowerCase())
            );
            setSuggestions(filtered);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (path) => {
        navigate(path);
        setSearchQuery("");
        setSuggestions([]);
        setIsSearchFocused(false);
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
        <div className={`fixed top-0 right-0 bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between z-40 transition-all duration-300 ${isOpen ? "left-0 lg:left-72" : "left-0 lg:left-20"}`}>
            {/* Left Side */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Sidebar Toggle Button */}
                <button
                    onClick={onToggle}
                    className="flex items-center justify-center transition-all hover:opacity-80 shrink-0"
                    aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="34" height="34" rx="7.5" stroke="#2F6F6D" />
                        <path
                            d={isOpen
                                ? "M11.3125 10.5996C11.5015 10.5996 11.6828 10.675 11.8164 10.8086C11.95 10.9422 12.0254 11.1235 12.0254 11.3125V23.6875C12.0254 23.8765 11.95 24.0578 11.8164 24.1914C11.6828 24.325 11.5015 24.4004 11.3125 24.4004C11.1235 24.4004 10.9422 24.325 10.8086 24.1914C10.675 24.0578 10.5996 23.8765 10.5996 23.6875V11.3125L10.6143 11.1729C10.6416 11.0359 10.7084 10.9088 10.8086 10.8086C10.9422 10.675 11.1235 10.5996 11.3125 10.5996ZM18.625 11.7246C18.7186 11.7246 18.811 11.7435 18.8975 11.7793C18.9839 11.8151 19.0627 11.8674 19.1289 11.9336C19.1951 11.9998 19.2474 12.0786 19.2832 12.165C19.319 12.2515 19.3379 12.3439 19.3379 12.4375C19.3379 12.5311 19.319 12.6235 19.2832 12.71C19.2474 12.7964 19.1951 12.8752 19.1289 12.9414L15.2832 16.7871H24.25C24.439 16.7871 24.6203 16.8625 24.7539 16.9961C24.8875 17.1297 24.9629 17.311 24.9629 17.5C24.9629 17.689 24.8875 17.8703 24.7539 18.0039C24.6203 18.1375 24.439 18.2129 24.25 18.2129H15.2832L19.1289 22.0586C19.1951 22.1248 19.2474 22.2036 19.2832 22.29C19.319 22.3765 19.3379 22.4689 19.3379 22.5625C19.3379 22.6561 19.319 22.7485 19.2832 22.835C19.2474 22.9214 19.1951 23.0002 19.1289 23.0664C19.0627 23.1326 18.9839 23.1849 18.8975 23.2207C18.811 23.2565 18.7186 23.2754 18.625 23.2754C18.5314 23.2754 18.439 23.2565 18.3525 23.2207C18.2661 23.1849 18.1873 23.1326 18.1211 23.0664L13.0586 18.0039C12.9924 17.9377 12.9401 17.8589 12.9043 17.7725C12.8685 17.686 12.8496 17.5936 12.8496 17.5C12.8496 17.4064 12.8685 17.314 12.9043 17.2275C12.9401 17.1411 12.9924 17.0623 13.0586 16.9961L18.1211 11.9336C18.1873 11.8674 18.2661 11.8151 18.3525 11.7793C18.439 11.7435 18.5314 11.7246 18.625 11.7246Z"
                                : "M23.6875 10.5996C23.4985 10.5996 23.3172 10.675 23.1836 10.8086C23.05 10.9422 22.9746 11.1235 22.9746 11.3125V23.6875C22.9746 23.8765 23.05 24.0578 23.1836 24.1914C23.3172 24.325 23.4985 24.4004 23.6875 24.4004C23.8765 24.4004 24.0578 24.325 24.1914 24.1914C24.325 24.0578 24.4004 23.8765 24.4004 23.6875V11.3125L24.3857 11.1729C24.3584 11.0359 24.2916 10.9088 24.1914 10.8086C24.0578 10.675 23.8765 10.5996 23.6875 10.5996ZM16.375 11.7246C16.2814 11.7246 16.189 11.7435 16.1025 11.7793C16.0161 11.8151 15.9373 11.8674 15.8711 11.9336C15.8049 11.9998 15.7526 12.0786 15.7168 12.165C15.681 12.2515 15.6621 12.3439 15.6621 12.4375C15.6621 12.5311 15.681 12.6235 15.7168 12.71C15.7526 12.7964 15.8049 12.8752 15.8711 12.9414L19.7168 16.7871H10.75C10.561 16.7871 10.3797 16.8625 10.2461 16.9961C10.1125 17.1297 10.0371 17.311 10.0371 17.5C10.0371 17.689 10.1125 17.8703 10.2461 18.0039C10.3797 18.1375 10.561 18.2129 10.75 18.2129H19.7168L15.8711 22.0586C15.8049 22.1248 15.7526 22.2036 15.7168 22.29C15.681 22.3765 15.6621 22.4689 15.6621 22.5625C15.6621 22.6561 15.681 22.7485 15.7168 22.835C15.7526 22.9214 15.8049 23.0002 15.8711 23.0664C15.9373 23.1326 16.0161 23.1849 16.1025 23.2207C16.189 23.2565 16.2814 23.2754 16.375 23.2754C16.4686 23.2754 16.561 23.2565 16.6475 23.2207C16.7339 23.1849 16.8127 23.1326 16.8789 23.0664L21.9414 18.0039C22.0076 17.9377 22.0599 17.8589 22.0957 17.7725C22.1315 17.686 22.1504 17.5936 22.1504 17.5C22.1504 17.4064 22.1315 17.314 22.0957 17.2275C22.0599 17.1411 22.0076 17.0623 21.9414 16.9961L16.8789 11.9336C16.8127 11.8674 16.7339 11.8151 16.6475 11.7793C16.561 11.7435 16.4686 11.7246 16.375 11.7246Z"}
                            fill="#2F6F6D"
                            stroke="#2F6F6D"
                            strokeWidth="0.3"
                        />
                    </svg>
                </button>
                {/* Search - Responsive sizing to prevent layout blowout */}
                <div className="relative w-full max-w-[400px] md:max-w-[500px] lg:max-w-[650px] mx-2 md:mx-0" ref={searchRef}>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onFocus={() => setIsSearchFocused(true)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-9 pr-4 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all"
                        />
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>

                    {/* Suggestions Dropdown */}
                    {isSearchFocused && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 py-1">
                            {suggestions.map((item, index) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(item.path)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-[#1F4F4D]">
                                            <Icon size={14} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 md:gap-5">
                {/* Notification Bell */}
                <div
                    onClick={() => navigate("/notifications")}
                    className="bg-[#2F6F6D33] p-2 rounded-lg relative cursor-pointer"
                >
                    <TbBell className="text-lg md:text-2xl text-[#1F4F4D]" />
                    {unreadCount > 0 && (
                        <span className="flex absolute -top-1 -right-1 bg-[#FF0000] text-white text-[9px] font-bold rounded-full w-4 h-4 items-center justify-center border-2 border-white">
                            {unreadCount}
                        </span>
                    )}
                </div>

                {/* Profile Section */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        className="flex items-center gap-2 md:gap-3 cursor-pointer group"
                        onClick={toggleDropdown}
                    >
                        <img
                            src={
                                profile?.profile_picture ||
                                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
                            }
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-[#E07A5F33] transition-all shrink-0"
                        />

                        {/* Text + Arrow wrapper */}
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex flex-col">
                                <p className="text-sm font-bold text-gray-900 leading-tight">
                                    {((profile?.pen_name || profile?.name || profile?.username || "User")
                                        .split(",")[0].trim())
                                        .toLowerCase()
                                        .replace(/\b\w/g, char => char.toUpperCase())}
                                </p>
                                <p className="text-[11px] text-gray-500">
                                    {profile?.primary_genre
                                        ? `${profile.primary_genre
                                            .split(",")[0]
                                            .trim()
                                            .split("_")
                                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                            .join(" ")} Author`
                                        : "Author"}
                                </p>
                            </div>

                            {isDropdownOpen ? (
                                <GoChevronUp className="text-gray-400 text-lg" />
                            ) : (
                                <GoChevronDown className="text-gray-400 text-lg group-hover:text-gray-600 transition-colors" />
                            )}
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div
                            className="absolute right-0 top-full mt-2 w-44 bg-white border border-gray-200 rounded-[6px] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-2 z-50"
                        >
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    navigate("/account-settings");
                                }}
                                className="w-full px-4 py-2 text-[15px] text-[#001524] hover:bg-[#FFF9F7] rounded-lg transition-all text-left font-medium"
                            >
                                Profile Setting
                            </button>
                            <button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    localStorage.removeItem("isprofilecompleted");
                                    setIsDropdownOpen(false);
                                    navigate("/login");
                                }}
                                className="w-full px-4 py-2 text-[15px] text-[#001524] hover:bg-[#FFF9F7] rounded-lg transition-all text-left font-medium"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
