import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");
  const isProfileComplete = localStorage.getItem("isprofilecompleted") === "true";
  const hasSubscription = localStorage.getItem("has_subscription") === "true";

  if (token) {
    // Check subscription first - if no subscription, redirect to subscription page
    if (!hasSubscription) {
      return <Navigate to="/subscription" replace />;
    }
    
    if (!isProfileComplete) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
