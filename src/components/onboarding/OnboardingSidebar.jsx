import Logo from "../../assets/logo.png";
import OnboardingBg from "../../assets/account-bg.jpg";

const steps = [
    {
        id: 1,
        title: "Account Basics",
        subtitle: "Identity",
    },
    {
        id: 2,
        title: "Online Presence",
        subtitle: "Credibility & trust",
    },
    {
        id: 3,
        title: "Confirmation & Review",
        subtitle: "Transparency",
    },
];

const OnboardingSidebar = ( { currentStep } ) =>
{
    return (
        <div
            className="min-h-[40vh] md:min-h-screen bg-cover bg-center bg-no-repeat flex flex-col px-6 md:px-10 py-8 md:py-12"
            style={ { backgroundImage: `url(${ OnboardingBg })` } }
        >
            <img src={ Logo } alt="AuthorSwap Logo" style={ { width: "360px", height: "60px" } } />
            <div className="flex flex-1 items-center justify-center">
                <div className="w-full max-w-xl">
                    <p className="text-[#111827] mb-12 text-xl leading-relaxed text-center">
                        Complete the following steps to set up your profile.
                    </p>

                    <div className="relative mx-auto w-fit">

                        { steps.map( ( step, index ) =>
                        {
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <div key={ step.id } className="flex items-start gap-7 relative pb-12">
                                    { index !== steps.length - 1 && (
                                        <div
                                            className={ `absolute left-3 top-6 w-[2px] h-full 
                ${ isCompleted ? "bg-green-500" : "bg-gray-300" }` }
                                        />
                                    ) }
                                    <div
                                        className={ `z-10 flex items-center justify-center w-6 h-6 rounded-full border-2
              ${ isCompleted
                                                ? "bg-green-500 border-green-500"
                                                : isActive
                                                    ? "border-green-500 bg-white"
                                                    : "border-gray-300 bg-white"
                                            }` }
                                    >
                                        { isCompleted && (
                                            <span className="text-white text-xs font-bold leading-none">
                                                ✓
                                            </span>
                                        ) }
                                    </div>
                                    <div className="ml-6">
                                        <h3
                                            className={ `text-[25px] font-semibold ${ isActive ? "text-black" : "text-gray-600"
                                                }` }
                                        >
                                            { step.title }
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            { step.subtitle }
                                        </p>
                                    </div>
                                </div>
                            );
                        } ) }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingSidebar;
