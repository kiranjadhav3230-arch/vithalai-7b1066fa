-- Create quiz leaderboard entries table
CREATE TABLE public.quiz_leaderboard_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  quiz_session_id uuid REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  avatar_url text,
  topic text NOT NULL,
  score integer NOT NULL,
  total_questions integer NOT NULL,
  percentage integer NOT NULL,
  state text NOT NULL DEFAULT 'Maharashtra',
  week_number integer NOT NULL,
  year integer NOT NULL,
  completed_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quiz_leaderboard_entries ENABLE ROW LEVEL SECURITY;

-- Everyone can view leaderboard (public feature for virality)
CREATE POLICY "Leaderboard is publicly viewable"
  ON public.quiz_leaderboard_entries FOR SELECT
  USING (true);

-- Anyone can add leaderboard entries (for anonymous participation)
CREATE POLICY "Anyone can add leaderboard entries"
  ON public.quiz_leaderboard_entries FOR INSERT
  WITH CHECK (true);

-- Add state column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state text DEFAULT 'Maharashtra';

-- Create index for faster leaderboard queries
CREATE INDEX idx_leaderboard_week_year ON public.quiz_leaderboard_entries(week_number, year);
CREATE INDEX idx_leaderboard_state ON public.quiz_leaderboard_entries(state);
CREATE INDEX idx_leaderboard_topic ON public.quiz_leaderboard_entries(topic);
CREATE INDEX idx_leaderboard_percentage ON public.quiz_leaderboard_entries(percentage DESC);