import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Check, Rocket, Crown, ArrowRight, Loader2 } from "lucide-react";
import AnalyticsPage from "./AnalyticsPage";
import { getSubscriberVerification, createCheckoutSession, changePlan, changePlanPreview, getPaymentMethods } from "../../../apis/subscription";
import toast from "react-hot-toast";
import { useProfile } from "../../../context/ProfileContext";



// Dummy data removed, using API response instead

export default function SubscriptionPage() {
    const navigate = useNavigate();
    const { refreshProfile } = useProfile();

    const [activeTab, setActiveTab] = useState("subscription");
    const [verification, setVerification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [previewData, setPreviewData] = useState(null);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [selectedTier, setSelectedTier] = useState(null);

    const fetchVerification = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            const res = await getSubscriberVerification();
            console.log("Verification Data:", res.data);
            setVerification(res.data);
        } catch (error) {
            console.error("Failed to fetch verification status", error);
        } finally {
            if (showLoader) setLoading(false);
        }
    };


    useEffect(() => {
        fetchVerification();
    }, []);

    const handleSubscribe = async (tier) => {
        try {
            setProcessingId(tier.id);
            setSelectedTier(tier);

            // 1. Frontend Safety Check

            const isCurrent = subscription?.tier?.toString() === tier.id?.toString();
            if (isCurrent) {
                toast.error("You are already on this plan.");
                return;
            }

            if (subscription) {
                // Existing subscriber — check for saved payment methods
                const pmRes = await getPaymentMethods();
                console.log("PaymentMethods API response:", pmRes.data);

                // Handle different response shapes for payment methods
                // const methods = Array.isArray(pmRes.data)
                //     ? pmRes.data
                //     : Array.isArray(pmRes.data?.data)
                //         ? pmRes.data.data
                //         : [];

                // const hasCard = methods.length > 0;

                const methods = pmRes.data?.data || pmRes.data || [];
                const hasCard = methods.length > 0;

                if (!hasCard) {
                    // No card on file → MUST redirect to Stripe Checkout to collect payment
                    const res = await createCheckoutSession({ tier_id: tier.id });

                    if (res.data.url || res.data.checkout_url) {
                        // Good: backend gave us a payment page URL
                        window.location.href = res.data.url || res.data.checkout_url;
                        return;
                    }

                    // Backend upgraded without a checkout URL — send user to add card first
                    toast("Please add a payment card to upgrade your plan.", { icon: "💳" });
                    navigate("/account-settings");
                    return;
                }

                // Has card → fetch preview and show modal
                const res = await changePlanPreview({ tier_id: tier.id });
                setPreviewData(res.data);
                setShowPreviewModal(true);
                // changePlan is NOT called here — only called on modal confirm

            } else {
                // New subscriber (no subscription at all) → Stripe Checkout
                const res = await createCheckoutSession({ tier_id: tier.id });
                if (res.data.url || res.data.checkout_url) {
                    window.location.href = res.data.url || res.data.checkout_url;
                } else {
                    // Same safeguard: send user to add card
                    toast("Please add a payment card to upgrade your plan.", { icon: "💳" });
                    navigate("/account-settings");
                }
            }
        } catch (error) {
            console.error("Subscription Action Error:", error);
            const backendError = error.response?.data?.error || error.response?.data?.detail;
            const errorMsg = backendError
                ? `Server: ${backendError}`
                : "Something went wrong. Please try again.";
            toast.error(errorMsg);
        } finally {
            setProcessingId(null);
        }
    };

    const handleConfirmChange = async () => {
        if (!selectedTier) return;
        try {
            setConfirmLoading(true);
            const res = await changePlan({ tier_id: selectedTier.id.toString() });

            if (res.data.url) {
                window.location.href = res.data.url;
            } else {
                toast.success(res.data.message || "Plan updated successfully!");
                setShowPreviewModal(false);
                fetchVerification(false);
                if (refreshProfile) refreshProfile();
            }
        } catch (error) {
            console.error("Confirmation error:", error);
            toast.error(error.response?.data?.error || "Failed to update plan.");
        } finally {
            setConfirmLoading(false);
        }
    };

    const verifDetails = verification?.verification || {};
    const subscription = verification?.subscription || null;
    const tiers = verification?.available_tiers || [];
    const isConnected = verifDetails.is_connected_mailerlite || false;
    const lastSynced = verifDetails.last_verified_at || "Never";
    console.log("Current Subscription Object:", subscription);
    const getPrimaryCta = (tier) => {
        const isCurrent = subscription?.tier?.toString() === tier.id?.toString();
        if (isCurrent) return "Current Plan";
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
                        {/* Current Plan */}
                        {subscription && (
                            <div className="bg-white border border-[#B5B5B5] rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-md font-medium text-[#111827]">Your Current Plan</p>
                                        <p className="text-sm text-[#374151] mt-1">
                                            Status: <span className={`capitalize font-semibold ${subscription.is_active ? "text-green-600" : "text-amber-500"}`}>
                                                {subscription.is_active ? "Active" : "Processing"}
                                            </span>
                                        </p>
                                        <p className="text-md font-medium mt-3">
                                            ${subscription.tier_details?.price || "0.00"} / month
                                        </p>
                                        <div className="space-y-0.5 mt-1">
                                            <p className="text-xs text-[#374151]">
                                                Next renewal: {subscription.renew_date ? new Date(subscription.renew_date).toLocaleDateString() : "N/A"}
                                            </p>
                                            <p className="text-xs text-[#374151]">
                                                Last verification: {lastSynced !== "Never" ? new Date(lastSynced).toLocaleDateString() : "Never"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs bg-[#2F6F6D] text-white px-3 py-1 rounded-full font-medium">
                                        {subscription.tier_details?.name || "Member"}
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
                                // Robust comparison (handling potential string/number mismatches)
                                const isCurrent = subscription?.tier?.toString() === tier.id?.toString();
                                console.log(`Comparing sub.tier (${subscription?.tier}) with tier.id (${tier.id}) -> Result:`, isCurrent);

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
                                            className={`w-full text-xs rounded-md py-3 font-medium flex items-center justify-center gap-2 mt-5
                                                    ${isCurrent
                                                    ? "text-white bg-gradient-to-b from-[#2F6F6D] to-[#16A34A] cursor-not-allowed shadow-inner"
                                                    : tier.is_most_popular
                                                        ? "text-white bg-gradient-to-b from-[#2F6F6D] to-[#16A34A] hover:opacity-90 shadow-md"
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

            {/* Plan Change Preview Modal */}
            {showPreviewModal && previewData && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPreviewModal(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in duration-300">
                        {/* Header */}
                        <div className="bg-[#2F6F6D] px-6 py-4 flex items-center justify-between">
                            <h3 className="text-white font-bold text-lg">Confirm Plan Change</h3>
                            <button onClick={() => setShowPreviewModal(false)} className="text-white/80 hover:text-white">
                                <Rocket size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold">Current Plan</label>
                                    <p className="text-sm font-medium text-gray-900 border-l-4 border-gray-200 pl-3 py-1">
                                        {previewData.current_plan}
                                    </p>
                                </div>
                                <div className="flex justify-center">
                                    <ArrowRight className="text-[#2F6F6D] animate-pulse" size={24} />
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase tracking-wider text-[#2F6F6D] font-bold">New Plan</label>
                                    <p className="text-sm font-bold text-[#2F6F6D] border-l-4 border-[#2F6F6D] pl-3 py-1">
                                        {previewData.new_plan}
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-600">Amount Due Now</span>
                                    <span className="font-bold text-gray-900 text-lg">{previewData.amount_due_display}</span>
                                </div>
                                <div className="border-t border-gray-200 pt-3 space-y-1">
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-gray-500">Billing period end</span>
                                        <span className="text-gray-700 font-medium">{new Date(previewData.billing_period_end).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px]">
                                        <span className="text-gray-500">Proration date</span>
                                        <span className="text-gray-700 font-medium">{new Date(previewData.proration_date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-400 text-center leading-relaxed">
                                By clicking "Change Now," your new plan will be activated immediately.
                                The amount due account for the remaining time on your current plan.
                            </p>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50 flex gap-3">
                            <button
                                onClick={() => setShowPreviewModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmChange}
                                disabled={confirmLoading}
                                className="flex-1 px-4 py-2.5 rounded-xl bg-[#2F6F6D] text-white text-sm font-semibold hover:bg-[#255755] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2F6F6D]/20 disabled:opacity-50"
                            >
                                {confirmLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Change Now
                                        <Rocket size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}