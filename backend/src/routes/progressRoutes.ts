import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { getProgress } from "../services/vocabularyService.js";

export const progressRoutes = Router();

progressRoutes.get("/", requireAuth, async (req, res, next) => {
  try {
    res.json({ progress: await getProgress((req as AuthedRequest).auth.sub) });
  } catch (error) {
    next(error);
  }
});
