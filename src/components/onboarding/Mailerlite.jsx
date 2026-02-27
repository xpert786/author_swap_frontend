import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { connectMailerlite } from "../../apis/onboarding";

const Mailerlite = ({ next, prev }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [loading, setLoading] = useState(false);

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

    return (
        <div className="w-full flex items-center justify-center p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl">
                <p className="text-sm text-gray-500 mb-1">Step 3 of 4</p>
                <h2 className="text-2xl font-semibold mb-6">Mailerlite API</h2>

                <div className="bg-white p-8 rounded-xl border border-[#7C7C7C] shadow-sm space-y-4">
                    <div>
                        <label className="block text-sm mb-2">Mailerlite API Key *</label>
                        <input
                            {...register("apiKey", { required: "API Key is required" })}
                            type="text"
                            placeholder="Enter your Mailerlite API Key"
                            className="w-full border border-[#B5B5B5] rounded-lg px-3 py-2 focus:outline-none"
                        />
                        {errors.apiKey && (
                            <p className="text-red-500 text-sm mt-1">{errors.apiKey.message}</p>
                        )}
                        <p className="text-[11px] text-gray-400 mt-2 italic">
                            You can find your API key in your Mailerlite account under Integrations {">"} API.
                        </p>
                    </div>
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
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 disabled:opacity-50 transition-colors"
                    >
                        {loading ? "Saving..." : "Next"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Mailerlite;