import React, { useState, useEffect } from "react";
import {
    Star,
    Reply,
    MoreVertical,
    ChevronDown,
    CornerUpRight,
    ReplyAll,
    Loader2,
    Trash2,
} from "lucide-react";
import { getEmailDetails, updateEmail, deleteEmail } from "../../../apis/emails";
import toast from "react-hot-toast";

const CommunicationMail = ({ mail, onBack }) => {
    const [fullMail, setFullMail] = useState(mail);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const response = await getEmailDetails(mail.id);
                setFullMail(response.data);
            } catch (error) {
                console.error("Failed to fetch mail details:", error);
                toast.error("Failed to load email content");
            } finally {
                setLoading(false);
            }
        };

        if (mail?.id) {
            fetchDetails();
        }
    }, [mail.id]);

    const handleStar = async () => {
        try {
            const newStarredStatus = !fullMail.is_starred;
            await updateEmail(fullMail.id, { is_starred: newStarredStatus });
            setFullMail({ ...fullMail, is_starred: newStarredStatus });
            toast.success(newStarredStatus ? "Email starred" : "Email unstarred");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Move this email to trash?")) return;
        try {
            await deleteEmail(fullMail.id);
            toast.success("Email moved to trash");
            onBack();
        } catch (error) {
            toast.error("Failed to delete email");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-40">
                <Loader2 className="w-8 h-8 text-[#2F6F6D] animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl border border-[#B5B5B5] shadow-sm overflow-hidden min-h-[500px]">
            {/* Back Button */}
            <div className="p-3 md:p-4 border-b border-gray-100 flex items-center gap-2">
                <button
                    onClick={onBack}
                    className="text-sm text-[#2F6F6D] hover:underline flex items-center gap-1"
                >
                    ← Back to Inbox
                </button>
            </div>

            <div className="p-4 md:p-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 md:mb-8">
                    <div className="flex items-start gap-3 md:gap-4">
                        <img
                            src={fullMail.sender_avatar || fullMail.avatar || `https://ui-avatars.com/api/?name=${fullMail.sender_name || fullMail.name}&background=random`}
                            alt={fullMail.sender_name || fullMail.name}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm"
                        />
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                                <h2 className="text-base md:text-lg font-bold text-gray-900 truncate">
                                    {fullMail.sender_name || fullMail.name}
                                </h2>
                                <span className="text-gray-400 text-xs md:text-sm truncate">
                                    &lt;{fullMail.sender_email || fullMail.email}&gt;
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500 mt-1">
                                <span>Subject: {fullMail.subject}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 text-gray-400">
                        <span className="text-[10px] md:text-xs font-medium">
                            {fullMail.created_at || fullMail.date || fullMail.time}
                        </span>
                        <div className="flex items-center gap-3">
                            <Star
                                size={18}
                                onClick={handleStar}
                                className={`cursor-pointer transition-colors ${fullMail.is_starred ? "text-yellow-400 fill-yellow-400" : "hover:text-yellow-400"}`}
                            />
                            <Trash2
                                size={18}
                                onClick={handleDelete}
                                className="cursor-pointer hover:text-red-500"
                            />
                            <Reply size={18} className="cursor-pointer hover:text-gray-600" />
                            <MoreVertical
                                size={18}
                                className="cursor-pointer hover:text-gray-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Message Content */}
                <div className="text-sm text-[#2D2F33] leading-relaxed mb-8 md:mb-10 max-w-4xl whitespace-pre-wrap">
                    {fullMail.body || fullMail.message}
                </div>

                {/* Quick Action Buttons */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2 md:gap-3">
                        <button className="flex-1 sm:flex-none px-4 py-2 border border-[#B5B5B5] rounded-lg text-[12px] md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Thanks for the request
                        </button>
                        <button className="flex-1 sm:flex-none px-4 py-2 border border-[#B5B5B5] rounded-lg text-[12px] md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                            Accepted - Here's my promo info
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-2 md:gap-3">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 border border-[#B5B5B5] rounded-lg text-[12px] md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            <Reply size={16} />
                            Reply
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 border border-[#B5B5B5] rounded-lg text-[12px] md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            Forward
                            <CornerUpRight size={16} />
                        </button>
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 border border-[#B5B5B5] rounded-lg text-[12px] md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            Reply All
                            <ReplyAll size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


export default CommunicationMail;
