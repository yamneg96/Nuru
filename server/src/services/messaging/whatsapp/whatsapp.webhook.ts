import express from "express";
import { env } from "../../../config/env.js";
import { handleWhatsAppMessage } from "./whatsapp.handler.js";

const router = express.Router();

// Verification
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === env.WHATSAPP_VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Incoming messages
router.post("/", async (req, res) => {
  try {
    await handleWhatsAppMessage(req.body);
    res.sendStatus(200);
  } catch {
    res.sendStatus(500);
  }
});

export default router;