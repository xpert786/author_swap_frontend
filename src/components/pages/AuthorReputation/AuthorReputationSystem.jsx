import React from "react";
import { Check } from "lucide-react";
import {
    ConfirmedSendsIcon,
    TimelinessIcon,
    MissedSendsIcon,
    CommunicationIcon,
    VerifiedSenderIcon,
    ReliabilityIcon,
    TopPartnerIcon,
    FastCommunicatorIcon,
} from "../../icons";

const AuthorReputationSystem = () => {
    const breakdown = [
        {
            icon: <ConfirmedSendsIcon size={32} />,
            title: "Confirmed Sends",
            score: "45/50",
            percentage: 90,
            subtext: "90% success rate",
            points: "+45 points",
            color: "bg-green-600"
        },
        {
            icon: <TimelinessIcon size={32} />,
            title: "Timeliness",
            score: "28/30",
            percentage: 94,
            subtext: "94% success rate",
            points: "+28 points",
            color: "bg-orange-200"
        },
        {
            icon: <MissedSendsIcon size={32} />,
            title: "Missed Sends",
            score: "10/30",
            percentage: 33,
            subtext: "5 missed sends",
            points: "-8 points",
            color: "bg-red-600"
        },
        {
            icon: <CommunicationIcon size={32} />,
            title: "Communication",
            score: "10/30",
            percentage: 85,
            subtext: "4.2h avg response",
            points: "+28 points",
            color: "bg-[#94B3B1]"
        }
    ];

    const badges = [
        {
            icon: <VerifiedSenderIcon size={32} />,
            title: "Verified Sender",
            desc: "Complete 10+ swaps with verification",
            status: "Earned",
            statusColor: "bg-[#16A34A33]"
        },
        {
            icon: <ReliabilityIcon size={32} />,
            title: "100% Reliability",
            desc: "Perfect send record for 30 days",
            status: "Active",
            statusColor: "bg-[#16A34A33]"
        },
        {
            icon: <TopPartnerIcon size={32} />,
            title: "Top Swap Partner",
            desc: "Top 10% of all authors in reliability",
            status: "Earned",
            statusColor: "bg-[#16A34A33]"
        },
        {
            icon: <FastCommunicatorIcon size={32} />,
            title: "Fast Communicator",
            desc: "Average response time under 3 hours",
            status: "Locked",
            statusColor: "bg-[#16A34A33] text-[#111827]"
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-2xl font-semibold">Author Reputation System</h1>
                <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">Automatic reliability scoring based on confirmed sends, timeliness, and performance</p>

                <div className="flex items-center gap-6 mt-5">
                    <div className="p-4 rounded-xl w-fit" style={{ background: "rgba(22, 163, 74, 0.2)", border: "1px solid rgba(181, 181, 181, 1)" }}>
                        <div className="text-center font-bold text-[#1F2937]">
                            <p className="text-xl">96/100</p>
                            <p className="text-[11px] text-[#374151] mt-0.5">Reputation Score</p>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 mt-2 py-1 px-2 " >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="16" height="16" rx="8" fill="#16A34A" />
                                <g clipPath="url(#clip0_366_6466)">
                                    <path d="M6.13582 9.85L11.9624 4.2C12.0999 4.06667 12.2603 4 12.4437 4C12.6269 4 12.7874 4.06667 12.9249 4.2C13.0624 4.33333 13.1312 4.49178 13.1312 4.67533C13.1312 4.85889 13.0624 5.01711 12.9249 5.15L6.61707 11.2833C6.47957 11.4167 6.31915 11.4833 6.13582 11.4833C5.95249 11.4833 5.79207 11.4167 5.65457 11.2833L2.69832 8.41667C2.56082 8.28333 2.49482 8.12511 2.50032 7.942C2.50582 7.75889 2.57755 7.60045 2.7155 7.46667C2.85346 7.33289 3.01686 7.26622 3.20569 7.26667C3.39453 7.26711 3.55769 7.33378 3.69519 7.46667L6.13582 9.85Z" fill="white" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_366_6466">
                                        <rect width="11" height="8" fill="white" transform="translate(2.5 4)" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span className="text-[10px] font-bold text-green-800">Webhook Verified</span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-xl overflow-hidden border border-[#B5B5B5]">
                <div className="p-5">
                    {/* Platform Ranking Banner */}
                    <div className="rounded-xl p-4 flex items-center gap-4 mb-4" style={{ background: "#FFF4F0", border: "1px solid rgba(181, 181, 181, 1)" }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-normal text-xs" style={{ background: "#F59E0B" }}>
                            #47
                        </div>
                        <div>
                            <h3 className="font-medium text-[15px]">Platform Ranking</h3>
                            <p className="text-xs mt-1">You're in the top 15% of all authors based on reputation score</p>
                        </div>
                    </div>

                    {/* Reputation Badges Section */}
                    <section className="mb-10">
                        <h2 className="text-lg font-medium text-[#111827] mb-5 pb-2 border-b border-[#B5B5B5]">Reputation Badges</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {badges.map((badge, idx) => (
                                <div key={idx} className="rounded-[10px] py-3.5 px-5 flex flex-col items-center text-center transition-all h-full justify-between border border-[#B5B5B5]">
                                    <div className="mb-2">
                                        {badge.icon}
                                    </div>
                                    <div className="mb-2.5">
                                        <h3 className="font-bold text-[#1F2937] text-[14px] mb-0.5">{badge.title}</h3>
                                        <p className="text-[10px] text-gray-500 leading-tight">{badge.desc}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 px-4 py-1 rounded-full ${badge.statusColor}`}>
                                        <Check size={11} />
                                        <span className="text-[10px] font-medium">{badge.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Reputation Score Breakdown Section */}
                    <section>
                        <h2 className="text-lg font-bold text-[#374151] mb-5 pb-2" style={{ borderBottom: "1px solid rgba(181, 181, 181, 1)" }}>Reputation Score Breakdown</h2>
                        <div className="space-y-4">
                            {breakdown.map((item, idx) => (
                                <div key={idx} className="rounded-[10px] p-5" style={{ border: "1px solid rgba(181, 181, 181, 1)" }}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            {item.icon}
                                            <span className="font-medium text-[#1F2937] text-[14px]">{item.title}</span>
                                        </div>
                                        <span className="font-bold text-[#1F2937] text-sm">{item.score}</span>
                                    </div>

                                    <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] text-gray-500 font-medium">{item.subtext}</p>
                                        <p className="text-[11px] font-bold text-gray-700">{item.points}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AuthorReputationSystem;
