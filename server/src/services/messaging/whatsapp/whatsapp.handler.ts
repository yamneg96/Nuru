import { handleMessage } from "../core/message.router.js";
import { whatsappSend } from "./whatsapp.api.js";
import { PLATFORMS } from "../shared/constants.js";
import { logger } from "../../../utils/logger.js";

interface WhatsAppWebhookBody {
  entry?: Array<{
    changes?: Array<{
      value?: {
        messages?: Array<{
          from: string;
          type: string;
          text?: { body: string };
        }>;
      };
    }>;
  }>;
}

export async function handleWhatsAppMessage(
  body: WhatsAppWebhookBody
): Promise<void> {
  const message = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
  if (!message) return;

  const from = message.from;
  const isText = message.type === "text";
  const text = message.text?.body ?? "";

  try {
    const response = await handleMessage({
      text,
      userId: from,
      platform: PLATFORMS.WHATSAPP,
      isText,
    });

    await whatsappSend(from, response.text);
  } catch (err) {
    logger.error({ err, from }, "Failed to handle WhatsApp message");

    try {
      await whatsappSend(from, "⚠️ Something went wrong. Please try again.");
    } catch {
      logger.error({ from }, "Failed to send error message to WhatsApp user");
    }
  }
}