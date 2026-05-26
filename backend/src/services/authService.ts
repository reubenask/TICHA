import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { z } from "zod";
import { starterVocabulary } from "../data/starterVocabulary.js";
import { HttpError } from "../http/httpError.js";
import { signToken } from "../middleware/auth.js";
import { store } from "../store/index.js";
import type { NativeLanguage, UserLevel, UserProfile, UserRecord, VocabularyWord } from "../types/domain.js";

export const signUpSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(180),
  password: z.string().min(8).max(200),
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
