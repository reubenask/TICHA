import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { getAiProvider } from "../providers/aiProvider.js";
import { getProfile } from "../services/authService.js";

export const captureRoutes = Router();

captureRoutes.post("/analyze", requireAuth, async (req, res, next) => {
  try {
    const body = z.object({
      imageBase64: z.string().optional(),
      mimeType: z.string().default("image/png"),
      prompt: z.string().max(500).optional()
    }).parse(req.body);
    const user = await getProfile((req as AuthedRequest).auth.sub);
    const analysis = await getAiProvider().analyzeCapture({ ...body, language: user.nativeLanguage });
    res.json({ analysis });
  } catch (error) {
    next(error);
  }
});
