import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getSwaps, acceptSwap, declineSwap, restoreSwap, payForSwap } from '../../../apis/swap';
import { FiRefreshCw } from "react-icons/fi";
import { formatCamelCaseName } from '../../../utils/formatName';
import toast from 'react-hot-toast';
import SwapDetailsModal from './SwapDetailsModal';
import TrackSwapModal from './TrackSwapModal';
import DeclineReasonModal from './DeclineReasonModal';
import { useProfile } from '../../../context/ProfileContext';

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

/**
 * sender_name  = user who SENT / initiated the swap
 * author_name  = user who RECEIVED the swap request
 */
const getSwapRole = (data, currentUserName) => {
    const myName     = (currentUserName || "").toLowerCase().trim();
    const senderName = (data.sender_name || "").toLowerCase().trim();

    const isSender =
        !!myName &&
        !!senderName &&
        (myName === senderName ||
            senderName.includes(myName) ||
            myName.includes(senderName));

    return { isSender, isReceiver: !isSender };
};

const SwapCard = ({ data, onRefresh, onViewDetails, onDecline, currentUserName }) => {
    const navigate = useNavigate();
    const [actionLoading, setActionLoading] = useState(null);

    const { isSender, isReceiver } = getSwapRole(data, currentUserName);

    const status      = (data.status || "").toLowerCase();
    const isPending   = status === "pending" || status === "incoming";
    const isSending   = status === "sending";
    const isAccepted  = status === "accepted" || status === "confirmed" || status === "active";
    const isRejected  = status === "rejected"  || status === "reject";
    const isCompleted = status === "completed" || status === "complete";
    const isScheduled = status === "scheduled";

    // ── Payment flags (from API, not derived from status) ──
    const isPaidSwap    = data.eligible_for_pay === true;
    const isPaymentDone = data.payment_done === true;

    // A paid swap where payment hasn't been made yet —
    // this can happen on ANY status where the swap is "active/progressing"
    const paymentPending = isPaidSwap && !isPaymentDone;

    const authorName  = data.author_name || data.author || "Unknown Author";
    const authorRole  = data.author_genre_label || data.author_role || data.role || "Author";
    const authorImage =
        data.profile_picture ||
        data.author_image ||
        data.image ||
        `https://ui-avatars.com/api/?name=${authorName}&background=random`;

    // Card highlight: payment needed from THIS user
    const needsMyPayment = paymentPending && isSender;

    /* ── Handlers ── */
    const handleAccept = async (e) => {
        e.stopPropagation();
        try {
            setActionLoading("accept");
            await acceptSwap(data.id);
            toast.success("Swap accepted!");
            onRefresh?.();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to accept swap");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeclineClick = (e) => {
        e.stopPropagation();
        onDecline(data.id);
    };

    const handleRestore = async (e) => {
        e.stopPropagation();
        try {
            setActionLoading("restore");
            await restoreSwap(data.id);
            toast.success("Swap restored!");
            onRefresh?.();
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to restore swap");
        } finally {
            setActionLoading(null);
        }
    };

    const handlePayNow = async (e) => {
        e.stopPropagation();
        try {
            setActionLoading("pay");
            const response = await payForSwap(data.id);
            const checkoutUrl = response?.data?.checkout_url || response?.data?.url;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                toast.error("Could not get payment link. Please try again.");
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to initiate payment");
        } finally {
            setActionLoading(null);
        }
    };

    // ─────────────────────────────────────────────────────────────
    // What to render in the action area.
    // Priority order:
    //   1. If payment is pending   → show payment UI (overrides status UI)
    //   2. Pending / Sending       → Accept+Decline (receiver) or Waiting (sender)
    //   3. Accepted (free/paid)    → Track My Swap
    //   4. Rejected                → Rejection box + Restore
    //   5. Completed               → View Swap History
    //   6. Scheduled               → Scheduled banner + View Details
    // ─────────────────────────────────────────────────────────────
    const renderActions = () => {

        // ── 1. PAYMENT PENDING (eligible_for_pay:true, payment_done:false) ──
        // Intercepts completed/accepted/any status until payment is resolved
        if (paymentPending && !isPending && !isSending && !isRejected) {
            if (isSender) {
                return (
                    <div onClick={(e) => e.stopPropagation()} className="flex gap-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                            className="flex-1 px-4 py-2.5 bg-[#2F6F6D] text-white text-[12px] font-semibold rounded-[8px] hover:bg-[#245957] transition-colors"
                        >
                            View Details
                        </button>
                        <button
                            onClick={handlePayNow}
                            disabled={actionLoading === "pay"}
                            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-[#B5B5B5] text-black text-[12px] font-semibold rounded-[8px] hover:bg-gray-50 transition-colors disabled:opacity-60"
                        >
                            {actionLoading === "pay" ? (
                                <>
                                    <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                    </svg>
                                    Processing…
                                </>
                            ) : "Pay Now"}
                        </button>
                    </div>
                );
            }

            if (isReceiver) {
                return (
                    <div className="bg-[#F59E0B33] text-[#374151] text-[10px] font-medium px-3 py-1.5 rounded-md w-fit">
                        Waiting for partner's payment
                    </div>
                );
            }
        }

        // ── 2. PENDING / SENDING ──
        if (isPending || isSending) {
            if (isReceiver) {
                return (
                    <div className="flex gap-2">
                        <button
                            onClick={handleDeclineClick}
                            className="px-6 py-2 border border-[#DC2626] text-[#DC2626] rounded-[6px] text-xs font-semibold hover:bg-red-50 transition-colors"
                        >
                            Decline
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={actionLoading === "accept"}
                            className="px-6 py-2 bg-[#16A34A] text-white rounded-[6px] text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {actionLoading === "accept" ? "Accepting..." : "Accept"}
                        </button>
                    </div>
                );
            }
            // Sender sees NO buttons — just a banner
            return (
                <div className="bg-[#F59E0B33] text-[#374151] text-[10px] font-medium px-3 py-1.5 rounded-md w-fit">
                    Waiting for partner response
                </div>
            );
        }

        // ── 3. ACCEPTED (free swap or payment already done) ──
        if (isAccepted) {
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/track-swap/${data.id}`, { state: { data } });
                    }}
                    className="w-fit bg-[#2F6F6D] text-white text-[12px] font-medium px-6 py-2.5 rounded-[6px] hover:opacity-90 transition-opacity"
                >
                    Track My Swap
                </button>
            );
        }

        // ── 4. REJECTED ──
        if (isRejected) {
            return (
                <div className="space-y-3">
                    <div className="bg-[#FEF2F2] p-3 rounded-[8px] border border-[#FEE2E2]">
                        <h4 className="text-[12px] font-bold text-[#DC2626] mb-1">Rejection Reason</h4>
                        <p className="text-[12px] text-[#374151] leading-tight">
                            {data.rejection_reason || data.rejectionReason || "No reason specified"}
                        </p>
                        <p className="text-[10px] text-[#374151] opacity-70 mt-2">
                            {data?.rejection_info?.rejected_on || data.rejectionDate || "Unknown date"}
                        </p>
                    </div>
                    {/* Only receiver (who declined) can restore */}
                    {isReceiver && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleRestore(e); }}
                            disabled={actionLoading === "restore"}
                            className="px-6 py-2 border border-[#B5B5B5] text-black rounded-[6px] text-xs font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            {actionLoading === "restore" ? "Restoring..." : "Restore"}
                        </button>
                    )}
                </div>
            );
        }

        // ── 5. COMPLETED (payment done or free) ──
        if (isCompleted) {
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/swap-history/${data.id}`, { state: { data } });
                    }}
                    className="w-fit px-5 py-2.5 bg-[#2F6F6D] text-white rounded-[6px] text-xs font-medium hover:opacity-90 transition-opacity"
                >
                    View Swap History
                </button>
            );
        }

        // ── 6. SCHEDULED ──
        if (isScheduled) {
            return (
                <div className="flex flex-col gap-2">
                    <div className="bg-[#F59E0B33] text-[#374151] text-[10px] font-medium px-3 py-1.5 rounded-md w-fit">
                        Scheduled for {data.scheduled_date || data.send_date || "N/A"}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onViewDetails(); }}
                        className="w-fit bg-[#2F6F6D] text-white text-[12px] font-medium px-6 py-2.5 rounded-[6px] hover:opacity-90 transition-opacity"
                    >
                        View Details
                    </button>
                </div>
            );
        }

        return null;
    };

    return (
        <div
            onClick={onViewDetails}
            className={`p-5 rounded-[12px] border flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all h-full cursor-pointer hover:shadow-md
                ${needsMyPayment
                    ? "bg-[#FFF5F5] border-[#E8A0A0]"
                    : isCompleted && !paymentPending
                        ? "bg-[#EBF5EE] border-[#16A34A]"
                        : "bg-white border-[#B5B5B5]"
                }`}
        >
            {/* ── Header ── */}
            <div className="flex justify-between items-start">
                <div className="flex gap-2.5">
                    <img
                        src={authorImage}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div>
                        <h3 className="text-[13px] font-medium text-black leading-tight">
                            {formatCamelCaseName(authorName)}
                        </h3>
                        <p className="text-[13px] font-medium text-black">{authorRole}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5">
                    {(data.badge || data.status) && (
                        <span className={`text-[9px] font-normal px-2.5 py-0.5 rounded-full border
                            ${isCompleted && !paymentPending
                                ? "bg-[#16A34A33] text-black border-[#16A34A33]"
                                : "bg-[#F3F4F6] text-[#374151] border-gray-200"
                            }`}
                        >
                            {formatLabel(data.badge || data.status)}
                        </span>
                    )}
                    {isPaidSwap && data.price != null && (
                        <span className="text-[9px] font-normal px-2.5 py-0.5 rounded-full border bg-[#DCFCE7] text-[#166534] border-[#86EFAC]">
                            Pricing ${typeof data.price === "number" ? data.price.toFixed(0) : data.price}
                        </span>
                    )}
                </div>
            </div>

            {/* ── Details Grid ── */}
            <div className="grid grid-cols-3 gap-1">
                <div>
                    <p className="text-[10px] text-[#374151] font-normal mb-1">Audience Size</p>
                    <p className="text-[13px] font-medium text-black">
                        {data.audience_size || data.audienceSize || "N/A"}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-[#374151] font-normal mb-1">Reliability Score</p>
                    <p className="text-[13px] font-medium text-black">
                        {data.reliability_score || data.reliabilityScore || "N/A"}
                    </p>
                </div>
                <div>
                    <p className="text-[10px] text-[#374151] font-normal mb-1">Requesting Book</p>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        <p className="text-[13px] font-medium text-black truncate">
                            {typeof data.requesting_book === "object"
                                ? data.requesting_book?.title
                                : data.requesting_book ||
                                  (typeof data.requestingBook === "object"
                                      ? data.requestingBook?.title
                                      : data.requestingBook) ||
                                  "N/A"}
                        </p>
                        {typeof data.requesting_book === "object" &&
                            data.requesting_book?.compatibility && (
                                <div
                                    className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${
                                        data.requesting_book.compatibility.genre_match
                                            ? "bg-green-100 text-green-600"
                                            : "bg-red-100 text-red-600"
                                    }`}
                                    title={
                                        data.requesting_book.compatibility.genre_match
                                            ? "Genre Match"
                                            : "Genre Mismatch"
                                    }
                                >
                                    {data.requesting_book.compatibility.genre_match ? "✓" : "✕"}
                                </div>
                            )}
                    </div>
                </div>
            </div>

            {/* ── Message ── */}
            <div className="space-y-1">
                <p className="text-[10px] text-[#374151] font-normal">Message</p>
                <p className="text-[12px] text-black font-semibold leading-tight">
                    "{data.message || "No message provided"}"
                </p>
            </div>

            {/* ── Actions ── */}
            <div className="mt-auto pt-2">
                {renderActions()}
            </div>
        </div>
    );
};

const SwapManagement = () => {
    const { profile } = useProfile();
    const currentUserName = profile
        ? (profile.name || `${profile.first_name || ""} ${profile.last_name || ""}`).toLowerCase().trim()
        : "";

    const [swaps, setSwaps] = useState([]);
    const [tabCounts, setTabCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isTrackOpen, setIsTrackOpen] = useState(false);
    const [detailsId, setDetailsId] = useState(null);
    const [isDeclineOpen, setIsDeclineOpen] = useState(false);
    const [declineId, setDeclineId] = useState(null);
    const [declineLoading, setDeclineLoading] = useState(false);

    const handleDeclineRequest = (id) => {
        setDeclineId(id);
        setIsDeclineOpen(true);
    };

    const handleConfirmDecline = async (reason) => {
        try {
            setDeclineLoading(true);
            await declineSwap(declineId, { rejection_reason: reason });
            toast.success("Swap declined.");
            setIsDeclineOpen(false);
            setDeclineId(null);
            fetchSwaps(activeTab.key);
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to decline swap");
        } finally {
            setDeclineLoading(false);
        }
    };

    const fetchSwaps = async (tabKey = "all") => {
        try {
            setLoading(true);
            const response = await getSwaps(tabKey);
            const responseData = response.data;
            const data = responseData.results || responseData || [];
            if (responseData.tab_counts) setTabCounts(responseData.tab_counts);
            setSwaps(data);
        } catch (error) {
            console.error("Failed to fetch swaps:", error);
            setSwaps([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSwaps(activeTab.key);
    }, [activeTab]);

    const filtered = (Array.isArray(swaps) ? swaps : []).filter((s) => {
        const sStatus   = (s.status || "").toLowerCase();
        const sCategory = (s.category || "").toLowerCase();
        const tKey      = activeTab.key.toLowerCase();

        let isTabMatch = tKey === "all";
        if (!isTabMatch) {
            if (sStatus === tKey || sCategory === tKey)              isTabMatch = true;
            else if (tKey === "completed" && sStatus === "complete") isTabMatch = true;
            else if (tKey === "pending"   && sStatus === "incoming") isTabMatch = true;
            else if (tKey === "rejected"  && sStatus === "reject")   isTabMatch = true;
            else if (tKey === "sending"   && sStatus === "active")   isTabMatch = true;
            else if (activeTab.key !== "all")                        isTabMatch = true;
        }

        const authorName = (s.author_name || s.author || "").toLowerCase();
        const rawBook    = s.requesting_book || s.requestingBook;
        const bookName   =
            typeof rawBook === "string"
                ? rawBook.toLowerCase()
                : typeof rawBook === "object" && rawBook !== null
                    ? (rawBook.title || rawBook.name || "").toLowerCase()
                    : "";

        const isSearchMatch =
            authorName.includes(searchTerm.toLowerCase()) ||
            bookName.includes(searchTerm.toLowerCase());

        return isTabMatch && isSearchMatch;
    });

    return (
        <div className="min-h-screen bg-white pb-10">
            <div className="mb-3">
                <h1 className="text-2xl font-semibold">Swap Management</h1>
                <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">
                    Request, manage, and track your newsletter partnerships
                </p>
            </div>

            <div className="flex flex-wrap gap-1 bg-white p-1.5 rounded-[8px] border border-[#2F6F6D] w-fit mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-[12px] font-medium rounded-[6px] transition-all
                            ${activeTab.key === tab.key
                                ? "bg-[#2F6F6D] text-white"
                                : "text-[#374151] hover:bg-gray-50"
                            }`}
                    >
                        {tab.label} {tabCounts[tab.key] !== undefined ? `(${tabCounts[tab.key]})` : ""}
                    </button>
                ))}
            </div>

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
                                    currentUserName={currentUserName}
                                    onRefresh={() => fetchSwaps(activeTab.key)}
                                    onViewDetails={() => {
                                        setDetailsId(swap.id);
                                        if (swap.status === "scheduled") {
                                            setIsTrackOpen(true);
                                        } else {
                                            setIsDetailsOpen(true);
                                        }
                                    }}
                                    onDecline={handleDeclineRequest}
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
                onClose={() => { setIsDetailsOpen(false); setDetailsId(null); }}
            />
            <TrackSwapModal
                isOpen={isTrackOpen}
                swapId={detailsId}
                onClose={() => { setIsTrackOpen(false); setDetailsId(null); }}
            />
            <DeclineReasonModal
                isOpen={isDeclineOpen}
                onClose={() => { setIsDeclineOpen(false); setDeclineId(null); }}
                onConfirm={handleConfirmDecline}
                loading={declineLoading}
            />
        </div>
    );
};

export default SwapManagement;
