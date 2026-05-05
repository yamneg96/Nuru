import { sendTextMessage, sendMessageWithButtons, answerCallbackQuery } from "../telegram.api.js";
import { sessionStore } from "../../core/session.store.js";
import { PLATFORMS, Language } from "../../shared/constants.js";
import { t } from "../bot-i18n.js";
import { getLanguageKeyboard, getMainMenuKeyboard } from "../telegram.keyboard.js";
import { conversationStore } from "../conversation.store.js";

export async function handleStartCommand(chatId: number, userId: string): Promise<void> {
  // Clear any existing conversation state
  conversationStore.clearState(chatId);
  
  // Show language selection
  const text = t("EN", "welcome");
  await sendMessageWithButtons(chatId, text, getLanguageKeyboard());
}

export async function handleLanguageSelection(
  chatId: number,
  userId: string,
  callbackQueryId: string,
  data: string
): Promise<void> {
  const langStr = data.replace("lang_", "");
  const lang = (langStr === "AM" || langStr === "OR") ? langStr : "EN";

  // Update session
  sessionStore.getOrCreate(userId, PLATFORMS.TELEGRAM);
  sessionStore.setLanguage(userId, lang as Language);

  // Acknowledge callback
  await answerCallbackQuery(callbackQueryId);

  // Send confirmation
  await sendTextMessage(chatId, t(lang as Language, "lang_saved"));

  // Show main menu
  const text = t(lang as Language, "menu_title");
  await sendMessageWithButtons(chatId, text, getMainMenuKeyboard(lang as Language));
}
