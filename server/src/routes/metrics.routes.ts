import { Router, type Request, type Response, type NextFunction } from "express";
import { getPublicMetrics } from "../services/metrics.service.js";

export const metricsRoutes = Router();

/**
 * GET /metrics/public
 * Returns real usage statistics (no auth required)
 */
metricsRoutes.get("/public", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await getPublicMetrics();
    res.json({ data: metrics });
  } catch (error) {
    next(error);
  }
});
