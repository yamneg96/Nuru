import { Router, type Request, type Response, type NextFunction } from "express";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { Module } from "../models/Module.js";
import { UserProgress } from "../models/UserProgress.js";
import { User } from "../models/User.js";
import { Appointment } from "../models/Appointment.js";
import { Event } from "../models/Event.js";
import { Professional } from "../models/Professional.js";
import { ChatLog } from "../models/ChatLog.js";
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

// ── 2.4.1 Endpoints: Admin Dashboard ──────────────────────────────────────────

/**
 * @swagger
 * /api/v1/dashboard/stats:
 *   get:
 *     summary: Get high-level platform stats (Admin)
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Platform-wide counters for users, professionals, and activity
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 */
dashboardRoutes.get("/stats", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalUsers,
      totalProfessionals,
      totalAppointments,
      totalEvents,
      totalMessages
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Professional.countDocuments({ verification_status: "verified" }),
      Appointment.countDocuments(),
      Event.countDocuments(),
      ChatLog.countDocuments()
    ]);

    const activeProfessionals = await Professional.countDocuments({ 
      verification_status: "verified", 
      is_active: true 
    });

    res.json({
      data: {
        users: { total: totalUsers },
        professionals: { total: totalProfessionals, active: activeProfessionals },
        activity: { appointments: totalAppointments, events: totalEvents, messages: totalMessages }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/dashboard/engagement:
 *   get:
 *     summary: Get engagement trends for the past 30 days (Admin)
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily registration and message trend data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 */
dashboardRoutes.get("/engagement", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const userGrowth = await User.aggregate([
      { $match: { created_at: { $gte: thirtyDaysAgo }, role: "user" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const messageTrends = await ChatLog.aggregate([
      { $match: { created_at: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json({
      data: {
        daily_registrations: userGrowth,
        daily_messages: messageTrends
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/dashboard/professionals:
 *   get:
 *     summary: Get professional performance analytics (Admin)
 *     tags: [Admin - Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top performers and distribution by professional type
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 */
dashboardRoutes.get("/professionals", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const topProfessionals = await Professional.find({ verification_status: "verified" })
      .sort({ rating: -1, sessions_completed: -1 })
      .limit(10)
      .select("full_name type rating sessions_completed");

    const statsByType = await Professional.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 }, avgRating: { $avg: "$rating" } } }
    ]);

    res.json({
      data: {
        top_performers: topProfessionals,
        distribution_by_type: statsByType
      }
    });
  } catch (error) {
    next(error);
  }
});
