-- Add image_data field to room_messages for image attachments
ALTER TABLE room_messages ADD COLUMN image_data TEXT;

-- Add sender_name field to room_messages for displaying names
ALTER TABLE room_messages ADD COLUMN sender_name TEXT;