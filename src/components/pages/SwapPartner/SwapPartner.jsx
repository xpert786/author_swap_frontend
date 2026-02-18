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
    return (
        <div
            className="bg-white rounded-2xl p-5 flex flex-col gap-3.5 cursor-pointer transition-shadow hover:shadow-md"
            style={{
                border: isSelected
                    ? "1px solid rgba(224, 122, 95, 1)"
                    : "1px solid rgba(181, 181, 181, 1)",
            }}
            onClick={onClick}
        >
            {/* ── Row 1: Avatar + Name + Badges ── */}
            <div className="flex items-start gap-3">
                <img
                    src={partner.photo}
                    alt={partner.name}
                    className="w-[52px] h-[52px] rounded-full object-cover shrink-0"
                    onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                    }}
                />
                <div
                    className="hidden w-[52px] h-[52px] rounded-full bg-[#2F6F6D] text-white font-bold text-lg items-center justify-center shrink-0"
                >
                    {partner.name.split(" ").map((n) => n[0]).join("")}
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-bold text-black mb-0.5">{partner.name}</p>
                    <p className="text-xs text-black">{partner.swaps} swaps completed</p>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
                    {partner.badge && (
                        <span className="bg-violet-100 text-black text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {partner.badge}
                        </span>
                    )}
                    {partner.paid && (
                        <>
                            <span className="bg-[rgba(232,232,232,1)] text-black text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                {partner.paidAmount}
                            </span>
                            <span className="bg-[rgba(22,163,74,0.2)] text-black text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                Paid
                            </span>
                        </>
                    )}
                    <span className="bg-[rgba(22,163,74,0.2)] text-black text-[11px] font-semibold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        Available
                    </span>
                </div>
            </div>

            {/* ── Row 2: Tags ── */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[rgba(22,163,74,0.2)] text-black text-xs font-semibold px-3 py-0.5 rounded-full">
                    {partner.genre}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[rgba(224,122,95,0.2)] text-black text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <PartnersIcon size={14} /> {partner.partners}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[rgba(232,232,232,1)] text-black text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <PublicIcon size={15} /> {partner.visibility}
                </span>
            </div>

            {/* ── Row 3: Date / Time / Audience ── */}
            <div className="grid grid-cols-3 gap-2 py-1">
                <div>
                    <p className="text-xs text-black mb-0.5">Date</p>
                    <p className="text-sm font-bold text-black">{partner.date}</p>
                </div>
                <div>
                    <p className="text-xs text-black mb-0.5">Time</p>
                    <p className="text-sm font-bold text-black">{partner.time}</p>
                </div>
                <div>
                    <p className="text-xs text-black mb-0.5">Audience</p>
                    <p className="text-sm font-bold text-black">{partner.audience}</p>
                </div>
            </div>

            {/* ── Row 4: Buttons ── */}
            <div className="flex flex-wrap gap-2.5 mt-auto">
                <button
                    className="flex-1 min-w-[120px] px-4 py-2.5 border-[1.5px] border-gray-300 rounded-xl bg-transparent text-black text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[#1F4F4D] hover:border-[#1F4F4D] hover:text-white hover:-translate-y-px text-center"
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate("/swap-details", {
                            state: { name: partner.name, photo: partner.photo, swaps: partner.swaps },
                        });
                    }}
                >
                    View Details
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSendRequest(); // Trigger modal open via parent
                    }}
                    className="flex-1 min-w-[120px] px-4 py-2.5 border-[1.5px] border-gray-300 rounded-xl bg-transparent text-black text-sm font-semibold cursor-pointer transition-all duration-200 hover:bg-[#1F4F4D] hover:border-[#1F4F4D] hover:text-white hover:-translate-y-px text-center"
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
                className="flex items-center gap-1.5 px-3.5 py-[7px] border border-gray-300 rounded-lg bg-white text-[13px] text-black font-medium cursor-pointer whitespace-nowrap transition-all hover:border-gray-400 hover:bg-gray-50"
                onClick={() => setOpen((o) => !o)}
            >
                {selected || label}
                <FiChevronDown
                    size={13}
                    style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                    }}
                />
            </button>

            {open && (
                <div className="absolute top-[calc(100%+6px)] left-0 min-w-[160px] bg-white border border-gray-200 rounded-xl shadow-lg z-[100] py-2 animate-[fadeIn_0.15s_ease]">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            className={`px-5 py-2.5 text-sm text-black cursor-pointer transition-colors hover:bg-gray-100 ${selected === opt ? "text-[#1F4F4D] font-semibold bg-green-50" : ""
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
    const [selectedId, setSelectedId] = useState(null);
    const [isRequestOpen, setIsRequestOpen] = useState(false);

    const filtered = partners.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-7 min-h-screen max-w-[1400px] mx-auto">
            {/* Page Header */}
            <h1 className="text-2xl md:text-[26px] font-bold text-black mb-1">Swap Partner</h1>
            <p className="text-sm text-black mb-5">Find places to promote your book</p>

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                {/* Search */}
                <div className="sp-search flex items-center gap-2 border border-gray-300 rounded-lg px-3.5 py-2 bg-white w-full md:max-w-[240px]">
                    <FiSearch size={14} color="#9ca3af" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border-none outline-none text-[13px] text-black bg-transparent w-full"
                    />
                </div>

                {/* Filters */}
                <div className="sp-filters flex flex-wrap gap-2 md:ml-auto">
                    <FilterDropdown
                        label="Genre"
                        options={["Fantasy", "Scifi", "Romance", "Mystery", "Thriller", "Nonfiction"]}
                    />
                    <FilterDropdown
                        label="All Status"
                        options={["Available", "Booked", "Pending"]}
                    />
                    <FilterDropdown
                        label="Audience Size"
                        options={["0 – 5,000", "5,000 – 20,000", "20,000 – 50,000", "50,000+"]}
                    />
                    <FilterDropdown
                        label="Free"
                        options={["Paid", "Genre-Specific"]}
                    />
                </div>
            </div>

            {/* Cards Grid */}
            <div className="sp-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
                <div className="text-center py-16 text-gray-400 text-[15px]">
                    No partners found matching "{search}"
                </div>
            )}
        </div>
    );
};

export default SwapPartner;
