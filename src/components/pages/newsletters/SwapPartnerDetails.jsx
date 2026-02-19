import React from "react";
import { X, Send, Repeat, MessageCircle } from "lucide-react";

const SwapPartnerDetails = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    // Dummy data (replace with API later)
    const partner = {
        name: "John Doe",
        role: "Fantasy Author",
        swaps: "4.2 swaps completed",
        badge: "Verified Pro",
        avatar: "https://i.pravatar.cc/40?img=3",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-[#B8B8B8] pb-2">
                    <div>
                        <h2 className="text-lg font-semibold">Swap Partner Details</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            View and manage your newsletter swap arrangement
                        </p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={18} />
                    </button>
                </div>

                {/* Partner Info */}
                <div className="mt-5 flex items-start justify-between">
                    {/* Left Side */}
                    <div className="flex items-center gap-3">
                        <img
                            src={partner.avatar}
                            alt={partner.name}
                            className="h-11 w-11 rounded-full object-cover"
                        />

                        <div className="flex flex-col leading-tight">
                            <p className="text-sm font-semibold text-gray-900">
                                {partner.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {partner.role} • {partner.swaps}
                            </p>
                        </div>
                    </div>

                    {/* Badge */}
                    <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                        {partner.badge}
                    </span>
                </div>


                {/* Swap Arrangement Card */}
                <div className="mt-6 rounded-lg border border-gray-200 p-5">
                    <h3 className="text-sm font-medium text-gray-700 mb-4">
                        Swap Arrangement
                    </h3>

                    <div className="flex items-center justify-between">

                        {/* Left Side */}
                        <div className="flex flex-col items-center text-center w-1/2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E07A5F] mb-2">
                                <Send size={18} className="text-[#E07A5F]" />
                            </div>
                            <p className="text-sm font-medium text-gray-800">
                                Wednesday, May 15
                            </p>
                            <p className="text-xs">
                                You send to your audience
                            </p>
                            <p className="text-xs text-red-500 mt-1">
                                “Realm of Dreams”
                            </p>
                            <p className="text-xs">10:00 AM EST</p>
                        </div>

                        {/* Middle Icon */}
                        <Repeat className="text-gray-400" />

                        {/* Right Side */}
                        <div className="flex flex-col items-center text-center w-1/2">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E07A5F] mb-2">
                                <Send size={18} className="text-[#E07A5F]" />
                            </div>
                            <p className="text-sm font-medium text-gray-800">
                                Friday, May 17
                            </p>
                            <p className="text-xs   ">
                                Jane sends to her audience
                            </p>
                            <p className="text-xs text-red-500 mt-1">
                                “Mystery of the Old House”
                            </p>
                            <p className="text-xs">2:00 PM EST</p>
                        </div>

                    </div>

                    {/* Note */}
                    <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <div className="h-2 w-2 rounded-full bg-gray-400"></div>
                        Both newsletters will be sent to respective audiences with promotional content
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button className="flex items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm text-white hover:bg-teal-800">
                        <MessageCircle size={16} />
                        Message Jane
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SwapPartnerDetails;
