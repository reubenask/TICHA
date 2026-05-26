import { radioCategories } from "../data/radioCategories";
import { starterVocabulary } from "../data/starterVocabulary";
import type { NativeLanguage, ProgressSummary, RadioCategory, UserLevel, UserProfile, VocabularyWord } from "../domain/types";

export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  nativeLanguage: NativeLanguage;
  level: UserLevel;
  photoUrl?: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface TichaApi {
  signUp(input: SignUpInput): Promise<UserProfile>;
  signIn(input: SignInInput): Promise<UserProfile>;
  signOut(): Promise<void>;
  getProfile(): Promise<UserProfile | null>;
  updateProfile(input: Partial<UserProfile>): Promise<UserProfile>;
  getVocabularyDeck(): Promise<VocabularyWord[]>;
  updateVocabularyReview(wordId: string, status: VocabularyWord["reviewStatus"]): Promise<VocabularyWord>;
  generateWordMap(wordId: string, language: NativeLanguage): Promise<VocabularyWord>;
  getRadioCategories(): Promise<RadioCategory[]>;
  getProgress(): Promise<ProgressSummary>;
}

const apiBaseUrl = import.meta.env.VITE_TICHA_API_URL?.replace(/\/$/, "");
const tokenKey = "ticha.react.apiToken";
const profileKey = "ticha.react.profile";
const deckKey = "ticha.react.deck";

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): T {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

function requireProfile(): UserProfile {
  const profile = readJson<UserProfile | null>(profileKey, null);
  if (!profile) throw new Error("No active Ticha user profile.");
  return profile;
}

function ensureDeck(): VocabularyWord[] {
  const deck = readJson<VocabularyWord[] | null>(deckKey, null);
  return deck ?? writeJson(deckKey, starterVocabulary);
}

export const mockTichaApi: TichaApi = {
  async signUp(input) {
    const profile: UserProfile = {
      id: `TICHA-${input.name.trim().replace(/\s+/g, "-").toUpperCase() || "LEARNER"}`,
      name: input.name.trim() || "Learner",
      email: input.email.trim().toLowerCase(),
      level: input.level,
      nativeLanguage: input.nativeLanguage,
      photoUrl: input.photoUrl
    };
    writeJson(profileKey, profile);
    ensureDeck();
    return profile;
  },

  async signIn(input) {
    const existing = readJson<UserProfile | null>(profileKey, null);
    if (existing && existing.email === input.email.trim().toLowerCase()) return existing;
    throw new Error("Prototype account not found on this device.");
  },

  async signOut() {
    localStorage.removeItem(profileKey);
  },

  async getProfile() {
    return readJson<UserProfile | null>(profileKey, null);
  },

  async updateProfile(input) {
    const next = { ...requireProfile(), ...input };
    return writeJson(profileKey, next);
  },

  async getVocabularyDeck() {
    return ensureDeck();
  },

  async updateVocabularyReview(wordId, status) {
    const deck = ensureDeck();
    const nextDeck = deck.map((word) =>
      word.id === wordId ? { ...word, reviewStatus: status, studiedCount: word.studiedCount + 1 } : word
    );
    writeJson(deckKey, nextDeck);
    const updated = nextDeck.find((word) => word.id === wordId);
    if (!updated) throw new Error(`Vocabulary word not found: ${wordId}`);
    return updated;
  },

  async generateWordMap(wordId, language) {
    const word = ensureDeck().find((item) => item.id === wordId);
    if (!word) throw new Error(`Vocabulary word not found: ${wordId}`);
    return { ...word, translation: language === "English" ? word.word.toLowerCase() : `${word.word} (${language})` };
  },

  async getRadioCategories() {
    return radioCategories;
  },

  async getProgress() {
    const deck = ensureDeck();
    return {
      totalWords: deck.length,
      knownWords: deck.filter((word) => word.reviewStatus === "known").length,
      weeklyWords: deck.filter((word) => word.studiedCount > 0).length,
      sessions: deck.reduce((sum, word) => sum + word.studiedCount, 0)
    };
  }
};

async function apiRequest<T>(path: string, init: RequestInit = {}, authed = true): Promise<T> {
  if (!apiBaseUrl) throw new Error("VITE_TICHA_API_URL is not configured.");
  const headers = new Headers(init.headers);
  headers.set("content-type", "application/json");
  if (authed) {
    const token = localStorage.getItem(tokenKey);
    if (token) headers.set("authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body?.error?.message || `API request failed: ${response.status}`);
  }
  return body as T;
}

export const backendTichaApi: TichaApi = {
  async signUp(input) {
    const body = await apiRequest<{ user: UserProfile; token: string }>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(input)
    }, false);
    localStorage.setItem(tokenKey, body.token);
    return body.user;
  },

  async signIn(input) {
    const body = await apiRequest<{ user: UserProfile; token: string }>("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(input)
    }, false);
    localStorage.setItem(tokenKey, body.token);
    return body.user;
  },

  async signOut() {
    localStorage.removeItem(tokenKey);
  },

  async getProfile() {
    if (!localStorage.getItem(tokenKey)) return null;
    const body = await apiRequest<{ user: UserProfile }>("/api/me");
    return body.user;
  },

  async updateProfile(input) {
    const body = await apiRequest<{ user: UserProfile }>("/api/me", {
      method: "PATCH",
      body: JSON.stringify(input)
    });
    return body.user;
  },

  async getVocabularyDeck() {
    const body = await apiRequest<{ vocabulary: VocabularyWord[] }>("/api/vocabulary");
    return body.vocabulary;
  },

  async updateVocabularyReview(wordId, status) {
    const body = await apiRequest<{ word: VocabularyWord }>(`/api/vocabulary/${wordId}/review`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
    return body.word;
  },

  async generateWordMap(wordId) {
    const body = await apiRequest<{ word: VocabularyWord }>(`/api/vocabulary/${wordId}/word-map`);
    return body.word;
  },

  async getRadioCategories() {
    const body = await apiRequest<{ categories: RadioCategory[] }>("/api/radio/categories", {}, false);
    return body.categories;
  },

  async getProgress() {
    const body = await apiRequest<{ progress: ProgressSummary }>("/api/progress");
    return body.progress;
  }
};

export const tichaApi = apiBaseUrl ? backendTichaApi : mockTichaApi;
