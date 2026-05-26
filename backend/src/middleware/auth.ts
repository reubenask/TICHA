import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../http/httpError.js";

export interface AuthClaims {
  sub: string;
  email: string;
}

export interface AuthedRequest extends Request {
  auth: AuthClaims;
}

export function signToken(claims: AuthClaims): string {
  return jwt.sign(claims, env.JWT_SECRET, { expiresIn: "14d" });
}

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;
  if (!token) throw new HttpError(401, "Missing bearer token.", "UNAUTHENTICATED");

  try {
    (req as AuthedRequest).auth = jwt.verify(token, env.JWT_SECRET) as AuthClaims;
    next();
  } catch {
    throw new HttpError(401, "Invalid or expired token.", "UNAUTHENTICATED");
  }
}
