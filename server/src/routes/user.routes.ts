import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { User } from "../models/User.js";
import { ChatLog } from "../models/ChatLog.js";
import { DecisionSession } from "../models/DecisionSession.js";

export const userRoutes = Router();

const preferencesSchema = z.object({
  language: z.enum(["english", "amharic", "oromo"]).optional(),
  save_history: z.boolean().optional(),
});

/**
 * @swagger
 * /api/v1/user/preferences:
 *   put:
 *     summary: Update user preferences
 *     description: Update language and history saving preferences.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               language:
 *                 type: string
 *                 enum: [english, amharic, oromo]
 *               save_history:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Updated user profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
userRoutes.put("/preferences", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { language, save_history } = preferencesSchema.parse(req.body);
    const update: Record<string, any> = {};

    if (language) {
      update["preferences.language"] = language;
    }
    if (save_history !== undefined) {
      update["preferences.save_history"] = save_history;
    }

    const user = await User.findOneAndUpdate(
      { anonymous_id: req.anonymousId },
      { $set: update },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    }

    res.json({ data: (user as any).toSafeJSON() });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/user/data:
 *   delete:
 *     summary: Delete all user data
 *     description: Completely wipe all user data including chat logs, decision sessions, and the user profile.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All data deleted successfully
 *       401:
 *         description: Unauthorized
 */
userRoutes.delete("/data", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await Promise.all([
      ChatLog.deleteMany({ anonymous_id: req.anonymousId }),
      DecisionSession.deleteMany({ anonymous_id: req.anonymousId }),
      User.deleteOne({ anonymous_id: req.anonymousId }),
    ]);

    res.json({ data: { message: "All data deleted successfully" } });
  } catch (error) {
    next(error);
  }
});
