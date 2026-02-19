import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiUser, FiLogOut, FiMenu, FiSearch } from "react-icons/fi";
import { TbBell } from "react-icons/tb";
import { GoChevronDown, GoChevronUp } from "react-icons/go";
import { LayoutDashboard, BookOpen, Mail, Users, BarChart3, Award } from "lucide-react";

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
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

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
        <div className={`fixed top-0 right-0 bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between z-40 transition-all duration-300 ${isOpen ? "left-0 lg:left-72" : "left-0"}`}>
            {/* Left Side */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Mobile Menu Icon */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden flex items-center justify-center bg-[rgba(224,122,95,0.2)] text-[#E07A5F] w-12 h-10 md:w-14 md:h-12 rounded-xl"
                >
                    <FiMenu size={24} />
                </button>

                {/* Sidebar Toggle Button */}
                <button
                    onClick={onToggle}
                    className="flex items-center justify-center transition-all hover:opacity-80 shrink-0"
                    aria-label={isOpen ? "Close Sidebar" : "Open Sidebar"}
                >
                    <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="35" height="35" rx="8" fill="#2F6F6D" fillOpacity="0.2" />
                        <path d="M12.25 21.25H22.75M12.25 17.5H22.75M12.25 13.75H22.75" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Search - Visible on all screens with more spacing on mobile */}
                <div className="relative max-w-[260px] w-full min-w-[120px] mx-2 md:mx-0" ref={searchRef}>
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
                    className="bg-[rgba(224,122,95,0.2)] p-2.5 md:p-2.5 rounded-full md:rounded-lg relative cursor-pointer hover:bg-[rgba(224,122,95,0.3)] transition-colors"
                >
                    <TbBell className="text-xl md:text-2xl text-[#E07A5F] md:text-[#1F4F4D]" />
                    <span className="hidden md:flex absolute -top-1.5 -right-1.5 bg-[#E07A5F] text-white text-[10px] font-bold rounded-full w-5 h-5 items-center justify-center border-2 border-white">
                        10
                    </span>
                </div>

                {/* Profile Section */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        className="flex items-center gap-2 md:gap-3 cursor-pointer group"
                        onClick={toggleDropdown}
                    >
                        <img
                            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100"
                            alt="profile"
                            className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-[#E07A5F33] transition-all shrink-0"
                        />

                        {/* Text + Arrow wrapper */}
                        <div className="flex items-center gap-2">
                            <div className="hidden md:flex flex-col">
                                <p className="text-sm font-bold text-gray-900 leading-tight">Jane Doe</p>
                                <p className="text-[11px] text-gray-500">Fantasy Author</p>
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
                            className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl py-2 z-50 transform origin-top-right transition-all duration-200"
                            style={{ filter: "drop-shadow(0 20px 25px rgb(0 0 0 / 0.1))" }}
                        >
                            <div className="px-4 py-2 border-b border-gray-50 mb-1 lg:hidden">
                                <p className="text-xs font-bold text-gray-900">Jane Doe</p>
                                <p className="text-[10px] text-gray-500">Fantasy Author</p>
                            </div>
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    navigate("/account-settings");
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[13.5px] text-gray-700 hover:bg-[rgba(224,122,95,0.05)] hover:text-[#E07A5F] transition-all text-left font-medium group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#E07A5F]/10 transition-colors">
                                    <FiUser className="text-gray-400 group-hover:text-[#E07A5F]" />
                                </div>
                                Profile Setting
                            </button>
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    navigate("/login");
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[13.5px] text-gray-700 hover:bg-[rgba(224,122,95,0.05)] hover:text-[#E07A5F] transition-all text-left font-medium group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-[#E07A5F]/10 transition-colors">
                                    <FiLogOut className="text-gray-400 group-hover:text-[#E07A5F]" />
                                </div>
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
