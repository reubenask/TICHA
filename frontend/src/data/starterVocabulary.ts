import type { VocabularyWord } from "../domain/types";

export const starterVocabulary: VocabularyWord[] = [
  {
    id: "elephant",
    word: "Elephant",
    emoji: "🐘",
    partOfSpeech: "noun",
    pronunciation: "/el-uh-fuhnt/",
    definition: "A very large grey animal with big ears and a long trunk.",
    example: "The elephant sprayed water with its trunk.",
    difficulty: "Starter",
    associations: ["long trunk", "large animal", "gentle giant"],
    synonyms: ["large animal"],
    antonyms: [],
    translation: "elephant",
    reviewStatus: "new",
    studiedCount: 0
  },
  {
    id: "curious",
    word: "Curious",
    emoji: "🔎",
    partOfSpeech: "adjective",
    pronunciation: "/kyoor-ee-us/",
    definition: "Wanting to know, learn, or discover more about something.",
    example: "The curious learner asked a thoughtful question.",
    difficulty: "Starter",
    associations: ["questions", "learning", "discovery"],
    synonyms: ["interested", "inquisitive"],
    antonyms: ["uninterested"],
    translation: "curious",
    reviewStatus: "new",
    studiedCount: 0
  },
  {
    id: "enormous",
    word: "Enormous",
    emoji: "🌍",
    partOfSpeech: "adjective",
    pronunciation: "/ih-nor-mus/",
    definition: "Very, very large.",
    example: "The enormous tree gave shade to the whole garden.",
    difficulty: "Growing",
    associations: ["big", "huge", "giant"],
    synonyms: ["huge", "massive"],
    antonyms: ["tiny", "small"],
    translation: "enormous",
    reviewStatus: "new",
    studiedCount: 0
  },
  {
    id: "observe",
    word: "Observe",
    emoji: "👁️",
    partOfSpeech: "verb",
    pronunciation: "/ub-zurv/",
    definition: "To look carefully and notice details.",
    example: "Scientists observe plants as they grow.",
    difficulty: "Growing",
    associations: ["notice", "watch", "details"],
    synonyms: ["watch", "study"],
    antonyms: ["ignore"],
    translation: "observe",
    reviewStatus: "new",
    studiedCount: 0
  }
];
