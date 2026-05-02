import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import app from "../src/index";
import { User } from "../src/models/User";
import { Module } from "../src/models/Module";
import { Article } from "../src/models/Article";
import { Video } from "../src/models/Video";

// ── Helpers ─────────────────────────────────────────────────────────────────
async function getAdminToken(): Promise<string> {
  await User.deleteMany({ email: "cms-test-admin@nuru.app" });
  const passwordHash = await bcrypt.hash("Admin123!", 12);
  await User.create({
    email: "cms-test-admin@nuru.app",
    password_hash: passwordHash,
    role: "admin",
    preferences: { language: "english", save_history: true },
  });
  const res = await request(app)
    .post("/api/v1/auth/admin/login")
    .send({ email: "cms-test-admin@nuru.app", password: "Admin123!" });
  return res.body.data.token;
}

// ── Test Suite ───────────────────────────────────────────────────────────────
describe("CMS Content Routes", () => {
  let adminToken: string;
  let moduleId: string;
  let articleId: string;
  let videoId: string;

  beforeAll(async () => {
    // Ensure DB is connected
    const { connectDB } = await import("../src/config/db.js");
    await connectDB();

    // Clean slate
    await Promise.all([
      Module.deleteMany({}),
      Article.deleteMany({}),
      Video.deleteMany({}),
    ]);
    adminToken = await getAdminToken();
  });

  afterAll(async () => {
    await Promise.all([
      Module.deleteMany({}),
      Article.deleteMany({}),
      Video.deleteMany({}),
      User.deleteMany({ role: "admin" }),
    ]);
  });

  // ── MODULE CRUD ─────────────────────────────────────────────────────────
  describe("Modules", () => {
    it("should create a module (admin)", async () => {
      const res = await request(app)
        .post("/api/v1/content/modules")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Healthy Relationships",
          description: "Learn about healthy relationships",
          icon: "favorite",
          color: "primary",
          order: 1,
          featured: true,
          published: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe("Healthy Relationships");
      expect(res.body.data.slug).toBe("healthy-relationships");
      moduleId = res.body.data._id;
    });

    it("should reject module creation without auth", async () => {
      const res = await request(app).post("/api/v1/content/modules").send({
        title: "Test",
        description: "Test",
        icon: "test",
      });
      expect(res.status).toBe(401);
    });

    it("should list published modules publicly", async () => {
      const res = await request(app).get("/api/v1/content/modules");
      expect(res.status).toBe(200);
      const mod = res.body.data.find((m: any) => m._id.toString() === moduleId.toString());
      expect(mod).toBeDefined();
      expect(mod.article_count).toBe(0);
    });

    it("should get module detail by slug", async () => {
      const res = await request(app).get("/api/v1/content/modules/healthy-relationships");
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Healthy Relationships");
    });

    it("should return 404 for unknown slug", async () => {
      const res = await request(app).get("/api/v1/content/modules/unknown-slug");
      expect(res.status).toBe(404);
    });

    it("should update a module (admin)", async () => {
      const res = await request(app)
        .put(`/api/v1/content/modules/${moduleId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ description: "Updated description" });

      expect(res.status).toBe(200);
      expect(res.body.data.description).toBe("Updated description");
    });
  });

  // ── ARTICLE CRUD ─────────────────────────────────────────────────────────
  describe("Articles", () => {
    it("should create an article (admin)", async () => {
      const res = await request(app)
        .post("/api/v1/content/articles")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          module_id: moduleId,
          title: "What Is Consent",
          content_markdown: "## Consent\nConsent means freely agreeing...",
          summary: "A short intro to consent.",
          badge: "3 min read",
          published: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.slug).toBe("what-is-consent");
      articleId = res.body.data._id;
    });

    it("should get article by slug", async () => {
      const res = await request(app).get("/api/v1/content/articles/what-is-consent");
      expect(res.status).toBe(200);
      expect(res.body.data.content_markdown).toContain("Consent");
    });

    it("should update an article (admin)", async () => {
      const res = await request(app)
        .put(`/api/v1/content/articles/${articleId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ badge: "5 min read" });

      expect(res.status).toBe(200);
      expect(res.body.data.badge).toBe("5 min read");
    });

    it("module detail should now include the article", async () => {
      const res = await request(app).get("/api/v1/content/modules/healthy-relationships");
      expect(res.status).toBe(200);
      expect(res.body.data.articles).toHaveLength(1);
    });
  });

  // ── VIDEO CRUD ────────────────────────────────────────────────────────────
  describe("Videos", () => {
    it("should create a video (admin)", async () => {
      const res = await request(app)
        .post("/api/v1/content/videos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          module_id: moduleId,
          title: "Intro to SRH",
          description: "A short intro video",
          source_type: "youtube",
          source_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
          duration: "3:30",
          published: true,
        });

      expect(res.status).toBe(201);
      expect(res.body.data.source_type).toBe("youtube");
      videoId = res.body.data._id;
    });

    it("should get video by ID", async () => {
      const res = await request(app).get(`/api/v1/content/videos/${videoId}`);
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe("Intro to SRH");
    });

    it("should update a video (admin)", async () => {
      const res = await request(app)
        .put(`/api/v1/content/videos/${videoId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ duration: "4:00" });

      expect(res.status).toBe(200);
      expect(res.body.data.duration).toBe("4:00");
    });

    it("module detail should include video count", async () => {
      const res = await request(app).get("/api/v1/content/modules");
      expect(res.status).toBe(200);
      const mod = res.body.data.find((m: any) => m._id.toString() === moduleId.toString());
      expect(mod.video_count).toBe(1);
    });
  });

  // ── CASCADE DELETE ────────────────────────────────────────────────────────
  describe("Cascade Delete", () => {
    it("should delete article (admin)", async () => {
      const res = await request(app)
        .delete(`/api/v1/content/articles/${articleId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it("should delete video (admin)", async () => {
      const res = await request(app)
        .delete(`/api/v1/content/videos/${videoId}`)
        .set("Authorization", `Bearer ${adminToken}`);
      expect(res.status).toBe(200);
    });

    it("should delete module and cascade (admin)", async () => {
      // Re-create content first
      await Article.create({
        module_id: moduleId,
        title: "To Be Deleted",
        slug: "to-be-deleted",
        content_markdown: "...",
        summary: "...",
        published: true,
      });
      await Video.create({
        module_id: moduleId,
        title: "To Be Deleted",
        source_url: "https://youtube.com/embed/x",
        published: true,
      });

      const res = await request(app)
        .delete(`/api/v1/content/modules/${moduleId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);

      // Check cascade
      const articles = await Article.find({ module_id: moduleId });
      const videos = await Video.find({ module_id: moduleId });
      expect(articles).toHaveLength(0);
      expect(videos).toHaveLength(0);
    });
  });
});
