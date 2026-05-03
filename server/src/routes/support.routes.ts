import express, { type Request, type Response } from "express";
import { z } from "zod";
import { SupportTicket } from "../models/SupportTicket.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

const createTicketSchema = z.object({
  name: z.string().trim().max(100).optional(),
  email: z.string().email().trim().optional(),
  subject: z.string().trim().min(3).max(200),
  message: z.string().trim().min(10).max(5000),
  category: z.enum(["general", "medical", "technical", "escalation"]).default("general"),
  source: z.enum(["web", "telegram", "whatsapp"]).default("web"),
});

router.post("/tickets", async (req: Request, res: Response) => {
  try {
    const parsed = createTicketSchema.parse(req.body);

    const ticket = await SupportTicket.create({
      ...parsed,
      priority: parsed.category === "medical" || parsed.category === "escalation"
        ? "high"
        : "medium",
    });

    logger.info(
      { ticketId: ticket.ticketId, category: ticket.category },
      "Support ticket created"
    );

    res.status(201).json({
      data: {
        ticketId: ticket.ticketId,
        status: ticket.status,
        category: ticket.category,
        createdAt: ticket.createdAt,
      },
    });
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: err.issues?.[0]?.message ?? "Validation failed",
          details: err.issues,
        },
      });
    }

    logger.error(err, "Failed to create support ticket");
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Failed to create ticket" },
    });
  }
});

router.get("/tickets/:ticketId", async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;

    const ticket = await SupportTicket.findOne({ ticketId })
      .select("ticketId status category subject createdAt updatedAt responses")
      .lean();

    if (!ticket) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Ticket not found" },
      });
    }

    res.json({
      data: {
        ticketId: ticket.ticketId,
        status: ticket.status,
        category: ticket.category,
        subject: ticket.subject,
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
        responseCount: ticket.responses?.length ?? 0,
      },
    });
  } catch (err) {
    logger.error(err, "Failed to get ticket status");
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Failed to retrieve ticket" },
    });
  }
});

export const supportRoutes = router;

// ── Admin Routes ──────────────────────────────────────────────
const adminRouter = express.Router();

adminRouter.get("/tickets", async (req: Request, res: Response) => {
  try {
    const {
      status,
      category,
      page = "1",
      limit = "20",
    } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [tickets, total] = await Promise.all([
      SupportTicket.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .populate("assignedTo", "name specialization")
        .lean(),
      SupportTicket.countDocuments(filter),
    ]);

    res.json({
      data: {
        tickets,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (err) {
    logger.error(err, "Failed to list support tickets");
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Failed to list tickets" },
    });
  }
});

const updateTicketSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  assignedTo: z.string().optional(),
  response: z.object({
    responderName: z.string().trim().min(1),
    message: z.string().trim().min(1).max(5000),
  }).optional(),
});

adminRouter.patch("/tickets/:ticketId", async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const parsed = updateTicketSchema.parse(req.body);

    const ticket = await SupportTicket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({
        error: { code: "NOT_FOUND", message: "Ticket not found" },
      });
    }

    if (parsed.status) ticket.status = parsed.status;
    if (parsed.priority) ticket.priority = parsed.priority;
    if (parsed.assignedTo) ticket.assignedTo = parsed.assignedTo as any;

    if (parsed.response) {
      ticket.responses.push({
        responderName: parsed.response.responderName,
        message: parsed.response.message,
        createdAt: new Date(),
      });
    }

    await ticket.save();

    logger.info({ ticketId, updates: Object.keys(parsed) }, "Support ticket updated");

    res.json({ data: ticket });
  } catch (err: any) {
    if (err.name === "ZodError" || err.issues) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: err.issues?.[0]?.message ?? "Validation failed",
        },
      });
    }

    logger.error(err, "Failed to update support ticket");
    res.status(500).json({
      error: { code: "INTERNAL_ERROR", message: "Failed to update ticket" },
    });
  }
});

export const adminSupportRoutes = adminRouter;
