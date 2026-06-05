import { env } from "../config/env.js";
import { FileStore } from "./fileStore.js";
import { PostgresStore } from "./postgresStore.js";

export const store = env.DATABASE_PROVIDER === "postgres"
  ? new PostgresStore(env.DATABASE_URL!)
  : new FileStore(env.TICHA_DATA_FILE);
