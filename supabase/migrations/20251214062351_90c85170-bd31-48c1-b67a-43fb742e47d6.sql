-- Add last_seen_message_id column to room_members table
ALTER TABLE public.room_members
ADD COLUMN last_seen_message_id uuid REFERENCES public.room_messages(id) ON DELETE SET NULL;

-- Add index for faster lookups
CREATE INDEX idx_room_members_last_seen ON public.room_members(room_id, last_seen_message_id);

-- Create function to get unread message count for a user in a room
CREATE OR REPLACE FUNCTION public.get_unread_message_count(_room_id uuid, _user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::integer
  FROM room_messages rm
  WHERE rm.room_id = _room_id
    AND rm.created_at > COALESCE(
      (SELECT rm2.created_at 
       FROM room_messages rm2 
       WHERE rm2.id = (
         SELECT last_seen_message_id 
         FROM room_members 
         WHERE room_id = _room_id AND user_id = _user_id
       )),
      (SELECT joined_at FROM room_members WHERE room_id = _room_id AND user_id = _user_id)
    )
$$;