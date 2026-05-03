import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProtectedRoute, PublicRoute } from "@/components/guards";
import { ThemeProvider } from "@/components/ThemeProvider";

/* ───────── PUBLIC ───────── */
import LandingPage from "@/pages/public/LandingPage";
import LoginPage from "@/pages/public/LoginPage";
import OnboardingPage from "@/pages/public/OnboardingPage";
import { PrivacyPolicyPage, TermsPage } from "@/pages/public/StaticPages";
import { ContactPage } from "@/pages/public/ContactPage";

/* ───────── CORE ───────── */
import DashboardPage from "@/pages/dashboard/DashboardPage";
import SettingsPage from "@/pages/settings/SettingsPage";
import SafelyPage from "@/pages/safety/SafelyPage";

/* ───────── AI / CORE FEATURES ───────── */
import ChatPage from "@/pages/chat/ChatPage";
import DecisionFlowPage from "@/pages/decision/DecisionFlowPage";

/* ───────── CONTENT ───────── */
import ExplorePage from "@/pages/content/ExplorePage";
import ModulePage from "@/pages/content/ModulePage";
import QuizPage from "@/pages/content/Quiz/QuizPage";

/* ───────── SERVICES ───────── */
import ServicesPage from "@/pages/services/ServicesPage";

/* ───────── FUTURE-READY (can lazy later) ───────── */
// import ArticlePage from "@/pages/content/ArticlePage";
// import VideoPage from "@/pages/content/VideoPage";
// import QuizResultPage from "@/pages/content/Quiz/QuizResultPage";

/* ───────── PHASE 2 ───────── */
import ProfessionalsPage from "@/pages/professionals/ProfessionalsPage";
import ProfessionalDetailPage from "@/pages/professionals/ProfessionalDetailPage";
import EventsPage from "@/pages/events/EventsPage";
import MyAppointmentsPage from "@/pages/appointments/MyAppointmentsPage";
import BookAppointmentPage from "@/pages/appointments/BookAppointmentPage";
import ReportsPage from "@/pages/reports/ReportsPage";

/* ───────── PHASE 3 (real-time — deferred) ───────── */
// import CommunitiesPage from "@/pages/community/CommunitiesPage";
// import ConversationsPage from "@/pages/messaging/ConversationsPage";
// import NotificationsPage from "@/pages/notifications/NotificationsPage";

/* ───────── ADMIN ───────── */
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminContentCMS from "@/pages/admin/AdminContentCMS";
import AdminEventManagement from "@/pages/admin/AdminEventManagement";
import AdminProfessionalVerification from "@/pages/admin/AdminProfessionalVerification";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>

          {/* ───────── PUBLIC ROUTES (NO LAYOUT) ───────── */}

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <PublicRoute>
                <OnboardingPage />
              </PublicRoute>
            }
          />

          {/* Static */}
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ───────── FULLSCREEN FLOWS (NO APP SHELL) ───────── */}

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/decision"
            element={
              <ProtectedRoute>
                <DecisionFlowPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/quiz"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/module/:id"
            element={
              <ProtectedRoute>
                <ModulePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/safely"
            element={
              <ProtectedRoute>
                <SafelyPage />
              </ProtectedRoute>
            }
          />

          {/* ───────── MAIN APP SHELL ───────── */}

          <Route element={<AppLayout />}>

            <Route
              path="/"
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/explore"
              element={
                <ProtectedRoute>
                  <ExplorePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/services"
              element={
                <ProtectedRoute>
                  <ServicesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />

            {/* ───────── PHASE 2 ROUTES ───────── */}

            <Route path="/professionals" element={<ProtectedRoute><ProfessionalsPage /></ProtectedRoute>} />
            <Route path="/professionals/:id" element={<ProtectedRoute><ProfessionalDetailPage /></ProtectedRoute>} />

            <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />

            <Route path="/appointments" element={<ProtectedRoute><MyAppointmentsPage /></ProtectedRoute>} />

            <Route path="/reports" element={<ReportsPage />} />

            {/* ───────── FUTURE (deferred) ───────── */}
            {/*
            <Route path="/communities" element={<CommunitiesPage />} />
            <Route path="/messages" element={<ConversationsPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            */}

          </Route>

          {/* ───────── ADMIN (ISOLATED — own layout) ───────── */}

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/content" element={<AdminContentCMS />} />
          <Route path="/admin/events" element={<AdminEventManagement />} />
          <Route path="/admin/professionals" element={<AdminProfessionalVerification />} />

          {/* Fullscreen flows outside app shell */}
          <Route path="/appointments/book/:professionalId" element={<ProtectedRoute><BookAppointmentPage /></ProtectedRoute>} />

          {/* ───────── FALLBACK ───────── */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}