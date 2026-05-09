import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { Service } from "../models/Service.js";
import { findNearbyServices } from "../services/services.service.js";

export const servicesRoutes = Router();

const querySchema = z.object({
  tag: z.string().optional(),
  type: z.string().optional(),
  search: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

const nearbyQuerySchema = z.object({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radius: z.coerce.number().default(5000),
  type: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: List health services (admin-curated + real-time fallback)
 *     description: Returns admin-verified services from the database. If none exist, falls back to OpenStreetMap real-time data near Addis Ababa. For user-location-based search, use `/services/nearby`.
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
 *           enum: [clinic, pharmacy, hospital, youth_center, counseling]
 *         description: Filter by service type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Optional latitude for real-time fallback
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: Optional longitude for real-time fallback
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page (max 100)
 *     responses:
 *       200:
 *         description: List of health services
 */
servicesRoutes.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { tag, type, search, lat, lng, page, limit } = querySchema.parse(req.query);
    const filter: Record<string, any> = {};

    if (tag) filter.tags = { $in: [tag] };
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { services: { $elemMatch: { $regex: search, $options: "i" } } },
      ];
    }

    const skip = (page - 1) * limit;
    const total = await Service.countDocuments(filter);
    const services = await Service.find(filter)
      .sort({ verified: -1, name: 1 })
      .skip(skip)
      .limit(limit);

    // If DB is empty, fall back to real-time OSM data
    if (total === 0) {
      const searchLat = lat || 9.03; // Default to Addis Ababa if no lat provided
      const searchLng = lng || 38.75;
      const { findNearbyServices } = await import("../services/services.service.js");
      const osmServices = await findNearbyServices(searchLat, searchLng, 10000, type);
      
      const noteMsg = (lat && lng) 
        ? `No admin-curated services found. Showing real-time data near your location (${lat}, ${lng}).`
        : "No admin-curated services found. Showing real-time data near Addis Ababa. Provide lat/lng for your location.";

      const paginatedOsm = osmServices.slice(skip, skip + limit);

      return res.json({ 
        data: paginatedOsm, 
        meta: { page, limit, total: osmServices.length, pages: Math.ceil(osmServices.length / limit) },
        source: "openstreetmap", 
        note: noteMsg 
      });
    }

    res.json({ 
      data: services,
      meta: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/services/nearby:
 *   get:
 *     summary: Find real-time health services near a location (OpenStreetMap + Google Places)
 *     description: Returns live clinics, pharmacies, and youth centers near the given coordinates. Use the browser Geolocation API to get the user's lat/lng.
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           example: 9.03
 *         description: Latitude
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *           example: 38.75
 *         description: Longitude
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5000
 *         description: Search radius in meters
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [clinic, pharmacy, hospital, youth_center, counseling]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of items per page (max 100)
 *     responses:
 *       200:
 *         description: Real-time list of nearby health services
 *       400:
 *         description: Missing or invalid lat/lng
 */
servicesRoutes.get("/nearby", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { lat, lng, radius, type, page, limit } = nearbyQuerySchema.parse(req.query);
    const services = await findNearbyServices(lat, lng, radius, type);
    
    const skip = (page - 1) * limit;
    const paginatedServices = services.slice(skip, skip + limit);

    res.json({ 
      data: paginatedServices,
      meta: {
        page,
        limit,
        total: services.length,
        pages: Math.ceil(services.length / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/v1/services/geocode:
 *   get:
 *     summary: Convert a city or address to coordinates (lat/lng)
 *     description: >
 *       Secure server-side proxy for Google Maps Geocoding API.
 *       Use this during professional registration to convert a typed city name
 *       into coordinates — the API key never leaves the server.
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: address
 *         required: true
 *         schema:
 *           type: string
 *         description: City name or address to geocode
 *         example: "Addis Ababa"
 *     responses:
 *       200:
 *         description: Coordinates for the given address
 *       400:
 *         description: Address parameter is required, or location not found
 *       503:
 *         description: Google Maps API key not configured
 */
servicesRoutes.get("/geocode", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = req.query.address as string;
    if (!address) {
      return res.status(400).json({ error: "address query parameter is required" });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: "Geocoding service not configured" });
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const geoRes = await fetch(url);
    const geoData = await geoRes.json() as any;

    if (geoData.status !== "OK" || !geoData.results?.[0]) {
      return res.status(400).json({ error: `Location not found: ${geoData.status}` });
    }

    const { lat, lng } = geoData.results[0].geometry.location;
    const formattedAddress = geoData.results[0].formatted_address;

    res.json({
      data: {
        lat,
        lng,
        formatted_address: formattedAddress,
      }
    });
  } catch (error) {
    next(error);
  }
});
