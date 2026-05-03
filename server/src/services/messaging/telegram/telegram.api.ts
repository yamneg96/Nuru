import axios, { type AxiosError } from "axios";
import { env } from "../../../config/env.js";
import { logger } from "../../../utils/logger.js";

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;

function getTelegramBaseUrl(): string {
  return `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}`;
}

export async function telegramSend(
  method: string,
  payload: Record<string, unknown>
): Promise<unknown> {
  const url = `${getTelegramBaseUrl()}/${method}`;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      return response.data;
    } catch (err) {
      lastError = err as Error;
      const axiosErr = err as AxiosError;
      const status = axiosErr.response?.status;

      if (status && status >= 400 && status < 500 && status !== 429) {
        logger.error(
          { method, status, data: axiosErr.response?.data },
          "Telegram API client error (non-retryable)"
        );
        throw err;
      }

      if (attempt < MAX_RETRIES) {
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logger.warn(
          { method, attempt, delay, status },
          "Telegram API call failed, retrying..."
        );
        await sleep(delay);
      }
    }
  }

  logger.error({ method }, "Telegram API call failed after all retries");
  throw lastError;
}

export async function sendTextMessage(
  chatId: number,
  text: string
): Promise<void> {
  await telegramSend("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "Markdown",
  });
}

export async function sendTypingIndicator(chatId: number): Promise<void> {
  try {
    await telegramSend("sendChatAction", {
      chat_id: chatId,
      action: "typing",
    });
  } catch {
    logger.debug({ chatId }, "Failed to send typing indicator (non-critical)");
  }
}

export async function setWebhook(url: string): Promise<void> {
  await telegramSend("setWebhook", { url });
  logger.info({ url }, "Telegram webhook set");
}

export async function deleteWebhook(): Promise<void> {
  await telegramSend("deleteWebhook", { drop_pending_updates: true });
  logger.info("Telegram webhook deleted");
}

export interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from?: {
      id: number;
      first_name?: string;
      username?: string;
    };
    chat: {
      id: number;
      type: string;
    };
    date: number;
    text?: string;
  };
}

export async function getUpdates(
  offset?: number,
  timeout = 30
): Promise<TelegramUpdate[]> {
  const payload: Record<string, unknown> = {
    timeout,
    allowed_updates: ["message"],
  };

  if (offset !== undefined) {
    payload.offset = offset;
  }

  const result = (await telegramSend("getUpdates", payload)) as {
    ok: boolean;
    result: TelegramUpdate[];
  };

  return result?.result ?? [];
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
