-- Create website_projects table
CREATE TABLE public.website_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  website_type TEXT,
  style_type TEXT,
  color_scheme TEXT,
  is_favorite BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create website_project_files table
CREATE TABLE public.website_project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.website_projects(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_content TEXT NOT NULL,
  language TEXT NOT NULL,
  file_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on website_projects
ALTER TABLE public.website_projects ENABLE ROW LEVEL SECURITY;

-- RLS policies for website_projects
CREATE POLICY "Users can view their own website projects"
  ON public.website_projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own website projects"
  ON public.website_projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own website projects"
  ON public.website_projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own website projects"
  ON public.website_projects FOR DELETE
  USING (auth.uid() = user_id);

-- Enable RLS on website_project_files
ALTER TABLE public.website_project_files ENABLE ROW LEVEL SECURITY;

-- RLS policies for website_project_files
CREATE POLICY "Users can view files of their projects"
  ON public.website_project_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.website_projects 
    WHERE id = project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can create files for their projects"
  ON public.website_project_files FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.website_projects 
    WHERE id = project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can update files of their projects"
  ON public.website_project_files FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.website_projects 
    WHERE id = project_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can delete files of their projects"
  ON public.website_project_files FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.website_projects 
    WHERE id = project_id AND user_id = auth.uid()
  ));

-- Create updated_at trigger for website_projects
CREATE TRIGGER update_website_projects_updated_at
  BEFORE UPDATE ON public.website_projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create updated_at trigger for website_project_files
CREATE TRIGGER update_website_project_files_updated_at
  BEFORE UPDATE ON public.website_project_files
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();