import TelegramBot from "node-telegram-bot-api";
import { env } from "../../../config/env.js";
import { logger } from "../../../utils/logger.js";
import { handleTelegramMessage } from "./telegram.handler.js";

let bot: TelegramBot;

export const initTelegramBot = () => {
  if (!env.TELEGRAM_BOT_TOKEN) {
    logger.warn("Telegram bot token not set");
    return;
  }

  bot = new TelegramBot(env.TELEGRAM_BOT_TOKEN, {
    polling: true,
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "";

    try {
      const response = await handleTelegramMessage(chatId, text);
      await bot.sendMessage(chatId, response);
    } catch (err) {
      logger.error(err, "Telegram error");
      bot.sendMessage(chatId, "⚠️ Error occurred.");
    }
  });

  logger.info("✅ Telegram bot started");
};