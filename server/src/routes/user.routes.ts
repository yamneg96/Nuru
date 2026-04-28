import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { User } from "../models/User.js";
import { ChatLog } from "../models/ChatLog.js";
import { DecisionSession } from "../models/DecisionSession.js";

export const userRoutes = Router();

/**
 * PUT /user/preferences
 * Update user preferences (language, save_history)
 */
userRoutes.put("/preferences", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { language, save_history } = req.body;
    const update: Record<string, any> = {};

    if (language && ["english", "amharic", "oromo"].includes(language)) {
      update["preferences.language"] = language;
    }
    if (typeof save_history === "boolean") {
      update["preferences.save_history"] = save_history;
    }

    const user = await User.findOneAndUpdate(
      { anonymous_id: req.anonymousId },
      { $set: update },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json((user as any).toSafeJSON());
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ error: "Failed to update preferences" });
  }
});

/**
 * DELETE /user/data
 * Delete all user data — complete wipe
 */
userRoutes.delete("/data", authMiddleware, async (req: Request, res: Response) => {
  try {
    await Promise.all([
      ChatLog.deleteMany({ anonymous_id: req.anonymousId }),
      DecisionSession.deleteMany({ anonymous_id: req.anonymousId }),
      User.deleteOne({ anonymous_id: req.anonymousId }),
    ]);

    res.json({ message: "All data deleted successfully" });
  } catch (error) {
    console.error("Delete data error:", error);
    res.status(500).json({ error: "Failed to delete data" });
  }
});
