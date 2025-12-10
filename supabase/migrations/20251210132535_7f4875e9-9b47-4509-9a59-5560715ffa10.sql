-- FEATURE 1: AI Study Buddy That Learns Your Style

-- Learning profiles table - tracks how each student learns
CREATE TABLE public.learning_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  learning_style TEXT DEFAULT 'balanced', -- 'visual', 'reading', 'practice', 'balanced'
  style_scores JSONB DEFAULT '{"visual": 0, "reading": 0, "practice": 0}',
  preferred_examples JSONB DEFAULT '[]',
  explanation_depth TEXT DEFAULT 'medium', -- 'basic', 'medium', 'detailed'
  subjects_strength JSONB DEFAULT '{}',
  total_interactions INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Topic interactions tracking - tracks understanding per topic
CREATE TABLE public.topic_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  subject TEXT,
  understanding_score INT DEFAULT 50, -- 0-100
  total_attempts INT DEFAULT 0,
  successful_attempts INT DEFAULT 0,
  avg_response_time_seconds INT,
  last_interaction TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weak topics for spaced repetition
CREATE TABLE public.weak_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  subject TEXT,
  difficulty_level TEXT DEFAULT 'medium',
  reason TEXT,
  times_revisited INT DEFAULT 0,
  next_review_date TIMESTAMP WITH TIME ZONE,
  mastery_achieved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FEATURE 2: Live Collaborative Coding with AI

-- Collaborative coding sessions
CREATE TABLE public.coding_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  language TEXT DEFAULT 'javascript',
  code_content TEXT DEFAULT '',
  created_by UUID NOT NULL,
  invite_code TEXT UNIQUE DEFAULT upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8)),
  is_active BOOLEAN DEFAULT TRUE,
  max_participants INT DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session participants with cursor tracking
CREATE TABLE public.coding_session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.coding_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  display_name TEXT,
  cursor_position INT DEFAULT 0,
  cursor_line INT DEFAULT 1,
  cursor_column INT DEFAULT 1,
  cursor_color TEXT DEFAULT '#3b82f6',
  is_online BOOLEAN DEFAULT TRUE,
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(session_id, user_id)
);

-- AI suggestions history
CREATE TABLE public.ai_code_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.coding_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID,
  suggestion_type TEXT NOT NULL, -- 'improvement', 'bug_fix', 'optimization', 'style', 'security'
  original_code TEXT,
  suggested_code TEXT,
  explanation TEXT,
  line_number INT,
  accepted BOOLEAN,
  dismissed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.learning_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topic_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weak_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_code_suggestions ENABLE ROW LEVEL SECURITY;

-- Learning profiles policies
CREATE POLICY "Users can view their own learning profile"
ON public.learning_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own learning profile"
ON public.learning_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning profile"
ON public.learning_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Topic interactions policies
CREATE POLICY "Users can view their own topic interactions"
ON public.topic_interactions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own topic interactions"
ON public.topic_interactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topic interactions"
ON public.topic_interactions FOR UPDATE
USING (auth.uid() = user_id);

-- Weak topics policies
CREATE POLICY "Users can view their own weak topics"
ON public.weak_topics FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own weak topics"
ON public.weak_topics FOR ALL
USING (auth.uid() = user_id);

-- Coding sessions policies
CREATE POLICY "Users can view sessions they participate in"
ON public.coding_sessions FOR SELECT
USING (
  created_by = auth.uid() OR 
  id IN (SELECT session_id FROM public.coding_session_participants WHERE user_id = auth.uid())
);

CREATE POLICY "Users can create coding sessions"
ON public.coding_sessions FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Session creator can update"
ON public.coding_sessions FOR UPDATE
USING (created_by = auth.uid());

CREATE POLICY "Session creator can delete"
ON public.coding_sessions FOR DELETE
USING (created_by = auth.uid());

-- Coding session participants policies
CREATE POLICY "Participants can view session members"
ON public.coding_session_participants FOR SELECT
USING (
  session_id IN (SELECT id FROM public.coding_sessions WHERE created_by = auth.uid()) OR
  session_id IN (SELECT session_id FROM public.coding_session_participants WHERE user_id = auth.uid())
);

CREATE POLICY "Users can join sessions"
ON public.coding_session_participants FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participant data"
ON public.coding_session_participants FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can leave sessions"
ON public.coding_session_participants FOR DELETE
USING (auth.uid() = user_id);

-- AI suggestions policies
CREATE POLICY "Session participants can view suggestions"
ON public.ai_code_suggestions FOR SELECT
USING (
  session_id IN (SELECT session_id FROM public.coding_session_participants WHERE user_id = auth.uid())
);

CREATE POLICY "System can create suggestions"
ON public.ai_code_suggestions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update suggestion status"
ON public.ai_code_suggestions FOR UPDATE
USING (
  session_id IN (SELECT session_id FROM public.coding_session_participants WHERE user_id = auth.uid())
);

-- Enable realtime for collaborative coding
ALTER PUBLICATION supabase_realtime ADD TABLE public.coding_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.coding_session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_code_suggestions;

-- Update timestamp trigger for learning_profiles
CREATE TRIGGER update_learning_profiles_updated_at
BEFORE UPDATE ON public.learning_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update timestamp trigger for coding_sessions
CREATE TRIGGER update_coding_sessions_updated_at
BEFORE UPDATE ON public.coding_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();