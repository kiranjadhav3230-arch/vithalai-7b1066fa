-- Add reactions column to room_messages table
ALTER TABLE room_messages ADD COLUMN IF NOT EXISTS reactions jsonb DEFAULT '[]'::jsonb;

-- Create a table to track individual reactions
CREATE TABLE IF NOT EXISTS room_message_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES room_messages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  reaction_type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, reaction_type)
);

-- Enable RLS on room_message_reactions
ALTER TABLE room_message_reactions ENABLE ROW LEVEL SECURITY;

-- Allow room members to add reactions
CREATE POLICY "Room members can add reactions"
ON room_message_reactions
FOR INSERT
WITH CHECK (
  message_id IN (
    SELECT id FROM room_messages 
    WHERE room_id IN (
      SELECT room_id FROM room_members WHERE user_id = auth.uid()
    )
  )
);

-- Allow room members to view reactions
CREATE POLICY "Room members can view reactions"
ON room_message_reactions
FOR SELECT
USING (
  message_id IN (
    SELECT id FROM room_messages 
    WHERE room_id IN (
      SELECT room_id FROM room_members WHERE user_id = auth.uid()
    )
  )
);

-- Allow users to delete their own reactions
CREATE POLICY "Users can delete their own reactions"
ON room_message_reactions
FOR DELETE
USING (auth.uid() = user_id);