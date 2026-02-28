import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronDown, FiRefreshCw } from "react-icons/fi";
import { PartnersIcon, PublicIcon } from "../../icons";
import SwapRequest from "./SwapRequest";
import { getExploreSlots } from "../../../apis/swapPartner";
import { getGenres } from "../../../apis/genre";
import { formatCamelCaseName } from "../../../utils/formatName";

import "./SwapPartner.css";
import dayjs from "dayjs";

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

    // Derive display values from API response (camelCased via toCamel)
    const authorName = partner.author?.name || partner.name || "Unknown Author";
    const authorPhoto = partner.author?.profilePicture
        ? (partner.author.profilePicture.startsWith("http")
            ? partner.author.profilePicture
            : `http://72.61.251.114${partner.author.profilePicture}`)
        : partner.photo || `https://ui-avatars.com/api/?name=${authorName}&background=random`;
    const swapsCompleted = partner.author?.swapsCompleted ?? partner.swaps ?? 0;
    const genre = partner.preferredGenre || partner.genre || "N/A";
    const partnersLabel = `${partner.currentPartnersCount ?? 0}/${partner.maxPartners ?? 0} Partners`;
    const visibility = partner.visibility || "public";
    const sendDate = partner.sendDate || partner.date || null;
    const sendTime = partner.sendTime || partner.time || null;
    const audienceSize = partner.audienceSize ?? partner.audience ?? 0;
    const price = parseFloat(partner.price || 0);
    const isPaid = price > 0;
    const status = partner.status || "available";
    const promotionType = partner.promotionType || partner.badge || null;

    // Status badges
    const getBadges = () => {
        const badges = [];
        if (isPaid) {
            badges.push({ text: `$${price.toFixed(2)}`, bg: "bg-[#E8E8E8]" });
            badges.push({ text: "Paid", bg: "bg-[#16A34A33]" });
        }
        if (promotionType) {
            badges.push({ text: formatLabel(promotionType), bg: "bg-[#E8E8E8]" });
        }
        badges.push({ text: formatLabel(status), bg: "bg-[#16A34A33]" });
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
            <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                {/* Left Section - Avatar, Name, Swaps */}
                <div className="flex items-start gap-3 min-w-0">
                    <img
                        src={authorPhoto}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                    />

                    <div className="min-w-0">
                        {/* Name + Swaps forced into one line */}
                        <div className="flex flex-col items-start gap-1.5 whitespace-nowrap">
                            <p className="text-[14px] font-bold text-black leading-tight">
                                {formatCamelCaseName(authorName)}
                            </p>
                            <p className="text-[10px] text-[#374151] font-medium">
                                {swapsCompleted} swaps completed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Badges Row - Left aligned and drops down naturally */}
                <div className="flex flex-wrap items-center gap-1">
                    {getBadges().map((b, i) => (
                        <span
                            key={i}
                            className={`${b.bg} text-black text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap`}
                        >
                            {b.text}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── Tags Row ── */}
            <div className="flex items-center gap-1 flex-wrap">
                <span className="bg-[#16A34A33] text-black text-[10px] font-medium px-3 py-0.5 rounded-full">
                    {formatLabel(genre)}
                </span>
                <span className="inline-flex items-center gap-1 bg-[#E07A5F33] text-black text-[10px] font-medium px-3 py-0.5 rounded-full">
                    <PartnersIcon size={12} /> {partnersLabel}
                </span>
                <span className="inline-flex items-center gap-1 bg-[#E8E8E8] text-black text-[10px] font-medium px-3 py-0.5 rounded-full">
                    <PublicIcon size={12} /> {formatLabel(visibility)}
                </span>
            </div>

            {/* ── Data Grid ── */}
            <div className="grid grid-cols-3 gap-1 py-1">
                <div className="space-y-1">
                    <p className="text-[11px] text-[#111827] font-medium">Date</p>
                    <p className="text-[12px] font-medium text-[#111827]">
                        {sendDate ? dayjs(sendDate).format("DD MMM YYYY") : "N/A"}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[11px] text-[#111827] font-medium">Time</p>
                    <p className="text-[12px] font-medium text-[#111827]">
                        {sendTime || "N/A"}
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-[11px] text-[#111827] font-medium">Audience</p>
                    <p className="text-[12px] font-medium text-[#111827]">
                        {new Intl.NumberFormat('en-US').format(Number(audienceSize))}
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
                                id: partner.id,
                                author: partner.author,
                                send_date: partner.sendDate,
                                send_time: partner.sendTime,
                                audience_size: partner.audienceSize,
                                current_partners_count: partner.currentPartnersCount,
                                max_partners: partner.maxPartners,
                                preferred_genre: partner.preferredGenre,
                                visibility: partner.visibility,
                                status: partner.status,
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
                ${isPaid
                            ? "bg-[#2F6F6D] text-white border-[#2F6F6D]"
                            : "bg-white text-black hover:bg-gray-50"
                        }
            `}
                >
                    {isPaid ? `Request Paid Swap` : "Send Request"}
                </button>
            </div>
        </div >
    );
};

// ─── Filter Dropdown ──────────────────────────────────────────────────────────
const FilterDropdown = ({ label, options, selected, onSelect, align = "left" }) => {

    const [open, setOpen] = useState(false);
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
                <div className={`absolute top-[calc(100%+6px)] ${align === "right" ? "right-0" : "left-0"
                    } min-w-[170px] bg-white border border-[#B5B5B5] rounded-lg shadow-xl z-[100] py-2`}>

                    {options.map((opt) => (
                        <div
                            key={opt}
                            className={`px-5 py-2.5 text-sm text-black cursor-pointer transition-colors hover:bg-gray-100 ${selected === opt ? "text-[#2F6F6D] font-semibold bg-green-50" : ""
                                }`}
                            onClick={() => {
                                onSelect(opt === selected ? null : opt);
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
const toCamel = (obj) => {
    if (Array.isArray(obj)) return obj.map(v => toCamel(v));
    if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => ({
            ...result,
            [key.replace(/_([a-z])/g, g => g[1].toUpperCase())]: toCamel(obj[key]),
        }), {});
    }
    return obj;
};

const formatLabel = (str) => {
    if (!str) return "N/A";
    return str
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

const SwapPartner = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [requestingId, setRequestingId] = useState(null);
    const [genres, setGenres] = useState([]);
    const [isRequestOpen, setIsRequestOpen] = useState(false);

    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedAudience, setSelectedAudience] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPaid, setSelectedPaid] = useState(null);


    const fetchSlots = async () => {
        try {
            setLoading(true);
            const response = await getExploreSlots();
            // Handle common DRF structures or direct arrays
            let data = response.data?.results || response.data || [];
            // Handle camelCase conversion
            data = toCamel(data);

            // Fallback to static data if API returns empty list
            if (data.length === 0) {
                console.log("No dynamic partners found, showing static fallback data.");
                data = partners;
            }
            setSlots(data);
            if (data.length > 0) setSelectedId(data[0].id);
        } catch (error) {
            console.error("Failed to fetch explore slots, showing static fallback data:", error);
            setSlots(partners);
            if (partners.length > 0) setSelectedId(partners[0].id);
        } finally {
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const data = await getGenres();
            // Map to string array if response is objects
            const list = Array.isArray(data) ? data.map(g =>
                typeof g === 'string' ? g : (g.name || g.label || g.title)
            ) : [];
            setGenres(list);
        } catch (error) {
            console.error("Failed to fetch genres:", error);
            // Optional: fallback if API fails
            setGenres(["Fantasy", "Mystery", "Nonfiction", "Romance", "Scifi", "Thriller"]);
        }
    };

    React.useEffect(() => {
        fetchSlots();
        fetchGenres();
    }, []);


    const filtered = (Array.isArray(slots) ? slots : []).filter((p) => {
        const matchesSearch = (p.author?.name || p.authorName || p.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (p.preferredGenre || p.genre || "").toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (selectedGenre && selectedGenre !== "All" && (p.preferredGenre || p.genre || "").toLowerCase() !== selectedGenre.toLowerCase()) return false;

        if (selectedAudience && selectedAudience !== "All") {
            const rawAudience = p.audienceSize ?? p.audience ?? 0;
            const size = typeof rawAudience === 'string' ? parseInt(rawAudience.replace(/,/g, '')) : Number(rawAudience);
            if (selectedAudience === "0 – 5,000" && size > 5000) return false;
            if (selectedAudience === "5,000 – 20,000" && (size <= 5000 || size > 20000)) return false;
            if (selectedAudience === "20,000 – 50,000" && (size <= 20000 || size > 50000)) return false;
            if (selectedAudience === "50,000+" && size <= 50000) return false;
        }

        if (selectedDate && selectedDate !== "All") {
            const dateStr = p.sendDate || p.date;
            if (!dateStr) return false;
            const date = dayjs(dateStr);
            if (selectedDate === "Today" && !date.isSame(dayjs(), 'day')) return false;
            if (selectedDate === "This Week" && !date.isSame(dayjs(), 'week')) return false;
            if (selectedDate === "Next Week" && !date.isSame(dayjs().add(1, 'week'), 'week')) return false;
            if (selectedDate === "This Month" && !date.isSame(dayjs(), 'month')) return false;
        }

        if (selectedPaid && selectedPaid !== "All") {
            const price = parseFloat(p.price || 0);
            if (selectedPaid === "Free" && price > 0) return false;
            if (selectedPaid === "Paid" && price === 0) return false;
            if (selectedPaid === "Genre-Specific" && (p.promotionType || p.badge || "").toLowerCase() !== "genre_specific") return false;
        }

        return true;
    });

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
                <div className="flex items-center gap-2 border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white w-full lg:max-w-[250px]">
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
                        options={["All", ...(genres.length > 0 ? genres : ["Fantasy", "Mystery", "Nonfiction", "Romance", "Scifi", "Thriller"])]}
                        selected={selectedGenre}
                        onSelect={setSelectedGenre}
                    />

                    <FilterDropdown
                        label="Audience Size"
                        options={["All", "0 – 5,000", "5,000 – 20,000", "20,000 – 50,000", "50,000+"]}
                        selected={selectedAudience}
                        onSelect={setSelectedAudience}
                    />
                    <FilterDropdown
                        label="Date"
                        options={["All", "Today", "This Week", "Next Week", "This Month"]}
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                    />
                    <FilterDropdown
                        label="Free / Paid"
                        options={["All", "Free", "Paid", "Genre-Specific"]}
                        selected={selectedPaid}
                        onSelect={setSelectedPaid}
                        align="right"
                    />

                </div>
            </div>

            {/* Content Section */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                    <FiRefreshCw className="animate-spin text-[#2F6F6D] mb-4" size={40} />
                    <p className="text-gray-500 font-medium tracking-tight">Loading swap partners...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((partner) => (
                            <PartnerCard
                                key={partner.id}
                                partner={{
                                    ...partner,
                                    // Map API fields if they are different from UI requirements
                                    name: partner.author?.name || "Anonymous",
                                    photo: partner.author?.profilePicture || `https://ui-avatars.com/api/?name=${partner.author?.name || "A"}&background=random`,
                                    date: partner.sendDate || "N/A",
                                    time: partner.sendTime || "N/A",
                                    audience: partner.audienceSize || "0",
                                    partners: `${(partner.maxPartners || 0) - (partner.currentPartnersCount || 0)} Slot${((partner.maxPartners || 0) - (partner.currentPartnersCount || 0)) !== 1 ? 's' : ''} Available`,
                                    visibility: formatLabel(partner.visibility),
                                    genre: formatLabel(partner.preferredGenre),
                                    paid: partner.price && partner.price !== "0.00",
                                    paidAmount: `$${partner.price || "0.00"}`,
                                    badge: formatLabel(partner.promotionType),
                                }}
                                isSelected={selectedId === partner.id}
                                onClick={() => setSelectedId(partner.id)}
                                onSendRequest={() => {
                                    setRequestingId(partner.id);
                                    setIsRequestOpen(true);
                                }}
                            />
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-gray-400 text-sm italic">
                            No partners found matching "{search}"
                        </div>
                    )}
                </>
            )}

            <SwapRequest
                isOpen={isRequestOpen}
                id={requestingId}
                onClose={() => {
                    setIsRequestOpen(false);
                    setRequestingId(null);
                }}
            />

        </div>
    );
};

export default SwapPartner;
