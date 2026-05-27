import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { authRateLimit } from "../middleware/rateLimit.js";
import { changePassword, getProfile, requestPasswordReset, resetPassword, signIn, signUp, updateProfile } from "../services/authService.js";

export const authRoutes = Router();

authRoutes.post("/signup", authRateLimit, async (req, res, next) => {
  try {
    res.status(201).json(await signUp(req.body));
  } catch (error) {
    next(error);
  }
});

authRoutes.post("/signin", authRateLimit, async (req, res, next) => {
  try {
    res.json(await signIn(req.body));
  } catch (error) {
    next(error);
  }
});

authRoutes.post("/password/reset-request", authRateLimit, async (req, res, next) => {
  try {
    res.json(await requestPasswordReset(req.body));
  } catch (error) {
    next(error);
  }
});

authRoutes.post("/password/reset-confirm", authRateLimit, async (req, res, next) => {
  try {
    res.json(await resetPassword(req.body));
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

authRoutes.post("/password/change", requireAuth, async (req, res, next) => {
  try {
    res.json(await changePassword((req as AuthedRequest).auth.sub, req.body));
  } catch (error) {
    next(error);
  }
});
