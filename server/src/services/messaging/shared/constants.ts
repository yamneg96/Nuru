export const PLATFORMS = {
  TELEGRAM: "telegram",
  WHATSAPP: "whatsapp",
} as const;

export type Platform = typeof PLATFORMS[keyof typeof PLATFORMS];

export const INTENTS = {
  HELP: "HELP",
  DOCTOR: "DOCTOR",
  MENTAL_HEALTH: "MENTAL_HEALTH",
  SRH: "SRH",
  GENERAL: "GENERAL",
} as const;

export type Intent = typeof INTENTS[keyof typeof INTENTS];