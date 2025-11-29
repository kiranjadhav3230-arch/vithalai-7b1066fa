-- Create published_websites table
CREATE TABLE public.published_websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  code_snippet_id UUID REFERENCES public.code_snippets(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subdomain TEXT UNIQUE NOT NULL,
  custom_domain TEXT,
  html_content TEXT NOT NULL,
  css_content TEXT,
  js_content TEXT,
  language TEXT DEFAULT 'html',
  is_published BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.published_websites ENABLE ROW LEVEL SECURITY;

-- RLS Policies for published_websites
CREATE POLICY "Users can create their own published websites"
ON public.published_websites
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own published websites"
ON public.published_websites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own published websites"
ON public.published_websites
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own published websites"
ON public.published_websites
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Public policy to allow anyone to view published websites by subdomain
CREATE POLICY "Published websites are publicly viewable"
ON public.published_websites
FOR SELECT
TO anon, authenticated
USING (is_published = true);

-- Create trigger for updated_at
CREATE TRIGGER update_published_websites_updated_at
BEFORE UPDATE ON public.published_websites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster subdomain lookups
CREATE INDEX idx_published_websites_subdomain ON public.published_websites(subdomain);
CREATE INDEX idx_published_websites_custom_domain ON public.published_websites(custom_domain);
CREATE INDEX idx_published_websites_user_id ON public.published_websites(user_id);