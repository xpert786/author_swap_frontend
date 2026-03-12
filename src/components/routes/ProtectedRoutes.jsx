import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isProfileComplete = localStorage.getItem("isprofilecompleted") === "true";
  const hasSubscription = localStorage.getItem("has_subscription") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Allow access to subscription page and onboarding even without subscription
  const isOnAllowedPage = location.pathname === "/subscription" || 
                          location.pathname === "/subscription/success" ||
                          location.pathname.startsWith("/onboarding");

  // If no subscription and not on allowed pages, redirect to subscription
  if (!hasSubscription && !isOnAllowedPage) {
    return <Navigate to="/subscription" replace />;
  }

  if (!isProfileComplete && !location.pathname.startsWith("/onboarding")) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isProfileComplete && location.pathname.startsWith("/onboarding")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
