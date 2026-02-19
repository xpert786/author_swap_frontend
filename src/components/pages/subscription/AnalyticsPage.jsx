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
import { useState } from "react";


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

    const [activeTab, setActiveTab] = useState("Search");
    

    return (
        <div className="min-h-screen">
            <div className="mx-auto space-y-8">

                {/* ================= HEADER ================= */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Subscriber Verification & Analytics
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">
                            Request, manage, and track newsletter partnerships
                        </p>
                        <span className="inline-flex items-center gap-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                            Connected to MailerLite
                        </span>

                    </div>
                </div>

                {/* ================= MESSAGE CARD ================= */}
                <div className="bg-white border border-gray-200 rounded-xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-[#2F6F6D33] flex items-center justify-center">
                            <MdMailOutline className="text-xl" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-gray-900">Message</p>
                            <div className="flex items-center gap-1">
                                <span className="flex items-center justify-center w-4 h-4 bg-[#16A34A] rounded-full">
                                    <Check className="w-3 h-3 text-white" />
                                </span>
                                <p className="text-xs text-emerald-600 mt-1">Connected via OAuth</p>
                            </div>
                            <p className="text-xs text-[#374151] mt-1">Last synced: 04:39 PM Today</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-[#2F6F6D] text-white text-sm px-4 py-2 rounded-md">
                        <LuRefreshCw className="w-4 h-4" />
                        Refresh Data
                    </button>


                </div>


                <div className="border border-[#B5B5B5] p-5 rounded-xl">



                    {/* ================= SUBSCRIBER VERIFICATION ================= */}


                    <div className="bg-white border-b border-gray-200 rounded-xl mb-4 flex items-center gap-4 px-4 py-1">
                        <div className="flex items-center gap-2">
                            <ShieldMinus className="w-4 h-4 text-gray-700" />
                            <p className="text-sm font-medium text-gray-900">
                                Subscriber Verification
                            </p>
                        </div>

                        <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-[#16A34A33] text-[#16A34A] font-medium">
                            <span className="flex items-center justify-center w-4 h-4 bg-[#16A34A] rounded-full">
                                <Check className="w-3 h-3 text-white" />
                            </span>
                            Verified
                        </span>

                    </div>


                    {/* ================= KPI CARDS ================= */}
                    <div className="grid grid-cols-4 gap-6 border-b pb-4 border-[#B5B5B5]">
                        {[
                            { label: "Active", value: "12,457", sub: "+12% this month", border: "border-emerald-400", icon: <UsersRound className="w-5 h-5" /> },
                            { label: "Avg Open Rate", value: "42.3%", sub: "+4% this month", border: "border-amber-400", icon: <AvgOpenRate /> },
                            { label: "Avg Click Rate", value: "8.1%", sub: "+1% this month", border: "border-red-400", icon: <RxCursorArrow className="w-5 h-5" /> },
                            { label: "List Health Score", value: "87/100", sub: "2% loss", border: "border-gray-300", icon: <HeartPulse className="w-5 h-5" /> },
                        ].map((item, i) => (
                            <div
                                key={i}
                                className={`bg-white border ${item.border} rounded-xl p-5`}
                            >
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
                    <div className="bg-white rounded-xl p-6">
                        <div className="h-[320px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={subscriberGrowth}>
                                    <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#059669"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* ================= LIST HEALTH ================= */}
                    <div>
                        <p className="text-xl font-semibold text-[#111827] mb-4">
                            List Health Metrics
                        </p>
                        <div className="grid grid-cols-4 gap-6 border-b pb-4 border-[#B5B5B5]">
                            {[
                                { label: "Bounce Rate", value: "1.2%" },
                                { label: "Unsubscribe Rate", value: "0.4%" },
                                { label: "Active Rate", value: "94%" },
                                { label: "Avg Engagement", value: "4.8" },
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
                        <div className="flex items-center justify-between px-6 py-4">
                            <p className="text-xl font-semibold text-[#111827]">
                                Campaign Analytics
                            </p>
                            <div className="flex gap-2 mb-6 bg-white border border-[#B5B5B5] p-1 rounded-lg w-fit">
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
                            {/* Card 1 */}
                            <div className="flex justify-between px-6 py-5 bg-[#FEF3F2] border border-[#B5B5B5] rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        June Newsletter – Romance Special
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        June 1, 2025 • Sent to 12,000
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">42.1%</p>
                                    <p className="text-xs text-gray-500">Open Rate</p>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="flex justify-between px-6 py-5 border border-[#B5B5B5] rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        New Release: Coastal Hearts
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        June 17, 2025 • Sent to 10,200
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">42.1%</p>
                                    <p className="text-xs text-gray-500">Open Rate</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ================= LINK LEVEL ================= */}
                    <div className="bg-white rounded-xl p-6">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-semibold text-gray-900">
                                Link-Level CTR Analysis
                            </p>

                            <select className="border border-gray-300 rounded-md text-xs px-3 py-1.5 text-gray-600">
                                <option>Select Campaign Date</option>
                            </select>
                        </div>

                        {/* Table */}
                        <div className="overflow-hidden">
                            {/* Table Head */}
                            <div className="grid grid-cols-4 bg-gray-100 text-xs font-medium text-gray-600 px-6 py-3">
                                <div>Link / Destination</div>
                                <div className="text-center">Clicks</div>
                                <div className="text-center">CTR</div>
                                <div className="text-right">Conversion</div>
                            </div>

                            {/* Row 1 */}
                            <div className="grid grid-cols-4 items-center px-6 py-4 border-t text-xs border-[#B5B5B5]">
                                <div>
                                    <p className="text-gray-900 font-medium">
                                        Amazon - Love in Paris
                                    </p>
                                    <p className="text-gray-400 text-[11px] mt-1">
                                        https://amazon.com/dp/B0C123456
                                    </p>
                                </div>

                                <div className="text-center text-gray-700">187</div>

                                <div className="text-center">
                                    <p className="text-gray-900">4.1%</p>
                                    <p className="text-emerald-600 text-[11px]">Excellent</p>
                                </div>

                                <div className="text-right text-gray-700">
                                    23 sales
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="grid grid-cols-4 items-center px-6 py-4 border-t text-xs border-[#B5B5B5]">
                                <div>
                                    <p className="text-gray-900 font-medium">
                                        BookFunnel - Free Download
                                    </p>
                                    <p className="text-gray-400 text-[11px] mt-1">
                                        https://bookfunnel.com/dp/B0C123456
                                    </p>
                                </div>

                                <div className="text-center text-gray-700">166</div>

                                <div className="text-center">
                                    <p className="text-gray-900">4.9%</p>
                                    <p className="text-emerald-600 text-[11px]">Excellent</p>
                                </div>

                                <div className="text-right text-gray-700">
                                    89 downloads
                                </div>
                            </div>

                            {/* Row 3 */}
                            <div className="grid grid-cols-4 items-center px-6 py-4 border-t text-xs border-[#B5B5B5]">
                                <div>
                                    <p className="text-gray-900 font-medium">
                                        Amazon - Winter Whispers
                                    </p>
                                    <p className="text-gray-400 text-[11px] mt-1">
                                        https://amazon.com/dp/B0C789012
                                    </p>
                                </div>

                                <div className="text-center text-gray-700">120</div>

                                <div className="text-center">
                                    <p className="text-gray-900">2.1%</p>
                                    <p className="text-emerald-600 text-[11px]">Good</p>
                                </div>

                                <div className="text-right text-gray-700">
                                    15 sales
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* ================= HISTORICAL ================= */}
                    <div className="bg-white rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm font-semibold">Historical Trends</p>

                            <div className="flex gap-2 bg-white border border-[#B5B5B5] p-1 rounded-lg w-fit">
                                {tabsGraph.map((tab) => (
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


                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={historicalTrend}>
                                    <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
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
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default AnalyticsPage;