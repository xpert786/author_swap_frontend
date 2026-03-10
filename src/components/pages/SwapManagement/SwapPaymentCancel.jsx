import { useNavigate, useSearchParams } from "react-router-dom";
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react";

const SwapPaymentCancel = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const swapRequestId = searchParams.get("swap_request_id");

    const handleBack = () => {
        navigate("/swap-management");
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-red-100 p-4 rounded-full">
                        <XCircle className="w-16 h-16 text-red-600" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4 tracking-tight">
                    Payment Cancelled
                </h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    The payment process for your swap request (ID: {swapRequestId}) was cancelled. No charges were made to your account.
                </p>

                <div className="space-y-3">
                    <button
                        onClick={handleBack}
                        className="w-full bg-[#2F6F6D] text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-[#255654] transition-all transform active:scale-[0.98]"
                    >
                        Try Again
                        <RefreshCw className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="w-full bg-white text-gray-700 py-3 px-6 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition-all transform active:scale-[0.98]"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwapPaymentCancel;
