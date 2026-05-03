// ============================================================
// Nuru — Frontend Type Definitions (mirrors backend API shapes)
// ============================================================

// ── Auth ──────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  anonymous_id?: string;
  user: UserProfile;
}

export interface UserProfile {
  _id?: string;
  anonymous_id: string;
  role: "user" | "admin" | "super_admin";
  name?: string;
  email?: string;
  created_at: string;
  last_active: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: "english" | "amharic" | "oromo" | "somali";
  save_history: boolean;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminRegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: "admin" | "super_admin";
}

// ── Chat ──────────────────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  message: string;
  conversation_id?: string;
}

export interface ChatResponse {
  reply: string;
  conversation_id: string;
}

// ── Decision Engine ──────────────────────────────────────────

export type FlowType =
  | "missed_period"
  | "relationship_pressure"
  | "contraception"
  | "sti_risk"
  | "pregnancy_options"
  | "mental_health_support"
  | "general_advice";

export interface DecisionStartRequest {
  flow_type: FlowType;
}

export interface DecisionStartResponse {
  session_id: string;
  flow_type: FlowType;
  current_step: number;
  total_steps: number;
  question: DecisionQuestion;
}

export interface DecisionQuestion {
  id: string;
  text: string;
  subtitle?: string;
  type: "single_choice" | "multiple_choice";
  options: DecisionOption[];
}

export interface DecisionOption {
  value: string;
  label: string;
  icon?: string;
}

export interface DecisionStepRequest {
  session_id: string;
  answer: string | string[];
}

export interface DecisionStepResponse {
  session_id: string;
  current_step: number;
  total_steps: number;
  question?: DecisionQuestion;
  completed: boolean;
}

export interface DecisionResult {
  session_id: string;
  flow_type: FlowType;
  risk_level: "low" | "moderate" | "high";
  summary: string;
  advice: string[];
  next_steps: NextStep[];
  ai_explanation?: string;
}

export interface NextStep {
  title: string;
  description: string;
  icon: string;
  action: string;
  action_type: "navigate" | "external" | "chat";
}

// ── Services ─────────────────────────────────────────────────

export interface ServiceLocation {
  _id?: string;
  name: string;
  type: "clinic" | "pharmacy" | "counseling" | "hospital" | "youth_center";
  address: string;
  distance: string;
  area: string;
  services: string[];
  tags: string[];
  verified: boolean;
  phone?: string;
  coordinates?: { lat: number; lng: number };
}

// ── Metrics ──────────────────────────────────────────────────

export interface Testimonial {
  _id: string;
  rating: number;
  comment: string;
  user_age?: number;
  user_type?: string;
  context: string;
  created_at: string;
}

export interface PublicMetrics {
  total_users: number;
  active_users?: number;
  total_questions: number;
  total_events: number;
  upcoming_events?: NuruEvent[];
  featured_videos?: Video[];
  testimonials?: Testimonial[];
}

// ── Content (Modules, Articles, Videos) ──────────────────────

export interface Module {
  _id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: "primary" | "secondary" | "tertiary";
  order: number;
  featured: boolean;
  published: boolean;
  content_markdown?: string;
  article_count?: number;
  video_count?: number;
  created_at: string;
}

export interface Article {
  _id: string;
  module_id: string | { _id: string; title: string; slug: string };
  title: string;
  slug: string;
  content_markdown: string;
  summary: string;
  badge?: string;
  image_url?: string;
  video_id?: string;
  order: number;
  published: boolean;
  created_at: string;
}

export interface Video {
  _id: string;
  module_id: string | { _id: string; title: string; slug: string };
  title: string;
  description: string;
  source_type: "youtube" | "local";
  source_url: string;
  thumbnail_url: string;
  duration: string;
  order: number;
  published: boolean;
  created_at: string;
}

// ── Quiz ─────────────────────────────────────────────────────

export interface QuizQuestion {
  text: string;
  options: string[];
  correct_index?: number;
  explanation?: string;
}

export interface Quiz {
  _id: string;
  module_id?: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  published: boolean;
  created_at: string;
}

export interface QuizResult {
  score: number;
  total: number;
  percentage: number;
  results: {
    question: string;
    isCorrect: boolean;
    correct_index: number;
    explanation?: string;
  }[];
}

// ── Professionals ────────────────────────────────────────────

export interface Professional {
  _id: string;
  full_name: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  bio: string;
  type:
    | "medical"
    | "counselor"
    | "therapist"
    | "psychiatrist"
    | "trainer"
    | "content_creator"
    | "influencer";
  specializations: string[];
  license_number?: string;
  institution: string;
  years_of_experience: number;
  availability: {
    online: boolean;
    offline: boolean;
    schedule?: string;
  };
  city: string;
  region: string;
  coordinates?: {
    type: string;
    coordinates: [number, number];
  };
  social_links?: {
    instagram?: string;
    tiktok?: string;
    youtube?: string;
    telegram?: string;
    linkedin?: string;
  };
  verification_status: "pending" | "verified" | "rejected";
  is_active: boolean;
  rating: number;
  rating_count: number;
  sessions_completed: number;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
}

export interface ProfessionalRegistration {
  full_name: string;
  email: string;
  phone: string;
  photo_url?: string;
  bio: string;
  type: Professional["type"];
  specializations: string[];
  license_number?: string;
  institution: string;
  years_of_experience: number;
  availability: {
    online: boolean;
    offline: boolean;
    schedule?: string;
  };
  city: string;
  region: string;
  coordinates: { lat: number; lng: number };
  social_links?: Professional["social_links"];
}

// ── Appointments ─────────────────────────────────────────────

export interface Appointment {
  _id: string;
  user_id: string;
  professional_id:
    | string
    | {
        _id: string;
        full_name: string;
        photo_url?: string;
        type: string;
        email?: string;
        phone?: string;
      };
  appointment_date: string;
  duration_minutes: number;
  type: "online" | "offline";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  cancelled_by?: "user" | "professional" | "admin";
  cancellation_reason?: string;
  user_rating?: number;
  user_review?: string;
  created_at: string;
}

export interface BookAppointmentRequest {
  professional_id: string;
  appointment_date: string;
  duration_minutes?: number;
  type: "online" | "offline";
  notes?: string;
}

// ── Events ───────────────────────────────────────────────────

export interface NuruEvent {
  _id: string;
  title: string;
  description: string;
  type: "workshop" | "talk" | "gathering" | "webinar" | "other";
  category: "health" | "career" | "social" | "education";
  date: string;
  location_name: string;
  is_online: boolean;
  meeting_link?: string;
  organizer: string;
  max_attendees?: number;
  attendee_count: number;
  image_url?: string;
  created_at: string;
}

// ── Reports ──────────────────────────────────────────────────

export interface PublicReport {
  _id: string;
  title: string;
  period: { from: string; to: string };
  type: "monthly" | "quarterly" | "annual";
  metrics: {
    users_served: number;
    conversations_held: number;
    modules_completed: number;
    events_held: number;
    professionals_active: number;
    risk_assessments_completed: number;
    top_topics: string[];
  };
  summary_markdown: string;
  published: boolean;
  published_at?: string;
  created_at: string;
}

// ── Dashboard ────────────────────────────────────────────────

export interface DashboardConfig {
  recommended_modules: Module[];
  continue_learning: Module[];
  quick_actions: {
    id: string;
    title: string;
    icon: string;
    description: string;
    flow_type: string;
  }[];
}

export interface AdminDashboardStats {
  users: { total: number };
  professionals: { total: number; active: number };
  activity: {
    appointments: number;
    events: number;
    messages: number;
  };
}

export interface AdminEngagement {
  daily_registrations: { _id: string; count: number }[];
  daily_messages: { _id: string; count: number }[];
}

export interface AdminProfessionalAnalytics {
  top_performers: {
    full_name: string;
    type: string;
    rating: number;
    sessions_completed: number;
  }[];
  distribution_by_type: {
    _id: string;
    count: number;
    avgRating: number;
  }[];
}

// ── Progress ─────────────────────────────────────────────────

export interface UserProgressRecord {
  _id: string;
  anonymous_id: string;
  content_type: "article" | "video" | "quiz";
  content_id: string;
  module_id?: string;
  quiz_score?: number;
  quiz_total?: number;
  quiz_passed?: boolean;
  completed_at: string;
}

export interface ProgressSummary {
  completions: UserProgressRecord[];
  modules: {
    module_id: string;
    title: string;
    slug: string;
    icon: string;
    total: number;
    done: number;
    percentage: number;
    completed: boolean;
  }[];
  total_completed: number;
}

// ── Learning Content (legacy compat) ─────────────────────────

export interface LearningCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  modules_count: number;
  progress?: number;
}

export interface LearningArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  type: "article" | "video" | "interactive";
  duration: string;
  image_url?: string;
}

// ── Generic API helpers ──────────────────────────────────────

export interface ApiError {
  code: string;
  message: string;
}

export interface MessageResponse {
  message: string;
}
