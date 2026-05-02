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

/** Get the internal MongoDB _id for the current authenticated user */
async function getInternalUserId(anonymousId: string) {
  const user = await User.findOne({ anonymous_id: anonymousId });
  if (!user) throw new Error("Authenticated user not found in database");
  return user._id;
}

// ── 2.1.2 Endpoints: Public ───────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/professionals:
 *   get:
 *     summary: List verified professionals
 *     tags: [Professionals]
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
 *     summary: Find professionals near location
 *     tags: [Professionals]
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
 * /api/v1/professionals/{id}:
 *   get:
 *     summary: Get professional detail
 *     tags: [Professionals]
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

// ── 2.1.2 Endpoints: Self-service ─────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/professionals/register:
 *   post:
 *     summary: Submit professional application
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
 */
professionalRoutes.post("/register", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registrationSchema.parse(req.body);
    const userId = await getInternalUserId(req.anonymousId!);

    // Check if user already has a profile
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
 * /api/v1/professionals/me:
 *   get:
 *     summary: Get own full profile
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Update own profile
 *     tags: [Professionals]
 *     security:
 *       - bearerAuth: []
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

// ── 2.1.2 Endpoints: Admin ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/admin/professionals:
 *   get:
 *     summary: List ALL professionals (Admin)
 *     tags: [Admin - Professionals]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Verify/Reject professional (Admin)
 *     tags: [Admin - Professionals]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Edit any professional (Admin)
 *     tags: [Admin - Professionals]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Remove professional entirely (Admin)
 *     tags: [Admin - Professionals]
 *     security:
 *       - bearerAuth: []
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
