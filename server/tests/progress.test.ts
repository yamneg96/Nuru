import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "../src/index";
import { User } from "../src/models/User";
import { Module } from "../src/models/Module";
import { Article } from "../src/models/Article";
import { UserProgress } from "../src/models/UserProgress";
import mongoose from "mongoose";

describe("User Progress Tracking", () => {
  let userToken: string;
  let moduleId: string;
  let articleId: string;

  beforeAll(async () => {
    // Ensure DB is connected
    const { connectDB } = await import("../src/config/db.js");
    await connectDB();

    // Clean up
    await User.deleteMany({ email: "progress-test@nuru.app" });
    await Module.deleteMany({ title: "Progress Test Module" });

    // Create test user
    const userRes = await request(app)
      .post("/api/v1/auth/anonymous")
      .send({ preferences: { language: "english" } });
    if (!userRes.body.data) console.log("Anonymous Auth Failed:", userRes.body);
    userToken = userRes.body.data.token;

    // Create test module and article
    const mod = await Module.create({
      title: "Progress Test Module",
      slug: "progress-test",
      description: "Testing progress tracking",
      icon: "test",
      published: true
    });
    moduleId = (mod._id as any).toString();

    const art = await Article.create({
      module_id: mod._id,
      title: "Progress Test Article",
      slug: "progress-art",
      content_markdown: "Test content",
      summary: "Test summary",
      published: true,
      order: 1
    });
    articleId = (art._id as any).toString();
  });

  it("should mark an article as complete", async () => {
    const res = await request(app)
      .post("/api/v1/progress/complete")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        content_type: "article",
        content_id: articleId,
        module_id: moduleId
      });

    expect(res.status).toBe(200);
    expect(res.body.data.content_type).toBe("article");
    expect(res.body.data.content_id.toString()).toBe(articleId);
  });

  it("should get user progress summary", async () => {
    const res = await request(app)
      .get("/api/v1/progress")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.total_completed).toBeGreaterThanOrEqual(1);
    
    const modSummary = res.body.data.modules.find((m: any) => m.module_id === moduleId);
    expect(modSummary).toBeDefined();
    expect(modSummary.percentage).toBe(100); // 1/1 articles done
    expect(modSummary.completed).toBe(true);
  });

  it("should get specific module progress", async () => {
    const res = await request(app)
      .get(`/api/v1/progress/module/${moduleId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.percentage).toBe(100);
    expect(res.body.data.completions).toHaveLength(1);
  });
});
