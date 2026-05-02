import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { verifyGoogleToken, hashEmail, findOrCreateUser, generateJWT, verifyAdminCredentials } from "../services/auth.service.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { User } from "../models/User.js";

export const authRoutes = Router();

const googleLoginSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
});

const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

/**
 * @swagger
 * /api/v1/auth/google:
 *   post:
 *     summary: Authenticate via Google OAuth
 *     description: Exchange a Google credential token for an anonymous Nuru JWT.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [credential]
 *             properties:
 *               credential:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 */
authRoutes.post("/google", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const { credential } = googleLoginSchema.parse(req.body);

    // 1. Verify Google token & extract email
    const email = await verifyGoogleToken(credential);

    // 2. Hash email — raw email is NEVER stored
    const emailHash = hashEmail(email);

    // 3. Find or create anonymous user
    const user = await findOrCreateUser(emailHash);

    // 4. Generate JWT with anonymous_id and role
    const token = generateJWT(user.anonymous_id!, user.role);

    // 5. Return token + anonymous_id (no PII)
    res.json({
      data: {
        token,
        user: (user as any).toSafeJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/auth/admin/login:
 *   post:
 *     summary: Admin Login
 *     description: Authenticate an admin user via email and password.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully authenticated as admin
 *       401:
 *         description: Invalid credentials
 */
authRoutes.post("/admin/login", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = adminLoginSchema.parse(req.body);

    const user = await verifyAdminCredentials(email, password);

    const token = generateJWT(user.id, user.role);

    res.json({
      data: {
        token,
        user: (user as any).toSafeJSON(),
      },
    });
  } catch (error) {
    // Map service error to 401
    if (error instanceof Error && error.message === "Invalid credentials") {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "Invalid email or password" },
      });
    }
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Get current user profile
 *     description: Retrieve the profile of the currently authenticated user.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
authRoutes.get("/me", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    let user;
    if (req.userRole === "admin") {
      user = await User.findById(req.anonymousId);
    } else {
      user = await User.findOne({ anonymous_id: req.anonymousId });
    }
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

/**
 * @swagger
 * /api/v1/auth/admin/verify:
 *   get:
 *     summary: Verify admin status
 *     description: Check if the current token belongs to an admin.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid and belongs to an admin
 *       401:
 *         description: Unauthorized or not an admin
 *       403:
 *         description: Forbidden (Not an admin)
 */
authRoutes.get("/admin/verify", authMiddleware, isAdmin, (req: Request, res: Response) => {
  res.json({ data: { verified: true, role: req.userRole } });
});
