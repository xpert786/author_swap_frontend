import React, { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
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
import { getAuthorReputation } from "../../../apis/autherReputation";
import toast from "react-hot-toast";

const AuthorReputationSystem = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const mockData = {
        reputation_score: 96,
        platform_ranking: {
            rank: 47,
            top_percentage: 15
        },
        badges: [
            {
                title: "Verified Sender",
                desc: "Complete 10+ swaps with verification",
                status: "Earned"
            },
            {
                title: "100% Reliability",
                desc: "Perfect send record for 30 days",
                status: "Active"
            },
            {
                title: "Top Swap Partner",
                desc: "Top 10% of all authors in reliability",
                status: "Earned"
            },
            {
                title: "Fast Communicator",
                desc: "Average response time under 3 hours",
                status: "Locked"
            }
        ],
        breakdown: [
            {
                title: "Confirmed Sends",
                score: "45/50",
                percentage: 90,
                subtext: "90% success rate",
                points: "+45 points",
                color: "bg-green-600"
            },
            {
                title: "Timeliness",
                score: "28/30",
                percentage: 94,
                subtext: "94% success rate",
                points: "+28 points",
                color: "bg-orange-200"
            },
            {
                title: "Missed Sends",
                score: "10/30",
                percentage: 33,
                subtext: "5 missed sends",
                points: "-8 points",
                color: "bg-red-600"
            },
            {
                title: "Communication",
                score: "10/30",
                percentage: 85,
                subtext: "4.2h avg response",
                points: "+28 points",
                color: "bg-[#94B3B1]"
            }
        ]
    };

    useEffect(() => {
        const fetchReputation = async () => {
            try {
                setLoading(true);
                const response = await getAuthorReputation();
                console.log(response);
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch reputation data:", error);
                // Fallback to mock data if API fails (500 error)
                setData(mockData);
                toast.error("Bakend error (500). Using demo data for now.");
            } finally {
                setLoading(false);
            }
        };

        fetchReputation();
    }, []);

    const breakdownIcons = {
        "Confirmed Sends": <ConfirmedSendsIcon size={32} />,
        "Timeliness": <TimelinessIcon size={32} />,
        "Missed Sends": <MissedSendsIcon size={32} />,
        "Communication": <CommunicationIcon size={32} />,
    };

    const badgeIcons = {
        "Verified Sender": <VerifiedSenderIcon size={32} />,
        "100% Reliability": <ReliabilityIcon size={32} />,
        "Top Swap Partner": <TopPartnerIcon size={32} />,
        "Fast Communicator": <FastCommunicatorIcon size={32} />,
    };

    const getBreakdown = () => {
        const breakdownData = data?.reputation_score_breakdown;
        if (!breakdownData) return [];

        const mapping = {
            confirmed_sends: { title: "Confirmed Sends", color: "bg-green-600" },
            timeliness: { title: "Timeliness", color: "bg-orange-200" },
            missed_sends: { title: "Missed Sends", color: "bg-red-600" },
            communication: { title: "Communication", color: "bg-[#94B3B1]" },
        };

        return Object.entries(breakdownData).map(([key, item]) => {
            const mapped = mapping[key] || { title: key, color: "bg-gray-400" };
            const percentage = item.max > 0 ? (item.score / item.max) * 100 : 0;

            return {
                title: mapped.title,
                score: `${item.score}/${item.max}`,
                percentage: percentage,
                subtext: item.description,
                points: item.points,
                icon: breakdownIcons[mapped.title] || <CommunicationIcon size={32} />,
                color: mapped.color
            };
        });
    };

    const getBadges = () => {
        const badgeData = data?.reputation_badges;
        if (!badgeData) return [];
        return badgeData.map(badge => ({
            title: badge.name,
            desc: badge.description,
            status: badge.status,
            icon: badgeIcons[badge.name] || <VerifiedSenderIcon size={32} />,
            statusColor: badge.status === "Locked" ? "bg-[#16A34A33] text-[#111827]" : "bg-[#16A34A33]"
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#2F6F6D] animate-spin" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                No reputation data available.
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="mb-8">
                <h1 className="text-2xl font-semibold">Author Reputation System</h1>
                <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">Automatic reliability scoring based on confirmed sends, timeliness, and performance</p>

                <div className="flex items-center gap-6 mt-5">
                    <div className="p-4 rounded-xl w-fit" style={{ background: "rgba(22, 163, 74, 0.2)", border: "1px solid rgba(181, 181, 181, 1)" }}>
                        <div className="text-center font-bold text-[#1F2937]">
                            <p className="text-xl font-medium">
                                {typeof data.reputation_score === 'object' ? data.reputation_score.score : (data.reputation_score || 0)}/100
                            </p>
                            <p className="text-[11px] font-normal text-[#111827] mt-0.5">Reputation Score</p>
                        </div>
                        {data.is_webhook_verified && (
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
                                <span className="text-[10px] font-medium text-[#16A34A]">Webhook Verified</span>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-xl overflow-hidden border border-[#B5B5B5]">
                <div className="p-5">
                    {/* Platform Ranking Banner */}
                    <div className="rounded-xl p-4 flex items-center gap-4 mb-4" style={{ background: "#FFF4F0", border: "1px solid rgba(181, 181, 181, 1)" }}>
                        <div className="w-10 h-10 rounded-full flex items-center justify-center font-normal text-xs" style={{ background: "#F59E0B" }}>
                            #{data.platform_ranking?.rank || "--"}
                        </div>
                        <div>
                            <h3 className="font-medium text-[15px]">Platform Ranking</h3>
                            <p className="text-xs mt-1">You're in the top {data.platform_ranking?.percentile || data.platform_ranking?.top_percentage || "--"}% of all authors based on reputation score</p>
                        </div>
                    </div>

                    {/* Reputation Badges Section */}
                    <section className="mb-10">
                        <h2 className="text-lg font-medium text-[#111827] mb-5 pb-2 border-b border-[#B5B5B5]">Reputation Badges</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                            {getBadges().map((badge, idx) => (
                                <div key={idx} className="rounded-[10px] py-3.5 px-5 flex flex-col items-center text-center transition-all h-full justify-between border border-[#B5B5B5]">
                                    <div className="mb-2">
                                        {badge.icon}
                                    </div>
                                    <div className="mb-2.5">
                                        <h3 className="font-medium text-[#1F2937] text-[14px] mb-0.5">{badge.title}</h3>
                                        <p className="text-[10px] text-gray-500 leading-tight">{badge.desc || badge.description}</p>
                                    </div>
                                    <div className={`flex items-center gap-1 px-4 py-1 rounded-full ${badge.statusColor}`}>
                                        <Check size={11} />
                                        <span className="text-[10px] font-normal">{badge.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Reputation Score Breakdown Section */}
                    <section>
                        <h2 className="text-lg font-medium text-[#111827] mb-5 pb-2" style={{ borderBottom: "1px solid rgba(181, 181, 181, 1)" }}>Reputation Score Breakdown</h2>
                        <div className="space-y-4">
                            {getBreakdown().map((item, idx) => (
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
