"use client";

import React from "react";
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
import { useState, useEffect } from "react";
import { getSubscriberAnalytics } from "../../../apis/subscription";
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


/* -------------------- DATA -------------------- */

const subscriberGrowth = [
    { month: "Jan", value: 22 },
    { month: "Feb", value: 25 },
    { month: "Mar", value: 18 },
    { month: "Apr", value: 35 },
    { month: "May", value: 28 },
    { month: "Jun", value: 12 },
    { month: "Jul", value: 55 },
    { month: "Aug", value: 48 },
    { month: "Sep", value: 75 },
    { month: "Oct", value: 98 },
    { month: "Nov", value: 100 },
    { month: "Dec", value: 102 },
];

const historicalTrend = [
    { month: "Jan", value: 10 },
    { month: "Feb", value: 12 },
    { month: "Mar", value: 18 },
    { month: "Apr", value: 30 },
    { month: "May", value: 38 },
    { month: "Jun", value: 15 },
    { month: "Jul", value: 22 },
    { month: "Aug", value: 28 },
    { month: "Sep", value: 45 },
    { month: "Oct", value: 60 },
    { month: "Nov", value: 72 },
    { month: "Dec", value: 85 },
];


const tabs = ["Recent", "Top Performing", "Swap Campaigns"];
const tabsGraph = ["Open Rate", "Click Rate", "Subscriber Growth"];
/* -------------------- COMPONENT -------------------- */

const AnalyticsPage = () => {

    const AvgOpenRate = () => {
        return (
            <img src={openRate} alt="Average Open Rate" className="w-5 h-5 object-contain" />
        );
    };

    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Recent");
    const [activeGraphTab, setActiveGraphTab] = useState("Open Rate");
    const [isMounted, setIsMounted] = useState(false);

    const fetchData = async () => {
        try {
            setLoading(true);
            const analyticsRes = await getSubscriberAnalytics();
            setAnalytics(analyticsRes.data);
        } catch (error) {
            console.error("Failed to fetch analytics data", error);
            // toast.error("Failed to load subscriber analytics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        setIsMounted(true);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#2F6F6D] animate-spin" />
            </div>
        );
    }

    const summaryStats = analytics?.summary_stats || {};
    const listHealth = analytics?.list_health_metrics || {};

    // We keep a dummy verificationData for UI structure or remove connection logic
    const verificationData = {
        is_connected: true, // Assuming connected if we are viewing analytics
        platform: "MailerLite",
        last_synced: "Recently",
        status: "Verified"
    };

    const campaigns = analytics?.campaign_analytics || [];
    const linkAnalysis = analytics?.link_level_ctr || [];
    const subGrowth = Array.isArray(analytics?.growth_chart) && analytics.growth_chart.length > 0
        ? analytics.growth_chart
        : defaultEmptyData;
    const histTrend = Array.isArray(analytics?.historical_trends) && analytics.historical_trends.length > 0
        ? analytics.historical_trends
        : subGrowth;

    const filteredCampaigns = campaigns.filter(camp => {
        if (!camp) return false;
        const openRateVal = camp.open_rate ? parseFloat(camp.open_rate) : 0;
        if (activeTab === "Recent") return true;
        if (activeTab === "Top Performing") return openRateVal > 40;
        if (activeTab === "Swap Campaigns") return camp.type === "Swap" || (camp.name && camp.name.toLowerCase().includes("swap"));
        return true;
    });

    const campaignDates = [...new Set(campaigns.map(c => c.date).filter(Boolean))];

    return (
        <div className="min-h-screen">
            <div className="mx-auto space-y-8 pb-10">

                <div className="mb-6">
                  
                    <div className="flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Subscriber Analytics
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Track your newsletter growth, engagement, and campaign performance
                            </p>
                        </div>
                    </div>
                </div>

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
                        <button onClick={fetchData} className="flex items-center gap-2 bg-[#2F6F6D] text-white text-sm px-4 py-2 rounded-md transition-all hover:bg-opacity-90 active:scale-95">
                            <LuRefreshCw className="w-4 h-4" />
                            Refresh Analytics
                        </button>
                    </div>

                    {/* ================= KPI CARDS ================= */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b pb-8 border-[#B5B5B5]">
                        {[
                            { label: "Active", value: summaryStats.active_subscribers || "0", sub: "+0% this month", border: "border-emerald-400", icon: <UsersRound className="w-5 h-5" /> },
                            { label: "Avg Open Rate", value: summaryStats.avg_open_rate || "0%", sub: "+0% this month", border: "border-amber-400", icon: <AvgOpenRate /> },
                            { label: "Avg Click Rate", value: summaryStats.avg_click_rate || "0%", sub: "+0% this month", border: "border-red-400", icon: <RxCursorArrow className="w-5 h-5" /> },
                            { label: "List Health Score", value: summaryStats.list_health_score || "0/100", sub: "0% growth", border: "border-gray-300", icon: <HeartPulse className="w-5 h-5" /> },
                        ].map((item, i) => (
                            <div key={i} className={`bg-white border ${item.border} rounded-xl p-5`}>
                                <div className="flex items-center gap-2">
                                    {item.icon}
                                    <p className="text-xs text-gray-500">{item.label}</p>
                                </div>
                                <h2 className="text-2xl font-semibold text-gray-900 mt-2">
                                    {item.value}
                                </h2>
                                <p className="text-xs text-emerald-600 mt-2">{item.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* ================= GROWTH CHART ================= */}
                    <div className="bg-white rounded-xl">
                        <h3 className="text-lg font-semibold mb-4">Subscriber Growth</h3>
                        <div className="h-[320px]">
                            {isMounted ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={subGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#059669"
                                            strokeWidth={3}
                                            dot={{ r: 4, fill: '#059669', strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="w-full h-full bg-gray-50 animate-pulse rounded-lg" />
                            )}
                        </div>
                    </div>

                    {/* ================= LIST HEALTH ================= */}
                    <div>
                        <p className="text-xl font-semibold text-[#111827] mb-4">
                            List Health Metrics
                        </p>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 border-b pb-8 border-[#B5B5B5]">
                            {[
                                { label: "Bounce Rate", value: listHealth.bounce_rate || "0%" },
                                { label: "Unsubscribe Rate", value: listHealth.unsubscribe_rate || "0%" },
                                { label: "Active Rate", value: listHealth.active_rate || "0%" },
                                { label: "Avg Engagement", value: listHealth.avg_engagement || "0" },
                            ].map((item, i) => (
                                <div key={i} className="bg-[#E07A5F0D] rounded-xl p-6 text-center">
                                    <h3 className="text-xl font-semibold text-gray-900">
                                        {item.value}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                                </div>
                            ))}
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
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 py-2 text-sm rounded-md transition-all duration-200 cursor-pointer
                                            ${activeTab === tab
                                                ? "bg-[#2F6F6D] text-white shadow-sm"
                                                : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredCampaigns.length > 0 ? (
                                filteredCampaigns.map((camp, idx) => (
                                    <div key={idx} className={`flex justify-between px-6 py-5 ${idx === 0 ? "bg-[#FEF3F2]" : "bg-white"} border border-[#B5B5B5] rounded-lg`}>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                {camp.name}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {camp.date} • Sent to {camp.sent_to}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold">{camp.open_rate}</p>
                                            <p className="text-xs text-gray-500">Open Rate</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                                    No campaigns found for this category.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ================= LINK LEVEL ================= */}
                    <div className="bg-white rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-semibold text-gray-900">
                                Link-Level CTR Analysis
                            </p>

                            <select className="border border-gray-300 rounded-md text-xs px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#2F6F6D]">
                                <option value="">All Campaign Dates</option>
                                {campaignDates.map(date => (
                                    <option key={date} value={date}>{date}</option>
                                ))}
                            </select>
                        </div>

                        <div className="overflow-x-auto border border-[#B5B5B5] rounded-lg">
                            <div className="min-w-[600px]">
                                <div className="grid grid-cols-4 bg-gray-50 text-xs font-medium text-gray-600 px-6 py-3 border-b border-[#B5B5B5]">
                                    <div>Link / Destination</div>
                                    <div className="text-center">Clicks</div>
                                    <div className="text-center">CTR</div>
                                    <div className="text-right">Conversion</div>
                                </div>

                                {linkAnalysis.map((link, idx) => (
                                    <div key={idx} className="grid grid-cols-4 items-center px-6 py-4 border-t first:border-t-0 text-xs border-[#B5B5B5]">
                                        <div>
                                            <p className="text-gray-900 font-medium">{link.destination}</p>
                                            <p className="text-gray-400 text-[11px] mt-1 truncate">{link.url}</p>
                                        </div>
                                        <div className="text-center text-gray-700">{link.clicks}</div>
                                        <div className="text-center">
                                            <p className="text-gray-900">{link.ctr}</p>
                                            <p className="text-emerald-600 text-[11px]">Excellent</p>
                                        </div>
                                        <div className="text-right text-gray-700">{link.conversion}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* ================= HISTORICAL ================= */}
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
                                    <AreaChart data={histTrend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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