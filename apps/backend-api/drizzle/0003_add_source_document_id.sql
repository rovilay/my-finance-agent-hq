ALTER TABLE "financial_entries"
  ADD COLUMN IF NOT EXISTS "source_document_id" uuid REFERENCES "documents"("id");
