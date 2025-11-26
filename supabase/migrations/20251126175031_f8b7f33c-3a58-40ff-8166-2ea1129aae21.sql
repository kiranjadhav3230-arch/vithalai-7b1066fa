-- Remove restrictive INSERT policy for study_rooms
DROP POLICY IF EXISTS "Anyone authenticated can create rooms" ON study_rooms;

-- Allow anyone authenticated to create rooms without any restrictions
CREATE POLICY "Anyone can create rooms freely"
ON study_rooms
FOR INSERT
TO authenticated
WITH CHECK (true);