-- Fix study rooms RLS for insert
-- The issue is the trigger isn't working, so let's ensure the policy validates what client sends

-- Drop and recreate the INSERT policy to be explicit
DROP POLICY IF EXISTS "Users can create rooms" ON study_rooms;

CREATE POLICY "Users can create rooms"
ON study_rooms
FOR INSERT
TO authenticated
WITH CHECK (
  created_by = auth.uid()
);

-- Also ensure the trigger is properly created
DROP TRIGGER IF EXISTS generate_room_invite_code ON study_rooms;
DROP TRIGGER IF EXISTS set_study_room_created_by ON study_rooms;

-- Recreate the invite code trigger
CREATE TRIGGER generate_room_invite_code
  BEFORE INSERT ON study_rooms
  FOR EACH ROW
  EXECUTE FUNCTION generate_invite_code();

-- Recreate the created_by trigger  
CREATE TRIGGER set_study_room_created_by
  BEFORE INSERT ON study_rooms
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();