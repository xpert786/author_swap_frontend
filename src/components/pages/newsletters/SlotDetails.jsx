import React, { useState, useEffect } from "react";
import { X, Mail, Loader2, Users } from "lucide-react";
import { AiOutlineEye } from "react-icons/ai";
import SwapPartnerDetails from "./SwapPartnerDetails";
import { formatCamelCaseName } from "../../../utils/formatName";
import { getSlotDetails } from "../../../apis/newsletter";
import toast from "react-hot-toast";

const SlotDetails = ({ isOpen, onClose, onEdit, slotId }) => {
    const [swapOpen, setSwapOpen] = useState(false);
    const [slotData, setSlotData] = useState(null);
    const [loading, setLoading] = useState(true);

    const formatLabel = (value) => {
        if (!value) return "";
        return value
            .replace(/_/g, " ")
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());
    };

    useEffect(() => {
        const fetchDetails = async () => {
            if (!slotId) return;
            try {
                setLoading(true);
                const response = await getSlotDetails(slotId);
                setSlotData(response.data);
            } catch (error) {
                console.error("Failed to fetch slot details:", error);
                toast.error("Failed to load slot details");
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchDetails();
        }
    }, [isOpen, slotId]);

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                <div className="bg-white w-[600px] h-[400px] rounded-[10px] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#2F6F6D] animate-spin" />
                </div>
            </div>
        );
    }

    if (!slotData) return null;

    const slot = {
        date: `${slotData.formatted_date || ""} ${slotData.formatted_time || ""}`.trim() || slotData.send_time || "N/A",
        audienceSize: Number(slotData.audience_size || 0).toLocaleString() + " subscribers",
        genre: formatLabel(slotData.preferred_genre) || "N/A",
        status: formatLabel(slotData.status) || "N/A",
        visibility: formatLabel(slotData.visibility) || "N/A",
        partners: slotData.partners || [],
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
                                <span className={`inline-flex w-fit rounded-full px-3 py-0.5 text-[11px] font-semibold ${slot.status === 'Available' ? 'bg-[#16A34A15] text-[#16A34A]' : 'bg-[#2F6F6D15] text-[#2F6F6D]'}`}>
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
                            {slot.partners.length === 0 ? (
                                <div className="text-center py-6 text-gray-400 text-xs italic border border-dashed border-gray-200 rounded-xl bg-gray-50/30">
                                    No partners for this slot yet
                                </div>
                            ) : (
                                slot.partners.map((partner, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between rounded-xl border p-3 transition-colors border-gray-100 hover:border-gray-200`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={partner.sender_profile_picture || partner.avatar || `https://ui-avatars.com/api/?name=${partner.sender_name || 'User'}&background=random`}
                                                alt={partner.sender_name}
                                                className="h-10 w-10 rounded-full object-cover shadow-sm"
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-gray-800">
                                                    {partner.sender_name || 'Unknown Partner'}
                                                </p>
                                                <p className="text-[12px] text-gray-500">
                                                    {partner.status || 'Active partner'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Right Side Icons */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setSwapOpen(true)}
                                                className="p-2 rounded-lg bg-[#2F6F6D15] text-[#2F6F6D] hover:bg-[#2F6F6D25] transition-colors"
                                            >
                                                <AiOutlineEye size={16} />
                                            </button>

                                            <SwapPartnerDetails
                                                isOpen={swapOpen}
                                                onClose={() => setSwapOpen(false)}
                                            />

                                            <button className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors">
                                                <Mail size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
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
