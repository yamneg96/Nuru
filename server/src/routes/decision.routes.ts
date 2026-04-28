import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { startDecisionFlow, submitDecisionStep, getDecisionResult } from "../services/decision.service.js";

export const decisionRoutes = Router();

/**
 * POST /decision/start
 */
decisionRoutes.post("/start", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { flow_type } = req.body;
    if (!flow_type) {
      res.status(400).json({ error: "flow_type is required" });
      return;
    }
    const result = await startDecisionFlow(req.anonymousId!, flow_type);
    res.json(result);
  } catch (error: any) {
    console.error("Decision start error:", error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * POST /decision/step
 */
decisionRoutes.post("/step", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { session_id, answer } = req.body;
    if (!session_id || answer === undefined) {
      res.status(400).json({ error: "session_id and answer are required" });
      return;
    }
    const result = await submitDecisionStep(session_id, answer);
    res.json(result);
  } catch (error: any) {
    console.error("Decision step error:", error);
    res.status(400).json({ error: error.message });
  }
});

/**
 * GET /decision/result/:sessionId
 */
decisionRoutes.get("/result/:sessionId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await getDecisionResult(req.params.sessionId);
    res.json(result);
  } catch (error: any) {
    console.error("Decision result error:", error);
    res.status(400).json({ error: error.message });
  }
});
