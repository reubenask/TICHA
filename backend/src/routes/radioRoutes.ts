import { Router } from "express";
import { z } from "zod";
import { radioCategories } from "../data/radioCategories.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { getAiProvider } from "../providers/aiProvider.js";
import { getProfile } from "../services/authService.js";

export const radioRoutes = Router();

radioRoutes.get("/categories", (_req, res) => {
  res.json({ categories: radioCategories });
});

radioRoutes.post("/generate", requireAuth, async (req, res, next) => {
  try {
    const body = z.object({
      categoryId: z.string().min(1),
      topic: z.string().max(120).optional()
    }).parse(req.body);
    const user = await getProfile((req as AuthedRequest).auth.sub);
    const radio = await getAiProvider().generateRadio({
      categoryId: body.categoryId,
      topic: body.topic,
      language: user.nativeLanguage,
      learnerLevel: user.level
    });
    res.json({ radio });
  } catch (error) {
    next(error);
  }
});
