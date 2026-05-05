import { sendTextMessage, sendMessageWithButtons, answerCallbackQuery } from "../telegram.api.js";
import { sessionStore } from "../../core/session.store.js";
import { Language } from "../../shared/constants.js";
import { t } from "../bot-i18n.js";
import { getProfessionalSpecialtyKeyboard, getBackKeyboard } from "../telegram.keyboard.js";
import { conversationStore } from "../conversation.store.js";

// Note: You can import Professional model directly or create a small service function.
let Professional: any;
import("../../../../models/Professional.js").then(m => Professional = m.Professional).catch(() => {});

export async function handleProfessionalMenu(
  chatId: number,
  userId: string,
  callbackQueryId: string
): Promise<void> {
  const session = sessionStore.get(userId);
  const lang = session?.lang || "EN";

  await answerCallbackQuery(callbackQueryId);
  const text = t(lang, "professional_prompt");
  await sendMessageWithButtons(chatId, text, getProfessionalSpecialtyKeyboard(lang));
}

export async function handleProfessionalSearch(
  chatId: number,
  userId: string,
  callbackQueryId: string,
  data: string
): Promise<void> {
  const session = sessionStore.get(userId);
  const lang = session?.lang || "EN";
  const type = data.replace("prof_type_", ""); // medical, counselor, therapist

  await answerCallbackQuery(callbackQueryId);
  await sendTextMessage(chatId, t(lang, "professional_loading"));

  try {
    if (!Professional) {
      await sendTextMessage(chatId, t(lang, "professional_none"));
      return;
    }

    const professionals = await Professional.find({
      verification_status: "verified",
      is_active: true,
      type: type,
    })
      .select("full_name type specializations city")
      .limit(3)
      .lean();

    if (professionals.length === 0) {
      await sendMessageWithButtons(chatId, t(lang, "professional_none"), getBackKeyboard(lang));
      return;
    }

    for (const p of professionals) {
      const card = `👩‍⚕️ *${p.full_name}*\n📍 ${p.city || "Ethiopia"}\n💼 ${p.specializations?.join(", ") || type}`;
      // In a real bot, we might add a "Contact" button linking to a booking URL or phone number
      await sendMessageWithButtons(chatId, card, [
        [{ text: "📞 Contact", url: `https://nuru-mvp-v1.vercel.app/professionals/${p._id}` }]
      ]);
    }

    await sendMessageWithButtons(chatId, "More options:", getBackKeyboard(lang));

  } catch (error) {
    await sendTextMessage(chatId, t(lang, "error"));
  }
}
