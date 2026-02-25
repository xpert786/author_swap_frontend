import React from "react";
import {
    Star,
    Reply,
    MoreVertical,
    ChevronDown,
    CornerUpRight,
    ReplyAll,
} from "lucide-react";

const CommunicationMail = ({ mail, onBack }) => {
    return (
        <div className="bg-white rounded-2xl border border-[#B5B5B5] shadow-sm overflow-hidden">
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
                            src={mail.avatar || "https://i.pravatar.cc/40?img=1"}
                            alt={mail.name}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover shadow-sm"
                        />
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-baseline gap-x-2">
                                <h2 className="text-base md:text-lg font-bold text-gray-900 truncate">{mail.name}</h2>
                                <span className="text-gray-400 text-xs md:text-sm truncate">
                                    &lt;{mail.email}&gt;
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] md:text-xs text-gray-500 mt-1">
                                <span>To me , john Deo</span>
                                <ChevronDown size={14} className="cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 text-gray-400">
                        <span className="text-[10px] md:text-xs font-medium">9:14 AM (8 hours ago)</span>
                        <div className="flex items-center gap-3">
                            <Star size={18} className="cursor-pointer hover:text-yellow-400" />
                            <Reply size={18} className="cursor-pointer hover:text-gray-600" />
                            <MoreVertical
                                size={18}
                                className="cursor-pointer hover:text-gray-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Message Content */}
                <div className="text-sm text-[#2D2F33] leading-relaxed mb-8 md:mb-10 max-w-4xl">
                    <p>
                        Aliqua id fugiat nostrud irure ex duis ea quis id quis ad et. qui
                        esse pariatur duis deserunt mollit dolore cillum minim tempor enim.
                        Elit aute irure tempor cupidatat incididunt sint deserunt ut
                        voluptate aute id deserunt nisi.
                    </p>
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
