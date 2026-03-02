import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Check, Rocket, Crown, ArrowRight, Loader2 } from "lucide-react";
import AnalyticsPage from "./AnalyticsPage";
import { getSubscriberVerification, createCheckoutSession } from "../../../apis/subscription";
import toast from "react-hot-toast";



// Dummy data removed, using API response instead

export default function SubscriptionPage() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("subscription");
    const [verification, setVerification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

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


    useEffect(() => {
        fetchVerification();
    }, []);

    const handleSubscribe = async (tier) => {
        try {
            setProcessingId(tier.id);
            // Calling stripe/create-checkout-session/ with the selected tier
            const res = await createCheckoutSession({ tier_id: tier.id.toString() });

            if (res.data.url) {
                // Redirecting to Stripe Checkout
                window.location.href = res.data.url;
            } else {
                toast.error("Failed to initiate payment session. Please try again.");
            }
        } catch (error) {
            console.error("Checkout error:", error);
            const errorMsg = error.response?.data?.error || "Something went wrong. Please try again later.";
            toast.error(errorMsg);
        } finally {
            setProcessingId(null);
        }
    };

    const verifDetails = verification?.verification || {};
    const subscription = verification?.subscription || null;
    const tiers = verification?.available_tiers || [];
    const isConnected = verifDetails.is_connected_mailerlite || false;
    const lastSynced = verifDetails.last_verified_at || "Never";

    const getPrimaryCta = (tier) => {
        if (subscription?.tier_id === tier.id) return "Current Plan";
        if (!subscription) return "Get Started";
        return `Upgrade to ${tier.name}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#2F6F6D] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">
                        {activeTab === "subscription" ? "Subscriber Verification & Analytics" : "Subscriber Analytics"}
                    </h1>
                    <div className="flex items-center gap-2">
                        <p className="text-[12px] md:text-[13px] text-[#374151] font-medium mt-0.5">
                            {activeTab === "subscription"
                                ? "Request, manage, and track newsletter partnerships"
                                : "Track your newsletter growth, engagement, and campaign performance"}
                        </p>
                        {isConnected && activeTab === "subscription" && (
                            <span className="inline-flex items-center gap-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                Connected to MailerLite
                            </span>
                        )}
                        {!isConnected && activeTab === "subscription" && (
                            <span className="inline-flex items-center gap-2 text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full">
                                <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                Disconnected
                            </span>
                        )}
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 bg-white border border-[#2F6F6D] p-1 rounded-lg w-fit ">
                    <button
                        onClick={() => setActiveTab("subscription")}
                        className={`px-4 py-2 text-sm rounded-md cursor-pointer transition-all ${activeTab === "subscription" ? "bg-[#2F6F6D] text-white" : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Subscription
                    </button>

                    <button
                        onClick={() => setActiveTab("analytics")}
                        className={`px-4 py-2 text-sm rounded-md cursor-pointer transition-all ${activeTab === "analytics" ? "bg-[#2F6F6D] text-white" : "text-gray-700 hover:bg-gray-100"
                            }`}
                    >
                        Analytics
                    </button>
                </div>

                {activeTab === "subscription" ? (
                    <>
                        {/* MailerLite Connection Section */}




                        {/* Current Plan */}
                        {subscription && (
                            <div className="bg-white border border-[#B5B5B5] rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-md font-medium text-[#111827]">Your Current Plan</p>
                                        <p className="text-sm text-[#374151] mt-1">
                                            Status: <span className="capitalize">{subscription.status || "Active"}</span>
                                        </p>
                                        <p className="text-md font-medium mt-3">
                                            ${subscription.tier?.price || "0.00"} / month
                                        </p>
                                        <p className="text-sm text-[#374151]">
                                            Last verification: {lastSynced !== "Never" ? new Date(lastSynced).toLocaleDateString() : "Never"}
                                        </p>
                                    </div>
                                    <span className="text-xs bg-[#2F6F6D] text-white px-3 py-1 rounded-full">
                                        {subscription.tier?.name || "Member"}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="bg-white border border-[#B5B5B5] rounded-lg p-4 mb-8">
                            <p className="text-md font-medium text-[#111827] mb-2">
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
                            {tiers.map((tier) => {
                                const isCurrent = subscription?.tier_id === tier.id;
                                return (
                                    <div
                                        key={tier.id}
                                        className={`bg-white rounded-xl border p-6 flex flex-col justify-between ${tier.is_most_popular || isCurrent
                                            ? "border-[#2F6F6D] shadow-md"
                                            : "border-gray-300"
                                            }`}
                                    >
                                        <div>
                                            <div className="text-center mb-5">
                                                <div className="relative flex items-center justify-center">
                                                    <h3 className="font-bold text-3xl tracking-wide mt-2">
                                                        {tier.name.toUpperCase()}
                                                    </h3>

                                                    {tier.is_most_popular && (
                                                        <span className="absolute right-[-18px] top-[-8px] text-[9px] bg-[#2F6F6D] text-white px-3 py-1 rounded-full">
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
                                                    {tier.label}
                                                </p>
                                            </div>


                                            <hr className="text-[#B5B5B5] my-5" />

                                            <p className="text-xs text-gray-600 mb-3">
                                                {tier.best_for}
                                            </p>

                                            <ul className="text-xs text-gray-700 space-y-3">
                                                {tier.features.map((feature, index) => (
                                                    <li key={index} className="flex items-start gap-2">
                                                        <span className="mt-0.5">
                                                            <Check className="w-4 h-4 text-green-600 stroke-[3]" />
                                                        </span>
                                                        <span>{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <button
                                            disabled={isCurrent || processingId !== null}
                                            onClick={() => handleSubscribe(tier)}
                                            className={`w-full text-xs rounded-md py-3 font-medium flex items-center justify-center gap-2
                                                    ${isCurrent
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                                                    : tier.is_most_popular
                                                        ? "text-white bg-gradient-to-b from-[#2F6F6D] to-[#16A34A] hover:opacity-90"
                                                        : "bg-gray-100 hover:bg-gray-200 text-[#111827]"
                                                }`}
                                        >
                                            {processingId === tier.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    {/* Show Rocket for popular */}
                                                    {(tier.is_most_popular && !isCurrent) && <Rocket size={14} className="opacity-90" />}

                                                    {/* Show Crown for Tier 4 */}
                                                    {(tier.name.toUpperCase() === "TIER 4" && !isCurrent) && <Crown size={14} />}

                                                    {isCurrent ? "Active Plan" : getPrimaryCta(tier)}

                                                    {!isCurrent && (
                                                        <ArrowRight
                                                            size={14}
                                                            className={tier.is_most_popular ? "opacity-90" : "text-gray-600"}
                                                        />
                                                    )}
                                                </>
                                            )}
                                        </button>

                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        <div className="bg-white border border-gray-300 rounded-lg p-4 mt-12 text-xs text-gray-600 space-y-1">
                            <h3 className="text-md font-medium text-[#111827] mb-2">What You Get With Every Plan</h3>
                            <p>• Newsletter swaps are always unlimited.</p>
                            <p>• Paid placements reset monthly.</p>
                            <p>• Add-on placements do not roll over.</p>
                            <p>• All plans include access to human support (higher tiers receive faster response times).</p>
                        </div>
                    </>
                ) : (
                    <AnalyticsPage isChildView={true} />
                )}
            </div>
        </div>
    );
}
