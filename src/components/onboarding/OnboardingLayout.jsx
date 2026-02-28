import { useState } from "react";
import OnboardingSidebar from "./OnboardingSidebar";
import AccountBasics from "./AccountBasics";
import OnlinePresence from "./OnlinePresence";
import Mailerlite from "./Mailerlite";
import Confirmation from "./Confirmation";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getProfile } from "../../apis/onboarding";

const OnboardingLayout = () => {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isMailerliteConnected, setIsMailerliteConnected] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExisting = async () => {
      try {
        const res = await getProfile();
        if (res.data.mailerlite_api_key) {
          setIsMailerliteConnected(true);
          setFormData(prev => ({ ...prev, mailerlite_api_key: res.data.mailerlite_api_key }));
        }
      } catch (e) { }
    }
    fetchExisting();
  }, [])

  const next = (data) => {
    const updatedData = { ...formData, ...data };
    setFormData(updatedData);

    if (data.mailerlite_api_key) {
      setIsMailerliteConnected(true);
    }

    setStep((prev) => {
      let newStep = prev + 1;
      // Skip Mailerlite if we just came from step 2 and already have a key
      if (newStep === 3 && (updatedData.mailerlite_api_key || isMailerliteConnected)) {
        newStep = 4;
      }
      if (newStep > maxStep) setMaxStep(newStep);
      return newStep;
    });
  };

  const prev = () => {
    setStep((prev) => prev - 1);
  };

  const goToStep = (stepNumber) => {
    setStep(stepNumber);
  };

  const finish = async () => {
    localStorage.setItem("isProfileComplete", "true");
    console.log("Final Data:", formData);
    navigate("/dashboard");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white overflow-hidden">
      <div className="w-full lg:w-1/2 h-auto lg:h-screen lg:fixed lg:top-0 lg:left-0 z-30">
        <OnboardingSidebar currentStep={step} maxStep={maxStep} />
      </div>

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
            <Mailerlite
              next={next}
              prev={prev}
            />
          )}
          {step === 4 && (
            <Confirmation
              prev={prev}
              finish={finish}
              goToStep={goToStep}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
