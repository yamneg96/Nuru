import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { verifyGoogleToken, hashEmail, findOrCreateUser, generateJWT } from "../services/auth.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { User } from "../models/User.js";

export const authRoutes = Router();

const loginSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
});

/**
 * POST /auth/google
 * Authenticate via Google credential → anonymous user
 */
authRoutes.post("/google", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const { credential } = loginSchema.parse(req.body);

    // 1. Verify Google token & extract email
    const email = await verifyGoogleToken(credential);

    // 2. Hash email — raw email is NEVER stored
    const emailHash = hashEmail(email);

    // 3. Find or create anonymous user
    const user = await findOrCreateUser(emailHash);

    // 4. Generate JWT with only anonymous_id
    const token = generateJWT(user.anonymous_id);

    // 5. Return token + anonymous_id (no PII)
    res.json({
      data: {
        token,
        anonymous_id: user.anonymous_id,
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /auth/me
 * Get current user profile (requires auth)
 */
authRoutes.get("/me", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ anonymous_id: req.anonymousId });
    if (!user) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "User not found" } });
    }

    res.json({
      data: (user as any).toSafeJSON(),
    });
  } catch (error) {
    next(error);
  }
});
