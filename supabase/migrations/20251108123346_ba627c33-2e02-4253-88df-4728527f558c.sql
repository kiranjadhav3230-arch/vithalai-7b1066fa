-- Add image_data column to chat_messages table for storing uploaded images
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS image_data TEXT;

-- Add youtube_courses column to store course suggestions
ALTER TABLE chat_messages 
ADD COLUMN IF NOT EXISTS youtube_courses JSONB;