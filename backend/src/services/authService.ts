import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { env } from "../config/env.js";
import { starterVocabulary } from "../data/starterVocabulary.js";
import { HttpError } from "../http/httpError.js";
import { signToken } from "../middleware/auth.js";
import { store } from "../store/index.js";
import type { NativeLanguage, UserLevel, UserProfile, UserRecord, VocabularyWord } from "../types/domain.js";
import { sendPasswordResetEmail } from "./emailService.js";

const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters.")
  .max(200)
  .refine((value) => /[0-9]/.test(value), "Password must include at least one number.")
  .refine((value) => /[^A-Za-z0-9]/.test(value), "Password must include at least one symbol.");

export const signUpSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(180),
  password: passwordSchema,
  nativeLanguage: z.enum(["English", "French", "Spanish", "Chinese", "Ewe"]),
  level: z.enum(["grade-1-3", "grade-4-6", "grade-7-plus", "hobbyist"]),
  photoUrl: z.string().url().optional()
});

export const signInSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1)
});

export const updateProfileSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  nativeLanguage: z.enum(["English", "French", "Spanish", "Chinese", "Ewe"]).optional(),
  level: z.enum(["grade-1-3", "grade-4-6", "grade-7-plus", "hobbyist"]).optional(),
  photoUrl: z.string().url().nullable().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema
});

export const passwordResetRequestSchema = z.object({
  email: z.string().trim().email().max(180)
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(20).max(120),
  newPassword: passwordSchema
});

function publicProfile(user: UserRecord): UserProfile {
  const { passwordHash: _passwordHash, ...profile } = user;
  return profile;
}

function tichaId(name: string) {
  const slug = name.trim().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toUpperCase();
  return `TICHA-${slug || nanoid(6).toUpperCase()}`;
}

function seedDeck(userId: string, language: NativeLanguage): VocabularyWord[] {
  const now = new Date().toISOString();
  return starterVocabulary.map((word) => ({
    ...word,
    id: `${userId}-${word.id}`,
    userId,
    translation: language === "English" ? word.translation : `${word.word} (${language})`,
    createdAt: now,
    updatedAt: now
  }));
}

export async function signUp(input: z.infer<typeof signUpSchema>) {
  const data = signUpSchema.parse(input);
  const now = new Date().toISOString();
  const email = data.email.toLowerCase();

  const result = await store.transaction(async (db) => {
    if (db.users.some((user) => user.email === email)) {
      throw new HttpError(409, "An account already exists for this email.", "EMAIL_IN_USE");
    }

    const user: UserRecord = {
      id: tichaId(data.name),
      name: data.name,
      email,
      level: data.level as UserLevel,
      nativeLanguage: data.nativeLanguage,
      photoUrl: data.photoUrl,
      passwordHash: await bcrypt.hash(data.password, 12),
      createdAt: now,
      updatedAt: now
    };

    db.users.push(user);
    db.vocabulary.push(...seedDeck(user.id, user.nativeLanguage));
    return publicProfile(user);
  });

  return { user: result, token: signToken({ sub: result.id, email: result.email }) };
}

export async function signIn(input: z.infer<typeof signInSchema>) {
  const data = signInSchema.parse(input);
  const db = await store.read();
  const user = db.users.find((item) => item.email === data.email.toLowerCase());
  if (!user) throw new HttpError(401, "Email or password is incorrect.", "INVALID_CREDENTIALS");

  const ok = await bcrypt.compare(data.password, user.passwordHash);
  if (!ok) throw new HttpError(401, "Email or password is incorrect.", "INVALID_CREDENTIALS");

  return { user: publicProfile(user), token: signToken({ sub: user.id, email: user.email }) };
}

export async function getProfile(userId: string) {
  const db = await store.read();
  const user = db.users.find((item) => item.id === userId);
  if (!user) throw new HttpError(404, "Profile not found.", "PROFILE_NOT_FOUND");
  return publicProfile(user);
}

export async function updateProfile(userId: string, input: z.infer<typeof updateProfileSchema>) {
  const data = updateProfileSchema.parse(input);
  return store.transaction((db) => {
    const user = db.users.find((item) => item.id === userId);
    if (!user) throw new HttpError(404, "Profile not found.", "PROFILE_NOT_FOUND");
    Object.assign(user, data, { photoUrl: data.photoUrl === null ? undefined : data.photoUrl, updatedAt: new Date().toISOString() });
    return publicProfile(user);
  });
}

export async function changePassword(userId: string, input: z.infer<typeof changePasswordSchema>) {
  const data = changePasswordSchema.parse(input);

  return store.transaction(async (db) => {
    const user = db.users.find((item) => item.id === userId);
    if (!user) throw new HttpError(404, "Profile not found.", "PROFILE_NOT_FOUND");

    const ok = await bcrypt.compare(data.currentPassword, user.passwordHash);
    if (!ok) throw new HttpError(401, "Current password is incorrect.", "INVALID_CURRENT_PASSWORD");

    user.passwordHash = await bcrypt.hash(data.newPassword, 12);
    user.updatedAt = new Date().toISOString();
    db.passwordResetTokens = db.passwordResetTokens.filter((token) => token.userId !== user.id);
    return { ok: true };
  });
}

export async function requestPasswordReset(input: z.infer<typeof passwordResetRequestSchema>) {
  const data = passwordResetRequestSchema.parse(input);
  const email = data.email.toLowerCase();
  const token = nanoid(48);
  const now = Date.now();
  const createdAt = new Date(now).toISOString();
  const expiresAt = new Date(now + 30 * 60 * 1000).toISOString();
  let resetToken: string | undefined;
  let emailPayload: { to: string; name: string; token: string } | undefined;

  await store.transaction((db) => {
    db.passwordResetTokens = db.passwordResetTokens.filter((item) => Date.parse(item.expiresAt) > now);
    const user = db.users.find((item) => item.email === email);
    if (!user) return;

    db.passwordResetTokens = db.passwordResetTokens.filter((item) => item.userId !== user.id);
    db.passwordResetTokens.push({ token, userId: user.id, createdAt, expiresAt });
    emailPayload = { to: user.email, name: user.name, token };
    if (env.NODE_ENV !== "production") resetToken = token;
  });

  const emailResult = emailPayload ? await sendPasswordResetEmail(emailPayload) : { sent: false };

  return {
    ok: true,
    message: "If an account exists for this email, password reset instructions will be sent.",
    emailSent: env.NODE_ENV === "production" ? undefined : emailResult.sent,
    resetToken
  };
}

export async function resetPassword(input: z.infer<typeof passwordResetConfirmSchema>) {
  const data = passwordResetConfirmSchema.parse(input);
  const now = Date.now();
  const passwordHash = await bcrypt.hash(data.newPassword, 12);

  return store.transaction((db) => {
    const token = db.passwordResetTokens.find((item) => item.token === data.token);
    if (!token || Date.parse(token.expiresAt) <= now) {
      throw new HttpError(400, "Password reset link is invalid or expired.", "RESET_TOKEN_INVALID");
    }

    const user = db.users.find((item) => item.id === token.userId);
    if (!user) throw new HttpError(404, "Profile not found.", "PROFILE_NOT_FOUND");

    user.passwordHash = passwordHash;
    user.updatedAt = new Date().toISOString();
    db.passwordResetTokens = db.passwordResetTokens.filter((item) => item.userId !== user.id);
    return { ok: true };
  });
}
