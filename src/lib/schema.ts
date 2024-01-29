import { pgTable, integer, bigint, text, varchar, serial, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("auth_user", {
	id: text("id").primaryKey(),
  google_id: text("google_id").unique(),

	// other user attributes
  username: varchar("username")
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => user.id),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull()
});

export const entry = pgTable("entry", {
  id: serial("id").primaryKey(),
  description: varchar("description", { length: 100 }),
  start_time: timestamp("start_time").defaultNow(),
  end_time: timestamp("end_time"),
  duration: bigint("duration", { mode: "number" }).default(0),
  billable_rate: bigint("billable_rate", { mode: "number" }).default(0),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  projectId: integer("project_id")
    .references(() => project.id, { onDelete: "set null" })
});

export const project = pgTable("project", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
});
