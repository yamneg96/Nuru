import mongoose from "mongoose";
import { env } from "./env.js";
import { logger } from "../utils/logger.js";

export async function connectDB(): Promise<void> {
  try {
    let uri = env.MONGODB_URI;
    
    // Isolate test database to prevent data loss in development/production
    if (env.NODE_ENV === "test") {
      const base = uri.split("?")[0];
      const options = uri.split("?")[1] ? "?" + uri.split("?")[1] : "";
      const parts = base.split("/");
      // Replace the database name part (last segment of the path)
      parts[parts.length - 1] = "nuru_test";
      uri = parts.join("/") + options;
    }

    await mongoose.connect(uri);
    logger.info(`✅ MongoDB connected successfully to ${env.NODE_ENV === "test" ? "test" : "main"} database`);
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
