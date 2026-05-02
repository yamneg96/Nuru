import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import bcrypt from "bcrypt";
import { authMiddleware, isSuperAdmin, isAdmin } from "../middleware/auth.middleware.js";
import { User } from "../models/User.js";

export const adminManagementRoutes = Router();

const adminCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(["admin", "super_admin"]).default("admin"),
});

const adminUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["admin", "super_admin"]).optional(),
});

// ── Super Admin Operations ──────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: List all admin users (Super Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of admin users
 */
adminManagementRoutes.get("/users", authMiddleware, isSuperAdmin, async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const admins = await User.find({ role: { $in: ["admin", "super_admin"] } }).sort({ created_at: -1 });
    res.json({ data: admins.map((a) => a.toSafeJSON()) });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/admin/users:
 *   post:
 *     summary: Create a new admin or super admin (Super Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, name, password]
 *             properties:
 *               email: { type: string }
 *               name: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [admin, super_admin] }
 *     responses:
 *       201:
 *         description: Admin created
 */
adminManagementRoutes.post("/users", authMiddleware, isSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password, role } = adminCreateSchema.parse(req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: { code: "ALREADY_EXISTS", message: "User with this email already exists" } });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const admin = await User.create({
      email,
      name,
      password_hash,
      role,
      preferences: { language: "english", save_history: true },
    });

    res.status(201).json({ data: admin.toSafeJSON() });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   put:
 *     summary: Update an admin user (Super Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [admin, super_admin] }
 *     responses:
 *       200:
 *         description: Admin updated
 */
adminManagementRoutes.put("/users/:id", authMiddleware, isSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = adminUpdateSchema.parse(req.body);
    const update: Record<string, any> = {};

    if (data.name) update.name = data.name;
    if (data.role) update.role = data.role;
    if (data.password) {
      update.password_hash = await bcrypt.hash(data.password, 12);
    }

    const admin = await User.findOneAndUpdate(
      { _id: req.params.id, role: { $in: ["admin", "super_admin"] } },
      { $set: update },
      { new: true }
    );

    if (!admin) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Admin not found" } });
    }

    res.json({ data: admin.toSafeJSON() });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete an admin user (Super Admin only)
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Admin deleted
 */
adminManagementRoutes.delete("/users/:id", authMiddleware, isSuperAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Prevent self-deletion of the last super admin? 
    // For now, just delete.
    const admin = await User.findOneAndDelete({
      _id: req.params.id,
      role: { $in: ["admin", "super_admin"] }
    });

    if (!admin) {
      return res.status(404).json({ error: { code: "NOT_FOUND", message: "Admin not found" } });
    }

    res.json({ data: { message: "Admin account deleted successfully" } });
  } catch (error) {
    next(error);
  }
});

// ── Profile Operations (Self-Management) ──────────────────────────────────────

/**
 * @swagger
 * /api/v1/admin/profile:
 *   get:
 *     summary: Get my own admin profile
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current admin profile
 */
adminManagementRoutes.get("/profile", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Since we only have anonymousId in req for users, 
    // for admins it's the actual _id (sub from JWT)
    const admin = await User.findById(req.anonymousId);
    if (!admin) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json({ data: admin.toSafeJSON() });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/admin/profile:
 *   put:
 *     summary: Update my own admin profile
 *     tags: [Admin Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               password: { type: string }
 *     responses:
 *       200:
 *         description: Profile updated
 */
adminManagementRoutes.put("/profile", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, password } = z.object({
      name: z.string().min(2).optional(),
      password: z.string().min(8).optional()
    }).parse(req.body);

    const update: Record<string, any> = {};
    if (name) update.name = name;
    if (password) update.password_hash = await bcrypt.hash(password, 12);

    const admin = await User.findByIdAndUpdate(req.anonymousId, { $set: update }, { new: true });
    if (!admin) return res.status(404).json({ error: "Profile not found" });

    res.json({ data: admin.toSafeJSON() });
  } catch (error) {
    next(error);
  }
});
