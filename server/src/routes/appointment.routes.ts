import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { Appointment } from "../models/Appointment.js";
import { Professional } from "../models/Professional.js";
import { User } from "../models/User.js";

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
  const user = await User.findOne({ anonymous_id: anonymousId });
  if (!user) throw new Error("User not found");
  return user._id;
}

// ── 2.2.2 Endpoints: User ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Request an appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = bookingSchema.parse(req.body);
    const userId = await getInternalUserId(req.anonymousId!);

    // Verify professional exists
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
 *     summary: List own appointments
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = await getInternalUserId(req.anonymousId!);
    
    const appointments = await Appointment.find({ user_id: userId })
      .populate("professional_id", "full_name photo_url type email phone")
      .sort({ appointment_date: -1 });

    // Privacy logic: Only show contact info if confirmed or completed
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
 * /api/v1/appointments/{id}/cancel:
 *   put:
 *     summary: Cancel an appointment (User)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Rate a completed appointment
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
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

    // Update professional rating (simplified)
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

// ── 2.2.2 Endpoints: Professional ─────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/appointments/professional:
 *   get:
 *     summary: List incoming requests (Professional)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
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
 * /api/v1/appointments/{id}/confirm:
 *   put:
 *     summary: Accept appointment request (Professional)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
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
 *     summary: Mark as done (Professional)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
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

    // Update professional stats
    prof.sessions_completed += 1;
    await prof.save();

    res.json({ data: appointment });
  } catch (error) {
    next(error);
  }
});

// ── 2.2.2 Endpoints: Admin ────────────────────────────────────────────────────

/**
 * @swagger
 * /api/v1/admin/appointments:
 *   get:
 *     summary: View all appointments (Admin)
 *     tags: [Admin - Appointments]
 *     security:
 *       - bearerAuth: []
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
