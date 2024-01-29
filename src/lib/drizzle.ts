import postgres from "postgres";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/postgres-js";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";

export const query_client = postgres(import.meta.env.DATABASE_URL)
export const migration_client = postgres(import.meta.env.DATABASE_URL, { max: 1 });

export const db = drizzle(query_client, { schema });

export const adapter = new DrizzlePostgreSQLAdapter(db, schema.session, schema.user);
