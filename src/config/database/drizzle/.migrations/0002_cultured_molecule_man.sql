CREATE SCHEMA "url_shortener";
--> statement-breakpoint
CREATE TABLE "url_shortener"."short_links" (
	"id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"description" text,
	"original_url" text NOT NULL,
	"short_url" text NOT NULL,
	"click_count" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "pk_short_links_id" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "url_shortener"."short_links" ADD CONSTRAINT "fk_short_links_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;