import axios from "axios";
import { env } from "../../../config/env.js";
import { routeMessage } from "../core/message.router.js";

export const handleWhatsAppMessage = async (body: any) => {
  const message =
    body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return;

  const from = message.from;
  const text = message.text?.body || "";

  const response = await routeMessage({
    text,
    userId: from,
    platform: "whatsapp",
  });

  await sendMessage(from, response);
};

const sendMessage = async (to: string, text: string) => {
  await axios.post(
    `https://graph.facebook.com/v18.0/${env.WHATSAPP_PHONE_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to,
      text: { body: text },
    },
    {
      headers: {
        Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
};