import type { RadioCategory } from "../domain/types";

export const radioCategories: RadioCategory[] = [
  {
    id: "audiobooks",
    title: "Audiobooks",
    subtitle: "Short AI-created stories and bedtime reading practice.",
    cadence: "Daily",
    sampleScript: "Tonight's story is about a young explorer who learns that careful listening can solve a mystery."
  },
  {
    id: "podcasts",
    title: "Podcasts",
    subtitle: "History, nature, fashion, science facts, and general knowledge.",
    cadence: "Daily",
    sampleScript: "Today we explore how bees communicate and why their work matters to gardens and farms."
  },
  {
    id: "kids-music",
    title: "Kids Music",
    subtitle: "Funny weekly songs, rhymes, and vocabulary practice.",
    cadence: "Weekly",
    sampleScript: "This week's song teaches action verbs with a bright call-and-response rhythm."
  },
  {
    id: "daily-brief",
    title: "Daily Brief",
    subtitle: "Original child-safe news narration.",
    cadence: "Daily",
    sampleScript: "Around the world today, students are learning how small habits can help protect nature."
  },
  {
    id: "movie-brief",
    title: "Movie Brief",
    subtitle: "Kid-friendly character discussion and story themes.",
    cadence: "Weekly",
    sampleScript: "Today we discuss what makes a brave character and how choices reveal personality."
  },
  {
    id: "breaking-bulletin",
    title: "Breaking Bulletin",
    subtitle: "Short did-you-know facts and learning alerts.",
    cadence: "On demand",
    sampleScript: "Did you know that the word ancient means from a very long time ago?"
  }
];
