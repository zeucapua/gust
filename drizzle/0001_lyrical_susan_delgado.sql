CREATE TABLE IF NOT EXISTS "entry" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" varchar(100),
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entry" ADD CONSTRAINT "entry_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
