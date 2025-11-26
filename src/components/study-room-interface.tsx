import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Users, FileText, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Message {
  id: string;
  message: string;
  is_ai_response: boolean;
  user_id: string | null;
  created_at: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Member {
  user_id: string;
  joined_at: string;
  profiles?: { display_name: string | null };
}

export const StudyRoomInterface: React.FC<{
  room: any;
  user: any;
  onBack: () => void;
}> = ({ room, user, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Note form states
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    loadMessages();
    loadNotes();
    loadMembers();

    // Subscribe to realtime updates
    const messagesChannel = supabase
      .channel(`room-messages-${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_messages',
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    const notesChannel = supabase
      .channel(`room-notes-${room.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_notes',
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          loadNotes();
        }
      )
      .subscribe();

    const membersChannel = supabase
      .channel(`room-members-${room.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_members',
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          loadMembers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(notesChannel);
      supabase.removeChannel(membersChannel);
    };
  }, [room.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('room_messages')
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const loadNotes = async () => {
    const { data } = await supabase
      .from('room_notes')
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: false });

    if (data) setNotes(data);
  };

  const loadMembers = async () => {
    const { data } = await supabase
      .from('room_members')
      .select('user_id, joined_at, profiles(display_name)')
      .eq('room_id', room.id);

    if (data) setMembers(data as any);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoadingAI) return;

    const messageText = inputMessage;
    setInputMessage('');

    try {
      // Save user message
      const { error } = await supabase.from('room_messages').insert({
        room_id: room.id,
        user_id: user.id,
        message: messageText,
        is_ai_response: false,
      });

      if (error) throw error;

      // Get AI response
      setIsLoadingAI(true);
      const { data, error: aiError } = await supabase.functions.invoke('room-chat', {
        body: {
          roomId: room.id,
          message: messageText,
          userId: user.id,
        },
      });

      if (aiError) throw aiError;

      setIsLoadingAI(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoadingAI(false);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const createNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('room_notes').insert({
        room_id: room.id,
        user_id: user.id,
        title: noteTitle,
        content: noteContent,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Note created successfully',
      });

      setIsNoteOpen(false);
      setNoteTitle('');
      setNoteContent('');
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">{room.name}</h2>
            {room.description && (
              <p className="text-sm text-muted-foreground">{room.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          {members.length} online
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.is_ai_response ? 'justify-start' : msg.user_id === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.is_ai_response
                        ? 'bg-primary/10 border border-primary/20'
                        : msg.user_id === user.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.is_ai_response && (
                      <div className="text-xs font-semibold mb-1">AI Assistant</div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              ))}
              {isLoadingAI && (
                <div className="flex justify-start">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              disabled={isLoadingAI}
            />
            <Button onClick={sendMessage} disabled={isLoadingAI || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Shared Notes</h3>
            <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Note title"
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Write your note here..."
                      rows={8}
                    />
                  </div>
                  <Button onClick={createNote} className="w-full">
                    Create Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-3">
              {notes.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No notes yet</p>
                  </CardContent>
                </Card>
              ) : (
                notes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(note.created_at).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="members" className="flex-1 p-4">
          <h3 className="text-lg font-semibold mb-4">Room Members</h3>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2">
              {members.map((member) => (
                <Card key={member.user_id}>
                  <CardContent className="py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {member.profiles?.display_name || 'User'}
                          {member.user_id === user.id && ' (You)'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Joined {new Date(member.joined_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};