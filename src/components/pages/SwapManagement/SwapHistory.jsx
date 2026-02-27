import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { PartyPopper } from "lucide-react";
import { getSwapHistory } from "../../../apis/swap";
import { formatCamelCaseName } from "../../../utils/formatName";

const SwapHistory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const response = await getSwapHistory(id);
                setHistory(response.data);
            } catch (error) {
                console.error("Failed to fetch swap history:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <FiRefreshCw className="animate-spin text-[#2F6F6D] mb-4" size={40} />
                <p className="text-gray-500 font-medium tracking-tight">Loading swap history...</p>
            </div>
        );
    }

    const data = history || {};
    const partnerName = data.partner_name || "Unknown Partner";
    const partnerImage = data.partner_profile_picture || `https://ui-avatars.com/api/?name=${partnerName}&background=random`;
    const book = data.promoting_book || {};

    return (
        <div className="min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors w-10 h-10 rounded-full text-gray-700 shrink-0"
                >
                    <FiArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold">Track my swap</h1>
                    <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">View your swap request and status details</p>
                </div>
            </div>

            {/* Partner Card */}
            <div className="bg-white border border-[#B5B5B5] rounded-[8px] p-4 mb-6">
                <div className="flex items-center gap-4 pb-2 border-b border-[#2F6F6D33]">
                    <img src={partnerImage} alt={partnerName} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-medium text-black">{formatCamelCaseName(partnerName)}</h2>
                            <span className="text-[11px] text-[#111827]">({data.partner_label || "Swap Partner"})</span>
                        </div>
                        <p className="text-xs text-[#374151] font-medium">{data.partner_genre || "Author"}</p>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex gap-16">
                        <div>
                            <p className="text-xs text-[#374151] font-medium mb-1.5">Request Date</p>
                            <p className="text-base font-medium text-[#111827]">{data.request_date || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#374151] font-medium mb-1.5">Competed Date</p>
                            <p className="text-base font-medium text-[#111827]">{data.completed_date || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Banner */}
            <div className="bg-white border border-[#B5B5B5] rounded-[8px] p-4 mb-6">
                <div
                    className="rounded-[10px] p-4 text-center text-white flex items-center justify-center gap-3 border shadow-sm"
                    style={{
                        background: "linear-gradient(180deg, #2F6F6D 3.25%, #16A34A 177.92%)",
                        borderColor: "rgba(181, 181, 181, 1)"
                    }}
                >
                    <PartyPopper size={24} className="text-white" />
                    <span className="text-lg font-medium">{data.status_label || "Swap Tracked"}</span>
                </div>
            </div>

            {/* Links Container */}
            <div className="bg-white border border-[#B5B5B5] rounded-[8px] p-4 mb-6">
                <h3 className="text-lg font-medium text-black mb-3">Links</h3>
                <div className="space-y-3">
                    <div className="flex text-sm">
                        <span className="w-24 text-[#374151] font-normal">Website:</span>
                        <span className="text-[#374151] font-normal">{data.partner_links?.website || "N/A"}</span>
                    </div>
                    <div className="flex text-sm">
                        <span className="w-24 text-[#374151] font-normal">Facebook:</span>
                        <span className="text-[#374151] font-normal">{data.partner_links?.facebook || "N/A"}</span>
                    </div>
                    <div className="flex text-sm">
                        <span className="w-24 text-[#374151] font-normal">Instagram:</span>
                        <span className="text-[#374151] font-normal">{data.partner_links?.instagram || "N/A"}</span>
                    </div>
                    <div className="flex text-sm">
                        <span className="w-24 text-[#374151] font-normal">Twitter:</span>
                        <span className="text-[#374151] font-normal">{data.partner_links?.twitter || "N/A"}</span>
                    </div>
                </div>
            </div>

            {/* Promoting Book Container */}
            <div className="bg-white border border-[#B5B5B5] rounded-[8px] p-4 mb-6">
                <div className="flex gap-6 items-start">
                    {book.cover ? (
                        <img
                            src={book.cover}
                            className="w-44 h-64 object-cover rounded-xl shadow-md shrink-0"
                            alt="Book Cover"
                        />
                    ) : (
                        <div className="w-44 h-64 bg-gray-100 flex items-center justify-center rounded-xl border border-dashed border-gray-300 shrink-0">
                            <span className="text-xs text-gray-400 font-medium">No Image</span>
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="border-b border-[#2F6F6D33] pb-1.5 mb-2">
                            <p className="font-semibold text-[#111827] tracking-tight">Promoting Book</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <h4 className="text-sm font-normal text-[#111827]">{book.title || "Unknown Book"}</h4>
                            <span className="bg-[#E8E8E8] text-[#374151] text-[10px] px-2.5 py-0.5 rounded-full font-medium">
                                {book.status || "Upcoming"}
                            </span>
                        </div>
                        {data.message && (
                            <div className="mt-4">
                                <p className="text-[12px] text-gray-400 italic mb-1">Message:</p>
                                <p className="text-[13px] text-[#374151] line-clamp-3">"{data.message}"</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* CTR Analysis Section */}
            <div>
                <h3 className="text-lg font-medium text-black mb-4">Link-Level CTR Analysis</h3>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white border border-[#B5B5B5] border-separate border-spacing-0 rounded-[8px]">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="p-4 text-left text-[11px] font-medium text-[#111827] border-b border-[#B5B5B5]">Link / Destination</th>
                                <th className="p-4 text-left text-[11px] font-medium text-[#111827] border-b border-[#B5B5B5]">Clicks</th>
                                <th className="p-4 text-left text-[11px] font-medium text-[#111827] border-b border-[#B5B5B5]">CTR</th>
                                <th className="p-4 text-left text-[11px] font-medium text-[#111827] border-b border-[#B5B5B5]">Conversion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.link_ctr_analysis && data.link_ctr_analysis.length > 0 ? (
                                data.link_ctr_analysis.map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="p-4 border-b border-[#B5B5B5]">
                                            <p className="text-xs font-medium text-gray-800">{row.name}</p>
                                            <p className="text-[10px] text-[#374151]">{row.url}</p>
                                        </td>
                                        <td className="p-4 text-sm font-medium text-gray-700 border-b border-[#B5B5B5]">{row.clicks}</td>
                                        <td className="p-4 border-b border-[#B5B5B5]">
                                            <p className="text-xs font-medium text-gray-700">{row.ctr}</p>
                                            <p className={`text-[10px] font-medium ${row.ctrStatus === "Excellent" ? "text-green-600" : "text-orange-500"}`}>
                                                {row.ctrStatus}
                                            </p>
                                        </td>
                                        <td className="p-4 text-xs font-medium text-gray-700 border-b border-[#B5B5B5]">{row.conv}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-12 text-center text-sm text-gray-400 italic">
                                        No CTR analysis data available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SwapHistory;
