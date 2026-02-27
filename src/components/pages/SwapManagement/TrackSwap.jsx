import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { PartyPopper, CalendarIcon } from "lucide-react";
import { trackSwap } from "../../../apis/swap";

const TrackSwap = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [trackData, setTrackData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrackData = async () => {
            try {
                setLoading(true);
                const response = await trackSwap(id);
                setTrackData(response.data);
            } catch (error) {
                console.error("Failed to fetch swap tracking data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrackData();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <FiRefreshCw className="animate-spin text-[#2F6F6D] mb-4" size={40} />
                <p className="text-gray-500 font-medium tracking-tight">Loading tracking info...</p>
            </div>
        );
    }

    // Fallback if no specific data found but we have passed state
    const data = trackData || location.state?.data || {};

    const authorName = data.partner_name || data.author_name || data.author || "Unknown Author";
    const authorImage = data.partner_profile_picture || data.profile_picture || data.author_image || data.image || `https://ui-avatars.com/api/?name=${authorName}&background=random`;
    const authorRole = data.partner_genre || data.author_genre_label || data.author_role || "Author";

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
                    <h1 className="text-2xl font-semibold">Track My Swap</h1>
                    <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">Real-time status of your newsletter partnership</p>
                </div>
            </div>

            {/* Partner Card */}
            <div className="bg-white border border-[#B5B5B5] rounded-[8px] p-4 mb-6">
                <div className="flex items-center gap-4 pb-2 border-b border-[#2F6F6D33]">
                    <img src={authorImage} alt={authorName} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-medium text-black">{authorName}</h2>
                            <span className="text-[11px] text-[#111827]">(Swap Partner)</span>
                        </div>
                        <p className="text-sm text-[#374151] font-medium">{authorRole}</p>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex gap-16">
                        <div>
                            <p className="text-xs text-[#374151] font-medium mb-1.5">Request Date</p>
                            <p className="text-base font-medium text-[#111827]">{data.request_date || (data.created_at ? new Date(data.created_at).toLocaleDateString() : "N/A")}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[#374151] font-medium mb-1.5">Deadline / Send Date</p>
                            <p className="text-base font-medium text-[#111827]">{data.deadline || data.scheduled_date || data.send_date || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Banner Section */}
            <div className="bg-white border border-[#B5B5B5] rounded-[8px] p-4 mb-6">
                <div
                    className="rounded-[10px] p-4 text-center text-white flex items-center justify-center gap-3 border"
                    style={{
                        background: "linear-gradient(180deg, #2F6F6D 3.25%, #16A34A 177.92%)",
                        borderColor: "rgba(181, 181, 181, 1)"
                    }}
                >
                    <div className="w-8 h-8 flex items-center justify-center text-white">
                        <PartyPopper size={24} />
                    </div>
                    <span className="text-lg font-medium">{data.status_label || ((data.status === "completed" || data.status === "complete") ? "Swap Completed" : (data.status ? data.status.charAt(0).toUpperCase() + data.status.slice(1) : "In Progress"))}</span>
                </div>
            </div>

            {/* Content Split: Links / Promoting Book */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Links Container */}
                <div className="bg-white border border-[#B5B5B5] rounded-[8px] p-4 h-full">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Partner Links</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Website:", value: data.partner_links?.website || "N/A" },
                            { label: "Facebook:", value: data.partner_links?.facebook || "N/A" },
                            { label: "Instagram:", value: data.partner_links?.instagram || "N/A" },
                            { label: "Twitter:", value: data.partner_links?.twitter || "N/A" }
                        ].map((link, idx) => (
                            <div key={idx} className="flex text-sm mb-3">
                                <span className="w-24 text-[#374151] font-medium">{link.label}</span>
                                <span className="font-normal text-[#374151] truncate flex-1">{link.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Promoting Book Container */}
                <div className="bg-white border border-[#B5B5B5] rounded-[8px] p-4 h-full">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Promoting Book</h3>
                    <div className="flex gap-6">
                        <img
                            src={data.promoting_book?.cover || "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=200"}
                            className="w-32 h-44 object-cover rounded-lg shadow-sm shrink-0 bg-gray-50"
                        />
                        <div className="flex-1">
                            <div className="border-b border-[#2F6F6D33] pb-1 mb-2">
                                <p className="font-semibold text-[#111827] tracking-tight">{data.promoting_book?.title || "Book Title"}</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-normal text-gray-600">Genre: {data.promoting_book?.genre || "N/A"}</h4>
                                <span className="bg-[#E8E8E8] text-black text-[11px] px-3.5 py-1 rounded-full font-medium shrink-0 capitalize">
                                    {data.promoting_book?.badge || "Upcoming"}
                                </span>
                            </div>
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-[10px] text-gray-400 font-medium uppercase mb-1">Message</p>
                                <p className="text-xs text-[#374151] italic">"{data.message || "No message provided"}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTR Analysis Section */}
            <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Link-Level CTR Analysis</h3>
                <div className="overflow-x-auto bg-white border border-[#B5B5B5] rounded-[8px]">
                    <table className="w-full border-separate border-spacing-0">
                        <thead>
                            <tr style={{ background: "rgba(47, 111, 109, 0.1)" }}>
                                <th className="p-4 text-left text-[11px] font-medium text-[#111827] border-b border-[#B5B5B5]">Link / Destination</th>
                                <th className="p-4 text-left text-[11px] font-medium text-[#111827] border-b border-[#B5B5B5]">Clicks</th>
                                <th className="p-4 text-left text-[11px] font-medium text-[#111827] border-b border-[#B5B5B5]">CTR</th>
                                <th className="p-4 text-left text-[11px] font-medium text-[#111827] border-b border-[#B5B5B5]">Conversion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data.ctr_analysis || [
                                {
                                    name: data.promoting_book?.title || "Book Link",
                                    url: data.amazon_url || "N/A",
                                    clicks: 0,
                                    ctr: "0%",
                                    ctrStatus: "N/A",
                                    conv: "0 sales"
                                }
                            ]).map((row, idx) => (
                                <tr key={idx}>
                                    <td className="p-4 border-b border-[#B5B5B5]">
                                        <p className="text-xs font-medium text-gray-800">{row.name}</p>
                                        <p className="text-[10px] text-[#374151] truncate max-w-xs">{row.url}</p>
                                    </td>
                                    <td className="p-4 text-sm font-medium text-gray-700 border-b border-[#B5B5B5]">{row.clicks}</td>
                                    <td className="p-4 border-b border-[#B5B5B5]">
                                        <p className="text-xs font-medium text-gray-700">{row.ctr}</p>
                                        <p className={`text-[10px] font-medium ${row.ctrStatus === 'Excellent' ? 'text-green-600' : 'text-gray-500'}`}>
                                            {row.ctrStatus}
                                        </p>
                                    </td>
                                    <td className="p-4 text-xs font-medium text-gray-700 border-b border-[#B5B5B5]">{row.conv}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TrackSwap;
