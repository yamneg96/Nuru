import { Router, type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { generateResponse } from "../services/ai.service.js";
import { ChatLog } from "../models/ChatLog.js";

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

      // Generate AI response
      const aiReply = await generateResponse(message, historyForAI);

      // Add AI response
      chatLog.messages.push({
        role: "assistant",
        content: aiReply,
        timestamp: new Date(),
      });

      await chatLog.save();

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
