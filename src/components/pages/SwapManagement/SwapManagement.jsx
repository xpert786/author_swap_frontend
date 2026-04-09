import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { getSwaps, acceptSwap, declineSwap, restoreSwap, payForSwap, directPayment, confirmSwapPayment } from '../../../apis/swap';
import { FiRefreshCw, FiEye } from "react-icons/fi";
import { formatCamelCaseName } from '../../../utils/formatName';
import toast from 'react-hot-toast';
import SwapDetailsModal from './SwapDetailsModal';
import TrackSwapModal from './TrackSwapModal';
import DeclineReasonModal from './DeclineReasonModal';
import SubmitProofModal from './SubmitProofModal';
import ReviewProofModal from './ReviewProofModal';
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
 * sender_id   = ID of the user who INITIATED the swap
 * receiver_id = ID of the user who RECEIVES the swap request
 * currentUserId = ID of the currently logged-in user
 *
 * Fallback: if receiver_id is absent from the API response (list endpoints
 * often omit it), treat anyone who is NOT the sender as the receiver so the
 * UI always renders correctly.
 */
const getSwapRole = (data, currentUserId) => {
    if (!currentUserId) {
        return { isSender: false, isReceiver: false };
    }

    const myId = Number(currentUserId);
    const senderId = Number(data.sender_id);
    const receiverId = Number(data.receiver_id);

    const isSender = myId === senderId;
    const isReceiver = myId === receiverId;

    return { isSender, isReceiver };
};

const SwapCard = ({ data, onRefresh, onViewDetails, onDecline, currentUserId, setDetailsId, setIsTrackOpen, setIsSubmitProofOpen, setIsReviewProofOpen }) => {

    const navigate = useNavigate();
    const [actionLoading, setActionLoading] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const [isPaid, setIsPaid] = useState(() => {
        return localStorage.getItem(`paid_${data.id}`) === 'true';
    });

    const { isSender, isReceiver } = getSwapRole(data, currentUserId);

    const status = (data.status || "").toLowerCase();
    console.log("Swap Status:", status, "isSender:", isSender, "isReceiver:", isReceiver);
    const isSending = status === "sending" || status === "pending" || status === "incoming";
    const isAccepted =
        status === "accepted" ||
        status === "confirmed" ||
        status === "active" ||
        status === "scheduled"; // ✅ ADD THIS
    const isRejected = status === "rejected" || status === "reject";
    const isCompleted = status === "completed" || status === "complete";
    const isScheduled = status === "scheduled";

    // New proof submission statuses
    const isAwaitingProof = status === "awaiting_proof";
    const isProofSubmitted = status === "proof_submitted";
    const isReviewing = status === "reviewing";
    const isReadyToComplete = status === "ready_to_complete";

    // ── Payment flags (directly from API) ──
    const isPaidSwap = data.eligible_for_pay === true;
    const isPaymentDone = data.payment_done === true;

    const authorName = data.author_name || data.author || "Unknown Author";
    const authorRole = data.author_genre_label || data.author_role || data.role || "Author";
    const authorImage =
        data.profile_picture ||
        `https://ui-avatars.com/api/?name=${authorName}&background=random`;

    // Card highlight: sender still needs to pay
    const needsMyPayment = isPaidSwap && !isPaymentDone && isSender && isAccepted;

    useEffect(() => {
        if (isPaymentDone) {
            localStorage.removeItem(`paid_${data.id}`);
        }
    }, [isPaymentDone, data.id]);

    /* ── Handlers ── */
    const handleAccept = async (e) => {
        e.stopPropagation();
        try {
            setActionLoading("accept");
            await acceptSwap(data.id);
            toast.success("Swap accepted!");
            onRefresh?.(true);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to accept swap");
        } finally {
            setActionLoading(null);
        }
    };

    const handleReceivePayment = async (e) => {
        e.stopPropagation();
        try {
            setActionLoading("receive_payment");
            await confirmSwapPayment(data.id);
            toast.success("Swap Completed Successfully!");
            onRefresh?.(true);
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to confirm payment");
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
            onRefresh?.(true); // Silent refresh
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to restore swap");
        } finally {
            setActionLoading(null);
        }
    };

    const handlePayNow = (e) => {
        e.stopPropagation();
        setShowPaymentModal(true);
    };

    const handlePayWithCard = async () => {
        try {
            setActionLoading("pay_card");
            setShowPaymentModal(false);

            const payload = {
                receiver_id: data.receiver_id,
                amount: data.price ? String(data.price) : "0.00",
                description: `Internal payment for Swap ID: ${data.id}`,
                payment_method: "card"
            };

            const response = await directPayment(payload);

            if (response.data?.url) {
                localStorage.setItem(`paid_${data.id}`, 'true');
                window.location.href = response.data.url;
                return;
            }

            if (response.data) {
                toast.success(response.data.message || "Payment successful!");
                setIsPaid(true);
                localStorage.setItem(`paid_${data.id}`, 'true');
                onRefresh?.(true);
            }
        } catch (err) {
            console.error("Card payment error:", err);
            toast.error(err?.response?.data?.message || "Failed to process card payment");
        } finally {
            setActionLoading(null);
        }
    };

    const handlePayWithFunds = async () => {
        try {
            setActionLoading("pay_funds");
            setShowPaymentModal(false);

            // Using payForSwap API for wallet funds payment
            const response = await payForSwap(data.id);

            if (response.data) {
                toast.success(response.data.message || "Payment successful using wallet funds!");
                setIsPaid(true);
                localStorage.setItem(`paid_${data.id}`, 'true');
                onRefresh?.(true);
            }
        } catch (err) {
            console.error("Funds payment error:", err);
            toast.error(err?.response?.data?.message || "Failed to process payment from funds. Please check your wallet balance.");
        } finally {
            setActionLoading(null);
        }
    };

    // ─────────────────────────────────────────────────────────────────────
    // renderActions — strict priority flow:
    //   1. SENDING   → sender: waiting banner | receiver: Accept + Decline
    //   2. ACCEPTED  → paid+unpaid: Pay Now (sender) / Waiting (receiver)
    //                  paid+done:   Payment Done (sender) / Confirm (receiver)
    //                  free:        Track My Swap (both)
    //   3. COMPLETED → Swap Completed (both)
    //   4. REJECTED  → Rejection box + Restore (receiver only)
    //   5. SCHEDULED → View Details
    // ─────────────────────────────────────────────────────────────────────
    const renderActions = () => {

        // ── 1. SENDING / PENDING ──────────────────────────────────────────
        if (isSending) {
            if (isSender) {
                return (
                    <div className="bg-[#F59E0B33] text-[#374151] text-[10px] font-medium px-3 py-1.5 rounded-md w-fit">
                        Waiting for author acceptance
                    </div>
                );
            }
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
            return null;
        }

        // ── 2. ACCEPTED ───────────────────────────────────────────────────
        if (isAccepted) {

            // 2a. Paid swap — payment NOT yet done
            if (isPaidSwap && !isPaymentDone) {
                if (isSender) {
                    return (
                        <div onClick={(e) => e.stopPropagation()} className="flex gap-3">
                            <button
                                onClick={handlePayNow}
                                disabled={actionLoading === "pay"}
                                className="w-1/2 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white border border-[#B5B5B5] text-black text-[12px] font-semibold rounded-[8px] hover:bg-gray-50 transition-colors disabled:opacity-60"
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
                            Waiting for the payment
                        </div>
                    );
                }
            }

            // 2b. Paid swap — payment IS done
            if (isPaidSwap && isPaymentDone) {
                if (isSender) {
                    return (
                        <div className="bg-[#16A34A33] text-[#166534] text-[10px] font-medium px-3 py-1.5 rounded-md w-fit">
                            Payment Done ✅
                        </div>
                    );
                }
                if (isReceiver) {
                    return (
                        <button
                            onClick={handleReceivePayment}
                            disabled={actionLoading === "receive_payment"}
                            className="px-6 py-2 bg-[#16A34A] text-white rounded-[6px] text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {actionLoading === "receive_payment" ? "Confirming..." : "Confirm Payment Received"}
                        </button>
                    );
                }
            }

            // 2c. Free swap (eligible_for_pay = false) — both see Track My Swap
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setDetailsId(data.id);
                        setIsTrackOpen(true);
                    }}
                    className="w-fit bg-[#2F6F6D] text-white text-[12px] font-medium px-6 py-2.5 rounded-[6px] hover:opacity-90 transition-opacity"
                >
                    Track My Swap
                </button>
            );
        }

        // ── 3. COMPLETED ──────────────────────────────────────────────────
        if (isCompleted) {
            return (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/swap-history/${data.id}`);
                    }}
                    className="w-fit bg-[#2F6F6D] text-white text-[12px] font-medium px-6 py-2.5 rounded-[6px] hover:opacity-90 transition-opacity"
                >
                    View swap history
                </button>
            );
        }

        // ── 4. REJECTED ───────────────────────────────────────────────────
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

        // ── 5. SCHEDULED / AWAITING PROOF ─────────────────────────────────
        // Receiver (who accepted & publishes newsletter) submits proof
        if (isScheduled || isAwaitingProof) {
            if (isReceiver) {
                return (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDetailsId(data.id);
                            setIsSubmitProofOpen(true);
                        }}
                        className="px-6 py-2 bg-[#2F6F6D] text-white rounded-[6px] text-xs font-semibold hover:opacity-90 transition-opacity"
                    >
                        Submit Proof
                    </button>
                );
            }
            if (isSender) {
                return (
                    <div className="bg-yellow-100 text-yellow-700 text-[10px] font-medium px-3 py-1.5 rounded-md w-fit">
                        Waiting for proof submission
                    </div>
                );
            }
        }

        // ── 6. PROOF SUBMITTED / REVIEWING ─────────────────────────────────
        // Sender (who requested the swap) reviews proof from receiver
        if (isProofSubmitted || isReviewing) {
            if (isSender) {
                return (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setDetailsId(data.id);
                            setIsReviewProofOpen(true);
                        }}
                        className="px-6 py-2 bg-blue-600 text-white rounded-[6px] text-xs font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Review Proof
                    </button>
                );
            }
            if (isReceiver) {
                return (
                    <div className="bg-blue-100 text-blue-700 text-[10px] font-medium px-3 py-1.5 rounded-md w-fit">
                        Proof submitted — waiting for review
                    </div>
                );
            }
        }

        // ── 7. READY TO COMPLETE ───────────────────────────────────────────
        // Sender (who requested & reviewed) completes the swap
        if (isReadyToComplete) {
            if (isSender) {
                return (
                    <button
                        onClick={handleReceivePayment}
                        disabled={actionLoading === "complete"}
                        className="px-6 py-2 bg-green-600 text-white rounded-[6px] text-xs font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        {actionLoading === "complete" ? "Completing..." : "Complete Swap"}
                    </button>
                );
            }
            if (isReceiver) {
                return (
                    <div className="bg-green-100 text-green-700 text-[10px] font-medium px-3 py-1.5 rounded-md w-fit">
                        Waiting for completion
                    </div>
                );
            }
        }

        return null;
    };

    return (
        <div
            className={`p-5 rounded-[12px] border flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all h-full cursor-default
                ${needsMyPayment
                    ? "bg-[#FFF5F5] border-[#E8A0A0]"
                    : isCompleted
                        ? "bg-[#EBF5EE] border-[#16A34A]"
                        : "bg-white border-[#B5B5B5]"
                }`}
        >
            {/* ── Header ── */}
            <div className="flex justify-between items-start gap-3">
                <div className="flex gap-2.5 min-w-0">
                    <img
                        src={authorImage}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0 pt-0.5">
                        <h3 className="text-[13px] font-medium text-black leading-tight truncate">
                            {formatCamelCaseName(authorName)}
                        </h3>
                        <p className="text-[12px] font-medium text-gray-500 truncate mt-0.5">
                            {typeof authorRole === 'string'
                                ? authorRole.split(',').map(str => str.trim().replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())).join(', ')
                                : authorRole}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-1.5 shrink-0">
                    {/* View Details icon button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails();
                        }}
                        className="w-7 h-7 rounded-lg bg-[#2F6F6D1A] text-[#2F6F6D] flex items-center justify-center hover:bg-[#2F6F6D] hover:text-white transition-all"
                        title="View Details"
                    >
                        <FiEye size={13} />
                    </button>
                    {(data.badge || data.status) && (
                        <span className={`whitespace-nowrap text-[9px] font-medium px-2 py-0.5 rounded-md border
                            ${isCompleted
                                ? "bg-[#16A34A1A] text-[#166534] border-[#16A34A33]"
                                : isAwaitingProof
                                    ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                    : isProofSubmitted
                                        ? "bg-blue-100 text-blue-700 border-blue-200"
                                        : isReviewing
                                            ? "bg-purple-100 text-purple-700 border-purple-200"
                                            : isReadyToComplete
                                                ? "bg-green-100 text-green-700 border-green-200"
                                                : "bg-gray-50 text-gray-600 border-gray-200"
                            }`}
                        >
                            {isCompleted
                                ? "Swap Completed"
                                : isPaymentDone
                                    ? "Payment Done ✅"
                                    : isAwaitingProof
                                        ? "Awaiting Proof"
                                        : isProofSubmitted
                                            ? "Proof Submitted"
                                            : isReviewing
                                                ? "Under Review"
                                                : isReadyToComplete
                                                    ? "Ready to Complete"
                                                    : formatLabel(data.badge || data.status)}
                        </span>
                    )}
                    {isPaidSwap && data.price != null && (
                        <span className={`whitespace-nowrap text-[9px] font-medium px-2 py-0.5 rounded-md border 
                            ${isPaymentDone
                                ? "bg-[#2F6F6D] text-white border-[#2F6F6D]"
                                : "bg-green-50 text-green-700 border-green-200"
                            }`}
                        >
                            {isPaymentDone ? "Paid" : "Pricing"} ${typeof data.price === "number" ? data.price.toFixed(0) : data.price}
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
                                    className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center ${data.requesting_book.compatibility.genre_match
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

            {/* ── Payment Method Modal ── */}
            {showPaymentModal && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
                    onClick={(e) => {
                        e.stopPropagation();
                        setShowPaymentModal(false);
                    }}
                >
                    <div
                        className="bg-white w-[400px] rounded-[12px] shadow-xl p-6 m-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Choose Payment Method</h2>
                                <p className="text-[13px] text-gray-500 mt-1">
                                    Amount: <span className="font-semibold text-[#2F6F6D]">${data.price || "0.00"}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => setShowPaymentModal(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={handlePayWithCard}
                                disabled={actionLoading === "pay_card"}
                                className="w-full p-4 border-2 border-[#2F6F6D] rounded-[10px] hover:bg-[#2F6F6D] hover:text-white transition-all group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#2F6F6D33] group-hover:bg-white/20 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Pay with Card</p>
                                        <p className="text-xs opacity-80">Use your saved card or add a new one</p>
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={handlePayWithFunds}
                                disabled={actionLoading === "pay_funds"}
                                className="w-full p-4 border-2 border-[#16A34A] text-[#16A34A] rounded-[10px] hover:bg-[#16A34A] hover:text-white transition-all group text-left"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#16A34A33] group-hover:bg-white/20 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Pay from Wallet Funds</p>
                                        <p className="text-xs opacity-80">Use your available balance</p>
                                    </div>
                                </div>
                            </button>
                        </div>

                        <p className="text-[11px] text-gray-400 text-center mt-6">
                            You will be redirected to complete the payment
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

const SwapManagement = () => {
    const { profile } = useProfile();
    const currentUserId = profile?.user ?? null;
    const [swaps, setSwaps] = useState([]);
    const [tabCounts, setTabCounts] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isTrackOpen, setIsTrackOpen] = useState(false);
    const [isSubmitProofOpen, setIsSubmitProofOpen] = useState(false);
    const [isReviewProofOpen, setIsReviewProofOpen] = useState(false);
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

    const fetchSwaps = async (tabKey = "all", silent = false) => {
        try {
            if (!silent) setLoading(true);
            const response = await getSwaps(tabKey);
            const responseData = response.data;
            // const data = responseData.results || responseData || [];
            const data = responseData.results || responseData || [];
            setSwaps(data);
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

    // useEffect(() => {

    //     setSwaps([
    //         {
    //             id: 101,
    //             sender_id: currentUserId,
    //             receiver_id: 2,
    //             author_name: "Test Author",
    //             status: "awaiting_proof",
    //             audience_size: "4500",
    //             reliability_score: "98%",
    //             requesting_book: "Demo Book",
    //             message: "Testing proof flow",
    //             eligible_for_pay: false,
    //             payment_done: true
    //         }
    //     ]);

    //     setLoading(false);

    // }, []);

    const filtered = (Array.isArray(swaps) ? swaps : []).filter((s) => {
        const sStatus = (s.status || "").toLowerCase();
        const sCategory = (s.category || "").toLowerCase();
        const tKey = activeTab.key.toLowerCase();

        let isTabMatch = tKey === "all";
        if (!isTabMatch) {
            if (sStatus === tKey || sCategory === tKey) isTabMatch = true;
            else if (tKey === "completed" && sStatus === "complete") isTabMatch = true;
            else if (tKey === "pending" && sStatus === "incoming") isTabMatch = true;
            else if (tKey === "rejected" && sStatus === "reject") isTabMatch = true;
            else if (tKey === "sending" && sStatus === "active") isTabMatch = true;
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
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
                                    currentUserId={currentUserId}
                                    setDetailsId={setDetailsId}
                                    setIsTrackOpen={setIsTrackOpen}
                                    setIsSubmitProofOpen={setIsSubmitProofOpen}
                                    setIsReviewProofOpen={setIsReviewProofOpen}
                                    onRefresh={(silent = false) => fetchSwaps(activeTab.key, silent)}
                                    onViewDetails={() => {
                                        setDetailsId(swap.id);
                                        if (swap.status === "scheduled" || swap.status === "proof_submitted" || swap.status === "reviewing") {
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
            <SubmitProofModal
                isOpen={isSubmitProofOpen}
                swapId={detailsId}
                onClose={() => { setIsSubmitProofOpen(false); setDetailsId(null); }}
                onSuccess={() => fetchSwaps(activeTab.key)}
            />
            <ReviewProofModal
                isOpen={isReviewProofOpen}
                swapId={detailsId}
                onClose={() => { setIsReviewProofOpen(false); setDetailsId(null); }}
                onSuccess={() => fetchSwaps(activeTab.key)}
            />
        </div>
    );
};

export default SwapManagement;
