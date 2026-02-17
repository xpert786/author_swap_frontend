import { useForm } from "react-hook-form";
import Logo from "../../assets/logo.png";
import LoginBg from "../../assets/Login.png";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Login = () =>
{

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const onSubmit = ( data ) =>
  {
    const enteredOtp = data.otp?.join( "" );

    if ( !enteredOtp || enteredOtp.length < 6 )
    {
      setError( "otp", {
        type: "manual",
        message: "Please enter complete 6-digit OTP",
      } );
      return;
    }

    const correctOtp = "123456";

    if ( enteredOtp !== correctOtp )
    {
      setError( "otp", {
        type: "manual",
        message: "OTP did not match",
      } );
      return;
    }

    console.log( "OTP Verified ✅" );
    navigate( "/reset-password" );
  };


  return (
    <div className="min-h-screen w-full bg-cover bg-center bg-no-repeat overflow-x-hidden"
      style={ { backgroundImage: `url(${ LoginBg })` } }
    >

      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="flex md:w-1/2 items-center justify-center p-6 text-white">
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
              OTP Verification
            </h2>

            <form onSubmit={ handleSubmit( onSubmit ) } className="space-y-4">

              <div className="flex justify-around gap-2 mb-6">
                { [ ...Array( 6 ) ].map( ( _, index ) => (
                  <input
                    key={ index }
                    type="text"
                    maxLength="1"
                    { ...register( `otp.${ index }`, {
                      required: true,
                      pattern: /^[0-9]$/,
                    } ) }
                    onInput={ ( e ) =>
                    {
                      if ( e.target.value.length === 1 )
                      {
                        const next = e.target.nextSibling;
                        if ( next ) next.focus();
                      }
                    } }
                    onKeyDown={ ( e ) =>
                    {
                      if ( e.key === "Backspace" && !e.target.value )
                      {
                        const prev = e.target.previousSibling;
                        if ( prev ) prev.focus();
                      }
                    } }
                    className="w-10 h-10 md:w-12 md:h-12 text-center text-lg font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-[#E07A5F] bg-[#E4ECFF]"
                  />
                ) ) }
              </div>
              { errors.otp && (
                <p className="text-red-500 text-sm text-center mb-4">
                  { errors.otp.message }
                </p>
              ) }

              <button
                type="submit"
                className="w-full bg-[#E07A5F] text-white px-3 py-3 rounded-md cursor-pointer hover:bg-[#d96b57] font-semibold"
              >
                Continue
              </button>
            </form>

            <div className="flex flex-col items-center mt-6">
              <p className="mt-4 text-lg">
                Didn’t Get the OTP Yet?{ " " }
                <Link
                  to="/signup"
                  className="text-[#2F6F6D] hover:underline"
                >
                  Resend OTP
                </Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
