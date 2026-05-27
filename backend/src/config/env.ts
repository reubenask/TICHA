import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(8787),
  CORS_ORIGIN: z.string().default("http://localhost:5173,http://127.0.0.1:5173,http://127.0.0.1:4173"),
  JWT_SECRET: z.string().default("dev-only-change-this-secret"),
  TICHA_DATA_FILE: z.string().default(".data/ticha-db.json"),
  AI_PROVIDER: z.enum(["mock", "openai"]).default("mock"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().optional(),
  STORAGE_PROVIDER: z.string().default("local"),
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

export const corsOrigins = env.CORS_ORIGIN.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
