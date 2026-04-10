import React, { useState, useEffect } from "react";
import { FiX, FiRefreshCw, FiExternalLink, FiImage, FiFileText, FiCheck, FiXCircle } from "react-icons/fi";
import { reviewProof, acceptProof, declineProof } from "../../../apis/swap";
import toast from "react-hot-toast";
import dayjs from "dayjs";

const ReviewProofModal = ({ isOpen, onClose, swapId, onSuccess }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [showDeclineForm, setShowDeclineForm] = useState(false);
    const [declineReason, setDeclineReason] = useState("");

    useEffect(() => {
        if (!isOpen || !swapId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await reviewProof(swapId);
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch proof data:", error);
                toast.error("Failed to load proof details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, swapId]);

    const handleAccept = async () => {
        try {
            setActionLoading("accept");
            await acceptProof(swapId);
            toast.success("Proof accepted! Swap marked as complete.");
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Accept proof error:", error);
            toast.error(error?.response?.data?.message || "Failed to accept proof");
        } finally {
            setActionLoading(null);
        }
    };

    const handleDecline = async () => {
        if (!declineReason.trim()) {
            toast.error("Please provide a reason for declining");
            return;
        }

        try {
            setActionLoading("decline");
            await declineProof(swapId, { dispute_reason: declineReason.trim() });
            toast.success("Proof declined. Dispute has been opened.");
            onSuccess?.();
            onClose();
        } catch (error) {
            console.error("Decline proof error:", error);
            toast.error(error?.response?.data?.message || "Failed to decline proof");
        } finally {
            setActionLoading(null);
        }
    };

    if (!isOpen) return null;

    const submittedAt = data?.submitted_at
        ? dayjs(data.submitted_at).format("MMM D, YYYY [at] h:mm A")
        : "N/A";

    // Get all screenshots and links from proof_media array
    const proofMedia = data?.proof_media || [];
    const screenshots = proofMedia.filter(m => m.media_type === "screenshot" && m.url);
    const links = proofMedia.filter(m => m.media_type === "link" && m.link_url);
    const hasMedia = screenshots.length > 0 || links.length > 0;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white w-[550px] rounded-lg shadow-xl m-5 overflow-hidden">
                <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Review Proof of Promotion
                            </h2>
                            <p className="text-[13px] text-gray-500 mt-0.5">
                                Verify the submitted proof before completing the swap
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
                        >
                            <FiX />
                        </button>
                    </div>

                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center">
                            <FiRefreshCw className="animate-spin text-[#2F6F6D] mb-4" size={32} />
                            <p className="text-gray-500 font-medium">Loading proof details...</p>
                        </div>
                    ) : (
                        <>
                            {/* Submitted Info */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-5">
                                <div className="flex items-center gap-2 text-[13px] text-gray-600 mb-1">
                                    <span className="font-medium">Submitted:</span>
                                    <span>{submittedAt}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[13px] text-gray-600">
                                    <span className="font-medium">Items Submitted:</span>
                                    <span>{screenshots.length} screenshot{screenshots.length !== 1 ? 's' : ''}, {links.length} link{links.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>

                            {/* Screenshots Display */}
                            {screenshots.length > 0 && (
                                <div className="mb-5">
                                    <label className="text-[13px] font-medium text-gray-600 block mb-2">
                                        <FiImage className="inline mr-1.5" size={14} />
                                        Screenshot Proof ({screenshots.length})
                                    </label>
                                    <div className="space-y-3">
                                        {screenshots.map((media, index) => (
                                            <div key={media.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                                <div className="bg-gray-100 px-3 py-1 text-xs text-gray-500 border-b border-gray-200">
                                                    Screenshot {index + 1}
                                                </div>
                                                <img
                                                    src={media.url}
                                                    alt={`Proof screenshot ${index + 1}`}
                                                    className="w-full h-auto max-h-[300px] object-contain bg-gray-100"
                                                />
                                                <div className="p-2 bg-gray-50 border-t border-gray-200">
                                                    <a
                                                        href={media.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1.5 text-[13px] text-[#2F6F6D] hover:underline"
                                                    >
                                                        <FiExternalLink size={14} />
                                                        View Full Image
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Links Display */}
                            {links.length > 0 && (
                                <div className="mb-5">
                                    <label className="text-[13px] font-medium text-gray-600 block mb-2">
                                        <FiExternalLink className="inline mr-1.5" size={14} />
                                        Public Links ({links.length})
                                    </label>
                                    <div className="space-y-2">
                                        {links.map((media, index) => (
                                            <a
                                                key={media.id}
                                                href={media.link_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg bg-[#2F6F6D08] hover:bg-[#2F6F6D15] transition-colors border border-[#2F6F6D20] text-[#2F6F6D] font-medium"
                                            >
                                                <span className="text-xs bg-[#2F6F6D] text-white px-1.5 py-0.5 rounded shrink-0">
                                                    {index + 1}
                                                </span>
                                                <FiExternalLink className="shrink-0" size={16} />
                                                <span className="truncate">{media.link_url}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Fallback: Show old format if no proof_media */}
                            {!hasMedia && data?.proof_screenshot && (
                                <div className="mb-5">
                                    <label className="text-[13px] font-medium text-gray-600 block mb-2">
                                        <FiImage className="inline mr-1.5" size={14} />
                                        Screenshot Proof
                                    </label>
                                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                                        <img
                                            src={data.proof_screenshot}
                                            alt="Proof screenshot"
                                            className="w-full h-auto max-h-[300px] object-contain bg-gray-100"
                                        />
                                    </div>
                                    <a
                                        href={data.proof_screenshot}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-[13px] text-[#2F6F6D] hover:underline mt-2"
                                    >
                                        <FiExternalLink size={14} />
                                        View Full Image
                                    </a>
                                </div>
                            )}

                            {!hasMedia && data?.proof_link && (
                                <div className="mb-5">
                                    <label className="text-[13px] font-medium text-gray-600 block mb-2">
                                        <FiExternalLink className="inline mr-1.5" size={14} />
                                        Public Link
                                    </label>
                                    <a
                                        href={data.proof_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm px-3 py-2.5 rounded-lg bg-[#2F6F6D08] hover:bg-[#2F6F6D15] transition-colors border border-[#2F6F6D20] text-[#2F6F6D] font-medium"
                                    >
                                        <FiExternalLink className="shrink-0" size={16} />
                                        <span className="truncate">{data.proof_link}</span>
                                    </a>
                                </div>
                            )}

                            {/* Notes */}
                            {data?.proof_notes && (
                                <div className="mb-5">
                                    <label className="text-[13px] font-medium text-gray-600 block mb-2">
                                        <FiFileText className="inline mr-1.5" size={14} />
                                        Submitter Notes
                                    </label>
                                    <div className="bg-gray-50 rounded-lg p-3 text-[13px] text-gray-700">
                                        {data.proof_notes}
                                    </div>
                                </div>
                            )}

                            {/* Decline Reason Form */}
                            {showDeclineForm && (
                                <div className="mb-5 border-t border-gray-200 pt-5">
                                    <label className="text-[13px] font-medium text-red-600 block mb-2">
                                        <FiXCircle className="inline mr-1.5" size={14} />
                                        Reason for Declining *
                                    </label>
                                    <textarea
                                        value={declineReason}
                                        onChange={(e) => setDeclineReason(e.target.value)}
                                        placeholder="Please explain why you are declining this proof..."
                                        rows={3}
                                        className="w-full border border-red-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500 resize-none"
                                    />
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                {!showDeclineForm ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setShowDeclineForm(true)}
                                            disabled={actionLoading}
                                            className="px-5 py-2 text-[13px] rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleAccept}
                                            disabled={actionLoading}
                                            className="px-5 py-2 text-[13px] rounded-lg bg-green-600 text-white disabled:opacity-50 transition-opacity hover:bg-green-700 shadow-sm flex items-center gap-2"
                                        >
                                            <FiCheck size={16} />
                                            {actionLoading === "accept" ? "Processing..." : "Accept & Complete Swap"}
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowDeclineForm(false);
                                                setDeclineReason("");
                                            }}
                                            disabled={actionLoading}
                                            className="px-5 py-2 text-[13px] rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleDecline}
                                            disabled={actionLoading || !declineReason.trim()}
                                            className="px-5 py-2 text-[13px] rounded-lg bg-red-600 text-white disabled:opacity-50 transition-opacity hover:bg-red-700 shadow-sm flex items-center gap-2"
                                        >
                                            <FiXCircle size={16} />
                                            {actionLoading === "decline" ? "Processing..." : "Decline Proof"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewProofModal;
