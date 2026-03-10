import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const SwapPaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const swapRequestId = searchParams.get("swap_request_id");

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            toast.success("Swap payment successful!");
        }, 2000);

        return () => clearTimeout(timer);
    }, [swapRequestId]);

    const handleGoToDashboard = () => {
        navigate("/dashboard");
    };

    const handleGoToSwapManagement = () => {
        navigate("/swap-management");
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                {loading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-[#2F6F6D] animate-spin mb-4" />
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Confirming Payment</h2>
                        <p className="text-gray-500">Please wait while we process your swap payment...</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-center mb-6">
                            <div className="bg-green-100 p-4 rounded-full">
                                <CheckCircle className="w-16 h-16 text-green-600" />
                            </div>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
                            Payment Successful!
                        </h2>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Thank you for your payment! Your swap request (ID: {swapRequestId}) has been processed successfully. You can now track your swap progress in the management section.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={handleGoToSwapManagement}
                                className="w-full bg-[#2F6F6D] text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#255654] transition-all transform active:scale-[0.98]"
                            >
                                Go to Swap Management
                                <ArrowRight className="w-5 h-5" />
                            </button>

                            <button
                                onClick={handleGoToDashboard}
                                className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all transform active:scale-[0.98]"
                            >
                                Back to Dashboard
                            </button>
                        </div>

                        <p className="mt-8 text-xs text-gray-400">
                            A confirmation receipt has been sent to your registered email address.
                        </p>
                    </>
                )}
            </div>
        </div>
    );
};

export default SwapPaymentSuccess;
