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
import dayjs from "dayjs";
import { IoChevronDown, IoChevronBack, IoChevronForward } from "react-icons/io5";
import { updateNewsSlot, getNewsSlot, deleteNewsSlot } from "../../../apis/newsletter";
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
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedGenreValue, setSelectedGenreValue] = useState("");
    const [genres, setGenres] = useState([]);
    const [loadingGenres, setLoadingGenres] = useState(true);

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
        const hour = parseInt(time.split(":")[0], 10);
        if (hour < 12) return "Morning";
        if (hour < 17) return "Afternoon";
        return "Evening";
    };

    const fetchSlots = async () => {
        try {
            setLoading(true);
            const response = await getNewsSlot();
            const dataArray = response.data.data || [];
            const formatted = dataArray.map(item => ({
                id: item.id,
                time: `${item.formatted_date} ${item.formatted_time}`,
                period: getPeriod(item.send_time) || formatLabel(item.time_period),
                genre: formatLabel(item.preferred_genre),
                partners: `0/${item.max_partners} Partners`,
                visibility: formatLabel(item.visibility),
                audience: item.audience_size,
                status: formatLabel(item.status),
                statusColor:
                    item.status === "available"
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

    useEffect(() => {
        fetchSlots();
    }, []);

    const handleEditClick = (slot) => {
        setSelectedSlot(slot);
        setEditOpen(true);
    };

    const handleDeleteClick = (slot) => {
        setSelectedSlot(slot);
        setDeleteOpen(true);
    };

    const StatsIcon = ({ icon: Icon, size = 36 }) => {
        if (typeof Icon === "function" && Icon.name.includes("Icon")) {
            return <Icon size={size} />;
        }
        return <Icon size={size} />;
    };

    const PendingSwapIcon = ({ size = 36 }) => <img src={pendingSwapIcon} alt="Pending" width={size} height={size} />;
    const ConfirmedSwapIcon = ({ size = 36 }) => <img src={confirmedSwapIcon} alt="Confirmed" width={size} height={size} />;
    const VerifiedSentIcon = ({ size = 36 }) => <img src={verifiedSentIcon} alt="Verified" width={size} height={size} />;
    const NewsIcon = ({ size = 36 }) => <img src={newsIcon} alt="News" width={size} height={size} />;

    const stats = [
        { label: "Total", value: slots.length.toString(), icon: NewsIcon },
        { label: "Published Slots", value: slots.filter(s => s.status === "Available").length.toString(), icon: Publish },
        { label: "Pending swap requests", value: "4", icon: PendingSwapIcon },
        { label: "Confirmed swaps", value: "12", icon: ConfirmedSwapIcon },
        { label: "Verified sent", value: "12", icon: VerifiedSentIcon },
    ];

    return (
        <div className="pb-10">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Newsletter & Slot Management</h1>
                <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">Schedule, manage, and track your newsletter promotions</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-[10px] border border-[#B5B5B5] p-3 sm:p-4 flex flex-col gap-3 justify-between shadow-sm min-h-[100px]">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div className="w-10 h-10 flex items-center justify-center">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-[#374151]">{stat.label}</span>
                        </div>
                        <div className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">{stat.value}</div>
                    </div>
                ))}
            </div>

            <div className="relative flex flex-col gap-4 mb-8 xl:flex-row xl:items-center xl:justify-between">
                <h2 className="text-lg font-medium text-gray-800">All Slots</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Genre Filter */}
                        <div className="relative">
                            <button onClick={() => setOpenDropdown(openDropdown === "genre" ? null : "genre")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-[#111827]">
                                {genre}
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${openDropdown === "genre" ? "rotate-180" : ""}`} />
                            </button>
                            {openDropdown === "genre" && (
                                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-[9999]">
                                    <button onClick={() => { setGenre("Genre"); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50">Select Genre</button>
                                    {genres.map((g) => (
                                        <button key={g.value} onClick={() => { setGenre(g.label); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50">{g.label}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Visibility Filter */}
                        <div className="relative">
                            <button onClick={() => setOpenDropdown(openDropdown === "visibility" ? null : "visibility")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-[#111827]">
                                {visibility}
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${openDropdown === "visibility" ? "rotate-180" : ""}`} />
                            </button>
                            {openDropdown === "visibility" && (
                                <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-[9999]">
                                    {["All Visibility", "Public", "Friend Only", "Private"].map((item) => (
                                        <button key={item} onClick={() => { setVisibility(item); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50">{item}</button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div className="relative">
                            <button onClick={() => setOpenDropdown(openDropdown === "status" ? null : "status")} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-[13px] font-medium text-[#111827]">
                                {status}
                                <ChevronDown size={14} className={`text-gray-400 transition-transform ${openDropdown === "status" ? "rotate-180" : ""}`} />
                            </button>
                            {openDropdown === "status" && (
                                <div className="absolute left-0 mt-2 w-44 bg-white border border-gray-200 shadow-xl rounded-2xl py-2 z-[9999]">
                                    {["All Status", "Available", "Booked", "Pending"].map((item) => (
                                        <button key={item} onClick={() => { setStatus(item); setOpenDropdown(null); }} className="w-full text-left px-4 py-2 text-[13px] text-gray-600 hover:bg-gray-50">{item}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button onClick={() => setOpen(true)} className="flex items-center gap-2 px-5 py-2 bg-[#2F6F6D] text-white rounded-[8px] text-[13px] font-medium">
                        <Plus size={16} />
                        Add New Slot
                    </button>

                    <AddNewsSlot isOpen={open} onClose={() => setOpen(false)} onSubmit={async () => { await fetchSlots(); setOpen(false); }} />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8 items-start">
                {/* CALENDAR */}
                <div className="xl:col-span-3 bg-white rounded-[10px] border border-[#B5B5B5] p-5 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <button onClick={() => setCurrentMonth(currentMonth.subtract(1, "month"))} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"><IoChevronBack size={18} /></button>
                            <button onClick={() => setCurrentMonth(currentMonth.add(1, "month"))} className="p-1 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"><IoChevronForward size={18} /></button>
                            <h3 className="text-sm md:text-base font-bold text-gray-900 tracking-tight ml-1">{currentMonth.format("MMMM YYYY")}</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-7 border-l border-t border-gray-50">
                        {days.map((day) => (
                            <div key={day} className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase border-r border-b border-gray-50 bg-gray-50/20">{day}</div>
                        ))}
                        {calendarDays.map((date, idx) => {
                            const isCurrentMonth = date.isSame(currentMonth, "month");
                            const isToday = date.isSame(today, "day");
                            const hasSlot = slots.some(s => dayjs(s.raw_data.send_date).isSame(date, "day"));
                            return (
                                <div key={idx} className={`h-16 md:h-20 p-1.5 border-r border-b border-gray-50 relative ${!isCurrentMonth ? "bg-gray-50/30" : "bg-white"}`}>
                                    <span className={`text-[10px] md:text-[11px] font-bold ${!isCurrentMonth ? "text-gray-300" : "text-gray-500"} ${isToday ? "text-[#E07A5F]" : ""}`}>{date.date()}</span>
                                    {hasSlot && <div className="absolute bottom-1 left-1.5 h-1.5 w-1.5 rounded-full bg-[#2F6F6D]" />}
                                    {isToday && <span className="absolute bottom-1 right-1.5 text-[8px] font-bold text-[#E07A5F] uppercase">Today</span>}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* SLOTS LIST */}
                <div className="xl:col-span-2 flex flex-col gap-6">
                    {["Morning", "Afternoon", "Evening"].map((period) => (
                        <div key={period}>
                            <h3 className="text-[11px] font-medium text-[#374151] mb-4 uppercase tracking-[0.2em] border-b border-[#2F6F6D33] pb-2">{period}</h3>
                            <div className="space-y-4">
                                {slots
                                    .filter(s => s.period === period)
                                    .filter(s => (genre === "Genre" || s.genre === genre))
                                    .filter(s => (visibility === "All Visibility" || s.visibility === visibility))
                                    .filter(s => (status === "All Status" || s.status === status))
                                    .map((slot) => (
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
                                                        <p className="text-[12px] text-gray-500">Audience:</p>
                                                        <p className="text-[16px] font-semibold text-gray-900">{Number(slot.audience).toLocaleString("en-US")}</p>
                                                    </div>

                                                </div>

                                                <div className="flex gap-2">
                                                    {slot.status === "Available" ? (
                                                        <>
                                                            <button onClick={() => handleEditClick(slot)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                                                <img src={Edit} alt="Edit" className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => handleDeleteClick(slot)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button onClick={() => { setSelectedSlot(slot); setDetailsOpen(true); }} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition">
                                                            <Eye size={14} className="text-gray-600" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
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
