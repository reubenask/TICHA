import { Router } from "express";
import { z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { getAiProvider } from "../providers/aiProvider.js";
import { getProfile } from "../services/authService.js";

export const knowledgeRoutes = Router();

knowledgeRoutes.post("/ask", requireAuth, async (req, res, next) => {
  try {
    const body = z.object({ question: z.string().trim().min(1).max(800) }).parse(req.body);
    const user = await getProfile((req as AuthedRequest).auth.sub);
    const result = await getAiProvider().answerKnowledge({
      question: body.question,
      language: user.nativeLanguage,
      level: user.level
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
});
