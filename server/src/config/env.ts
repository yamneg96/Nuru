import dotenv from "dotenv";
dotenv.config();

export const env = {
  PORT: parseInt(process.env.PORT || "5000", 10),
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/nuru",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret-change-in-production",
  GROK_API_KEY: process.env.GROK_API_KEY || "",
  AI_PROVIDER: process.env.AI_PROVIDER || "grok",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
} as const;

// Validate critical env vars in production
if (env.NODE_ENV === "production") {
  const required = ["MONGODB_URI", "GOOGLE_CLIENT_ID", "JWT_SECRET"] as const;
  for (const key of required) {
    if (!env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}
