-- Add session_type column to chat_sessions table to track mode
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS session_type text DEFAULT 'chat' CHECK (session_type IN ('chat', 'code', 'imageGen'));

-- Add index for better performance when filtering by session_type
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_type ON chat_sessions(session_type);

-- Update existing code sessions based on their title
UPDATE chat_sessions 
SET session_type = 'code' 
WHERE title LIKE '💻%' OR title LIKE '%Code%';