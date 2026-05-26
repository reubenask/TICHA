import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import type { UserRecord, VocabularyWord } from "../types/domain.js";

export interface TichaDatabase {
  users: UserRecord[];
  vocabulary: VocabularyWord[];
}

const emptyDb: TichaDatabase = {
  users: [],
  vocabulary: []
};

export class FileStore {
  private readonly path: string;

  constructor(path: string) {
    this.path = resolve(path);
  }

  async read(): Promise<TichaDatabase> {
    try {
      const raw = await readFile(this.path, "utf8");
      return { ...emptyDb, ...(JSON.parse(raw) as Partial<TichaDatabase>) };
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code === "ENOENT") return { ...emptyDb };
      throw error;
    }
  }

  async write(db: TichaDatabase): Promise<TichaDatabase> {
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(this.path, JSON.stringify(db, null, 2));
    return db;
  }

  async transaction<T>(mutate: (db: TichaDatabase) => T | Promise<T>): Promise<T> {
    const db = await this.read();
    const result = await mutate(db);
    await this.write(db);
    return result;
  }
}
