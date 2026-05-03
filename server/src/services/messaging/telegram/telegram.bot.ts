import { env } from "../../../config/env.js";
import { logger } from "../../../utils/logger.js";
import { processTelegramUpdate } from "./telegram.handler.js";
import { getUpdates, deleteWebhook, type TelegramUpdate } from "./telegram.api.js";

let polling = false;
let currentOffset: number | undefined;

export function initTelegramBot(): void {
  if (!env.TELEGRAM_BOT_TOKEN) {
    logger.warn("TELEGRAM_BOT_TOKEN not set — Telegram bot disabled");
    return;
  }

  startPolling();
}

async function startPolling(): Promise<void> {
  if (polling) return;
  polling = true;

  try {
    await deleteWebhook();
  } catch {
    logger.debug("No existing webhook to delete");
  }

  logger.info("✅ Telegram bot started (HTTP long-polling)");
  pollLoop();
}

async function pollLoop(): Promise<void> {
  while (polling) {
    try {
      const updates = await getUpdates(currentOffset, 30);

      for (const update of updates) {
        currentOffset = update.update_id + 1;

        try {
          await processTelegramUpdate(update);
        } catch (err) {
          logger.error(
            { err, updateId: update.update_id },
            "Failed to process Telegram update"
          );
        }
      }
    } catch (err) {
      logger.error(err, "Telegram polling error — retrying in 5s");
      await sleep(5000);
    }
  }
}

export function stopTelegramBot(): void {
  polling = false;
  logger.info("Telegram bot polling stopped");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}