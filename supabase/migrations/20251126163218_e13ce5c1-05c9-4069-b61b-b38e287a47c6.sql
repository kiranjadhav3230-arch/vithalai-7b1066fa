-- Simplest approach: Make invite_code nullable temporarily so client can send it
ALTER TABLE study_rooms 
ALTER COLUMN invite_code DROP NOT NULL;

-- Keep the default as backup
ALTER TABLE study_rooms 
ALTER COLUMN invite_code SET DEFAULT upper(substring(md5(random()::text) from 1 for 8));