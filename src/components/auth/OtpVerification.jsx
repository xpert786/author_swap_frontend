import { useForm } from "react-hook-form";
import Logo from "../../assets/logo.png";
import LoginBg from "../../assets/Login.png";
import { Link, useNavigate } from "react-router-dom";
import { otpVerification } from "../../apis/auth";
import { useState } from "react";
import toast from "react-hot-toast";

const OtpVerification = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();


  const onSubmit = async (data) => {
    const enteredOtp = Object.values(data.otp || {}).join("");

    if (!enteredOtp || enteredOtp.length < 6) {
      setError("otp", {
        type: "manual",
        message: "Please enter complete 6-digit OTP",
      });
      toast.error("Please enter complete 6-digit OTP");
      return;
    }

    const toastId = toast.loading("Verifying OTP...");

    try {
      setLoading(true);

      await otpVerification({ otp: enteredOtp });

      toast.success("OTP verified successfully", { id: toastId });

      setTimeout(() => {
        navigate("/reset-password");
      }, 1200);

    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Invalid OTP. Please try again.";

      setError("otp", {
        type: "manual",
        message,
      });

      toast.error(message, { id: toastId });

    } finally {
      setLoading(false);
    }
  };

  const [loading, setLoading] = useState(false);

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 md:p-6"
      style={{ backgroundImage: `url(${LoginBg})`, backgroundColor: "#3a8d8b" }}
    >
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

        {/* LEFT SIDE - BRANDING */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-start text-white">
          <div className="max-w-md">
            <img
              src={Logo}
              alt="AuthorSwap Logo"
              className="mb-6 w-full max-w-[320px] h-auto drop-shadow-md"
            />
            <h1 className="text-2xl xl:text-2xl font-bold mb-3 leading-tight">
              Verified newsletter swaps for authors
            </h1>
            <p className="text-sm lg:text-base opacity-90 font-medium tracking-tight">
              Flat pricing. No commissions. Automatic verification.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - CARD */}
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-[18px] shadow-2xl w-full p-6 md:p-10">

            <h2 className="text-2xl font-bold text-[#E07A5F] mb-4">
              OTP Verification
            </h2>
            <p className="text-xs text-gray-500 mb-8 ml-0.5">
              Enter the 6-digit code sent to your email.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex justify-between gap-2 md:gap-3">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    {...register(`otp.${index}`, {
                      required: true,
                      pattern: /^[0-9]$/,
                    })}
                    onInput={(e) => {
                      if (e.target.value.length === 1) {
                        const next = e.target.nextElementSibling;
                        if (next) next.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !e.target.value) {
                        const prev = e.target.previousElementSibling;
                        if (prev) prev.focus();
                      }
                    }}
                    className="w-10 h-10 md:w-11 md:h-11 text-center text-sm font-bold rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/20 focus:border-[#E07A5F] bg-gray-50/50 transition-all uppercase"
                  />
                ))}
              </div>

              {errors.otp && (
                <p className="text-red-500 text-[10px] font-medium text-center uppercase tracking-wider">
                  {errors.otp.message}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#E07A5F] text-white py-3 rounded-[8px] font-medium text-sm shadow-lg"
              >
                {loading ? "Verifying..." : "Continue"}
              </button>
            </form>

            <div className="flex flex-col items-center mt-8">
              <p className="text-xs font-medium text-gray-500">
                Didn’t get the OTP yet?{" "}
                <button
                  onClick={() => {
                    toast.success("OTP resent successfully");
                  }}
                  className="text-[#2F6F6D] font-medium hover:underline transition-all"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OtpVerification;
