-- Fix room_members INSERT policy to allow room creators to join their own rooms

-- Drop the problematic policy
DROP POLICY IF EXISTS "Users can join public rooms" ON room_members;

-- Create security definer function to check if user is room creator
CREATE OR REPLACE FUNCTION public.is_room_creator(_user_id uuid, _room_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM study_rooms
    WHERE id = _room_id
      AND created_by = _user_id
  )
$$;

-- Recreate policy allowing users to join public rooms OR their own rooms
CREATE POLICY "Users can join public rooms or their own rooms" 
ON room_members 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND (
    public.is_public_room(room_id) 
    OR public.is_room_creator(auth.uid(), room_id)
    OR public.is_room_member(auth.uid(), room_id)
  )
);