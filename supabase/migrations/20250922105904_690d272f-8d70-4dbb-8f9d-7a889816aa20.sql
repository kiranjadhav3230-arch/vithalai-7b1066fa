-- Create tables for enhanced learning features

-- PDF Documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  upload_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  analysis_status TEXT DEFAULT 'pending', -- pending, analyzing, completed, failed
  analysis_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Quiz Sessions table
CREATE TABLE public.quiz_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  difficulty_level TEXT DEFAULT 'medium', -- easy, medium, hard
  questions JSONB NOT NULL, -- Array of questions with answers
  user_answers JSONB, -- User's answers
  score INTEGER,
  total_questions INTEGER NOT NULL,
  status TEXT DEFAULT 'active', -- active, completed, abandoned
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Study Plans table
CREATE TABLE public.study_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  subjects JSONB NOT NULL, -- Array of subjects
  schedule JSONB NOT NULL, -- Study schedule with dates and topics
  total_hours INTEGER DEFAULT 0,
  completed_hours INTEGER DEFAULT 0,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'active', -- active, completed, paused
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Study Sessions table (tracking individual study sessions)
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  study_plan_id UUID REFERENCES public.study_plans(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  session_date DATE NOT NULL,
  notes TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 1-5 satisfaction rating
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Achievements table
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL, -- quiz_master, study_streak, document_analyzer, etc.
  achievement_name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB -- Additional data like streak count, score, etc.
);

-- Enable Row Level Security
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents
CREATE POLICY "Users can view their own documents" 
ON public.documents FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documents" 
ON public.documents FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" 
ON public.documents FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" 
ON public.documents FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for quiz sessions
CREATE POLICY "Users can view their own quiz sessions" 
ON public.quiz_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own quiz sessions" 
ON public.quiz_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own quiz sessions" 
ON public.quiz_sessions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own quiz sessions" 
ON public.quiz_sessions FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for study plans
CREATE POLICY "Users can view their own study plans" 
ON public.study_plans FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study plans" 
ON public.study_plans FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study plans" 
ON public.study_plans FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study plans" 
ON public.study_plans FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for study sessions
CREATE POLICY "Users can view their own study sessions" 
ON public.study_sessions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own study sessions" 
ON public.study_sessions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own study sessions" 
ON public.study_sessions FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own study sessions" 
ON public.study_sessions FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for user achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own achievements" 
ON public.user_achievements FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_plans_updated_at
BEFORE UPDATE ON public.study_plans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_documents_user_id ON public.documents(user_id);
CREATE INDEX idx_quiz_sessions_user_id ON public.quiz_sessions(user_id);
CREATE INDEX idx_study_plans_user_id ON public.study_plans(user_id);
CREATE INDEX idx_study_sessions_user_id ON public.study_sessions(user_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);