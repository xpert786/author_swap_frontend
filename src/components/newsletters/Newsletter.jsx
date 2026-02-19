import React, { useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Download,
    ChevronDown,
    Edit2,
    Trash2,
    Eye,
    ClipboardList,
    Clock,
    CheckCircle2,
    BadgeCheck,
    Users,
    Globe
} from "lucide-react";
import { Publish } from "../icons";
import pendingSwapIcon from "../../assets/pendingswap.png";
import confirmedSwapIcon from "../../assets/confirmedswap.png";
import verifiedSentIcon from "../../assets/acceptedswap.png";
import newsIcon from "../../assets/newsicon.png";
import AddNewsSlot from "./AddNewsSlot";
import EditNewsSlot from "./EditNewsSlot";
import DeleteNewsSlot from "./DeleteNewsSlot";
import SlotDetails from "./SlotDetails";


const Newsletter = () => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const [visibility, setVisibility] = useState("All Visibility");
    const [status, setStatus] = useState("All Status");
    const [genre, setGenre] = useState("Genre");


    const openModal = () => setShowAddBook(true);
    const closeModal = () => setShowAddBook(false);
    const PendingSwapIcon = ({ size = 36 }) => (
        <img
            src={pendingSwapIcon}
            alt="Pending Swap"
            width={size}
            height={size}
        />
    );

    const ConfirmedSwapIcon = ({ size = 36 }) => (
        <img
            src={confirmedSwapIcon}
            alt="Confirmed Swap"
            width={size}
            height={size}
        />
    );

    const VerifiedSentIcon = ({ size = 36 }) => (
        <img
            src={verifiedSentIcon}
            alt="Verified Sent"
            width={size}
            height={size}
        />
    );

    const NewsIcon = ({ size = 36 }) => (
        <img
            src={newsIcon}
            alt="News"
            width={size}
            height={size}
        />
    );


    // Mock data for stats
    const stats = [
        { label: "Total", value: "33", icon: NewsIcon, color: "text-black", isCustom: true },
        { label: "Published Slots", value: "5", icon: Publish, color: "text-black", isCustom: true },
        { label: "Pending swap requests", value: "4", icon: PendingSwapIcon, color: "text-black" },
        { label: "Confirmed swaps", value: "12", icon: ConfirmedSwapIcon, color: "text-black" },
        { label: "Verified sent", value: "12", icon: VerifiedSentIcon, color: "text-black" },
    ];


    // Mock data for slots
    const slots = [
        {
            id: 1,
            time: "26 Jan 2026 10:00 AM EST",
            period: "Morning",
            genre: "Fantasy",
            partners: "0/3 Partners",
            visibility: "Public",
            audience: "12,450",
            status: "Available",
            statusColor: "text-green-600 bg-[#F0FDF4] border-green-100",
        },
        {
            id: 2,
            time: "2:30 PM EST",
            period: "Afternoon",
            genre: "Romance",
            partners: "3/3 Partners",
            visibility: "Friends Only",
            audience: "5,450",
            status: "Booked",
            statusColor: "text-[#D97706] bg-[#FEF3C7] border-amber-100",
        },
        {
            id: 3,
            time: "7:00 PM EST",
            period: "Evening",
            genre: "SciFi",
            partners: "1/3 Partners",
            visibility: "Public",
            audience: "1,598",
            status: "Available",
            statusColor: "text-green-600 bg-[#F0FDF4] border-green-100",
        },
    ];

    return (
        <div className="pb-10">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Newsletter & Slot Management</h1>
                <p className="text-gray-500 text-sm mt-1">Schedule, manage, and track your newsletter promotions</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex flex-col justify-between min-h-[120px] hover:shadow-md transition-shadow gap-8">
                        <div className="flex justify-between items-center">
                            {stat.isCustom ? (
                                <stat.icon size={36} />
                            ) : (
                                <div className={`rounded-lg ${stat.color}`}>
                                    <stat.icon size={36} />
                                </div>
                            )}
                            <span className="text-[12px] font-medium text-[#111827] text-right whitespace-nowrap uppercase tracking-wider">
                                {stat.label}
                            </span>
                        </div>
                        <div className="mt-2 text-2xl font-medium text-[#111827] tracking-tight">
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter & Action Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                <h2 className="text-lg font-bold text-gray-800">All Slots for October 4, 2025</h2>

                <div className="flex flex-wrap items-center gap-2">

                    {/* FILTER BUTTONS */}
                    <div className="flex items-center gap-2">

                        {/* GENRE */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setOpenDropdown(openDropdown === "genre" ? null : "genre")
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                {genre}
                                <ChevronDown
                                    size={14}
                                    className={`text-gray-400 transition-transform ${openDropdown === "genre" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {openDropdown === "genre" && (
                                <div className="absolute mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-50">
                                    {[
                                        "Select Genre",
                                        "Fantasy",
                                        "Scifi",
                                        "Romance",
                                        "Mystery",
                                        "Thriller",
                                        "Nonfiction",
                                    ].map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                setGenre(item);
                                                setOpenDropdown(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* VISIBILITY */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setOpenDropdown(openDropdown === "visibility" ? null : "visibility")
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                {visibility}
                                <ChevronDown
                                    size={14}
                                    className={`text-gray-400 transition-transform ${openDropdown === "visibility" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {openDropdown === "visibility" && (
                                <div className="absolute mt-2 w-44 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-50">
                                    {["Public", "Friend Only", "Private"].map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                setVisibility(item);
                                                setOpenDropdown(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* STATUS */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setOpenDropdown(openDropdown === "status" ? null : "status")
                                }
                                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                {status}
                                <ChevronDown
                                    size={14}
                                    className={`text-gray-400 transition-transform ${openDropdown === "status" ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {openDropdown === "status" && (
                                <div className="absolute mt-2 w-44 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-50">
                                    {["Available", "Booked", "Pending"].map((item) => (
                                        <button
                                            key={item}
                                            onClick={() => {
                                                setStatus(item);
                                                setOpenDropdown(null);
                                            }}
                                            className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                                        >
                                            {item}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>

                    {/* EXPORT BUTTON (UNCHANGED) */}
                    {/* EXPORT BUTTON */}
                    <div className="relative">
                        <button
                            onClick={() =>
                                setOpenDropdown(openDropdown === "export" ? null : "export")
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            <Download size={14} className="text-gray-400" />
                            Export with
                            <ChevronDown
                                size={14}
                                className={`text-gray-400 transition-transform ${openDropdown === "export" ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {openDropdown === "export" && (
                            <div className="absolute mt-2 w-44 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-50">
                                {["Google Calendar", "Outlook", "ICS"].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => {
                                            setOpenDropdown(null);
                                        }}
                                        className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>


                    {/* ADD SLOT BUTTON */}
                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 px-5 py-2 bg-[#1F4F4D] text-white rounded-lg text-[13px] font-black hover:bg-[#1a4341] transition-all shadow-lg shadow-[#1F4F4D]/20 active:scale-[0.98]"
                    >
                        <Plus size={16} />
                        Add New slot
                    </button>

                    <AddNewsSlot
                        isOpen={open}
                        onClose={() => setOpen(false)}
                        onSubmit={() => {
                            console.log("Slot Created");
                            setOpen(false);
                        }}
                    />

                </div>

            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">

                {/* ================= LEFT SIDE - CALENDAR ================= */}
                <div className="xl:sticky xl:top-2">
                    <div className="bg-white rounded-[28px] border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                    <ChevronLeft size={16} className="text-gray-400" />
                                </button>

                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">
                                    May 2024 Calendar
                                </h3>

                                <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                    <ChevronRight size={16} className="text-gray-400" />
                                </button>
                            </div>

                            <button className="text-[10px] font-black text-gray-400 hover:text-gray-800 transition-colors uppercase tracking-widest">
                                Today
                            </button>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div
                                    key={day}
                                    className="text-center py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest"
                                >
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 border-t border-l border-gray-50 rounded-lg overflow-hidden">
                            {Array.from({ length: 35 }).map((_, i) => {
                                const day = i - 4;
                                const isCurrentMonth = day > 0 && day <= 31;
                                const displayDay = isCurrentMonth
                                    ? day
                                    : day <= 0
                                        ? 30 + day
                                        : day - 31;

                                let bgColor = "bg-white";
                                if (day === 4) bgColor = "bg-[#FAD4C0]";
                                if (day === 16) bgColor = "bg-[#A7C0BD]";
                                if (day === 21) bgColor = "bg-[#96CEA5]";
                                if (day === 19) bgColor = "bg-[#FEF1D3]";

                                return (
                                    <div
                                        key={i}
                                        className={`aspect-square border-r border-b border-gray-50 p-1 flex flex-col items-end transition-all hover:bg-gray-50 cursor-pointer relative group ${bgColor}`}
                                    >
                                        <span
                                            className={`text-[10px] font-black ${isCurrentMonth
                                                ? 'text-gray-700'
                                                : 'text-gray-300'
                                                }`}
                                        >
                                            {displayDay < 10 ? `0${displayDay}` : displayDay}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="mt-8 grid grid-cols-2 gap-y-3 gap-x-2">
                            {[
                                { label: "Published slots", color: "bg-[#FAD4C0]" },
                                { label: "Confirmed Slots", color: "bg-[#96CEA5]" },
                                { label: "Pending slots", color: "bg-[#FEF1D3]" },
                                { label: "Verified slots", color: "bg-[#A7C0BD]" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-2">
                                    <div
                                        className={`w-2.5 h-2.5 rounded-sm ${item.color} shadow-sm flex-shrink-0`}
                                    />
                                    <span className="text-[9px] font-black text-gray-500 uppercase leading-none">
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-10">
                    {["Morning", "Afternoon", "Evening"].map((period) => (
                        <div key={period}>
                            <h3 className="text-[11px] font-black text-gray-400 mb-6 uppercase tracking-[0.2em]">
                                {period}
                            </h3>

                            <div className="space-y-4">
                                {slots.filter(s => s.period === period).map((slot) => (
                                    <div
                                        key={slot.id}
                                        className="bg-white rounded-2xl border border-gray-200 p-5 transition hover:shadow-md"
                                    >
                                        <div className="flex flex-col gap-4">

                                            {/* Top Row */}
                                            <div className="flex items-start justify-between">
                                                <h4 className="text-[15px] font-semibold text-gray-800">
                                                    {slot.time}
                                                </h4>

                                                <span
                                                    className={`px-3 py-1 text-[11px] font-medium rounded-full ${slot.statusColor}`}
                                                >
                                                    {slot.status}
                                                </span>
                                            </div>

                                            {/* Tags Row */}
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[11px] font-medium">
                                                    {slot.genre}
                                                </span>

                                                <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-[11px] font-medium flex items-center gap-1">
                                                    <Users size={12} />
                                                    {slot.partners}
                                                </span>

                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[11px] font-medium flex items-center gap-1">
                                                    <Globe size={12} />
                                                    {slot.visibility}
                                                </span>
                                            </div>

                                            {/* Audience + Action */}
                                            <div className="flex items-end justify-between pt-3 border-t border-gray-100">

                                                {/* Audience */}
                                                <div>
                                                    <p className="text-[12px] text-gray-500">Audience:</p>
                                                    <p className="text-[16px] font-semibold text-gray-900">
                                                        {slot.audience}
                                                    </p>
                                                </div>

                                                {/* Action Button */}
                                                <div>
                                                    {slot.status === "Available" ? (
                                                        <div className="flex gap-2">
                                                            <button onClick={() => setEditOpen(true)}
                                                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                                                <Edit2 size={14} className="text-gray-600" />
                                                            </button>
                                                            <button onClick={() => setDeleteOpen(true)} className="p-2 bg-gray-100 hover:bg-red-100 rounded-lg transition">
                                                                <Trash2 size={14} className="text-red-500" />
                                                            </button>

                                                            <EditNewsSlot
                                                                isOpen={editOpen}
                                                                onClose={() => setEditOpen(false)}
                                                                onSave={(data) => {
                                                                    console.log(data);
                                                                    setEditOpen(false);
                                                                }}
                                                            />

                                                            <DeleteNewsSlot
                                                                isOpen={deleteOpen}
                                                                onClose={() => setDeleteOpen(false)}
                                                                onConfirm={() => {
                                                                    console.log("Deleted");
                                                                    setDeleteOpen(false);
                                                                }}
                                                                slotName="The Midnight Garden"
                                                            />
                                                        </div>


                                                    ) : (
                                                        <>
                                                            <button onClick={() => setDetailsOpen(true)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                                                <Eye size={14} className="text-gray-600" />
                                                            </button>

                                                            <SlotDetails
                                                                isOpen={detailsOpen}
                                                                onClose={() => setDetailsOpen(false)}
                                                                onEdit={() => {
                                                                    console.log("Go to edit");
                                                                    setDetailsOpen(false);
                                                                }}
                                                            /></>
                                                    )}

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                        </div>
                    ))}
                </div>

            </div>

        </div>
    );
};

export default Newsletter;
