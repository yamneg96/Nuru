import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/index.js";
import { User } from "../src/models/User.js";
import { Professional } from "../src/models/Professional.js";
import { Appointment } from "../src/models/Appointment.js";
import { v4 as uuidv4 } from "uuid";

describe.sequential("Appointment Booking API", () => {
  let userToken: string;
  let profToken: string;
  let userCookie: string;
  let profCookie: string;
  let profId: string;
  let appointmentId: string;

  beforeAll(async () => {
    // 1. Clear state
    await User.deleteMany({});
    await Professional.deleteMany({});
    await Appointment.deleteMany({});

    // 2. Setup Professional
    const profUser = await User.create({
      anonymous_id: uuidv4(),
      role: "user",
      preferences: { language: "english", save_history: true }
    });
    
    const { generateTokens } = await import("../src/services/auth.service.js");
    const profTokens = await generateTokens(profUser);
    profToken = profTokens.accessToken;
    profCookie = `refreshToken=${profTokens.refreshToken}`;

    const prof = await Professional.create({
      user_id: profUser._id,
      full_name: "Dr. Tester",
      email: "prof@tester.com",
      phone: "0912345678",
      bio: "Test professional",
      type: "medical",
      specializations: ["general"],
      institution: "Test Clinic",
      years_of_experience: 5,
      city: "Addis Ababa",
      region: "Addis Ababa",
      availability: { online: true, offline: true },
      coordinates: { type: "Point", coordinates: [38.75, 9.03] },
      verification_status: "verified"
    });
    profId = prof._id.toString();

    // 3. Setup Regular User
    const regularUser = await User.create({
      anonymous_id: uuidv4(),
      role: "user",
      preferences: { language: "english", save_history: true }
    });
    const userTokens = await generateTokens(regularUser);
    userToken = userTokens.accessToken;
    userCookie = `refreshToken=${userTokens.refreshToken}`;
  });

  it("should allow a user to book an appointment", async () => {
    const res = await request(app)
      .post("/api/v1/appointments")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Cookie", userCookie)
      .send({
        professional_id: profId,
        appointment_date: new Date(Date.now() + 86400000).toISOString(),
        type: "online",
        notes: "I need a general checkup."
      });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("pending");
    appointmentId = res.body.data._id;
  });

  it("should not show contact info for pending appointments", async () => {
    const res = await request(app)
      .get("/api/v1/appointments")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Cookie", userCookie);

    expect(res.status).toBe(200);
    const apt = res.body.data[0];
    expect(apt.professional_id.email).toBeUndefined();
    expect(apt.professional_id.phone).toBeUndefined();
  });

  it("should allow professional to view incoming requests", async () => {
    const res = await request(app)
      .get("/api/v1/appointments/professional")
      .set("Authorization", `Bearer ${profToken}`)
      .set("Cookie", profCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id).toBe(appointmentId);
  });

  it("should allow professional to confirm appointment", async () => {
    const res = await request(app)
      .put(`/api/v1/appointments/${appointmentId}/confirm`)
      .set("Authorization", `Bearer ${profToken}`)
      .set("Cookie", profCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("confirmed");
  });

  it("should show contact info for confirmed appointments", async () => {
    const res = await request(app)
      .get("/api/v1/appointments")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Cookie", userCookie);

    expect(res.status).toBe(200);
    const apt = res.body.data[0];
    expect(apt.professional_id.email).toBe("prof@tester.com");
    expect(apt.professional_id.phone).toBe("0912345678");
  });

  it("should allow professional to complete appointment", async () => {
    const res = await request(app)
      .put(`/api/v1/appointments/${appointmentId}/complete`)
      .set("Authorization", `Bearer ${profToken}`)
      .set("Cookie", profCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe("completed");
  });

  it("should allow user to rate completed appointment", async () => {
    const res = await request(app)
      .post(`/api/v1/appointments/${appointmentId}/rate`)
      .set("Authorization", `Bearer ${userToken}`)
      .set("Cookie", userCookie)
      .send({
        rating: 5,
        review: "Excellent consultation!"
      });

    expect(res.status).toBe(200);
    expect(res.body.data.user_rating).toBe(5);

    // Check if professional rating was updated
    const prof = await Professional.findById(profId);
    expect(prof?.rating).toBe(5);
    expect(prof?.rating_count).toBe(1);
    expect(prof?.sessions_completed).toBe(1);
  });
});
