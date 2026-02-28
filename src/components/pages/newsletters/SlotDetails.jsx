import React, { useState, useEffect } from "react";
import { X, Mail, Loader2, Eye, Pencil, Users } from "lucide-react";
import {
    ConfirmedSendsIcon,
    TimelinessIcon,
    CommunicationIcon,
    ReliabilityIcon,
    TopPartnerIcon
} from "../../icons";
import SwapPartnerDetails from "./SwapPartnerDetails";
import dayjs from "dayjs";
import { formatCamelCaseName } from "../../../utils/formatName";
import { getSlotDetails } from "../../../apis/newsletter";
import toast from "react-hot-toast";
import Edit from "../../../assets/edit.png";

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
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
                <div className="bg-white w-[600px] h-[400px] rounded-[10px] flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-[#2F6F6D] animate-spin" />
                </div>
            </div>
        );
    }

    if (!slotData) return null;

    const slot = {
        fullDate: slotData.send_date
            ? `${dayjs(slotData.send_date).format("dddd, MMMM D")} at ${slotData.send_time || "10:00 AM EST"}`
            : "N/A",
        audienceCount: (slotData.audience_size || 0).toLocaleString(),
        genre: formatCamelCaseName(slotData.preferred_genre) || "N/A",
        status: formatLabel(slotData.status) || "N/A",
        visibility: formatLabel(slotData.visibility) || "N/A",
        partners: slotData.swap_partners || slotData.partners || [],
    };

    return (
        <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-50">
            <div className="bg-white w-[600px] rounded-[10px] shadow-xl overflow-hidden m-5">
                <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar text-left">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-xl font-medium text-gray-800">
                                Slot Details
                            </h2>
                            <p className="text-[13px] text-[#374151] mt-0.5">
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
                    <div className="mb-8 mt-8">
                        <h3 className="font-medium text-black mb-4 border-b border-[#B8B8B8] pb-1">
                            Slot Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4 border-b border-gray-100 pb-8 ">
                            {/* Date & Time */}
                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] font-medium text-gray-500">Date & time</p>
                                <p className="text-[13px] font-semibold text-gray-800 leading-tight">
                                    {slot.fullDate}
                                </p>
                            </div>

                            {/* Status */}
                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] font-medium text-gray-500">Status</p>
                                <span className="inline-flex w-fit rounded-full px-3 py-0.5 text-[11px] font-semibold bg-[#E6F4EA] text-[#1E8E3E]">
                                    {slot.status}
                                </span>
                            </div>

                            {/* Visibility */}
                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] font-medium text-gray-500">Visibility</p>
                                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-gray-100 px-3 py-0.5 text-[11px] font-semibold text-gray-600">
                                    <Eye size={12} />
                                    {slot.visibility}
                                </span>
                            </div>

                            {/* Audience Size */}
                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] font-medium text-gray-500">Audience Size</p>
                                <p className="text-[13px] text-gray-800">
                                    <span className="font-medium">{slot.audienceCount} subscribers</span>
                                </p>
                            </div>

                            {/* Genre */}
                            <div className="flex flex-col gap-1">
                                <p className="text-[12px] font-medium text-gray-500">Genre</p>
                                <span className="inline-flex w-fit rounded-full bg-[#E6F4EA] px-3 py-0.5 text-[11px] font-semibold text-[#1E8E3E]">
                                    {slot.genre}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Swap Partners */}
                    <div>
                        <h3 className="text-[13px] font-bold text-gray-700 mb-4 border-b border-[#B8B8B8] pb-1">
                            Swap Partners ({slot.partners.length})
                        </h3>

                        <div className="space-y-3">
                            {slot.partners.length === 0 ? (
                                <div className="text-center py-8 text-gray-400 text-xs italic bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                    No partners for this slot yet
                                </div>
                            ) : (
                                slot.partners.map((partner, index) => (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${index === 0 ? 'border-[#F8D7DA] bg-[#FFF5F5]' : 'border-gray-200 bg-white'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={partner.author?.profile_picture || partner.sender_profile_picture || partner.avatar || `https://ui-avatars.com/api/?name=${partner.author?.name || partner.sender_name || 'User'}&background=random`}
                                                alt={partner.author?.name || partner.sender_name}
                                                className="h-10 w-10 rounded-full object-cover shadow-sm border border-gray-100"
                                            />
                                            <div>
                                                <p className="text-sm font-bold text-gray-800 leading-tight">
                                                    {partner.author?.name || partner.sender_name || 'Unknown Partner'}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${partner.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                        partner.status === 'completed' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {partner.status || 'active'}
                                                    </span>
                                                    {(partner.author?.swaps_completed || partner.swaps_completed) > 0 && (
                                                        <span className="text-[10px] text-gray-400 font-medium">
                                                            • {partner.author?.swaps_completed || partner.swaps_completed} Swaps
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => setSwapOpen(true)}
                                                className="p-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                                            >
                                                <Eye size={16} />
                                            </button>

                                            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                                                <Mail size={18} />
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
                            Cancel
                        </button>

                        <button
                            onClick={onEdit}
                            className="inline-flex items-center gap-2 px-5 py-1.5 text-[13px] rounded-lg bg-[#2F6F6D] text-white hover:opacity-90 shadow-sm transition-all font-medium active:scale-95"
                        >
                            <img
                                src={Edit}
                                alt="Edit"
                                className="w-4 h-4 filter invert brightness-0"
                            />
                            Edit Slot
                        </button>
                    </div>
                </div>
            </div>

            <SwapPartnerDetails
                isOpen={swapOpen}
                onClose={() => setSwapOpen(false)}
            />
        </div>
    );
};

export default SlotDetails;
