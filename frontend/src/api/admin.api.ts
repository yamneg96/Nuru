import api from "./client"
import type {
  AuthResponse,
  UserProfile,
  AdminDashboardStats,
  AdminEngagement,
  AdminProfessionalAnalytics,
  Professional,
  Module,
  Article,
  Video,
  Quiz,
  NuruEvent,
  PublicReport,
  Appointment,
  MessageResponse,
  DashboardConfig,
  ProgressSummary,
} from "@/types"

// ── Auth ──────────────────────────────────────────────────────

export async function adminLogin(
  email: string,
  password: string
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>("/auth/admin/login", {
    email,
    password,
  })
  return data
}

export async function verifyAdmin(): Promise<{
  verified: boolean
  role: string
}> {
  const { data } = await api.get<{ verified: boolean; role: string }>(
    "/auth/admin/verify"
  )
  return data
}

export async function registerAdmin(payload: {
  name: string
  email: string
  password: string
  role?: "admin" | "super_admin"
}): Promise<UserProfile> {
  const { data } = await api.post<UserProfile>(
    "/auth/admin/register",
    payload
  )
  return data
}

// ── Dashboard ────────────────────────────────────────────────

export async function getDashboardConfig(): Promise<DashboardConfig> {
  const { data } = await api.get<DashboardConfig>("/dashboard/config")
  return data
}

export async function getAdminStats(): Promise<AdminDashboardStats> {
  const { data } = await api.get<AdminDashboardStats>("/dashboard/stats")
  return data
}

export async function getAdminEngagement(): Promise<AdminEngagement> {
  const { data } = await api.get<AdminEngagement>("/dashboard/engagement")
  return data
}

export async function getAdminProfessionalAnalytics(): Promise<AdminProfessionalAnalytics> {
  const { data } = await api.get<AdminProfessionalAnalytics>(
    "/dashboard/professionals"
  )
  return data
}

// ── Admin User Management ────────────────────────────────────

export async function getAdminUsers(): Promise<UserProfile[]> {
  const { data } = await api.get<UserProfile[]>("/admin/users")
  return data
}

export async function createAdminUser(payload: {
  email: string
  name: string
  password: string
  role?: "admin" | "super_admin"
}): Promise<UserProfile> {
  const { data } = await api.post<UserProfile>("/admin/users", payload)
  return data
}

export async function updateAdminUser(
  id: string,
  payload: { name?: string; password?: string; role?: "admin" | "super_admin" }
): Promise<UserProfile> {
  const { data } = await api.put<UserProfile>(`/admin/users/${id}`, payload)
  return data
}

export async function deleteAdminUser(
  id: string
): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(`/admin/users/${id}`)
  return data
}

export async function getAdminProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/admin/profile")
  return data
}

export async function updateAdminProfile(payload: {
  name?: string
  password?: string
}): Promise<UserProfile> {
  const { data } = await api.put<UserProfile>("/admin/profile", payload)
  return data
}

// ── Admin Content ────────────────────────────────────────────

export async function getAllModules(): Promise<Module[]> {
  const { data } = await api.get<Module[]>("/content/modules/all")
  return data
}

export async function createModule(
  payload: Partial<Module>
): Promise<Module> {
  const { data } = await api.post<Module>("/content/modules", payload)
  return data
}

export async function updateModule(
  id: string,
  payload: Partial<Module>
): Promise<Module> {
  const { data } = await api.put<Module>(`/content/modules/${id}`, payload)
  return data
}

export async function deleteModule(id: string): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/content/modules/${id}`
  )
  return data
}

export async function getAllArticles(moduleId?: string): Promise<Article[]> {
  const { data } = await api.get<Article[]>("/content/articles", {
    params: { module_id: moduleId, all: "true" },
  })
  return data
}

export async function createArticle(
  payload: Partial<Article>
): Promise<Article> {
  const { data } = await api.post<Article>("/content/articles", payload)
  return data
}

export async function updateArticle(
  id: string,
  payload: Partial<Article>
): Promise<Article> {
  const { data } = await api.put<Article>(
    `/content/articles/${id}`,
    payload
  )
  return data
}

export async function deleteArticle(id: string): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/content/articles/${id}`
  )
  return data
}

export async function getAllVideos(moduleId?: string): Promise<Video[]> {
  const { data } = await api.get<Video[]>("/content/videos", {
    params: { module_id: moduleId, all: "true" },
  })
  return data
}

export async function createVideo(payload: Partial<Video>): Promise<Video> {
  const { data } = await api.post<Video>("/content/videos", payload)
  return data
}

export async function updateVideo(
  id: string,
  payload: Partial<Video>
): Promise<Video> {
  const { data } = await api.put<Video>(`/content/videos/${id}`, payload)
  return data
}

export async function deleteVideo(id: string): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/content/videos/${id}`
  )
  return data
}

// ── Admin Quiz ───────────────────────────────────────────────

export async function createQuiz(payload: Partial<Quiz>): Promise<Quiz> {
  const { data } = await api.post<Quiz>("/quiz", payload)
  return data
}

export async function updateQuiz(
  id: string,
  payload: Partial<Quiz>
): Promise<Quiz> {
  const { data } = await api.put<Quiz>(`/quiz/${id}`, payload)
  return data
}

export async function deleteQuiz(id: string): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(`/quiz/${id}`)
  return data
}

// ── Admin Professionals ──────────────────────────────────────

export async function getAdminProfessionals(
  status?: string
): Promise<Professional[]> {
  const { data } = await api.get<Professional[]>("/admin/professionals", {
    params: status ? { status } : undefined,
  })
  return data
}

export async function verifyProfessional(
  id: string,
  status: "verified" | "rejected"
): Promise<Professional> {
  const { data } = await api.put<Professional>(
    `/admin/professionals/${id}/verify`,
    { status }
  )
  return data
}

export async function adminUpdateProfessional(
  id: string,
  payload: Partial<Professional>
): Promise<Professional> {
  const { data } = await api.put<Professional>(
    `/admin/professionals/${id}`,
    payload
  )
  return data
}

export async function adminDeleteProfessional(
  id: string
): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/admin/professionals/${id}`
  )
  return data
}

// ── Admin Appointments ───────────────────────────────────────

export async function getAdminAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>("/admin/appointments")
  return data
}

// ── Admin Events ─────────────────────────────────────────────

export async function createEvent(
  payload: Partial<NuruEvent>
): Promise<NuruEvent> {
  const { data } = await api.post<NuruEvent>("/admin/events", payload)
  return data
}

export async function updateEvent(
  id: string,
  payload: Partial<NuruEvent>
): Promise<NuruEvent> {
  const { data } = await api.put<NuruEvent>(`/admin/events/${id}`, payload)
  return data
}

export async function deleteEvent(id: string): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(`/admin/events/${id}`)
  return data
}

export async function getEventAttendees(id: string): Promise<string[]> {
  const { data } = await api.get<string[]>(`/admin/events/${id}/attendees`)
  return data
}

// ── Admin Reports ────────────────────────────────────────────

export async function getReports(): Promise<PublicReport[]> {
  const { data } = await api.get<PublicReport[]>("/reports")
  return data
}

export async function getReport(id: string): Promise<PublicReport> {
  const { data } = await api.get<PublicReport>(`/reports/${id}`)
  return data
}

export async function generateReport(payload: {
  title: string
  period: { from: string; to: string }
  type: "monthly" | "quarterly" | "annual"
  summary_markdown?: string
}): Promise<PublicReport> {
  const { data } = await api.post<PublicReport>(
    "/admin/reports/generate",
    payload
  )
  return data
}

export async function updateReport(
  id: string,
  payload: Partial<PublicReport>
): Promise<PublicReport> {
  const { data } = await api.put<PublicReport>(
    `/admin/reports/${id}`,
    payload
  )
  return data
}

export async function publishReport(id: string): Promise<PublicReport> {
  const { data } = await api.put<PublicReport>(
    `/admin/reports/${id}/publish`
  )
  return data
}

export async function deleteReport(id: string): Promise<MessageResponse> {
  const { data } = await api.delete<MessageResponse>(
    `/admin/reports/${id}`
  )
  return data
}

// ── Progress ─────────────────────────────────────────────────

export async function getProgress(): Promise<ProgressSummary> {
  const { data } = await api.get<ProgressSummary>("/progress")
  return data
}

export async function markComplete(payload: {
  content_type: "article" | "video" | "quiz"
  content_id: string
  module_id?: string
  quiz_score?: number
  quiz_total?: number
  quiz_passed?: boolean
}): Promise<unknown> {
  const { data } = await api.post("/progress/complete", payload)
  return data
}
