import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const isProfileComplete =
    localStorage.getItem("isProfileComplete") === "true";

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (
    !isProfileComplete &&
    !location.pathname.startsWith("/onboarding")
  ) {
    return <Navigate to="/onboarding" replace />;
  }

  if (
    isProfileComplete &&
    location.pathname.startsWith("/onboarding")
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
