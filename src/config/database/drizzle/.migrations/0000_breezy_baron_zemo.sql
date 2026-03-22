CREATE SCHEMA "auth";

CREATE TYPE "auth"."token_type_enum" AS ENUM('PASSWORD_RECOVER');--> statement-breakpoint
CREATE TYPE "auth"."user_status_enum" AS ENUM('ACTIVE', 'INACTIVE');--> statement-breakpoint
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" varchar NOT NULL,
	"username" varchar NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar NOT NULL,
	"status" "auth"."user_status_enum" DEFAULT 'ACTIVE' NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone,
	CONSTRAINT "pk_users_id" PRIMARY KEY("id"),
	CONSTRAINT "uk_users_email" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth"."tokens" (
	"id" varchar NOT NULL,
	"user_id" varchar NOT NULL,
	"token_type" "auth"."token_type_enum" DEFAULT 'PASSWORD_RECOVER' NOT NULL,
	"code" integer NOT NULL,
	"expiresIn" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "pk_tokens_id" PRIMARY KEY("id")
);
--> statement-breakpoint
ALTER TABLE "auth"."tokens" ADD CONSTRAINT "fk_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;