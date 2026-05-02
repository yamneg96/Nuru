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
import { quizRouter as quizRoutes } from "./routes/quiz.routes.js";
import { contentRoutes } from "./routes/content.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// ── Swagger Documentation ─────────────────────────────────────
setupSwagger(app);

// ── Routes ───────────────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/decision", decisionRoutes);
app.use("/api/v1/services", servicesRoutes);
app.use("/api/v1/metrics", metricsRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/quiz", quizRoutes);
app.use("/api/v1/content", contentRoutes);

// Error Handler (must be after all routes)
app.use(errorHandler);

// route / with nice html :
app.use("/", (_req, res) => {
  res.send(`
    <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; font-family: sans-serif;">
      <h1>Nuru API</h1>
      <p>Welcome to the Nuru API</p>
      <a href="/health">Health Check</a>
    </div>
  `);
});

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
