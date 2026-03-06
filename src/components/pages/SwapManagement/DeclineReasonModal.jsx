import React, { useState } from 'react';
import { FiX, FiRefreshCw } from "react-icons/fi";

const DeclineReasonModal = ({ isOpen, onClose, onConfirm, loading }) => {
    const [reason, setReason] = useState("");

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reason.trim()) return;
        onConfirm(reason);
    };

    return (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-[1001]">
            <div className="bg-white w-[500px] rounded-[10px] shadow-xl overflow-hidden m-5">
                <div className="p-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FiX size={20} />
                    </button>

                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Decline Swap Request</h2>
                    <p className="text-[13px] text-gray-500 mb-6">
                        Please provide a reason for declining this swap request. This helps the other author understand your decision.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-[13px] font-medium text-[#111827] mb-1.5 block">
                                Rejection Reason
                            </label>
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Example: Genre mismatch, Audience size difference, etc."
                                className="w-full border border-[#B5B5B5] rounded-[10px] px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#DC2626] h-28 resize-none"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-5 py-2 text-[13px] rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !reason.trim()}
                                className="px-6 py-2 bg-[#DC2626] text-white rounded-[10px] text-[13px] font-semibold hover:bg-[#B91C1C] transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {loading && <FiRefreshCw className="animate-spin" />}
                                {loading ? "Declining..." : "Confirm Decline"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DeclineReasonModal;
