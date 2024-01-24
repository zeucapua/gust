CREATE TABLE IF NOT EXISTS "project" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
ALTER TABLE "entry" ADD COLUMN "project_id" serial NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "entry" ADD CONSTRAINT "entry_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "project" ADD CONSTRAINT "project_user_id_auth_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
