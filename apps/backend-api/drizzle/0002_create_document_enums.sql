-- Create enum types for documents table
DO $$ BEGIN
  CREATE TYPE document_status AS ENUM ('uploaded', 'processed', 'verified', 'purged', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE retention_policy AS ENUM ('permanent', 'verify_and_purge', 'ephemeral');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
