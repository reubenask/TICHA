import { beforeEach, describe, expect, it } from "vitest";
import { mockTichaApi } from "../services/apiClient";

describe("mockTichaApi", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("creates a local prototype learner account", async () => {
    const profile = await mockTichaApi.signUp({
      name: "Reuben",
      email: "reuben@example.com",
      password: "Prototype123!",
      nativeLanguage: "English",
      level: "grade-1-3"
    });

    expect(profile.name).toBe("Reuben");
    expect(profile.id).toBe("TICHA-REUBEN");
    await expect(mockTichaApi.signIn({ email: "reuben@example.com", password: "Prototype123!" })).resolves.toEqual(profile);
  });

  it("keeps a starter vocabulary deck available before APIs are connected", async () => {
    const deck = await mockTichaApi.getVocabularyDeck();
    expect(deck.length).toBeGreaterThanOrEqual(4);
    expect(deck[0]).toEqual(expect.objectContaining({ word: expect.any(String), definition: expect.any(String) }));
  });

  it("updates vocabulary review progress", async () => {
    const [first] = await mockTichaApi.getVocabularyDeck();
    await mockTichaApi.updateVocabularyReview(first.id, "known");

    const progress = await mockTichaApi.getProgress();
    expect(progress.knownWords).toBe(1);
    expect(progress.sessions).toBe(1);
  });
});
