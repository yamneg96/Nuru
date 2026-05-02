import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    logger.info("✅ MongoDB connected successfully");
  } catch (error) {
    logger.error(error, "❌ MongoDB connection error");
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    logger.error(err, "MongoDB runtime error");
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected. Attempting reconnect...");
  });
}
