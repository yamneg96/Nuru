import type { BotResponse, Platform } from "../shared/constants.js";
import { INTENTS, PLATFORMS } from "../shared/constants.js";
import { getTemplate } from "../shared/templates/index.js";
import { logger } from "../../../utils/logger.js";
import { sessionStore } from "./session.store.js";
import { parseCommand, handleCommand } from "./command.handler.js";
import { detectIntent } from "./intent.service.js";
import { generateResponse } from "./response.service.js";
import { escalateToHuman } from "./escalation.service.js";
import { rateLimiter } from "./rate-limiter.js";

export interface MessageInput {
  text: string;
  userId: string;
  platform: Platform;
  isText?: boolean;
}

export async function handleMessage(input: MessageInput): Promise<BotResponse> {
  const { text, userId, platform, isText = true } = input;

  try {
    const session = sessionStore.getOrCreate(userId, platform);
    sessionStore.touch(userId);

    if (!rateLimiter.isAllowed(userId)) {
      return {
        text: getTemplate("rate_limited", session.lang),
        intent: null,
        lang: session.lang,
      };
    }

    if (!isText) {
      return {
        text: getTemplate("non_text", session.lang),
        intent: null,
        lang: session.lang,
      };
    }

    const trimmedText = text?.trim() ?? "";

    if (!trimmedText) {
      return {
        text: getTemplate("empty_message", session.lang),
        intent: null,
        lang: session.lang,
      };
    }

    const parsed = parseCommand(trimmedText);
    if (parsed) {
      const commandResponse = await handleCommand(parsed, session);

      logger.info(
        { userId, platform, command: parsed.command, lang: session.lang },
        "Command processed"
      );

      return commandResponse;
    }

    const intent = detectIntent(trimmedText, session.lang);

    if (intent === INTENTS.DOCTOR) {
      await escalateToHuman(userId, trimmedText, platform);
    }

    const response = generateResponse(intent, session.lang);

    if (response.disclaimer) {
      response.text = `${response.text}\n\n${response.disclaimer}`;
    }

    logger.info(
      { userId, platform, intent, lang: session.lang },
      "Message processed"
    );

    return response;
  } catch (err) {
    logger.error(err, "Message handling failed");

    const fallbackLang = sessionStore.get(userId)?.lang ?? "EN";
    return {
      text: getTemplate("error", fallbackLang),
      intent: null,
      lang: fallbackLang,
    };
  }
}