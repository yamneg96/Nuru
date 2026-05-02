import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/index";
import mongoose from "mongoose";
import { User } from "../src/models/User";

describe("Decision Flow Validation", () => {
  let accessToken: string;

  beforeAll(async () => {
    const { connectDB } = await import("../src/config/db.js");
    await connectDB();
    await User.deleteMany({});
    
    // Create a user and get token
    const res = await request(app).post("/api/v1/auth/anonymous").send({
      preferences: { language: "english" }
    });
    accessToken = res.body.data.token;
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  it("should fail to start a session with an invalid flow_type", async () => {
    const res = await request(app)
      .post("/api/v1/decision/start")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ flow_type: "malicious_flow" });

    expect(res.status).toBe(400);
    expect(res.body.error.message).toContain("flow_type");
  });

  it("should succeed with a valid flow_type (sti_risk)", async () => {
    const res = await request(app)
      .post("/api/v1/decision/start")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ flow_type: "sti_risk" });

    expect(res.status).toBe(200);
    expect(res.body.data.flow_type).toBe("sti_risk");
  });
});
