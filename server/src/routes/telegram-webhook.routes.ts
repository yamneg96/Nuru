import { Router, Request, Response } from "express";
import { processTelegramUpdate } from "../services/messaging/telegram/telegram.handler.js";
import { logger } from "../utils/logger.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const update = req.body;
    
    // Process update asynchronously so we return 200 immediately
    processTelegramUpdate(update).catch((err) => {
      logger.error({ err }, "Error processing telegram webhook update");
    });
    
    res.status(200).send("OK");
  } catch (error) {
    logger.error({ error }, "Telegram webhook error");
    res.status(500).send("Error");
  }
});

export const telegramWebhookRoutes = router;
