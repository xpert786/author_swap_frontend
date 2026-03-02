import React from "react";
import { X, Send, Repeat, MessageCircle } from "lucide-react";
import { formatCamelCaseName } from "../../../utils/formatName";
import { useNavigate } from "react-router-dom";

const SwapPartnerDetails = ({ isOpen, onClose, partnerData }) => {
    const navigate = useNavigate();
    if (!isOpen) return null;

    // Robust data extraction: handles both a slot object (with swap_partners array) 
    // or a direct partner arrangement object.
    const arrangement = partnerData?.swap_partners?.[0] || partnerData || {};
    const partnerAuthor = arrangement.author || {};

    const partner = partnerData ? {
        name: partnerAuthor.name || arrangement.sender_name || "Partner",
        role: partnerAuthor.primary_genre || "Author",
        swaps: `${partnerAuthor.swaps_completed || arrangement.swaps_completed || 0} swaps completed`,
        badge: arrangement.status || "Active",
        avatar: partnerAuthor.profile_picture || arrangement.sender_profile_picture || arrangement.avatar || `https://ui-avatars.com/api/?name=${partnerAuthor.name || arrangement.sender_name || 'User'}&background=random`,
        id: partnerAuthor.id || arrangement.sender_id || arrangement.id,
        reputation: partnerAuthor.reputation_score || 0,
        audienceSize: arrangement.partner_audience_size || partnerAuthor.audience_size || 0
    } : {
        name: "John Doe",
        role: "Fantasy Author",
        swaps: "4.2 swaps completed",
        badge: "Verified Pro",
        avatar: "https://i.pravatar.cc/40?img=3",
    };

    const handleMessageClick = () => {
        if (!partner.id) return;
        navigate("/communication", {
            state: {
                partnerId: partner.id,
                partnerName: partner.name,
                partnerAvatar: partner.avatar
            }
        });
        onClose();
    };

    // Helper to format time (e.g., 10:24:00 -> 10:24 AM)
    const formatTime = (timeStr) => {
        if (!timeStr) return null;
        try {
            const [hours, minutes] = timeStr.split(':');
            const h = parseInt(hours);
            const ampm = h >= 12 ? 'PM' : 'AM';
            const displayH = h % 12 || 12;
            return `${displayH}:${minutes} ${ampm}`;
        } catch (e) {
            return timeStr;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
                <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-[#B8B8B8] pb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Swap Partner Details
                            </h2>
                            <p className="text-[13px] text-gray-500 mt-0.5">
                                View and manage your newsletter swap arrangement
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Partner Info */}
                    <div className="mt-6 flex items-start justify-between">
                        {/* Left Side */}
                        <div className="flex items-center gap-3">
                            <img
                                src={partner.avatar}
                                alt={partner.name}
                                className="h-11 w-11 rounded-full object-cover shadow-sm bg-gray-50"
                            />

                            <div className="flex flex-col leading-tight">
                                <p className="text-sm font-bold text-gray-900">
                                    {formatCamelCaseName(partner.name)}
                                </p>
                                <p className="text-[12px] text-gray-500">
                                    {partner.role ? formatCamelCaseName(partner.role) : "Author"} • {partner.swaps}
                                    {partner.reputation > 0 && ` • ${partner.reputation} Rep`}
                                    {partner.audienceSize > 0 && ` • ${partner.audienceSize.toLocaleString()} Subs`}
                                </p>
                            </div>
                        </div>

                        {/* Badge */}
                        <span className="rounded-full bg-[#2F6F6D15] px-3 py-0.5 text-[11px] font-semibold text-[#2F6F6D] capitalize">
                            {partner.badge}
                        </span>
                    </div>

                    {/* Swap Arrangement Card */}
                    <div className="mt-6 rounded-xl border border-gray-100 p-5 bg-gray-50/50">
                        <h3 className="text-[13px] font-bold text-gray-700 mb-5 uppercase tracking-wider">
                            Swap Arrangement
                        </h3>

                        <div className="flex items-center justify-between">
                            {/* Left Side (You) */}
                            <div className="flex flex-col items-center text-center w-[45%]">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E07A5F] mb-2 bg-white shadow-sm">
                                    <Send size={18} className="text-[#E07A5F]" />
                                </div>
                                <p className="text-[13px] font-bold text-gray-800">
                                    {arrangement.you_send_date_formatted || partnerData?.send_date || "Date TBD"}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-1">
                                    You send to your audience
                                </p>
                                <p className="text-[12px] font-semibold text-[#2F6F6D] mt-1">
                                    {arrangement.you_send_book ? `Book: ${arrangement.you_send_book.title || arrangement.you_send_book}` : (partnerData?.preferred_genre ? `${formatCamelCaseName(partnerData.preferred_genre)} Promo` : "Newsletter Promo")}
                                </p>
                                <p className="text-[11px] font-medium text-gray-400">
                                    {formatTime(arrangement.you_send_time) || formatTime(partnerData?.send_time) || "Time TBD"}
                                </p>
                            </div>

                            {/* Middle Icon */}
                            <Repeat className="text-gray-300" size={20} />

                            {/* Right Side (Partner) */}
                            <div className="flex flex-col items-center text-center w-[45%]">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E07A5F] mb-2 bg-white shadow-sm">
                                    <Send size={18} className="text-[#E07A5F]" />
                                </div>
                                <p className="text-[13px] font-bold text-gray-800">
                                    {arrangement.partner_sends_date_formatted || "Date TBD"}
                                </p>
                                <p className="text-[11px] text-gray-500 mt-1">
                                    {formatCamelCaseName(partner.name)} sends to audience
                                </p>
                                <p className="text-[12px] font-semibold text-[#2F6F6D] mt-1">
                                    {arrangement.partner_sends_book ? `Book: ${arrangement.partner_sends_book.title || arrangement.partner_sends_book}` : (partnerAuthor.primary_genre ? `${formatCamelCaseName(partnerAuthor.primary_genre)} Promo` : "Newsletter Promo")}
                                </p>
                                <p className="text-[11px] font-medium text-gray-400">
                                    {formatTime(arrangement.partner_sends_time) || "Time TBD"}
                                </p>
                            </div>
                        </div>

                        {/* Note */}
                        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-gray-400 italic">
                            <div className="h-1.5 w-1.5 rounded-full bg-gray-300"></div>
                            Arrangement active since {new Date(arrangement.created_at || new Date()).toLocaleDateString()}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="px-6 py-1.5 text-[13px] rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleMessageClick}
                            className="flex items-center gap-2 rounded-lg bg-[#2F6F6D] px-6 py-1.5 text-[13px] font-semibold text-white hover:opacity-90 transition shadow-sm"
                        >
                            <MessageCircle size={16} />
                            Message {formatCamelCaseName(partner.name)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SwapPartnerDetails;
