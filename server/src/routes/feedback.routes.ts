import { Router, type Request, type Response, type NextFunction } from "express";
import { Feedback } from "../models/Feedback.js";

export const feedbackRoutes = Router();

/**
 * @swagger
 * /api/v1/feedback:
 *   post:
 *     summary: Submit user feedback
 *     description: Submit feedback for a specific context like video, chat, event, etc.
 *     tags: [Feedback]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               anonymous_id:
 *                 type: string
 *               context:
 *                 type: string
 *               context_id:
 *                 type: string
 *               rating:
 *                 type: number
 *               comment:
 *                 type: string
 *               user_age:
 *                 type: number
 *               user_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Feedback submitted successfully
 */
feedbackRoutes.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      anonymous_id,
      context,
      context_id,
      rating,
      comment,
      user_age,
      user_type
    } = req.body;

    const feedback = new Feedback({
      anonymous_id,
      context,
      context_id,
      rating,
      comment,
      user_age,
      user_type,
      is_public: true // auto public for landing page
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      data: feedback
    });
  } catch (error) {
    next(error);
  }
});
