import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { UserProgress } from "../models/UserProgress.js";
import { Module } from "../models/Module.js";
import { Article } from "../models/Article.js";
import { Video } from "../models/Video.js";
import { Quiz } from "../models/Quiz.js";
import mongoose from "mongoose";

export const progressRouter = Router();

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Calculates how many articles/videos in a module the user has completed */
async function getModuleSummary(userId: string, moduleId: mongoose.Types.ObjectId) {
  const [totalArticles, totalVideos, doneArticles, doneVideos] = await Promise.all([
    Article.countDocuments({ module_id: moduleId, published: true }),
    Video.countDocuments({ module_id: moduleId, published: true }),
    UserProgress.countDocuments({ user_id: userId, module_id: moduleId, content_type: "article" }),
    UserProgress.countDocuments({ user_id: userId, module_id: moduleId, content_type: "video" }),
  ]);
  const total = totalArticles + totalVideos;
  const done = doneArticles + doneVideos;
  return { total, done, percentage: total > 0 ? Math.round((done / total) * 100) : 0 };
}

// ── Routes ────────────────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/progress/complete:
 *   post:
 *     summary: Mark content as complete
 *     description: Records that the authenticated user has completed an article, video, or quiz.
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [content_type, content_id]
 *             properties:
 *               content_type:
 *                 type: string
 *                 enum: [article, video, quiz]
 *               content_id: { type: string }
 *               module_id: { type: string }
 *               quiz_score: { type: integer }
 *               quiz_total: { type: integer }
 *               quiz_passed: { type: boolean }
 *     responses:
 *       200:
 *         description: Progress recorded
 */
progressRouter.post("/complete", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = z.object({
      content_type: z.enum(["article", "video", "quiz"]),
      content_id: z.string().min(1),
      module_id: z.string().optional(),
      quiz_score: z.coerce.number().optional(),
      quiz_total: z.coerce.number().optional(),
      quiz_passed: z.boolean().optional(),
    }).parse(req.body);

    const record = await UserProgress.findOneAndUpdate(
      {
        user_id: req.anonymousId,
        content_type: payload.content_type,
        content_id: payload.content_id,
      },
      {
        $set: {
          module_id: payload.module_id,
          quiz_score: payload.quiz_score,
          quiz_total: payload.quiz_total,
          quiz_passed: payload.quiz_passed,
          completed_at: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    res.json({ data: record });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/progress:
 *   get:
 *     summary: Get my full progress summary
 *     description: Returns the user's completed items and per-module completion percentages.
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Progress summary
 */
progressRouter.get("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.anonymousId!;

    // All completion records for this user
    const completions = await UserProgress.find({ user_id: userId })
      .sort({ completed_at: -1 });

    // Per-module progress summary
    const modules = await Module.find({ published: true });
    const moduleSummaries = await Promise.all(
      modules.map(async (mod) => {
        const summary = await getModuleSummary(userId, mod._id as mongoose.Types.ObjectId);
        return {
          module_id: mod._id,
          title: mod.title,
          slug: mod.slug,
          icon: mod.icon,
          ...summary,
          completed: summary.percentage === 100,
        };
      })
    );

    res.json({
      data: {
        completions,
        modules: moduleSummaries,
        total_completed: completions.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/progress/module/{module_id}:
 *   get:
 *     summary: Get progress for a specific module
 *     tags: [Progress]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: module_id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Module progress detail
 */
progressRouter.get("/module/:module_id", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.anonymousId!;
    const moduleId = new mongoose.Types.ObjectId(req.params.module_id as string);

    const [summary, completions] = await Promise.all([
      getModuleSummary(userId, moduleId),
      UserProgress.find({ user_id: userId, module_id: moduleId }).sort({ completed_at: -1 }),
    ]);

    res.json({
      data: {
        module_id: req.params.module_id,
        ...summary,
        completed: summary.percentage === 100,
        completions,
      },
    });
  } catch (error) {
    next(error);
  }
});
