import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { generateQuiz } from "../services/quiz.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const quizRouter = Router();

const generateQuizSchema = z.object({
  topic: z.string().min(1, "A valid topic string is required"),
});

quizRouter.post("/generate", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { topic } = generateQuizSchema.parse(req.body);
    const quiz = await generateQuiz(topic);
    res.json({ data: quiz });
  } catch (error) {
    next(error);
  }
});
