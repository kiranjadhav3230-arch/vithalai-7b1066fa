-- Drop existing restrictive policies on room_members
DROP POLICY IF EXISTS "Anyone can delete room members" ON room_members;

-- Add policy allowing room creators to update member roles
CREATE POLICY "Room creators can update member roles"
ON room_members
FOR UPDATE
USING (
  room_id IN (
    SELECT id FROM study_rooms WHERE created_by = auth.uid()
  )
);

-- Add policy allowing room creators to remove members
CREATE POLICY "Room creators can remove members"
ON room_members
FOR DELETE
USING (
  room_id IN (
    SELECT id FROM study_rooms WHERE created_by = auth.uid()
  )
);