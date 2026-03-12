import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";

const ProtectedRoute = () => {
  const location = useLocation();
  const { profile, subscription, loading } = useProfile();
  const token = localStorage.getItem("token");
  const isProfileComplete = localStorage.getItem("isprofilecompleted") === "true";
  
  // Fallback to localStorage if context hasn't loaded yet
  const hasSubscriptionLS = localStorage.getItem("has_subscription") === "true";
  const subscriptionExpiryLS = localStorage.getItem("subscription_expiry");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Check subscription from context, fallback to localStorage
  const hasActiveSubscription = subscription?.is_active || hasSubscriptionLS || false;
  const subscriptionExpiry = subscription?.active_until || subscription?.renew_date || subscriptionExpiryLS;
  
  // Check if subscription is expired
  const isSubscriptionExpired = subscriptionExpiry && new Date(subscriptionExpiry) < new Date();
  const canAccess = hasActiveSubscription && !isSubscriptionExpired;

  // Allow access to subscription page and onboarding even without subscription
  const isOnAllowedPage = location.pathname === "/subscription" || 
                          location.pathname === "/subscription/success" ||
                          location.pathname.startsWith("/onboarding");

  // If still loading profile, show nothing
  if (loading) {
    return null;
  }

  // If no active subscription and not on allowed pages, redirect to subscription
  if (!canAccess && !isOnAllowedPage) {
    return <Navigate to="/subscription" replace />;
  }

  // Only redirect to onboarding if profile is incomplete AND user has no active subscription
  if (!isProfileComplete && !canAccess && !location.pathname.startsWith("/onboarding")) {
    return <Navigate to="/onboarding" replace />;
  }

  if (isProfileComplete && location.pathname.startsWith("/onboarding")) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
