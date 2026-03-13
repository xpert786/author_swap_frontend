import { useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "../../assets/logo.png";
import LoginBg from "../../assets/Login.png";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { login, googleLogin } from "../../apis/auth";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useProfile } from "../../context/ProfileContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { refreshProfile } = useProfile();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  // Shared post-login handler — stores token/flags then lets ProtectedRoute decide routing
  const handleLoginSuccess = async (token, data) => {
    localStorage.setItem("token", token);

    // If localStorage already says profile is complete, NEVER overwrite it —
    // the server incorrectly returns false for existing users who already completed onboarding.
    // Only write "false" if this device has never seen a completed profile before.
    const alreadyComplete = localStorage.getItem("isprofilecompleted") === "true";
    if (!alreadyComplete) {
      localStorage.setItem(
        "isprofilecompleted",
        data?.isprofilecompleted === true ? "true" : "false"
      );
    }

    const subscription = data?.subscription;
    const subscriptionExpiry = subscription?.active_until || subscription?.renew_date;
    const isExpired = subscriptionExpiry && new Date(subscriptionExpiry) < new Date();
    const hasActiveSubscription =
      (data?.has_subscription || subscription?.is_active) && !isExpired;

    localStorage.setItem("has_subscription", String(!!hasActiveSubscription));
    if (subscriptionExpiry) {
      localStorage.setItem("subscription_expiry", subscriptionExpiry);
    }

    await refreshProfile();

    // Always go to dashboard — ProtectedRoute redirects to /onboarding or /subscription if needed
    navigate("/dashboard");
  };

  const handleGoogleSuccess = async (response) => {
    const loadingToast = toast.loading("Connecting with Google...");
    try {
      const data = await googleLogin(response.credential);
      if (!data?.token) throw new Error("Login failed");

      toast.success("Login successful!", { id: loadingToast });
      await handleLoginSuccess(data.token, data);
    } catch (error) {
      console.error("Google login failed:", error);
      toast.error(
        error?.response?.data?.message || "Google Authentication failed",
        { id: loadingToast }
      );
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await login({ email: data.email, password: data.password });
      if (!response?.token) throw new Error("Invalid response from server");

      toast.success("Login successful! Welcome back.");
      await handleLoginSuccess(response.token, response);
    } catch (error) {
      console.error("Login failed:", error);

      const serverData = error?.response?.data;
      let errorMessage = "Login failed";

      if (serverData) {
        if (typeof serverData === "string") {
          errorMessage = serverData;
        } else if (serverData.message || serverData.error || serverData.detail) {
          errorMessage =
            serverData.message || serverData.error || serverData.detail;
        } else {
          const fieldKeys = Object.keys(serverData).filter(
            (k) => !["status"].includes(k)
          );
          if (fieldKeys.length > 0) {
            const firstError = serverData[fieldKeys[0]];
            errorMessage = Array.isArray(firstError)
              ? firstError[0]
              : firstError;
          }
        }
      } else {
        errorMessage = error.message;
      }

      // Set inline field errors
      if (serverData && typeof serverData === "object") {
        Object.keys(serverData).forEach((field) => {
          if (!["message", "error", "detail", "status"].includes(field)) {
            const errorVal = serverData[field];
            const message = Array.isArray(errorVal) ? errorVal[0] : errorVal;
            setError(field, { type: "server", message });
          }
        });
      }

      toast.error(errorMessage);
    }
  };

  const onError = (errors) => {
    const firstError = Object.values(errors)[0];
    if (firstError) {
      toast.error(firstError.message || "Please fix the errors in the form");
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 md:p-6"
      style={{ backgroundImage: `url(${LoginBg})`, backgroundColor: "#3a8d8b" }}
    >
      <div className="w-full max-w-[1100px] flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">

        {/* LEFT SIDE - BRANDING */}
        <div className="hidden lg:flex lg:w-1/2 flex-col items-start text-[#111827]">
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

        {/* RIGHT SIDE - LOGIN CARD */}
        <div className="w-full max-w-[440px]">
          <div className="bg-[#2F6F6D] rounded-[18px] shadow-2xl w-full p-6 md:p-10">

            <h2 className="text-2xl font-bold text-white mb-6">Log In</h2>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-white mb-1.5 ml-0.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full border rounded-[10px] px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 transition-all
                    ${errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-200 focus:border-[#E07A5F] focus:ring-[#E07A5F]/20 bg-white"
                    }`}
                />
                {errors.email && (
                  <p className="text-red-500 text-[10px] mt-1 font-medium ml-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-xs font-semibold text-white mb-1.5 ml-0.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Minimum 8 characters required",
                      },
                    })}
                    className={`w-full border rounded-[10px] px-4 py-2.5 text-xs text-gray-900 focus:outline-none focus:ring-2 transition-all pr-12
                      ${errors.password
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-200 focus:border-[#E07A5F] focus:ring-[#E07A5F]/20 bg-white"
                      }`}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaRegEyeSlash size={16} />
                    ) : (
                      <FaRegEye size={16} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[10px] mt-1 font-medium ml-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex justify-between items-center py-0.5">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    {...register("remember")}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-[#2F6F6D] focus:ring-[#2F6F6D] cursor-pointer"
                  />
                  <span className="text-xs font-normal text-white group-hover:text-gray-200 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  to="/forget-password"
                  className="text-[11px] font-normal text-white hover:text-gray-200 hover:underline"
                >
                  Forget your password
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#E07A5F] text-white py-3 rounded-[8px] hover:bg-[#d96b57] font-medium text-sm transition-all shadow-lg active:scale-[0.98] mt-1"
              >
                Log In
              </button>
            </form>

            {/* Footer */}
            <div className="flex flex-col items-center mt-6">
              <p className="text-xs font-medium text-white">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>

              <div className="mt-6 flex items-center justify-center w-full">
                <div className="flex-1 h-px bg-[#E5E7EB]"></div>
                <span className="px-3 text-[11px] font-medium text-white whitespace-nowrap">
                  or sign up with
                </span>
                <div className="flex-1 h-px bg-[#E5E7EB]"></div>
              </div>

              <div className="mt-5 w-full flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error("Google Login Failed")}
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;