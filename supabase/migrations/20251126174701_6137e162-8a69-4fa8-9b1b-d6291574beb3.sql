-- Drop existing problematic policies on room_members
DROP POLICY IF EXISTS "Users can join rooms with invite code" ON room_members;
DROP POLICY IF EXISTS "Members can view room members" ON room_members;
DROP POLICY IF EXISTS "Users can leave rooms" ON room_members;

-- Create security definer function to check membership (avoids recursion)
CREATE OR REPLACE FUNCTION public.check_room_membership(_user_id uuid, _room_id uuid)
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
  );
$$;

-- New policies for room_members using the security definer function
CREATE POLICY "Users can join any room"
ON room_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view room members where they are members"
ON room_members
FOR SELECT
TO authenticated
USING (check_room_membership(auth.uid(), room_id));

CREATE POLICY "Users can leave their own membership"
ON room_members
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Update study_rooms SELECT policy to use the security definer function
DROP POLICY IF EXISTS "Only members can view rooms" ON study_rooms;

CREATE POLICY "Members can view their rooms"
ON study_rooms
FOR SELECT
TO authenticated
USING (check_room_membership(auth.uid(), id));