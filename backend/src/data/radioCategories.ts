import type { RadioCategory } from "../types/domain.js";

export const radioCategories: RadioCategory[] = [
  {
    id: "audiobooks",
    title: "Audiobooks",
    subtitle: "Original short stories, bedtime stories, and reading practice.",
    cadence: "Daily",
    sampleScript: "Tonight, a tiny explorer follows the moonlight and learns three new words."
  },
  {
    id: "podcasts",
    title: "Podcasts",
    subtitle: "History, nature, fashion, science facts, and general knowledge.",
    cadence: "Daily",
    sampleScript: "Today we discover why coral reefs are sometimes called cities under the sea."
  },
  {
    id: "kids-music",
    title: "Kids Music",
    subtitle: "Funny weekly songs, rhymes, and vocabulary songs.",
    cadence: "Weekly",
    sampleScript: "A playful rhyme about curious, enormous, observe, and remember."
  },
  {
    id: "daily-brief",
    title: "Daily Brief",
    subtitle: "Original child-safe world news and learning moments.",
    cadence: "Daily",
    sampleScript: "Good morning. Here are three calm stories from science, nature, and culture."
  },
  {
    id: "movie-brief",
    title: "Movie Brief",
    subtitle: "Kid-safe character, story, and theme discussions.",
    cadence: "Weekly",
    sampleScript: "Let us talk about brave characters, kind choices, and the words that describe them."
  },
  {
    id: "breaking-bulletin",
    title: "Breaking Bulletin",
    subtitle: "Short did-you-know notifications for curious learners.",
    cadence: "Anytime",
    sampleScript: "Did you know that some trees can communicate through underground root networks?"
  }
];
