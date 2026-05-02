import mongoose from "mongoose";
import { env } from "./config/env.js";

async function fixIndexes() {
  await mongoose.connect(env.MONGODB_URI);
  console.log("Connected to MongoDB...");
  
  try {
    const collection = mongoose.connection.collection("users");
    console.log("Dropping all indexes on users collection...");
    await collection.dropIndexes();
    console.log("✅ Indexes dropped. They will be recreated on next app start.");
  } catch (error) {
    console.error("Error dropping indexes:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

fixIndexes();
