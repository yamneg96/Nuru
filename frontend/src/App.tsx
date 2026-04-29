import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { ProtectedRoute, PublicRoute } from "@/components/guards"
import LandingPage from "@/pages/LandingPage"
import LoginPage from "@/pages/LoginPage"
import OnboardingPage from "@/pages/OnboardingPage"
import SafelyPage from "@/pages/SafelyPage"
import DashboardPage from "@/pages/DashboardPage"
import ChatPage from "@/pages/ChatPage"
import DecisionFlowPage from "@/pages/DecisionFlowPage"
import ExplorePage from "@/pages/ExplorePage"
import ServicesPage from "@/pages/ServicesPage"
import SettingsPage from "@/pages/SettingsPage"
import { ThemeProvider } from "@/components/ThemeProvider"

import QuizPage from "@/pages/QuizPage"
import ModulePage from "@/pages/ModulePage"
import { PrivacyPolicyPage, TermsPage, ContactPage } from "@/pages/StaticPages"

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes (no layout shell) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Onboarding (no bottom nav) */}
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/safely" element={<ProtectedRoute><SafelyPage /></ProtectedRoute>} />

          {/* Chat has its own full-screen layout */}
          <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />

          {/* Decision flow has its own layout */}
          <Route path="/decision" element={<ProtectedRoute><DecisionFlowPage /></ProtectedRoute>} />

          {/* Quiz and Module pages */}
          <Route path="/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/module/:id" element={<ProtectedRoute><ModulePage /></ProtectedRoute>} />

          {/* Static Pages */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* App shell routes (header + footer + bottom nav) */}
          <Route element={<AppLayout />}>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><ExplorePage /></ProtectedRoute>} />
            <Route path="/services" element={<ProtectedRoute><ServicesPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
