-- Create study rooms table
CREATE TABLE public.study_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT true,
  invite_code TEXT UNIQUE,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room members table
CREATE TABLE public.room_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(room_id, user_id)
);

-- Create room messages table
CREATE TABLE public.room_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id UUID,
  message TEXT NOT NULL,
  is_ai_response BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create room notes table
CREATE TABLE public.room_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.study_rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.study_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_rooms
CREATE POLICY "Public rooms are viewable by everyone"
  ON public.study_rooms FOR SELECT
  USING (is_public = true);

CREATE POLICY "Private rooms are viewable by members"
  ON public.study_rooms FOR SELECT
  USING (
    is_public = false AND
    id IN (SELECT room_id FROM public.room_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create rooms"
  ON public.study_rooms FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update their rooms"
  ON public.study_rooms FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Room creators can delete their rooms"
  ON public.study_rooms FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for room_members
CREATE POLICY "Room members are viewable by room members"
  ON public.room_members FOR SELECT
  USING (
    room_id IN (SELECT room_id FROM public.room_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can join public rooms"
  ON public.room_members FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    (
      room_id IN (SELECT id FROM public.study_rooms WHERE is_public = true) OR
      room_id IN (SELECT room_id FROM public.room_members WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Users can leave rooms"
  ON public.room_members FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for room_messages
CREATE POLICY "Room messages are viewable by room members"
  ON public.room_messages FOR SELECT
  USING (
    room_id IN (SELECT room_id FROM public.room_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Room members can create messages"
  ON public.room_messages FOR INSERT
  WITH CHECK (
    room_id IN (SELECT room_id FROM public.room_members WHERE user_id = auth.uid())
  );

-- RLS Policies for room_notes
CREATE POLICY "Room notes are viewable by room members"
  ON public.room_notes FOR SELECT
  USING (
    room_id IN (SELECT room_id FROM public.room_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Room members can create notes"
  ON public.room_notes FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    room_id IN (SELECT room_id FROM public.room_members WHERE user_id = auth.uid())
  );

CREATE POLICY "Note creators can update their notes"
  ON public.room_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Note creators can delete their notes"
  ON public.room_notes FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_room_members_room_id ON public.room_members(room_id);
CREATE INDEX idx_room_members_user_id ON public.room_members(user_id);
CREATE INDEX idx_room_messages_room_id ON public.room_messages(room_id);
CREATE INDEX idx_room_notes_room_id ON public.room_notes(room_id);

-- Create trigger for updated_at
CREATE TRIGGER update_study_rooms_updated_at
  BEFORE UPDATE ON public.study_rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_room_notes_updated_at
  BEFORE UPDATE ON public.room_notes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for room_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_notes;