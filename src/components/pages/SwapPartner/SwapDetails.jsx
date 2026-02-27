import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiRefreshCw, FiArrowLeft } from "react-icons/fi";
import { getSlotDetails } from "../../../apis/swapPartner";
import {
    PublicIcon,
    PartnersIcon,
    ConfirmedSendsIcon,
    TimelinessIcon,
    MissedSendsIcon,
    CommunicationIcon,
    CalendarIcon,
} from "../../icons";
import "./SwapDetails.css";
import SwapIcon from "../../../assets/swap.png";

const ProgressBar = ({ percent, color }) => (
    <div className="w-full h-2 bg-gray-100 rounded-full my-3 overflow-hidden">
        <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, backgroundColor: color }}
        />
    </div>
);

const Stars = ({ count }) => (
    <div className="flex items-center gap-0.5">
        {[...Array(5)].map((_, i) => (
            <svg
                key={i}
                className={`w-3 h-3 ${i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}`}
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const StatusChip = ({ status }) => {
    const isCompleted = status?.toLowerCase() === "completed";
    return (
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${isCompleted ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
            }`}>
            {status}
        </span>
    );
};

const toCamel = (obj) => {
    if (Array.isArray(obj)) return obj.map(v => toCamel(v));
    if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((result, key) => ({
            ...result,
            [key.replace(/_([a-z])/g, g => g[1].toUpperCase())]: toCamel(obj[key]),
        }), {});
    }
    return obj;
};

const formatLabel = (str) => {
    if (!str) return "N/A";
    return str
        .replace(/_/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};

const SwapDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const passed = location.state || {};

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!passed.id) {
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await getSlotDetails(passed.id);
                setDetail(toCamel(response.data));
            } catch (error) {
                console.error("Failed to fetch slot details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [passed.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white">
                <FiRefreshCw className="animate-spin text-[#2F6F6D] mb-4" size={40} />
                <p className="text-gray-500 font-medium tracking-tight">Loading details...</p>
            </div>
        );
    }

    // Fallback if no data is found
    const data = detail || passed;

    return (
        <div className="min-h-screen">
            {/* Page Title with Back Button */}
            <div className="flex items-center gap-4 mb-5">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition-colors w-10 h-10 rounded-full text-gray-700 shrink-0"
                    aria-label="Back"
                >
                    <FiArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-semibold">Swap Detail</h1>
                    <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">Find places to promote your book</p>
                </div>
            </div>

            {/* ── Profile Card ── */}
            <div className="bg-white border border-[#B5B5B5] rounded-xl p-4 mb-7">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3.5 mb-2">
                    <img
                        src={data.author?.profilePicture || data.photo || `https://ui-avatars.com/api/?name=${data.author?.name || "A"}&background=random`}
                        alt={data.name}
                        className="w-14 h-14 rounded-full object-cover shrink-0"
                    />
                    <div>
                        <p className="text-base font-bold mb-0.5">{formatLabel((data.author?.name || data.name || "A").split(/[\s,]+/)[0])}</p>
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-black flex items-center gap-1">
                                <img src={SwapIcon} alt="" className="w-3 h-3 object-contain" /> {data.author?.swapsCompleted || 0} swaps completed
                            </p>
                        </div>
                    </div>
                </div>

                {/* Meta Row */}
                <div className="sd-meta-row flex items-start justify-between flex-wrap gap-5 border-t border-[#2F6F6D33] pt-4">
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-[#374151] mb-1">Date &amp; time</p>
                        <p className="text-[13px] font-medium text-black">{data.sendDate || "N/A"} at {data.sendTime || "N/A"}</p>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-[#374151] mb-1">Status</p>
                        <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-[#16A34A33] text-black w-fit">
                            {formatLabel(data.status)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-[#374151] mb-1">Visibility</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-[rgba(232,232,232,1)] text-black w-fit">
                            <PublicIcon size={12} /> {formatLabel(data.visibility)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-[#374151] mb-1">Audience Size</p>
                        <p className="text-[13px] font-medium text-black">
                            {new Intl.NumberFormat('en-US').format(Number(data.audienceSize || 0))} subscribers
                        </p>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-[#374151] mb-1">Genre</p>
                        <span className="text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-[#16A34A33] text-black w-fit">
                            {formatLabel(data.preferredGenre)}
                        </span>
                    </div>
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-[#374151] mb-1">Current Partners</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-normal px-2.5 py-0.5 rounded-full bg-[rgba(224,122,95,0.2)] text-black w-fit">
                            <PartnersIcon size={12} /> {data.currentPartnersCount || 0}/{data.maxPartners || 0} Partners
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Analytics ── */}
            <div className="bg-white border border-[rgba(181,181,181,1)] rounded-xl p-4 mb-7">
                <p className="text-xl font-medium text-black mb-4">Analytics</p>
                <div className="sd-analytics-grid grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[rgba(224,122,95,0.05)] rounded-xl py-5 px-3 text-center transition-all hover:bg-[rgba(224,122,95,0.08)]">
                        <p className="text-[22px] font-bold text-black mb-1">
                            {data.author?.avgOpenRate !== undefined ? `${data.author.avgOpenRate}%` : "0%"}
                        </p>
                        <p className="text-xs text-[#374151] font-medium">Avg Open Rate</p>
                    </div>
                    <div className="bg-[rgba(224,122,95,0.05)] rounded-xl py-5 px-3 text-center transition-all hover:bg-[rgba(224,122,95,0.08)]">
                        <p className="text-[22px] font-bold text-black mb-1">
                            {data.author?.avgClickRate !== undefined ? `${data.author.avgClickRate}%` : "0%"}
                        </p>
                        <p className="text-xs text-[#374151] font-medium">Avg Click Rate</p>
                    </div>
                    <div className="bg-[rgba(224,122,95,0.05)] rounded-xl py-5 px-3 text-center transition-all hover:bg-[rgba(224,122,95,0.08)]">
                        <p className="text-[22px] font-bold text-black mb-1">
                            {data.author?.monthlyGrowth !== undefined ? (data.author.monthlyGrowth >= 0 ? `+${data.author.monthlyGrowth}` : data.author.monthlyGrowth) : "0"}
                        </p>
                        <p className="text-xs text-[#374151] font-medium">Monthly Growth</p>
                    </div>
                    <div className="bg-[rgba(224,122,95,0.05)] rounded-xl py-5 px-3 text-center transition-all hover:bg-[rgba(224,122,95,0.08)]">
                        <p className="text-[22px] font-bold text-black mb-1">
                            {data.author?.sendReliabilityPercent !== undefined ? `${data.author.sendReliabilityPercent}%` : "0%"}
                        </p>
                        <p className="text-xs text-[#374151] font-medium">Send Reliability</p>
                    </div>
                </div>
            </div>

            {/* ── Reputation Score Breakdown ── */}
            <p className="text-lg font-medium text-black pb-3 mb-3.5 border-b border-gray-200">
                Reputation Score Breakdown
            </p>
            <div className="flex flex-col gap-4 mb-4">
                {[
                    {
                        title: "Confirmed Sends",
                        score: `${data.author?.confirmedSendsScore || 0}/50`,
                        percent: (data.author?.confirmedSendsScore || 0) * 2,
                        subtext: `${(data.author?.confirmedSendsScore || 0) * 2}% success rate`,
                        points: `+${data.author?.confirmedSendsScore || 0} points`,
                        icon: <ConfirmedSendsIcon size={32} />,
                        color: "#16A34A"
                    },
                    {
                        title: "Timeliness",
                        score: `${data.author?.timelinessScore || 0}/30`,
                        percent: ((data.author?.timelinessScore || 0) / 30) * 100,
                        subtext: `${Math.round(((data.author?.timelinessScore || 0) / 30) * 100)}% timeliness rate`,
                        points: `+${data.author?.timelinessScore || 0} points`,
                        icon: <TimelinessIcon size={32} />,
                        color: "#F59E0B"
                    },
                    {
                        title: "Missed Sends",
                        score: `${data.author?.missedSendsPenalty || 0}/30`,
                        percent: ((data.author?.missedSendsPenalty || 0) / 30) * 100,
                        subtext: `${data.author?.missedSendsPenalty || 0} penalty points`,
                        points: `-${data.author?.missedSendsPenalty || 0} points`,
                        icon: <MissedSendsIcon size={32} />,
                        color: "#DC2626"
                    },
                    {
                        title: "Communication",
                        score: `${data.author?.communicationScore || 0}/30`,
                        percent: ((data.author?.communicationScore || 0) / 30) * 100,
                        subtext: "Engagement score",
                        points: `+${data.author?.communicationScore || 0} points`,
                        icon: <CommunicationIcon size={32} />,
                        color: "#2F6F6D"
                    }
                ].map((item, idx) => (
                    <div key={idx} className="bg-white border border-[#B5B5B5] rounded-xl p-5 shadow-sm hover:border-[#2F6F6D33] transition-all">
                        <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm font-semibold text-black">
                                {item.icon} {item.title}
                            </span>
                            <span className="text-[13px] font-bold text-black">{item.score}</span>
                        </div>
                        <ProgressBar percent={item.percent} color={item.color} />
                        <div className="flex justify-between text-[11px] text-black font-semibold">
                            <span className="text-gray-500">{item.subtext}</span>
                            <span>{item.points}</span>
                        </div>
                    </div>
                ))}
            </div>
            {/* ... Other reputation sections can be mapped similarly or left as refined mock if data is missing ... */}

            {/* ── Reliability ── */}
            <div className="bg-white border border-[rgba(181,181,181,1)] rounded-xl p-4 mb-7">
                <p className="text-xl font-medium text-black mb-0.5">Reliability</p>
                <p className="text-xs text-black mb-2.5">Reliability Score</p>
                <ProgressBar percent={data.author?.sendReliabilityPercent || 0} color="#22c55e" />
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[13px] font-bold text-black">{data.author?.sendReliabilityPercent || 0}/100</span>
                    <span className="text-xs font-bold text-black">
                        {data.author?.sendReliabilityPercent >= 80 ? "Excellent" : data.author?.sendReliabilityPercent >= 50 ? "Good" : "Needs Improvement"}
                    </span>
                </div>

                {/* ── Recent Swap History ── */}
                <p className="text-base font-bold text-black mt-5 mb-3">Recent Swap History</p>
                {data.recentHistory && data.recentHistory.length > 0 ? (
                    <div className="sd-history-grid grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {data.recentHistory.map((h, i) => (
                            <div key={i} className="border border-gray-200 rounded-xl p-3.5 flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-black">{h.name}</span>
                                    <StatusChip status={h.status} />
                                    {h.stars > 0 && <Stars count={h.stars} />}
                                </div>
                                <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                                    <CalendarIcon size={18} /> {h.date}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-6 border border-dashed border-gray-200 rounded-xl">
                        <p className="text-sm text-gray-500 italic">No recent swap history found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwapDetails;
