import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/index";
import mongoose from "mongoose";
import { User } from "../src/models/User";
import { hashEmail } from "../src/services/auth.service";
import bcrypt from "bcrypt";

describe("Admin Authentication", () => {
  const testAdmin = {
    email: "admin@nuru.app",
    password: "Password123!",
  };

  beforeAll(async () => {
    // Clean up
    await User.deleteMany({ role: "admin" });
    
    // Create a test admin
    const passwordHash = await bcrypt.hash(testAdmin.password, 12);
    
    await User.create({
      email: testAdmin.email,
      password_hash: passwordHash,
      role: "admin",
      preferences: { language: "english", save_history: true }
    });
  });

  afterAll(async () => {
    await User.deleteMany({ role: "admin" });
  });

  it("should fail login with wrong credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/admin/login")
      .send({ email: testAdmin.email, password: "wrongpassword" });
    
    expect(res.status).toBe(401);
    expect(res.body.error).toBeDefined();
  });

  it("should succeed login with correct credentials", async () => {
    const res = await request(app)
      .post("/api/v1/auth/admin/login")
      .send({ email: testAdmin.email, password: testAdmin.password });
    
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.user.role).toBe("admin");
  });

  describe("isAdmin Middleware", () => {
    let adminToken: string;

    beforeAll(async () => {
      const res = await request(app)
        .post("/api/v1/auth/admin/login")
        .send({ email: testAdmin.email, password: testAdmin.password });
      adminToken = res.body.data.token;
    });

    it("should deny access with no token", async () => {
      const res = await request(app).get("/api/v1/auth/admin/verify");
      expect(res.status).toBe(401);
    });

    it("should deny access for non-admin users", async () => {
      // Mock a non-admin token
      const res = await request(app).get("/api/v1/auth/admin/verify")
        .set("Authorization", "Bearer invalid-token");
      expect(res.status).toBe(401);
    });

    it("should allow access for admin users", async () => {
      const res = await request(app).get("/api/v1/auth/admin/verify")
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
      expect(res.body.data.verified).toBe(true);
    });
  });
});
