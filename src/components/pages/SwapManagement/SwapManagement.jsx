import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getSwaps } from '../../../apis/swap';
import { FiRefreshCw } from "react-icons/fi";

const tabs = [
    "All Swaps",
    "Pending Swaps",
    "Sending Swaps",
    "Reject Swaps",
    "Scheduled Swaps",
    "Completed Swaps"
];

const staticSwaps = [
    {
        id: 101,
        author_name: "Sophia Patel",
        author_role: "Fantasy Writer",
        author_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        audience_size: "12k",
        reliability_score: "98%",
        requesting_book: "The Midnight Garden",
        message: "I'd love to swap newsletter slots for our February releases.",
        status: "pending",
        badge: "Pending",
        category: "pending"
    },
    {
        id: 102,
        author_name: "Marcus Lee",
        author_role: "Sci-Fi Author",
        author_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        audience_size: "8.5k",
        reliability_score: "94%",
        requesting_book: "Starlight Void",
        message: "Great opportunity to reach more readers in the tech-thriller space.",
        status: "completed",
        badge: "Completed",
        category: "completed"
    },
    {
        id: 103,
        author_name: "Elena Rodriguez",
        author_role: "Romance Novelist",
        author_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        audience_size: "25k",
        reliability_score: "99%",
        requesting_book: "Summer in Seville",
        message: "Your audience fits perfectly with my latest romance series!",
        status: "active",
        badge: "Active",
        category: "sending"
    },
    {
        id: 104,
        author_name: "James Wilson",
        author_role: "Mystery Writer",
        author_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        audience_size: "5.2k",
        reliability_score: "85%",
        requesting_book: "The Hidden Clue",
        message: "Looking for a cross-promo for my upcoming book launch.",
        status: "rejected",
        badge: "Rejected",
        category: "reject",
        rejection_reason: "Audience mismatch in specific genre niches.",
        rejection_date: "12 Feb, 2026"
    }
];

const SwapCard = ({ data }) => {
    const navigate = useNavigate();
    const isCompleted = data.status === "completed";
    const isRejected = data.status === "rejected" || data.status === "reject";

    const authorName = data.author_name || data.author || "Unknown Author";
    const authorRole = data.author_role || data.role || "Author";
    const authorImage = data.author_image || data.image || `https://ui-avatars.com/api/?name=${authorName}&background=random`;

    return (
        <div
            className={`p-5 rounded-[12px] border flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all h-full
            ${isCompleted ? "bg-[#EBF5EE] border-[#16A34A]" : "bg-white border-[#B5B5B5]"}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex gap-2.5">
                    <img src={authorImage} alt={authorName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div>
                        <h3 className="text-[13px] font-medium text-black leading-tight">{authorName}</h3>
                        <p className="text-[13px] font-medium text-black">{authorRole}</p>
                    </div>
                </div>
                {(data.badge || data.status) && (
                    <span
                        className={`text-[9px] font-normal px-2.5 py-0.5 rounded-full border border-gray-200 uppercase
                        ${isCompleted ? "bg-[#16A34A33] text-black border-[#16A34A33]" : "bg-[#F3F4F6] text-[#374151]"}
                        `}
                    >
                        {data.badge || data.status}
                    </span>
                )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-1">
                <div>
                    <p className="text-[10px] text-[#374151] font-normal mb-1">Audience Size</p>
                    <p className="text-[13px] font-medium text-black">{data.audience_size || data.audienceSize || "N/A"}</p>
                </div>
                <div>
                    <p className="text-[10px] text-[#374151] font-normal mb-1">Reliability Score</p>
                    <p className="text-[13px] font-medium text-black">{data.reliability_score || data.reliabilityScore || "N/A"}</p>
                </div>
                <div>
                    <p className="text-[10px] text-[#374151] font-normal mb-1">Requesting Book</p>
                    <p className="text-[13px] font-medium text-black truncate">{data.requesting_book || data.requestingBook || "N/A"}</p>
                </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
                <p className="text-[10px] text-[#374151] font-normal">Message</p>
                <p className="text-[12px] text-black font-semibold leading-tight italic">"{data.message || "No message provided"}"</p>
            </div>

            {/* Actions / Status Specifics */}
            <div className="mt-auto pt-2 space-y-4">
                {data.status === "incoming" && (
                    <div className="flex gap-2">
                        <button className="px-5 py-1.5 border border-[#DC2626] text-[#DC2626] rounded-[6px] text-[12px] font-medium hover:bg-red-50">
                            Decline
                        </button>
                        <button className="px-5 py-1.5 bg-[#16A34A] text-white rounded-[6px] text-[12px] font-medium">
                            Accept
                        </button>
                    </div>
                )}

                {(data.status_note || data.statusNote) && (
                    <div
                        className={`text-[9px] font-medium px-3 py-1 rounded-full w-fit bg-[#F59E0B33]`}
                    >
                        {data.status_note || data.statusNote}
                    </div>
                )}

                {(data.status === "active" || data.status === "scheduled" || isCompleted) && (
                    <button
                        onClick={() => navigate(`/swap-history/${data.id}`, { state: { data } })}
                        className="bg-[#2F6F6D] text-white text-[12px] font-medium px-4 py-2 rounded-[6px] w-full"
                    >
                        Track My Swap
                    </button>
                )}

                {isRejected && (
                    <div className="space-y-3">
                        <div className="bg-[#FEF2F2] p-3 rounded-[8px] border border-[#FEE2E2]">
                            <h4 className="text-[12px] font-bold text-[#DC2626] mb-1">Rejection Reason</h4>
                            <p className="text-[12px] text-[#374151] leading-tight">{data.rejection_reason || data.rejectionReason || "No reason specified"}</p>
                            <p className="text-[10px] text-[#374151] opacity-70 mt-2">
                                {data.rejection_date || data.rejectionDate || "Unknown date"}
                            </p>
                        </div>
                        <button className="inline-block border border-[#B5B5B5] px-5 py-1.5 text-[12px] font-bold rounded-[6px] hover:bg-gray-50 text-black">
                            Restore
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const SwapManagement = () => {
    const [swaps, setSwaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All Swaps");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchSwaps = async () => {
            try {
                setLoading(true);
                const response = await getSwaps();
                let data = response.data?.results || response.data || [];
                // Fallback to static data if API returns empty list
                if (data.length === 0) {
                    console.log("No dynamic swaps found, showing static fallback data.");
                    data = staticSwaps;
                }
                setSwaps(data);
            } catch (error) {
                console.error("Failed to fetch swaps, showing static fallback data:", error);
                setSwaps(staticSwaps);
            } finally {
                setLoading(false);
            }
        };
        fetchSwaps();
    }, []);

    const filtered = (Array.isArray(swaps) ? swaps : []).filter((s) => {
        const isTabMatch = activeTab === "All Swaps" || (s.category || s.status || "").toLowerCase().includes(activeTab.split(" ")[0].toLowerCase());
        const authorName = (s.author_name || s.author || "").toLowerCase();
        const bookName = (s.requesting_book || s.requestingBook || "").toLowerCase();
        const isSearchMatch = authorName.includes(searchTerm.toLowerCase()) || bookName.includes(searchTerm.toLowerCase());
        return isTabMatch && isSearchMatch;
    });

    return (
        <div className="min-h-screen bg-white pb-10">
            {/* Header */}
            <div className="mb-3">
                <h1 className="text-2xl font-semibold">Swap Management</h1>
                <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">Request, manage, and track your newsletter partnerships</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 bg-white p-1 rounded-[8px] border border-[#2F6F6D] w-fit mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-[12px] font-medium rounded-[6px] transition-all
                        ${activeTab === tab ? "bg-[#2F6F6D] text-white" : "text-[#374151] hover:bg-gray-50"}
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-[24px] font-medium text-black">{activeTab}</h2>
                <div className="relative w-full max-w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search swaps by author, book, or date"
                        className="w-full pl-10 pr-4 py-2 bg-white border border-[#B5B5B5] rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid Container */}
            <div className="bg-white rounded-[12px] border border-[#B5B5B5] p-5">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <FiRefreshCw className="animate-spin text-[#2F6F6D] mb-4" size={40} />
                        <p className="text-gray-500 font-medium tracking-tight">Loading swaps...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filtered.map((swap) => (
                                <SwapCard key={swap.id} data={swap} />
                            ))}
                        </div>
                        {filtered.length === 0 && (
                            <div className="text-center py-16 text-gray-400 text-sm italic">
                                No swaps found matching your criteria.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SwapManagement;
