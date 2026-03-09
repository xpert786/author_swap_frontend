import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem("token");
  const isProfileComplete = localStorage.getItem("isprofilecompleted") === "true";

  if (token) {
    if (!isProfileComplete) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
