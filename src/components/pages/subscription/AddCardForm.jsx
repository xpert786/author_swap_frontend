import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Loader2, CreditCard } from "lucide-react";
import toast from "react-hot-toast";
import { getSetupIntent } from "../../../apis/subscription";

const AddCardForm = ({ onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        try {
            // 1. Get Setup Intent from backend
            const res = await getSetupIntent();
            const clientSecret = res.data.client_secret;

            if (!clientSecret) {
                throw new Error("Failed to get setup intent");
            }

            // 2. Confirm the card setup
            const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                },
            });

            if (error) {
                toast.error(error.message);
            } else if (setupIntent.status === "succeeded") {
                toast.success("Card saved successfully!");
                onSuccess();
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to save card. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <CardElement
                    options={{
                        style: {
                            base: {
                                fontSize: "16px",
                                color: "#424770",
                                "::placeholder": {
                                    color: "#aab7c4",
                                },
                            },
                            invalid: {
                                color: "#9e2146",
                            },
                        },
                    }}
                />
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="flex-1 bg-[#2F6F6D] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#255755] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <>
                            <CreditCard size={16} />
                            Save Card
                        </>
                    )}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={loading}
                    className="flex-1 bg-white text-gray-700 py-2 px-4 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default AddCardForm;
