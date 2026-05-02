import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/index";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "../src/models/User";

async function getSuperAdminToken(): Promise<string> {
  const passwordHash = await bcrypt.hash("SuperSecret123!", 12);
  const user = await User.create({
    email: "test-super@nuru.app",
    name: "Test Super",
    password_hash: passwordHash,
    role: "super_admin",
    preferences: { language: "english", save_history: true },
  });
  const res = await request(app)
    .post("/api/v1/auth/admin/login")
    .send({ email: "test-super@nuru.app", password: "SuperSecret123!" });
  return res.body.data.token;
}

describe("Admin User Management (Super Admin)", () => {
  let superToken: string;
  let adminId: string;

  beforeAll(async () => {
    // Ensure DB connected
    const { connectDB } = await import("../src/config/db.js");
    await connectDB();

    await User.deleteMany({ role: { $in: ["admin", "super_admin"] } });
    superToken = await getSuperAdminToken();
  });

  afterAll(async () => {
    await User.deleteMany({ role: { $in: ["admin", "super_admin"] } });
  });

  it("should list all admins (super admin only)", async () => {
    const res = await request(app)
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${superToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data.some((a: any) => a.role === "super_admin")).toBe(true);
  });

  it("should create a new ordinary admin", async () => {
    const res = await request(app)
      .post("/api/v1/admin/users")
      .set("Authorization", `Bearer ${superToken}`)
      .send({
        email: "new-admin@nuru.app",
        name: "New Admin",
        password: "AdminPassword123",
        role: "admin"
      });

    expect(res.status).toBe(201);
    expect(res.body.data.email).toBe("new-admin@nuru.app");
    expect(res.body.data.role).toBe("admin");
    adminId = res.body.data.id;
  });

  it("should escalate an admin to super admin", async () => {
    const res = await request(app)
      .put(`/api/v1/admin/users/${adminId}`)
      .set("Authorization", `Bearer ${superToken}`)
      .send({ role: "super_admin" });

    expect(res.status).toBe(200);
    expect(res.body.data.role).toBe("super_admin");
  });

  it("should allow an admin to update their own profile", async () => {
    // Get token for the new admin (now super admin)
    const loginRes = await request(app)
      .post("/api/v1/auth/admin/login")
      .send({ email: "new-admin@nuru.app", password: "AdminPassword123" });
    const adminToken = loginRes.body.data.token;

    const res = await request(app)
      .put("/api/v1/admin/profile")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "Updated Admin Name" });

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Updated Admin Name");
  });

  it("should delete an admin account", async () => {
    const res = await request(app)
      .delete(`/api/v1/admin/users/${adminId}`)
      .set("Authorization", `Bearer ${superToken}`);

    expect(res.status).toBe(200);
    
    const check = await User.findById(adminId);
    expect(check).toBeNull();
  });

  it("should deny ordinary admin from creating users", async () => {
    // Create a temporary ordinary admin
    const pass = await bcrypt.hash("12345678", 12);
    const ordAdmin = await User.create({
      email: "ord@nuru.app",
      name: "Ordinary",
      password_hash: pass,
      role: "admin",
      preferences: { language: "english", save_history: true }
    });

    const loginRes = await request(app)
      .post("/api/v1/auth/admin/login")
      .send({ email: "ord@nuru.app", password: "12345678" });
    const ordToken = loginRes.body.data.token;

    const res = await request(app)
      .post("/api/v1/admin/users")
      .set("Authorization", `Bearer ${ordToken}`)
      .send({ email: "hack@nuru.app", name: "Hack", password: "password" });

    expect(res.status).toBe(403); // Forbidden for ordinary admins
  });
});
