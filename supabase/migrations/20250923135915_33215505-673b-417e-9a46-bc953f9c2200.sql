-- Create table for storing code snippets
CREATE TABLE public.code_snippets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL DEFAULT 'javascript',
  prompt TEXT,
  generated_code TEXT NOT NULL,
  is_favorite BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.code_snippets ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own code snippets" 
ON public.code_snippets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own code snippets" 
ON public.code_snippets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own code snippets" 
ON public.code_snippets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own code snippets" 
ON public.code_snippets 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_code_snippets_updated_at
BEFORE UPDATE ON public.code_snippets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();