import { Service } from "../models/Service.js";
import { ServiceCache } from "../models/ServiceCache.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

export async function findNearbyServices(lat: number, lng: number, radius: number = 5000, type?: string) {
  try {
    // 1. Search Local Database (Verified Services)
    const filter: any = {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radius,
        },
      },
    };

    if (type) {
      filter.type = type;
    }

    const localServices = await Service.find(filter).limit(20);

    // 2. Search Google Places API (Unverified Services) with Caching
    let googleServices: any[] = [];
    if (env.GOOGLE_MAPS_API_KEY && env.GOOGLE_MAPS_API_KEY !== "your-google-maps-api-key") {
      const locationKey = `${lat.toFixed(2)}_${lng.toFixed(2)}`;
      const cacheKey = type || "all";

      // Check Cache
      const cached = await ServiceCache.findOne({ location_key: locationKey, type: cacheKey });
      
      if (cached) {
        logger.info({ locationKey, type: cacheKey }, "Serving nearby services from cache");
        googleServices = cached.results;
      } else {
        googleServices = await searchGooglePlaces(lat, lng, radius, type);
        
        // Save to Cache (24 hours)
        if (googleServices.length > 0) {
          await ServiceCache.create({
            location_key: locationKey,
            type: cacheKey,
            results: googleServices,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          });
        }
      }
    } else {
      logger.info("Skipping Google Places API call: No valid API key provided.");
    }

    // 3. Merge Results
    const results = [
      ...localServices.map(s => ({ ...s.toObject(), source: "nuru", verified: true })),
      ...googleServices.map(s => ({ ...s, source: "google_maps", verified: false }))
    ];

    return results;
  } catch (error) {
    logger.error(error, "Error finding nearby services");
    throw error;
  }
}

async function searchGooglePlaces(lat: number, lng: number, radius: number, type?: string) {
  const apiKey = env.GOOGLE_MAPS_API_KEY;
  // Map our type to Google keyword
  const keywordMap: Record<string, string> = {
    clinic: "health clinic",
    pharmacy: "pharmacy",
    hospital: "hospital",
    youth_center: "youth center",
    counseling: "counseling center"
  };
  
  const keyword = type ? keywordMap[type] || type : "youth friendly clinic";
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = (await response.json()) as any;

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      logger.warn({ status: data.status, error: data.error_message }, "Google Places API warning");
      return [];
    }

    return (data.results || []).map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      location: {
        type: "Point",
        coordinates: [place.geometry.location.lng, place.geometry.location.lat],
      },
      type: type || mapGoogleTypeToNuruType(place.types),
      rating: place.rating,
      user_ratings_total: place.user_ratings_total,
      place_id: place.place_id,
      open_now: place.opening_hours?.open_now,
    }));
  } catch (error) {
    logger.error(error, "Google Places API request failed");
    return [];
  }
}

function mapGoogleTypeToNuruType(types: string[]): string {
  if (types.includes("pharmacy")) return "pharmacy";
  if (types.includes("hospital")) return "hospital";
  if (types.includes("doctor") || types.includes("health")) return "clinic";
  return "clinic"; // default
}
