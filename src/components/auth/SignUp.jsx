import { useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "../../assets/logo.png";
import LoginBg from "../../assets/Login.png";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../apis/auth";
import toast from "react-hot-toast";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    const signupPromise = signup({
      email: data.email,
      password: data.password,
      confirm_password: data.confirmPassword,
    });

    toast.promise(signupPromise, {
      loading: "Creating account...",
      success: (response) => {
        localStorage.setItem("token", response.token);
        navigate("/onboarding");
        return "Account created successfully!";
      },
      error: (error) =>
        error?.response?.data?.message || "Signup failed",
    });
  };

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

        {/* RIGHT SIDE - SIGN UP CARD */}
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-[18px] shadow-2xl w-full p-6 md:p-10">

            <h2 className="text-2xl font-bold text-[#E07A5F] mb-6">
              Create Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email address */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-0.5">
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
                  className={`w-full border rounded-[10px] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 transition-all
                  ${errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-200 focus:border-[#E07A5F] focus:ring-[#E07A5F]/20 bg-gray-50/30"
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
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-0.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Minimum 6 characters required",
                      },
                    })}
                    className={`w-full border rounded-[10px] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 transition-all pr-12
                    ${errors.password
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-200 focus:border-[#E07A5F] focus:ring-[#E07A5F]/20 bg-gray-50/30"
                      }`}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-[10px] mt-1 font-medium ml-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 ml-0.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className={`w-full border rounded-[10px] px-4 py-2.5 text-xs focus:outline-none focus:ring-2 transition-all pr-12
                    ${errors.confirmPassword
                        ? "border-red-500 focus:ring-red-400"
                        : "border-gray-200 focus:border-[#E07A5F] focus:ring-[#E07A5F]/20 bg-gray-50/30"
                      }`}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-[10px] mt-1 font-medium ml-0.5">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Create Account Button */}
              <button
                type="submit"
                className="w-full bg-[#E07A5F] text-white py-3 rounded-[10px] font-bold text-sm transition-all shadow-lg active:scale-[0.98] mt-2"
              >
                Create Account
              </button>
            </form>

            {/* Bottom Footer */}
            <div className="flex flex-col items-center mt-6">
              <p className="text-xs font-normal text-[#111827]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#2F6F6D] font-normal hover:underline transition-all"
                >
                  Log in
                </Link>
              </p>

              <div className="mt-6 flex items-center justify-center w-full">
                <div className="flex-1 h-px bg-[#E5E7EB]"></div>
                <span className="px-3 text-[11px] font-normal text-[#374151] whitespace-nowrap bg-white">
                  or sign up with
                </span>
                <div className="flex-1 h-px bg-[#E5E7EB]"></div>
              </div>

              <button
                type="button"
                className="flex items-center justify-center border border-[#9CA3AF] rounded-[8px] px-6 py-2 mt-5 w-full md:w-auto min-w-[115px]"
              >
                <FcGoogle className="text-xl mr-2" />
                <span className="text-xs font-bold text-gray-700">Google</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;
