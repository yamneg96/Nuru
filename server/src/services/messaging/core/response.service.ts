import { templates } from "../shared/templates.js";
import { Intent, INTENTS } from "../shared/constants.js";

export const generateResponse = async (intent: Intent): Promise<string> => {
  switch (intent) {
    case INTENTS.HELP:
      return templates.help;

    case INTENTS.DOCTOR:
      return templates.doctor;

    case INTENTS.MENTAL_HEALTH:
      return templates.mental;

    case INTENTS.SRH:
      return templates.srh;

    default:
      return templates.fallback;
  }
};