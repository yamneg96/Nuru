import mongoose from "mongoose";
import { env } from "./config/env.js";
import { Service } from "./models/Service.js";

const SEED_SERVICES: any[] = [];

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
