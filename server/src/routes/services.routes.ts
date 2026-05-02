import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { Service } from "../models/Service.js";
import { findNearbyServices } from "../services/services.service.js";

export const servicesRoutes = Router();

const querySchema = z.object({
  tag: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
});

const nearbyQuerySchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radius: z.coerce.number().default(5000),
  type: z.string().optional(),
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

/**
 * @swagger
 * /api/v1/services/nearby:
 *   get:
 *     summary: Find nearby health services
 *     description: Search for real clinics, pharmacies, and youth centers near specific coordinates using Google Maps.
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5000
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Merged list of local and Google Maps services
 */
servicesRoutes.get("/nearby", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng, radius, type } = nearbyQuerySchema.parse(req.query);
    const services = await findNearbyServices(lat, lng, radius, type);
    res.json({ data: services });
  } catch (error) {
    next(error);
  }
});
