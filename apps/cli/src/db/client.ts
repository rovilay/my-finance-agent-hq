import { createDb, createMastraStore, createPgVectorStore } from '@hq/database';
import { dbEnv } from '@hq/config';

export const db = createDb(dbEnv.DATABASE_URL!);
export const mastraStore = createMastraStore('finance-agent-cli', dbEnv.DATABASE_URL!);
export const vectorStore = createPgVectorStore('finance-agent-vectors', dbEnv.DATABASE_URL!);
