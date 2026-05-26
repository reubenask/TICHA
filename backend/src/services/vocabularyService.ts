import { nanoid } from "nanoid";
import { z } from "zod";
import { starterVocabulary } from "../data/starterVocabulary.js";
import { HttpError } from "../http/httpError.js";
import { store } from "../store/index.js";
import type { NativeLanguage, ProgressSummary, ReviewStatus, VocabularyWord } from "../types/domain.js";

export const createWordSchema = z.object({
  word: z.string().trim().min(1).max(80),
  emoji: z.string().trim().default("📘"),
  partOfSpeech: z.string().trim().default("word"),
  pronunciation: z.string().trim().default(""),
  definition: z.string().trim().min(1).max(500),
  example: z.string().trim().default(""),
  difficulty: z.enum(["Starter", "Growing", "Advanced"]).default("Starter"),
  associations: z.array(z.string().trim()).default([]),
  synonyms: z.array(z.string().trim()).default([]),
  antonyms: z.array(z.string().trim()).default([]),
  translation: z.string().trim().default("")
});

export const reviewSchema = z.object({
  status: z.enum(["new", "repeat", "known"])
});

export function getStarterVocabulary() {
  return starterVocabulary;
}

export async function getDeck(userId: string) {
  const db = await store.read();
  return db.vocabulary.filter((word) => word.userId === userId);
}

export async function addWord(userId: string, input: z.infer<typeof createWordSchema>) {
  const data = createWordSchema.parse(input);
  const now = new Date().toISOString();
  const word: VocabularyWord = {
    ...data,
    id: `${userId}-word-${nanoid(8)}`,
    userId,
    translation: data.translation || data.word,
    reviewStatus: "new",
    studiedCount: 0,
    createdAt: now,
    updatedAt: now
  };

  await store.transaction((db) => {
    db.vocabulary.push(word);
  });
  return word;
}

export async function reviewWord(userId: string, wordId: string, status: ReviewStatus) {
  return store.transaction((db) => {
    const word = db.vocabulary.find((item) => item.userId === userId && item.id === wordId);
    if (!word) throw new HttpError(404, "Vocabulary word not found.", "WORD_NOT_FOUND");
    word.reviewStatus = status;
    word.studiedCount += 1;
    word.updatedAt = new Date().toISOString();
    return word;
  });
}

export async function upsertWordMap(userId: string, wordId: string, data: VocabularyWord) {
  return store.transaction((db) => {
    const index = db.vocabulary.findIndex((item) => item.userId === userId && item.id === wordId);
    if (index === -1) throw new HttpError(404, "Vocabulary word not found.", "WORD_NOT_FOUND");
    db.vocabulary[index] = { ...db.vocabulary[index], ...data, id: wordId, userId, updatedAt: new Date().toISOString() };
    return db.vocabulary[index];
  });
}

export async function getWord(userId: string, wordId: string) {
  const db = await store.read();
  const word = db.vocabulary.find((item) => item.userId === userId && item.id === wordId);
  if (!word) throw new HttpError(404, "Vocabulary word not found.", "WORD_NOT_FOUND");
  return word;
}

export async function getProgress(userId: string): Promise<ProgressSummary> {
  const deck = await getDeck(userId);
  return {
    totalWords: deck.length,
    knownWords: deck.filter((word) => word.reviewStatus === "known").length,
    weeklyWords: deck.filter((word) => word.studiedCount > 0).length,
    sessions: deck.reduce((sum, word) => sum + word.studiedCount, 0)
  };
}

export function translateFallback(word: VocabularyWord, language: NativeLanguage) {
  return language === "English" ? word.word.toLowerCase() : `${word.word} (${language})`;
}
