import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { authRoutes } from "./routes/auth.routes.js";
import { chatRoutes } from "./routes/chat.routes.js";
import { decisionRoutes } from "./routes/decision.routes.js";
import { servicesRoutes } from "./routes/services.routes.js";
import { metricsRoutes } from "./routes/metrics.routes.js";
import { userRoutes } from "./routes/user.routes.js";

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// ── Routes ───────────────────────────────────────────────────
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/decision", decisionRoutes);
app.use("/services", servicesRoutes);
app.use("/metrics", metricsRoutes);
app.use("/user", userRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── Start Server ─────────────────────────────────────────────
async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    console.log(`🚀 Nuru API running on port ${env.PORT}`);
    console.log(`   Environment: ${env.NODE_ENV}`);
    console.log(`   AI Provider: ${env.AI_PROVIDER}`);
  });
}

start().catch(console.error);

export default app;
