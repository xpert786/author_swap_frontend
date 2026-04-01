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

const StatusIndicator = ({ status }) => {
    const s = status?.toLowerCase();
    if (s === "completed" || s === "pending" || s === "confirmed" || s === "accepted") {
        return (
            <div className="flex items-center gap-1 text-[#16A34A] font-medium text-[11px]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {status}
            </div>
        );
    }
    if (s === "missed" || s === "rejected") {
        return (
            <div className="flex items-center gap-1 text-[#DC2626] font-medium text-[11px]">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                {status}
            </div>
        );
    }
    return (
        <div className="flex items-center gap-1 text-gray-500 font-medium text-[11px]">
            {status}
        </div>
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

            {/* ── Author Profile Section ── */}
            {data.author && (
                <div className="bg-white border border-[#B5B5B5] rounded-xl p-5 mb-7">
                    {/* Profile Header with Picture */}
                    <div className="flex items-start gap-4 mb-5">
                        <div className="relative">
                            <img
                                src={data.author.profilePicture || `https://ui-avatars.com/api/?name=${data.author.name || "A"}&background=random&size=128`}
                                alt={data.author.name}
                                className="w-20 h-20 rounded-full object-cover border-2 border-[#2F6F6D33]"
                            />
                            {data.author.isWebhookVerified && (
                                <div className="absolute -bottom-1 -right-1 bg-[#16A34A] text-white p-1 rounded-full">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-black">{formatLabel(data.author.name)}</h3>
                            {data.author.penName && (
                                <p className="text-sm text-[#2F6F6D] font-medium">aka {data.author.penName}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-500">@{data.author.username}</span>
                                <span className="text-xs text-gray-400">•</span>
                                <span className="text-xs text-gray-500">{data.author.location || "Location not set"}</span>
                            </div>
                            <div className="flex items-center gap-3 mt-2">
                                <span className="inline-flex items-center gap-1 text-xs text-black bg-[#2F6F6D1A] px-2 py-1 rounded-full">
                                    <img src={SwapIcon} alt="" className="w-3 h-3 object-contain" />
                                    {data.author.swapsCompleted || 0} swaps
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs text-black bg-[#F59E0B1A] px-2 py-1 rounded-full">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    {data.author.rating || 0} rating
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs text-black bg-[#16A34A1A] px-2 py-1 rounded-full">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {data.author.reputationScore || 0} rep
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    {data.author.bio && (
                        <div className="bg-[#F9FBFA] rounded-lg p-4 mb-4 border-l-3 border-[#2F6F6D]">
                            <p className="text-[11px] text-[#374151] font-semibold mb-2 uppercase tracking-wide flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                About
                            </p>
                            <p className="text-sm text-black leading-relaxed">{data.author.bio}</p>
                        </div>
                    )}

                    {/* Genre */}
                    {data.author.primaryGenre && (
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[11px] text-[#374151] font-medium uppercase tracking-wide">Primary Genre:</span>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[#16A34A33] text-black">
                                {formatLabel(data.author.primaryGenre)}
                            </span>
                        </div>
                    )}

                    {/* Social Links */}
                    {(data.author.website || data.author.instagramUrl || data.author.tiktokUrl || data.author.facebookUrl) && (
                        <div className="border-t border-[#2F6F6D33] pt-4">
                            <p className="text-[11px] text-[#374151] font-semibold mb-3 uppercase tracking-wide flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                Connect
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {data.author.website && (
                                    <a
                                        href={data.author.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-[#2F6F6D] text-white rounded-lg text-xs font-medium hover:bg-[#245957] transition-colors shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                        </svg>
                                        Website
                                    </a>
                                )}
                                {data.author.instagramUrl && (
                                    <a
                                        href={data.author.instagramUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#F77737] text-white rounded-lg text-xs font-medium hover:opacity-90 transition-opacity shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                        Instagram
                                    </a>
                                )}
                                {data.author.tiktokUrl && (
                                    <a
                                        href={data.author.tiktokUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                                        </svg>
                                        TikTok
                                    </a>
                                )}
                                {data.author.facebookUrl && (
                                    <a
                                        href={data.author.facebookUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg text-xs font-medium hover:bg-[#166fe5] transition-colors shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                        Facebook
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

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
                <p className="text-base font-bold text-[#1F2937] mt-8 mb-4">Recent Swap History</p>
                {(data.swapPartners || data.swap_partners) && (data.swapPartners || data.swap_partners).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {(data.swapPartners || data.swap_partners).slice(0, 9).map((h, i) => {
                            const partnerName = h.author?.name || "Unknown Author";
                            const firstName = partnerName.split(/[\s,]+/)[0];
                            const formattedName = formatLabel(firstName);
                            const formattedDate = h.createdAt || h.created_at ? new Date(h.createdAt || h.created_at).toLocaleDateString('en-GB', {
                                day: 'numeric', month: 'short', year: 'numeric'
                            }) : "N/A";

                            return (
                                <div key={i} className="border border-[#B5B5B5] rounded-[10px] p-4 flex items-center justify-between bg-white gap-2 transition-shadow hover:shadow-sm">
                                    {/* Left: Name and Date */}
                                    <div className="flex flex-col gap-1 min-w-0 shrink">
                                        <span className="text-[14px] font-semibold text-[#2D2F33] truncate" title={formattedName}>
                                            {formattedName}
                                        </span>
                                        <span className="flex items-center gap-1 text-[10px] text-[#374151] font-medium whitespace-nowrap">
                                            <CalendarIcon size={12} /> {formattedDate}
                                        </span>
                                    </div>

                                    {/* Center: Status */}
                                    <div className="flex-1 flex justify-center min-w-0 px-2 overflow-hidden">
                                        <div className="scale-90 sm:scale-100 origin-center truncate">
                                            <StatusIndicator status={formatLabel(h.status)} />
                                        </div>
                                    </div>

                                    {/* Right: Rating */}
                                    <div className="shrink-0">
                                        <Stars count={Math.round(h.author?.rating || 0)} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                        <p className="text-sm text-gray-500 italic">No recent swap history found for this author.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SwapDetails;
