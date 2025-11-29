-- Add reply_to column to room_messages table
ALTER TABLE room_messages
ADD COLUMN reply_to uuid REFERENCES room_messages(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_room_messages_reply_to ON room_messages(reply_to);