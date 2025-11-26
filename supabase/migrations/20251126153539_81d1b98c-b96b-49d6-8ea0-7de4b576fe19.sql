-- Fix RLS policy for creating study rooms (public and private)

-- Drop existing policy
DROP POLICY IF EXISTS "Users can create rooms" ON study_rooms;

-- Recreate with correct logic allowing both public and private rooms
CREATE POLICY "Users can create rooms" 
ON study_rooms 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);