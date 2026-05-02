import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/index.js";

describe("Health Check", () => {
  it("should return 200 OK for /health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "ok");
  });

  it("should return nice HTML for root path", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("Nuru API");
  });
});
