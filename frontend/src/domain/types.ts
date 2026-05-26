export type UserLevel = "grade-1-3" | "grade-4-6" | "grade-7-plus" | "hobbyist";

export type NativeLanguage = "English" | "French" | "Spanish" | "Chinese" | "Ewe";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  level: UserLevel;
  nativeLanguage: NativeLanguage;
  photoUrl?: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  emoji: string;
  partOfSpeech: string;
  pronunciation: string;
  definition: string;
  example: string;
  difficulty: "Starter" | "Growing" | "Advanced";
  associations: string[];
  synonyms: string[];
  antonyms: string[];
  translation: string;
  reviewStatus: "new" | "repeat" | "known";
  studiedCount: number;
}

export interface RadioCategory {
  id: string;
  title: string;
  subtitle: string;
  cadence: string;
  sampleScript: string;
}

export interface ProgressSummary {
  totalWords: number;
  knownWords: number;
  weeklyWords: number;
  sessions: number;
}
