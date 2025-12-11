-- Remove RLS from collaborative coding tables
ALTER TABLE public.coding_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.coding_session_participants DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_code_suggestions DISABLE ROW LEVEL SECURITY;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view sessions they participate in" ON public.coding_sessions;
DROP POLICY IF EXISTS "Users can create coding sessions" ON public.coding_sessions;
DROP POLICY IF EXISTS "Session creator can update" ON public.coding_sessions;
DROP POLICY IF EXISTS "Session creator can delete" ON public.coding_sessions;

DROP POLICY IF EXISTS "Participants can view session members" ON public.coding_session_participants;
DROP POLICY IF EXISTS "Users can join sessions" ON public.coding_session_participants;
DROP POLICY IF EXISTS "Users can leave sessions" ON public.coding_session_participants;
DROP POLICY IF EXISTS "Users can update their own participant data" ON public.coding_session_participants;

DROP POLICY IF EXISTS "Session participants can view suggestions" ON public.ai_code_suggestions;
DROP POLICY IF EXISTS "System can create suggestions" ON public.ai_code_suggestions;
DROP POLICY IF EXISTS "Users can update suggestion status" ON public.ai_code_suggestions;