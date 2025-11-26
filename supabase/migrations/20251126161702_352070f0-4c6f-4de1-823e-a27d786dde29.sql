-- Make all rooms invite-code based (no public rooms)
-- Step 1: Generate invite codes for existing rooms that don't have one

UPDATE study_rooms
SET invite_code = upper(substring(md5(random()::text || clock_timestamp()::text || id::text) from 1 for 8))
WHERE invite_code IS NULL;

-- Step 2: Update RLS policies so rooms are only viewable by members

-- Drop existing SELECT policies on study_rooms
DROP POLICY IF EXISTS "Public rooms are viewable by everyone" ON study_rooms;
DROP POLICY IF EXISTS "Private rooms are viewable by members" ON study_rooms;

-- Create new policy: Only room members can view rooms
CREATE POLICY "Rooms are viewable by members only"
ON study_rooms
FOR SELECT
USING (
  id IN (
    SELECT room_id 
    FROM room_members 
    WHERE user_id = auth.uid()
  )
);

-- Step 3: Make invite_code required
ALTER TABLE study_rooms 
ALTER COLUMN invite_code SET NOT NULL;

-- Step 4: Add a trigger to auto-generate invite codes for all new rooms
CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.invite_code IS NULL THEN
    NEW.invite_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS generate_room_invite_code ON public.study_rooms;

CREATE TRIGGER generate_room_invite_code
  BEFORE INSERT ON public.study_rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_invite_code();