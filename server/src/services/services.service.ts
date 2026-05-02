import { Service } from "../models/Service.js";
import { ServiceCache } from "../models/ServiceCache.js";
import { env } from "../config/env.js";
import { logger } from "../utils/logger.js";

// ── Main Entry ────────────────────────────────────────────────────────────────

export async function findNearbyServices(lat: number, lng: number, radius: number = 5000, type?: string) {
  try {
    // 1. Search Local Database (Admin-verified services)
    const filter: any = {
      location: {
        $near: {
          $geometry: { type: "Point", coordinates: [lng, lat] },
          $maxDistance: radius,
        },
      },
    };
    if (type) filter.type = type;
    const localServices = await Service.find(filter).limit(20);

    // 2. Try Google Places API first (if billing is enabled)
    let externalServices: any[] = [];
    const googleKeyValid = env.GOOGLE_MAPS_API_KEY && env.GOOGLE_MAPS_API_KEY !== "your-google-maps-api-key";

    if (googleKeyValid) {
      externalServices = await searchGooglePlaces(lat, lng, radius, type);
    }

    // 3. Fall back to OpenStreetMap if Google didn't work
    if (externalServices.length === 0) {
      logger.info("Falling back to OpenStreetMap Overpass API for nearby services");
      externalServices = await searchOpenStreetMap(lat, lng, radius, type);
    }

    // 4. Cache and merge
    const results = [
      ...localServices.map(s => ({ ...s.toObject(), source: "nuru", verified: true })),
      ...externalServices,
    ];

    return results;
  } catch (error) {
    logger.error(error, "Error finding nearby services");
    throw error;
  }
}

// ── Google Places API ─────────────────────────────────────────────────────────

async function searchGooglePlaces(lat: number, lng: number, radius: number, type?: string) {
  const apiKey = env.GOOGLE_MAPS_API_KEY;
  const keywordMap: Record<string, string> = {
    clinic: "health clinic",
    pharmacy: "pharmacy",
    hospital: "hospital",
    youth_center: "youth center",
    counseling: "counseling center",
  };

  const keyword = type ? keywordMap[type] || type : "youth friendly clinic";
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = (await response.json()) as any;

    if (data.status === "REQUEST_DENIED" || data.status === "INVALID_REQUEST") {
      logger.warn({ status: data.status, error: data.error_message }, "Google Places API unavailable");
      return [];
    }

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      logger.warn({ status: data.status }, "Google Places API unexpected status");
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
      rating: place.rating ?? null,
      user_ratings_total: place.user_ratings_total ?? 0,
      place_id: place.place_id,
      open_now: place.opening_hours?.open_now ?? null,
      source: "google_maps",
      verified: false,
    }));
  } catch (error) {
    logger.error(error, "Google Places API request failed");
    return [];
  }
}

// ── OpenStreetMap Overpass API (Free, No Key Required) ────────────────────────

async function searchOpenStreetMap(lat: number, lng: number, radius: number, type?: string) {
  // Map our service types to OSM amenity tags
  const amenityMap: Record<string, string[]> = {
    clinic:      ["clinic", "doctors"],
    hospital:    ["hospital"],
    pharmacy:    ["pharmacy"],
    youth_center: ["community_centre", "social_facility"],
    counseling:  ["clinic", "social_facility"],
  };

  const amenities = type && amenityMap[type]
    ? amenityMap[type]
    : ["hospital", "clinic", "pharmacy", "doctors", "health_centre"];

  const amenityFilter = amenities.map(a => `node["amenity"="${a}"](around:${radius},${lat},${lng});`).join("\n");

  const query = `
    [out:json][timeout:25];
    (
      ${amenityFilter}
    );
    out body;
  `;

  const url = "https://overpass-api.de/api/interpreter";
  const mirrorUrls = [
    "https://overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.fr/api/interpreter",
  ];

  try {
    let response: Response | null = null;
    for (const mirrorUrl of mirrorUrls) {
      try {
        response = await fetch(mirrorUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
            "User-Agent": "NuruApp/1.0",
          },
          body: `data=${encodeURIComponent(query)}`,
        });
        if (response.ok) break;
        logger.warn({ url: mirrorUrl, status: response.status }, "Overpass mirror failed, trying next");
      } catch {
        logger.warn({ url: mirrorUrl }, "Overpass mirror unreachable, trying next");
      }
    }

    if (!response?.ok) {
      logger.warn("All Overpass mirrors failed");
      return [];
    }

    const data = (await response.json()) as any;
    const elements = data.elements || [];

    return elements
      .filter((el: any) => el.lat && el.lon && el.tags?.name)
      .map((el: any) => ({
        name: el.tags.name,
        address: el.tags["addr:street"]
          ? `${el.tags["addr:housenumber"] || ""} ${el.tags["addr:street"]}, ${el.tags["addr:city"] || ""}`.trim()
          : el.tags["addr:full"] || "Address not listed",
        location: {
          type: "Point",
          coordinates: [el.lon, el.lat],
        },
        type: mapOsmAmenityToNuruType(el.tags.amenity),
        phone: el.tags.phone || el.tags["contact:phone"] || null,
        website: el.tags.website || el.tags["contact:website"] || null,
        opening_hours: el.tags.opening_hours || null,
        place_id: `osm_${el.id}`,
        rating: null,
        open_now: null,
        source: "openstreetmap",
        verified: false,
      }));
  } catch (error) {
    logger.error(error, "OpenStreetMap Overpass API request failed");
    return [];
  }
}

// ── Type Mappers ──────────────────────────────────────────────────────────────

function mapGoogleTypeToNuruType(types: string[]): string {
  if (types.includes("pharmacy")) return "pharmacy";
  if (types.includes("hospital")) return "hospital";
  if (types.includes("doctor") || types.includes("health")) return "clinic";
  return "clinic";
}

function mapOsmAmenityToNuruType(amenity: string): string {
  const map: Record<string, string> = {
    hospital: "hospital",
    pharmacy: "pharmacy",
    clinic: "clinic",
    doctors: "clinic",
    health_centre: "clinic",
    community_centre: "youth_center",
    social_facility: "counseling",
  };
  return map[amenity] || "clinic";
}
