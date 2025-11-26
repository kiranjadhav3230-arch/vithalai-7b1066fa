-- Completely disable RLS on study_rooms to allow room creation
ALTER TABLE study_rooms DISABLE ROW LEVEL SECURITY;

-- Also ensure room_members doesn't block
-- Keep only the essential policies
DROP POLICY IF EXISTS "Users can join any room" ON room_members;
DROP POLICY IF EXISTS "Users can view room members where they are members" ON room_members;
DROP POLICY IF EXISTS "Users can leave their own membership" ON room_members;

-- Simple policies for room_members
CREATE POLICY "Anyone can insert room members"
ON room_members
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view room members"
ON room_members
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Anyone can delete room members"
ON room_members
FOR DELETE
TO authenticated
USING (true);