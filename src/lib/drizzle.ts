import postgres from "postgres";
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";

export const query_client = postgres(import.meta.env.DATABASE_URL)
export const migration_client = postgres(import.meta.env.DATABASE_URL, { max: 1 });

export const db : PostgresJsDatabase = drizzle(query_client);
