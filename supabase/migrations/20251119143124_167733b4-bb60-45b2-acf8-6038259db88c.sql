-- Create user_bans table to track banned users
CREATE TABLE public.user_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  banned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ban_reason TEXT NOT NULL DEFAULT 'Violation of terms of service',
  unban_date TIMESTAMP WITH TIME ZONE,
  banned_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;

-- Users can view their own ban status
CREATE POLICY "Users can view their own ban status"
ON public.user_bans
FOR SELECT
USING (auth.uid() = user_id);

-- Only authenticated users (admins) can manage bans
CREATE POLICY "Authenticated users can manage bans"
ON public.user_bans
FOR ALL
USING (auth.role() = 'authenticated');

-- Add trigger for updated_at
CREATE TRIGGER update_user_bans_updated_at
BEFORE UPDATE ON public.user_bans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();