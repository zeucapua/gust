import { pgTable, integer, bigint, varchar, serial, timestamp } from "drizzle-orm/pg-core";

export const user = pgTable("auth_user", {
	id: varchar("id", {
		length: 15 // change this when using custom user ids
	}).primaryKey(),

	// other user attributes
  username: varchar("username")
});

export const entry = pgTable("entry", {
  id: serial("id").primaryKey(),
  description: varchar("description", { length: 100 }),
  start_time: timestamp("start_time").defaultNow(),
  end_time: timestamp("end_time"),
  duration: bigint("duration", { mode: "number" }).default(0),
  billable_rate: bigint("billable_rate", { mode: "number" }).default(0),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  projectId: integer("project_id")
    .references(() => project.id, { onDelete: "set null" })
});

export const project = pgTable("project", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  userId: varchar("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
});

export const session = pgTable("user_session", {
	id: varchar("id", {
		length: 128
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id),
	activeExpires: bigint("active_expires", {
		mode: "number"
	}).notNull(),
	idleExpires: bigint("idle_expires", {
		mode: "number"
	}).notNull()
});

export const key = pgTable("user_key", {
	id: varchar("id", {
		length: 255
	}).primaryKey(),
	userId: varchar("user_id", {
		length: 15
	})
		.notNull()
		.references(() => user.id),
	hashedPassword: varchar("hashed_password", {
		length: 255
	})
});
