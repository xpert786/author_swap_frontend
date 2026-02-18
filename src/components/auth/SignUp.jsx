// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import Logo from "../../assets/logo.png";
// import LoginBg from "../../assets/Login.png";
// import { FcGoogle } from "react-icons/fc";
// import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// const SignUp = () =>
// {
//   const [ showPassword, setShowPassword ] = useState( false );

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm();

//   const password = watch( "password" );
//   const navigate = useNavigate();

//  const onSubmit = (data) => {
//   console.log("Form Data:", data);

//   // Fake login
//   localStorage.setItem("token", "demo-token");
//   localStorage.setItem("isProfileComplete", "false");

//   navigate("/onboarding");
// };


//   return (
//     <div
//       className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
//       style={ { backgroundImage: `url(${ LoginBg })` } }
//     >
//       <div className="min-h-screen flex flex-col md:flex-row">
//         <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6 text-white">
//           <div className="max-w-lg text-center p-4">
//             <img
//               src={ Logo }
//               alt="AuthorSwap Logo"
//               className="mx-auto mb-6 w-full max-w-[454px] h-auto"
//             />

//             <h1 className="text-[25px] font-medium mb-3 leading-snug">
//               Verified newsletter swaps for authors
//             </h1>

//             <p className="text-[17px] opacity-90">
//               Flat pricing. No commissions. Automatic verification.
//             </p>
//           </div>
//         </div>

//         <div className="w-full md:w-1/2 flex items-center justify-center p-6">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] p-8">
//             <h2 className="text-[45px] font-bold text-[#E07A5F] mb-6">
//               Create Account
//             </h2>

//             <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-4">

//               <div className="mb-5">
//                 <label className="block text-sm font-medium mb-1">
//                   Email address
//                 </label>

//                 <input
//                   type="email"
//                   placeholder="Enter your email address"
//                   { ...register( "email", {
//                     required: "Email is required",
//                     pattern: {
//                       value: /^\S+@\S+$/i,
//                       message: "Invalid email address",
//                     },
//                   } ) }
//                   className={ `w-full border rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2
//                   ${ errors.email
//                       ? "border-red-500 focus:ring-red-400"
//                       : "border-gray-300 focus:ring-[#E07A5F]"
//                     }` }
//                 />

//                 { errors.email && (
//                   <p className="text-red-500 text-xs mt-1">
//                     { errors.email.message }
//                   </p>
//                 ) }
//               </div>

//               <div className="relative mb-5">
//                 <label className="block text-sm font-medium mb-1">
//                   Password
//                 </label>

//                 <input
//                   type={ showPassword ? "text" : "password" }
//                   placeholder="Enter Password"
//                   { ...register( "password", {
//                     required: "Password is required",
//                     minLength: {
//                       value: 6,
//                       message: "Minimum 6 characters required",
//                     },
//                   } ) }

//                   className={ `w-full border rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2
//                   ${ errors.password
//                       ? "border-red-500 focus:ring-red-400"
//                       : "border-gray-300 focus:ring-[#E07A5F]"
//                     }` }
//                 />

//                 <span
//                   className="absolute right-3 top-9 cursor-pointer text-gray-500"
//                   onClick={ () => setShowPassword( !showPassword ) }
//                 >
//                   { showPassword ? <FaRegEyeSlash /> : <FaRegEye /> }
//                 </span>

//                 { errors.password && (
//                   <p className="text-red-500 text-xs mt-1">
//                     { errors.password.message }
//                   </p>
//                 ) }
//               </div>

//               <div className="relative mb-5">
//                 <label className="block text-sm font-medium mb-1">
//                   Confirm Password
//                 </label>

//                 <input
//                   type={ showPassword ? "text" : "password" }
//                   placeholder="Confirm Password"
//                   { ...register( "confirmPassword", {
//                     required: "Confirm Password is required",
//                     validate: ( value ) =>
//                       value === password || "Passwords do not match",
//                   } ) }
//                   className={ `w-full border rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2
//       ${ errors.confirmPassword
//                       ? "border-red-500 focus:ring-red-400"
//                       : "border-gray-300 focus:ring-[#E07A5F]"
//                     }` }
//                 />

//                 <span
//                   className="absolute right-3 top-9 cursor-pointer text-gray-500"
//                   onClick={ () => setShowPassword( !showPassword ) }
//                 >
//                   { showPassword ? <FaRegEyeSlash /> : <FaRegEye /> }
//                 </span>

//                 { errors.confirmPassword && (
//                   <p className="text-red-500 text-xs mt-1">
//                     { errors.confirmPassword.message }
//                   </p>
//                 ) }
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-[#E07A5F] text-white px-3 py-3 rounded-md cursor-pointer hover:bg-[#d96b57] font-semibold"
//               >
//                 Create Account
//               </button>
//             </form>

//             <div className="flex flex-col items-center mt-6">
//               <p className="mt-4 text-lg">
//                 Already have an account?{ " " }
//                 <Link
//                   to="/login"
//                   className="text-[#2F6F6D] hover:underline"
//                 >
//                   Log in
//                 </Link>
//               </p>
//               <p className="mt-6 text-lg">or sign up with</p>

//               <button className="flex items-center justify-center border border-gray-300 rounded-md p-3 mt-6 hover:bg-gray-50 font-semibold">
//                 <FcGoogle className="text-2xl mr-2" /> Google
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SignUp;


import { useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "../../assets/logo.png";
import LoginBg from "../../assets/Login.png";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const navigate = useNavigate();

  const onSubmit = (data) => {
    console.log("Form Data:", data);

    localStorage.setItem("token", "demo-token");
    localStorage.setItem("isProfileComplete", "false");

    navigate("/onboarding");
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${LoginBg})` }}
    >
      <div className="min-h-screen flex flex-col md:flex-row">

        {/* LEFT SIDE */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-10 text-white">
          <div className="max-w-xl text-center">
            <img
              src={Logo}
              alt="AuthorSwap Logo"
              className="mx-auto mb-8 w-full max-w-[450px]"
            />

            <h1 className="text-3xl lg:text-4xl font-semibold mb-4 leading-snug">
              Verified newsletter swaps for authors
            </h1>

            <p className="text-lg lg:text-xl opacity-90">
              Flat pricing. No commissions. Automatic verification.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 lg:p-10">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg lg:max-w-xl p-8 lg:p-10">

            <h2 className="text-4xl lg:text-5xl font-bold text-[#E07A5F] mb-8">
              Create Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              {/* Email */}
              <div>
                <label className="block text-base font-medium mb-2">
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
                  className={`w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2
                  ${errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#E07A5F]"
                    }`}
                />

                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <label className="block text-base font-medium mb-2">
                  Password
                </label>

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
                  className={`w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2
                  ${errors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#E07A5F]"
                    }`}
                />

                <span
                  className="absolute right-4 top-11 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-base font-medium mb-2">
                  Confirm Password
                </label>

                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  {...register("confirmPassword", {
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className={`w-full border rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2
                  ${errors.confirmPassword
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#E07A5F]"
                    }`}
                />

                <span
                  className="absolute right-4 top-11 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>

                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#E07A5F] text-white py-3 rounded-lg hover:bg-[#d96b57] font-semibold text-lg transition"
              >
                Create Account
              </button>
            </form>

            {/* Bottom */}
            <div className="flex flex-col items-center mt-8">
              <p className="text-base">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#2F6F6D] hover:underline"
                >
                  Log in
                </Link>
              </p>

              <div className="mt-6 flex items-center justify-center">
                <div className="w-24 h-px bg-gray-400"></div>

                <span className="px-4 text-base text-gray-600 whitespace-nowrap">
                  or sign in with
                </span>

                <div className="w-24 h-px bg-gray-400"></div>
              </div>

              <button className="flex items-center justify-center border border-gray-300 rounded-lg px-4 py-3 mt-4 hover:bg-gray-50 font-semibold text-base">
                <FcGoogle className="text-2xl mr-2" /> Google
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUp;

