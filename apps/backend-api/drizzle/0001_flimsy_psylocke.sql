CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"entity_id" uuid NOT NULL,
	"file_name" text NOT NULL,
	"file_metadata" jsonb NOT NULL,
	"storage_path" text,
	"kms_key_id" text,
	"wrapped_dek" text,
	"status" "document_status" DEFAULT 'uploaded' NOT NULL,
	"retention_policy" "retention_policy" DEFAULT 'verify_and_purge' NOT NULL,
	"extracted_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"purged_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_entity_id_fiscal_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."fiscal_entities"("id") ON DELETE cascade ON UPDATE no action;