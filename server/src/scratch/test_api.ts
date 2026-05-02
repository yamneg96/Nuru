import request from "supertest";
import app from "../index.js";

async function test() {
  console.log("Testing GET /api/v1/appointments...");
  const res = await request(app).get("/api/v1/appointments");
  console.log("Status:", res.status);
  console.log("Body:", JSON.stringify(res.body, null, 2));
}

test().catch(console.error);
