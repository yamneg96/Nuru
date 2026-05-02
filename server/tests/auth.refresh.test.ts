import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/index";
import mongoose from "mongoose";
import { User } from "../src/models/User";
import { RefreshToken } from "../src/models/RefreshToken";

describe("JWT Refresh Token Architecture", () => {
  let anonymousId: string;
  let accessToken: string;
  let agent: any;

  beforeAll(async () => {
    const { connectDB } = await import("../src/config/db.js");
    await connectDB();
    await User.deleteMany({});
    await RefreshToken.deleteMany({});
    agent = request.agent(app);
  });

  afterAll(async () => {
    await User.deleteMany({});
    await RefreshToken.deleteMany({});
  });

  it("should generate access token and refresh token cookie on anonymous login", async () => {
    const res = await agent.post("/api/v1/auth/anonymous").send({
      preferences: { language: "english", save_history: true }
    });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    accessToken = res.body.data.token;
    anonymousId = res.body.data.user.id;

    // Check DB
    const storedTokens = await RefreshToken.find({ anonymous_id: anonymousId });
    expect(storedTokens.length).toBe(1);
  });

  it("should refresh access token using the refresh token cookie", async () => {
    const res = await agent.post("/api/v1/auth/refresh");

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeDefined();
    expect(res.body.data.token).not.toBe(accessToken);
  });

  it("should logout successfully and invalidate tokens", async () => {
    const res = await agent.post("/api/v1/auth/logout");

    expect(res.status).toBe(200);
    expect(res.body.data.success).toBe(true);

    // Check DB invalidated
    const storedTokens = await RefreshToken.find({ anonymous_id: anonymousId });
    expect(storedTokens.length).toBe(0);
  });

  it("should fail to refresh after logout", async () => {
    const res = await agent.post("/api/v1/auth/refresh");
    expect(res.status).toBe(401);
  });
});
