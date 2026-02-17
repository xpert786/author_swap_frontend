import { useState } from "react";
import { useForm } from "react-hook-form";
import Logo from "../../assets/logo.png";
import LoginBg from "../../assets/Login.png";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";

const SignUp = () =>
{
  const [ showPassword, setShowPassword ] = useState( false );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch( "password" );


  const onSubmit = ( data ) =>
  {
    console.log( "Form Data:", data );
  };

  return (
    <div
        className="min-h-screen w-full bg-cover bg-center bg-no-repeat"
        style={ { backgroundImage: `url(${ LoginBg })` } }
      >

     <div className="min-h-screen flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-6 text-white">
          <div className="max-w-lg text-center p-4">
            <img
              src={ Logo }
              alt="AuthorSwap Logo"
              className="mx-auto mb-6 w-full max-w-[454px] h-auto"
            />

            <h1 className="text-[25px] font-medium mb-3 leading-snug">
              Verified newsletter swaps for authors
            </h1>

            <p className="text-[17px] opacity-90">
              Flat pricing. No commissions. Automatic verification.
            </p>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[600px] p-8">
            <h2 className="text-[45px] font-bold text-[#E07A5F] mb-6">
              Create New Password
            </h2>

            <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-4">
              <div className="relative mb-5">
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>

                <input
                  type={ showPassword ? "text" : "password" }
                  placeholder="Enter Password"
                  { ...register( "password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters required",
                    },
                  } ) }

                  className={ `w-full border rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2
                  ${ errors.password
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#E07A5F]"
                    }` }
                />

                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                  onClick={ () => setShowPassword( !showPassword ) }
                >
                  { showPassword ? <FaRegEyeSlash /> : <FaRegEye /> }
                </span>

                { errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    { errors.password.message }
                  </p>
                ) }
              </div>

              <div className="relative mb-5">
                <label className="block text-sm font-medium mb-1">
                  Confirm Password
                </label>

                <input
                  type={ showPassword ? "text" : "password" }
                  placeholder="Confirm Password"
                  { ...register( "confirmPassword", {
                    required: "Confirm Password is required",
                    validate: ( value ) =>
                      value === password || "Passwords do not match",
                  } ) }
                  className={ `w-full border rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2
      ${ errors.confirmPassword
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#E07A5F]"
                    }` }
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                  onClick={ () => setShowPassword( !showPassword ) }
                >
                  { showPassword ? <FaRegEyeSlash /> : <FaRegEye /> }
                </span>

                { errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    { errors.confirmPassword.message }
                  </p>
                ) }
              </div>
              <button
                type="submit"
                className="w-full bg-[#E07A5F] text-white px-3 py-3 rounded-md cursor-pointer hover:bg-[#d96b57] font-semibold"
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
