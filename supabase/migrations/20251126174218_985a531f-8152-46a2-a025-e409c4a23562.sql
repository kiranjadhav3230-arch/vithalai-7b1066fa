-- Create a function to lookup room by invite code (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_room_by_invite_code(_invite_code text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id
  FROM study_rooms
  WHERE invite_code = upper(_invite_code)
  LIMIT 1;
$$;