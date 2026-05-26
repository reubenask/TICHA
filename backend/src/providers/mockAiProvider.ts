import type { AiProvider } from "./aiProvider.js";

export const mockAiProvider: AiProvider = {
  async generateWordMap({ word, language }) {
    return {
      ...word,
      translation: language === "English" ? word.translation || word.word.toLowerCase() : `${word.word} (${language})`,
      associations: word.associations.length ? word.associations : ["picture", "meaning", "example"],
      synonyms: word.synonyms.length ? word.synonyms : ["related word"],
      antonyms: word.antonyms
    };
  },

  async analyzeCapture({ prompt, language }) {
    const word = prompt?.trim() || "Gelato";
    return {
      title: `Captured: ${word}`,
      summary: `Ticha can identify the object, explain it simply, and create vocabulary in ${language}.`,
      vocabulary: [
        {
          id: "capture-gelato",
          word,
          emoji: "🍨",
          partOfSpeech: "noun",
          pronunciation: "/dʒəˈlɑː.toʊ/",
          definition: "A smooth frozen dessert that is similar to ice cream.",
          example: "The child enjoyed a small cup of gelato after dinner.",
          difficulty: "Starter",
          associations: ["dessert", "cold", "flavour"],
          synonyms: ["ice cream"],
          antonyms: [],
          translation: language === "English" ? word.toLowerCase() : `${word} (${language})`,
          reviewStatus: "new",
          studiedCount: 0
        }
      ]
    };
  },

  async generateRadio({ categoryId, topic, language }) {
    const title = topic ? `Ticha Radio: ${topic}` : "Ticha Radio";
    return {
      categoryId,
      title,
      durationSeconds: 90,
      script: `Welcome to Ticha Radio. Today we explore ${topic || categoryId} in clear, child-safe English, with a short word focus and one fun fact in ${language}.`
    };
  },

  async answerKnowledge({ question, language }) {
    return {
      answer: `Here is a simple way to understand it: ${question}. Ticha breaks the idea into meaning, example, and one follow-up question. Language support: ${language}.`
    };
  }
};
