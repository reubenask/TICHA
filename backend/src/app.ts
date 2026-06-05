import cors from "cors";
import express from "express";
import helmet from "helmet";
import { corsOrigins } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { generalRateLimit } from "./middleware/rateLimit.js";
import { initSentry } from "./middleware/sentry.js";
import { authRoutes } from "./routes/authRoutes.js";
import { captureRoutes } from "./routes/captureRoutes.js";
import { knowledgeRoutes } from "./routes/knowledgeRoutes.js";
import { progressRoutes } from "./routes/progressRoutes.js";
import { radioRoutes } from "./routes/radioRoutes.js";
import { uploadRoutes } from "./routes/uploadRoutes.js";
import { vocabularyRoutes } from "./routes/vocabularyRoutes.js";

export function createApp() {
  initSentry();
  const app = express();

  app.use(helmet());
  app.set("trust proxy", 1);
  app.use(cors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin) || corsOrigins.includes("*")) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    }
  }));
  app.use(express.json({ limit: "12mb" }));
  app.use(generalRateLimit);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "ticha-backend" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api", authRoutes);
  app.use("/api/vocabulary", vocabularyRoutes);
  app.use("/api/progress", progressRoutes);
  app.use("/api/radio", radioRoutes);
  app.use("/api/uploads", uploadRoutes);
  app.use("/api/capture", captureRoutes);
  app.use("/api/knowledge", knowledgeRoutes);

  app.use(errorHandler);

  return app;
}
