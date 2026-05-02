import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { Event } from "../models/Event.js";

const router = Router();

// ── Validation Schemas ─────────────────────────────────────────────────────────

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  type: z.enum(["workshop", "talk", "gathering", "webinar", "other"]),
  category: z.enum(["health", "career", "social", "education"]),
  date: z.string().datetime(),
  location_name: z.string(),
  is_online: z.boolean().default(false),
  meeting_link: z.string().url().optional().nullable(),
  organizer: z.string(),
  max_attendees: z.number().int().positive().optional().nullable(),
  image_url: z.string().url().optional().nullable(),
});

// ── 2.3.2 Endpoints: Public ───────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: List upcoming events
 *     tags: [Events]
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, type } = req.query;
    const filter: any = { date: { $gte: new Date() } }; // Only future events

    if (category) filter.category = category;
    if (type) filter.type = type;

    const events = await Event.find(filter)
      .select("-registered_users")
      .sort({ date: 1 });

    res.json({ data: events });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/events/{id}:
 *   get:
 *     summary: Get event details
 *     tags: [Events]
 */
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id).select("-registered_users");
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ data: event });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/events/{id}/register:
 *   post:
 *     summary: Register for an event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/register", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if already registered
    if (event.registered_users.includes(req.anonymousId!)) {
      return res.status(400).json({ error: "Already registered for this event" });
    }

    // Check capacity
    if (event.max_attendees && event.attendee_count >= event.max_attendees) {
      return res.status(400).json({ error: "Event is at full capacity" });
    }

    // Register
    event.registered_users.push(req.anonymousId!);
    event.attendee_count += 1;
    await event.save();

    res.json({ data: { message: "Registered successfully", attendee_count: event.attendee_count } });
  } catch (error) {
    next(error);
  }
});

// ── 2.3.2 Endpoints: Admin ────────────────────────────────────────────────────

export const adminEventRoutes = Router();

/**
 * @swagger
 * /api/v1/admin/events:
 *   post:
 *     summary: Create event (Admin)
 *     tags: [Admin - Events]
 *     security:
 *       - bearerAuth: []
 */
adminEventRoutes.post("/", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = eventSchema.parse(req.body);
    const event = await Event.create(data);
    res.status(201).json({ data: event });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/admin/events/{id}:
 *   put:
 *     summary: Edit event (Admin)
 *     tags: [Admin - Events]
 *     security:
 *       - bearerAuth: []
 */
adminEventRoutes.put("/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = eventSchema.partial().parse(req.body);
    const event = await Event.findByIdAndUpdate(req.params.id, { $set: data }, { new: true });
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ data: event });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/admin/events/{id}:
 *   delete:
 *     summary: Delete event (Admin)
 *     tags: [Admin - Events]
 *     security:
 *       - bearerAuth: []
 */
adminEventRoutes.delete("/:id", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ data: { message: "Event deleted successfully" } });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/admin/events/{id}/attendees:
 *   get:
 *     summary: List registered users (Admin)
 *     tags: [Admin - Events]
 *     security:
 *       - bearerAuth: []
 */
adminEventRoutes.get("/:id/attendees", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json({ data: event.registered_users });
  } catch (error) {
    next(error);
  }
});

export default router;
