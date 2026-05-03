import type { BotResponse, Intent, Language, TemplateKey } from "../shared/constants.js";
import { INTENTS } from "../shared/constants.js";
import { getTemplate } from "../shared/templates/index.js";

const MEDICAL_INTENTS: Set<Intent> = new Set([
  INTENTS.SRH,
  INTENTS.MENTAL_HEALTH,
  INTENTS.SUBSTANCE_USE,
  INTENTS.DOCTOR,
]);

const INTENT_TO_TEMPLATE: Record<Intent, TemplateKey> = {
  [INTENTS.HELP]: "help",
  [INTENTS.DOCTOR]: "doctor",
  [INTENTS.MENTAL_HEALTH]: "mental_health",
  [INTENTS.SRH]: "srh",
  [INTENTS.GENERAL]: "fallback",
  [INTENTS.SUBSTANCE_USE]: "substance_use",
  [INTENTS.NUTRITION]: "nutrition",
  [INTENTS.GREETING]: "greeting",
};

export function generateResponse(intent: Intent, lang: Language): BotResponse {
  const templateKey = INTENT_TO_TEMPLATE[intent] ?? "fallback";
  const text = getTemplate(templateKey, lang);

  const disclaimer = MEDICAL_INTENTS.has(intent)
    ? getDisclaimerForLang(lang)
    : undefined;

  return {
    text,
    intent,
    lang,
    disclaimer,
  };
}

function getDisclaimerForLang(lang: Language): string {
  const disclaimers: Record<Language, string> = {
    EN: "⚠️ Nuru provides guidance only. This is not a medical diagnosis. Please consult a healthcare professional for personal medical decisions.",
    AM: "⚠️ ኑሩ መረጃ ብቻ ነው የሚሰጠው። ይህ የሕክምና ምርመራ አይደለም። ለግል የሕክምና ውሳኔዎች የጤና ባለሙያን ያማክሩ።",
    OR: "⚠️ Nuru gorsa qofa kenna. Kun qorannoo yaalaa miti. Murtii yaalaa dhuunfaaf ogeessa fayyaa mariisiisi.",
  };

  return disclaimers[lang] ?? disclaimers.EN;
}