import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().url().default("mongodb://localhost:27017/nuru"),
  GOOGLE_CLIENT_ID: z.string().default(""),
  JWT_SECRET: z.string().default("dev-secret-change-in-production"),
  GROK_API_KEY: z.string().optional().default(""),
  AI_PROVIDER: z.string().default("grok"),
  CLIENT_URL: z.string().url().default("http://localhost:5173"),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().min(8).optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:", JSON.stringify(parsed.error.format(), null, 2));
  process.exit(1);
}

export const env = parsed.data;

