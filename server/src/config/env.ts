import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().url().default("mongodb://localhost:27017/nuru"),
  GOOGLE_CLIENT_ID: z.string().default(""),
  JWT_SECRET: z.string().default("dev-secret-change-in-production"),
  JWT_REFRESH_SECRET: z.string().default("refresh-secret-change-in-production"),
  JWT_ACCESS_EXPIRY: z.string().default("15m"),
  JWT_REFRESH_EXPIRY: z.string().default("30d"),
  GEMINI_API_KEY: z.string().optional().default(""),
  AI_PROVIDER: z.string().default("gemini"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
  GOOGLE_MAPS_API_KEY: z.string().default(""),
  TELEGRAM_BOT_TOKEN: z.string().default(""),
  TELEGRAM_BASE_URL: z.string().default(""),
  WHATSAPP_TOKEN: z.string().default(""),
  WHATSAPP_PHONE_ID: z.string().default(""),
  WHATSAPP_VERIFY_TOKEN: z.string().default("")
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;

