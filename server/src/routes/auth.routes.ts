import { Router, type Request, type Response } from "express";
import { verifyGoogleToken, hashEmail, findOrCreateUser, generateJWT } from "../services/auth.service.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { User } from "../models/User.js";

export const authRoutes = Router();

/**
 * POST /auth/google
 * Authenticate via Google credential → anonymous user
 */
authRoutes.post("/google", async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      res.status(400).json({ error: "Missing Google credential" });
      return;
    }

    // 1. Verify Google token & extract email
    const email = await verifyGoogleToken(credential);

    // 2. Hash email — raw email is NEVER stored
    const emailHash = hashEmail(email);

    // 3. Find or create anonymous user
    const user = await findOrCreateUser(emailHash);

    // 4. Generate JWT with only anonymous_id
    const token = generateJWT(user.anonymous_id);

    // 5. Return token + anonymous_id (no PII)
    res.json({ token, anonymous_id: user.anonymous_id });
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
});

/**
 * GET /auth/me
 * Get current user profile (requires auth)
 */
authRoutes.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ anonymous_id: req.anonymousId });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json((user as any).toSafeJSON());
  } catch (error) {
    console.error("Get me error:", error);
    res.status(500).json({ error: "Server error" });
  }
});
