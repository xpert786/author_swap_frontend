import { useForm } from "react-hook-form";
import Logo from "../../assets/logo.png";
import LoginBg from "../../assets/Login.png";
import { useNavigate } from "react-router-dom";
import { forgetPassword } from "../../apis/auth";

const ForgetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await forgetPassword({
        email: data.email,
      });

      console.log("OTP Sent:", response);

      // Optional: store email for OTP screen
      localStorage.setItem("resetEmail", data.email);

      navigate("/otp-verification");
    } catch (error) {
      console.error("Forget password failed:", error);
      alert(
        error?.response?.data?.message ||
        error.message ||
        "Something went wrong"
      );
    }
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

        {/* RIGHT SIDE - CARD */}
        <div className="w-full max-w-[440px]">
          <div className="bg-white rounded-[18px] shadow-2xl w-full p-6 md:p-10">

            <h2 className="text-2xl font-bold text-[#E07A5F] mb-6">
              Forgot Password
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  className={`w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 transition-all
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#E07A5F] text-white py-3 rounded-xl hover:bg-[#d96b57] font-bold text-sm transition-all shadow-lg active:scale-[0.98] mt-2"
              >
                Continue
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ForgetPassword;
