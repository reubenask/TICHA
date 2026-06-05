import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { createUploadTarget } from "../services/storageService.js";

export const uploadRoutes = Router();

uploadRoutes.post("/signed-url", requireAuth, async (req, res, next) => {
  try {
    res.json({ upload: await createUploadTarget((req as AuthedRequest).auth.sub, req.body) });
  } catch (error) {
    next(error);
  }
});
