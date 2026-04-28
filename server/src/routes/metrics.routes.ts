import { Router, type Request, type Response } from "express";
import { getPublicMetrics } from "../services/metrics.service.js";

export const metricsRoutes = Router();

/**
 * GET /metrics/public
 * Returns real usage statistics (no auth required)
 */
metricsRoutes.get("/public", async (_req: Request, res: Response) => {
  try {
    const metrics = await getPublicMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Metrics error:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});
