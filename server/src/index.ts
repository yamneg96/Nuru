import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from "uuid";
import pinoHttp from "pino-http";
import { logger } from "./utils/logger.js";
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
import { adminManagementRoutes } from "./routes/admin-management.routes.js";
import { progressRouter } from "./routes/progress.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { professionalRoutes, adminProfessionalRoutes } from "./routes/professional.routes.js";
import appointmentRoutes, { adminAppointmentRoutes } from "./routes/appointment.routes.js";
import eventRoutes, { adminEventRoutes } from "./routes/event.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// Correlation ID
app.use((req, res, next) => {
  const correlationId = req.headers["x-correlation-id"] || uuidv4();
  req.headers["x-correlation-id"] = correlationId;
  res.setHeader("X-Correlation-ID", correlationId);
  next();
});

// Pino Logger
app.use(
  pinoHttp({
    logger,
    genReqId: (req) => req.headers["x-correlation-id"] as string || uuidv4(),
    customLogLevel: (req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) return "warn";
      if (res.statusCode >= 500 || err) return "error";
      if (req.url === "/health" || req.url === "/") return "silent";
      return "info";
    },
  })
);

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
app.use("/api/v1/admin", adminManagementRoutes);
app.use("/api/v1/progress", progressRouter);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/admin/professionals", adminProfessionalRoutes);
app.use("/api/v1/professionals", professionalRoutes);
app.use("/api/v1/admin/appointments", adminAppointmentRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/admin/events", adminEventRoutes);
app.use("/api/v1/events", eventRoutes);

// Error Handler (must be after all routes)
app.use(errorHandler);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

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

// ── Start Server ─────────────────────────────────────────────
async function start() {
  await connectDB();
  app.listen(env.PORT, () => {
    logger.info(`🚀 Nuru API running on port ${env.PORT}`);
    logger.info(`   Environment: ${env.NODE_ENV}`);
    logger.info(`   AI Provider: ${env.AI_PROVIDER}`);
  });
}

start().catch((err) => {
  logger.error(err, "Failed to start server");
  process.exit(1);
});

export default app;
