import type { BotResponse, Platform } from "../shared/constants.js";
import { PLATFORMS } from "../shared/constants.js";
import { sendTextMessage as telegramSendText } from "../telegram/telegram.api.js";
import { whatsappSend } from "../whatsapp/whatsapp.api.js";
import { logger } from "../../../utils/logger.js";

export async function sendMessage(
  platform: Platform,
  recipientId: string,
  response: BotResponse
): Promise<void> {
  try {
    switch (platform) {
      case PLATFORMS.TELEGRAM:
        await telegramSendText(Number(recipientId), response.text);
        break;

      case PLATFORMS.WHATSAPP:
        await whatsappSend(recipientId, response.text);
        break;

      default:
        logger.warn({ platform, recipientId }, "Unknown platform for sendMessage");
    }
  } catch (err) {
    logger.error({ err, platform, recipientId }, "Failed to send message");
    throw err;
  }
}
