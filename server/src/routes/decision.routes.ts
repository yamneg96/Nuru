import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { startDecisionFlow, submitDecisionStep, getDecisionResult } from "../services/decision.service.js";

export const decisionRoutes = Router();

const startFlowSchema = z.object({
  flow_type: z.string().min(1, "flow_type is required"),
});

const submitStepSchema = z.object({
  session_id: z.string().min(1, "session_id is required"),
  answer: z.any(), // Answers can be string or array
});

const sessionIdParamSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
});

/**
 * POST /decision/start
 */
decisionRoutes.post("/start", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { flow_type } = startFlowSchema.parse(req.body);
    const result = await startDecisionFlow(req.anonymousId!, flow_type);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /decision/step
 */
decisionRoutes.post("/step", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { session_id, answer } = submitStepSchema.parse(req.body);
    const result = await submitDecisionStep(session_id, answer);
    res.json({ data: result });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /decision/result/:sessionId
 */
decisionRoutes.get(
  "/result/:sessionId",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = sessionIdParamSchema.parse(req.params);
      const result = await getDecisionResult(sessionId);
      res.json({ data: result });
    } catch (error) {
      next(error);
    }
  }
);
