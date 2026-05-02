import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { verifyGoogleToken, hashEmail, findOrCreateUser, generateTokens, refreshAccessToken, verifyAdminCredentials, registerAdmin } from "../services/auth.service.js";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

const setRefreshCookie = (res: Response, token: string) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export const authRoutes = Router();

const googleLoginSchema = z.object({
  credential: z.string().min(1, "Google credential is required"),
  previous_anonymous_id: z.string().optional(),
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
    const { credential, previous_anonymous_id } = googleLoginSchema.parse(req.body);

    // 1. Verify Google token & extract email
    const email = await verifyGoogleToken(credential);

    // 2. Hash email — raw email is NEVER stored
    const emailHash = hashEmail(email);

    // 3. Find or create anonymous user (with migration logic)
    const user = await findOrCreateUser(emailHash, previous_anonymous_id);

    // 4. Generate Tokens
    const { accessToken, refreshToken } = await generateTokens(user);

    // 5. Set refresh token in HTTP-only cookie
    setRefreshCookie(res, refreshToken);

    // 6. Return access token + anonymous_id (no PII)
    res.json({
      data: {
        token: accessToken,
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

    const { accessToken, refreshToken } = await generateTokens(user);
    setRefreshCookie(res, refreshToken);

    res.json({
      data: {
        token: accessToken,
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
 * /api/v1/auth/admin/register:
 *   post:
 *     summary: Register a new admin (admin only)
 *     description: Create a new admin or super_admin account. Only callable by existing admins.
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               role: { type: string, enum: [admin, super_admin] }
 *     responses:
 *       201:
 *         description: Admin created
 *       403:
 *         description: Forbidden
 */
authRoutes.post("/admin/register", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adminSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(8),
      role: z.enum(["admin", "super_admin"]).optional(),
    });

    const data = adminSchema.parse(req.body);
    const admin = await registerAdmin(data);

    res.status(201).json({
      data: (admin as any).toSafeJSON(),
    });
  } catch (error: any) {
    if (error.message === "Admin email already registered") {
      return res.status(400).json({ error: { code: "BAD_REQUEST", message: error.message } });
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

/**
 * @swagger
 * /api/v1/auth/anonymous:
 *   post:
 *     summary: Create an anonymous user account
 *     tags: [Auth]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: object
 *     responses:
 *       200:
 *         description: Success
 */
authRoutes.post("/anonymous", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { preferences } = req.body;
    
    const user = await User.create({
      role: "user",
      preferences: preferences || { language: "english", save_history: true },
    });

    const { accessToken, refreshToken } = await generateTokens(user);
    setRefreshCookie(res, refreshToken);

    res.json({
      data: {
        token: accessToken,
        user: (user as any).toSafeJSON(),
      },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Exchange a valid refresh token cookie for a new access token.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: New access token
 */
authRoutes.post("/refresh", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Refresh token missing" } });
    }

    const { accessToken } = await refreshAccessToken(refreshToken);

    res.json({
      data: {
        token: accessToken,
      },
    });
  } catch (error: any) {
    logger.error({ error: error.message }, "Refresh token error");
    res.status(401).json({ error: { code: "UNAUTHORIZED", message: "Invalid refresh token" } });
  }
});

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Clear refresh token cookie and invalidate it in the database.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
authRoutes.post("/logout", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await RefreshToken.deleteOne({ token: refreshToken });
    }
    res.clearCookie("refreshToken");
    res.json({ data: { success: true } });
  } catch (error) {
    next(error);
  }
});
