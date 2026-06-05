import pg from "pg";
import type { PasswordResetToken, UserRecord, VocabularyWord } from "../types/domain.js";
import type { TichaDatabase } from "./fileStore.js";

const { Pool } = pg;

interface UserRow {
  id: string;
  name: string;
  email: string;
  level: UserRecord["level"];
  native_language: UserRecord["nativeLanguage"];
  photo_url: string | null;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

interface VocabularyRow {
  id: string;
  user_id: string | null;
  word: string;
  emoji: string;
  part_of_speech: string;
  pronunciation: string;
  definition: string;
  example: string;
  difficulty: VocabularyWord["difficulty"];
  associations: string[];
  synonyms: string[];
  antonyms: string[];
  translation: string;
  review_status: VocabularyWord["reviewStatus"];
  studied_count: number;
  created_at: string | null;
  updated_at: string | null;
}

interface PasswordResetTokenRow {
  token: string;
  user_id: string;
  expires_at: string;
  created_at: string;
}

function userFromRow(row: UserRow): UserRecord {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    level: row.level,
    nativeLanguage: row.native_language,
    photoUrl: row.photo_url || undefined,
    passwordHash: row.password_hash,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

function wordFromRow(row: VocabularyRow): VocabularyWord {
  return {
    id: row.id,
    userId: row.user_id || undefined,
    word: row.word,
    emoji: row.emoji,
    partOfSpeech: row.part_of_speech,
    pronunciation: row.pronunciation,
    definition: row.definition,
    example: row.example,
    difficulty: row.difficulty,
    associations: row.associations || [],
    synonyms: row.synonyms || [],
    antonyms: row.antonyms || [],
    translation: row.translation,
    reviewStatus: row.review_status,
    studiedCount: row.studied_count,
    createdAt: row.created_at || undefined,
    updatedAt: row.updated_at || undefined
  };
}

function tokenFromRow(row: PasswordResetTokenRow): PasswordResetToken {
  return {
    token: row.token,
    userId: row.user_id,
    expiresAt: row.expires_at,
    createdAt: row.created_at
  };
}

export class PostgresStore {
  private readonly pool: pg.Pool;
  private initialized = false;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
      ssl: connectionString.includes("sslmode=require") ? undefined : { rejectUnauthorized: false }
    });
  }

  private async init() {
    if (this.initialized) return;
    await this.pool.query(`
      create table if not exists users (
        id text primary key,
        name text not null,
        email text not null unique,
        level text not null,
        native_language text not null,
        photo_url text,
        password_hash text not null,
        created_at timestamptz not null,
        updated_at timestamptz not null
      );

      create table if not exists vocabulary_words (
        id text primary key,
        user_id text references users(id) on delete cascade,
        word text not null,
        emoji text not null,
        part_of_speech text not null,
        pronunciation text not null,
        definition text not null,
        example text not null,
        difficulty text not null,
        associations jsonb not null default '[]',
        synonyms jsonb not null default '[]',
        antonyms jsonb not null default '[]',
        translation text not null,
        review_status text not null,
        studied_count integer not null default 0,
        created_at timestamptz,
        updated_at timestamptz
      );

      create table if not exists password_reset_tokens (
        token text primary key,
        user_id text not null references users(id) on delete cascade,
        expires_at timestamptz not null,
        created_at timestamptz not null
      );
    `);
    this.initialized = true;
  }

  async read(): Promise<TichaDatabase> {
    await this.init();
    const [users, vocabulary, passwordResetTokens] = await Promise.all([
      this.pool.query<UserRow>("select * from users order by created_at asc"),
      this.pool.query<VocabularyRow>("select * from vocabulary_words order by created_at asc nulls last, word asc"),
      this.pool.query<PasswordResetTokenRow>("select * from password_reset_tokens order by created_at asc")
    ]);

    return {
      users: users.rows.map(userFromRow),
      vocabulary: vocabulary.rows.map(wordFromRow),
      passwordResetTokens: passwordResetTokens.rows.map(tokenFromRow)
    };
  }

  async write(db: TichaDatabase): Promise<TichaDatabase> {
    await this.init();
    const client = await this.pool.connect();
    try {
      await client.query("begin");
      await client.query("delete from password_reset_tokens");
      await client.query("delete from vocabulary_words");
      await client.query("delete from users");

      for (const user of db.users) {
        await client.query(
          `insert into users (id, name, email, level, native_language, photo_url, password_hash, created_at, updated_at)
           values ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
          [user.id, user.name, user.email, user.level, user.nativeLanguage, user.photoUrl || null, user.passwordHash, user.createdAt, user.updatedAt]
        );
      }

      for (const word of db.vocabulary) {
        await client.query(
          `insert into vocabulary_words (
            id, user_id, word, emoji, part_of_speech, pronunciation, definition, example, difficulty,
            associations, synonyms, antonyms, translation, review_status, studied_count, created_at, updated_at
          ) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::jsonb, $11::jsonb, $12::jsonb, $13, $14, $15, $16, $17)`,
          [
            word.id,
            word.userId || null,
            word.word,
            word.emoji,
            word.partOfSpeech,
            word.pronunciation,
            word.definition,
            word.example,
            word.difficulty,
            JSON.stringify(word.associations || []),
            JSON.stringify(word.synonyms || []),
            JSON.stringify(word.antonyms || []),
            word.translation,
            word.reviewStatus,
            word.studiedCount,
            word.createdAt || null,
            word.updatedAt || null
          ]
        );
      }

      for (const token of db.passwordResetTokens) {
        await client.query(
          `insert into password_reset_tokens (token, user_id, expires_at, created_at)
           values ($1, $2, $3, $4)`,
          [token.token, token.userId, token.expiresAt, token.createdAt]
        );
      }

      await client.query("commit");
      return db;
    } catch (error) {
      await client.query("rollback");
      throw error;
    } finally {
      client.release();
    }
  }

  async transaction<T>(mutate: (db: TichaDatabase) => T | Promise<T>): Promise<T> {
    const db = await this.read();
    const result = await mutate(db);
    await this.write(db);
    return result;
  }
}
