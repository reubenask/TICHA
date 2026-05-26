import { env } from "../config/env.js";
import { FileStore } from "./fileStore.js";

export const store = new FileStore(env.TICHA_DATA_FILE);
