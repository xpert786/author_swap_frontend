"use client";

import React, { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { MdMailOutline } from "react-icons/md";
import { LuRefreshCw } from "react-icons/lu";
import { ShieldMinus, Check, UsersRound, HeartPulse } from "lucide-react";
import openRate from "../../../assets/avgOpenRate.png";
import { RxCursorArrow } from "react-icons/rx";
import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getSubscriberAnalytics, getCampaignDates, getCampaignAnalytics, getLinkLevelAnalytics } from "../../../apis/subscription";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

const defaultEmptyData = [
    { month: "Jan", value: 0 },
    { month: "Feb", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Apr", value: 0 },
    { month: "May", value: 0 },
    { month: "Jun", value: 0 },
    { month: "Jul", value: 0 },
    { month: "Aug", value: 0 },
    { month: "Sep", value: 0 },
    { month: "Oct", value: 0 },
    { month: "Nov", value: 0 },
    { month: "Dec", value: 0 },
];

const tabs = ["Recent", "Top Performing", "Swap Campaigns"];
const tabsGraph = ["Open Rate", "Click Rate", "Subscriber Growth"];

/* -------------------- COMPONENT -------------------- */

const AnalyticsPage = ({ isChildView = false }) => {
    const AvgOpenRate = () => {
        return (
            <img src={openRate} alt="Average Open Rate" className="w-5 h-5 object-contain" />
        );
    };

    const getStatValue = (val, fallback = "") => {
        if (!val) return fallback;
        if (typeof val === 'object' && val !== null) return val.value ?? fallback;
        return val ?? fallback;
    };


    const formatRate = (value) => {
        if (value === null || value === undefined) return "—";
        return `${value}%`;
    };

    const navigate = useNavigate();
    const [pageTab, setPageTab] = useState("analytics");
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeCampaignTab, setActiveCampaignTab] = useState("Recent");
    const [activeGraphTab, setActiveGraphTab] = useState("Open Rate");
    const [isMounted, setIsMounted] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [apiCampaignDates, setApiCampaignDates] = useState([]);
    const [selectedCampaignId, setSelectedCampaignId] = useState(null);
    const [campaignDatesLoading, setCampaignDatesLoading] = useState(false);
    const [campaignLoading, setCampaignLoading] = useState(false);
    const [campaignData, setCampaignData] = useState([]);
    const [ctrPage, setCtrPage] = useState(1);
    const [ctrPagination, setCtrPagination] = useState({
        total_pages: 1,
        has_next: false,
        has_prev: false,
        total_campaigns: 0
    });
    const [campPage, setCampPage] = useState(1);
    const [campPagination, setCampPagination] = useState({
        total_pages: 1,
        has_next: false,
        has_prev: false,
        total_results: 0
    });
    const [linkLevelData, setLinkLevelData] = useState({ results: [], pagination: {} });

    // FIX 1: Use a ref for click-outside detection instead of a class-based approach
    const dropdownRef = useRef(null);

    const fetchCampaignDates = async () => {
        try {
            setCampaignDatesLoading(true);
            const response = await getCampaignDates();

            // Handle all common response shapes:
            // 1. Raw fetch Response  → response.json()
            // 2. Axios style         → response.data
            // 3. Already plain obj   → response itself
            let data;
            if (response && typeof response.json === "function") {
                data = await response.json();
            } else if (response && response.data !== undefined) {
                data = response.data;
            } else {
                data = response;
            }

            setApiCampaignDates(data?.campaign_dates || []);
        } catch (error) {
            console.error("Failed to fetch campaign dates:", error);
            setApiCampaignDates([]);
        } finally {
            setCampaignDatesLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            const analyticsRes = await getSubscriberAnalytics();
            const data = analyticsRes.data;
            setAnalytics(data);
        } catch (error) {
            console.error("Failed to fetch analytics data", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCampaignData = async (cmpPage = campPage) => {
        try {
            setCampaignLoading(true);
            const params = { 
                page: cmpPage,
                tab: activeCampaignTab.toLowerCase().replace(" ", "_")
            };
            const res = await getCampaignAnalytics(params);
            const data = res.data;
            
            setCampaignData(data?.results || []);
            if (data?.pagination) {
                setCampPagination(data.pagination);
            }
        } catch (error) {
            console.error("Failed to fetch campaign data", error);
        } finally {
            setCampaignLoading(false);
        }
    };

    const fetchLinkLevelData = async (page = 1) => {
        try {
            const res = await getLinkLevelAnalytics({ page });
            const data = res.data || res;
            setLinkLevelData({
                results: data?.results || [],
                pagination: data?.pagination || {}
            });
        } catch (error) {
            console.error("Failed to fetch link-level analytics:", error);
            setLinkLevelData({ results: [], pagination: {} });
        }
    };

    // Global data fetch - initial load only, no pagination dependency
    useEffect(() => {
        fetchData();
    }, []);

    // Independent campaign data fetch
    useEffect(() => {
        fetchCampaignData(campPage);
    }, [campPage, activeCampaignTab]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        fetchLinkLevelData(ctrPage);
    }, [ctrPage]);

    // FIX 2: Stable click-outside handler using ref — no isDropdownOpen in deps
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleTabChange = (tab) => {
        if (tab === "subscription") {
            navigate("/subscription");
        }
    };

    const summaryStats = analytics?.summary_stats || {};
    const listHealth = analytics?.list_health_metrics || {};

    const campaigns = analytics?.campaign_analytics?.results || [];

    // FIX 3: linkAnalysis correctly returns flat link objects (with campaignName attached)
    const linkAnalysis = useMemo(() => {
        const allLinks = Array.isArray(linkLevelData?.results)
            ? linkLevelData.results
            : [];

        const filtered = selectedCampaignId
            ? allLinks.filter(campaign => campaign.campaign_id === selectedCampaignId)
            : allLinks;

        return filtered.reduce((acc, campaign) => {
            if (!campaign || !Array.isArray(campaign.links)) return acc;
            const links = campaign.links.map(link => ({
                ...link,
                campaignName: campaign.campaign_name,
            }));
            return [...acc, ...links];
        }, []);
    }, [linkLevelData?.results, selectedCampaignId]);

    const subGrowth = Array.isArray(analytics?.growth_chart) && analytics.growth_chart.length > 0
        ? analytics.growth_chart
        : defaultEmptyData;
    const histTrend = Array.isArray(analytics?.historical_trends) && analytics.historical_trends.length > 0
        ? analytics.historical_trends
        : subGrowth;

    const ALL_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const normalizedSubGrowth = useMemo(() => {
        const lookup = {};
        subGrowth.forEach(item => {
            const key = item.month || item.label || "";
            const val = item.count ?? getStatValue(item.value, 0);
            if (key) lookup[key] = Number(val) || 0;
        });
        return ALL_MONTHS.map(month => ({
            month,
            subscribers: lookup[month] ?? 0,
        }));
    }, [subGrowth]);

    const normalizedHistTrend = useMemo(() => {
        return histTrend.map(item => {
            let value = 0;
            if (activeGraphTab === "Open Rate") {
                value = parseFloat(item.open_rate) || 0;
            } else if (activeGraphTab === "Click Rate") {
                value = parseFloat(item.click_rate) || 0;
            } else if (activeGraphTab === "Subscriber Growth") {
                value = item.subscriber_growth || 0;
            }
            return { ...item, value };
        });
    }, [histTrend, activeGraphTab]);

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter(camp => {
            if (!camp) return false;
            const openRateRaw = getStatValue(camp.open_rate);
            const openRateVal = openRateRaw ? parseFloat(openRateRaw) : 0;
            if (activeCampaignTab === "Recent") return true;
            if (activeCampaignTab === "Top Performing") return openRateVal > 40;
            if (activeCampaignTab === "Swap Campaigns") return camp.type === "Swap" || (camp.name && camp.name.toLowerCase().includes("swap"));
            return true;
        });
    }, [campaigns, activeCampaignTab]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#2F6F6D] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto space-y-8 pb-10">

                {!isChildView && (
                    <>
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Subscriber Analytics
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Track your newsletter growth, engagement, and campaign performance
                            </p>
                        </div>

                        <div className="flex gap-2 mb-6 bg-white border border-[#2F6F6D] p-1 rounded-lg w-fit">
                            <button
                                onClick={() => handleTabChange("subscription")}
                                className="px-4 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
                            >
                                Subscription
                            </button>
                            <button
                                onClick={() => setPageTab("analytics")}
                                className="px-4 py-2 text-sm rounded-md bg-[#2F6F6D] text-white cursor-pointer"
                            >
                                Analytics
                            </button>
                        </div>
                    </>
                )}

                <div className="border border-[#B5B5B5] p-5 rounded-xl space-y-8">

                    {/* ================= MESSAGE CARD ================= */}
                    <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-md bg-[#2F6F6D33] flex items-center justify-center">
                                <MdMailOutline className="text-xl" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Analytics Status</p>
                                <div className="flex items-center gap-1">
                                    <span className="flex items-center justify-center w-4 h-4 bg-[#16A34A] rounded-full">
                                        <Check className="w-3 h-3 text-white" />
                                    </span>
                                    <p className="text-xs text-emerald-600">Successfully synced with MailerLite</p>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={fetchData}
                            className="flex items-center gap-2 bg-[#2F6F6D] text-white text-sm px-4 py-2 rounded-md transition-all hover:bg-opacity-90 active:scale-95"
                        >
                            <LuRefreshCw className="w-4 h-4" />
                            Refresh Analytics
                        </button>
                    </div>

                    {/* ================= KPI CARDS ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b pb-8 border-[#B5B5B5]">
                        {[
                            { label: "Active", data: summaryStats.active_subscribers?.active, fallbackValue: "0", fallbackSub: "+0% this month", border: "border-emerald-400", icon: <UsersRound className="w-5 h-5" /> },
                            { label: "Avg Open Rate", data: summaryStats.avg_open_rate, fallbackValue: "0%", fallbackSub: "+0% this month", border: "border-amber-400", icon: <AvgOpenRate /> },
                            { label: "Avg Click Rate", data: summaryStats.avg_click_rate, fallbackValue: "0%", fallbackSub: "+0% this month", border: "border-red-400", icon: <RxCursorArrow className="w-5 h-5" /> },
                            { label: "List Health Score", data: summaryStats.list_health_score, fallbackValue: "0/100", fallbackSub: "0% growth", border: "border-gray-300", icon: <HeartPulse className="w-5 h-5" /> },
                        ].map((item, i) => {
                            const isObj = item.data && typeof item.data === 'object';
                            const displayValue = getStatValue(item.data, item.fallbackValue);
                            const displaySub = isObj ? (item.data.delta_text || item.fallbackSub) : item.fallbackSub;
                            const isPositive = isObj ? item.data.is_positive !== false : true;

                            return (
                                <div key={i} className={`bg-white border ${item.border} rounded-xl p-5`}>
                                    <div className="flex items-center gap-2">
                                        {item.icon}
                                        <p className="text-xs text-gray-500">{item.label}</p>
                                    </div>
                                    <h2 className="text-2xl font-semibold text-gray-900 mt-2">
                                        {displayValue}
                                    </h2>
                                    <p className={`text-xs mt-2 ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {displaySub}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* ================= GROWTH CHART ================= */}
                    <div className="bg-white rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Subscriber Growth</h3>
                        <div className="h-[320px]">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={normalizedSubGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 11, fill: '#6B7280' }}
                                            axisLine={false}
                                            tickLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 11, fill: '#6B7280' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip
                                            content={({ active, payload, label }) => {
                                                if (active && payload && payload.length) {
                                                    return (
                                                        <div style={{
                                                            background: '#2F6F6D',
                                                            borderRadius: '6px',
                                                            padding: '8px 14px',
                                                            color: '#fff',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            letterSpacing: '0.05em',
                                                            textTransform: 'uppercase',
                                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                                        }}>
                                                            <p style={{ marginBottom: '2px', opacity: 0.85 }}>{label}</p>
                                                            <p>SUBSCRIBERS : {payload[0].value?.toLocaleString()}</p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                            cursor={{ stroke: '#2F6F6D', strokeWidth: 1, strokeDasharray: '4 2' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="subscribers"
                                            stroke="#2F6F6D"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 4, fill: '#2F6F6D', stroke: '#fff', strokeWidth: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full bg-gray-50 animate-pulse rounded-lg" />
                            )}
                        </div>
                    </div>

                    {/* ================= LIST HEALTH METRICS ================= */}
                    <div className="bg-white rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">List Health Metrics</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: "Bounce Rate", data: listHealth.bounce_rate, fallback: "0%" },
                                { label: "Unsubscribe Rate", data: listHealth.unsubscribe_rate, fallback: "0%" },
                                { label: "Spam Complaints", data: listHealth.spam_complaints, fallback: "0" },
                                { label: "Avg Engagement", data: listHealth.avg_engagement, fallback: "0" },
                            ].map((item, i) => {
                                const displayValue = getStatValue(item.data, item.fallback);
                                return (
                                    <div key={i} className="bg-[#E07A5F0D] rounded-xl p-6 text-center">
                                        <h3 className="text-xl font-semibold text-gray-900">
                                            {displayValue}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* ================= CAMPAIGN ANALYTICS ================= */}
                    <div className="bg-white">
                        <div className="flex items-center justify-between py-4">
                            <p className="text-xl font-semibold text-[#111827]">
                                Campaign Analytics
                            </p>
                            <div className="flex gap-2 bg-white border border-[#B5B5B5] p-1 rounded-lg w-fit">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => {
                                            setActiveCampaignTab(tab);
                                            setCampPage(1); // Reset to first page on tab change
                                        }}
                                        className={`px-4 py-2 text-sm rounded-md transition-all duration-200 cursor-pointer
                                            ${activeCampaignTab === tab
                                                ? "bg-[#2F6F6D] text-white shadow-sm"
                                                : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 relative min-h-[200px]">
                            {campaignLoading && (
                                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-lg">
                                    <Loader2 className="w-6 h-6 text-[#2F6F6D] animate-spin" />
                                </div>
                            )}

                            {campaignData.length > 0 ? (
                                campaignData.map((camp, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex items-center justify-between px-6 py-5 ${idx === 0 ? "bg-[#FEF3F2]" : "bg-white"
                                            } border border-[#B5B5B5] rounded-lg`}
                                    >
                                        {/* Left Content */}
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {camp.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {getStatValue(camp.status, "active")} • Sent to{" "}
                                                {getStatValue(camp.sent_to, "—")}
                                            </p>
                                        </div>

                                        {/* Metrics */}
                                        <div className="flex items-center justify-center gap-10">
                                            {/* Open Rate */}
                                            <div className="text-center min-w-[80px]">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatRate(camp.open_rate)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Open Rate
                                                </p>
                                            </div>

                                            {/* Click Rate */}
                                            <div className="text-center min-w-[80px]">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatRate(camp.click_rate)}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Click Rate
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                                    No campaigns found for this category.
                                </div>
                            )}
                        </div>

                        {/* Campaign Pagination Controls */}
                        {campPagination.total_pages > 1 && (
                            <div className="flex items-center justify-between mt-6 px-2">
                                <p className="text-xs text-gray-500">
                                    Showing page <span className="font-medium text-gray-900">{campPage}</span> of <span className="font-medium text-gray-900">{campPagination.total_pages}</span>
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCampPage(prev => Math.max(1, prev - 1))}
                                        disabled={campPage <= 1}
                                        className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                                    >
                                        <IoChevronBack className="w-3 h-3" />
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCampPage(prev => Math.min(campPagination.total_pages, prev + 1))}
                                        disabled={campPage >= campPagination.total_pages}
                                        className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                                    >
                                        Next
                                        <IoChevronBack className="w-3 h-3 rotate-180" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ================= LINK LEVEL ================= */}
                    <div className="bg-white rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-semibold text-gray-900">
                                Link-Level CTR Analysis
                            </p>
                            {/* FIX 4: Clean dropdown — no duplicate header inside, uses ref for outside click */}
                            <div className="relative" ref={dropdownRef}>
                                {/* Trigger button */}
                                <button
                                    onClick={() => {
                                        if (!isDropdownOpen) fetchCampaignDates();
                                        setIsDropdownOpen(prev => !prev);
                                    }}
                                    className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 cursor-pointer flex items-center justify-between w-[260px] bg-white hover:border-gray-400 transition-colors"
                                >
                                    <span className={selectedCampaign ? "text-gray-900" : "text-gray-400"}>
                                        {selectedCampaign ?? "Select Campaign"}
                                    </span>
                                    <svg
                                        className={`w-4 h-4 ml-2 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Dropdown panel — no redundant header inside */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-[300px] bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                                        {/* Optional: clear selection */}
                                        {selectedCampaign && (
                                            <div
                                                onClick={() => {
                                                    setSelectedCampaign(null);
                                                    setSelectedCampaignId(null);
                                                    setIsDropdownOpen(false);
                                                }}
                                                className="px-4 py-2.5 text-xs text-gray-400 hover:bg-gray-50 cursor-pointer border-b border-gray-100 flex items-center gap-1"
                                            >
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Clear selection
                                            </div>
                                        )}

                                        {/* Campaign list */}
                                        <div className="max-h-60 overflow-y-auto py-1">
                                            {campaignDatesLoading ? (
                                                <div className="px-4 py-3 text-sm text-gray-400 text-center flex items-center justify-center gap-2">
                                                    <svg className="animate-spin w-4 h-4 text-[#2F6F6D]" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                    </svg>
                                                    Loading…
                                                </div>
                                            ) : apiCampaignDates.length === 0 ? (
                                                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                                    No campaigns found.
                                                </div>
                                            ) : (
                                                apiCampaignDates.map((campaign, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => {
                                                            setSelectedCampaign(campaign.label);
                                                            setSelectedCampaignId(campaign.campaign_id);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors
                                                            ${selectedCampaignId === campaign.campaign_id
                                                                ? "bg-[#2F6F6D10] text-[#2F6F6D] font-medium"
                                                                : "text-gray-700 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        <div>
                                                            <p className="leading-snug">{campaign.label}</p>
                                                            <p className="text-xs text-gray-400 mt-0.5">{campaign.type} · {campaign.date}</p>
                                                        </div>
                                                        {selectedCampaignId === campaign.campaign_id && (
                                                            <svg className="w-4 h-4 text-[#2F6F6D] shrink-0 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="overflow-x-auto border border-[#B5B5B5] rounded-lg">
                            <div className="min-w-[600px]">
                                <div className="grid grid-cols-4 bg-gray-50 text-xs font-medium text-gray-600 px-6 py-3 border-b border-[#B5B5B5]">
                                    <div>Link / Destination</div>
                                    <div className="text-center">Clicks</div>
                                    <div className="text-center">CTR</div>
                                    <div className="text-right">Conversion</div>
                                </div>

                                {/* FIX 5: linkAnalysis is already flat — no second .reduce() needed */}
                                {linkAnalysis.length > 0 ? (
                                    linkAnalysis.map((link, idx) => (
                                        <div key={idx} className="grid grid-cols-4 items-center px-6 py-4 border-t first:border-t-0 text-xs border-[#B5B5B5]">
                                            <div>
                                                <p className="text-gray-900 font-medium">{link.name}</p>
                                                <p className="text-gray-400 text-[11px] mt-1 truncate">{link.url}</p>
                                            </div>
                                            <div className="text-center text-gray-700">
                                                {link.clicks ?? 0}
                                            </div>
                                            <div className="text-center">
                                                <p className="text-gray-900">{link.ctr}</p>
                                                <p className={`text-[11px] ${parseFloat(link.ctr) > 0 ? 'text-emerald-600' : 'text-amber-500'}`}>
                                                    {link.ctr_label || (parseFloat(link.ctr) > 0 ? 'Excellent' : 'Improving')}
                                                </p>
                                            </div>
                                            <div className="text-right text-gray-700">
                                                {link.conversion}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8 text-sm text-gray-400">
                                        {selectedCampaignId ? "No links found for this campaign." : "Select a campaign to view link-level data."}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        {(linkLevelData.pagination?.total_pages > 1 || ctrPagination.total_pages > 1) && (
                            <div className="flex items-center justify-between mt-4 px-2">
                                <p className="text-xs text-gray-500">
                                    Showing page <span className="font-medium text-gray-900">{ctrPage}</span> of <span className="font-medium text-gray-900">{linkLevelData.pagination?.total_pages || ctrPagination.total_pages}</span>
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCtrPage(prev => Math.max(1, prev - 1))}
                                        disabled={ctrPage <= 1}
                                        className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                                    >
                                        <IoChevronBack className="w-3 h-3" />
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCtrPage(prev => Math.min(linkLevelData.pagination?.total_pages || ctrPagination.total_pages, prev + 1))}
                                        disabled={ctrPage >= (linkLevelData.pagination?.total_pages || ctrPagination.total_pages)}
                                        className="px-3 py-1.5 text-xs font-medium border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors flex items-center gap-1"
                                    >
                                        Next
                                        <IoChevronBack className="w-3 h-3 rotate-180" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ================= HISTORICAL TRENDS ================= */}
                    <div className="bg-white rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-semibold">Historical Trends</p>
                            <div className="flex gap-2 bg-white border border-[#B5B5B5] p-1 rounded-lg w-fit">
                                {tabsGraph.map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveGraphTab(tab)}
                                        className={`px-4 py-2 text-sm rounded-md transition-all duration-200 cursor-pointer
                                            ${activeGraphTab === tab
                                                ? "bg-[#2F6F6D] text-white shadow-sm"
                                                : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[300px]">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={normalizedHistTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                            axisLine={false}
                                            tickLine={false}
                                            dy={10}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#6B7280' }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#059669"
                                            fill="#BBF7D0"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full bg-gray-50 animate-pulse rounded-lg" />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;