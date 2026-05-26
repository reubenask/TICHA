import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

let dataDir = "";

async function freshApp() {
  vi.resetModules();
  process.env.NODE_ENV = "test";
  process.env.JWT_SECRET = "test-secret";
  process.env.AI_PROVIDER = "mock";
  process.env.TICHA_DATA_FILE = join(dataDir, "db.json");
  const { createApp } = await import("../src/app.js");
  return createApp();
}

describe("Ticha backend API", () => {
  beforeEach(async () => {
    dataDir = await mkdtemp(join(tmpdir(), "ticha-api-"));
  });

  afterEach(async () => {
    await rm(dataDir, { recursive: true, force: true });
  });

  it("creates an account and returns a starter deck", async () => {
    const app = await freshApp();
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Reuben",
        email: "reuben@example.com",
        password: "Prototype123!",
        nativeLanguage: "English",
        level: "grade-1-3"
      })
      .expect(201);

    expect(signup.body.user.name).toBe("Reuben");
    expect(signup.body.token).toEqual(expect.any(String));

    const deck = await request(app)
      .get("/api/vocabulary")
      .set("authorization", `Bearer ${signup.body.token}`)
      .expect(200);

    expect(deck.body.vocabulary.length).toBeGreaterThan(0);
  });

  it("reviews a word and updates progress", async () => {
    const app = await freshApp();
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Learner",
        email: "learner@example.com",
        password: "Prototype123!",
        nativeLanguage: "English",
        level: "grade-1-3"
      });

    const token = signup.body.token;
    const deck = await request(app).get("/api/vocabulary").set("authorization", `Bearer ${token}`);
    const wordId = deck.body.vocabulary[0].id;

    await request(app)
      .patch(`/api/vocabulary/${wordId}/review`)
      .set("authorization", `Bearer ${token}`)
      .send({ status: "known" })
      .expect(200);

    const progress = await request(app).get("/api/progress").set("authorization", `Bearer ${token}`).expect(200);
    expect(progress.body.progress.knownWords).toBe(1);
    expect(progress.body.progress.sessions).toBe(1);
  });

  it("generates mock word maps, capture analysis, and radio content", async () => {
    const app = await freshApp();
    const signup = await request(app)
      .post("/api/auth/signup")
      .send({
        name: "Afi",
        email: "afi@example.com",
        password: "Prototype123!",
        nativeLanguage: "Ewe",
        level: "hobbyist"
      });

    const token = signup.body.token;
    const deck = await request(app).get("/api/vocabulary").set("authorization", `Bearer ${token}`);
    const wordId = deck.body.vocabulary[0].id;

    const wordMap = await request(app).get(`/api/vocabulary/${wordId}/word-map`).set("authorization", `Bearer ${token}`).expect(200);
    expect(wordMap.body.word.translation).toContain("Ewe");

    const capture = await request(app)
      .post("/api/capture/analyze")
      .set("authorization", `Bearer ${token}`)
      .send({ prompt: "Gelato" })
      .expect(200);
    expect(capture.body.analysis.vocabulary[0].word).toBe("Gelato");

    const radio = await request(app)
      .post("/api/radio/generate")
      .set("authorization", `Bearer ${token}`)
      .send({ categoryId: "daily-brief", topic: "nature" })
      .expect(200);
    expect(radio.body.radio.script).toContain("Ticha Radio");
  });
});
