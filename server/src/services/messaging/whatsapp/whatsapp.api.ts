import axios, { type AxiosError } from "axios";
import { env } from "../../../config/env.js";
import { logger } from "../../../utils/logger.js";

const MAX_RETRIES = 3;
const BASE_RETRY_DELAY_MS = 1000;
const WHATSAPP_API_VERSION = "v18.0";

export async function whatsappSend(
  to: string,
  text: string
): Promise<void> {
  const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${env.WHATSAPP_PHONE_ID}/messages`;
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await axios.post(
        url,
        {
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: text },
        },
        {
          headers: {
            Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      return;
    } catch (err) {
      lastError = err as Error;
      const axiosErr = err as AxiosError;
      const status = axiosErr.response?.status;

      if (status && status >= 400 && status < 500 && status !== 429) {
        logger.error(
          { status, data: axiosErr.response?.data, to },
          "WhatsApp API client error (non-retryable)"
        );
        throw err;
      }

      if (attempt < MAX_RETRIES) {
        const delay = BASE_RETRY_DELAY_MS * Math.pow(2, attempt - 1);
        logger.warn({ attempt, delay, status }, "WhatsApp API call failed, retrying...");
        await sleep(delay);
      }
    }
  }

  logger.error({ to }, "WhatsApp API call failed after all retries");
  throw lastError;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
