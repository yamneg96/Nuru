import mongoose from "mongoose";
import { Professional } from "../models/Professional.js";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const prof = await Professional.findOne({ verification_status: "verified" });
  if (prof) {
    console.log("FOUND_PROF_ID:", prof._id.toString());
  } else {
    console.log("NO_VERIFIED_PROF_FOUND");
  }
  await mongoose.connection.close();
}

run();
