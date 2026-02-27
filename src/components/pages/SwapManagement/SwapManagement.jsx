import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getSwaps, acceptSwap, declineSwap, restoreSwap, trackSwap, getSwapHistory } from '../../../apis/swap';
import { FiRefreshCw } from "react-icons/fi";
import { formatCamelCaseName } from '../../../utils/formatName';
import toast from 'react-hot-toast';
import SwapDetailsModal from './SwapDetailsModal';

const tabs = [
    { label: "All Swaps", key: "all" },
    { label: "Pending Swaps", key: "pending" },
    { label: "Sending Swaps", key: "sending" },
    { label: "Reject Swaps", key: "rejected" },
    { label: "Scheduled Swaps", key: "scheduled" },
    { label: "Completed Swaps", key: "completed" }
];


const formatLabel = (str) => {
    if (!str) return "";
    return str
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

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

const SwapCard = ({ data, onRefresh, onViewDetails }) => {
    const navigate = useNavigate();
    const [actionLoading, setActionLoading] = useState(null);
    const isCompleted = data.status === "completed" || data.status === "complete";
    const isRejected = data.status === "rejected" || data.status === "reject";
    const isPending = data.status === "pending" || data.status === "incoming";
    const isSending = data.status === "sending";

    const authorName = data.author_name || data.author || "Unknown Author";
    const authorRole = data.author_genre_label || data.author_role || data.role || "Author";
    const authorImage = data.profile_picture || data.author_image || data.image || `https://ui-avatars.com/api/?name=${authorName}&background=random`;

    const handleAccept = async (e) => {
        e.stopPropagation();
        try {
            setActionLoading("accept");
            await acceptSwap(data.id);
            toast.success("Swap accepted!");
            onRefresh?.();
        } catch (error) {
            console.error("Failed to accept swap:", error);
            toast.error(error?.response?.data?.message || "Failed to accept swap");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDecline = async (e) => {
        e.stopPropagation();
        try {
            setActionLoading("decline");
            await declineSwap(data.id);
            toast.success("Swap declined.");
            onRefresh?.();
        } catch (error) {
            console.error("Failed to decline swap:", error);
            toast.error(error?.response?.data?.message || "Failed to decline swap");
        } finally {
            setActionLoading(null);
        }
    };

    const handleRestore = async (e) => {
        e.stopPropagation();
        try {
            setActionLoading("restore");
            await restoreSwap(data.id);
            toast.success("Swap restored!");
            onRefresh?.();
        } catch (error) {
            console.error("Failed to restore swap:", error);
            toast.error(error?.response?.data?.message || "Failed to restore swap");
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div
            onClick={onViewDetails}
            className={`p-5 rounded-[12px] border flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all h-full cursor-pointer hover:shadow-md
            ${isCompleted ? "bg-[#EBF5EE] border-[#16A34A]" : "bg-white border-[#B5B5B5]"}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex gap-2.5">
                    <img src={authorImage} alt={authorName} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div>
                        <h3 className="text-[13px] font-medium text-black leading-tight">{formatCamelCaseName(authorName)}</h3>

                        <p className="text-[13px] font-medium text-black">{authorRole}</p>
                    </div>
                </div>
                {(data.badge || data.status) && (
                    <span
                        className={`text-[9px] font-normal px-2.5 py-0.5 rounded-full border border-gray-200 
                        ${isCompleted ? "bg-[#16A34A33] text-black border-[#16A34A33]" : "bg-[#F3F4F6] text-[#374151]"}
                        `}
                    >
                        {formatLabel(data.badge || data.status)}
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
                    <p className="text-[13px] font-medium text-black truncate">
                        {typeof data.requesting_book === "object"
                            ? data.requesting_book?.title
                            : data.requesting_book ||
                            (typeof data.requestingBook === "object"
                                ? data.requestingBook?.title
                                : data.requestingBook) ||
                            "N/A"}
                    </p>
                </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
                <p className="text-[10px] text-[#374151] font-normal">Message</p>
                <p className="text-[12px] text-black font-semibold leading-tight">"{data.message || "No message provided"}"</p>
            </div>

            {/* Action logic per design */}
            <div className="mt-auto pt-2 space-y-3">
                {isPending && (
                    <div className="flex gap-2">
                        <button
                            onClick={(e) => { e.stopPropagation(); handleDecline(e); }}
                            disabled={actionLoading === "decline"}
                            className="px-6 py-2 border border-[#DC2626] text-[#DC2626] rounded-[6px] text-xs font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                            Decline
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); handleAccept(e); }}
                            disabled={actionLoading === "accept"}
                            className="px-6 py-2 bg-[#16A34A] text-white rounded-[6px] text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            Accept
                        </button>
                    </div>
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
                        <button
                            onClick={(e) => { e.stopPropagation(); handleRestore(e); }}
                            disabled={actionLoading === "restore"}
                            className="px-6 py-2 border border-[#B5B5B5] text-black rounded-[6px] text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Restore
                        </button>
                    </div>
                )}

                {isCompleted && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/swap-history/${data.id}`, { state: { data } });
                        }}
                        className="w-fit px-5 py-2.5 bg-[#2F6F6D] text-white rounded-[6px] text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                        View Swap History
                    </button>
                )}

                {isSending && (
                    <div className="bg-[#F59E0B33] text-[#374151] text-[10px] font-medium px-3 py-1.5 rounded-md w-fit">
                        Waiting for partner response
                    </div>
                )}

                {data.status === "scheduled" && (
                    <div className="bg-[#F59E0B33] text-[#374151] text-[10px] font-medium px-3 py-1.5 rounded-md w-fit">
                        Scheduled for {data.scheduled_date || data.send_date || "N/A"}
                    </div>
                )}

                {(data.status === "accepted" || data.status === "confirmed" || data.status === "active") && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/track-swap/${data.id}`, { state: { data } });
                        }}
                        className="w-fit bg-[#2F6F6D] text-white text-[12px] font-medium px-6 py-2.5 rounded-[6px] hover:opacity-90 transition-opacity"
                    >
                        Track My Swap
                    </button>
                )}
            </div>
        </div>
    );
};

const SwapManagement = () => {
    const [swaps, setSwaps] = useState([]);
    const [tabCounts, setTabCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [detailsId, setDetailsId] = useState(null);

    const fetchSwaps = async (tabKey = "all") => {
        try {
            setLoading(true);
            const response = await getSwaps(tabKey);
            const responseData = response.data;
            let data = responseData.results || responseData || [];

            if (responseData.tab_counts) {
                setTabCounts(responseData.tab_counts);
            }

            // Fallback to static data if API returns empty list
            if (data.length === 0 && tabKey === "all") {
                console.log("No dynamic swaps found, showing static fallback data.");
                data = staticSwaps;
            }
            setSwaps(data);
        } catch (error) {
            console.error("Failed to fetch swaps, showing static fallback data:", error);
            if (activeTab.key === "all") {
                setSwaps(staticSwaps);
            } else {
                setSwaps([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSwaps(activeTab.key);
    }, [activeTab]);

    const filtered = (Array.isArray(swaps) ? swaps : []).filter((s) => {
        const sStatus = (s.status || "").toLowerCase();
        const sCategory = (s.category || "").toLowerCase();
        const tKey = activeTab.key.toLowerCase();

        // Since we fetch per tab, we should trust the API if it's not the "all" tab.
        // But we keep some filtering for robustness and for the "all" tab.
        let isTabMatch = tKey === "all";

        if (!isTabMatch) {
            // Check exact match
            if (sStatus === tKey || sCategory === tKey) {
                isTabMatch = true;
            }
            // Check common variations
            else if (tKey === "completed" && sStatus === "complete") isTabMatch = true;
            else if (tKey === "pending" && sStatus === "incoming") isTabMatch = true;
            else if (tKey === "rejected" && sStatus === "reject") isTabMatch = true;
            else if (tKey === "sending" && sStatus === "active") isTabMatch = true;
            // Robustness: If the API returned it for a specific tab, it's likely meant to be there
            else if (activeTab.key !== "all") isTabMatch = true;
        }

        const authorName = (s.author_name || s.author || "").toLowerCase();
        const rawBook = s.requesting_book || s.requestingBook;
        const bookName =
            typeof rawBook === "string"
                ? rawBook.toLowerCase()
                : typeof rawBook === "object" && rawBook !== null
                    ? (rawBook.title || rawBook.name || "").toLowerCase()
                    : "";
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
            <div className="flex flex-wrap gap-1 bg-white p-1.5 rounded-[8px] border border-[#2F6F6D] w-fit mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-[12px] font-medium rounded-[6px] transition-all
                        ${activeTab.key === tab.key ? "bg-[#2F6F6D] text-white" : "text-[#374151] hover:bg-gray-50"}
                        `}
                    >
                        {tab.label} {tabCounts[tab.key] !== undefined ? `(${tabCounts[tab.key]})` : ""}
                    </button>
                ))}

            </div>

            {/* Content Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-[24px] font-medium text-black">{activeTab.label}</h2>

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
                                <SwapCard
                                    key={swap.id}
                                    data={swap}
                                    onRefresh={() => fetchSwaps(activeTab.key)}
                                    onViewDetails={() => {
                                        setDetailsId(swap.id);
                                        setIsDetailsOpen(true);
                                    }}
                                />
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

            <SwapDetailsModal
                isOpen={isDetailsOpen}
                swapId={detailsId}
                onClose={() => {
                    setIsDetailsOpen(false);
                    setDetailsId(null);
                }}
            />
        </div>
    );
};

export default SwapManagement;
