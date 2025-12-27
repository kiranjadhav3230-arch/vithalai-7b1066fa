-- Create enum for legal categories
CREATE TYPE public.legal_category_type AS ENUM ('police', 'hospital', 'workplace', 'women_safety', 'consumer', 'traffic', 'property', 'government');

-- Create enum for action types
CREATE TYPE public.action_type AS ENUM ('call', 'record', 'share_location', 'generate_document', 'navigate', 'info');

-- Legal Categories Table
CREATE TABLE public.legal_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_type legal_category_type NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    name_mr TEXT NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    description_mr TEXT,
    icon TEXT NOT NULL DEFAULT 'shield',
    color TEXT NOT NULL DEFAULT 'blue',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Legal Situations Table
CREATE TABLE public.legal_situations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.legal_categories(id) ON DELETE CASCADE NOT NULL,
    title_en TEXT NOT NULL,
    title_hi TEXT NOT NULL,
    title_mr TEXT NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    description_mr TEXT,
    keywords TEXT[] DEFAULT '{}',
    severity_level INTEGER DEFAULT 1 CHECK (severity_level BETWEEN 1 AND 5),
    is_emergency BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Legal Rights Table
CREATE TABLE public.legal_rights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    situation_id UUID REFERENCES public.legal_situations(id) ON DELETE CASCADE NOT NULL,
    right_text_en TEXT NOT NULL,
    right_text_hi TEXT NOT NULL,
    right_text_mr TEXT NOT NULL,
    legal_reference TEXT,
    section_number TEXT,
    act_name TEXT,
    priority_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Do's and Don'ts Table
CREATE TABLE public.dos_and_donts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    situation_id UUID REFERENCES public.legal_situations(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('do', 'dont')),
    content_en TEXT NOT NULL,
    content_hi TEXT NOT NULL,
    content_mr TEXT NOT NULL,
    icon TEXT DEFAULT 'circle',
    priority_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Action Steps Table
CREATE TABLE public.action_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    situation_id UUID REFERENCES public.legal_situations(id) ON DELETE CASCADE NOT NULL,
    step_order INTEGER NOT NULL,
    action_text_en TEXT NOT NULL,
    action_text_hi TEXT NOT NULL,
    action_text_mr TEXT NOT NULL,
    action_type action_type NOT NULL DEFAULT 'info',
    action_data JSONB DEFAULT '{}',
    is_critical BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Helpline Directory Table
CREATE TABLE public.helpline_directory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    name_mr TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    category legal_category_type,
    description_en TEXT,
    description_hi TEXT,
    is_toll_free BOOLEAN DEFAULT true,
    working_hours TEXT DEFAULT '24/7',
    state TEXT DEFAULT 'All India',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Document Templates Table
CREATE TABLE public.document_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    situation_id UUID REFERENCES public.legal_situations(id) ON DELETE CASCADE,
    template_name_en TEXT NOT NULL,
    template_name_hi TEXT NOT NULL,
    template_name_mr TEXT NOT NULL,
    template_content_en TEXT NOT NULL,
    template_content_hi TEXT NOT NULL,
    template_content_mr TEXT NOT NULL,
    template_type TEXT NOT NULL,
    required_fields JSONB DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Rights History Table
CREATE TABLE public.user_rights_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    situation_id UUID REFERENCES public.legal_situations(id),
    query_text TEXT,
    ai_response TEXT,
    is_emergency BOOLEAN DEFAULT false,
    evidence_recorded BOOLEAN DEFAULT false,
    language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Evidence Locker Table
CREATE TABLE public.user_evidence_locker (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    history_id UUID REFERENCES public.user_rights_history(id) ON DELETE CASCADE,
    evidence_type TEXT NOT NULL CHECK (evidence_type IN ('audio', 'image', 'video', 'document')),
    file_url TEXT NOT NULL,
    description TEXT,
    metadata JSONB DEFAULT '{}',
    is_encrypted BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.legal_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_situations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_rights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dos_and_donts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.helpline_directory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rights_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_evidence_locker ENABLE ROW LEVEL SECURITY;

-- Public read policies for reference data
CREATE POLICY "Legal categories are publicly viewable" ON public.legal_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Legal situations are publicly viewable" ON public.legal_situations FOR SELECT USING (is_active = true);
CREATE POLICY "Legal rights are publicly viewable" ON public.legal_rights FOR SELECT USING (is_active = true);
CREATE POLICY "Dos and donts are publicly viewable" ON public.dos_and_donts FOR SELECT USING (true);
CREATE POLICY "Action steps are publicly viewable" ON public.action_steps FOR SELECT USING (true);
CREATE POLICY "Helplines are publicly viewable" ON public.helpline_directory FOR SELECT USING (is_active = true);
CREATE POLICY "Document templates are publicly viewable" ON public.document_templates FOR SELECT USING (is_active = true);

-- User-specific policies for history and evidence
CREATE POLICY "Users can view their own rights history" ON public.user_rights_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own rights history" ON public.user_rights_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own rights history" ON public.user_rights_history FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own evidence" ON public.user_evidence_locker FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own evidence" ON public.user_evidence_locker FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own evidence" ON public.user_evidence_locker FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_legal_situations_category ON public.legal_situations(category_id);
CREATE INDEX idx_legal_rights_situation ON public.legal_rights(situation_id);
CREATE INDEX idx_dos_donts_situation ON public.dos_and_donts(situation_id);
CREATE INDEX idx_action_steps_situation ON public.action_steps(situation_id);
CREATE INDEX idx_helplines_category ON public.helpline_directory(category);
CREATE INDEX idx_user_rights_history_user ON public.user_rights_history(user_id);
CREATE INDEX idx_user_evidence_user ON public.user_evidence_locker(user_id);