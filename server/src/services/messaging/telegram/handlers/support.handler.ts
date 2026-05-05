import { sendTextMessage, answerCallbackQuery } from "../telegram.api.js";
import { sessionStore } from "../../core/session.store.js";
import { Language } from "../../shared/constants.js";
import { t } from "../bot-i18n.js";
import { conversationStore } from "../conversation.store.js";

// Import SupportTicket model
let SupportTicket: any;
import("../../../../models/SupportTicket.js").then(m => SupportTicket = m.SupportTicket).catch(() => {});

export async function handleSupportMenu(
  chatId: number,
  userId: string,
  callbackQueryId: string
): Promise<void> {
  const session = sessionStore.get(userId);
  const lang = session?.lang || "EN";

  await answerCallbackQuery(callbackQueryId);
  
  conversationStore.setState(chatId, { flow: "support" });
  
  await sendTextMessage(chatId, t(lang, "support_prompt"));
}

export async function handleSupportMessage(
  chatId: number,
  userId: string,
  text: string,
  username?: string
): Promise<void> {
  const session = sessionStore.get(userId);
  const lang = session?.lang || "EN";

  try {
    if (SupportTicket) {
      await SupportTicket.create({
        user_id: userId,
        contact_email: username ? `@${username}` : `telegram_${userId}`,
        subject: "Telegram Support Request",
        message: text,
        category: "general",
        priority: "normal",
        source: "telegram",
        status: "open"
      });
    }
    
    // Clear state
    conversationStore.clearState(chatId);
    
    await sendTextMessage(chatId, t(lang, "support_sent"));
    
  } catch (error) {
    await sendTextMessage(chatId, t(lang, "error"));
  }
}
