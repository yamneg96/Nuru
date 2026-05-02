import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { Professional } from "../models/Professional.js";
import { User } from "../models/User.js";

// ── Public / Professional Routes ───────────────────────────────────────────────
export const professionalRoutes = Router();

// ── Admin Routes ───────────────────────────────────────────────────────────────
export const adminProfessionalRoutes = Router();

// ── Validation Schemas ─────────────────────────────────────────────────────────

const registrationSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  photo_url: z.string().url().optional(),
  bio: z.string().max(500),
  type: z.enum(["medical", "counselor", "therapist", "psychiatrist", "trainer", "content_creator", "influencer"]),
  specializations: z.array(z.string()),
  license_number: z.string().optional().nullable(),
  institution: z.string(),
  years_of_experience: z.coerce.number().min(0),
  availability: z.object({
    online: z.boolean().default(false),
    offline: z.boolean().default(false),
    schedule: z.string().optional().nullable(),
  }),
  city: z.string(),
  region: z.string(),
  coordinates: z.object({
    lng: z.number(),
    lat: z.number(),
  }),
  social_links: z.object({
    instagram: z.string().optional().nullable(),
    tiktok: z.string().optional().nullable(),
    youtube: z.string().optional().nullable(),
    telegram: z.string().optional().nullable(),
    linkedin: z.string().optional().nullable(),
  }).optional(),
});

const updateSchema = registrationSchema.partial();

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getInternalUserId(anonymousId: string) {
  const user = await User.findOne({ anonymous_id: anonymousId });
  if (!user) throw new Error("Authenticated user not found in database");
  return user._id;
}

// ── Endpoints: Public ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/professionals:
 *   get:
 *     summary: List verified professionals (filterable by type, city, availability)
 *     tags: [Professionals]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [medical, counselor, therapist, psychiatrist, trainer, content_creator, influencer]
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: online
 *         schema: { type: boolean }
 *       - in: query
 *         name: offline
 *         schema: { type: boolean }
 *     responses:
 *       200:
 *         description: List of verified professionals (PII hidden)
 *       500:
 *         description: Internal server error
 */
professionalRoutes.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, city, online, offline } = req.query;
    const filter: any = { verification_status: "verified", is_active: true };

    if (type) filter.type = type;
    if (city) filter.city = city;
    if (online === "true") filter["availability.online"] = true;
    if (offline === "true") filter["availability.offline"] = true;

    const professionals = await Professional.find(filter)
      .select("-email -phone -license_number -user_id")
      .sort({ rating: -1, created_at: -1 });

    res.json({ data: professionals });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/professionals/nearby:
 *   get:
 *     summary: Find professionals near a geographic location
 *     tags: [Professionals]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema: { type: number }
 *         description: Latitude (e.g. 9.03)
 *         example: 9.03
 *       - in: query
 *         name: lng
 *         required: true
 *         schema: { type: number }
 *         description: Longitude (e.g. 38.75)
 *         example: 38.75
 *       - in: query
 *         name: radius
 *         schema: { type: number, default: 10000 }
 *         description: Search radius in meters (default 10km)
 *       - in: query
 *         name: type
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Professionals near the given coordinates
 *       400:
 *         description: lat and lng are required
 *       500:
 *         description: Internal server error
 */
professionalRoutes.get("/nearby", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng, radius = 10000, type } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: "lat and lng are required" });

    const filter: any = {
      verification_status: "verified",
      is_active: true,
      coordinates: {
        $near: {
          $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius),
        },
      },
    };

    if (type) filter.type = type;

    const professionals = await Professional.find(filter).select("-email -phone -license_number -user_id");
    res.json({ data: professionals });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/professionals/me:
 *   get:
 *     summary: Get your own full professional profile (includes PII)
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Your full professional profile
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
professionalRoutes.get("/me", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getInternalUserId(req.anonymousId!);
    const prof = await Professional.findOne({ user_id: userId });
    if (!prof) return res.status(404).json({ error: "Professional profile not found" });
    res.json({ data: prof });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/professionals/me:
 *   put:
 *     summary: Update your own professional profile
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio: { type: string }
 *               city: { type: string }
 *               availability:
 *                 type: object
 *                 properties:
 *                   online: { type: boolean }
 *                   offline: { type: boolean }
 *           example:
 *             bio: "Updated bio with 5 years of experience in adolescent health."
 *             city: "Adama"
 *             availability:
 *               online: true
 *               offline: false
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
professionalRoutes.put("/me", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateSchema.parse(req.body);
    const userId = await getInternalUserId(req.anonymousId!);

    const updateData: any = { ...data };
    if (data.coordinates) {
      updateData.coordinates = {
        type: "Point",
        coordinates: [data.coordinates.lng, data.coordinates.lat]
      };
    }

    const prof = await Professional.findOneAndUpdate(
      { user_id: userId },
      { $set: updateData },
      { new: true }
    );

    if (!prof) return res.status(404).json({ error: "Professional profile not found" });
    res.json({ data: prof });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/professionals/register:
 *   post:
 *     summary: Submit a professional volunteer application
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [full_name, email, phone, bio, type, specializations, institution, years_of_experience, availability, city, region, coordinates]
 *             properties:
 *               full_name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               bio: { type: string }
 *               type: { type: string, enum: [medical, counselor, therapist, psychiatrist, trainer, content_creator, influencer] }
 *               specializations: { type: array, items: { type: string } }
 *               institution: { type: string }
 *               years_of_experience: { type: number }
 *               availability:
 *                 type: object
 *                 properties:
 *                   online: { type: boolean }
 *                   offline: { type: boolean }
 *               city: { type: string }
 *               region: { type: string }
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat: { type: number }
 *                   lng: { type: number }
 *           example:
 *             full_name: "Dr. Tigist Haile"
 *             email: "tigist@example.com"
 *             phone: "0911234567"
 *             bio: "Reproductive health specialist with 7 years serving youth in Addis Ababa."
 *             type: "medical"
 *             specializations: ["reproductive health", "adolescent care"]
 *             institution: "Tikur Anbessa Hospital"
 *             years_of_experience: 7
 *             availability: { online: true, offline: true }
 *             city: "Addis Ababa"
 *             region: "Addis Ababa"
 *             coordinates: { lat: 9.03, lng: 38.75 }
 *     responses:
 *       201:
 *         description: Application submitted — pending admin verification
 *       400:
 *         description: Application already submitted or validation error
 *       401:
 *         description: Unauthorized
 */
professionalRoutes.post("/register", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registrationSchema.parse(req.body);
    const userId = await getInternalUserId(req.anonymousId!);

    const existing = await Professional.findOne({ user_id: userId });
    if (existing) return res.status(400).json({ error: "Application already submitted" });

    const prof = await Professional.create({
      ...data,
      user_id: userId,
      coordinates: {
        type: "Point",
        coordinates: [data.coordinates.lng, data.coordinates.lat]
      },
      verification_status: "pending",
    });

    res.status(201).json({ data: prof });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/professionals/{id}:
 *   get:
 *     summary: Get a verified professional's public profile
 *     tags: [Professionals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Professional ID
 *         example: "69f6447bad688f304865dc75"
 *     responses:
 *       200:
 *         description: Public professional profile (PII hidden)
 *       404:
 *         description: Professional not found or not verified
 *       500:
 *         description: Internal server error
 */
professionalRoutes.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prof = await Professional.findOne({ _id: req.params.id, verification_status: "verified" })
      .select("-email -phone -license_number -user_id");
    
    if (!prof) return res.status(404).json({ error: "Professional not found" });
    res.json({ data: prof });
  } catch (error) {
    next(error);
  }
});

// ── Endpoints: Admin ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/admin/professionals:
 *   get:
 *     summary: List ALL professionals including pending and rejected (Admin only)
 *     tags: [Admin - Professionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, verified, rejected]
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: Full list with PII included
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 */
adminProfessionalRoutes.get("/", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = req.query;
    const filter: any = {};
    if (status) filter.verification_status = status;

    const professionals = await Professional.find(filter).sort({ created_at: -1 });
    res.json({ data: professionals });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/admin/professionals/{id}/verify:
 *   put:
 *     summary: Verify or reject a professional application (Admin only)
 *     tags: [Admin - Professionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Professional ID
 *         example: "69f6447bad688f304865dc75"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [verified, rejected]
 *           example:
 *             status: "verified"
 *     responses:
 *       200:
 *         description: Verification status updated
 *       400:
 *         description: Invalid status value
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Professional not found
 */
adminProfessionalRoutes.put("/:id/verify", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status } = z.object({ status: z.enum(["verified", "rejected"]) }).parse(req.body);
    const adminId = await getInternalUserId(req.anonymousId!);

    const prof = await Professional.findByIdAndUpdate(
      req.params.id,
      { 
        $set: { 
          verification_status: status,
          verified_by: adminId,
          verified_at: new Date()
        } 
      },
      { new: true }
    );

    if (!prof) return res.status(404).json({ error: "Professional not found" });
    res.json({ data: prof });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/admin/professionals/{id}:
 *   put:
 *     summary: Edit any professional profile (Admin only)
 *     tags: [Admin - Professionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Professional ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio: { type: string }
 *               city: { type: string }
 *               institution: { type: string }
 *           example:
 *             bio: "Updated by admin."
 *             city: "Hawassa"
 *     responses:
 *       200:
 *         description: Professional profile updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Professional not found
 */
adminProfessionalRoutes.put("/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = updateSchema.parse(req.body);
    const updateData: any = { ...data };
    
    if (data.coordinates) {
      updateData.coordinates = {
        type: "Point",
        coordinates: [data.coordinates.lng, data.coordinates.lat]
      };
    }

    const prof = await Professional.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    if (!prof) return res.status(404).json({ error: "Professional not found" });
    res.json({ data: prof });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/admin/professionals/{id}:
 *   delete:
 *     summary: Remove a professional from the platform (Admin only)
 *     tags: [Admin - Professionals]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: Professional ID
 *     responses:
 *       200:
 *         description: Professional deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Professional not found
 */
adminProfessionalRoutes.delete("/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const prof = await Professional.findByIdAndDelete(req.params.id);
    if (!prof) return res.status(404).json({ error: "Professional not found" });
    res.json({ data: { message: "Professional deleted successfully" } });
  } catch (error) {
    next(error);
  }
});
