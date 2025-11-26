-- Simplify: Only use trigger for invite_code, not created_by
-- Client will send created_by directly

-- Drop the created_by trigger (not needed)
DROP TRIGGER IF EXISTS set_study_room_created_by ON study_rooms;

-- Keep only the invite code trigger
DROP TRIGGER IF EXISTS generate_room_invite_code ON study_rooms;

CREATE TRIGGER generate_room_invite_code
  BEFORE INSERT ON study_rooms
  FOR EACH ROW
  EXECUTE FUNCTION generate_invite_code();

-- Simplify RLS policy
DROP POLICY IF EXISTS "Users can create rooms" ON study_rooms;

CREATE POLICY "Users can create rooms"
ON study_rooms
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());