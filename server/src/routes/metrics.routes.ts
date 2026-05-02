import { Router, type Request, type Response, type NextFunction } from "express";
import { getPublicMetrics } from "../services/metrics.service.js";

export const metricsRoutes = Router();

/**
 * @swagger
 * /api/v1/metrics/public:
 *   get:
 *     summary: Get public platform metrics
 *     description: Returns aggregated usage statistics for public display (e.g., number of active users, total chat queries). No authentication required.
 *     tags: [Metrics]
 *     responses:
 *       200:
 *         description: Public metrics data
 */
metricsRoutes.get("/public", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await getPublicMetrics();
    res.json({ data: metrics });
  } catch (error) {
    next(error);
  }
});
