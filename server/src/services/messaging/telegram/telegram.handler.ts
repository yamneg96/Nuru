import type { TelegramUpdate } from "./telegram.api.js";
import { sendTextMessage, sendTypingIndicator } from "./telegram.api.js";
import { handleMessage } from "../core/message.router.js";
import { PLATFORMS } from "../shared/constants.js";
import { logger } from "../../../utils/logger.js";

export async function processTelegramUpdate(
  update: TelegramUpdate
): Promise<void> {
  const message = update.message;
  if (!message?.chat?.id) return;

  const chatId = message.chat.id;
  const text = message.text;
  const isText = typeof text === "string";

  try {
    await sendTypingIndicator(chatId);

    const response = await handleMessage({
      text: text ?? "",
      userId: String(chatId),
      platform: PLATFORMS.TELEGRAM,
      isText,
    });

    await sendTextMessage(chatId, response.text);
  } catch (err) {
    logger.error({ err, chatId }, "Failed to handle Telegram message");

    try {
      await sendTextMessage(
        chatId,
        "⚠️ Something went wrong. Please try again."
      );
    } catch {
      logger.error({ chatId }, "Failed to send error message to user");
    }
  }
}