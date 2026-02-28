import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { connectMailerlite, getProfile } from "../../apis/onboarding";

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
                        <p className="text-[11px] text-gray-400 mt-2 italic">
                            You can find your API key in your Mailerlite account under Integrations {">"} API.
                        </p>
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
        </div>
    );
};

export default Mailerlite;