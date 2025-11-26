-- Ensure triggers are properly created for study_rooms

-- First, verify the functions exist
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_invite_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.invite_code IS NULL THEN
    NEW.invite_code := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
  END IF;
  RETURN NEW;
END;
$$;

-- Drop triggers if they exist
DROP TRIGGER IF EXISTS set_study_room_created_by ON study_rooms;
DROP TRIGGER IF EXISTS generate_room_invite_code ON study_rooms;

-- Create triggers with proper order
CREATE TRIGGER set_study_room_created_by
  BEFORE INSERT ON study_rooms
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

CREATE TRIGGER generate_room_invite_code
  BEFORE INSERT ON study_rooms
  FOR EACH ROW
  EXECUTE FUNCTION generate_invite_code();

-- Update RLS policy to be more permissive during insert (trigger handles validation)
DROP POLICY IF EXISTS "Users can create rooms" ON study_rooms;

CREATE POLICY "Users can create rooms"
ON study_rooms
FOR INSERT
TO authenticated
WITH CHECK (
  (created_by = auth.uid()) OR (created_by IS NULL)
);