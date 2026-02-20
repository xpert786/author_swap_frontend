import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiRefreshCw, FiArrowLeft } from "react-icons/fi";
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

// ─── Mock Detail Data ─────────────────────────────────────────────────────────
const detail = {
    name: "Alice Johnson",
    swaps: 25,
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    dateTime: "Wednesday, May 15 at 10:00 AM EST",
    status: "Available",
    visibility: "Public",
    audienceSize: "12,450 subscribers",
    genre: "Fantasy",
    currentPartners: "2/3 Partners",
    analytics: [
        { value: "43.3%", label: "Avg Open Rate" },
        { value: "8.7%", label: "Avg Click Rate" },
        { value: "+312", label: "Monthly Growth" },
        { value: "94%", label: "Send Reliability" },
    ],
    reputation: [
        {
            icon: <ConfirmedSendsIcon size={32} />,
            label: "Confirmed Sends",
            score: "45/50",
            barColor: "#22c55e",
            barPercent: 90,
            leftNote: "90% success rate",
            rightNote: "+45 points",
        },
        {
            icon: <TimelinessIcon size={32} />,
            label: "Timeliness",
            score: "28/30",
            barColor: "#f87171",
            barPercent: 93,
            leftNote: "94% success rate",
            rightNote: "+28 points",
        },
        {
            icon: <MissedSendsIcon size={32} />,
            label: "Missed Sends",
            score: "10/30",
            barColor: "#ef4444",
            barPercent: 33,
            leftNote: "5 missed sends",
            rightNote: "8 points",
        },
        {
            icon: <CommunicationIcon size={32} />,
            label: "Communication",
            score: "10/30",
            barColor: "#2dd4bf",
            barPercent: 70,
            leftNote: "4.2h avg response",
            rightNote: "+28 points",
        },
    ],
    reliability: { score: 92, label: "Excellent" },
    swapHistory: [
        { name: "Michael Chen", date: "20 May 2025", status: "Completed", stars: 4 },
        { name: "Michael Chen", date: "20 May 2025", status: "Completed", stars: 4 },
        { name: "Michael Chen", date: "20 May 2025", status: "Completed", stars: 3.5 },
        { name: "Sarah Johnson", date: "22 May 2025", status: "Completed", stars: 4.5 },
        { name: "Sarah Johnson", date: "22 May 2025", status: "Completed", stars: 4.5 },
        { name: "Sarah Johnson", date: "22 May 2025", status: "Completed", stars: 4 },
        { name: "David Smith", date: "23 May 2025", status: "Completed", stars: 4 },
        { name: "David Smith", date: "23 May 2025", status: "Pending", stars: 4 },
        { name: "David Smith", date: "23 May 2025", status: "Missed", stars: 0 },
    ],
};

// ─── Star Rating ──────────────────────────────────────────────────────────────
const Stars = ({ count }) => (
    <span className="inline-flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
            <span
                key={i}
                className="text-[13px]"
                style={{
                    color: i <= Math.floor(count)
                        ? "#f59e0b"
                        : i - 0.5 <= count
                            ? "#f59e0b"
                            : "#d1d5db",
                }}
            >
                ★
            </span>
        ))}
    </span>
);

// ─── Status Chip ──────────────────────────────────────────────────────────────
const statusStyles = {
    Completed: "text-green-700",
    Pending: "text-yellow-700",
    Missed: "text-red-700",
};
const StatusChip = ({ status }) => (
    <span className={`text-[12px] font-semibold whitespace-nowrap ${statusStyles[status] || "text-green-700"}`}>
        {status === "Completed" && "✓ "}
        {status === "Missed" && "✕ "}
        {status}
    </span>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ percent, color }) => (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden my-2.5">
        <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${percent}%`, background: color }}
        />
    </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
const SwapDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const passed = location.state || {};
    const name = passed.name || detail.name;
    const photo = passed.photo || detail.photo;
    const swaps = passed.swaps ?? detail.swaps;

    return (
        <div className="p-7 min-h-screen w-full">

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
                    <h1 className="text-2xl font-bold text-black mb-0.5 leading-tight">Swap Detail</h1>
                    <p className="text-sm text-black opacity-70">Find places to promote your book</p>
                </div>
            </div>

            {/* ── Profile Card ── */}
            <div className="bg-white border border-[rgba(181,181,181,1)] rounded-xl p-6 mb-7">
                {/* Avatar + Name */}
                <div className="flex items-center gap-3.5 mb-4">
                    <img src={photo} alt={name} className="w-14 h-14 rounded-full object-cover shrink-0" />
                    <div>
                        <p className="text-base font-bold text-black mb-0.5">{name}</p>
                        <p className="text-xs text-black flex items-center gap-1">
                            <FiRefreshCw size={12} /> {swaps} swaps completed
                        </p>
                    </div>
                </div>

                {/* Meta Row */}
                <div className="sd-meta-row flex items-start justify-between flex-wrap gap-5 border-t border-gray-100 pt-4">
                    {/* Date & Time */}
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-black mb-1">Date &amp; time</p>
                        <p className="text-[13px] font-semibold text-black">{detail.dateTime}</p>
                    </div>
                    {/* Status */}
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-black mb-1">Status</p>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 w-fit">
                            {detail.status}
                        </span>
                    </div>
                    {/* Visibility */}
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-black mb-1">Visibility</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(232,232,232,1)] text-black w-fit">
                            <PublicIcon size={12} /> {detail.visibility}
                        </span>
                    </div>
                    {/* Audience Size */}
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-black mb-1">Audience Size</p>
                        <p className="text-[13px] font-semibold text-black">{detail.audienceSize}</p>
                    </div>
                    {/* Genre */}
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-black mb-1">Genre</p>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-black w-fit">
                            {detail.genre}
                        </span>
                    </div>
                    {/* Current Partners */}
                    <div className="flex flex-col gap-1 min-w-[100px]">
                        <p className="text-[11px] text-black mb-1">Current Partners</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[rgba(224,122,95,0.2)] text-black w-fit">
                            <PartnersIcon size={12} /> {detail.currentPartners}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Analytics ── */}
            <div className="bg-white border border-[rgba(181,181,181,1)] rounded-xl p-6 mb-7">
                <p className="text-xl font-bold text-black mb-4">Analytics</p>
                <div className="sd-analytics-grid grid grid-cols-4 gap-3">
                    {detail.analytics.map((a) => (
                        <div key={a.label} className="bg-[rgba(224,122,95,0.05)] rounded-xl py-5 px-3 text-center">
                            <p className="text-[22px] font-bold text-black mb-1">{a.value}</p>
                            <p className="text-xs text-black">{a.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Reputation Score Breakdown ── */}
            <p className="text-lg font-bold text-black pb-3 mb-3.5 border-b border-gray-200">
                Reputation Score Breakdown
            </p>
            {detail.reputation.map((r) => (
                <div key={r.label} className="bg-white border border-[rgba(181,181,181,1)] rounded-xl p-5 mb-4">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 text-sm font-semibold text-black">
                            {r.icon} {r.label}
                        </span>
                        <span className="text-[13px] font-semibold text-black">{r.score}</span>
                    </div>
                    <ProgressBar percent={r.barPercent} color={r.barColor} />
                    <div className="flex justify-between text-[11px] text-black">
                        <span>{r.leftNote}</span>
                        <span>{r.rightNote}</span>
                    </div>
                </div>
            ))}

            {/* ── Reliability ── */}
            <div className="bg-white border border-[rgba(181,181,181,1)] rounded-xl p-6 mb-7">
                <p className="text-xl font-bold text-black mb-0.5">Reliability</p>
                <p className="text-xs text-black mb-2.5">Reliability Score</p>
                <ProgressBar percent={detail.reliability.score} color="#22c55e" />
                <div className="flex items-center justify-between mt-1.5">
                    <span className="text-[13px] font-semibold text-black">{detail.reliability.score}/100</span>
                    <span className="text-xs font-medium text-black">{detail.reliability.label}</span>
                </div>

                {/* ── Recent Swap History ── */}
                <p className="text-base font-bold text-black mt-5 mb-3">Recent Swap History</p>
                <div className="sd-history-grid grid grid-cols-3 gap-2.5">
                    {detail.swapHistory.map((h, i) => (
                        <div key={i} className="border border-gray-200 rounded-xl p-3.5 flex flex-col gap-1.5">
                            {/* Name + Status + Stars */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-semibold text-black">{h.name}</span>
                                <StatusChip status={h.status} />
                                {h.stars > 0 && <Stars count={h.stars} />}
                            </div>
                            {/* Date */}
                            <span className="flex items-center gap-1.5 text-[13px] text-gray-500">
                                <CalendarIcon size={18} /> {h.date}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SwapDetails;
