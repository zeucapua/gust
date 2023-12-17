ALTER TABLE "entry" ADD COLUMN "start_time" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "entry" ADD COLUMN "end_time" timestamp;