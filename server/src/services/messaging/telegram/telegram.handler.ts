import type { TelegramUpdate } from "./telegram.api.js";
import { sendTextMessage, sendTypingIndicator, answerCallbackQuery } from "./telegram.api.js";
import { handleMessage } from "../core/message.router.js";
import { PLATFORMS } from "../shared/constants.js";
import { logger } from "../../../utils/logger.js";
import { handleStartCommand, handleLanguageSelection } from "./handlers/start.handler.js";
import { handleMainMenu } from "./handlers/menu.handler.js";
import { handleDecisionMenu, handleDecisionFlowStart, handleDecisionAnswer } from "./handlers/decision.handler.js";
import { handleProfessionalMenu, handleProfessionalSearch } from "./handlers/professional.handler.js";
import { handleSupportMenu, handleSupportMessage } from "./handlers/support.handler.js";
import { conversationStore } from "./conversation.store.js";

export async function processTelegramUpdate(
  update: TelegramUpdate
): Promise<void> {
  try {
    // 1. Handle Callback Queries (Button Presses)
    if (update.callback_query) {
      const cb = update.callback_query;
      const chatId = cb.message?.chat.id;
      const userId = String(cb.from.id);
      const data = cb.data;

      if (!chatId || !data) return;

      if (data.startsWith("lang_")) {
        await handleLanguageSelection(chatId, userId, cb.id, data);
      } else if (data === "menu_main") {
        await handleMainMenu(chatId, userId, cb.id);
      } else if (data === "menu_decision") {
        await handleDecisionMenu(chatId, userId, cb.id);
      } else if (data.startsWith("flow_")) {
        await handleDecisionFlowStart(chatId, userId, cb.id, data);
      } else if (data.startsWith("ans_")) {
        await handleDecisionAnswer(chatId, userId, cb.id, data);
      } else if (data === "menu_professional") {
        await handleProfessionalMenu(chatId, userId, cb.id);
      } else if (data.startsWith("prof_type_")) {
        await handleProfessionalSearch(chatId, userId, cb.id, data);
      } else if (data === "menu_support") {
        await handleSupportMenu(chatId, userId, cb.id);
      } else {
        await answerCallbackQuery(cb.id);
      }
      return;
    }

    // 2. Handle Text Messages
    const message = update.message;
    if (!message?.chat?.id) return;

    const chatId = message.chat.id;
    const userId = String(message.from?.id || chatId);
    const text = message.text;
    const username = message.from?.username;

    await sendTypingIndicator(chatId);

    // Commands
    if (text === "/start") {
      await handleStartCommand(chatId, userId);
      return;
    }

    if (text === "/menu") {
      await handleMainMenu(chatId, userId);
      return;
    }

    // Check conversation state
    const state = conversationStore.getState(chatId);
    if (state.flow === "support" && text) {
      await handleSupportMessage(chatId, userId, text, username);
      return;
    }
    
    // If we're in the middle of a decision flow and get text, ignore or guide back
    if (state.flow === "decision") {
      await sendTextMessage(chatId, "Please use the buttons to answer, or type /start to restart.");
      return;
    }

    // Fallback: use core message router (NLP intent detection)
    const isText = typeof text === "string";
    const response = await handleMessage({
      text: text ?? "",
      userId,
      platform: PLATFORMS.TELEGRAM,
      isText,
    });

    await sendTextMessage(chatId, response.text);
    
  } catch (err) {
    logger.error({ err, update }, "Failed to handle Telegram update");
    const chatId = update.message?.chat.id || update.callback_query?.message?.chat.id;
    if (chatId) {
      try {
        await sendTextMessage(chatId, "⚠️ Something went wrong. Please try again.");
      } catch (e) {
        // Ignore secondary error
      }
    }
  }
}