import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/index.js";
import { User } from "../src/models/User.js";
import { Event } from "../src/models/Event.js";
import { v4 as uuidv4 } from "uuid";

describe.sequential("Event Management API", () => {
  let adminToken: string;
  let userToken: string;
  let adminCookie: string;
  let userCookie: string;
  let eventId: string;

  beforeAll(async () => {
    // Setup Admin
    const adminEmail = "admin_event@nuru.app";
    const adminPassword = "AdminPassword123!";
    
    await User.deleteMany({ email: adminEmail });
    await Event.deleteMany({});
    
    const bcrypt = await import("bcrypt");
    const hash = await bcrypt.default.hash(adminPassword, 12);
    await User.create({
      email: adminEmail,
      name: "Admin Tester",
      password_hash: hash,
      role: "admin",
      preferences: { language: "english", save_history: true }
    });

    const adminLogin = await request(app)
      .post("/api/v1/auth/admin/login")
      .send({ email: adminEmail, password: adminPassword });
    
    adminToken = adminLogin.body.data.token;
    adminCookie = adminLogin.headers["set-cookie"][0];

    // Setup Regular User
    const user = await User.create({
      anonymous_id: uuidv4(),
      role: "user",
      preferences: { language: "english", save_history: true }
    });
    
    const { generateTokens } = await import("../src/services/auth.service.js");
    const tokens = await generateTokens(user);
    userToken = tokens.accessToken;
    userCookie = `refreshToken=${tokens.refreshToken}`;
  });

  it("should allow admin to create an event", async () => {
    const res = await request(app)
      .post("/api/v1/admin/events")
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Cookie", adminCookie)
      .send({
        title: "Youth Health Workshop",
        description: "A workshop on mental health and reproductive rights.",
        type: "workshop",
        category: "health",
        date: new Date(Date.now() + 86400000).toISOString(),
        location_name: "Community Center",
        is_online: false,
        organizer: "Nuru Health",
        max_attendees: 50
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Youth Health Workshop");
    eventId = res.body.data._id;
  });

  it("should list upcoming events for public", async () => {
    const res = await request(app).get("/api/v1/events");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]._id).toBe(eventId);
    expect(res.body.data[0].registered_users).toBeUndefined(); // Sensitive list hidden
  });

  it("should allow user to register for an event", async () => {
    const res = await request(app)
      .post(`/api/v1/events/${eventId}/register`)
      .set("Authorization", `Bearer ${userToken}`)
      .set("Cookie", userCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.attendee_count).toBe(1);
  });

  it("should not allow user to register twice", async () => {
    const res = await request(app)
      .post(`/api/v1/events/${eventId}/register`)
      .set("Authorization", `Bearer ${userToken}`)
      .set("Cookie", userCookie);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Already registered");
  });

  it("should allow admin to view attendees", async () => {
    const res = await request(app)
      .get(`/api/v1/admin/events/${eventId}/attendees`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Cookie", adminCookie);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
  });

  it("should enforce capacity limits", async () => {
    // Update event to max 1 attendee
    await Event.findByIdAndUpdate(eventId, { $set: { max_attendees: 1 } });

    // Create another user
    const user2 = await User.create({
      anonymous_id: uuidv4(),
      role: "user",
      preferences: { language: "english", save_history: true }
    });
    const { generateTokens } = await import("../src/services/auth.service.js");
    const tokens = await generateTokens(user2);
    
    const res = await request(app)
      .post(`/api/v1/events/${eventId}/register`)
      .set("Authorization", `Bearer ${tokens.accessToken}`)
      .set("Cookie", `refreshToken=${tokens.refreshToken}`);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("capacity");
  });
});
