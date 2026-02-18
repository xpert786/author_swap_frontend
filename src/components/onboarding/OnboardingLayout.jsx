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
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">

      {/* Left Side - Static */}
      <div className="w-full md:w-1/2 h-full">
        <OnboardingSidebar currentStep={step} />
      </div>

      {/* Right Side - Scrollable */}
      <div className="w-full md:w-1/2 h-full overflow-y-auto flex items-start justify-center p-6">
        <div className="w-full max-w-xl">
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
