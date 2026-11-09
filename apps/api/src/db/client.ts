import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/schema';
import * as authSchema from './auth-schema';
import { env } from '../config/env';

const connectionString = env.DATABASE_URL;

// Neon pooled = transaction mode → prepare: false
const client = postgres(connectionString, { prepare: false, max: 10 });
export const db = drizzle(client, { schema: { ...schema, ...authSchema } });
export type Db = typeof db;

export async function closeDatabase() {
  await client.end();
}
