import mongoose from "mongoose";
import { env } from "./config/env.js";
import { Service } from "./models/Service.js";

const SEED_SERVICES = [
  {
    name: "Addis Hope Clinic",
    type: "clinic" as const,
    address: "Bole Sub-city, Woreda 03",
    area: "Bole Sub-city",
    distance: "1.2 km",
    services: ["Contraception", "STI Testing", "Counseling"],
    tags: ["verified", "free_options"],
    verified: true,
    phone: "+251-11-123-4567",
    coordinates: { lat: 9.0054, lng: 38.7636 },
  },
  {
    name: "Sunrise Health Center",
    type: "clinic" as const,
    address: "Kirkos Sub-city, Woreda 08",
    area: "Kirkos",
    distance: "2.5 km",
    services: ["General Checkup", "Pharmacy", "Youth Counseling"],
    tags: ["youth_friendly"],
    verified: true,
    phone: "+251-11-234-5678",
    coordinates: { lat: 9.0107, lng: 38.7469 },
  },
  {
    name: "Unity Pharmacy",
    type: "pharmacy" as const,
    address: "Arada Sub-city, Woreda 05",
    area: "Arada",
    distance: "3.1 km",
    services: ["Contraception", "Emergency Contraception", "Vitamins"],
    tags: ["pharmacy", "affordable"],
    verified: true,
    phone: "+251-11-345-6789",
    coordinates: { lat: 9.0328, lng: 38.7489 },
  },
  {
    name: "Marie Stopes Ethiopia",
    type: "clinic" as const,
    address: "Yeka Sub-city, Woreda 12",
    area: "Yeka",
    distance: "4.8 km",
    services: ["Family Planning", "Safe Abortion", "Counseling", "STI Testing"],
    tags: ["verified", "free_options", "youth_friendly"],
    verified: true,
    phone: "+251-11-456-7890",
    coordinates: { lat: 9.0359, lng: 38.7896 },
  },
  {
    name: "Bethel Counseling Center",
    type: "counseling" as const,
    address: "Lideta Sub-city, Woreda 01",
    area: "Lideta",
    distance: "5.2 km",
    services: ["Mental Health", "Youth Counseling", "Crisis Support"],
    tags: ["youth_friendly", "free_options"],
    verified: true,
    phone: "+251-11-567-8901",
    coordinates: { lat: 9.0186, lng: 38.7332 },
  },
];

async function seed() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing services
    await Service.deleteMany({});
    console.log("Cleared existing services.");

    // Insert seed data
    await Service.insertMany(SEED_SERVICES);
    console.log(`✅ Seeded ${SEED_SERVICES.length} services.`);

    await mongoose.disconnect();
    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
