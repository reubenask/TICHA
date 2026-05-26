import { Router } from "express";
import { z } from "zod";
import { getAiProvider } from "../providers/aiProvider.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { getProfile } from "../services/authService.js";
import { addWord, createWordSchema, getDeck, getStarterVocabulary, getWord, reviewSchema, reviewWord, upsertWordMap } from "../services/vocabularyService.js";

export const vocabularyRoutes = Router();

function getWordId(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

vocabularyRoutes.get("/starter", (_req, res) => {
  res.json({ vocabulary: getStarterVocabulary() });
});

vocabularyRoutes.get("/", requireAuth, async (req, res, next) => {
  try {
    res.json({ vocabulary: await getDeck((req as AuthedRequest).auth.sub) });
  } catch (error) {
    next(error);
  }
});

vocabularyRoutes.post("/", requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).auth.sub;
    res.status(201).json({ word: await addWord(userId, createWordSchema.parse(req.body)) });
  } catch (error) {
    next(error);
  }
});

vocabularyRoutes.patch("/:wordId/review", requireAuth, async (req, res, next) => {
  try {
    const { status } = reviewSchema.parse(req.body);
    const word = await reviewWord((req as AuthedRequest).auth.sub, getWordId(req.params.wordId), status);
    res.json({ word });
  } catch (error) {
    next(error);
  }
});

vocabularyRoutes.get("/:wordId/word-map", requireAuth, async (req, res, next) => {
  try {
    const userId = (req as AuthedRequest).auth.sub;
    const wordId = getWordId(req.params.wordId);
    const [user, word] = await Promise.all([getProfile(userId), getWord(userId, wordId)]);
    const generated = await getAiProvider().generateWordMap({ word, language: user.nativeLanguage });
    res.json({ word: await upsertWordMap(userId, wordId, generated) });
  } catch (error) {
    next(error);
  }
});

vocabularyRoutes.post("/word-map", requireAuth, async (req, res, next) => {
  try {
    const body = z.object({ wordId: z.string().min(1) }).parse(req.body);
    const userId = (req as AuthedRequest).auth.sub;
    const [user, word] = await Promise.all([getProfile(userId), getWord(userId, body.wordId)]);
    const generated = await getAiProvider().generateWordMap({ word, language: user.nativeLanguage });
    res.json({ word: await upsertWordMap(userId, body.wordId, generated) });
  } catch (error) {
    next(error);
  }
});
