import { env } from "../config/env.js";
import { HttpError } from "../http/httpError.js";
import type { VocabularyWord } from "../types/domain.js";
import type { AiProvider } from "./aiProvider.js";

async function callResponsesApi(prompt: string, image?: { mimeType: string; imageBase64: string }) {
  if (!env.OPENAI_API_KEY || !env.OPENAI_MODEL) {
    throw new HttpError(500, "OpenAI provider requires OPENAI_API_KEY and OPENAI_MODEL.", "PROVIDER_NOT_CONFIGURED");
  }

  const content: unknown[] = [{ type: "input_text", text: prompt }];
  if (image?.imageBase64) {
    content.push({
      type: "input_image",
      image_url: `data:${image.mimeType};base64,${image.imageBase64}`
    });
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL,
      input: [{ role: "user", content }]
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new HttpError(response.status, `OpenAI request failed: ${body}`, "PROVIDER_REQUEST_FAILED");
  }

  const json = (await response.json()) as { output_text?: string; output?: Array<{ content?: Array<{ text?: string }> }> };
  return json.output_text || json.output?.flatMap((item) => item.content || []).map((item) => item.text || "").join("\n") || "";
}

function parseJson<T>(text: string, fallback: T): T {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : text) as T;
  } catch {
    return fallback;
  }
}

export const openAiProvider: AiProvider = {
  async generateWordMap({ word, language }) {
    const prompt = `Create a JSON word map for this English vocabulary word. Translate into ${language}. Return only JSON matching this shape: {"word":"","emoji":"","partOfSpeech":"","pronunciation":"","definition":"","example":"","difficulty":"Starter","associations":[],"synonyms":[],"antonyms":[],"translation":""}. Word data: ${JSON.stringify(word)}`;
    const output = await callResponsesApi(prompt);
    const generated = parseJson<Partial<VocabularyWord>>(output, {});
    return {
      ...word,
      ...generated,
      id: word.id,
      userId: word.userId,
      reviewStatus: word.reviewStatus,
      studiedCount: word.studiedCount
    };
  },

  async analyzeCapture({ imageBase64, mimeType = "image/png", prompt, language }) {
    const instruction = `Analyze this learner capture for an English learning app. Return only JSON: {"title":"","summary":"","vocabulary":[{"word":"","emoji":"","partOfSpeech":"","pronunciation":"","definition":"","example":"","difficulty":"Starter","associations":[],"synonyms":[],"antonyms":[],"translation":"","reviewStatus":"new","studiedCount":0}]}. Learner language: ${language}. Optional prompt: ${prompt || ""}`;
    const output = await callResponsesApi(instruction, imageBase64 ? { imageBase64, mimeType } : undefined);
    return parseJson(output, { title: "Capture analysis", summary: output, vocabulary: [] });
  },

  async generateRadio({ categoryId, topic, language, learnerLevel }) {
    const prompt = `Write an original child-safe Ticha Radio script. Category: ${categoryId}. Topic: ${topic || "surprise me"}. Learner level: ${learnerLevel || "starter"}. Language support: ${language}. Return only JSON: {"categoryId":"","title":"","script":"","durationSeconds":90}.`;
    const output = await callResponsesApi(prompt);
    return parseJson(output, { categoryId, title: topic || "Ticha Radio", script: output, durationSeconds: 90 });
  },

  async answerKnowledge({ question, language, level }) {
    const prompt = `Answer for a child-safe English learning companion. Keep it clear and warm. Learner language: ${language}. Level: ${level || "starter"}. Question: ${question}`;
    const answer = await callResponsesApi(prompt);
    return { answer };
  }
};
