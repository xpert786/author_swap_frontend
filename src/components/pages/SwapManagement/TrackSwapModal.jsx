import React, { useState, useEffect } from "react";
import { FiX, FiRefreshCw } from "react-icons/fi";
import { trackSwap } from "../../../apis/swap";
import { formatCamelCaseName } from "../../../utils/formatName";

const TrackSwapModal = ({ isOpen, onClose, swapId }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (!isOpen || !swapId) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await trackSwap(swapId);
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch swap tracking data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isOpen, swapId]);

    useEffect(() => {
        if (!data || !data.deadline) return;

        // Parse deadline string: "09 Mar, 2026 10:45AM"
        const deadlineStr = data.deadline.replace(',', '');
        const targetDate = new Date(deadlineStr);

        const updateTimer = () => {
            if (isNaN(targetDate.getTime())) {
                setTimeLeft("00:00:00");
                return;
            }

            const now = new Date();
            const difference = targetDate - now;

            if (difference <= 0) {
                setTimeLeft("00:00:00");
                return;
            }

            const h = Math.floor(difference / (1000 * 60 * 60));
            const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((difference % (1000 * 60)) / 1000);

            setTimeLeft(
                `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            );
        };

        const timer = setInterval(updateTimer, 1000);
        updateTimer();

        return () => clearInterval(timer);
    }, [data]);

    if (!isOpen) return null;

    const authorName = data?.partner_name || "Unknown Author";
    const authorImage = data?.partner_profile_picture || `https://ui-avatars.com/api/?name=${authorName}&background=random`;
    const authorRole = data?.partner_genre || "Author";
    const book = data?.promoting_book || {};
    const links = data?.partner_links || {};

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 p-4">
            <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
                <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar relative">
                    {loading ? (
                        <div className="py-20 flex flex-col items-center justify-center">
                            <FiRefreshCw className="animate-spin text-[#2F6F6D] mb-4" size={40} />
                            <p className="text-gray-500 font-medium tracking-tight">Loading tracking info...</p>
                        </div>
                    ) : (
                        <>
                            {/* Header */}
                            <div className="flex justify-between items-center pb-3 mb-3 border-b border-[#B8B8B8]">
                                <h1 className="text-[#111827] font-medium text-[18px]">
                                    Track My Swap
                                </h1>
                                <button
                                    onClick={onClose}
                                    className="flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors w-8 h-8 rounded-full text-gray-600"
                                >
                                    <FiX size={18} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* Swapping With */}
                                <div>
                                    <h3 className="text-[14px] font-medium text-[#111827] mb-3">Swapping With</h3>
                                    <div className="flex items-center gap-3">
                                        <img src={authorImage} alt={authorName} className="w-14 h-14 rounded-full object-cover shadow-sm border border-gray-100" />
                                        <div>
                                            <p className="text-[14px] font-normal text-[#374151]">{formatCamelCaseName(authorName)}</p>
                                            <p className="text-[14px] font-normal text-[#111827] opacity-80">{authorRole}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Promoting Book */}
                                <div className="relative">
                                    <h3 className="text-base font-medium text-[#111827] mb-3">Promoting Book</h3>
                                    <div className="flex gap-4">
                                        <img
                                            src={book.cover || "https://images.unsplash.com/photo-1541963463532-d68292c34b19"}
                                            alt={book.title}
                                            className="w-20 h-28 object-cover rounded-lg shadow-sm"
                                        />
                                        <div className="flex-1 flex flex-col justify-center">
                                            <div className="flex items-center justify-between mb-1">
                                                <h4 className="text-[16px] font-medium text-[#111827] leading-tight">{book.title || "Book Title"}</h4>
                                                <span className="bg-[#E8E8E8] text-black text-[10px] font-normal px-2.5 py-1 rounded-full">
                                                    {book.badge || "Upcoming"}
                                                </span>
                                            </div>
                                            <p className="text-[13px] text-[#374151] font-medium">{book.genre || "N/A"}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Countdown Banner */}
                                <div
                                    className="rounded-[10px] py-10 px-6 text-center text-white flex flex-col items-center justify-center gap-4 transition-all"
                                    style={{
                                        background: "linear-gradient(135deg, #2F6F6D 0%, #16A34A 100%)",
                                        boxShadow: "0 4px 15px rgba(22, 163, 74, 0.2)"
                                    }}
                                >
                                    <p className="text-xl font-medium tracking-wide">{data?.countdown_label?.title || book.title}</p>
                                    <div className="space-y-1">
                                        <p className="text-sm opacity-90 font-normal">{data?.countdown_label?.date || data.deadline || "N/A"}</p>
                                        <p className="text-3xl font-semibold tracking-[0.2em]">{timeLeft || "10:53:45"}</p>
                                    </div>
                                </div>

                                {/* Dates Grid */}
                                <div className="grid grid-cols-2 gap-x-12 pt-2">
                                    <div className="space-y-1.5">
                                        <p className="text-[13px] text-[#374151] font-normal">Request Date</p>
                                        <p className="text-[15px] font-medium text-[#111827]">{data.request_date || "N/A"}</p>
                                    </div>
                                    <div className="space-y-1.5">
                                        <p className="text-[13px] text-[#374151] font-normal">Deadline</p>
                                        <p className="text-[15px] font-medium text-[#111827]">{data.deadline || "N/A"}</p>
                                    </div>
                                </div>

                                {/* Links */}
                                <div className="pt-2">
                                    <h3 className="text-base font-medium text-[#111827] mb-4">Links</h3>
                                    <div className="space-y-3">
                                        {[
                                            { label: "Website:", value: links.website },
                                            { label: "Facebook:", value: links.facebook },
                                            { label: "Instagram:", value: links.instagram },
                                            { label: "Twitter:", value: links.twitter }
                                        ].map((link, idx) => (
                                            <div key={idx} className="flex items-center text-[12px]">
                                                <span className="w-24 text-[#374151] font-normal">{link.label}</span>
                                                <span className="font-normal text-[#111827] truncate flex-1">{link.value || "NA"}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-6 border-t border-gray-100">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2.5 bg-white border border-gray-300 rounded-[8px] text-sm font-semibold text-[#374151]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrackSwapModal;
