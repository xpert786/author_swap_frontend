import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { PartnersIcon, PublicIcon } from "../../icons";
import SwapRequest from "./SwapRequest";
import "./SwapPartner.css";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const partners = [
    {
        id: 1,
        name: "Jane Doe",
        swaps: 42,
        status: "Available",
        genre: "Fantasy",
        partners: "2/3 Partners",
        visibility: "Public",
        date: "26 Jan 2026",
        time: "10:50 EST",
        audience: "15,000",
        paid: false,
        photo: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
        id: 2,
        name: "John Smith",
        swaps: 30,
        status: "Available",
        genre: "Romance",
        partners: "1/2 Partners",
        visibility: "Private",
        date: "15 Feb 2026",
        time: "11:30 EST",
        audience: "12,000",
        paid: true,
        paidAmount: "$20.00",
        photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
        id: 3,
        name: "Alice Johnson",
        swaps: 25,
        status: "Available",
        badge: "Genre-Specific",
        genre: "Romance",
        partners: "1/1 Partners",
        visibility: "Public",
        date: "12 Mar 2026",
        time: "09:15 EST",
        audience: "10,000",
        paid: false,
        photo: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        id: 4,
        name: "Jane Doe",
        swaps: 42,
        status: "Available",
        genre: "Fantasy",
        partners: "2/3 Partners",
        visibility: "Public",
        date: "26 Jan 2026",
        time: "10:50 EST",
        audience: "15,000",
        paid: false,
        photo: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
        id: 5,
        name: "Emily White",
        swaps: 50,
        status: "Available",
        genre: "Mystery",
        partners: "3/4 Partners",
        visibility: "Public",
        date: "5 Mar 2026",
        time: "14:00 EST",
        audience: "20,000",
        paid: false,
        photo: "https://randomuser.me/api/portraits/women/22.jpg",
    },
    {
        id: 6,
        name: "Alice Johnson",
        swaps: 25,
        status: "Available",
        genre: "Romance",
        partners: "1/4 Partners",
        visibility: "Public",
        date: "12 Mar 2026",
        time: "09:15 EST",
        audience: "10,000",
        paid: false,
        photo: "https://randomuser.me/api/portraits/women/55.jpg",
    },
];

// ─── Partner Card ─────────────────────────────────────────────────────────────
const PartnerCard = ({ partner, isSelected, onClick, onSendRequest }) => {
    const navigate = useNavigate();

    // Status badges logic based on image
    const getBadges = () => {
        const badges = [];
        if (partner.paid) {
            badges.push({ text: partner.paidAmount, bg: "bg-[#E8E8E8]" });
            badges.push({ text: "Paid", bg: "bg-[#16A34A33]" });
        }
        if (partner.badge) {
            badges.push({ text: partner.badge, bg: "bg-[#E8E8E8]" });
        }
        badges.push({ text: "Available", bg: "bg-[#16A34A33]" });
        return badges;
    };

    return (
        <div
            className="bg-white rounded-[10px] p-5 flex flex-col gap-5 cursor-pointer 
               transition-all duration-200 border border-[#B5B5B5] 
               hover:border-[#E07A5F] relative"
            onClick={onClick}
        >
            {/* ── Header Row ── */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2">

    {/* Left Section */}
    <div className="flex items-start gap-3">
        <img
            src={partner.photo}
            alt={partner.name}
            className="w-10 h-10 rounded-full object-cover shrink-0"
        />

        <div>
            {/* Name + Swaps in column */}
            <p className="text-[14px] font-medium text-black leading-none">
                {partner.name}
            </p>
            <p className="text-[10px] text-[#374151] mt-1">
                {partner.swaps} swaps completed
            </p>
        </div>
    </div>

    {/* Badges */}
    <div className="flex flex-wrap gap-1 mt-2 lg:mt-0">
        {getBadges().map((b, i) => (
            <span
                key={i}
                className={`${b.bg} text-black text-[10px] font-medium px-2 py-0.5 rounded-full`}
            >
                {b.text}
            </span>
        ))}
    </div>

</div>

            {/* ── Tags Row ── */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#EBF5EE] text-black text-[10px] font-medium px-3 py-0.5 rounded-full">
                    {partner.genre}
                </span>
                <span className="inline-flex items-center gap-1 bg-[#FDECE8] text-black text-[10px] font-medium px-3 py-0.5 rounded-full">
                    <PartnersIcon size={12} /> {partner.partners}
                </span>
                <span className="inline-flex items-center gap-1 bg-[#E8E8E8] text-black text-[10px] font-medium px-3 py-0.5 rounded-full">
                    <PublicIcon size={12} /> {partner.visibility}
                </span>
            </div>

            {/* ── Data Grid ── */}
            <div className="grid grid-cols-3 gap-1 py-1">
                <div className="space-y-1">
                    <p className="text-[11px] text-[#111827] font-medium">Date</p>
                    <p className="text-[12px] font-medium text-[#111827]">
                        {partner.date}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[11px] text-[#111827] font-medium">Time</p>
                    <p className="text-[12px] font-medium text-[#111827]">
                        {partner.time}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[11px] text-[#111827] font-medium">Audience</p>
                    <p className="text-[12px] font-medium text-[#111827]">
                        {partner.audience}
                    </p>
                </div>
            </div>

            {/* ── Action Buttons ── */}
            <div className="flex gap-2 mt-auto pt-1">
                <button
                    className="flex-1 px-2 py-[8px] border border-[#B5B5B5] rounded-[8px] 
                       transition-all text-[11px] font-medium
                       bg-white text-black 
                       hover:bg-[#2F6F6D] hover:text-white hover:border-[#2F6F6D]"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate("/swap-details", {
                            state: {
                                name: partner.name,
                                photo: partner.photo,
                                swaps: partner.swaps,
                            },
                        });
                    }}
                >
                    View Details
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSendRequest();
                    }}
                    className={`flex-1 px-2 py-[8px] border border-[#B5B5B5] rounded-[8px] 
                transition-all text-[11px] font-medium
                ${partner.paid
                            ? "bg-[#2F6F6D] text-white border-[#2F6F6D]"
                            : "bg-white text-black hover:bg-gray-50"
                        }
            `}
                >
                    {partner.paid ? "Request Paid Swaps" : "Send Request"}
                </button>
            </div>
        </div>
    );
};

// ─── Filter Dropdown ──────────────────────────────────────────────────────────
const FilterDropdown = ({ label, options }) => {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(null);
    const ref = React.useRef(null);

    React.useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                className="flex items-center gap-2 px-4 py-1.5 border border-[#B5B5B5] rounded-lg bg-white text-[13px] text-black font-medium cursor-pointer whitespace-nowrap transition-all hover:bg-gray-50"
                onClick={() => setOpen((o) => !o)}
            >
                {selected || label}
                <FiChevronDown
                    size={14}
                    style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                    }}
                />
            </button>

            {open && (
                <div className="absolute top-[calc(100%+6px)] right-0 md:left-0 min-w-[170px] bg-white border border-[#B5B5B5] rounded-lg shadow-xl z-[100] py-2">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className={`px-5 py-2.5 text-sm text-black cursor-pointer transition-colors hover:bg-gray-100 ${selected === opt ? "text-[#2F6F6D] font-semibold bg-green-50" : ""
                                }`}
                            onClick={() => {
                                setSelected(opt === selected ? null : opt);
                                setOpen(false);
                            }}
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const SwapPartner = () => {
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(1); // Default highlight first card
    const [isRequestOpen, setIsRequestOpen] = useState(false);

    const filtered = partners.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen pb-10 bg-white">
            {/* Header Section */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Swap Partner</h1>
                <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">Find places to promote your book</p>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-10">
                {/* Search Input */}
                <div className="flex items-center gap-2 border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white w-full lg:max-w-[200px]">
                    <FiSearch size={14} className="text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search.."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border-none outline-none text-[13px] text-gray-900 bg-transparent w-full"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
                    <FilterDropdown
                        label="Genre"
                        options={["Fantasy", "Scifi", "Romance", "Mystery", "Thriller", "Nonfiction"]}
                    />
                    <FilterDropdown
                        label="Audience Size"
                        options={["0 – 5,000", "5,000 – 20,000", "20,000 – 50,000", "50,000+"]}
                    />
                    <FilterDropdown
                        label="Available Slots"
                        options={["1 Slot", "2 Slots", "3+ Slots"]}
                    />
                    <FilterDropdown
                        label="Free"
                        options={["Free", "Paid"]}
                    />
                </div>
            </div>

            {/* Grid Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((partner) => (
                    <PartnerCard
                        key={partner.id}
                        partner={partner}
                        isSelected={selectedId === partner.id}
                        onClick={() => setSelectedId(partner.id)}
                        onSendRequest={() => setIsRequestOpen(true)}
                    />
                ))}
            </div>

            <SwapRequest
                isOpen={isRequestOpen}
                onClose={() => setIsRequestOpen(false)}
            />

            {filtered.length === 0 && (
                <div className="text-center py-16 text-gray-400 text-sm italic">
                    No partners found matching "{search}"
                </div>
            )}
        </div>
    );
};

export default SwapPartner;
