import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { Appointment } from "../models/Appointment.js";
import { Professional } from "../models/Professional.js";
import { User } from "../models/User.js";
import { logger } from "../utils/logger.js";

const router = Router();

// ── Validation Schemas ─────────────────────────────────────────────────────────

const bookingSchema = z.object({
  professional_id: z.string(),
  appointment_date: z.string().datetime(),
  duration_minutes: z.number().min(15).max(120).default(60),
  type: z.enum(["online", "offline"]),
  notes: z.string().max(1000).optional().nullable(),
});

const cancellationSchema = z.object({
  reason: z.string().optional().nullable(),
});

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().max(500).optional().nullable(),
});

// ── Helpers ──────────────────────────────────────────────────────────────────

async function getInternalUserId(anonymousId: string) {
  logger.info({ anonymousId }, "Resolving internal user ID");
  const user = await User.findOne({ anonymous_id: anonymousId });
  if (!user) {
    logger.error({ anonymousId }, "User not found for given anonymousId");
    throw new Error("User not found");
  }
  return user._id;
}

// ── Endpoints: User ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Request an appointment with a verified professional
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [professional_id, appointment_date, type]
 *             properties:
 *               professional_id:
 *                 type: string
 *                 description: MongoDB ObjectId of a verified professional
 *               appointment_date:
 *                 type: string
 *                 format: date-time
 *               duration_minutes:
 *                 type: number
 *                 default: 60
 *               type:
 *                 type: string
 *                 enum: [online, offline]
 *               notes:
 *                 type: string
 *           example:
 *             professional_id: "69f6447bad688f304865dc75"
 *             appointment_date: "2026-05-10T14:30:00Z"
 *             duration_minutes: 60
 *             type: "online"
 *             notes: "I would like to discuss reproductive health."
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Verified professional not found
 *       401:
 *         description: Unauthorized - token missing or expired
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info({ body: req.body, user: req.anonymousId }, "Appointment request received");
    const data = bookingSchema.parse(req.body);
    const userId = await getInternalUserId(req.anonymousId!);

    const prof = await Professional.findById(data.professional_id);
    if (!prof || prof.verification_status !== "verified") {
      return res.status(404).json({ error: "Verified professional not found" });
    }

    const appointment = await Appointment.create({
      ...data,
      user_id: userId,
      status: "pending",
    });

    res.status(201).json({ data: appointment });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     summary: List your own appointments (contact info revealed only when confirmed)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointments
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getInternalUserId(req.anonymousId!);
    
    const appointments = await Appointment.find({ user_id: userId })
      .populate("professional_id", "full_name photo_url type email phone")
      .sort({ appointment_date: -1 });

    const safeAppointments = appointments.map(apt => {
      const obj = apt.toObject() as any;
      if (obj.status !== "confirmed" && obj.status !== "completed") {
        if (obj.professional_id) {
          delete obj.professional_id.email;
          delete obj.professional_id.phone;
        }
      }
      return obj;
    });

    res.json({ data: safeAppointments });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/appointments/professional:
 *   get:
 *     summary: List incoming appointment requests (for professionals only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of appointment requests for this professional
 *       403:
 *         description: Forbidden - you are not a registered professional
 *       401:
 *         description: Unauthorized
 */
router.get("/professional", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getInternalUserId(req.anonymousId!);
    const prof = await Professional.findOne({ user_id: userId });
    if (!prof) return res.status(403).json({ error: "Not a registered professional" });

    const appointments = await Appointment.find({ professional_id: prof._id })
      .populate("user_id", "name anonymous_id preferences")
      .sort({ appointment_date: -1 });

    res.json({ data: appointments });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/appointments/{id}/cancel:
 *   put:
 *     summary: Cancel your own appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *         example: "69f6447ead688f304865dc85"
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *           example:
 *             reason: "Schedule conflict"
 *     responses:
 *       200:
 *         description: Appointment cancelled
 *       400:
 *         description: Cannot cancel a finished appointment
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id/cancel", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { reason } = cancellationSchema.parse(req.body);
    const userId = await getInternalUserId(req.anonymousId!);

    const appointment = await Appointment.findOne({ _id: req.params.id, user_id: userId });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    if (appointment.status === "cancelled" || appointment.status === "completed") {
      return res.status(400).json({ error: "Cannot cancel a finished appointment" });
    }

    appointment.status = "cancelled";
    appointment.cancelled_by = "user";
    appointment.cancellation_reason = reason || null;
    await appointment.save();

    res.json({ data: appointment });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/appointments/{id}/rate:
 *   post:
 *     summary: Rate a completed appointment (1–5 stars)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *         example: "69f619bae9afc98250ee3fdb"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               review:
 *                 type: string
 *           example:
 *             rating: 5
 *             review: "Excellent and very helpful session!"
 *     responses:
 *       200:
 *         description: Rating submitted and professional score updated
 *       400:
 *         description: Appointment not completed or already rated
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
router.post("/:id/rate", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { rating, review } = ratingSchema.parse(req.body);
    const userId = await getInternalUserId(req.anonymousId!);

    const appointment = await Appointment.findOne({ _id: req.params.id, user_id: userId });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    if (appointment.status !== "completed") {
      return res.status(400).json({ error: "Only completed appointments can be rated" });
    }

    if (appointment.user_rating !== null) {
      return res.status(400).json({ error: "Appointment already rated" });
    }

    appointment.user_rating = rating;
    appointment.user_review = review || null;
    await appointment.save();

    const prof = await Professional.findById(appointment.professional_id);
    if (prof) {
      const totalRating = (prof.rating * prof.rating_count) + rating;
      prof.rating_count += 1;
      prof.rating = totalRating / prof.rating_count;
      await prof.save();
    }

    res.json({ data: appointment });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/appointments/{id}/confirm:
 *   put:
 *     summary: Confirm a pending appointment (professionals only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *         example: "69f6447ead688f304865dc86"
 *     responses:
 *       200:
 *         description: Appointment confirmed — user can now see contact details
 *       400:
 *         description: Can only confirm pending appointments
 *       403:
 *         description: Forbidden - you are not a registered professional
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id/confirm", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getInternalUserId(req.anonymousId!);
    const prof = await Professional.findOne({ user_id: userId });
    if (!prof) return res.status(403).json({ error: "Not a registered professional" });

    const appointment = await Appointment.findOne({ _id: req.params.id, professional_id: prof._id });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    if (appointment.status !== "pending") {
      return res.status(400).json({ error: "Can only confirm pending appointments" });
    }

    appointment.status = "confirmed";
    await appointment.save();

    res.json({ data: appointment });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/appointments/{id}/complete:
 *   put:
 *     summary: Mark an appointment as completed (professionals only)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Appointment ID
 *         example: "69f6447ead688f304865dc85"
 *     responses:
 *       200:
 *         description: Appointment marked as completed. User can now rate the session.
 *       400:
 *         description: Only confirmed appointments can be completed
 *       403:
 *         description: Forbidden - you are not a registered professional
 *       404:
 *         description: Appointment not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id/complete", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getInternalUserId(req.anonymousId!);
    const prof = await Professional.findOne({ user_id: userId });
    if (!prof) return res.status(403).json({ error: "Not a registered professional" });

    const appointment = await Appointment.findOne({ _id: req.params.id, professional_id: prof._id });
    if (!appointment) return res.status(404).json({ error: "Appointment not found" });

    if (appointment.status !== "confirmed") {
      return res.status(400).json({ error: "Only confirmed appointments can be completed" });
    }

    appointment.status = "completed";
    await appointment.save();

    prof.sessions_completed += 1;
    await prof.save();

    res.json({ data: appointment });
  } catch (error) {
    next(error);
  }
});

// ── Endpoints: Admin ──────────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/admin/appointments:
 *   get:
 *     summary: View all appointments on the platform (Admin only)
 *     tags: [Admin - Appointments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full list of all appointments with populated user and professional data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - admin access required
 */
export const adminAppointmentRoutes = Router();
adminAppointmentRoutes.get("/", authMiddleware, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointments = await Appointment.find()
      .populate("user_id", "name email anonymous_id")
      .populate("professional_id", "full_name type")
      .sort({ created_at: -1 });

    res.json({ data: appointments });
  } catch (error) {
    next(error);
  }
});

export default router;
