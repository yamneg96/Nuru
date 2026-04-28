import { Router, type Request, type Response } from "express";
import { Service } from "../models/Service.js";

export const servicesRoutes = Router();

/**
 * GET /services
 * List all services/clinics with optional tag filtering
 */
servicesRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const { tag, type, search } = req.query;
    const filter: Record<string, any> = {};

    if (tag && typeof tag === "string") {
      filter.tags = { $in: [tag] };
    }
    if (type && typeof type === "string") {
      filter.type = type;
    }
    if (search && typeof search === "string") {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { services: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const services = await Service.find(filter).sort({ verified: -1, name: 1 });
    res.json(services);
  } catch (error) {
    console.error("Services error:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});
