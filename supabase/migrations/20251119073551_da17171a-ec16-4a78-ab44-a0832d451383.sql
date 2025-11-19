-- Add document_text column to store full document content for Q&A
ALTER TABLE documents ADD COLUMN IF NOT EXISTS document_text TEXT;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id_status ON documents(user_id, analysis_status);