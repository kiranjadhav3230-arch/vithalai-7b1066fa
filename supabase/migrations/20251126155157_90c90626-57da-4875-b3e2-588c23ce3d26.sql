-- Recreate the trigger that sets created_by automatically
-- First ensure the function exists
CREATE OR REPLACE FUNCTION public.set_created_by()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set created_by to the authenticated user
  IF NEW.created_by IS NULL THEN
    NEW.created_by := auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate it
DROP TRIGGER IF EXISTS set_study_room_created_by ON public.study_rooms;

CREATE TRIGGER set_study_room_created_by
  BEFORE INSERT ON public.study_rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.set_created_by();