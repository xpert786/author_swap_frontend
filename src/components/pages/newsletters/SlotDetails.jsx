import React from "react";
import { X, Mail } from "lucide-react";
import { AiOutlineEye } from "react-icons/ai";
import SwapPartnerDetails from "./SwapPartnerDetails";
import { useState } from "react";
import { formatCamelCaseName } from "../../../utils/formatName";


const SlotDetails = ({ isOpen, onClose, onEdit }) => {
    const [swapOpen, setSwapOpen] = useState(false);
    if (!isOpen) return null;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
                <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Header */}
                    <div className="flex items-start justify-between border-b border-[#B8B8B8] pb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Slot Details
                            </h2>
                            <p className="text-[13px] text-gray-500 mt-0.5">
                                Manage slot settings and view swap partners
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Slot Information */}
                    <div className="mt-6">
                        <h3 className="text-[14px] font-bold text-gray-700 mb-4 uppercase tracking-wider border-b border-[#B8B8B8] pb-1">
                            Slot Information
                        </h3>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-[12px] font-medium text-gray-500 uppercase">
                                    Date & Time
                                </p>
                                <p className="text-[13px] font-semibold text-gray-800">
                                    {slot.date}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] font-medium text-gray-500 uppercase">
                                    Status
                                </p>
                                <span className="inline-flex w-fit rounded-full bg-[#16A34A15] px-3 py-0.5 text-[11px] font-semibold text-[#16A34A]">
                                    {slot.status}
                                </span>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] font-medium text-gray-500 uppercase">
                                    Visibility
                                </p>
                                <span className="inline-flex w-fit items-center gap-1 rounded-full bg-gray-100 px-3 py-0.5 text-[11px] font-semibold text-gray-600">
                                    <AiOutlineEye className="text-sm" />
                                    {slot.visibility}
                                </span>
                            </div>

                            <div className="flex flex-col gap-0.5">
                                <p className="text-[12px] font-medium text-gray-500 uppercase">
                                    Audience Size
                                </p>
                                <p className="text-[13px] font-semibold text-gray-800">
                                    {slot.audienceSize}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] font-medium text-gray-500 uppercase">
                                    Genre
                                </p>
                                <span className="inline-flex w-fit rounded-full bg-[#2F6F6D15] px-3 py-0.5 text-[11px] font-semibold text-[#2F6F6D]">
                                    {slot.genre}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Swap Partners */}
                    <div className="mt-8">
                        <h3 className="text-[13px] font-bold text-gray-700 mb-4 uppercase tracking-wider">
                            Swap Partners ({slot.partners.length})
                        </h3>

                        <div className="space-y-3">
                            {slot.partners.map((partner, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${partner.highlighted
                                        ? "border-[#E07A5F] bg-[#E07A5F08]"
                                        : "border-gray-100 hover:border-gray-200"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={partner.avatar}
                                            alt={partner.name}
                                            className="h-10 w-10 rounded-full object-cover shadow-sm"
                                        />
                                        <div>
                                            <p className="text-sm font-bold text-gray-800">
                                                {formatCamelCaseName(partner.name)}
                                            </p>
                                            <p className="text-[12px] text-gray-500">
                                                {partner.swaps}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right Side Icons */}
                                    <div className="flex items-center gap-2">
                                        {partner.highlighted && (
                                            <button
                                                onClick={() => setSwapOpen(true)}
                                                className="p-2 rounded-lg bg-[#2F6F6D15] text-[#2F6F6D] hover:bg-[#2F6F6D25] transition-colors"
                                            >
                                                <AiOutlineEye size={16} />
                                            </button>
                                        )}

                                        <SwapPartnerDetails
                                            isOpen={swapOpen}
                                            onClose={() => setSwapOpen(false)}
                                        />

                                        <button className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                                            <Mail size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="px-5 py-1.5 text-[13px] rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors font-medium"
                        >
                            Close
                        </button>

                        <button
                            onClick={onEdit}
                            className="px-5 py-1.5 text-[13px] rounded-lg bg-[#2F6F6D] text-white hover:opacity-90 transition shadow-sm font-medium"
                        >
                            Edit Slot
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SlotDetails;
