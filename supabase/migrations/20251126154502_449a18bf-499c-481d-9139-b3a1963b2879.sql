-- Fix study_rooms RLS by auto-setting created_by from auth context

-- Create trigger function to set created_by automatically
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.created_by := auth.uid();
  RETURN NEW;
END;
$$;

-- Create trigger to run before insert
DROP TRIGGER IF EXISTS set_study_room_created_by ON study_rooms;
CREATE TRIGGER set_study_room_created_by
  BEFORE INSERT ON study_rooms
  FOR EACH ROW
  EXECUTE FUNCTION set_created_by();

-- Update RLS policy to just check authentication
DROP POLICY IF EXISTS "Users can create rooms" ON study_rooms;
CREATE POLICY "Users can create rooms"
ON study_rooms
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);