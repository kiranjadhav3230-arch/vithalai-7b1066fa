-- Enable RLS with minimal security: only members can view rooms they joined
ALTER TABLE study_rooms ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can create rooms" ON study_rooms;
DROP POLICY IF EXISTS "Room creators can update their rooms" ON study_rooms;
DROP POLICY IF EXISTS "Room creators can delete their rooms" ON study_rooms;
DROP POLICY IF EXISTS "Rooms are viewable by members only" ON study_rooms;

-- Allow anyone authenticated to create rooms (no restriction)
CREATE POLICY "Anyone can create rooms"
ON study_rooms
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow anyone to update rooms (no restriction)
CREATE POLICY "Anyone can update rooms"
ON study_rooms
FOR UPDATE
TO authenticated
USING (true);

-- Allow anyone to delete rooms (no restriction)
CREATE POLICY "Anyone can delete rooms"
ON study_rooms
FOR DELETE
TO authenticated
USING (true);

-- ONLY RESTRICTION: Only members can view rooms they joined
CREATE POLICY "Only members can view their rooms"
ON study_rooms
FOR SELECT
TO authenticated
USING (
  id IN (
    SELECT room_id 
    FROM room_members 
    WHERE user_id = auth.uid()
  )
);