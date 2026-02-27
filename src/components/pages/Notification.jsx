import React, { useState, useEffect } from 'react';
import { Search, CheckCircle2, Bell, RefreshCw, Send } from 'lucide-react';
import { getNotifications, testNotification } from '../../apis/notification';
import { toast } from 'react-hot-toast';
import dayjs from 'dayjs';
import { useNotifications } from '../../context/NotificationContext';

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
        case 'new':
            return (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]">
                    {text}
                </span>
            );
        default:
            return (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
                    {text || 'General'}
                </span>
            );
    }
};

const Notification = () => {
    const { notifications: wsNotifications, setUnreadCount } = useNotifications();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [testLoading, setTestLoading] = useState(false);

    useEffect(() => {
        setUnreadCount(0);
    }, [setUnreadCount]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await getNotifications();
            // Handle different common API response structures, including grouped objects
            let entries = [];
            if (Array.isArray(response.data)) {
                entries = response.data;
            } else if (response.data?.results) {
                entries = response.data.results;
            } else if (response.data?.notifications) {
                entries = response.data.notifications;
            } else if (typeof response.data === 'object' && response.data !== null) {
                // Handle grouping structure: { "Today": [...], "Yesterday": [...] }
                entries = Object.values(response.data).flat();
            }

            setNotifications(entries);
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
            toast.error("Failed to load notifications");
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleTestNotification = async () => {
        try {
            setTestLoading(true);
            await testNotification({
                title: "Test Notification",
                message: "This is a manually triggered test notification.",
            });
            toast.success("Test notification triggered successfully!");
            fetchNotifications();
        } catch (error) {
            console.error("Failed to trigger test notification:", error);
            toast.error("Failed to trigger test notification");
        } finally {
            setTestLoading(false);
        }
    };

    const formatSection = (dateString) => {
        const date = dayjs(dateString);
        const now = dayjs();
        if (date.isSame(now, 'day')) return 'Today';
        if (date.isSame(now.subtract(1, 'day'), 'day')) return 'Yesterday';
        return date.format('MMMM D, YYYY');
    };

    // Use useMemo for filtering to prevent crashes and improve performance
    const filteredNotifications = React.useMemo(() => {
        const combined = [...wsNotifications, ...notifications];
        const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());

        const list = Array.isArray(unique) ? unique : [];
        const search = searchTerm.toLowerCase();
        return list
            .filter(n => {
                const title = (n.title || "").toLowerCase();
                const message = (n.message || n.text || "").toLowerCase();
                return title.includes(search) || message.includes(search);
            })
            .sort((a, b) => {
                const timeA = dayjs(a.created_at || a.time || 0).valueOf();
                const timeB = dayjs(b.created_at || b.time || 0).valueOf();
                return timeB - timeA;
            });
    }, [notifications, wsNotifications, searchTerm]);

    // Grouping logic moved to useMemo
    const groupedNotifications = React.useMemo(() => {
        return filteredNotifications.reduce((acc, curr) => {
            const section = formatSection(curr.created_at || curr.time || new Date());
            if (!acc[section]) acc[section] = [];
            acc[section].push(curr);
            return acc;
        }, {});
    }, [filteredNotifications]);

    return (
        <div className="max-w-full mx-auto px-2 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        <Bell className="text-[#1F4F4D]" size={24} />
                        All Notifications
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Stay updated with your latest swap activities</p>
                </div>

                <div className="flex items-center gap-3">
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

                    {/* <button
                        onClick={handleTestNotification}
                        disabled={testLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-[#1F4F4D] text-white rounded-xl text-sm font-medium hover:bg-[#163a39] transition-all disabled:opacity-50 whitespace-nowrap shadow-sm"
                    >
                        {testLoading ? <RefreshCw className="animate-spin" size={16} /> : <Send size={16} />}
                        Test API
                    </button> */}
                </div>
            </div>

            {/* Notifications List Container */}
            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <RefreshCw className="animate-spin text-[#1F4F4D] mb-4" size={40} />
                        <p className="text-gray-500 font-medium tracking-tight">Loading notifications...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.keys(groupedNotifications).length > 0 ? (
                            Object.entries(groupedNotifications).map(([section, items]) => (
                                <div key={section} className="space-y-4">
                                    <div className="flex items-center justify-between border-b pb-2 border-gray-100">
                                        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{section}</h2>
                                    </div>
                                    <div className="grid gap-3">
                                        {items.map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => setSelectedId(item.id)}
                                                className={`group relative flex flex-col md:flex-row md:items-center justify-between p-4 px-6 rounded-xl transition-all duration-200 cursor-pointer border ${selectedId === item.id
                                                    ? "bg-[#E07A5F0D] border-[#E07A5F33]"
                                                    : "bg-white border-gray-100 hover:border-[#1F4F4D33] hover:bg-gray-50"
                                                    }`}
                                            >
                                                <div className="flex-1 min-w-0 pr-4">
                                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                        <h3 className={`text-sm md:text-base font-semibold text-[#2D2F33] truncate`}>
                                                            {item.title || "Notification"}
                                                        </h3>
                                                        {(item.badge || item.type) && (
                                                            <Badge
                                                                type={item.badgeType || item.type?.toLowerCase() || item.badge?.toLowerCase()}
                                                                text={item.badge || item.type}
                                                            />
                                                        )}
                                                        {item.is_read === false && (
                                                            <span className="w-2 h-2 bg-[#E07A5F] rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs md:text-sm text-[#4B5563] leading-relaxed max-w-2xl">
                                                        {item.message || item.text}
                                                    </p>
                                                </div>

                                                <div className="mt-3 md:mt-0 flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0">
                                                    <span className="text-[10px] md:text-xs font-medium text-gray-400">
                                                        {item.created_at ? dayjs(item.created_at).format('hh:mm A') : item.time}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <div className="bg-white p-4 rounded-2xl shadow-sm mb-4">
                                    <Bell className="text-gray-300" size={32} />
                                </div>
                                <p className="text-gray-500 font-medium tracking-tight">No notifications found</p>
                                <p className="text-xs text-gray-400 mt-1">Try triggering a test notification above</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notification;

