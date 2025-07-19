-- Update profiles table to include more user details
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS skills TEXT[],
ADD COLUMN IF NOT EXISTS interests TEXT[],
ADD COLUMN IF NOT EXISTS education TEXT,
ADD COLUMN IF NOT EXISTS experience TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT;

-- Create chat_history table to store user conversations
CREATE TABLE IF NOT EXISTS public.chat_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  language TEXT DEFAULT 'english',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on chat_history
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_history
CREATE POLICY "Users can view their own chat history" 
ON public.chat_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat history" 
ON public.chat_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chat history" 
ON public.chat_history 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chat history" 
ON public.chat_history 
FOR DELETE 
USING (auth.uid() = user_id);