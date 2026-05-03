import type { BotResponse, Language, UserSession } from "../shared/constants.js";
import { COMMANDS, LANGUAGES, LANGUAGE_NAMES, INTENTS } from "../shared/constants.js";
import { getTemplate } from "../shared/templates/index.js";
import { sessionStore } from "./session.store.js";
import { escalateToHuman } from "./escalation.service.js";

interface ParsedCommand {
  command: string;
  args: string[];
}

export function parseCommand(text: string): ParsedCommand | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith("/")) return null;

  const parts = trimmed.split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  return { command, args };
}

export async function handleCommand(
  parsed: ParsedCommand,
  session: UserSession
): Promise<BotResponse> {
  const { command, args } = parsed;
  const lang = session.lang;

  switch (command) {
    case COMMANDS.START:
      return {
        text: getTemplate("welcome", lang),
        intent: INTENTS.GREETING,
        lang,
      };

    case COMMANDS.HELP:
      return {
        text: getTemplate("help", lang),
        intent: INTENTS.HELP,
        lang,
      };

    case COMMANDS.DOCTOR: {
      await escalateToHuman(session.userId, "User requested /doctor command", session.platform);
      return {
        text: getTemplate("doctor", lang) + "\n\n" + getTemplate("escalation_confirm", lang),
        intent: INTENTS.DOCTOR,
        lang,
      };
    }

    case COMMANDS.LANG: {
      const requestedLang = args[0]?.toUpperCase() as Language | undefined;

      if (!requestedLang || !LANGUAGES[requestedLang as keyof typeof LANGUAGES]) {
        const available = Object.entries(LANGUAGE_NAMES)
          .map(([code, name]) => `• /lang ${code.toLowerCase()} — ${name}`)
          .join("\n");

        return {
          text: `${getTemplate("unsupported_command", lang)}\n\nAvailable languages:\n${available}`,
          intent: null,
          lang,
        };
      }

      sessionStore.setLanguage(session.userId, requestedLang);
      return {
        text: getTemplate("lang_changed", requestedLang),
        intent: null,
        lang: requestedLang,
      };
    }

    default:
      return {
        text: getTemplate("unsupported_command", lang),
        intent: null,
        lang,
      };
  }
}
