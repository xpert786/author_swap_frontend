import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useProfile } from "../../context/ProfileContext";

const ProtectedRoute = () => {
  const location = useLocation();
  const { subscription, loading } = useProfile();

  const token = localStorage.getItem("token");
  const isProfileComplete = localStorage.getItem("isprofilecompleted") === "true";

  // Fallback to localStorage if context hasn't loaded yet
  const hasSubscriptionLS = localStorage.getItem("has_subscription") === "true";
  const subscriptionExpiryLS = localStorage.getItem("subscription_expiry");

  // 1. No token → always go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Wait for profile to load before making decisions
  if (loading) {
    return null;
  }

  const isOnboarding = location.pathname.startsWith("/onboarding");
  const isSubscriptionPage =
    location.pathname === "/subscription" ||
    location.pathname === "/subscription/success";

  // 2. Profile not complete → must finish onboarding first
  if (!isProfileComplete) {
    if (isOnboarding) return <Outlet />;
    return <Navigate to="/onboarding" replace />;
  }

  // Profile is complete from here on.

  // Determine active subscription
  const subscriptionExpiry =
    subscription?.active_until || subscription?.renew_date || subscriptionExpiryLS;

  const isSubscriptionExpired =
    subscriptionExpiry ? new Date(subscriptionExpiry) < new Date() : false;

  const hasActiveSubscription =
    (subscription?.is_active === true || hasSubscriptionLS) &&
    !isSubscriptionExpired;

  // Sync localStorage if API says active
  if (subscription?.is_active === true && !hasSubscriptionLS) {
    localStorage.setItem("has_subscription", "true");
    if (subscriptionExpiry) {
      localStorage.setItem("subscription_expiry", subscriptionExpiry);
    }
  }

  // 3. Profile complete but no active subscription → only allow subscription pages
  if (!hasActiveSubscription) {
    if (isSubscriptionPage) return <Outlet />;
    return <Navigate to="/subscription" replace />;
  }

  // 4. Profile complete + active subscription → full access
  //    Prevent going back to onboarding once complete
  if (isOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;