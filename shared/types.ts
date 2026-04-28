// ============================================================
// Nuru — Shared Type Definitions (Client + Server)
// ============================================================

// ── Auth ──────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  anonymous_id: string;
}

export interface UserProfile {
  anonymous_id: string;
  created_at: string;
  last_active: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  language: "english" | "amharic" | "oromo";
  save_history: boolean;
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

export type FlowType = "missed_period" | "relationship_pressure" | "contraception" | "general_advice";

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
  name: string;
  type: "clinic" | "pharmacy" | "counseling" | "hospital";
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

export interface PublicMetrics {
  total_users: number;
  active_users: number;
  total_questions: number;
}

// ── Learning Content ─────────────────────────────────────────

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
