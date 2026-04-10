import { IoChevronBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Check, Rocket, Crown, ArrowRight, Loader2 } from "lucide-react";
import AnalyticsPage from "./AnalyticsPage";
import { getSubscriberVerification, createCheckoutSession, changePlanPreview, getPaymentMethods, manualUpgrade } from "../../../apis/subscription";
import { directPayment } from "../../../apis/wallet";
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

    // Payment confirmation modal state
    const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);
    const [defaultCard, setDefaultCard] = useState(null);
    const [fetchingCard, setFetchingCard] = useState(false);

    // Additional placements modal state
    const [showAdditionalPlacementsModal, setShowAdditionalPlacementsModal] = useState(false);
    const [selectedPlacementOption, setSelectedPlacementOption] = useState(null);
    const [processingPlacement, setProcessingPlacement] = useState(false);

    // Payment method modal state for additional placements
    const [showPlacementPaymentModal, setShowPlacementPaymentModal] = useState(false);
    const [placementPaymentLoading, setPlacementPaymentLoading] = useState(null);

    const fetchVerification = async (showLoader = true) => {
        try {
            if (showLoader) setLoading(true);
            const res = await getSubscriberVerification();
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

            const isCurrent = subscription?.tier?.toString() === tier.id?.toString();
            if (isCurrent) {
                toast.error("You are already on this plan.");
                return;
            }

            // IF it is an upgrade (subscription exists), use preview first as requested
            if (subscription) {
                const res = await changePlanPreview({ tier_id: tier.id });
                setPreviewData(res.data);
                setShowPreviewModal(true);
                return;
            }

            // New subscriber logic
            const res = await createCheckoutSession({ tier_id: tier.id });
            if (res.data.url || res.data.checkout_url) {
                window.location.href = res.data.url || res.data.checkout_url;
            } else {
                toast("Please add a payment card to upgrade your plan.", { icon: "💳" });
                navigate("/account-settings");
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

    // Step 1 — "Upgrade Now" clicked inside preview modal:
    // Fetch the user's default card, then either redirect or open the confirmation modal.
    const handleConfirmChange = async () => {
        if (!selectedTier) return;
        try {
            setFetchingCard(true);
            const res = await getPaymentMethods();
            const methods = res.data || [];
            const found = methods.find((pm) => pm.is_default);

            if (!found) {
                // No default card — send to Stripe checkout so they can add a card and pay
                const checkoutRes = await createCheckoutSession({ tier_id: selectedTier.id.toString() });
                const url = checkoutRes.data?.url || checkoutRes.data?.checkout_url;
                if (url) {
                    window.location.href = url;
                } else {
                    toast.error("Could not start checkout. Please try again.");
                }
                return;
            }

            setDefaultCard(found);
            setShowPreviewModal(false);
            setShowPaymentConfirmModal(true);
        } catch (error) {
            console.error("Failed to fetch payment methods:", error);
            toast.error("Could not retrieve payment methods. Please try again.");
        } finally {
            setFetchingCard(false);
        }
    };

    // Step 2 — "Yes, Continue" clicked inside the confirmation modal:
    // Actually call manualUpgrade and handle the result.
    const handleProceedUpgrade = async () => {
        if (!selectedTier) return;
        try {
            setConfirmLoading(true);
            const res = await manualUpgrade({ tier_id: selectedTier.id.toString() });

            if (res.data.url || res.data.checkout_url) {
                window.location.href = res.data.url || res.data.checkout_url;
            } else {
                toast.success(res.data.message || "Plan updated successfully!");
                setShowPaymentConfirmModal(false);
                fetchVerification(false);
                if (refreshProfile) refreshProfile();
            }
        } catch (error) {
            console.error("Upgrade error:", error);
            const errMsg = error.response?.data?.error || error.response?.data?.detail || "Failed to update plan.";
            toast.error(errMsg);
        } finally {
            setConfirmLoading(false);
        }
    };

    const handleManualUpgrade = () => {
        const tiersSection = document.getElementById("membership-tiers");
        if (tiersSection) {
            tiersSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    const verifDetails = verification?.verification || {};
    const subscription = verification?.subscription || null;
    const tiers = verification?.available_tiers || [];
    const isConnected = verifDetails.is_connected_mailerlite || false;
    const lastSynced = verifDetails.last_verified_at || "Never";
    const getPrimaryCta = (tier) => {
        const isCurrent = subscription?.tier?.toString() === tier.id?.toString();
        if (isCurrent) return "Current Plan";
        if (!subscription) return "Get Started";
        
        // Check if this is an upgrade or downgrade
        const currentTierId = parseInt(subscription?.tier);
        const targetTierId = parseInt(tier.id);
        
        if (targetTierId > currentTierId) {
            return `Upgrade to ${tier.name}`;
        } else if (targetTierId < currentTierId) {
            return `Downgrade to ${tier.name}`;
        } else {
            return `Change to ${tier.name}`;
        }
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
                                    <div className="flex flex-col items-end gap-3">
                                        <span className="text-xs bg-[#2F6F6D] text-white px-3 py-1 rounded-full font-medium">
                                            {subscription.tier_details?.name || "Member"}
                                        </span>
                                        {/* <button
                                            onClick={handleManualUpgrade}
                                            className="text-xs bg-white border border-[#2F6F6D] text-[#2F6F6D] px-4 py-2 rounded-lg font-semibold hover:bg-[#2F6F6D] hover:text-white transition-all shadow-sm flex items-center gap-2 group"
                                        >
                                            Upgrade Plan
                                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </button> */}
                                    </div>
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

                        <h2 id="membership-tiers" className="text-center text-[#111827] text-[25px] font-semibold mb-8">
                            Choose Your Membership
                        </h2>

                        {/* Pricing Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {tiers.map((tier) => {
                                // Robust comparison (handling potential string/number mismatches)
                                const isCurrent = subscription?.tier?.toString() === tier.id?.toString();

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

                        {/* Additional Placements Section */}
                        <div className="bg-white border border-[#B5B5B5] rounded-lg p-6 mt-8">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-md font-medium text-[#111827] mb-1">Need More Placements?</h3>
                                    <p className="text-sm text-[#374151]">
                                        Purchase additional paid placements without upgrading your plan.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowAdditionalPlacementsModal(true)}
                                    className="px-5 py-2.5 bg-[#2F6F6D] text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                                >
                                    Request Additional Features
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-white border border-gray-300 rounded-lg p-4 mt-6 text-xs text-gray-600 space-y-1">
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
                <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-[100]">
                    <div className="bg-white w-[500px] rounded-[10px] shadow-xl overflow-hidden m-5">
                        <div className="p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">
                                        Confirm Plan Change
                                    </h2>
                                    <p className="text-[13px] text-gray-500 mt-0.5">
                                        Review the details of your plan {previewData.is_upgrade ? "upgrade" : "downgrade"}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowPreviewModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Content */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-[#B5B5B5]/20">
                                        <div className="flex-1">
                                            <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold block mb-1">Current Plan</label>
                                            <p className="text-sm font-medium text-gray-900">
                                                {previewData.current_plan}
                                            </p>
                                        </div>
                                        <div className="px-4 text-[#2F6F6D]">
                                            <ArrowRight size={20} />
                                        </div>
                                        <div className="flex-1 text-right">
                                            <label className="text-[10px] uppercase tracking-wider text-[#2F6F6D] font-bold block mb-1">New Plan</label>
                                            <p className="text-sm font-bold text-[#2F6F6D]">
                                                {previewData.new_plan}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border border-[#B5B5B5] rounded-xl p-5 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Amount Due Now</span>
                                        <span className="font-bold text-[#2F6F6D] text-2xl">{previewData.amount_due_display}</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-3 space-y-2">
                                        <div className="flex justify-between text-[12px]">
                                            <span className="text-gray-500">Billing period end</span>
                                            <span className="text-gray-700 font-medium">{new Date(previewData.billing_period_end).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-[12px]">
                                            <span className="text-gray-500">Proration date</span>
                                            <span className="text-gray-700 font-medium">{new Date(previewData.proration_date).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                                    By clicking "Change Now," your new plan will be activated immediately.
                                    The amount due accounts for the remaining time on your current plan.
                                </p>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setShowPreviewModal(false)}
                                    className="px-5 py-2 text-[13px] rounded-lg border text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleConfirmChange}
                                    disabled={confirmLoading || fetchingCard}
                                    className="px-6 py-2 text-[13px] rounded-lg bg-[#2F6F6D] text-white hover:opacity-90 transition shadow-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    {(confirmLoading || fetchingCard) ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <>
                                            Change Plan Now
                                            <Rocket size={14} />

                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* ── Additional Placements Modal ── */}
            {showAdditionalPlacementsModal && (
                <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-[110]">
                    <div className="bg-white w-[440px] rounded-[10px] shadow-xl overflow-hidden m-5">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-5">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Additional Placements</h2>
                                    <p className="text-[13px] text-gray-500 mt-0.5">Select the number of extra placements you need</p>
                                </div>
                                <button
                                    onClick={() => {
                                        setShowAdditionalPlacementsModal(false);
                                        setSelectedPlacementOption(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Options */}
                            <div className="space-y-3 mb-6">
                                <label
                                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedPlacementOption === '15'
                                            ? 'border-[#2F6F6D] bg-[#2F6F6D]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="placementOption"
                                            value="15"
                                            checked={selectedPlacementOption === '15'}
                                            onChange={(e) => setSelectedPlacementOption(e.target.value)}
                                            className="w-4 h-4 text-[#2F6F6D] accent-[#2F6F6D]"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">15 Additional Placements</p>
                                            <p className="text-xs text-gray-500">One-time purchase</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-[#2F6F6D]">$15</span>
                                </label>

                                <label
                                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                        selectedPlacementOption === '25'
                                            ? 'border-[#2F6F6D] bg-[#2F6F6D]/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="radio"
                                            name="placementOption"
                                            value="25"
                                            checked={selectedPlacementOption === '25'}
                                            onChange={(e) => setSelectedPlacementOption(e.target.value)}
                                            className="w-4 h-4 text-[#2F6F6D] accent-[#2F6F6D]"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">25 Additional Placements</p>
                                            <p className="text-xs text-gray-500">One-time purchase</p>
                                        </div>
                                    </div>
                                    <span className="text-lg font-bold text-[#2F6F6D]">$25</span>
                                </label>
                            </div>

                            {/* Note */}
                            <p className="text-[11px] text-gray-400 text-center mb-5">
                                Additional placements will be added to your account immediately after purchase.
                                They do not roll over to the next billing period.
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowAdditionalPlacementsModal(false);
                                        setSelectedPlacementOption(null);
                                    }}
                                    className="flex-1 px-4 py-2.5 text-[13px] rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        if (!selectedPlacementOption) {
                                            toast.error("Please select an option");
                                            return;
                                        }
                                        setShowAdditionalPlacementsModal(false);
                                        setShowPlacementPaymentModal(true);
                                    }}
                                    disabled={!selectedPlacementOption}
                                    className="flex-1 px-4 py-2.5 text-[13px] rounded-lg bg-[#2F6F6D] text-white font-medium hover:opacity-90 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    Proceed
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Additional Placements Payment Method Modal ── */}
            {showPlacementPaymentModal && (
                <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-[120]">
                    <div className="bg-white w-[400px] rounded-[12px] shadow-xl p-6 m-4">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Choose Payment Method</h2>
                                <p className="text-[13px] text-gray-500 mt-1">
                                    Amount: <span className="font-semibold text-[#2F6F6D]">${selectedPlacementOption || "0.00"}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPlacementPaymentModal(false);
                                    setSelectedPlacementOption(null);
                                    setPlacementPaymentLoading(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-4">
                            <button
                                onClick={async () => {
                                    try {
                                        setPlacementPaymentLoading("card");
                                        const response = await directPayment({
                                            payment_type: "addon_placement",
                                            count: parseInt(selectedPlacementOption),
                                            payment_method: "card"
                                        });
                                        if (response.data?.url) {
                                            window.location.href = response.data.url;
                                        } else {
                                            toast.success(response.data?.message || "Payment successful!");
                                            setShowPlacementPaymentModal(false);
                                            setSelectedPlacementOption(null);
                                            fetchVerification(false);
                                        }
                                    } catch (err) {
                                        console.error("Card payment error:", err);
                                        toast.error(err?.response?.data?.message || "Failed to process card payment");
                                    } finally {
                                        setPlacementPaymentLoading(null);
                                    }
                                }}
                                disabled={placementPaymentLoading === "card"}
                                className="w-full p-4 border-2 border-[#2F6F6D] rounded-[10px] hover:bg-[#2F6F6D] hover:text-white transition-all group text-left disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#2F6F6D33] group-hover:bg-white/20 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Pay with Card</p>
                                        <p className="text-xs opacity-80">Use your saved card or add a new one</p>
                                    </div>
                                    {placementPaymentLoading === "card" && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                                </div>
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        setPlacementPaymentLoading("wallet");
                                        const response = await directPayment({
                                            payment_type: "addon_placement",
                                            count: parseInt(selectedPlacementOption),
                                            payment_method: "wallet"
                                        });
                                        toast.success(response.data?.message || "Payment successful using wallet funds!");
                                        setShowPlacementPaymentModal(false);
                                        setSelectedPlacementOption(null);
                                        fetchVerification(false);
                                    } catch (err) {
                                        console.error("Wallet payment error:", err);
                                        toast.error(err?.response?.data?.message || "Failed to process payment from wallet. Please check your balance.");
                                    } finally {
                                        setPlacementPaymentLoading(null);
                                    }
                                }}
                                disabled={placementPaymentLoading === "wallet"}
                                className="w-full p-4 border-2 border-[#16A34A] text-[#16A34A] rounded-[10px] hover:bg-[#16A34A] hover:text-white transition-all group text-left disabled:opacity-50"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#16A34A33] group-hover:bg-white/20 flex items-center justify-center">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a1 1 0 11-2 0 1 1 0 012 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Pay from Wallet Funds</p>
                                        <p className="text-xs opacity-80">Use your available balance</p>
                                    </div>
                                    {placementPaymentLoading === "wallet" && <Loader2 className="w-4 h-4 animate-spin ml-auto" />}
                                </div>
                            </button>
                        </div>

                        <p className="text-[11px] text-gray-400 text-center mt-6">
                            You will be charged ${selectedPlacementOption} for {selectedPlacementOption} additional placements.
                        </p>
                    </div>
                </div>
            )}

            {/* ── Payment Confirmation Modal ── */}
            {showPaymentConfirmModal && defaultCard && (
                <div className="fixed inset-0 bg-[#00000080] flex items-center justify-center z-[110]">
                    <div className="bg-white w-[440px] rounded-[10px] shadow-xl overflow-hidden m-5">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-5">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800">Confirm Payment Method</h2>
                                    <p className="text-[13px] text-gray-500 mt-0.5">Review the card that will be charged</p>
                                </div>
                                <button
                                    onClick={() => setShowPaymentConfirmModal(false)}
                                    className="text-gray-400 hover:text-gray-600 text-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Card Info */}
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-5">
                                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 capitalize">
                                        {defaultCard.card_brand} •••• {defaultCard.last4}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        Expires {defaultCard.exp_month}/{defaultCard.exp_year}
                                    </p>
                                </div>
                                <span className="ml-auto text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                    Default
                                </span>
                            </div>

                            <p className="text-[12px] text-gray-500 text-center mb-6">
                                Your default card will be charged for the prorated upgrade amount.
                                Do you want to continue?
                            </p>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowPaymentConfirmModal(false);
                                        navigate("/account-settings");
                                    }}
                                    className="flex-1 px-4 py-2.5 text-[13px] rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                >
                                    Change Card
                                </button>
                                <button
                                    onClick={handleProceedUpgrade}
                                    disabled={confirmLoading}
                                    className="flex-1 px-4 py-2.5 text-[13px] rounded-lg bg-[#2F6F6D] text-white font-medium hover:opacity-90 transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {confirmLoading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        "Yes, Continue"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}