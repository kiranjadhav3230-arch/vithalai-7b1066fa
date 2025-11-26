-- Fix infinite recursion in room_members RLS policies

-- Drop ALL existing policies on room_members
DROP POLICY IF EXISTS "Room members are viewable by room members" ON room_members;
DROP POLICY IF EXISTS "Users can join public rooms" ON room_members;
DROP POLICY IF EXISTS "Users can leave rooms" ON room_members;

-- Create security definer function to check if user is room member
CREATE OR REPLACE FUNCTION public.is_room_member(_user_id uuid, _room_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM room_members
    WHERE user_id = _user_id
      AND room_id = _room_id
  )
$$;

-- Create security definer function to check if room is public
CREATE OR REPLACE FUNCTION public.is_public_room(_room_id uuid)
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
      AND is_public = true
  )
$$;

-- Recreate policies using security definer functions
CREATE POLICY "Room members are viewable by room members" 
ON room_members 
FOR SELECT 
USING (public.is_room_member(auth.uid(), room_id));

CREATE POLICY "Users can join public rooms" 
ON room_members 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND (
    public.is_public_room(room_id) 
    OR public.is_room_member(auth.uid(), room_id)
  )
);

CREATE POLICY "Users can leave rooms" 
ON room_members 
FOR DELETE 
USING (auth.uid() = user_id);