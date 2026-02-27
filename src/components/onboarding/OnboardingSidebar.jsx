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
        title: "Mailerlite",
        subtitle: "Email Integration",
    },
    {
        id: 4,
        title: "Confirmation & Review",
        subtitle: "Transparency",
    },
];

const OnboardingSidebar = ({ currentStep }) => {
    return (
        <div
            className="h-full w-full bg-cover bg-center bg-no-repeat flex flex-col relative"
            style={{ backgroundImage: `url(${OnboardingBg})` }}
        >
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-white/5 pointer-events-none" />

            {/* Logo area */}
            <div className="relative z-10 p-6 md:p-10 lg:pl-12 lg:pt-12">
                <img src={Logo} alt="AuthorSwap Logo" className="w-[140px] md:w-[160px] h-auto drop-shadow-sm" />
            </div>

            {/* Centered navigation menu */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-10 lg:pl-20 -mt-10">
                <div className="max-w-[360px]">
                    <h2 className="text-[#374151] text-[18px] md:text-[20px] font-medium mb-12 leading-relaxed tracking-tight">
                        Complete the following steps to set up your profile.
                    </h2>

                    <div className="relative">
                        {steps.map((step, index) => {
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            const isGreen = isActive || isCompleted;

                            return (
                                <div key={step.id} className="relative flex items-start gap-8 pb-10 last:pb-0 group">
                                    {/* Connector Line */}
                                    {index !== steps.length - 1 && (
                                        <div className="absolute left-[13px] top-[28px] w-[1.5px] h-[calc(100%-8px)]">
                                            <div
                                                className={`w-full h-full transition-colors duration-500 ${isCompleted ? "bg-[#34A853]" : "bg-[#D1D5DB]"}`}
                                            />
                                        </div>
                                    )}

                                    {/* Circle Indicator with Tick */}
                                    <div
                                        className={`relative z-10 shrink-0 w-[26px] h-[26px] rounded-full flex items-center justify-center transition-all duration-500 border
                                            ${isGreen
                                                ? "bg-[#34A853] border-[#34A853]"
                                                : "bg-[#BCBCBC] border-[#BCBCBC]"
                                            }`}
                                    >
                                        <svg width="12" height="9" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1.5 5.5L5 9L12.5 1.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>

                                    {/* Text Labels */}
                                    <div className="-mt-1">
                                        <h3 className={`text-[17px] md:text-[18px] font-bold tracking-tight transition-colors duration-300 ${isActive || isCompleted ? "text-gray-900" : "text-gray-500"}`}>
                                            {step.title}
                                        </h3>
                                        <p className={`text-[13px] md:text-[14px] font-medium mt-0.5 transition-colors duration-300 ${isActive || isCompleted ? "text-gray-600" : "text-gray-400"}`}>
                                            {step.subtitle}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingSidebar;
