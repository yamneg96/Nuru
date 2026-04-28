import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute, PublicRoute } from "@/components/guards";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import OnboardingPage from "@/pages/OnboardingPage";
import SafelyPage from "@/pages/SafelyPage";
import DashboardPage from "@/pages/DashboardPage";
import ChatPage from "@/pages/ChatPage";
import DecisionFlowPage from "@/pages/DecisionFlowPage";
import ExplorePage from "@/pages/ExplorePage";
import ServicesPage from "@/pages/ServicesPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (no layout shell) */}
        <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* Onboarding (no bottom nav) */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/safely" element={<SafelyPage />} />

        {/* Chat has its own full-screen layout */}
        <Route path="/chat" element={<ChatPage />} />

        {/* Decision flow has its own layout */}
        <Route path="/decision" element={<DecisionFlowPage />} />

        {/* App shell routes (header + bottom nav) */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
