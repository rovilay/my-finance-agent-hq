import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { PostgresStore } from '@mastra/pg';
import pg from 'pg';
import * as schema from './schema';

export const createDb = (connectionString: string) => {
  const pool = new pg.Pool({ connectionString });
  return drizzle(pool, { schema });
};

export const createMastraStore = (id: string, connectionString: string) => {
  return new PostgresStore({ id, connectionString });
};

export type DatabaseClient = NodePgDatabase<typeof schema>;
export type MastraStore = PostgresStore;

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION' as const;
