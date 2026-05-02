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

// ── Endpoints: Public ─────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: List upcoming events (filterable by category and type)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [health, career, social, education]
 *         description: Filter by event category
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [workshop, talk, gathering, webinar, other]
 *         description: Filter by event type
 *     responses:
 *       200:
 *         description: List of upcoming events
 *       500:
 *         description: Internal server error
 */
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, type } = req.query;
    const filter: any = { date: { $gte: new Date() } };

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
 *     summary: Get details of a specific event
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event details
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
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
 *     summary: Register for an event (idempotent — prevents double registration)
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Registered successfully
 *       400:
 *         description: Already registered or event at full capacity
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Event not found
 */
router.post("/:id/register", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    if (event.registered_users.includes(req.anonymousId!)) {
      return res.status(400).json({ error: "Already registered for this event" });
    }

    if (event.max_attendees && event.attendee_count >= event.max_attendees) {
      return res.status(400).json({ error: "Event is at full capacity" });
    }

    event.registered_users.push(req.anonymousId!);
    event.attendee_count += 1;
    await event.save();

    res.json({ data: { message: "Registered successfully", attendee_count: event.attendee_count } });
  } catch (error) {
    next(error);
  }
});

// ── Endpoints: Admin ──────────────────────────────────────────────────────────

export const adminEventRoutes = Router();

/**
 * @swagger
 * /api/v1/admin/events:
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Admin - Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, type, category, date, location_name, organizer]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               type: { type: string, enum: [workshop, talk, gathering, webinar, other] }
 *               category: { type: string, enum: [health, career, social, education] }
 *               date: { type: string, format: date-time }
 *               location_name: { type: string }
 *               is_online: { type: boolean }
 *               meeting_link: { type: string }
 *               organizer: { type: string }
 *               max_attendees: { type: number }
 *               image_url: { type: string }
 *           example:
 *             title: "Youth Reproductive Health Workshop"
 *             description: "An open workshop discussing safe health practices for adolescents."
 *             type: "workshop"
 *             category: "health"
 *             date: "2026-06-15T09:00:00Z"
 *             location_name: "Addis Ababa Youth Center"
 *             is_online: false
 *             organizer: "Nuru Health Team"
 *             max_attendees: 50
 *     responses:
 *       201:
 *         description: Event created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
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
 *     summary: Edit an existing event (Admin only)
 *     tags: [Admin - Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               date: { type: string, format: date-time }
 *               max_attendees: { type: number }
 *           example:
 *             title: "Updated Workshop Title"
 *             max_attendees: 75
 *     responses:
 *       200:
 *         description: Event updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
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
 *     summary: Delete an event (Admin only)
 *     tags: [Admin - Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: Event deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
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
 *     summary: List registered users for an event (Admin only)
 *     tags: [Admin - Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Event ID
 *     responses:
 *       200:
 *         description: List of registered user anonymous IDs
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Event not found
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
