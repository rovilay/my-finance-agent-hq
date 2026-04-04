-- Add failure_reason column to documents table
ALTER TABLE "documents" ADD COLUMN IF NOT EXISTS "failure_reason" text;
