import { routeMessage } from "../core/message.router.js";

export const handleTelegramMessage = async (
  chatId: number,
  text: string
) => {
  return await routeMessage({
    text,
    userId: String(chatId),
    platform: "telegram",
  });
};