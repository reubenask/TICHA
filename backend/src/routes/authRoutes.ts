import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { getProfile, signIn, signUp, updateProfile } from "../services/authService.js";

export const authRoutes = Router();

authRoutes.post("/signup", async (req, res, next) => {
  try {
    res.status(201).json(await signUp(req.body));
  } catch (error) {
    next(error);
  }
});

authRoutes.post("/signin", async (req, res, next) => {
  try {
    res.json(await signIn(req.body));
  } catch (error) {
    next(error);
  }
});

authRoutes.get("/me", requireAuth, async (req, res, next) => {
  try {
    res.json({ user: await getProfile((req as AuthedRequest).auth.sub) });
  } catch (error) {
    next(error);
  }
});

authRoutes.patch("/me", requireAuth, async (req, res, next) => {
  try {
    res.json({ user: await updateProfile((req as AuthedRequest).auth.sub, req.body) });
  } catch (error) {
    next(error);
  }
});
