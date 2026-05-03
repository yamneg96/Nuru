import { INTENTS, Intent } from "../shared/constants.js";

export const detectIntent = async (text: string): Promise<Intent> => {
  const t = text.toLowerCase();

  if (t.includes("help")) return INTENTS.HELP;
  if (t.includes("doctor")) return INTENTS.DOCTOR;
  if (t.includes("stress") || t.includes("anxiety"))
    return INTENTS.MENTAL_HEALTH;
  if (t.includes("sex") || t.includes("pregnancy"))
    return INTENTS.SRH;

  return INTENTS.GENERAL;
};