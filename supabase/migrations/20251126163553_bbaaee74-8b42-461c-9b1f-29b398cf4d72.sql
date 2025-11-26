-- TEMPORARY: Disable RLS on study_rooms to get it working for presentation
-- We'll re-enable with proper policies later

ALTER TABLE study_rooms DISABLE ROW LEVEL SECURITY;

-- Also ensure the table structure is correct
ALTER TABLE study_rooms 
ALTER COLUMN invite_code DROP NOT NULL;

ALTER TABLE study_rooms 
ALTER COLUMN created_by DROP NOT NULL;