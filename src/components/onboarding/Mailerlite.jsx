import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { connectMailerlite, getProfile } from "../../apis/onboarding";
import mailerliteGuideImg from "../../assets/mailerlite_api_guide.png";

const Mailerlite = ({ next, prev }) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [existingKey, setExistingKey] = useState("");
    const [showGuide, setShowGuide] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await getProfile();
                const key = response.data.mailerlite_api_key;
                if (key) {
                    setExistingKey(key);
                    setValue("apiKey", "••••••••••••••••••••••••");
                }
            } catch (error) {
                console.error("Failed to load profile", error);
            } finally {
                setIsFetching(false);
            }
        };
        loadProfile();
    }, [setValue, next]);

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            const payload = { api_key: data.apiKey };
            const promise = connectMailerlite(payload);

            await toast.promise(promise, {
                loading: "Connecting to Mailerlite...",
                success: (response) => {
                    next({ mailerlite_api_key: data.apiKey });
                    return "Mailerlite connected successfully!";
                },
                error: (err) => err?.response?.data?.message || "Failed to connect Mailerlite. Please check your API key.",
            });

        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (isFetching) {
        return (
            <div className="w-full flex items-center justify-center p-6 h-64">
                <p className="text-gray-500">Checking connection status...</p>
            </div>
        );
    }

    return (
        <div className="w-full flex items-center justify-center p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
                <p className="text-sm text-gray-500 mb-1">Step 3 of 4</p>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">Mailerlite API</h2>
                    {existingKey && (
                        <span className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Connected
                        </span>
                    )}
                </div>

                <div className="bg-white p-8 rounded-xl border border-[#7C7C7C] shadow-sm space-y-5">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm">Mailerlite API Key *</label>
                            {existingKey && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setExistingKey("");
                                        setValue("apiKey", "");
                                    }}
                                    className="text-[12px] text-teal-700 hover:underline font-medium"
                                >
                                    Change Key
                                </button>
                            )}
                        </div>
                        <input
                            {...register("apiKey", { required: "API Key is required" })}
                            type="text"
                            placeholder="Enter your Mailerlite API Key"
                            className={`w-full border rounded-lg px-3 py-2 focus:outline-none transition-all ${existingKey ? "bg-gray-50 border-gray-200 text-gray-500" : "border-[#B5B5B5]"}`}
                            readOnly={!!existingKey}
                        />
                        {errors.apiKey && (
                            <p className="text-red-500 text-sm mt-1">{errors.apiKey.message}</p>
                        )}
                        <div className="flex items-center justify-between mt-2">

                            <button
                                type="button"
                                onClick={() => setShowGuide(true)}
                                className="text-sm text-[#2F6F6D] font-medium hover:underline flex items-center gap-1"
                            >
                                🔑 How to Create API Key
                            </button>
                        </div>
                    </div>

                    {existingKey && (
                        <div className="p-4 bg-[#2F6F6D0D] rounded-lg border border-[#2F6F6D1A]">
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Your account is already connected to Mailerlite. You can click <strong>Next Step</strong> to review your profile.
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="button"
                        onClick={prev}
                        className="px-6 py-2 border border-gray-400 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Previous
                    </button>

                    <button
                        type={existingKey ? "button" : "submit"}
                        onClick={existingKey ? () => next({ mailerlite_api_key: existingKey }) : undefined}
                        disabled={loading}
                        className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Saving..." : (existingKey ? "Next Step" : "Save & Continue")}
                    </button>
                </div>
            </form>

            {/* API Key Guide Modal */}
            {showGuide && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-[#F9FBFA]">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#2F6F6D1A] rounded-xl flex items-center justify-center text-[#2F6F6D]">
                                    <span className="text-xl">🔑</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">Create MailerLite API Key</h3>
                                    <p className="text-sm text-gray-500">Follow these steps to generate your token</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowGuide(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-400 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
                            {/* Infographic Image */}
                            {/* <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-50">
                                <img
                                    src={mailerliteGuideImg}
                                    alt="MailerLite API Key Guide"
                                    className="w-full h-auto object-cover"
                                />
                            </div> */}

                            {/* Detailed Steps */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-[#2F6F6D] text-sm uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-5 h-5 bg-[#2F6F6D1A] rounded-full flex items-center justify-center text-[10px]">1</span>
                                        Initialization
                                    </h4>
                                    <ul className="space-y-3">
                                        {[
                                            <span className="flex items-center gap-2">
                                                Log in to your MailerLite account.
                                                <a
                                                    href="https://www.mailerlite.com"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#2F6F6D] hover:text-[#245957] transition-colors"
                                                    title="Go to MailerLite website"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                                        <polyline points="15 3 21 3 21 9"></polyline>
                                                        <line x1="10" y1="14" x2="21" y2="3"></line>
                                                    </svg>
                                                </a>
                                            </span>,
                                            "Click on the 'Integrations' tab in the sidebar.",
                                            "Find the 'MailerLite API' section and click 'Use'."
                                        ].map((text, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <span className="text-green-500 mt-0.5 mt-1">•</span>
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-semibold text-[#2F6F6D] text-sm uppercase tracking-wider flex items-center gap-2">
                                        <span className="w-5 h-5 bg-[#2F6F6D1A] rounded-full flex items-center justify-center text-[10px]">2</span>
                                        Generation
                                    </h4>
                                    <ul className="space-y-3">
                                        {[
                                            "Click the green 'Generate new token' button.",
                                            "Choose 'All IPs allowed'",
                                            "Name your token (e.g., 'Author Swap').",
                                            "Agree to the Terms of Use.",
                                            "Click 'Create token' to see your key."
                                        ].map((text, i) => (
                                            <li key={i} className="flex gap-3 text-sm text-gray-600">
                                                <span className="text-green-500 mt-1">•</span>
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Security Notice */}
                            <div className="bg-[#FFF8F1] border border-[#FFE7CC] p-4 rounded-xl flex gap-3 items-start">
                                <div className="text-[#B45309] mt-0.5 text-lg">⚠️</div>
                                <div>
                                    <p className="text-sm font-semibold text-[#92400E]">Important Security Note</p>
                                    <p className="text-sm text-[#B45309] leading-relaxed mt-1">
                                        MailerLite will only show this key <strong>once</strong> for security reasons. Copy it immediately and save it in a safe place.
                                    </p>
                                </div>
                            </div>

                            {/* IP Allowlist Security Notice */}
                            <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-4 rounded-xl flex gap-3 items-start">
                                <div className="text-[#1D4ED8] mt-0.5 text-lg">🔒</div>
                                <div>
                                    <p className="text-sm font-semibold text-[#1E40AF]">IP Allowlist Enabled</p>
                                    <p className="text-sm text-[#3B82F6] leading-relaxed mt-1">
                                        Only authorized hosts can access the application.
                                    </p>
                                    <p className="text-xs text-[#1E40AF] mt-2 font-medium">Allowed:</p>
                                    <ul className="text-xs text-[#3B82F6] mt-1 space-y-0.5">
                                        <li>• 72.61.251.114</li>
                                        <li>• authorswap.com</li>
                                        <li>• www.authorswap.com</li>
                                    </ul>
                                    <p className="text-xs text-[#3B82F6] mt-2 italic">Security monitoring is active.</p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setShowGuide(false)}
                                className="px-6 py-2 bg-[#2F6F6D] text-white rounded-lg font-medium hover:bg-[#245957] transition-all shadow-lg hover:shadow-xl active:scale-95"
                            >
                                I've Got My Key
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mailerlite;