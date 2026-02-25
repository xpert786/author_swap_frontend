import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiRefreshCw } from "react-icons/fi";
import { PartyPopper, CalendarIcon } from "lucide-react";
import { getSwapHistory } from "../../../apis/swap";

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

    // Fallback if no specific history found but we have passed data
    const data = history || location.state?.data || {};

    const authorName = data.author_name || data.author || "Unknown Author";
    const authorImage = data.author_image || data.image || `https://ui-avatars.com/api/?name=${authorName}&background=random`;

    return (
        <div className="px-8 py-8 max-w-[1440px] mx-auto min-h-screen">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors w-10 h-10 rounded-full text-gray-700 shrink-0"
                >
                    <FiArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-[#111827]">Track My Swap</h1>
                    <p className="text-sm text-gray-500">Find places to promote your book</p>
                </div>
            </div>

            {/* Partner Card */}
            <div className="bg-white border border-[rgba(181,181,181,1)] rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[rgba(47,111,109,0.2)]">
                    <img src={authorImage} alt={authorName} className="w-16 h-16 rounded-full object-cover" />
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-black">{authorName}</h2>
                            <span className="text-[11px] text-gray-400">(Swap Partner)</span>
                        </div>
                        <p className="text-sm text-gray-500">{data.author_role || data.role || "Author"}</p>
                    </div>
                </div>

                <div className="pt-2">
                    <div className="flex gap-16">
                        <div>
                            <p className="text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide">Request Date</p>
                            <p className="text-base font-bold text-gray-900">{data.request_date || data.requestDate || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium mb-1.5 uppercase tracking-wide">Compete Date</p>
                            <p className="text-base font-bold text-gray-900">{data.completed_date || data.completedDate || "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Banner Section */}
            <div className="bg-white border border-[rgba(181,181,181,1)] rounded-xl p-6 mb-6">
                <div
                    className="rounded-2xl p-4 text-center text-white flex items-center justify-center gap-3 border"
                    style={{
                        background: "linear-gradient(180deg, #2F6F6D 3.25%, #16A34A 177.92%)",
                        borderColor: "rgba(181, 181, 181, 1)"
                    }}
                >
                    <div className="w-8 h-8 flex items-center justify-center text-white">
                        <PartyPopper size={24} />
                    </div>
                    <span className="text-xl font-bold uppercase">{data.status === "completed" ? "Swap Competed" : data.status || "Swap Tracked"}</span>
                </div>
            </div>

            {/* Content Split: Links / Promoting Book */}
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
                {/* Links Container */}
                <div className="bg-white border border-[rgba(181,181,181,1)] rounded-xl p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Links</h3>
                    <div className="space-y-4">
                        {(data.links || [
                            { label: "Website:", value: "https://www.janedoeauthor.com" },
                            { label: "Facebook:", value: "https://facebook.com/janedoeauthor" },
                            { label: "Instagram:", value: "https://instagram.com/janedoeauthor" },
                            { label: "Twitter:", value: "https://twitter.com/janedoeauthor" }
                        ]).map((link, idx) => (
                            <div key={idx} className="flex text-sm">
                                <span className="w-24 text-gray-500 font-medium">{link.label}</span>
                                <span className="font-medium text-gray-700">{link.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Promoting Book Container */}
                <div className="bg-white border border-[rgba(181,181,181,1)] rounded-xl p-6">
                    <div className="flex gap-6">
                        <img
                            src={data.book_image || "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=200"}
                            className="w-40 h-56 object-cover rounded-xl shadow-md shrink-0"
                        />
                        <div className="flex-1">
                            <div className="border-b border-gray-100 pb-2 mb-4">
                                <p className="text-base font-bold text-gray-900 tracking-tight">Promoting Book</p>
                            </div>
                            <div className="flex justify-between items-center">
                                <h4 className="text-sm font-normal text-gray-600">{data.requesting_book || data.requestingBook || "The Midnight Garden"}</h4>
                                <span className="bg-[#E8E8E8] text-gray-500 text-[11px] px-3.5 py-1 rounded-full font-medium shrink-0">
                                    Upcoming
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTR Analysis Section */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Link-Level CTR Analysis</h3>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white border-separate border-spacing-0">
                        <thead>
                            <tr style={{ background: "rgba(47, 111, 109, 0.1)" }}>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider border-t border-b border-[rgba(181,181,181,1)]">Link / Destination</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider border-t border-b border-[rgba(181,181,181,1)]">Clicks</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider border-t border-b border-[rgba(181,181,181,1)]">CTR</th>
                                <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-600 uppercase tracking-wider border-t border-b border-[rgba(181,181,181,1)]">Conversion</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {(data.ctr_analysis || [
                                {
                                    name: "The Midnight Garden",
                                    url: "https://amazon.com/dp/B0C123456",
                                    clicks: 187,
                                    ctr: "4.1%",
                                    ctrStatus: "Excellent",
                                    conv: "23 sales"
                                },
                                {
                                    name: "Amazon - Winter Whispers",
                                    url: "https://amazon.com/dp/B0C789012",
                                    clicks: 120,
                                    ctr: "2.1%",
                                    ctrStatus: "Good",
                                    conv: "15 sales"
                                }
                            ]).map((row, idx) => (
                                <tr key={idx} className="">
                                    <td className="px-6 py-4 border-b border-[rgba(181,181,181,1)]">
                                        <p className="text-xs font-bold text-gray-800">{row.name}</p>
                                        <p className="text-[10px] text-gray-400">{row.url}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700 border-b border-[rgba(181,181,181,1)]">{row.clicks}</td>
                                    <td className="px-6 py-4 border-b border-[rgba(181,181,181,1)]">
                                        <p className="text-xs font-bold text-gray-700">{row.ctr}</p>
                                        <p className="text-[10px] font-bold text-[rgba(22,163,74,1)]">
                                            {row.ctrStatus}
                                        </p>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-gray-700 border-b border-[rgba(181,181,181,1)]">{row.conv}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SwapHistory;
