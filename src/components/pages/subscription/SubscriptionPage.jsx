import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Check, Rocket, Crown, ArrowRight, Loader2 } from "lucide-react";
import AnalyticsPage from "./AnalyticsPage";
import { getSubscriberVerification, connectMailerlite } from "../../../apis/subscription";
import toast from "react-hot-toast";



// Dummy Data (API se replace hoga later)
const currentPlan = {
    name: "Tier 1",
    price: 9.99,
    renewalDate: "February 12, 2026",
    activeUntil: "February 12, 2026",
};

const tiers = [
    {
        id: 1,
        name: "TIER 1",
        price: 9.99,
        subtitle: "Swap Only",
        description:
            "Perfect for authors who only do newsletter swaps.",
        popular: false,
        placements: "No paid placements",
        bestFor:
            "Best for: Authors growing their audience or promoting their books through swaps only.",
        primaryCta: "Get Started",
        secondaryCta: null,
    },
    {
        id: 2,
        name: "TIER 2",
        price: 28.99,
        subtitle: "Starter",
        description:
            "For authors who sell occasional paid newsletter placements.",
        popular: true,
        placements: "Up to 10 paid placements/month",
        bestFor:
            "Best for: Authors selling a few paid spots per week.",
        primaryCta: "Upgrade to Tier 2",
        secondaryCta: "Buy Additional placements",
    },
    {
        id: 3,
        name: "TIER 3",
        price: 48.99,
        subtitle: "Growth",
        description:
            "For authors who sell paid placements consistently.",
        popular: false,
        placements: "Up to 30 paid placements/month",
        bestFor:
            "Best for: Authors monetizing their newsletter regularly.",
        primaryCta: "Upgrade to Tier 3",
        secondaryCta: "Buy Additional placements",
    },
    {
        id: 4,
        name: "TIER 4",
        price: 78.99,
        subtitle: "Professional",
        description:
            "For high-volume sellers running paid placements most days.",
        popular: false,
        placements: "Unlimited placements",
        bestFor:
            "Best for: Authors selling paid placements daily or near-daily.",
        primaryCta: "Go Premium",
        secondaryCta: null,
    },
];

export default function SubscriptionPage() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("subscription");
    const [verification, setVerification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showConnect, setShowConnect] = useState(false);
    const [apiKey, setApiKey] = useState("");
    const [connecting, setConnecting] = useState(false);

    const fetchVerification = async () => {
        try {
            setLoading(true);
            const res = await getSubscriberVerification();
            setVerification(res.data);
        } catch (error) {
            console.error("Failed to fetch verification status", error);
        } finally {
            setLoading(false);
        }
    };

    const handleConnect = async () => {
        if (!apiKey) {
            toast.error("Please enter an API key");
            return;
        }
        try {
            setConnecting(true);
            await connectMailerlite({ api_key: apiKey });
            toast.success("Connected to MailerLite successfully");
            setShowConnect(false);
            fetchVerification();
        } catch (error) {
            console.error("Connection failed", error);
            toast.error("Failed to connect to MailerLite");
        } finally {
            setConnecting(false);
        }
    };

    useEffect(() => {
        fetchVerification();
    }, []);

    if (activeTab === "analytics") {
        return <AnalyticsPage />;
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#2F6F6D] animate-spin" />
            </div>
        );
    }

    const verifDetails = verification?.verification || {};
    const isConnected = verifDetails.is_connected_mailerlite || false;
    const lastSynced = verifDetails.last_verified_at || "Never";


    return (
        <div className="min-h-screen">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-[#2F6F6D] transition-all mb-4 group cursor-pointer"
                    >
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-[#2F6F6D] group-hover:bg-[#2F6F6D0D] transition-all">
                            <IoChevronBack className="text-lg transition-transform group-hover:-translate-x-0.5" />
                        </div>
                        <span className="text-sm font-medium">Back</span>
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Subscriber Verification & Analytics
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">
                            Request, manage, and track newsletter partnerships
                        </p>
                        {isConnected ? (
                            <span className="inline-flex items-center gap-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                Connected to MailerLite
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                Disconnected
                            </span>
                        )}
                    </div>
                </div>

                {/* MailerLite Connection Section */}
                {!isConnected ? (
                    <div className="mb-8 p-6 bg-white border border-[#B5B5B5] rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h3 className="text-lg font-semibold text-[#111827]">Connect MailerLite</h3>
                                <p className="text-sm text-[#374151]">Your newsletter must be connected to verify swaps and view analytics.</p>
                            </div>
                            {!showConnect && (
                                <button
                                    onClick={() => setShowConnect(true)}
                                    className="bg-[#2F6F6D] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-opacity-90 transition-all"
                                >
                                    Connect Now
                                </button>
                            )}
                        </div>

                        {showConnect && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                <label className="block text-sm font-medium text-gray-700 mb-2">MailerLite API Key</label>
                                <div className="flex gap-3">
                                    <input
                                        type="password"
                                        value={apiKey}
                                        onChange={(e) => setApiKey(e.target.value)}
                                        placeholder="Paste your API Key here"
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-[#2F6F6D] outline-none"
                                    />
                                    <button
                                        onClick={handleConnect}
                                        disabled={connecting}
                                        className="bg-[#2F6F6D] text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                                    >
                                        {connecting ? "Connecting..." : "Confirm"}
                                    </button>
                                    <button
                                        onClick={() => setShowConnect(false)}
                                        className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <p className="mt-2 text-[11px] text-gray-500">
                                    Last synced: {lastSynced}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                                <Check size={18} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-emerald-900">Successfully connected to MailerLite</p>
                                <p className="text-xs text-emerald-700">Last verified: {lastSynced}</p>
                            </div>
                        </div>
                        <button
                            onClick={fetchVerification}
                            className="text-[#2F6F6D] text-sm font-medium hover:underline flex items-center gap-1"
                        >
                            Refresh Status
                        </button>
                    </div>
                )}

                {/* Tabs */}
                <div>
                    {/* Tabs (only shown inside Subscription view) */}
                    <div className="flex gap-2 mb-6 bg-white border border-[#2F6F6D] p-1 rounded-lg w-fit ">
                        <button
                            onClick={() => setActiveTab("subscription")}
                            className="px-4 py-2 text-sm rounded-md bg-[#2F6F6D] text-white cursor-pointer"
                        >
                            Subscription
                        </button>

                        <button
                            onClick={() => setActiveTab("analytics")}
                            className="px-4 py-2 text-sm rounded-md text-gray-700 cursor-pointer"
                        >
                            Analytics
                        </button>
                    </div>
                </div>

                {/* Current Plan */}
                <div className="bg-white border border-[#B5B5B5] rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-lg font-semibold text-[#111827]">Your Current Plan</p>
                            <p className="text-xs text-[#374151] mt-1">
                                Active until {currentPlan.activeUntil}
                            </p>
                            <p className="text-lg font-semibold mt-3">
                                ${currentPlan.price} / month
                            </p>
                            <p className="text-xs text-[#374151]">
                                Renews on {currentPlan.renewalDate}
                            </p>
                        </div>
                        <span className="text-xs bg-[#2F6F6D] text-white px-3 py-1 rounded-full">
                            {currentPlan.name}
                        </span>
                    </div>
                </div>

                {/* Info Box */}
                <div className="bg-white border border-[#B5B5B5] rounded-lg p-4 mb-8">
                    <p className="text-lg font-semibold text-[#111827] mb-2">
                        What’s a paid placement?
                    </p>
                    <p className="text-sm text-[#374151]">
                        One paid placement equals one paid booking for a specific newsletter send
                        date.
                    </p>
                    <p className="text-sm text-[#374151]">
                        Newsletter swaps are always unlimited and DO NOT count toward paid placement limits.
                    </p>
                </div>

                <h2 className="text-center text-[#111827] text-[25px] font-semibold mb-8">
                    Choose Your Membership
                </h2>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`bg-white rounded-xl border p-6 flex flex-col justify-between ${tier.popular
                                ? "border-[#2F6F6D] shadow-md"
                                : "border-gray-300"
                                }`}
                        >
                            <div>
                                <div className="text-center mb-5">
                                    <div className="relative flex items-center justify-center">
                                        <h3 className="font-bold text-3xl tracking-wide mt-2">
                                            {tier.name}
                                        </h3>

                                        {tier.popular && (
                                            <span className="absolute right-0 -top-2 text-[9px] bg-[#2F6F6D] text-white px-3 py-1 right-[-18px] rounded-full">
                                                MOST POPULAR
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-5 flex items-end justify-center gap-1">
                                        <span className="text-lg font-medium">$</span>
                                        <span className="text-3xl font-bold leading-none">
                                            {tier.price}
                                        </span>
                                        <span className="text-sm text-gray-500 mb-1">/ month</span>
                                    </div>

                                    <p className="text-base text-gray-600 mt-3">
                                        {tier.subtitle}
                                    </p>
                                </div>


                                <hr className="text-[#B5B5B5] my-5" />

                                <p className="text-xs text-gray-600 mb-3">
                                    {tier.description}
                                </p>

                                <ul className="text-xs text-gray-700 space-y-3">
                                    {[
                                        "Unlimited newsletter swaps",
                                        tier.placements,
                                        "Automatic send verification",
                                        "No commissions — authors keep 100%",
                                    ].map((item, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="mt-0.5">
                                                <Check className="w-4 h-4 text-green-600 stroke-[3]" />
                                            </span>
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>



                                <p className="text-[11px] text-gray-500 mt-4">
                                    {tier.bestFor}
                                </p>
                            </div>

                            <div className="mt-6 space-y-2">
                                {tier.secondaryCta && (
                                    <button className="w-full text-xs border border-gray-300 rounded-md py-2 bg-white hover:bg-gray-50 flex items-center justify-center gap-2">
                                        {tier.secondaryCta}
                                    </button>
                                )}

                                <button
                                    className={`w-full text-xs rounded-md py-3 font-medium flex items-center justify-center gap-2
    ${tier.popular
                                            ? "text-white bg-gradient-to-b from-[#2F6F6D] to-[#16A34A] hover:opacity-90"
                                            : "bg-gray-100 hover:bg-gray-200 text-[#111827]"
                                        }`}
                                >
                                    {/* Show Rocket for popular */}
                                    {tier.popular && <Rocket size={14} className="opacity-90" />}

                                    {/* Show Crown for Tier 4 */}
                                    {tier.name === "TIER 4" && <Crown size={14} />}

                                    {tier.primaryCta}

                                    <ArrowRight
                                        size={14}
                                        className={tier.popular ? "opacity-90" : "text-gray-600"}
                                    />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div className="bg-white border border-gray-300 rounded-lg p-6 mt-12 text-xs text-gray-600 space-y-1">
                    <h3 className="text-lg font-semibold text-[#111827] mb-2">What You Get With Every Plan</h3>
                    <p>• Newsletter swaps are always unlimited.</p>
                    <p>• Paid placements reset monthly.</p>
                    <p>• Add-on placements do not roll over.</p>
                    <p>• All plans include access to human support (higher tiers receive faster response times).</p>
                    <p>• No commissions — authors keep 100% of placement revenue.</p>
                </div>
            </div>
        </div>
    );
}