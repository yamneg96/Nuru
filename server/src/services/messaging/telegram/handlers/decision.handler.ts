import { sendTextMessage, sendMessageWithButtons, answerCallbackQuery } from "../telegram.api.js";
import { sessionStore } from "../../core/session.store.js";
import { Language } from "../../shared/constants.js";
import { t } from "../bot-i18n.js";
import { 
  getDecisionFlowsKeyboard, 
  getDecisionOptionsKeyboard, 
  getMainMenuKeyboard 
} from "../telegram.keyboard.js";
import { conversationStore } from "../conversation.store.js";
import { startDecisionFlow, submitDecisionStep, getDecisionResult } from "../../../decision.service.js";
import { type FlowType } from "../../../../config/constants.js";

export async function handleDecisionMenu(
  chatId: number,
  userId: string,
  callbackQueryId: string
): Promise<void> {
  const session = sessionStore.get(userId);
  const lang = session?.lang || "EN";

  await answerCallbackQuery(callbackQueryId);
  const text = t(lang, "decision_prompt");
  await sendMessageWithButtons(chatId, text, getDecisionFlowsKeyboard(lang));
}

export async function handleDecisionFlowStart(
  chatId: number,
  userId: string,
  callbackQueryId: string,
  data: string
): Promise<void> {
  const session = sessionStore.get(userId);
  const lang = session?.lang || "EN";
  const flowType = data.replace("flow_", "") as FlowType;

  await answerCallbackQuery(callbackQueryId);

  try {
    const flowData = await startDecisionFlow(userId, flowType);
    
    conversationStore.setState(chatId, {
      flow: "decision",
      step: flowData.current_step,
      sessionId: flowData.session_id,
      flowType: flowData.flow_type,
    });

    const questionText = `${flowData.question.text}${flowData.question.subtitle ? `\n_${flowData.question.subtitle}_` : ""}`;
    await sendMessageWithButtons(
      chatId, 
      questionText, 
      getDecisionOptionsKeyboard(flowData.question.options, lang)
    );
  } catch (error) {
    await sendTextMessage(chatId, t(lang, "error"));
  }
}

export async function handleDecisionAnswer(
  chatId: number,
  userId: string,
  callbackQueryId: string,
  data: string
): Promise<void> {
  const session = sessionStore.get(userId);
  const lang = session?.lang || "EN";
  const answer = data.replace("ans_", "");

  await answerCallbackQuery(callbackQueryId);

  const state = conversationStore.getState(chatId);
  if (state.flow !== "decision" || !state.sessionId) {
    await sendTextMessage(chatId, t(lang, "error"));
    return;
  }

  try {
    const response = await submitDecisionStep(state.sessionId, answer);

    if (response.completed) {
      await sendTextMessage(chatId, t(lang, "decision_loading"));
      
      const result = await getDecisionResult(state.sessionId);
      
      let resultText = t(lang, "decision_result_title");
      resultText += `${result.summary}\n\n`;
      (result.advice || []).forEach((adv: string) => {
        resultText += `• ${adv}\n`;
      });

      await sendTextMessage(chatId, resultText);
      
      // Clear state and show menu
      conversationStore.clearState(chatId);
      const menuText = t(lang, "menu_title");
      await sendMessageWithButtons(chatId, menuText, getMainMenuKeyboard(lang));
    } else if (response.question) {
      // Next question
      conversationStore.setState(chatId, { step: response.current_step });
      const questionText = `${response.question.text}${response.question.subtitle ? `\n_${response.question.subtitle}_` : ""}`;
      await sendMessageWithButtons(
        chatId, 
        questionText, 
        getDecisionOptionsKeyboard(response.question.options, lang)
      );
    }
  } catch (error) {
    await sendTextMessage(chatId, t(lang, "error"));
    conversationStore.clearState(chatId);
  }
}
