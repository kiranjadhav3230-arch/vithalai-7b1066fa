-- Complete fix for study rooms creation

-- 1. Make invite_code have a default value as backup
ALTER TABLE study_rooms 
ALTER COLUMN invite_code SET DEFAULT upper(substring(md5(random()::text) from 1 for 8));

-- 2. Recreate the trigger properly
DROP TRIGGER IF EXISTS generate_room_invite_code ON study_rooms;

CREATE TRIGGER generate_room_invite_code
  BEFORE INSERT ON study_rooms
  FOR EACH ROW
  WHEN (NEW.invite_code IS NULL)
  EXECUTE FUNCTION generate_invite_code();

-- 3. Ensure RLS policy is correct
DROP POLICY IF EXISTS "Users can create rooms" ON study_rooms;

CREATE POLICY "Users can create rooms"
ON study_rooms
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());