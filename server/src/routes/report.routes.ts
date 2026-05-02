import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { PublicReport } from "../models/PublicReport.js";
import { User } from "../models/User.js";
import { ChatLog } from "../models/ChatLog.js";
import { Event } from "../models/Event.js";
import { DecisionSession } from "../models/DecisionSession.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";

// Schemas
const generateReportSchema = z.object({
  title: z.string(),
  period: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }),
  type: z.enum(["monthly", "quarterly", "annual"]),
  summary_markdown: z.string().optional(),
});

const editReportSchema = z.object({
  title: z.string().optional(),
  summary_markdown: z.string().optional(),
  metrics: z.object({
    users_served: z.number().optional(),
    conversations_held: z.number().optional(),
    modules_completed: z.number().optional(),
    events_held: z.number().optional(),
    professionals_active: z.number().optional(),
    risk_assessments_completed: z.number().optional(),
    top_topics: z.array(z.string()).optional(),
  }).optional()
});

export const reportRoutes = Router();
export const adminReportRoutes = Router();

adminReportRoutes.use(authMiddleware, isAdmin);

/**
 * @swagger
 * /api/v1/reports:
 *   get:
 *     summary: List published public reports
 *     tags: [Reports]
 *     responses:
 *       200:
 *         description: List of published reports
 */
reportRoutes.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await PublicReport.find({ published: true })
      .sort({ "period.from": -1 })
      .select("-__v");
    res.json({ data: reports });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/v1/reports/{id}:
 *   get:
 *     summary: Get full report detail
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report details
 *       404:
 *         description: Report not found
 */
reportRoutes.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await PublicReport.findOne({ _id: req.params.id, published: true });
    if (!report) return res.status(404).json({ error: "Report not found" });
    res.json({ data: report });
  } catch (err) {
    next(err);
  }
});

// Admin endpoints

/**
 * @swagger
 * /api/v1/admin/reports/generate:
 *   post:
 *     summary: Auto-generate a report from analytics data
 *     tags: [Reports (Admin)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, period, type]
 *             properties:
 *               title:
 *                 type: string
 *               period:
 *                 type: object
 *                 properties:
 *                   from:
 *                     type: string
 *                     format: date-time
 *                   to:
 *                     type: string
 *                     format: date-time
 *               type:
 *                 type: string
 *                 enum: [monthly, quarterly, annual]
 *               summary_markdown:
 *                 type: string
 *     responses:
 *       201:
 *         description: Report generated
 */
adminReportRoutes.post("/generate", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, period, type, summary_markdown } = generateReportSchema.parse(req.body);
    const fromDate = new Date(period.from);
    const toDate = new Date(period.to);

    // Aggregate metrics
    const users_served = await User.countDocuments({ role: "youth", createdAt: { $gte: fromDate, $lte: toDate } });
    const conversations_held = await ChatLog.countDocuments({ createdAt: { $gte: fromDate, $lte: toDate } });
    const events_held = await Event.countDocuments({ date: { $gte: fromDate, $lte: toDate } });
    const professionals_active = await User.countDocuments({ role: "professional" }); // Simplification for active
    const risk_assessments_completed = await DecisionSession.countDocuments({ updatedAt: { $gte: fromDate, $lte: toDate } });

    const report = new PublicReport({
      title,
      period: { from: fromDate, to: toDate },
      type,
      metrics: {
        users_served,
        conversations_held,
        events_held,
        professionals_active,
        risk_assessments_completed,
        modules_completed: 0, // Mock for now
        top_topics: ["Mental Health", "SRH", "Careers"], // Mock for now
      },
      summary_markdown: summary_markdown || "",
    });

    await report.save();
    res.status(201).json({ message: "Report generated successfully", data: report });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/v1/admin/reports/{id}:
 *   put:
 *     summary: Edit report narrative before publishing
 *     tags: [Reports (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               summary_markdown:
 *                 type: string
 *               metrics:
 *                 type: object
 *     responses:
 *       200:
 *         description: Report updated
 */
adminReportRoutes.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updates = editReportSchema.parse(req.body);
    const report = await PublicReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    if (updates.title) report.title = updates.title;
    if (updates.summary_markdown !== undefined) report.summary_markdown = updates.summary_markdown;
    if (updates.metrics) {
      report.metrics = { ...report.metrics, ...updates.metrics } as any;
    }

    await report.save();
    res.json({ message: "Report updated", data: report });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/v1/admin/reports/{id}/publish:
 *   put:
 *     summary: Publish a report
 *     tags: [Reports (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report published
 */
adminReportRoutes.put("/:id/publish", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await PublicReport.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    report.published = true;
    report.published_at = new Date();
    await report.save();

    res.json({ message: "Report published", data: report });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/v1/admin/reports/{id}:
 *   delete:
 *     summary: Delete a report
 *     tags: [Reports (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Report deleted
 */
adminReportRoutes.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const report = await PublicReport.findByIdAndDelete(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });
    
    res.json({ message: "Report deleted" });
  } catch (err) {
    next(err);
  }
});

export default { reportRoutes, adminReportRoutes };
