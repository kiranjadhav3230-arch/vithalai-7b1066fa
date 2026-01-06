-- Add columns to track weekly challenge bonus points
ALTER TABLE public.quiz_leaderboard_entries 
ADD COLUMN IF NOT EXISTS is_weekly_challenge boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS bonus_multiplier integer DEFAULT 1,
ADD COLUMN IF NOT EXISTS base_score integer;

-- Update existing entries to set base_score equal to score
UPDATE public.quiz_leaderboard_entries 
SET base_score = score 
WHERE base_score IS NULL;