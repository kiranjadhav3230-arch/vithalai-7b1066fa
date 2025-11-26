-- Re-enable RLS and set up proper security for study rooms
-- Drop all existing policies first
DROP POLICY IF EXISTS "Users can create rooms" ON study_rooms;
DROP POLICY IF EXISTS "Only members can view their rooms" ON study_rooms;
DROP POLICY IF EXISTS "Anyone can delete rooms" ON study_rooms;
DROP POLICY IF EXISTS "Anyone can update rooms" ON study_rooms;

-- Re-enable RLS on study_rooms
ALTER TABLE study_rooms ENABLE ROW LEVEL SECURITY;

-- Policy 1: Any authenticated user can create a room
CREATE POLICY "Anyone authenticated can create rooms"
ON study_rooms
FOR INSERT
TO authenticated
WITH CHECK (created_by = auth.uid());

-- Policy 2: Only members can view rooms (must have joined with invite code)
CREATE POLICY "Only members can view rooms"
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

-- Policy 3: Only creator can delete their room
CREATE POLICY "Only creator can delete room"
ON study_rooms
FOR DELETE
TO authenticated
USING (created_by = auth.uid());

-- Policy 4: Only creator can update their room
CREATE POLICY "Only creator can update room"
ON study_rooms
FOR UPDATE
TO authenticated
USING (created_by = auth.uid());

-- Ensure room_members policies are correct
DROP POLICY IF EXISTS "Users can join public rooms or their own rooms" ON room_members;
DROP POLICY IF EXISTS "Room members are viewable by room members" ON room_members;
DROP POLICY IF EXISTS "Users can leave rooms" ON room_members;

-- Policy: Users can join any room (they need the invite code to know the room_id)
CREATE POLICY "Users can join rooms with invite code"
ON room_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy: Users can see members of rooms they've joined
CREATE POLICY "Members can view room members"
ON room_members
FOR SELECT
TO authenticated
USING (
  room_id IN (
    SELECT room_id 
    FROM room_members 
    WHERE user_id = auth.uid()
  )
);

-- Policy: Users can leave rooms they've joined
CREATE POLICY "Users can leave rooms"
ON room_members
FOR DELETE
TO authenticated
USING (user_id = auth.uid());