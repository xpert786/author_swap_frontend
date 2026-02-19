import React from "react";
import { X, Mail } from "lucide-react";
import { AiOutlineEye } from "react-icons/ai";
import SwapPartnerDetails from "./SwapPartnerDetails";
import { useState } from "react";


const SlotDetails = ({ isOpen, onClose, onEdit }) => {
    const [swapOpen, setSwapOpen] = useState(false);
    if (!isOpen) return null;

    // Dummy Data (replace later with API)
    const slot = {
        date: "Wednesday, May 15 at 10:00 AM EST",
        audienceSize: "12,450 subscribers",
        genre: "Fantasy",
        status: "Booked",
        visibility: "Private Only",
        partners: [
            {
                name: "Jane Doe",
                swaps: "2 swaps completed",
                avatar: "https://i.pravatar.cc/40?img=5",
                highlighted: true,
            },
            {
                name: "Ema Chen",
                swaps: "3 swaps completed",
                avatar: "https://i.pravatar.cc/40?img=8",
            },
            {
                name: "Ema Chen",
                swaps: "3 swaps completed",
                avatar: "https://i.pravatar.cc/40?img=12",
            },
        ],
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10">
            <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">

                {/* Header */}
                <div className="flex items-start justify-between border-b border-[#B8B8B8] pb-2">
                    <div>
                        <h2 className="text-lg font-semibold">Slot Details</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Manage slot settings and view swap partners
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Slot Information */}
                <div className="mt-5">
                    <h3 className="text-lg font-medium text-black mb-3 border-b border-[#B8B8B8] pb-1">
                        Slot Information
                    </h3>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex flex-col gap-1">
                            <p className="text-[#374151]">Date & Time</p>
                            <p className="font-medium text-gray-800">
                                {slot.date}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-[#374151]">Status</p>
                            <span className="inline-flex w-fit self-start rounded-full bg-[#16A34A33] px-3 py-1 text-xs font-medium text-black">
                                {slot.status}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-[#374151]">Visibility</p>
                            <span className="inline-flex w-fit self-start items-center gap-1 rounded-full bg-[#E8E8E8] px-3 py-1 text-xs font-medium text-black">
                                <AiOutlineEye className="text-sm" />
                                {slot.visibility}
                            </span>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-[#374151]">Audience Size</p>
                            <p className="font-medium text-gray-800">
                                {slot.audienceSize}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1">
                            <p className="text-[#374151]">Genre</p>
                            <span className="inline-flex w-fit self-start rounded-full bg-[#16A34A33] px-3 py-1 text-xs font-medium text-black">
                                {slot.genre}
                            </span>
                        </div>

                    </div>


                </div>

                {/* Swap Partners */}
                <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                        Swap Partners ({slot.partners.length})
                    </h3>

                    <div className="space-y-3">
                        {slot.partners.map((partner, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-between rounded-md border p-3 ${partner.highlighted
                                    ? "border-[#E07A5F] bg-[#E07A5F0D]"
                                    : "border-[#E8E8E8]"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={partner.avatar}
                                        alt={partner.name}
                                        className="h-9 w-9 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">
                                            {partner.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {partner.swaps}
                                        </p>
                                    </div>
                                </div>

                                {/* Right Side Icons */}
                                <div className="flex items-center gap-2">
                                    {partner.highlighted && (
                                        <div onClick={() => setSwapOpen(true)} className="rounded-md bg-[#2F6F6D33] p-2">
                                            <AiOutlineEye size={14} />
                                        </div>
                                    )}

                                    <SwapPartnerDetails
                                        isOpen={swapOpen}
                                        onClose={() => setSwapOpen(false)}
                                    />

                                    <button className="rounded-md border border-gray-200 p-2 hover:bg-gray-50">
                                        <Mail size={14} className="text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

                {/* Footer */}
                <div className="mt-6 flex justify-end gap-3 pt-4">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={onEdit}
                        className="rounded-md bg-[#2F6F6D] px-4 py-2 text-sm text-white hover:bg-[#2F6F6D]"
                    >
                        Edit Slot
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SlotDetails;
