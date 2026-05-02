import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/index.js";
import { User } from "../src/models/User.js";
import { Professional } from "../src/models/Professional.js";
import { v4 as uuidv4 } from "uuid";

describe.sequential("Professional Network API", () => {
  let adminToken: string;
  let userToken: string;
  let adminCookie: string;
  let userCookie: string;

  beforeAll(async () => {
    const adminEmail = "admin_prof@nuru.app";
    const adminPassword = "AdminPassword123!";
    
    await User.deleteMany({ email: adminEmail });
    await Professional.deleteMany({});
    
    const bcrypt = await import("bcrypt");
    const hash = await bcrypt.default.hash(adminPassword, 12);
    const adminUser = await User.create({
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

  it("should allow a user to register as a professional", async () => {
    const res = await request(app)
      .post("/api/v1/professionals/register")
      .set("Authorization", `Bearer ${userToken}`)
      .set("Cookie", userCookie)
      .send({
        full_name: "Dr. Jane Doe",
        email: "jane@doe.com",
        phone: "0911223344",
        bio: "Specialist in adolescent health with 10 years experience.",
        type: "medical",
        specializations: ["reproductive health"],
        institution: "Black Lion Hospital",
        years_of_experience: 10,
        city: "Addis Ababa",
        region: "Addis Ababa",
        availability: { online: true, offline: true },
        coordinates: { lng: 38.75, lat: 9.03 }
      });

    expect(res.status).toBe(201);
    expect(res.body.data.full_name).toBe("Dr. Jane Doe");
    expect(res.body.data.verification_status).toBe("pending");
  });

  it("should not show pending professionals in public list", async () => {
    const res = await request(app).get("/api/v1/professionals");
    expect(res.status).toBe(200);
    const jane = res.body.data.find((p: any) => p.full_name === "Dr. Jane Doe");
    expect(jane).toBeUndefined();
  });

  it("should allow admin to verify a professional", async () => {
    const prof = await Professional.findOne({ full_name: "Dr. Jane Doe" });
    expect(prof).toBeDefined();
    
    const res = await request(app)
      .put(`/api/v1/admin/professionals/${prof!._id}/verify`)
      .set("Authorization", `Bearer ${adminToken}`)
      .set("Cookie", adminCookie)
      .send({ status: "verified" });

    expect(res.status).toBe(200);
    expect(res.body.data.verification_status).toBe("verified");
  });

  it("should show verified professional in public list", async () => {
    const res = await request(app).get("/api/v1/professionals");
    expect(res.status).toBe(200);
    const jane = res.body.data.find((p: any) => p.full_name === "Dr. Jane Doe");
    expect(jane).toBeDefined();
    expect(jane.email).toBeUndefined();
  });
});
