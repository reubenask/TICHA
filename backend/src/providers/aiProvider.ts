import { env } from "../config/env.js";
import type { CaptureAnalysis, NativeLanguage, RadioGeneration, VocabularyWord } from "../types/domain.js";
import { mockAiProvider } from "./mockAiProvider.js";
import { openAiProvider } from "./openAiProvider.js";

export interface GenerateWordMapInput {
  word: VocabularyWord;
  language: NativeLanguage;
}

export interface AnalyzeCaptureInput {
  imageBase64?: string;
  mimeType?: string;
  prompt?: string;
  language: NativeLanguage;
}

export interface GenerateRadioInput {
  categoryId: string;
  learnerLevel?: string;
  topic?: string;
  language: NativeLanguage;
}

export interface AiProvider {
  generateWordMap(input: GenerateWordMapInput): Promise<VocabularyWord>;
  analyzeCapture(input: AnalyzeCaptureInput): Promise<CaptureAnalysis>;
  generateRadio(input: GenerateRadioInput): Promise<RadioGeneration>;
  answerKnowledge(input: { question: string; language: NativeLanguage; level?: string }): Promise<{ answer: string }>;
}

export function getAiProvider(): AiProvider {
  if (env.AI_PROVIDER === "openai" && env.OPENAI_API_KEY && env.OPENAI_MODEL) {
    return openAiProvider;
  }
  return mockAiProvider;
}
