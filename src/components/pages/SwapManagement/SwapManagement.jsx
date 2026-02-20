import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, RotateCcw, X, Send } from 'lucide-react';

const tabs = [
    "All Swaps",
    "Pending Swaps",
    "Sending Swaps",
    "Reject",
    "Scheduled",
    "Completed Swaps"
];

const swapData = [
    // All Swaps
    {
        id: 1,
        author: "Ema Chen",
        role: "Mystery Author",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        audienceSize: "22,000+",
        reliabilityScore: "95%",
        requestingBook: "Mystery of the Old House",
        message: "Love your books! Would love to swap.",
        status: "incoming",
        category: "All Swaps"
    },
    {
        id: 2,
        author: "John Doe",
        role: "Silent Witness",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        audienceSize: "30,000+",
        reliabilityScore: "90%",
        requestingBook: "Chase the Shadows",
        message: "Excited to collaborate! Your work is inspiring.",
        status: "pending_partner",
        badge: "Waiting for partner response",
        statusBadge: "Pending",
        category: "All Swaps"
    },
    // Pending Swaps Data (From Image)
    {
        id: 101,
        author: "Ema Chen",
        role: "Mystery Author",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
        audienceSize: "30,000+",
        reliabilityScore: "90%",
        requestingBook: "The Midnight Garden",
        message: "Excited to collaborate! Your work is inspiring.",
        status: "accepted_view",
        statusBadge: "Accepted",
        category: "Pending Swaps"
    },
    {
        id: 102,
        author: "Liam Harper",
        role: "Science Fiction Writer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
        audienceSize: "15,000+",
        reliabilityScore: "90%",
        requestingBook: "Galactic Odyssey",
        message: "Your stories are incredible! Let's exchange!",
        status: "incoming",
        category: "Pending Swaps"
    },
    {
        id: 103,
        author: "Sofia Rodriguez",
        role: "Romance Novelist",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
        audienceSize: "30,000+",
        reliabilityScore: "93%",
        requestingBook: "Hearts in Bloom",
        message: "I adore your writing! Would be thrilled to swap.",
        status: "incoming",
        category: "Pending Swaps"
    },
    {
        id: 3,
        author: "Sophia Patel",
        role: "Fantasy Writer",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        audienceSize: "15,000+",
        reliabilityScore: "85%",
        requestingBook: "Realm of Dreams",
        message: "I admire your creativity! Let's connect.",
        status: "active",
        category: "All Swaps"
    },
    {
        id: 4,
        author: "Lisa Wang",
        role: "Romance Author",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150",
        audienceSize: "30,000+",
        reliabilityScore: "80%",
        requestingBook: "Hearts Entwined",
        message: "Your writing style is amazing! Would love to collaborate on a newsletter swap.",
        status: "rejected",
        rejectionReason: "Audience size too small for current campaign goals.",
        rejectionDate: "Rejected on May 12, 2023",
        category: "Reject"
    },
    {
        id: 5,
        author: "John Doe",
        role: "Silent Witness",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        audienceSize: "30,000+",
        reliabilityScore: "90%",
        requestingBook: "Chase the Shadows",
        message: "Excited to collaborate! Your work is inspiring.",
        status: "scheduled",
        badge: "Scheduled for June 15 2025",
        category: "Scheduled"
    },
    {
        id: 6,
        author: "Sophia Patel",
        role: "Fantasy Writer",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        audienceSize: "15,000+",
        reliabilityScore: "85%",
        requestingBook: "Realm of Dreams",
        message: "I admire your creativity! Let's connect.",
        status: "completed",
        statusBadge: "Completed",
        category: "All Swaps"
    },
    // Sending Swaps Data (From Image)
    {
        id: 201,
        author: "Sophia Patel",
        role: "Fantasy Writer",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        audienceSize: "15,000+",
        reliabilityScore: "85%",
        requestingBook: "Realm of Dreams",
        message: "I admire your creativity! Let's connect.",
        status: "active",
        category: "Sending Swaps"
    },
    {
        id: 202,
        author: "John Doe",
        role: "Silent Witness",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        audienceSize: "30,000+",
        reliabilityScore: "90%",
        requestingBook: "Chase the Shadows",
        message: "Excited to collaborate! Your work is inspiring.",
        status: "pending_partner",
        badge: "Waiting for partner response",
        statusBadge: "Pending",
        category: "Sending Swaps"
    },
    {
        id: 203,
        author: "John Doe",
        role: "Silent Witness",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150",
        audienceSize: "30,000+",
        reliabilityScore: "90%",
        requestingBook: "Chase the Shadows",
        message: "Excited to collaborate! Your work is inspiring.",
        status: "pending_partner",
        badge: "Waiting for partner response",
        statusBadge: "Pending",
        category: "Sending Swaps"
    },
    // Completed Swaps Data (From Image)
    {
        id: 301,
        author: "Sophia Patel",
        role: "Fantasy Writer",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
        audienceSize: "15,000+",
        reliabilityScore: "85%",
        requestingBook: "Realm of Dreams",
        message: "I admire your creativity! Let's connect.",
        status: "completed",
        category: "Completed Swaps"
    }
];

const TrackMySwapModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="mx-8 py-6 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-[#111827]">Track My Swap</h2>
                    <button onClick={onClose} className="transition-transform hover:scale-105">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="12" fill="#D2D2D2" />
                            <path d="M16.066 8.99502C16.1377 8.92587 16.1948 8.84314 16.2342 8.75165C16.2735 8.66017 16.2943 8.56176 16.2952 8.46218C16.2961 8.3626 16.2772 8.26383 16.2395 8.17164C16.2018 8.07945 16.1462 7.99568 16.0758 7.92523C16.0054 7.85478 15.9217 7.79905 15.8295 7.7613C15.7374 7.72354 15.6386 7.70452 15.5391 7.70534C15.4395 7.70616 15.341 7.7268 15.2495 7.76606C15.158 7.80532 15.0752 7.86242 15.006 7.93402L12 10.939L8.995 7.93402C8.92634 7.86033 8.84354 7.80123 8.75154 7.76024C8.65954 7.71925 8.56022 7.69721 8.45952 7.69543C8.35882 7.69365 8.25879 7.71218 8.1654 7.7499C8.07201 7.78762 7.98718 7.84376 7.91596 7.91498C7.84474 7.9862 7.7886 8.07103 7.75087 8.16442C7.71315 8.25781 7.69463 8.35784 7.69641 8.45854C7.69818 8.55925 7.72022 8.65856 7.76122 8.75056C7.80221 8.84256 7.86131 8.92536 7.935 8.99402L10.938 12L7.933 15.005C7.80052 15.1472 7.72839 15.3352 7.73182 15.5295C7.73525 15.7238 7.81396 15.9092 7.95138 16.0466C8.08879 16.1841 8.27417 16.2628 8.46847 16.2662C8.66278 16.2696 8.85082 16.1975 8.993 16.065L12 13.06L15.005 16.066C15.1472 16.1985 15.3352 16.2706 15.5295 16.2672C15.7238 16.2638 15.9092 16.1851 16.0466 16.0476C16.184 15.9102 16.2627 15.7248 16.2662 15.5305C16.2696 15.3362 16.1975 15.1482 16.065 15.006L13.062 12L16.066 8.99502Z" fill="#111827" />
                        </svg>
                    </button>
                </div>

                <div className="p-8 space-y-7">
                    {/* Swapping With Section */}
                    <div>
                        <p className="text-base font-bold text-gray-900 mb-4">Swapping With</p>
                        <div className="flex items-center gap-3">
                            <img src={data.image} alt={data.author} className="w-14 h-14 rounded-full object-cover" />
                            <div>
                                <h3 className="text-base font-normal text-gray-600 leading-tight">{data.author}</h3>
                                <p className="text-base font-bold text-black">{data.role}</p>
                            </div>
                        </div>
                    </div>

                    {/* Promoting Book Section */}
                    <div>
                        <p className="text-base font-bold text-gray-900 mb-4">Promoting Book</p>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <img
                                    src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=200"
                                    className="w-20 h-28 object-cover rounded-xl shadow-md"
                                />
                                <div>
                                    <h4 className="text-lg font-bold text-black mb-1">{data.requestingBook}</h4>
                                    <p className="text-sm text-gray-500">Mystery</p>
                                </div>
                            </div>
                            <span className="bg-[#E8E8E8] text-gray-500 text-[11px] px-3.5 py-1 rounded-full font-medium">
                                Upcoming
                            </span>
                        </div>
                    </div>

                    {/* Countdown Banner */}
                    <div
                        className="rounded-2xl p-8 text-center text-white border"
                        style={{
                            background: "linear-gradient(180deg, #2F6F6D 3.25%, #16A34A 177.92%)",
                            borderColor: "rgba(181, 181, 181, 1)"
                        }}
                    >
                        <p className="text-lg font-medium opacity-90 mb-2">{data.requestingBook}</p>
                        <p className="text-[13px] mb-4">26 Jan 2026</p>
                        <p className="text-4xl font-bold tracking-widest">10:53:45</p>
                    </div>

                    {/* Meta Section */}
                    <div className="flex gap-16">
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1.5">Request Date</p>
                            <p className="text-base font-bold text-gray-900">3 Jan, 2026</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1.5">Deadline</p>
                            <p className="text-base font-bold text-gray-900">26 Jan, 2026 06:30PM</p>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div>
                        <h4 className="text-lg font-bold text-gray-900 mb-4">Links</h4>
                        <div className="space-y-4">
                            <div className="flex text-sm">
                                <span className="w-24 text-gray-500 font-medium">Website:</span>
                                <span className="font-medium text-gray-700">https://www.janedoeauthor.com</span>
                            </div>
                            <div className="flex text-sm">
                                <span className="w-24 text-gray-500 font-medium">Facebook:</span>
                                <span className="font-medium text-gray-700">https://facebook.com/janedoeauthor</span>
                            </div>
                            <div className="flex text-sm">
                                <span className="w-24 text-gray-500 font-medium">Instagram:</span>
                                <span className="font-medium text-gray-700">https://instagram.com/janedoeauthor</span>
                            </div>
                            <div className="flex text-sm">
                                <span className="w-24 text-gray-500 font-medium">Twitter:</span>
                                <span className="font-medium text-gray-700">https://twitter.com/janedoeauthor</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end pt-4">
                        <button
                            onClick={onClose}
                            className="px-8 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SwapDetailsModal = ({ isOpen, onClose, data }) => {
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="mx-8 py-6 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-[#111827]">Swap Details</h2>
                    <button onClick={onClose} className="transition-transform hover:scale-105">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="24" height="24" rx="12" fill="#D2D2D2" />
                            <path d="M16.066 8.99502C16.1377 8.92587 16.1948 8.84314 16.2342 8.75165C16.2735 8.66017 16.2943 8.56176 16.2952 8.46218C16.2961 8.3626 16.2772 8.26383 16.2395 8.17164C16.2018 8.07945 16.1462 7.99568 16.0758 7.92523C16.0054 7.85478 15.9217 7.79905 15.8295 7.7613C15.7374 7.72354 15.6386 7.70452 15.5391 7.70534C15.4395 7.70616 15.341 7.7268 15.2495 7.76606C15.158 7.80532 15.0752 7.86242 15.006 7.93402L12 10.939L8.995 7.93402C8.92634 7.86033 8.84354 7.80123 8.75154 7.76024C8.65954 7.71925 8.56022 7.69721 8.45952 7.69543C8.35882 7.69365 8.25879 7.71218 8.1654 7.7499C8.07201 7.78762 7.98718 7.84376 7.91596 7.91498C7.84474 7.9862 7.7886 8.07103 7.75087 8.16442C7.71315 8.25781 7.69463 8.35784 7.69641 8.45854C7.69818 8.55925 7.72022 8.65856 7.76122 8.75056C7.80221 8.84256 7.86131 8.92536 7.935 8.99402L10.938 12L7.933 15.005C7.80052 15.1472 7.72839 15.3352 7.73182 15.5295C7.73525 15.7238 7.81396 15.9092 7.95138 16.0466C8.08879 16.1841 8.27417 16.2628 8.46847 16.2662C8.66278 16.2696 8.85082 16.1975 8.993 16.065L12 13.06L15.005 16.066C15.1472 16.1985 15.3352 16.2706 15.5295 16.2672C15.7238 16.2638 15.9092 16.1851 16.0466 16.0476C16.184 15.9102 16.2627 15.7248 16.2662 15.5305C16.2696 15.3362 16.1975 15.1482 16.065 15.006L13.062 12L16.066 8.99502Z" fill="#111827" />
                        </svg>
                    </button>
                </div>

                <div className="p-8 pt-6">
                    {/* Author Profil */}
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-4">
                            <img src={data.image} alt={data.author} className="w-16 h-16 rounded-full object-cover" />
                            <div>
                                <h3 className="text-lg font-normal text-gray-600 leading-tight">{data.author}</h3>
                                <p className="text-base font-bold text-black">{data.role}</p>
                            </div>
                        </div>
                        <span className="bg-[#D1FAE5] text-[#047857] text-[11px] font-bold px-3 py-1 rounded-full">
                            Accepted
                        </span>
                    </div>

                    {/* Book Info */}
                    <div className="flex gap-4 mb-8">
                        <img
                            src="https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&q=80&w=200"
                            alt="The Midnight Garden"
                            className="w-24 h-32 object-cover rounded-xl shadow-md"
                        />
                        <div className="pt-4">
                            <h4 className="text-xl font-bold text-black mb-1">The Midnight Garden</h4>
                            <p className="text-sm text-gray-500">Mystery</p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mb-8">
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Audience Size</p>
                            <p className="text-base font-bold text-black">{data.audienceSize || "30,000+"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Reliability Score</p>
                            <p className="text-base font-bold text-black">{data.reliabilityScore || "90%"}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium mb-1">Request Date</p>
                            <p className="text-base font-bold text-black">May 20, 2023</p>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="mb-8">
                        <h4 className="text-lg font-bold text-black mb-4">Links</h4>
                        <div className="space-y-3">
                            <div className="flex text-sm">
                                <span className="w-24 text-gray-500 font-medium">Website:</span>
                                <a href="#" className="font-medium text-gray-700 hover:text-[#1F4F4D] decoration-gray-300">https://www.emachenauthor.com</a>
                            </div>
                            <div className="flex text-sm">
                                <span className="w-24 text-gray-500 font-medium">Facebook:</span>
                                <a href="#" className="font-medium text-gray-700 hover:text-[#1F4F4D] decoration-gray-300">https://facebook.com/emachenauthor</a>
                            </div>
                            <div className="flex text-sm">
                                <span className="w-24 text-gray-500 font-medium">Instagram:</span>
                                <a href="#" className="font-medium text-gray-700 hover:text-[#1F4F4D] decoration-gray-300">https://instagram.comemachenauthor</a>
                            </div>
                            <div className="flex text-sm">
                                <span className="w-24 text-gray-500 font-medium">Twitter:</span>
                                <a href="#" className="font-medium text-gray-700 hover:text-[#1F4F4D] decoration-gray-300">https://twitter.com/emachenauthor</a>
                            </div>
                        </div>
                    </div>

                    {/* Message */}
                    <div className="mb-8">
                        <p className="text-xs text-gray-500 font-medium mb-2">Message</p>
                        <p className="text-sm text-black">"{data.message}"</p>
                    </div>

                    {/* Response Notes */}
                    <div className="mb-8">
                        <label className="text-sm font-bold text-black mb-3 block">Response Notes:</label>
                        <div className="relative">
                            <textarea
                                placeholder="Add notes for your response..."
                                className="w-full border border-gray-200 rounded-xl p-4 pr-12 text-sm focus:ring-1 focus:ring-[#1F4F4D] outline-none min-h-[100px] resize-none"
                            />
                            <button className="absolute right-3 bottom-3 p-2 bg-[#F1F5F9] rounded-lg hover:bg-gray-200 transition-colors">
                                <Send size={20} className="text-[#94A3B8]" />
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end pt-4 border-t border-gray-100">
                        <button
                            onClick={onClose}
                            className="px-10 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all uppercase tracking-tight"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SwapCard = ({ data, isSelected, onClick, onViewDetails, onTrackSwap, onViewHistory, activeTab }) => {
    const isCompleted = data.status === "completed";
    const isRejected = data.status === "rejected";
    const isAcceptedView = data.status === "accepted_view";
    const isCoralTheme = activeTab !== "All Swaps";

    return (
        <div
            onClick={onClick}
            className={`p-4 rounded-2xl flex flex-col gap-3 transition-all h-full cursor-pointer border group ${isSelected
                ? isCoralTheme
                    ? "bg-[rgba(224,122,95,0.05)] border-[rgba(224,122,95,1)]"
                    : "bg-[rgba(22,163,74,0.1)] border-[rgba(22,163,74,1)]"
                : "bg-white border-[rgba(181,181,181,1)]"
                } ${isCoralTheme
                    ? "hover:bg-[rgba(224,122,95,0.05)] hover:border-[rgba(224,122,95,1)]"
                    : "hover:bg-[rgba(22,163,74,0.1)] hover:border-[rgba(22,163,74,1)]"
                }`}
        >
            {/* Header: Profile + Status Badge */}
            <div className="flex justify-between items-start">
                <div className="flex gap-2.5">
                    <img src={data.image} alt={data.author} className="w-11 h-11 rounded-full object-cover" />
                    <div>
                        <h3 className="text-[15px] font-normal text-gray-600 leading-tight">{data.author}</h3>
                        <p className="text-[13px] font-bold text-black">{data.role}</p>
                    </div>
                </div>
                {data.statusBadge && (
                    <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${data.statusBadge === "Accepted"
                            ? "bg-[#D1FAE5] text-[#047857]"
                            : isCompleted
                                ? "bg-[#C4E0DD] text-[#1F4F4D]"
                                : "bg-gray-200 text-gray-600"
                            }`}
                    >
                        {data.statusBadge}
                    </span>
                )}
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-1.5 py-0.5">
                <div className="flex flex-col">
                    <span className="text-[9px] text-gray-600 font-medium">Audience Size</span>
                    <span className="text-[13px] font-extrabold text-[#111827]">{data.audienceSize}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] text-gray-600 font-medium">Reliability Score</span>
                    <span className="text-[13px] font-extrabold text-[#111827]">{data.reliabilityScore}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[9px] text-gray-600 font-medium">Requesting Book</span>
                    <span className="text-[13px] font-extrabold text-[#111827] truncate">{data.requestingBook}</span>
                </div>
            </div>
            {/* Message Section */}
            <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-600 font-medium tracking-tight">Message</span>
                <p className="text-[12px] text-gray-700 leading-snug line-clamp-2">"{data.message}"</p>
            </div>

            {/* Status & Actions Row */}
            <div className="mt-2 flex items-center flex-wrap gap-2">
                {data.badge && (
                    <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-[rgba(245,158,11,0.2)] text-black whitespace-nowrap">
                        {data.badge}
                    </span>
                )}

                {data.status === "active" && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onTrackSwap(data);
                        }}
                        className="w-fit px-4 py-1.5 rounded-lg bg-[#1F4F4D] text-white text-[12px] font-normal hover:bg-[#153a39] transition-colors whitespace-nowrap"
                    >
                        Track My Swap
                    </button>
                )}

                {isCompleted && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewHistory(data);
                        }}
                        className="w-fit px-4 py-1.5 rounded-lg bg-[#2F6F6D] text-white text-[12px] font-normal hover:bg-[#245654] transition-colors whitespace-nowrap"
                    >
                        View Swap History
                    </button>
                )}

                {isAcceptedView && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onViewDetails(data);
                        }}
                        className="w-fit px-4 py-1.5 rounded-lg bg-[#2F6F6D] text-white text-[12px] font-bold hover:bg-[#245654] transition-colors whitespace-nowrap"
                    >
                        View Details
                    </button>
                )}

                {data.status === "incoming" && (
                    <div className="flex gap-2">
                        <button className="px-3 py-1.5 rounded-lg border border-[rgba(220,38,38,1)] text-[rgba(220,38,38,1)] text-[11px] font-bold hover:bg-[rgba(220,38,38,0.05)] transition-colors whitespace-nowrap">
                            Decline
                        </button>
                        <button className="px-3 py-1.5 rounded-lg bg-[rgba(22,163,74,1)] text-white text-[11px] font-bold hover:opacity-90 transition-opacity whitespace-nowrap">
                            Accept
                        </button>
                    </div>
                )}
            </div>

            {/* Rejection / Special Actions Row */}
            {isRejected && (
                <div className="flex flex-col gap-3">
                    <div className="bg-[#FEF2F2] p-2.5 rounded-xl border border-[#FEE2E2]">
                        <p className="text-[12px] font-bold text-[#DC2626] mb-0.5">Rejection Reason</p>
                        <p className="text-[11px] text-gray-600 leading-tight">{data.rejectionReason}</p>
                        <p className="text-[9px] text-[rgba(55,65,81,1)] mt-1.5">{data.rejectionDate}</p>
                    </div>
                    <button className="w-fit flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-[11px] font-bold text-gray-700 hover:bg-gray-50 shadow-sm transition-all whitespace-nowrap">
                        Restore
                    </button>
                </div>
            )}
        </div>
    );
};

const SwapManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("All Swaps");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isTrackOpen, setIsTrackOpen] = useState(false);
    const [selectedSwap, setSelectedSwap] = useState(null);

    const handleViewDetails = (swap) => {
        setSelectedSwap(swap);
        setIsDetailsOpen(true);
    };

    const handleTrackSwap = (swap) => {
        setSelectedSwap(swap);
        setIsTrackOpen(true);
    };

    const handleViewHistory = (swap) => {
        navigate("/swap-history", { state: { data: swap } });
    };

    return (
        <div className="max-w-full mx-auto">
            {/* ... Header ... */}
            <div className="mb-6">
                <h1 className="text-[28px] font-bold text-[#111827] leading-tight mb-1">Swap Management</h1>
                <p className="text-sm text-gray-500">Request, manage, and track your newsletter partnerships</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap items-center bg-white border border-[rgba(181,181,181,1)] rounded-xl p-1 gap-1 mb-8 w-fit shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 ${activeTab === tab
                            ? "bg-[#1F4F4D] text-white shadow-sm"
                            : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
                {/* Content Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-[#111827]">{activeTab}</h2>

                    <div className="relative w-full md:w-72">
                        <input
                            type="text"
                            placeholder="Search swaps by author, book, or date"
                            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1F4F4D]/20 focus:border-[#1F4F4D] transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-4 md:p-6" style={{ border: "1px solid rgba(181, 181, 181, 1)" }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-6">
                        {swapData
                            .filter(swap => activeTab === "All Swaps" || swap.category === activeTab)
                            .map((swap) => (
                                <SwapCard
                                    key={swap.id}
                                    data={swap}
                                    activeTab={activeTab}
                                    isSelected={selectedId === swap.id}
                                    onClick={() => setSelectedId(swap.id)}
                                    onViewDetails={handleViewDetails}
                                    onTrackSwap={handleTrackSwap}
                                    onViewHistory={handleViewHistory}
                                />
                            ))}
                    </div>
                </div>
            </div>

            <SwapDetailsModal
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
                data={selectedSwap}
            />

            <TrackMySwapModal
                isOpen={isTrackOpen}
                onClose={() => setIsTrackOpen(false)}
                data={selectedSwap}
            />
        </div>
    );
};

export default SwapManagement;
