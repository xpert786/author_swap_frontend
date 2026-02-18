import { Routes, Route } from "react-router-dom";
import Login from "../auth/Login";
import Signup from "../auth/SignUp";
import PublicRoute from "../routes/PublicRoutes";
import ProtectedRoute from "../routes/ProtectedRoutes";
import ForgetPassword from "../auth/ForgetPassword";
import OtpVerification from "../auth/OtpVerification";
import ResetPassword from "../auth/ResetPassword";
import OnboardingLayout from "../onboarding/OnboardingLayout";
import MainLayout from "../layouts/MainLayout"; // adjust path if needed

// Example protected pages
import Dashboard from "../pages/Dashboard";
import BooksPage from "../pages/books/BooksPage";
import BookDetails from "../pages/books/BookDetails";

const AppRoutes = () => {
  return (
    <Routes>

      {/* PUBLIC ROUTES */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/otp-verification" element={<OtpVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>

        {/* Onboarding WITHOUT Sidebar */}
        <Route path="/onboarding" element={<OnboardingLayout />} />

        {/* All other protected routes WITH Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<BooksPage />} /> 
          <Route path="/books/:id" element={<BookDetails />} />
        </Route>

      </Route>

    </Routes>
  );
};

export default AppRoutes;
