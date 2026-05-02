import { Router, type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { generateResponse, generateTitle, streamResponse } from "../services/ai.service.js";
import { ChatLog } from "../models/ChatLog.js";
import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";

export const chatRoutes = Router();

const messageSchema = z.object({
  message: z.string().min(1, "Message is required").max(2000, "Message too long"),
  conversation_id: z.string().uuid().optional(),
});

// Rate limit: 20 messages per minute per user
const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  keyGenerator: (req) => (req as any).anonymousId || req.ip || "unknown",
  message: { error: { code: "RATE_LIMIT", message: "Too many messages. Please wait a moment." } },
});

/**
 * @swagger
 * /api/v1/chat/message:
 *   post:
 *     summary: Send a message to the AI
 *     description: Send a message to the Nuru AI assistant and get a response. Maintains conversation history. Rate limited to 20 requests per minute.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's message
 *               conversation_id:
 *                 type: string
 *                 format: uuid
 *                 description: Optional. The ID of an existing conversation to continue.
 *     responses:
 *       200:
 *         description: AI response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     reply:
 *                       type: string
 *                     conversation_id:
 *                       type: string
 *       401:
 *         description: Unauthorized
 *       429:
 *         description: Rate limit exceeded
 */
chatRoutes.post(
  "/message",
  authMiddleware,
  chatLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, conversation_id } = messageSchema.parse(req.body);

      const convId = conversation_id || uuidv4();

      // Find or create conversation
      let chatLog = await ChatLog.findOne({ conversation_id: convId, anonymous_id: req.anonymousId });

      if (!chatLog) {
        chatLog = new ChatLog({
          anonymous_id: req.anonymousId!,
          conversation_id: convId,
          messages: [],
        });
      }

      // Add user message
      chatLog.messages.push({
        role: "user",
        content: message,
        timestamp: new Date(),
      });

      // Build conversation history for AI context (last 10 messages)
      const historyForAI = chatLog.messages.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));

      // Get user language preference
      let language = "english";
      if (req.anonymousId) {
        const user = await User.findOne({ anonymous_id: req.anonymousId });
        if (user) language = user.preferences.language;
        else {
          const admin = await User.findById(req.anonymousId).catch(() => null);
          if (admin) language = admin.preferences.language;
        }
      }

      // Generate AI response in preferred language
      const aiReply = await generateResponse(message, historyForAI, language);

      // Add AI response
      chatLog.messages.push({
        role: "assistant",
        content: aiReply,
        timestamp: new Date(),
      });

      await chatLog.save();

      // Fire-and-forget title generation after 2nd user message
      if (chatLog.messages.filter((m) => m.role === "user").length === 2 && (!chatLog.title || chatLog.title === "New Conversation")) {
        generateTitle(historyForAI).then(async (title) => {
          await ChatLog.updateOne({ _id: chatLog._id }, { $set: { title } });
        }).catch(err => logger.error(err, "Failed to generate title"));
      }

      res.json({
        data: {
          reply: aiReply,
          conversation_id: convId,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/v1/chat/stream:
 *   post:
 *     summary: Send a message and stream the AI response (SSE)
 *     description: Server-Sent Events endpoint. Streams the response text token by token.
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [message]
 *             properties:
 *               message: { type: string }
 *               conversation_id: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Event stream of AI text chunks
 */
chatRoutes.post(
  "/stream",
  authMiddleware,
  chatLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { message, conversation_id } = messageSchema.parse(req.body);

      // Setup SSE Headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const convId = conversation_id || uuidv4();

      let chatLog = await ChatLog.findOne({ conversation_id: convId, anonymous_id: req.anonymousId });
      if (!chatLog) {
        chatLog = new ChatLog({
          anonymous_id: req.anonymousId!,
          conversation_id: convId,
          messages: [],
        });
      }

      chatLog.messages.push({
        role: "user",
        content: message,
        timestamp: new Date(),
      });

      const historyForAI = chatLog.messages.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant" | "system",
        content: m.content,
      }));

      let language = "english";
      if (req.anonymousId) {
        const user = await User.findOne({ anonymous_id: req.anonymousId });
        if (user) language = user.preferences.language;
      }

      // Stream the response
      const aiReply = await streamResponse(message, historyForAI, language, (chunk) => {
        // Send chunk to client
        res.write(`data: ${JSON.stringify({ chunk, conversation_id: convId })}\n\n`);
      });

      // Done streaming
      res.write("data: [DONE]\n\n");
      res.end();

      // Save to DB
      chatLog.messages.push({
        role: "assistant",
        content: aiReply,
        timestamp: new Date(),
      });
      await chatLog.save();

      // Fire-and-forget title generation after 2nd user message
      if (chatLog.messages.filter((m) => m.role === "user").length === 2 && (!chatLog.title || chatLog.title === "New Conversation")) {
        generateTitle(historyForAI).then(async (title) => {
          await ChatLog.updateOne({ _id: chatLog._id }, { $set: { title } });
        }).catch(err => logger.error(err, "Failed to generate title for stream"));
      }
    } catch (error) {
      logger.error(error, "Streaming error");
      res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
      res.end();
    }
  }
);
