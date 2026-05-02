import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { generateQuiz } from "../services/quiz.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const quizRouter = Router();

const generateQuizSchema = z.object({
  topic: z.string().min(1, "A valid topic string is required"),
});

/**
 * @swagger
 * /api/v1/quiz/generate:
 *   post:
 *     summary: Generate a quiz
 *     description: Generate a 3-question multiple choice quiz on a given SRH topic using AI.
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [topic]
 *             properties:
 *               topic:
 *                 type: string
 *                 description: The topic for the quiz (e.g. 'contraception methods')
 *     responses:
 *       200:
 *         description: Generated quiz
 *       401:
 *         description: Unauthorized
 */

quizRouter.post("/generate", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic } = generateQuizSchema.parse(req.body);
    const quiz = await generateQuiz(topic);
    res.json({ data: quiz });
  } catch (error) {
    next(error);
  }
});
