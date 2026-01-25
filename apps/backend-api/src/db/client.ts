import { createDb, createMastraStore } from '@hq/database';
import { envConfig } from 'src/config/env';

export const db = createDb(envConfig().DATABASE_URL);
export const mastraStore = createMastraStore(
  'finance-agent-hq-backend-api',
  envConfig().DATABASE_URL,
);
