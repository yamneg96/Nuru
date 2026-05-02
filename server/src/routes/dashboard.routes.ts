import { Router, type Request, type Response, type NextFunction } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { Module } from "../models/Module.js";
import { UserProgress } from "../models/UserProgress.js";
import mongoose from "mongoose";

export const dashboardRoutes = Router();

/**
 * @swagger
 * /api/v1/dashboard/config:
 *   get:
 *     summary: Get personalized dashboard configuration
 *     description: Returns recommended modules, continue learning, and quick actions based on user progress.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard configuration data
 */
dashboardRoutes.get("/config", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.anonymousId!;

    // 1. Get all published modules
    const allModules = await Module.find({ published: true }).sort({ order: 1 });

    // 2. Get user's progress records
    const progressRecords = await UserProgress.find({ user_id: userId });

    // Helper: Calculate progress for a module
    const getProgress = (moduleId: string) => {
      // In our current simple model, any record in UserProgress for a module implies some interaction.
      // A more robust way would be to count articles/videos in that module.
      const records = progressRecords.filter(r => r.module_id?.toString() === moduleId);
      return records.length;
    };

    // 3. Categorize Modules
    const continueLearning = [];
    const recommended = [];

    for (const mod of allModules) {
      const p = getProgress(mod._id.toString());
      
      // If user has some progress but not "finished" 
      // (This is a simplified check; usually you'd check % against total content)
      if (p > 0) {
        continueLearning.push(mod);
      } else if (mod.featured) {
        recommended.push(mod);
      }
    }

    // 4. Static Quick Actions (as per PRD)
    const quickActions = [
      {
        id: "missed_period",
        title: "Missed Period?",
        icon: "calendar_today",
        description: "Assess your risk and next steps.",
        flow_type: "missed_period"
      },
      {
        id: "contraception",
        title: "Birth Control",
        icon: "medical_services",
        description: "Find the right method for you.",
        flow_type: "contraception"
      },
      {
        id: "emergency",
        title: "Emergency Support",
        icon: "warning",
        description: "What to do after unprotected sex.",
        flow_type: "emergency"
      }
    ];

    res.json({
      data: {
        recommended_modules: recommended.slice(0, 3),
        continue_learning: continueLearning.slice(0, 3),
        quick_actions: quickActions
      }
    });
  } catch (error) {
    next(error);
  }
});
