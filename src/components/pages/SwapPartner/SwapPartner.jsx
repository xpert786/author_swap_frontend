import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiChevronDown, FiRefreshCw, FiMessageSquare, FiCalendar } from "react-icons/fi";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PartnersIcon, PublicIcon } from "../../icons";
import SwapRequest from "./SwapRequest";
import PaidSwapRequest from "./PaidSwapRequest";
import { getExploreSlots } from "../../../apis/swapPartner";
import { getGenres } from "../../../apis/genre";
import { formatCamelCaseName } from "../../../utils/formatName";

import "./SwapPartner.css";
import dayjs from "dayjs";
import messageIcon from "../../../assets/message.png";
// ─── Utilities ─────────────────────────────────────────────────────────────
const toCamel = (obj) => {
    if (Array.isArray(obj)) return obj.map(v => toCamel(v));
    if (obj !== null && obj?.constructor === Object) {
        return Object.keys(obj).reduce(
            (result, key) => ({
                ...result,
                [key.replace(/(_\w)/g, k => k[1].toUpperCase())]: toCamel(obj[key]),
            }),
            {}
        );
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

// ─── Availability Popover ──────────────────────────────────────────────────
const AvailabilityPopover = ({ userId, currentSlotId, onSlotSelect }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [calendarData, setCalendarData] = useState([]); // array of { date, day, has_slots, status, slots: [...] }
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [fetched, setFetched] = useState(false);
    const ref = React.useRef(null);
    const buttonRef = React.useRef(null);

    React.useEffect(() => {
        const handler = (e) => {
            if (ref.current && !ref.current.contains(e.target) &&
                buttonRef.current && !buttonRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        const scrollHandler = () => {
            if (open) setOpen(false);
        };
        document.addEventListener("mousedown", handler);
        document.addEventListener("scroll", scrollHandler, true);
        return () => {
            document.removeEventListener("mousedown", handler);
            document.removeEventListener("scroll", scrollHandler, true);
        };
    }, [open]);

    React.useEffect(() => {
        if (open && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const popoverWidth = 320;
            const popoverHeight = 360;
            const sidebarWidth = 280;

            let left = rect.left + rect.width / 2 - popoverWidth / 2;
            let top = rect.bottom + 8;

            if (left < sidebarWidth + 16) left = sidebarWidth + 16;
            if (left + popoverWidth > window.innerWidth - 16) left = window.innerWidth - popoverWidth - 16;
            if (top + popoverHeight > window.innerHeight - 16) top = rect.top - popoverHeight - 8;
            if (top < 16) top = rect.bottom + 8;

            setPosition({ top, left });
        }
    }, [open]);

    const fetchAvailability = async () => {
        // Toggle if already loaded
        if (fetched) {
            setOpen(prev => !prev);
            return;
        }

        if (!userId) {
            console.warn("AvailabilityPopover: no userId provided, skipping fetch");
            setOpen(true);
            return;
        }

        try {
            setLoading(true);
            setOpen(true);
            console.log("Fetching author availability for userId:", userId);
            const response = await getAuthorAvailability(userId);
            const raw = response.data;
            // Log raw response so we can inspect the shape in browser console
            console.log("author-availability raw response:", raw);

            let data = [];
            if (Array.isArray(raw)) {
                data = raw;
            } else if (raw && typeof raw === "object") {
                // Try every common wrapping key
                data = raw.results || raw.dates || raw.calendar || raw.slots || raw.data || raw.availability || [];
            }

            console.log("parsed calendar data:", data);
            setCalendarData(toCamel(data));
            setFetched(true);
        } catch (error) {
            console.error("Failed to fetch availability:", error);
            toast.error("Could not load availability");
            setOpen(false);
        } finally {
            setLoading(false);
        }
    };

    const days = ["S", "M", "T", "W", "T", "F", "S"];
    const generateCalendar = () => {
        const startDate = currentMonth.startOf("month").startOf("week");
        const endDate = currentMonth.endOf("month").endOf("week");
        let date = startDate.clone();
        const result = [];
        while (date.isBefore(endDate) || date.isSame(endDate, "day")) {
            result.push(date.clone());
            date = date.add(1, "day");
        }
        return result;
    };

    const calendarDays = generateCalendar();
    const today = dayjs();

    return (
        <div ref={buttonRef} className="relative">
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    fetchAvailability();
                }}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold bg-[#2F6F6D1A] text-[#2F6F6D] hover:bg-[#2F6F6D2A] transition-colors"
                title="View more available dates"
            >
                <FiCalendar size={12} />
                Availability
            </button>

            {open && createPortal(
                <div
                    ref={ref}
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        zIndex: 9999,
                    }}
                    className="w-[320px] bg-white border border-[#B5B5B5] rounded-2xl shadow-2xl p-4"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                            >
                                <IoChevronBack size={14} />
                            </button>
                            <p className="text-[12px] font-bold text-black uppercase tracking-tight w-[100px] text-center">
                                {currentMonth.format("MMM YYYY")}
                            </p>
                            <button
                                onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
                            >
                                <IoChevronForward size={14} />
                            </button>
                        </div>
                        {loading && <FiRefreshCw size={10} className="animate-spin text-[#2F6F6D]" />}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                        {days.map((d, i) => (
                            <div key={i} className="text-center text-[9px] font-bold text-gray-400 py-1">{d}</div>
                        ))}
                        {calendarDays.map((date, idx) => {
                            const isCurrentMonth = date.isSame(currentMonth, "month");
                            // Match API response date field (YYYY-MM-DD)
                            const dateEntry = calendarData.find(s => dayjs(s.date).isSame(date, "day"));
                            const dSlots = dateEntry?.slots || [];
                            const hasSlots = dateEntry?.hasSlots || dSlots.length > 0;
                            const isCurrent = dSlots.some(s => s.id === currentSlotId);
                            const isToday = date.isSame(today, "day");
                            const anyAvailable = dateEntry?.status === "available" || dSlots.some(s => (s.status || "").toLowerCase() === "available");
                            const allBooked = hasSlots && !anyAvailable;

                            return (
                                <div
                                    key={idx}
                                    onClick={(e) => {
                                        // Only trigger modal if clicking an available date with a valid slot
                                        if (hasSlots && anyAvailable && onSlotSelect) {
                                            e.stopPropagation();
                                            const availSlot = dSlots.find(s => (s.status || "").toLowerCase() === "available") || dSlots[0];
                                            if (availSlot?.id) {
                                                onSlotSelect(availSlot.id);
                                                setOpen(false);
                                            }
                                        }
                                    }}
                                    className={`
                                        h-9 flex items-center justify-center rounded-lg text-[12px] font-medium relative transition-all
                                        ${!isCurrentMonth ? "text-gray-200" : "text-gray-600"}
                                        ${hasSlots && anyAvailable ? "cursor-pointer hover:scale-105" : ""}
                                        ${isCurrent ? "bg-[#2F6F6D] text-white shadow-sm ring-2 ring-[#2F6F6D33]" :
                                            anyAvailable ? "bg-[#2F6F6D1A] text-[#2F6F6D] font-bold" :
                                                allBooked ? "bg-[#EF44441A] text-[#EF4444] font-bold" :
                                                    "hover:bg-gray-50"}
                                        ${isToday && !isCurrent ? "border border-[#E07A5F] border-dashed" : ""}
                                    `}
                                >
                                    {date.format("D")}
                                    {hasSlots && dSlots.length > 1 && (
                                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E07A5F] text-white text-[7px] font-bold rounded-full flex items-center justify-center">
                                            {dSlots.length}
                                        </span>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col gap-2">
                        <div className="flex items-center gap-4 justify-center">
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#2F6F6D1A]" />
                                <span className="text-[10px] text-gray-600 font-medium">Available</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#EF444433]" />
                                <span className="text-[10px] text-gray-600 font-medium">Booked</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#2F6F6D]" />
                                <span className="text-[10px] text-gray-600 font-medium">Current</span>
                            </div>
                        </div>
                        {!loading && fetched && calendarData.length === 0 && (
                            <p className="text-[10px] text-gray-400 text-center mt-1">No availability data</p>
                        )}
                        {!loading && fetched && calendarData.length > 0 && onSlotSelect && (
                            <p className="text-[10px] text-[#2F6F6D] text-center mt-1">Click a highlighted date to request that slot</p>
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

import { getPublicProfile, getAuthorAvailability } from "../../../apis/profile";
import toast from "react-hot-toast";
// ─── Partner Card ─────────────────────────────────────────────────────────────
const PartnerCard = ({ partner, isSelected, onClick, onSendRequest, onAvailabilitySelect }) => {
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
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-3 min-w-0">
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

                {/* Message Button - Rounded Square as requested */}
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate("/communication", {
                            state: {
                                partnerId: partner.author?.id,
                                partnerName: authorName,
                                partnerAvatar: authorPhoto,
                                partnerUsername: partner.author?.username || ""
                            }
                        });
                    }}
                    className="w-9 h-9 shrink-0 bg-[#DEE8E7] rounded-[10px] flex items-center justify-center transition-all hover:bg-[#cfdedd] shadow-sm mt-0.5"
                    title="Message Author"
                >
                    <img src={messageIcon} alt="Message" className="w-5 h-5 object-contain" />
                </button>
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
                    <p className="text-[11px] text-[#111827] font-medium">Analytics</p>
                    <div className="flex flex-col gap-0.5">
                        <p className="text-[10px] font-medium text-[#2F6F6D]">
                            OR: <span className="text-[#111827]">{partner.author?.avgOpenRate || partner.author?.avg_open_rate || 0}%</span>
                        </p>
                        <p className="text-[10px] font-medium text-[#E07A5F]">
                            CTR: <span className="text-[#111827]">{partner.author?.avgClickRate || partner.author?.avg_click_rate || 0}%</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Availability Row ── */}
            <div className="flex items-center justify-between py-1 border-t border-gray-50 mt-1">
                <AvailabilityPopover 
                    userId={partner.author?.userId || partner.author?.id || partner.userId} 
                    currentSlotId={partner.id} 
                    onSlotSelect={onAvailabilitySelect}
                />
                <p className="text-[10px] text-gray-400 font-medium">Score: {partner.author?.reputationScore || 0}%</p>
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

// ─── Partner Row (List View) ──────────────────────────────────────────────────
const PartnerRow = ({ partner, onSendRequest, onAvailabilitySelect }) => {
    const navigate = useNavigate();

    const authorName = partner.author?.name || partner.name || "Unknown Author";
    const authorPhoto = partner.author?.profilePicture
        ? (partner.author.profilePicture.startsWith("http")
            ? partner.author.profilePicture
            : `http://72.61.251.114${partner.author.profilePicture}`)
        : partner.photo || `https://ui-avatars.com/api/?name=${authorName}&background=random`;

    const genre = partner.preferredGenre || partner.genre || "N/A";
    const sendDate = partner.sendDate || partner.date || null;
    const audienceSize = partner.audienceSize ?? partner.audience ?? 0;
    const price = parseFloat(partner.price || 0);
    const isPaid = price > 0;

    return (
        <tr className="border-b border-[#B5B5B5] hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => {
                navigate("/swap-details", { state: { ...partner } });
            }}>
            <td className="py-4 pl-4">
                <div className="flex items-center gap-3">
                    <img src={authorPhoto} alt={authorName} className="w-8 h-8 rounded-full object-cover" />
                    <div>
                        <p className="text-[13px] font-bold text-black">{formatCamelCaseName(authorName)}</p>
                        <p className="text-[10px] text-[#374151]">{partner.author?.swapsCompleted || 0} swaps</p>
                    </div>
                </div>
            </td>
            <td className="py-4">
                <span className="bg-[#16A34A33] text-black text-[10px] font-medium px-2 py-0.5 rounded-full">
                    {genre}
                </span>
            </td>
            <td className="py-4 text-[13px] font-medium text-[#111827]">
                {new Intl.NumberFormat('en-US').format(Number(audienceSize))}
            </td>
            <td className="py-4">
                <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-[#2F6F6D]">OR: {partner.author?.avgOpenRate || 0}%</span>
                    <span className="text-[11px] font-medium text-[#E07A5F]">CTR: {partner.author?.avgClickRate || 0}%</span>
                </div>
            </td>
            <td className="py-4">
                <AvailabilityPopover 
                    userId={partner.author?.userId || partner.author?.id || partner.userId} 
                    currentSlotId={partner.id} 
                    onSlotSelect={onAvailabilitySelect}
                />
            </td>
            <td className="py-4 text-[13px] font-medium text-[#111827]">
                {sendDate ? dayjs(sendDate).format("DD MMM YYYY") : "N/A"}
            </td>
            <td className="py-4">
                <div className="flex items-center gap-1">
                    {isPaid && <span className="bg-[#16A34A1A] text-[#16A34A] text-[10px] font-bold px-2 py-0.5 rounded-full">Paid</span>}
                    <span className="text-[13px] font-medium text-[#111827]">{isPaid ? `$${price.toFixed(2)}` : "Free"}</span>
                </div>
            </td>
            <td className="py-4 pr-4">
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSendRequest();
                        }}
                        className="px-3 py-1.5 bg-[#2F6F6D] text-white rounded-md text-[11px] font-medium hover:bg-[#255755]"
                    >
                        Request
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/communication", {
                                state: {
                                    partnerId: partner.author?.id,
                                    partnerName: authorName,
                                    partnerAvatar: authorPhoto,
                                    partnerUsername: partner.author?.username || ""
                                }
                            });
                        }}
                        className="p-1.5 bg-[#DEE8E7] rounded-md transition-all hover:bg-[#cfdedd]"
                    >
                        <img src={messageIcon} alt="Message" className="w-4 h-4 object-contain" />
                    </button>
                </div>
            </td>
        </tr>
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

    const selectedOption = options.find((opt) =>
        (typeof opt === "string" ? opt : opt.value) === selected
    );
    const displayLabel = selectedOption
        ? (typeof selectedOption === "string" ? selectedOption : selectedOption.label)
        : label;

    return (
        <div ref={ref} className="relative">
            <button
                className="flex items-center gap-2 px-3 py-1.5 border border-[#B5B5B5] rounded-lg bg-white text-[13px] text-black font-medium cursor-pointer whitespace-nowrap transition-all hover:bg-gray-50"
                onClick={() => setOpen((o) => !o)}
            >
                <span>{displayLabel}</span>
                <FiChevronDown
                    size={14}
                    className="shrink-0 text-gray-400"
                    style={{
                        transform: open ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s ease",
                    }}
                />
            </button>

            {open && (
                <div className={`absolute top-[calc(100%+6px)] ${align === "right" ? "right-0" : "left-0"
                    } min-w-[170px] bg-white border border-[#B5B5B5] rounded-lg shadow-xl z-[100] py-2 overflow-y-auto max-h-[250px]`}>

                    {options.map((opt) => {
                        const val = typeof opt === "string" ? opt : opt.value;
                        const lab = typeof opt === "string" ? opt : opt.label;
                        return (
                            <div
                                key={val}
                                className={`px-5 py-2.5 text-sm text-black cursor-pointer transition-colors hover:bg-gray-100 ${selected === val ? "text-[#2F6F6D] font-semibold bg-green-50" : ""
                                    }`}
                                onClick={() => {
                                    onSelect(val === selected ? null : val);
                                    setOpen(false);
                                }}
                            >
                                {lab}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
// utils moved to top


const SwapPartner = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [requestingId, setRequestingId] = useState(null);
    const [genres, setGenres] = useState([
        { value: "romance", label: "Romance" },
        { value: "mystery_thriller", label: "Mystery / Thriller" },
        { value: "science_fiction", label: "Science Fiction" },
        { value: "fantasy", label: "Fantasy" },
        { value: "young_adult", label: "Young Adult" },
        { value: "childrens", label: "Children’s Books" },
        { value: "horror", label: "Horror" },
        { value: "literary", label: "Literary Fiction" },
        { value: "womens_fiction", label: "Women’s Fiction" },
        { value: "nonfiction", label: "Nonfiction" },
        { value: "action_adventure", label: "Action / Adventure" },
        { value: "comics_graphic", label: "Comics & Graphic Novels" }
    ]);
    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [isPaidRequestOpen, setIsPaidRequestOpen] = useState(false);
    const [requestingPrice, setRequestingPrice] = useState(0);

    const [selectedGenre, setSelectedGenre] = useState(null);
    const [selectedAudience, setSelectedAudience] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedPaid, setSelectedPaid] = useState(null);
    const [viewType, setViewType] = useState(localStorage.getItem("swapDiscoveryView") || "grid");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [hasPrevious, setHasPrevious] = useState(false);
    const [nextUrl, setNextUrl] = useState(null);
    const [prevUrl, setPrevUrl] = useState(null);

    const getDateRange = (dateLabel) => {
        const today = dayjs();
        if (dateLabel === "Today") {
            return { start_date: today.format("YYYY-MM-DD"), end_date: today.format("YYYY-MM-DD") };
        }
        if (dateLabel === "This Week") {
            return { start_date: today.format("YYYY-MM-DD"), end_date: today.endOf("week").format("YYYY-MM-DD") };
        }
        if (dateLabel === "Next Week") {
            const nextWeek = today.add(1, "week");
            return { start_date: nextWeek.startOf("week").format("YYYY-MM-DD"), end_date: nextWeek.endOf("week").format("YYYY-MM-DD") };
        }
        if (dateLabel === "This Month") {
            return { start_date: today.format("YYYY-MM-DD"), end_date: today.endOf("month").format("YYYY-MM-DD") };
        }
        return {};
    };

    const fetchSlots = async (url = null, page = 1) => {
        try {
            setLoading(true);

            let params = { page };
            if (selectedGenre && selectedGenre !== "All") params.genre = selectedGenre;
            if (selectedPaid && selectedPaid !== "All") {
                if (selectedPaid === "Free") params.promotion = "free";
                if (selectedPaid === "Paid") params.promotion = "paid";
                if (selectedPaid === "Genre-Specific") params.promotion = "genre_specific";
            }
            if (selectedDate && selectedDate !== "All") {
                const range = getDateRange(selectedDate);
                Object.assign(params, range);
            }
            if (search) params.search = search;

            const response = url
                ? await getExploreSlots(null, url)
                : await getExploreSlots(params);

            let data = response.data?.results || response.data || [];
            data = toCamel(data);

            setSlots(data);
            if (data.length > 0) setSelectedId(data[0].id);

            // ✅ USE BACKEND PAGINATION
            const next = response.data?.next;
            const prev = response.data?.previous;

            setNextUrl(next);
            setPrevUrl(prev);

            // ✅ USE BACKEND VALUES DIRECTLY
            setCurrentPage(response.data?.current_page || 1);
            setTotalPages(response.data?.total_pages || 1);

            setHasNext(!!next);
            setHasPrevious(!!prev);

            // extract current page from URL
            if (url) {
                const match = url.match(/page=(\d+)/);
                setCurrentPage(match ? Number(match[1]) : 1);
            } else {
                setCurrentPage(page);
            }

            setHasNext(!!next);
            setHasPrevious(!!prev);

        } catch (error) {
            console.error("Failed to fetch explore slots:", error);
            setSlots([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchGenres = async () => {
        try {
            const data = await getGenres();
            if (Array.isArray(data) && data.length > 0) {
                // Keep the object structure if returned by API
                setGenres(data);
            }
        } catch (error) {
            console.error("Failed to fetch genres:", error);
        }
    };

    React.useEffect(() => {
        fetchSlots(null, 1);
        fetchGenres();
    }, [selectedGenre, selectedDate, selectedPaid, search]);


    const filtered = (Array.isArray(slots) ? slots : []).filter((p) => {
        const matchesSearch = (p.author?.name || p.authorName || p.name || "").toLowerCase().includes(search.toLowerCase()) ||
            (p.preferredGenre || p.genre || "").toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (selectedGenre && selectedGenre !== "All") {
            const pGenre = p.preferredGenre || p.genre || "";
            // Direct comparison with slug (value)
            if (pGenre.toLowerCase() !== selectedGenre.toLowerCase()) return false;
        }

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
            <div className="flex flex-col mb-6">
                {/* Row 1: Search + Filters */}
                <div className="flex items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="flex items-center gap-2 border border-[#B5B5B5] rounded-lg px-3 py-1.5 bg-white flex-1 max-w-[250px]">
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
                    <div className="flex items-center gap-2">
                        <FilterDropdown
                            label="Genre"
                            options={["All", ...(genres.length > 0 ? genres : ["Fantasy", "Mystery", "Nonfiction", "Romance", "Scifi", "Thriller"])]}
                            selected={selectedGenre}
                            onSelect={setSelectedGenre}
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

                {/* Row 2: Grid/List Toggle below search */}
                <div className="flex items-center mt-5">
                    <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => { setViewType("grid"); localStorage.setItem("swapDiscoveryView", "grid"); }}
                            className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all ${viewType === "grid" ? "bg-white shadow-sm text-[#2F6F6D]" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            Grid
                        </button>
                        <button
                            onClick={() => { setViewType("list"); localStorage.setItem("swapDiscoveryView", "list"); }}
                            className={`px-3 py-1 rounded-md text-[12px] font-medium transition-all ${viewType === "list" ? "bg-white shadow-sm text-[#2F6F6D]" : "text-gray-500 hover:text-gray-700"}`}
                        >
                            List
                        </button>
                    </div>
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
                    {viewType === "grid" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {(slots || []).map((partner) => (
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
                                        genre: (() => {
                                            const pGenre = partner.preferredGenre || partner.genre || "";
                                            const found = genres.find(g =>
                                                (typeof g === 'string' ? g : g.value) === pGenre ||
                                                (typeof g === 'string' ? g : g.label) === pGenre
                                            );
                                            return (typeof found === 'string' ? found : found?.label) || formatLabel(pGenre);
                                        })(),
                                        paid: partner.price && partner.price !== "0.00",
                                        paidAmount: `$${partner.price || "0.00"}`,
                                        badge: formatLabel(partner.promotionType),
                                    }}
                                    isSelected={selectedId === partner.id}
                                    onClick={() => setSelectedId(partner.id)}
                                    onSendRequest={() => {
                                        setRequestingId(partner.id);
                                        if (parseFloat(partner.price || 0) > 0) {
                                            setRequestingPrice(partner.price);
                                            setIsPaidRequestOpen(true);
                                        } else {
                                            setIsRequestOpen(true);
                                        }
                                    }}
                                    onAvailabilitySelect={(slotId) => {
                                        setRequestingId(slotId);
                                        if (parseFloat(partner.price || 0) > 0) {
                                            setRequestingPrice(partner.price);
                                            setIsPaidRequestOpen(true);
                                        } else {
                                            setIsRequestOpen(true);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-[10px] border border-[#B5B5B5] overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-gray-50 border-b border-[#B5B5B5]">
                                    <tr>
                                        <th className="py-3 pl-4 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider">Author</th>
                                        <th className="py-3 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider">Genre</th>
                                        <th className="py-3 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider">Audience</th>
                                        <th className="py-3 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider">Analytics</th>
                                        <th className="py-3 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider">Availability</th>
                                        <th className="py-3 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="py-3 text-left text-[12px] font-bold text-gray-500 uppercase tracking-wider">Type/Price</th>
                                        <th className="py-3 pr-4 text-right text-[12px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(slots || []).map((partner) => (
                                        <PartnerRow
                                            key={partner.id}
                                            partner={{
                                                ...partner,
                                                genre: (() => {
                                                    const pGenre = partner.preferredGenre || partner.genre || "";
                                                    const found = genres.find(g =>
                                                        (typeof g === 'string' ? g : g.value) === pGenre ||
                                                        (typeof g === 'string' ? g : g.label) === pGenre
                                                    );
                                                    return (typeof found === 'string' ? found : found?.label) || formatLabel(pGenre);
                                                })(),
                                            }}
                                            onSendRequest={() => {
                                                setRequestingId(partner.id);
                                                if (parseFloat(partner.price || 0) > 0) {
                                                    setRequestingPrice(partner.price);
                                                    setIsPaidRequestOpen(true);
                                                } else {
                                                    setIsRequestOpen(true);
                                                }
                                            }}
                                            onAvailabilitySelect={(slotId) => {
                                                setRequestingId(slotId);
                                                if (parseFloat(partner.price || 0) > 0) {
                                                    setRequestingPrice(partner.price);
                                                    setIsPaidRequestOpen(true);
                                                } else {
                                                    setIsRequestOpen(true);
                                                }
                                            }}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-6">
                            <button
                                onClick={() => prevUrl && fetchSlots(prevUrl)}
                                disabled={!hasPrevious || loading}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => nextUrl && fetchSlots(nextUrl)}
                                disabled={!hasNext || loading}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    )}

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

            <PaidSwapRequest
                isOpen={isPaidRequestOpen}
                id={requestingId}
                price={requestingPrice}
                onClose={() => {
                    setIsPaidRequestOpen(false);
                    setRequestingId(null);
                    setRequestingPrice(0);
                }}
            />

        </div>
    );
};

export default SwapPartner;
