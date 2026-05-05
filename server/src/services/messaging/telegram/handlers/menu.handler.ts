import { sendMessageWithButtons, answerCallbackQuery } from "../telegram.api.js";
import { sessionStore } from "../../core/session.store.js";
import { Language } from "../../shared/constants.js";
import { t } from "../bot-i18n.js";
import { getMainMenuKeyboard } from "../telegram.keyboard.js";
import { conversationStore } from "../conversation.store.js";

export async function handleMainMenu(
  chatId: number,
  userId: string,
  callbackQueryId?: string
): Promise<void> {
  const session = sessionStore.get(userId);
  const lang = session?.lang || "EN";

  // Clear state when returning to main menu
  conversationStore.clearState(chatId);

  if (callbackQueryId) {
    await answerCallbackQuery(callbackQueryId);
  }

  const text = t(lang, "menu_title");
  await sendMessageWithButtons(chatId, text, getMainMenuKeyboard(lang));
}
