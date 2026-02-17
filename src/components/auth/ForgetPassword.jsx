import { useForm } from "react-hook-form";
import Logo from "../../assets/logo.png";
import LoginBg from "../../assets/Login.png";

const Login = () =>
{

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = ( data ) =>
  {
    console.log( "Form Data:", data );
  };

  return (
    <div className="relative min-h-screen w-full">
      <img
        src={ LoginBg }
        alt="Login Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 flex flex-col md:flex-row">
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
             Forgot Password
            </h2>

            <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-4">

              <div className="mb-10">
                <label className="block text-sm font-medium mb-1">
                  Email address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email address"
                  { ...register( "email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email address",
                    },
                  } ) }
                  className={ `w-full border rounded-md px-3 py-3 text-sm focus:outline-none focus:ring-2
                  ${ errors.email
                      ? "border-red-500 focus:ring-red-400"
                      : "border-gray-300 focus:ring-[#E07A5F]"
                    }` }
                />

                { errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    { errors.email.message }
                  </p>
                ) }
              </div>
  
              <button
                type="submit"
                className="w-full bg-[#E07A5F] text-white px-3 py-3 rounded-md cursor-pointer hover:bg-[#d96b57] font-semibold"
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

export default Login;
