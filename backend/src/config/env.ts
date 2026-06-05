import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8787),
  CORS_ORIGIN: z.string().default("http://localhost:5173,http://127.0.0.1:5173,http://127.0.0.1:4173"),
  APP_PUBLIC_URL: z.string().url().optional(),
  JWT_SECRET: z.string().default("dev-only-change-this-secret"),
  DATABASE_PROVIDER: z.enum(["local", "postgres"]).default("local"),
  DATABASE_URL: z.string().optional(),
  TICHA_DATA_FILE: z.string().default(".data/ticha-db.json"),
  AI_PROVIDER: z.enum(["mock", "openai"]).default("mock"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  SENTRY_DSN: z.string().optional(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_STORAGE_BUCKET: z.string().default("ticha-uploads"),
  STORAGE_PROVIDER: z.enum(["local", "supabase"]).default("local"),
  TTS_PROVIDER: z.string().default("mock"),
  VISION_PROVIDER: z.string().default("mock"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60_000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(180),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(30)
});

export const env = envSchema.parse(process.env);

if (env.NODE_ENV === "production" && env.JWT_SECRET === "dev-only-change-this-secret") {
  throw new Error("JWT_SECRET must be set to a strong secret in production.");
}

if (env.DATABASE_PROVIDER === "postgres" && !env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required when DATABASE_PROVIDER=postgres.");
}

if (env.STORAGE_PROVIDER === "supabase" && (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY)) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required when STORAGE_PROVIDER=supabase.");
}

export const corsOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
