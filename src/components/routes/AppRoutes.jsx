import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Signup from "../auth/SignUp";
import PublicRoute from "../routes/PublicRoutes";
import ProtectedRoute from "../routes/ProtectedRoutes";
import ForgetPassword from "../auth/ForgetPassword";
import OtpVerification from "../auth/OtpVerification";
import ResetPassword from "../auth/ResetPassword";


const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        
      </Route>
    </Routes>
  );
};

export default AppRoutes;
