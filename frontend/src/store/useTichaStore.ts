import { create } from "zustand";
import { tichaApi } from "../services/apiClient";
import type { ProgressSummary, RadioCategory, UserProfile, VocabularyWord } from "../domain/types";

interface TichaState {
  profile: UserProfile | null;
  deck: VocabularyWord[];
  radio: RadioCategory[];
  progress: ProgressSummary | null;
  activeWordId: string | null;
  load(): Promise<void>;
  createDemoAccount(): Promise<void>;
  markWord(wordId: string, status: VocabularyWord["reviewStatus"]): Promise<void>;
  setActiveWord(wordId: string): void;
}

export const useTichaStore = create<TichaState>((set, get) => ({
  profile: null,
  deck: [],
  radio: [],
  progress: null,
  activeWordId: null,

  async load() {
    const [profile, deck, radio, progress] = await Promise.all([
      tichaApi.getProfile(),
      tichaApi.getVocabularyDeck(),
      tichaApi.getRadioCategories(),
      tichaApi.getProgress()
    ]);
    set({ profile, deck, radio, progress, activeWordId: deck[0]?.id ?? null });
  },

  async createDemoAccount() {
    const profile = await tichaApi.signUp({
      name: "Learner",
      email: "learner@ticha.app",
      password: "Prototype123!",
      nativeLanguage: "English",
      level: "grade-1-3"
    });
    await get().load();
    set({ profile });
  },

  async markWord(wordId, status) {
    await tichaApi.updateVocabularyReview(wordId, status);
    const [deck, progress] = await Promise.all([tichaApi.getVocabularyDeck(), tichaApi.getProgress()]);
    const index = deck.findIndex((word) => word.id === wordId);
    set({ deck, progress, activeWordId: deck[(index + 1) % deck.length]?.id ?? wordId });
  },

  setActiveWord(wordId) {
    set({ activeWordId: wordId });
  }
}));
