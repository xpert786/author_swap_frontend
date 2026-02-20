import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const tabs = [
    "All Swaps",
    "Pending Swaps",
    "Sending Swaps",
    "Reject Swaps",
    "Scheduled Swaps",
    "Completed Swaps"
];

const swapData = [
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
        status: "pending",
        badge: "Pending",
        statusNote: "Waiting for partner response",
        category: "All Swaps"
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
        category: "Reject Swaps"
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
        statusNote: "Scheduled for June 15 2015",
        category: "Scheduled Swaps"
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
        badge: "Completed",
        category: "Completed Swaps"
    }
];

const SwapCard = ({ data }) => {
    const isCompleted = data.status === "completed";
    const isRejected = data.status === "rejected";

    return (
        <div 
            className={`p-5 rounded-[12px] border flex flex-col gap-4 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all h-full
            ${isCompleted ? "bg-[#EBF5EE] border-[#16A34A]" : "bg-white border-[#B5B5B5]"}
            `}
        >
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="flex gap-2.5">
                    <img src={data.image} alt={data.author} className="w-10 h-10 rounded-full object-cover shrink-0" />
                    <div>
                        <h3 className="text-[13px] font-medium text-black leading-tight">{data.author}</h3>
                        <p className="text-[13px] font-medium text-black">{data.role}</p>
                    </div>
                </div>
                {data.badge && (
                    <span 
                        className={`text-[9px] font-normal px-2.5 py-0.5 rounded-full border border-gray-200
                        ${isCompleted ? "bg-[#16A34A33] text-black border-[#16A34A33]" : "bg-[#F3F4F6] text-[#374151]"}
                        `}
                    >
                        {data.badge}
                    </span>
                )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-1">
                <div>
                    <p className="text-[10px] text-[#374151] font-normal mb-1">Audience Size</p>
                    <p className="text-[13px] font-medium text-black">{data.audienceSize}</p>
                </div>
                <div>
                    <p className="text-[10px] text-[#374151] font-normal mb-1">Reliability Score</p>
                    <p className="text-[13px] font-medium text-black">{data.reliabilityScore}</p>
                </div>
                <div>
                    <p className="text-[10px] text-[#374151] font-normal mb-1">Requesting Book</p>
                    <p className="text-[13px] font-medium text-black truncate">{data.requestingBook}</p>
                </div>
            </div>

            {/* Message */}
            <div className="space-y-1">
                <p className="text-[10px] text-[#374151] font-normal">Message</p>
                <p className="text-[12px] text-black font-semibold leading-tight italic">"{data.message}"</p>
            </div>

            {/* Actions / Status Specifics */}
            <div className="mt-auto pt-2 space-y-4">
                {data.status === "incoming" && (
                    <div className="flex gap-2">
                        <button className="px-5 py-1.5 border border-[#DC2626] text-[#DC2626] rounded-[6px] text-[12px] font-medium hover:bg-red-50">
                            Decline
                        </button>
                        <button className="px-5 py-1.5 bg-[#16A34A] text-white rounded-[6px] text-[12px] font-medium">
                            Accept
                        </button>
                    </div>
                )}

                {data.statusNote && (
                    <div 
                        className={`text-[9px] font-medium px-3 py-1 rounded-full    w-fit
                        ${data.status === "pending" ? "bg-[#F59E0B33]" : "bg-[#F59E0B33]"}
                        `}
                    >
                        {data.statusNote}
                    </div>
                )}

                {data.status === "active" && (
                    <button 
                        className="bg-[#2F6F6D] text-white text-[12px] font-medium px-4 py-2 rounded-[6px]"
                    >
                        Track My Swap
                    </button>
                )}

                {isRejected && (
                    <div className="space-y-3">
                        <div className="bg-[#FEF2F2] p-3 rounded-[8px] border border-[#FEE2E2]">
                            <h4 className="text-[12px] font-bold text-[#DC2626] mb-1">Rejection Reason</h4>
                            <p className="text-[12px] text-[#374151] leading-tight">{data.rejectionReason}</p>
                            <p className="text-[10px] text-[#374151] opacity-70 mt-2">Rejected on May 12, 2023</p>
                        </div>
                        <button className="inline-block border border-[#B5B5B5] px-5 py-1.5 text-[12px] font-bold rounded-[6px] hover:bg-gray-50 text-black">
                            Restore
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const SwapManagement = () => {
    const [activeTab, setActiveTab] = useState("All Swaps");
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <div className="min-h-screen bg-white pb-10">
            {/* Header */}
            <div className="mb-3">
                <h1 className="text-2xl font-semibold">Swap Management</h1>
                <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">Request, manage, and track your newsletter partnerships</p>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 bg-white p-1 rounded-[8px] border border-[#2F6F6D] w-fit mb-6">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 text-[12px] font-medium rounded-[6px] transition-all
                        ${activeTab === tab ? "bg-[#2F6F6D] text-white" : "text-[#374151] hover:bg-gray-50"}
                        `}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Header */}
            <div className="flex items-center justify-between gap-4 mb-6">
                <h2 className="text-xl md:text-[24px] font-medium text-black">{activeTab}</h2>
                <div className="relative w-full max-w-[320px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search swaps by author, book, or date"
                        className="w-full pl-10 pr-4 py-2 bg-white border border-[#B5B5B5] rounded-lg text-[13px] focus:outline-none focus:ring-1 focus:ring-[#2F6F6D]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid Container */}
            <div className="bg-white rounded-[12px] border border-[#B5B5B5] p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {swapData.map((swap) => (
                        <SwapCard key={swap.id} data={swap} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SwapManagement;
