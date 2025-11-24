-- Add tags and gist_url columns to code_snippets table
ALTER TABLE code_snippets 
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS gist_url text;

-- Create index for better search performance on tags
CREATE INDEX IF NOT EXISTS idx_code_snippets_tags ON code_snippets USING GIN(tags);

-- Create index for user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_code_snippets_user_id ON code_snippets(user_id);