import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { Service } from "../models/Service.js";

export const servicesRoutes = Router();

const querySchema = z.object({
  tag: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
});

/**
 * GET /services
 * List all services/clinics with optional tag filtering
 */
servicesRoutes.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tag, type, search } = querySchema.parse(req.query);
    const filter: Record<string, any> = {};

    if (tag) {
      filter.tags = { $in: [tag] };
    }
    if (type) {
      filter.type = type;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { services: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const services = await Service.find(filter).sort({ verified: -1, name: 1 });
    res.json({ data: services });
  } catch (error) {
    next(error);
  }
});
