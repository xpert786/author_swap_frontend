import { Routes, Route, Navigate } from "react-router-dom";
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
import SwapPartner from "../pages/SwapPartner/SwapPartner";
import SwapDetails from "../pages/SwapPartner/SwapDetails";
import CommunicationTools from "../pages/CommunicationTools";
import AccountSettings from "../pages/AccountSettings";
import AuthorReputationSystem from "../pages/AuthorReputation/AuthorReputationSystem";
import Newsletter from "../pages/newsletters/Newsletter";
import { SwapManagement, Analytics } from "../pages/PlaceholderPages";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ROOT REDIRECT */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

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
          <Route path="/swap-partner" element={<SwapPartner />} />
          <Route path="/swap-details" element={<SwapDetails />} />
          <Route path="/communication" element={<CommunicationTools />} />
          <Route path="/account-settings" element={<AccountSettings />} />
          <Route path="/newsletter" element={<Newsletter />} />
          <Route path="/swap-management" element={<SwapManagement />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/reputation" element={<AuthorReputationSystem />} />
        </Route>

      </Route>

    </Routes>
  );
};

export default AppRoutes;
