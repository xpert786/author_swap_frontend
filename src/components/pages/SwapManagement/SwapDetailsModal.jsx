import React, { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { getSwapHistory } from "../../../apis/swap";
import { formatCamelCaseName } from "../../../utils/formatName";
import { FiRefreshCw } from "react-icons/fi";

const SwapDetailsModal = ({ isOpen, onClose, swapId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!isOpen || !swapId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getSwapHistory(swapId);
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch swap details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, swapId]);

    if (!isOpen) return null;

    const handleSendNote = () => {
        console.log("Sending note:", note);
        setNote("");
    };

    const rawPartnerName = data?.partner_name || "Unknown Author";
    const firstName = rawPartnerName.split(/[\s,]+/)[0];
    const partnerName = formatCamelCaseName(firstName);

    const partnerImage = data?.partner_profile_picture || `https://ui-avatars.com/api/?name=${firstName}&background=random`;

    const formatGenre = (g) => {
        if (!g) return "N/A";
        return g.split(',').map(item =>
            item.replace(/_/g, ' ')
                .split(' ')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(' ')
        ).join(', ');
    };

    const partnerGenre = formatGenre(data?.partner_genre) || "Mystery Author";
    const book = data?.promoting_book || {};
    const links = data?.partner_links || {};

    return (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
            <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
                <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">

                    {/* Header - Aligned with AddBooks */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Swap Details
                            </h2>
                            <p className="text-[13px] text-gray-500 mt-0.5">
                                Explore author metrics and request information
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Content - Compact font sizes as requested earlier */}
                    <div className="space-y-5">
                        {loading ? (
                            <div className="py-16 flex flex-col items-center justify-center">
                                <FiRefreshCw className="animate-spin text-[#2F6F6D] mb-3" size={32} />
                                <p className="text-[12px] text-gray-500 font-medium">Loading details...</p>
                            </div>
                        ) : (
                            <>
                                {/* Author Hero */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <img
                                            src={partnerImage}
                                            alt={partnerName}
                                            className="w-11 h-11 rounded-full object-cover border border-gray-100 shadow-sm"
                                        />
                                        <div>
                                            <h3 className="text-[13px] font-medium text-[#111827] leading-tight">
                                                {partnerName}
                                            </h3>
                                            <p className="text-[11px] font-medium text-gray-500 mt-0.5">
                                                {partnerGenre}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-[9px] font-medium text-black bg-[#16A34A33] px-2.5 py-0.5 rounded-full">
                                        {data?.status_label?.replace('Swap ', '') || "Confirmed"}
                                    </span>
                                </div>

                                {/* Book Section */}
                                <div className="flex gap-4 p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                                    <div className="w-16 h-24 shrink-0 bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                        {book.cover ? (
                                            <img src={book.cover} className="w-full h-full object-cover" alt="Book" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-400 font-medium uppercase">No Image</div>
                                        )}
                                    </div>
                                    <div className="flex-1 py-1">
                                        <h4 className="text-[14px] font-medium text-[#111827] leading-tight">
                                            {book.title || "Unknown Title"}
                                        </h4>
                                        <p className="text-[11px] text-gray-500 font-medium mt-1">
                                            {book.status || "Upcoming"}
                                        </p>
                                    </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-white border border-gray-100 p-2.5 rounded-xl text-start">
                                        <p className="text-[12px] font-normal text-[#374151] mb-1">Audience</p>
                                        <p className="text-[13px] font-medium text-[#111827]">
                                            {data?.audience_size || "N/A"}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-gray-100 p-2.5 rounded-xl text-start">
                                        <p className="text-[12px] font-normal text-[#374151] mb-1">Reliability</p>
                                        <p className="text-[13px] font-medium text-[#111827]">
                                            {data?.reliability_score || "N/A"}
                                        </p>
                                    </div>
                                    <div className="bg-white border border-gray-100 p-2.5 rounded-xl text-start">
                                        <p className="text-[12px] font-normal text-[#374151] mb-1">Date</p>
                                        <p className="text-[13px] font-medium text-[#111827]">
                                            {data?.request_date || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Links */}
                                <div>
                                    <h4 className="text-md font-medium text-[#111827] mb-3">Links</h4>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { label: "Website", value: links.website },
                                            { label: "Facebook", value: links.facebook },
                                            { label: "Instagram", value: links.instagram },
                                            { label: "Twitter", value: links.twitter }
                                        ].map((link, idx) => (
                                            <div key={idx} className="flex items-center text-[12px] px-3 py-1.5 rounded-lg">
                                                <span className="w-20 font-medium text-[#374151] text-[10px]">{link.label}</span>
                                                <span className="font-medium text-[#374151] truncate flex-1">{link.value || "NA"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Message */}
                                <div>
                                    <p className="text-md font-medium text-[#111827] mb-3">Message</p>
                                    <div className="bg-[#2F6F6D08] p-3 rounded-xl border border-[#2F6F6D15]">
                                        <p className="text-[12px] font-medium text-[#111827] leading-relaxed">
                                            {data?.message ? `"${data.message}"` : "No message provided."}
                                        </p>
                                    </div>
                                </div>

                                {/* Response Notes */}
                                <div>
                                    <p className="text-md font-medium text-[#111827] mb-3">Response Notes</p>
                                    <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden focus-within:border-[#2F6F6D] focus-within:ring-1 focus-within:ring-[#2F6F6D] transition-all">
                                        <textarea
                                            className="w-full p-3 pr-10 text-[12px] text-[#111827] placeholder:text-[#374151] placeholder:font-medium resize-none h-20 outline-none"
                                            placeholder="Add notes for your response..."
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                        />
                                        <button
                                            onClick={handleSendNote}
                                            className="absolute bottom-2.5 right-2.5 w-7 h-7 flex items-center justify-center bg-[#2F6F6D10] rounded-lg text-[#2F6F6D] hover:bg-[#2F6F6D] hover:text-white transition-all border border-[#2F6F6D20]"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </div>

                                {/* Footer - Aligned with AddBooks */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        onClick={onClose}
                                        className="px-5 py-1.5 text-[13px] rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwapDetailsModal;
