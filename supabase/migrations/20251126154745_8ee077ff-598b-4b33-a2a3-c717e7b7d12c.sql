-- Fix RLS policy to properly validate created_by after trigger sets it

DROP POLICY IF EXISTS "Users can create rooms" ON study_rooms;

CREATE POLICY "Users can create rooms"
ON study_rooms
FOR INSERT
WITH CHECK (created_by = auth.uid());