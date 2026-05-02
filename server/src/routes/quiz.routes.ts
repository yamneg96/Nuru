import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { generateQuiz } from "../services/quiz.service.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { Quiz } from "../models/Quiz.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export const quizRouter = Router();

// ── Validation Schemas ─────────────────────────────────────────────────────────

const generateQuizSchema = z.object({
  topic: z.string().min(1, "A valid topic string is required"),
});

// Helper: coerce empty strings to undefined for optional fields
const optionalStr = () => z.string().optional().transform((v) => (v === "" ? undefined : v));
const optionalBool = z.preprocess((v) => v === "true" || v === true || v === 1, z.boolean());

const quizQuestionSchema = z.object({
  text: z.string().min(1),
  options: z.array(z.string()).min(2),
  correct_index: z.coerce.number().int().min(0),
  explanation: optionalStr(),
});

const quizCreateSchema = z.object({
  module_id: optionalStr(),
  title: z.string().min(1),
  description: optionalStr(),
  questions: z.array(quizQuestionSchema).min(1),
  published: optionalBool.default(false),
});

const quizUpdateSchema = quizCreateSchema.partial();

// ── Public / User Routes ──────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/quiz/module/{module_id}:
 *   get:
 *     summary: Get the curated quiz for a module
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: module_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: The quiz object
 */
quizRouter.get("/module/:module_id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quiz = await Quiz.findOne({ module_id: req.params.module_id, published: true });
    if (!quiz) return res.status(404).json({ error: "No published quiz found for this module" });
    res.json({ data: quiz });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/quiz/generate:
 *   post:
 *     summary: Generate a quiz using AI
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
 *               topic: { type: string }
 *     responses:
 *       200:
 *         description: Generated quiz
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

// ── Admin Routes ──────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/quiz:
 *   post:
 *     summary: Create a new curated quiz (admin)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 */
quizRouter.post("/", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = quizCreateSchema.parse(req.body);
    const quiz = await Quiz.create(payload);
    res.status(201).json({ data: quiz });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/quiz/{id}:
 *   put:
 *     summary: Update a quiz (admin)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 */
quizRouter.put("/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = quizUpdateSchema.parse(req.body);
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, { $set: payload }, { new: true });
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json({ data: quiz });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/quiz/{id}:
 *   delete:
 *     summary: Delete a quiz (admin)
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 */
quizRouter.delete("/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json({ data: { message: "Quiz deleted" } });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/quiz/import:
 *   post:
 *     summary: Import quiz questions from JSON file (admin)
 *     description: Metadata (title, description, module_id) is sent as form fields. The JSON file should ONLY contain the questions array.
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, title]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: A JSON file containing ONLY an array of questions.
 *               title: { type: string }
 *               description: { type: string }
 *               module_id: { type: string }
 *               published: { type: boolean }
 *     responses:
 *       201:
 *         description: Quiz imported
 */
quizRouter.post("/import", authMiddleware, isAdmin, upload.single("file"), async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const questions = JSON.parse(req.file.buffer.toString("utf-8"));
    
    // Merge metadata from body with questions from file
    const payload = quizCreateSchema.parse({
      ...req.body,
      questions: Array.isArray(questions) ? questions : [questions],
    });

    const quiz = await Quiz.create(payload);
    res.status(201).json({ data: quiz });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return res.status(400).json({ error: "Invalid JSON file (must be a valid JSON array of questions)" });
    }
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/quiz/{id}/submit:
 *   post:
 *     summary: Submit quiz answers and get score
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [answers]
 *             properties:
 *               answers:
 *                 type: array
 *                 items: { type: integer }
 *     responses:
 *       200:
 *         description: Quiz result
 */
quizRouter.post("/:id/submit", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { answers } = z.object({
      answers: z.array(z.number().int())
    }).parse(req.body);

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;
    const results = quiz.questions.map((q, idx) => {
      const isCorrect = q.correct_index === answers[idx];
      if (isCorrect) score++;
      return {
        question: q.text,
        isCorrect,
        correct_index: q.correct_index,
        explanation: q.explanation
      };
    });

    const percentage = Math.round((score / quiz.questions.length) * 100);

    res.json({
      data: {
        score,
        total: quiz.questions.length,
        percentage,
        results
      }
    });
  } catch (error) {
    next(error);
  }
});
