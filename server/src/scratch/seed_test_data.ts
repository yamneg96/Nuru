import mongoose from "mongoose";
import { Professional } from "../models/Professional.js";
import { Appointment } from "../models/Appointment.js";
import { User } from "../models/User.js";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Connected to MongoDB for test seeding...");

    // 1. Get or Create a User (for appointments)
    let user = await User.findOne({ role: "super_admin" });
    if (!user) {
       user = await User.create({
         email: "test_user@nuru.app",
         name: "Test User",
         role: "user",
         anonymous_id: uuidv4(),
         preferences: { language: "english", save_history: true }
       });
    }

    // 2. Create Professionals
    console.log("Seeding Professionals...");
    await Professional.deleteMany({ full_name: { $regex: /Test/ } });
    
    const prof1 = await Professional.create({
      user_id: new mongoose.Types.ObjectId(),
      full_name: "Test Dr. Sarah Medical",
      email: "sarah@test.com",
      phone: "0911000001",
      bio: "Expert in reproductive health and adolescent care.",
      type: "medical",
      specializations: ["reproductive health", "adolescent care"],
      institution: "Tikur Anbessa Hospital",
      years_of_experience: 8,
      availability: { online: true, offline: false },
      city: "Addis Ababa",
      region: "Addis Ababa",
      coordinates: { type: "Point", coordinates: [38.75, 9.03] },
      verification_status: "verified",
      rating: 4.8,
      rating_count: 12,
      sessions_completed: 45
    });

    const prof2 = await Professional.create({
      user_id: new mongoose.Types.ObjectId(),
      full_name: "Test Counselor Mike",
      email: "mike@test.com",
      phone: "0911000002",
      bio: "Focusing on youth mental health and anxiety.",
      type: "counselor",
      specializations: ["mental health", "anxiety"],
      institution: "MindCare Clinic",
      years_of_experience: 5,
      availability: { online: true, offline: true },
      city: "Adama",
      region: "Oromia",
      coordinates: { type: "Point", coordinates: [39.27, 8.54] },
      verification_status: "verified",
      rating: 4.5,
      rating_count: 8,
      sessions_completed: 20
    });

    const prof3 = await Professional.create({
      user_id: new mongoose.Types.ObjectId(),
      full_name: "Test Pending Alice",
      email: "alice@test.com",
      phone: "0911000003",
      bio: "Applying to join the network.",
      type: "therapist",
      specializations: ["trauma"],
      institution: "Unity Clinic",
      years_of_experience: 3,
      availability: { online: false, offline: true },
      city: "Hawassa",
      region: "Sidama",
      coordinates: { type: "Point", coordinates: [38.47, 7.06] },
      verification_status: "pending"
    });

    // 3. Create Appointments
    console.log("Seeding Appointments...");
    await Appointment.deleteMany({ notes: { $regex: /Seeded/ } });

    await Appointment.create([
      {
        user_id: user._id,
        professional_id: prof1._id,
        status: "confirmed",
        appointment_date: new Date(Date.now() + 86400000), // Tomorrow
        type: "online",
        notes: "Seeded: Discussing birth control options.",
      },
      {
        user_id: user._id,
        professional_id: prof2._id,
        status: "pending",
        appointment_date: new Date(Date.now() + 172800000), // Day after tomorrow
        type: "offline",
        notes: "Seeded: Counseling session.",
      }
    ]);

    console.log("✅ Test data seeded successfully!");
    console.log(`- Seeded 3 Professionals (2 verified, 1 pending)`);
    console.log(`- Seeded 2 Appointments for user: ${user.email || user.anonymous_id}`);

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
