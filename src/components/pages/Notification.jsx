import React, { useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';

const notificationsData = [
    {
        id: 1,
        title: "New Swap Request",
        badge: "Swap",
        badgeType: "swap",
        message: "Amanda Johnson requested to swap with you for her \"Romance Newsletter\" slot on June 22.",
        time: "Today",
        isNew: true,
        section: "Today"
    },
    {
        id: 2,
        title: "Swap Request Accepted",
        badge: "Swap",
        badgeType: "swap",
        message: "Michael Chen accepted your swap request for his sci-fi newsletter. Assets due by June 17.",
        time: "Today",
        isNew: true,
        section: "Today"
    },
    {
        id: 3,
        title: "Swap Completed via Webhook",
        badge: "VERIFIED",
        badgeType: "verified",
        message: "Your swap with Sarah Williams has been automatically verified and marked as completed via webhook.",
        time: "Today",
        isNew: false,
        section: "Today"
    },
    {
        id: 4,
        title: "Send Reminder - 24 Hours",
        badge: "REMINDER",
        badgeType: "reminder",
        message: "Your swap with Robert Davis is scheduled for tomorrow at 9:00 AM EST. Don't forget to send your campaign!",
        time: "Today",
        isNew: false,
        section: "Today"
    },
    {
        id: 5,
        title: "New Message from Jessica Taylor",
        badge: "",
        badgeType: "",
        message: '"Hi! I uploaded the assets for our swap. Let me know if you need anything else. Looking forward to promoting your book!"',
        time: "12-12-2026",
        isNew: false,
        section: "Yesterday"
    },
    {
        id: 6,
        title: "Asset Deadline Approaching",
        badge: "Deadline",
        badgeType: "deadline",
        message: "Assets for your swap with David Miller are due in 6 hours. Please submit your cover image and blurb.",
        time: "12-12-2026",
        isNew: false,
        section: "Yesterday"
    },
    {
        id: 7,
        title: "Swap Completed via Webhook",
        badge: "VERIFIED",
        badgeType: "verified",
        message: "Your swap with Sarah Williams has been automatically verified and marked as completed via webhook.",
        time: "12-12-2026",
        isNew: false,
        section: "Yesterday"
    }
];

const Badge = ({ type, text }) => {
    switch (type) {
        case 'swap':
            return (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#16A34A33] text-[#111827] border border-[#C8E6C9]">
                    {text}
                </span>
            );
        case 'verified':
            return (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E8F5E9] text-black border border-[#C8E6C9]">
                    <CheckCircle2 size={14} fill="#2E7D32" className="text-white" />
                    {text}
                </span>
            );
        case 'reminder':
            return (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[rgba(224,122,95,0.2)] text-black border border-[rgba(224,122,95,0.3)]">
                    {text}
                </span>
            );
        case 'deadline':
            return (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[rgba(220,38,38,1)] text-white border border-[rgba(220,38,38,1)]">
                    {text}
                </span>
            );
        default:
            return null;
    }
};

const Notification = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    const filteredNotifications = notificationsData.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const groupedNotifications = filteredNotifications.reduce((acc, curr) => {
        if (!acc[curr.section]) acc[curr.section] = [];
        acc[curr.section].push(curr);
        return acc;
    }, {});

    return (
        <div className="max-w-full mx-auto px-2">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-2xl font-semibold">All Notifications</h1>

                <div className="relative w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search notifications"
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4F4D]/20 focus:border-[#1F4F4D] transition-all shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
            </div>

            {/* Notifications List Container */}
            <div className="bg-white rounded-2xl p-4 md:p-6" style={{ border: "1px solid rgba(181, 181, 181, 1)" }}>
                <div className="space-y-8">
                    {Object.keys(groupedNotifications).length > 0 ? (
                        Object.entries(groupedNotifications).map(([section, items]) => (
                            <div key={section} className="space-y-4">
                                <div className="flex items-center justify-between border-b pb-2 border-[#B5B5B5]">
                                    <h2 className="text-sm font-semibold text-[#2D2F33] uppercase tracking-wider">{section}</h2>
                                    {section === "Yesterday" && (
                                        <span className="text-xs text-[#374151] font-normal tracking-wide">12-12-2026</span>
                                    )}
                                </div>
                                <div className="grid gap-3">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => setSelectedId(item.id)}
                                            style={{
                                                border: "1px solid rgba(181, 181, 181, 1)",
                                                backgroundColor: (selectedId === item.id) ? "rgba(224, 122, 95, 0.05)" : "white"
                                            }}
                                            className="group relative flex flex-col md:flex-row md:items-center justify-between p-4 px-6 rounded-[10px] transition-all duration-200 hover:bg-[rgba(224,122,95,0.05)] cursor-pointer"
                                        >
                                            <div className="flex-1 min-w-0 pr-4">
                                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                    <h3 className={`text-sm md:text-base font-medium text-[#2D2F33] truncate`}>
                                                        {item.title}
                                                    </h3>
                                                    {item.badge && <Badge type={item.badgeType} text={item.badge} />}
                                                </div>
                                                <p className="text-xs md:text-sm text-[#374151] leading-relaxed max-w-2xl">
                                                    {item.message}
                                                </p>
                                            </div>

                                            <div className="mt-3 md:mt-0 flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                                                <span className="text-[10px] md:text-xs font-medium text-gray-400">
                                                    {item.time}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                                <Search className="text-gray-300" size={32} />
                            </div>
                            <p className="text-gray-500 font-medium tracking-tight">No notifications found matching your search</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notification;
