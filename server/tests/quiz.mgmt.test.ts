import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../src/index";
import { User } from "../src/models/User";
import { Module } from "../src/models/Module";
import { Quiz } from "../src/models/Quiz";
import bcrypt from "bcrypt";

async function getAdminToken(): Promise<string> {
  const pass = await bcrypt.hash("Admin123!", 12);
  await User.create({
    email: "quiz-admin@nuru.app",
    password_hash: pass,
    role: "admin",
    preferences: { language: "english", save_history: true }
  });
  const res = await request(app)
    .post("/api/v1/auth/admin/login")
    .send({ email: "quiz-admin@nuru.app", password: "Admin123!" });
  return res.body.data.token;
}

describe("Quiz Management System", () => {
  let adminToken: string;
  let moduleId: string;
  let quizId: string;

  beforeAll(async () => {
    const { connectDB } = await import("../src/config/db.js");
    await connectDB();

    await User.deleteMany({ email: "quiz-admin@nuru.app" });
    await Module.deleteMany({ title: "Quiz Test Module" });
    
    adminToken = await getAdminToken();
    const mod = await Module.create({
      title: "Quiz Test Module",
      slug: "quiz-test-module",
      description: "Test",
      icon: "test",
      color: "primary"
    });
    moduleId = mod._id as string;
  });

  afterAll(async () => {
    await User.deleteMany({ email: "quiz-admin@nuru.app" });
    await Module.deleteOne({ _id: moduleId });
    await Quiz.deleteMany({ module_id: moduleId });
  });

  it("should create a new curated quiz (admin)", async () => {
    const res = await request(app)
      .post("/api/v1/quiz")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        module_id: moduleId,
        title: "Consent Basics Quiz",
        questions: [
          {
            text: "What does FRIES stand for?",
            options: ["Food, Rice, Ice, Egg, Salt", "Freely given, Reversible, Informed, Enthusiastic, Specific"],
            correct_index: 1,
            explanation: "Consent must follow the FRIES model."
          }
        ],
        published: true
      });

    expect(res.status).toBe(201);
    expect(res.body.data.title).toBe("Consent Basics Quiz");
    quizId = res.body.data._id;
  });

  it("should retrieve the quiz for a module publicly", async () => {
    const res = await request(app).get(`/api/v1/quiz/module/${moduleId}`);
    expect(res.status).toBe(200);
    expect(res.body.data.questions).toHaveLength(1);
  });

  it("should submit answers and return score", async () => {
    const loginRes = await request(app)
      .post("/api/v1/auth/google")
      .send({ credential: "mock-token" }); // Mocking google auth would be better, but we have a bypass in test?
    
    // For now use admin token as user token for simplicity in test
    const res = await request(app)
      .post(`/api/v1/quiz/${quizId}/submit`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ answers: [1] });

    expect(res.status).toBe(200);
    expect(res.body.data.score).toBe(1);
    expect(res.body.data.percentage).toBe(100);
    expect(res.body.data.results[0].isCorrect).toBe(true);
  });
});
