import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SubscriptionSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        // You could also verify the session_id with your backend here
        const timer = setTimeout(() => {
            setLoading(false);
            toast.success("Subscription activated successfully!");
        }, 2000);

        return () => clearTimeout(timer);
    }, [sessionId]);

    const handleGoToDashboard = () => {
        navigate("/dashboard");
    };

    const handleGoToSubscription = () => {
        navigate("/subscription");
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                {loading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-[#2F6F6D] animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirming Payment</h2>
                        <p className="text-gray-500">Please wait while we process your subscription...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle className="w-16 h-16 text-green-600" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
                            Subscription Successful!
                        </h2>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Tank you for subscribing! Your account has been upgraded and you now have access to all the features of your selected plan.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={handleGoToDashboard}
                                className="w-full bg-[#2F6F6D] text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#255654] transition-all transform active:scale-[0.98]"
                            >
                                Go to Dashboard
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleGoToSubscription}
                                className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all transform active:scale-[0.98]"
                            >
                                View Plan Details
                            </button>
                        </div>

                        <p className="mt-8 text-xs text-gray-400">
                            A confirmation email has been sent to your registered email address.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default SubscriptionSuccess;
