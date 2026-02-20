import { useState } from "react";
import OnboardingSidebar from "./OnboardingSidebar";
import AccountBasics from "./AccountBasics";
import OnlinePresence from "./OnlinePresence";
import Confirmation from "./Confirmation";
import { useNavigate } from "react-router-dom";

const OnboardingLayout = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  // collect data from each step
  const next = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const prev = () => {
    setStep((prev) => prev - 1);
  };

  const finish = async () => {
    localStorage.setItem("isProfileComplete", "true");
    console.log("Final Data:", formData);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white overflow-hidden">

      {/* Static Sidebar - 50% width on large screens */}
      <div className="w-full lg:w-1/2 h-auto lg:h-screen lg:fixed lg:top-0 lg:left-0 z-30">
        <OnboardingSidebar currentStep={step} />
      </div>

      {/* Scrollable Content - 50% width on large screens */}
      <div className="flex-1 lg:ml-[50%] min-h-screen flex items-start justify-center p-6 md:p-12 lg:p-16 2xl:p-24 bg-white">
        <div className="w-full max-w-[620px] transition-all duration-300">
          {step === 1 && <AccountBasics next={next} />}
          {step === 2 && (
            <OnlinePresence
              next={next}
              prev={prev}
            />
          )}
          {step === 3 && (
            <Confirmation
              prev={prev}
              finish={finish}
            />
          )}
        </div>
      </div>

    </div>
  );
};

export default OnboardingLayout;
