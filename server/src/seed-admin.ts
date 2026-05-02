import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { env } from "./config/env.js";
import { User } from "./models/User.js";


async function seedAdmin() {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("Connected to MongoDB for admin seeding...");

    if (!env.ADMIN_EMAIL || !env.ADMIN_PASSWORD) {
      console.error("❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env");
      process.exit(1);
    }

    const email = env.ADMIN_EMAIL.toLowerCase().trim();

    // Delete existing admin to ensure fresh seed
    await User.deleteMany({ email, role: { $in: ["admin", "super_admin"] } });

    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 12);

    await User.create({
      email: email,
      name: "Super Admin",
      password_hash: passwordHash,
      role: "super_admin",
      preferences: { language: "english", save_history: true },
    });

    console.log(`✅ Super Admin created successfully: ${env.ADMIN_EMAIL}`);
    console.log(`   Initial password: ${env.ADMIN_PASSWORD}`);
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Admin seeding failed:", error);
    process.exit(1);
  }
}

seedAdmin();
