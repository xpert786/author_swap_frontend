import React, { useState, useEffect, useMemo } from "react";
import {
    Plus,
    Download,
    ChevronDown,
    Trash2,
    Eye,
    Users,
} from "lucide-react";
import { Publish } from "../../icons";
import pendingSwapIcon from "../../../assets/pendingswap.png";
import confirmedSwapIcon from "../../../assets/confirmedswap.png";
import verifiedSentIcon from "../../../assets/acceptedswap.png";
import newsIcon from "../../../assets/newsicon.png";
import AddNewsSlot from "./AddNewsSlot";
import EditNewsSlot from "./EditNewsSlot";
import DeleteNewsSlot from "./DeleteNewsSlot";
import SlotDetails from "./SlotDetails";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import Edit from "../../../assets/edit.png";
import Swap from "../../../assets/swap-bg.png";
import dayjs from "dayjs";
import { IoChevronDown, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { updateNewsSlot, getNewsSlot, deleteNewsSlot, statsNewsSlot, exportNewsSlot } from "../../../apis/newsletter";
import { getGenres } from "../../../apis/genre";
import toast from "react-hot-toast";

const Newsletter = () => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(dayjs());
    const [visibility, setVisibility] = useState("All Visibility");
    const [status, setStatus] = useState("All Status");
    const [genre, setGenre] = useState("Genre");
    const [selectedGenre, setSelectedGenre] = useState("Genre");
    const [showGenreDropdown, setShowGenreDropdown] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedGenreValue, setSelectedGenreValue] = useState("");
    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [newsletterStats, setNewsletterStats] = useState({
        total_slots: 0,
        published_slots: 0,
        pending_swap_requests: 0,
        confirmed_swaps: 0,
        verified_sent: 0
    });
    const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
    const [calendarData, setCalendarData] = useState([]);

    const handleSlotExport = async (slotId, format) => {
        if (format === "ics") {
            const url = `${import.meta.env.VITE_API_BASE_URL}newsletter-slot/${slotId}/export/?format=ics`;
            window.open(url, "_blank");
        } else {
            try {
                const response = await exportNewsSlot(slotId, format);
                if (response.data?.url) {
                    window.open(response.data.url, "_blank");
                }
            } catch (error) {
                toast.error(`Failed to export to ${format === "google" ? "Google Calendar" : "Outlook"}`);
            }
        }
        setOpenDropdown(null);
    };


    const handleExportGoogle = async () => {
        const daySlots = slots.filter(s => dayjs(s.raw_data.send_date).isSame(selectedDate, "day"));
        if (daySlots.length === 0) {
            toast.error("No slots available for this day");
            return;
        }
        await handleSlotExport(daySlots[0].id, "google");
        setExportDropdownOpen(false);
    };

    const handleExportOutlook = async () => {
        const daySlots = slots.filter(s => dayjs(s.raw_data.send_date).isSame(selectedDate, "day"));
        if (daySlots.length === 0) {
            toast.error("No slots available for this day");
            return;
        }
        await handleSlotExport(daySlots[0].id, "outlook");
        setExportDropdownOpen(false);
    };

    const handleExportICS = async () => {
        const daySlots = slots.filter(s => dayjs(s.raw_data.send_date).isSame(selectedDate, "day"));
        if (daySlots.length === 0) {
            toast.error("No slots available for this day");
            return;
        }
        await handleSlotExport(daySlots[0].id, "ics");
        setExportDropdownOpen(false);
    };



    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const generateCalendar = () => {
        const startOfMonth = currentMonth.startOf("month");
        const endOfMonth = currentMonth.endOf("month");
        const startDate = startOfMonth.startOf("week");
        const endDate = endOfMonth.endOf("week");
        let date = startDate.clone();
        const days = [];
        while (date.isBefore(endDate) || date.isSame(endDate, "day")) {
            days.push(date.clone());
            date = date.add(1, "day");
        }
        return days;
    };

    const calendarDays = useMemo(() => generateCalendar(), [currentMonth]);
    const today = useMemo(() => dayjs(), []);

    useEffect(() => {
        const loadGenres = async () => {
            try {
                const response = await getGenres();
                setGenres(response);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load genres");
            } finally {
                setLoadingGenres(false);
            }
        };
        loadGenres();
    }, []);

    const formatLabel = (value) => {
        if (!value) return "";
        return value
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());
    };

    const getPeriod = (time) => {
        if (!time) return "Morning";
        let hour = parseInt(time.split(":")[0], 10);
        const lowerTime = time.toLowerCase();

        // Handle 12h format with AM/PM
        if (lowerTime.includes("pm") && hour < 12) hour += 12;
        if (lowerTime.includes("am") && hour === 12) hour = 0;

        if (hour < 12) return "Morning";
        if (hour < 17) return "Afternoon";
        return "Evening";
    };

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const response = await getNewsSlot();
            // Robust data extraction
            const dataArray = Array.isArray(response.data)
                ? response.data
                : (response.data?.data || response.data?.results || []);

            const formatted = dataArray.map(item => ({
                id: item.id,
                time: `${item.formatted_date || ""} ${item.formatted_time || ""}`.trim() || item.send_time || "",
                period: getPeriod(item.send_time) || formatLabel(item.time_period),
                genre: formatLabel(item.preferred_genre),
                rawGenre: (item.preferred_genre || "").toLowerCase(),
                partners: `${item.partner_count || 0}/${item.max_partners} Partners`,
                visibility: formatLabel(item.visibility),
                rawVisibility: (item.visibility || "").toLowerCase(),
                audience: item.audience_size,
                status: formatLabel(item.status),
                rawStatus: (item.status || "").toLowerCase(),
                statusColor:
                    (item.status || "").toLowerCase() === "available"
                        ? "bg-[#16A34A33]"
                        : "bg-[#F59E0B33]",
                raw_data: item,
            }));
            setSlots(formatted);
        } catch (error) {
            console.error("Failed to fetch slots", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const params = {
                month: currentMonth.format("MM"),
                year: currentMonth.format("YYYY"),
                genre: selectedGenreValue || "all",
                visibility: visibility === "All Visibility" ? "all" : (visibility === "Public" ? "Public" : visibility.toLowerCase().replace(/ /g, "_")),
                status: status === "All Status" ? "all" : (status === "Verified" ? "verified_sent" : status.toLowerCase())
            };
            const response = await statsNewsSlot(params);
            const statsData = response.data?.stats_cards || {};
            const calData = response.data?.calendar?.days || [];

            setNewsletterStats(statsData);
            setCalendarData(calData);
        } catch (error) {
            console.error("Failed to fetch newsletter stats", error);
        }
    };

    useEffect(() => {
        fetchSlots();
    }, []);

    useEffect(() => {
        fetchStats();
    }, [genre, visibility, status, currentMonth]);

    const handleEditClick = (slot) => {
        setSelectedSlot(slot);
        setEditOpen(true);
    };

    const handleDeleteClick = (slot) => {
        setSelectedSlot(slot);
        setDeleteOpen(true);
    };

    const PendingSwapIcon = ({ size = 20 }) => <img src={pendingSwapIcon} alt="Pending" style={{ width: "28px", height: "29px" }} />;
    const ConfirmedSwapIcon = ({ size = 20 }) => <img src={confirmedSwapIcon} alt="Confirmed" style={{ width: "31px", height: "30px" }} />;
    const VerifiedSentIcon = ({ size = 20 }) => <img src={verifiedSentIcon} alt="Verified" style={{ width: "31px", height: "30px" }} />;
    const NewsIcon = ({ size = 20 }) => <img src={newsIcon} alt="News" style={{ width: "33px", height: "32px" }} />;
    const SwapIcon = ({ width = 20, height = 20 }) => (
        <img
            src={Swap}
            alt="Swap"
            style={{
                width: "31px",
                height: "29px",
            }}
        />
    );

    const stats = [
        { label: "Total", value: String(newsletterStats.total ?? newsletterStats.total_slots ?? 0), icon: NewsIcon },
        { label: "Published Slots", value: String(newsletterStats.published_slots ?? 0), icon: SwapIcon },
        { label: "Pending swap requests", value: String(newsletterStats.pending_swaps ?? newsletterStats.pending_swap_requests ?? 0), icon: PendingSwapIcon },
        { label: "Confirmed swaps", value: String(newsletterStats.confirmed_swaps ?? 0), icon: ConfirmedSwapIcon },
        { label: "Verified sent", value: String(newsletterStats.verified_sent ?? 0), icon: VerifiedSentIcon },
    ];

    return (
        <div className="pb-10 max-w-full overflow-hidden">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Newsletter & Slot Management</h1>
                <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">Schedule, manage, and track your newsletter promotions</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="
                bg-white rounded-[10px] 
                border border-[#B5B5B5] 
                p-4 flex flex-col gap-4 justify-between 
                shadow-sm min-h-[110px]
                transition-all duration-300
                hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                hover:-translate-y-1
            "
                    >
                        <div className="flex justify-between items-start gap-2">
                            <div className="w-10 h-10 rounded-lg">
                                <stat.icon size={24} />
                            </div>
                            <span className="text-[11px] md:text-[12px] font-medium text-[#374151] text-right mt-1.5 leading-tight flex-1">
                                {stat.label}
                            </span>
                        </div>
                        <div className="text-xl md:text-2xl font-bold text-gray-900 leading-none">
                            {stat.value}
                        </div>
                    </div>
                ))}
            </div>
            <div className="relative flex flex-col gap-4 mb-8 2xl:flex-row 2xl:items-center 2xl:justify-between">
                <h2 className="text-lg font-medium text-gray-800 whitespace-nowrap">
                    All Slots for{" "}
                    {selectedDate.format("MMMM D, YYYY")}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Genre Filter */}
                        <div className="relative">
                            <button onClick={() => setOpenDropdown(openDropdown === "genre" ? null : "genre")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-[#111827]">
                                {genre}
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${openDropdown === "genre" ? "rotate-180" : ""}`} />
                            </button>
                            {openDropdown === "genre" && (
                                <>
                                    <div className="fixed inset-0 z-[9998]" onClick={() => setOpenDropdown(null)} />
                                    <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-[9999]">
                                        <button onClick={() => { setGenre("Genre"); setSelectedGenreValue(""); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50">Select Genre</button>
                                        {genres.map((g) => (
                                            <button key={g.value} onClick={() => { setGenre(g.label); setSelectedGenreValue(g.value); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50">{g.label}</button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Visibility Filter */}
                        <div className="relative">
                            <button onClick={() => setOpenDropdown(openDropdown === "visibility" ? null : "visibility")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-[#111827]">
                                {visibility}
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${openDropdown === "visibility" ? "rotate-180" : ""}`} />
                            </button>
                            {openDropdown === "visibility" && (
                                <>
                                    <div className="fixed inset-0 z-[9998]" onClick={() => setOpenDropdown(null)} />
                                    <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-[9999]">
                                        {["All Visibility", "Public", "Friend Only", "Hidden", "Single Use Private Link"].map((item) => (
                                            <button key={item} onClick={() => { setVisibility(item); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50">{item}</button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <button onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-[#111827]">
                                {status}
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${openDropdown === "status" ? "rotate-180" : ""}`} />
                            </button>
                            {openDropdown === "status" && (
                                <>
                                    <div className="fixed inset-0 z-[9998]" onClick={() => setOpenDropdown(null)} />
                                    <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-[9999]">
                                        {["All Status", "Available", "Pending", "Confirmed", "Verified", "Published"].map((item) => (
                                            <button key={item} onClick={() => { setStatus(item); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50">{item}</button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Export Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                                className="flex items-center gap-2 px-5 py-2 bg-white border border-gray-200 rounded-[8px] text-[13px] font-medium text-[#111827]"
                            >
                                <Download size={16} />
                                Export With
                                <ChevronDown
                                    size={14}
                                    className={`text-gray-400 transition-transform ${exportDropdownOpen ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            {exportDropdownOpen && (
                                <>
                                    <div className="fixed inset-0 z-[9998]" onClick={() => setExportDropdownOpen(false)} />
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-[9999]">
                                        <button
                                            onClick={handleExportGoogle}
                                            className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50"
                                        >
                                            Google Calendar
                                        </button>

                                        <button
                                            onClick={handleExportOutlook}
                                            className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50"
                                        >
                                            Outlook
                                        </button>

                                        <button
                                            onClick={handleExportICS}
                                            className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50"
                                        >
                                            Download ICS File
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-5 py-2 bg-[#2F6F6D] text-white rounded-[8px] text-[13px] font-medium">
                        <Plus size={16} />
                        Add New Slot
                    </button>

                    <AddNewsSlot isOpen={open} onClose={() => setOpen(false)} onSubmit={async () => { await fetchSlots(); await fetchStats(); setOpen(false); }} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
                {/* CALENDAR */}
                <div className="xl:col-span-3 bg-white rounded-[12px] border border-[#B5B5B5] p-4 shadow-sm">
                    <div className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                            >
                                <IoChevronBack size={20} />
                            </button>
                            <h3 className="text-[17px] font-medium text-[#111827] tracking-tight">
                                {currentMonth.format("MMMM YYYY")} Calendar
                            </h3>
                            <button
                                onClick={() => setCurrentMonth(currentMonth.add(1, "month"))}
                                className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
                            >
                                <IoChevronForward size={20} />
                            </button>
                        </div>
                        <button
                            onClick={() => {
                                const now = dayjs();
                                setCurrentMonth(now);
                                setSelectedDate(now);
                            }}
                            className="text-[17px] font-medium text-[#4B5563] hover:text-[#111827] transition-colors"
                        >
                            Today
                        </button>
                    </div>

                    <div className="grid grid-cols-7 border-l border-t border-gray-200 rounded-tl-xl overflow-hidden">
                        {days.map((day) => (
                            <div
                                key={day}
                                className="py-3 text-center text-[12px] font-medium text-gray-500 border-r border-b border-gray-100 bg-gray-50/10"
                            >
                                {day}
                            </div>
                        ))}
                        {calendarDays.map((date, idx) => {
                            const isCurrentMonth = date.isSame(currentMonth, "month");
                            const isToday = date.isSame(today, "day");

                            // Get pre-calculated daily highlights from API response
                            const dayApiData = calendarData.find(d => d.date === date.format("YYYY-MM-DD"));

                            let bgColor = "bg-white";
                            if (!isCurrentMonth) {
                                bgColor = "bg-[#F3F4F64D]"; // Subtle light grey for other months
                            } else if (dayApiData?.has_slots) {
                                // Background Priority matching YOUR response keys
                                if (dayApiData.has_verified) bgColor = "bg-[#9FB5B3]";
                                else if (dayApiData.has_confirmed) bgColor = "bg-[#87D1A1]";
                                else if (dayApiData.has_pending) bgColor = "bg-[#FDE7C4]";
                                else if (dayApiData.has_published) bgColor = "bg-[#F1B9AA]";
                                else if (dayApiData.has_available) bgColor = "bg-[#16A34A33]";
                                else bgColor = "bg-[#F3F4F6]";
                            }

                            return (
                                <div
                                    key={idx}
                                    onClick={() => setSelectedDate(date)}
                                    className={`h-24 md:h-28 p-2 border-r border-b border-gray-100 relative transition-all cursor-pointer hover:opacity-80
                                        ${bgColor} 
                                        ${isToday ? "ring-1 ring-inset ring-[#E07A5F33]" : ""}
                                        ${date.isSame(selectedDate, "day") ? "ring-2 ring-inset ring-[#2F6F6D] z-10" : ""}
                                    `}
                                >
                                    <span
                                        className={`text-[12px] font-medium 
                                            ${!isCurrentMonth ? "text-gray-300" : "text-gray-500"} 
                                            ${isToday ? "text-[#E07A5F] font-bold underline decoration-2 underline-offset-4" : ""}
                                            ${date.isSame(selectedDate, "day") ? "text-[#2F6F6D]" : ""}
                                        `}
                                    >
                                        {date.format("D")}
                                    </span>

                                </div>
                            );
                        })}
                    </div>

                    {/* LEGEND */}
                    <div className="flex flex-wrap gap-x-8 gap-y-3 mt-8 justify-center">
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-[4px] bg-[#16A34A33] shadow-sm border border-teal-100" />
                            <span className="text-[14px] font-medium text-[#374151]">Available slots</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-[4px] bg-[#F1B9AA] shadow-sm" />
                            <span className="text-[14px] font-medium text-[#374151]">Published slots</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-[4px] bg-[#87D1A1] shadow-sm" />
                            <span className="text-[14px] font-medium text-[#374151]">Confirmed Slots</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-[4px] bg-[#FDE7C4] shadow-sm" />
                            <span className="text-[14px] font-medium text-[#374151]">Pending slots</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded-[4px] bg-[#9FB5B3] shadow-sm" />
                            <span className="text-[14px] font-medium text-[#374151]">verified slots</span>
                        </div>
                    </div>
                </div>

                {/* SLOTS LIST */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    {["Morning", "Afternoon", "Evening"].map((period) => (
                        <div key={period}>
                            <h3 className="text-[11px] font-medium text-[#374151] mb-4 uppercase tracking-[0.2em] border-b border-[#2F6F6D33] pb-2">{period}</h3>
                            <div className="space-y-4">
                                {(() => {
                                    const periodSlots = slots
                                        .filter(s => dayjs(s.raw_data.send_date).isSame(selectedDate, "day"))
                                        .filter(s => s.period === period)
                                        .filter(s => {
                                            if (genre === "Genre") return true;
                                            return s.rawGenre === selectedGenreValue.toLowerCase();
                                        })
                                        .filter(s => {
                                            if (visibility === "All Visibility") return true;
                                            const vKey = visibility === "Public" ? "Public" : visibility.toLowerCase().replace(/ /g, "_");
                                            return s.rawVisibility === vKey.toLowerCase();
                                        })
                                        .filter(s => {
                                            if (status === "All Status") return true;
                                            const targetStatus = status.toLowerCase();
                                            // Handle mapping variations like Verified vs Verified Sent
                                            if (targetStatus === "verified") {
                                                return s.rawStatus === "verified" || s.rawStatus === "verified_sent";
                                            }
                                            return s.rawStatus === targetStatus;
                                        });

                                    if (periodSlots.length === 0) {
                                        return (
                                            <div className="text-center py-10 text-gray-400 text-xs italic border border-dashed border-gray-200 rounded-2xl bg-gray-50/30">
                                                No {period.toLowerCase()} slots available
                                            </div>
                                        );
                                    }

                                    return periodSlots.map((slot) => (
                                        <div key={slot.id} className="bg-white rounded-2xl border border-[#B5B5B5] p-5 hover:border-[#E07A5F]">
                                            <div className="flex flex-col gap-4">
                                                <div className="flex items-start justify-between">
                                                    <h4 className="text-[15px] font-semibold text-[#111827]">{slot.time}</h4>
                                                    <span className={`px-3 py-1 text-[11px] font-normal rounded-full ${slot.statusColor}`}>{slot.status}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="px-3 py-1 bg-[#16A34A33] rounded-full text-[11px] font-normal">{slot.genre}</span>
                                                    <span className="px-3 py-1 bg-[#E07A5F33] rounded-full text-[11px] font-normal flex items-center gap-1"><Users size={12} />{slot.partners}</span>
                                                    <span className="px-3 py-1 bg-[#E8E8E8] rounded-full text-[11px] font-normal flex items-center gap-1"><MdOutlineRemoveRedEye size={12} />{slot.visibility}</span>
                                                </div>
                                                <div className="flex items-end justify-between pt-3 border-t border-gray-100">
                                                    <div>
                                                        <p className="text-[12px] text-gray-500">Audience size:</p>
                                                        <p className="text-[16px] font-semibold text-gray-900">{Number(slot.audience).toLocaleString("en-US")}</p>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button onClick={() => { setSelectedSlot(slot); setDetailsOpen(true); }} className="p-2 bg-[#2F6F6D33] hover:bg-[#2F6F6D33] rounded-[4px] transition">
                                                        <Eye size={14} className="text-gray-600" />
                                                    </button>
                                                    {slot.status === "Available" && (
                                                        <>
                                                            <button onClick={() => handleEditClick(slot)} className="p-2 bg-[#2F6F6D33] hover:bg-[#2F6F6D33] rounded-[4px] transition">
                                                                <img src={Edit} alt="Edit" className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(slot)} className="p-2 bg-[#2F6F6D33] hover:bg-[#2F6F6D33] rounded-[4px] transition">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </>
                                                    )}
                                                    {/* Individual Slot Export Dropdown */}
                                                    <div className="relative">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setOpenDropdown(openDropdown === `export_${slot.id}` ? null : `export_${slot.id}`);
                                                            }}
                                                            className="p-2 bg-[#2F6F6D33] hover:bg-[#2F6F6D33] rounded-[4px] transition"
                                                            title="Export Slot"
                                                        >
                                                            <Download size={14} className="text-gray-600" />
                                                        </button>
                                                        {openDropdown === `export_${slot.id}` && (
                                                            <>
                                                                <div className="fixed inset-0 z-[9998]" onClick={() => setOpenDropdown(null)} />
                                                                <div className="absolute left-0 bottom-full mb-2 w-44 bg-white border border-gray-200 shadow-xl rounded-xl py-2 z-[9999]">
                                                                    <button
                                                                        onClick={() => handleSlotExport(slot.id, "google")}
                                                                        className="w-full text-left px-4 py-2 text-[12px] text-gray-600 hover:bg-gray-50 bg-white"
                                                                    >
                                                                        Google Calendar
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSlotExport(slot.id, "outlook")}
                                                                        className="w-full text-left px-4 py-2 text-[12px] text-gray-600 hover:bg-gray-50 bg-white"
                                                                    >
                                                                        Outlook Calendar
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleSlotExport(slot.id, "ics")}
                                                                        className="w-full text-left px-4 py-2 text-[12px] text-gray-600 hover:bg-gray-50 bg-white"
                                                                    >
                                                                        Download ICS File
                                                                    </button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    ));
                                })()}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MODALS */}
            {selectedSlot && (
                <>
                    <EditNewsSlot
                        isOpen={editOpen}
                        slotData={selectedSlot}
                        onClose={() => { setEditOpen(false); setSelectedSlot(null); }}
                        onSave={async (data) => {
                            try {
                                await updateNewsSlot(selectedSlot.id, data);
                                await fetchSlots();
                                await fetchStats();
                                setEditOpen(false);
                                setSelectedSlot(null);
                                toast.success("Slot updated successfully");
                            } catch (error) {
                                console.error("Update failed", error);
                                toast.error("Failed to update slot");
                            }
                        }}
                    />

                    <DeleteNewsSlot
                        isOpen={deleteOpen}
                        onClose={() => { setDeleteOpen(false); setSelectedSlot(null); }}
                        onConfirm={async () => {
                            try {
                                await deleteNewsSlot(selectedSlot.id);
                                await fetchSlots();
                                await fetchStats();
                                setDeleteOpen(false);
                                setSelectedSlot(null);
                                toast.success("Slot deleted successfully");
                            } catch (error) {
                                console.error("Deletion failed", error);
                                toast.error("Failed to delete slot");
                            }
                        }}
                        slotName={selectedSlot.time}
                    />

                    <SlotDetails
                        isOpen={detailsOpen}
                        onClose={() => { setDetailsOpen(false); setSelectedSlot(null); }}
                        slotId={selectedSlot.id}
                    />
                </>
            )}
        </div>
    );
};

export default Newsletter;