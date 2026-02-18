import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiUser, FiLogOut, FiMenu } from "react-icons/fi";
import { TbBell } from "react-icons/tb";
import { GoChevronDown, GoChevronUp } from "react-icons/go";

export default function Header({ onMenuClick }) {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    return (
<<<<<<< HEAD
     <div className="fixed top-0 left-72 right-0 bg-white shadow-sm px-6 py-4 flex items-center justify-between z-40">git 
            {/* Left Side */ }
            <div className="flex items-center gap-4">
                <button className="bg-gray-100 p-2 rounded-full">
                    ←
=======
        <div className="w-full bg-white border-b border-gray-100 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-40">
            {/* Left Side */}
            <div className="flex items-center gap-2 md:gap-4">
                {/* Mobile Menu Icon */}
                <button
                    onClick={onMenuClick}
                    className="md:hidden flex items-center justify-center bg-[rgba(224,122,95,0.2)] text-[#E07A5F] w-14 h-12 rounded-xl"
                >
                    <FiMenu size={24} />
>>>>>>> 54ed8caf3ce4fbe525ad720ef277ed8773758347
                </button>

                {/* Back Button - Visible on all screens */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors w-9 h-9 md:w-10 md:h-10 rounded-full text-gray-700 shrink-0"
                    aria-label="Back"
                >
                    <FiArrowLeft size={16} md:size={18} />
                </button>

                {/* Search - Visible on all screens with more spacing on mobile */}
                <div className="relative max-w-[260px] w-full min-w-[120px] mx-2 md:mx-0">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-[#1F4F4D] transition-all"
                    />
                </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-3 md:gap-5">
                {/* Notification Bell */}
                <div className="bg-[rgba(224,122,95,0.2)] p-2.5 md:p-2.5 rounded-full md:rounded-lg relative cursor-pointer hover:bg-[rgba(224,122,95,0.3)] transition-colors">
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
                                    // Handle logout
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
