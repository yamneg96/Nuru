import express from "express";
import { env } from "../../../config/env.js";
import { handleWhatsAppMessage } from "./whatsapp.handler.js";
import { logger } from "../../../utils/logger.js";

const router = express.Router();

router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === env.WHATSAPP_VERIFY_TOKEN) {
    logger.info("WhatsApp webhook verified");
    return res.status(200).send(challenge);
  }

  logger.warn("WhatsApp webhook verification failed");
  return res.sendStatus(403);
});

router.post("/", async (req, res) => {
  try {
    await handleWhatsAppMessage(req.body);
    res.sendStatus(200);
  } catch (err) {
    logger.error(err, "WhatsApp webhook processing error");
    res.sendStatus(500);
  }
});

export default router;