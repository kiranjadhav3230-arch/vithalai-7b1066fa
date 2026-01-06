-- Create table to store user's completed exams and certificates
CREATE TABLE public.user_exam_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  user_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  percentage INTEGER NOT NULL,
  passed BOOLEAN NOT NULL DEFAULT false,
  certificate_id TEXT,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_exam_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own exam history" 
ON public.user_exam_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exam history" 
ON public.user_exam_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_user_exam_history_user_topic ON public.user_exam_history(user_id, topic);
CREATE INDEX idx_user_exam_history_completed_at ON public.user_exam_history(user_id, topic, completed_at DESC);