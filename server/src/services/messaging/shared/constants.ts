export const PLATFORMS = {
  TELEGRAM: "telegram",
  WHATSAPP: "whatsapp",
  WEB: "web",
} as const;

export type Platform = (typeof PLATFORMS)[keyof typeof PLATFORMS];

export const LANGUAGES = {
  EN: "EN",
  AM: "AM",
  OR: "OR",
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const DEFAULT_LANGUAGE: Language = LANGUAGES.EN;

export const LANGUAGE_NAMES: Record<Language, string> = {
  EN: "English",
  AM: "አማርኛ (Amharic)",
  OR: "Afaan Oromoo",
};

export const INTENTS = {
  HELP: "HELP",
  DOCTOR: "DOCTOR",
  MENTAL_HEALTH: "MENTAL_HEALTH",
  SRH: "SRH",
  GENERAL: "GENERAL",
  SUBSTANCE_USE: "SUBSTANCE_USE",
  NUTRITION: "NUTRITION",
  GREETING: "GREETING",
} as const;

export type Intent = (typeof INTENTS)[keyof typeof INTENTS];

export const COMMANDS = {
  START: "/start",
  HELP: "/help",
  DOCTOR: "/doctor",
  LANG: "/lang",
} as const;

export type Command = (typeof COMMANDS)[keyof typeof COMMANDS];

export interface Button {
  label: string;
  data: string;
}

export interface BotResponse {
  text: string;
  intent: Intent | null;
  lang: Language;
  buttons?: Button[];
  disclaimer?: string;
}

export interface UserSession {
  userId: string;
  platform: Platform;
  lang: Language;
  lastActivity: number;
  messageCount: number;
}

export type TemplateKey =
  | "welcome"
  | "help"
  | "doctor"
  | "mental_health"
  | "srh"
  | "fallback"
  | "lang_changed"
  | "unsupported_command"
  | "empty_message"
  | "error"
  | "escalation_confirm"
  | "greeting"
  | "substance_use"
  | "nutrition"
  | "rate_limited"
  | "non_text";