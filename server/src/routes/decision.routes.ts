import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { VALID_FLOW_TYPES } from "../config/constants.js";
import { startDecisionFlow, submitDecisionStep, getDecisionResult } from "../services/decision.service.js";

export const decisionRoutes = Router();

const startFlowSchema = z.object({
  flow_type: z.enum(VALID_FLOW_TYPES, {
    errorMap: () => ({ message: "Invalid flow_type" }),
  }),
});

const submitStepSchema = z.object({
  session_id: z.string().min(1, "session_id is required"),
  answer: z.any(), // Answers can be string or array
});

const sessionIdParamSchema = z.object({
  sessionId: z.string().min(1, "sessionId is required"),
});

/**
 * @swagger
 * /api/v1/decision/start:
 *   post:
 *     summary: Start a decision flow
 *     description: Initialize a new interactive decision tree flow (e.g., family planning method selection).
 *     tags: [Decision]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [flow_type]
 *             properties:
 *               flow_type:
 *                 type: string
 *                 enum: [missed_period, relationship_pressure, contraception, sti_risk, pregnancy_options, mental_health_support]
 *                 description: Identifier for the flow
 *     responses:
 *       200:
 *         description: Initial step data for the flow
 *       401:
 *         description: Unauthorized
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
 * @swagger
 * /api/v1/decision/step:
 *   post:
 *     summary: Submit an answer for a decision step
 *     description: Submit an answer to the current step and get the next step or final result.
 *     tags: [Decision]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [session_id, answer]
 *             properties:
 *               session_id:
 *                 type: string
 *                 description: The active decision session ID
 *               answer:
 *                 description: The selected answer(s)
 *     responses:
 *       200:
 *         description: Next step or final result
 *       401:
 *         description: Unauthorized
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
 * @swagger
 * /api/v1/decision/result/{sessionId}:
 *   get:
 *     summary: Get decision result
 *     description: Retrieve the final result of a completed decision session.
 *     tags: [Decision]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The decision session ID
 *     responses:
 *       200:
 *         description: Decision result data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Session not found
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
