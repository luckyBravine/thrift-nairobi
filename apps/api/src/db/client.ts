import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/schema";
import { AppError } from "../errors/AppError";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new AppError(400, "DATABASE_URL is not set");
}

// Neon pooled = transaction mode → prepare: false
const client = postgres(connectionString, { prepare: false, max: 10 });
export const db = drizzle(client, { schema });
export type Db = typeof db;