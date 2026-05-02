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
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: List health services
 *     description: Retrieve a list of verified health clinics, pharmacies, and counseling centers.
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *         description: Filter by tag (e.g. 'youth_friendly')
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by service type (e.g. 'clinic')
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or specific service
 *     responses:
 *       200:
 *         description: List of matching services
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
