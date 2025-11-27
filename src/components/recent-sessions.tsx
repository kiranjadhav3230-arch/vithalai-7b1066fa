import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Code, Clock, Edit2, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Session {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  type: 'chat' | 'code';
}

interface RecentSessionsProps {
  userId: string;
  type: 'chat' | 'code';
  onSessionClick?: (sessionId: string) => void;
}

export function RecentSessions({ userId, type, onSessionClick }: RecentSessionsProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
  }, [userId, type]);

  const loadSessions = async () => {
    try {
      if (type === 'chat') {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('id, title, created_at, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        // Generate titles for sessions that don't have one
        const sessionsWithTitles = await Promise.all(
          (data || []).map(async (session) => {
            if (!session.title || session.title === 'New Chat') {
              // Get first message from session to generate title
              const { data: messages } = await supabase
                .from('chat_messages')
                .select('message')
                .eq('session_id', session.id)
                .order('created_at', { ascending: true })
                .limit(1);

              if (messages && messages.length > 0) {
                const { data: titleData } = await supabase.functions.invoke('generate-session-title', {
                  body: { content: messages[0].message, type: 'chat' }
                });

                if (titleData?.title) {
                  // Update session with generated title
                  await supabase
                    .from('chat_sessions')
                    .update({ title: titleData.title })
                    .eq('id', session.id);

                  return { ...session, title: titleData.title, type: 'chat' as const };
                }
              }
            }
            return { ...session, type: 'chat' as const };
          })
        );

        setSessions(sessionsWithTitles);
      } else {
        const { data, error } = await supabase
          .from('code_snippets')
          .select('id, title, description, generated_code, created_at, updated_at')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false })
          .limit(10);

        if (error) throw error;
        
        // Generate titles for code snippets that don't have descriptive ones
        const codeWithTitles = await Promise.all(
          (data || []).map(async (snippet) => {
            if (!snippet.title || snippet.title.length < 5) {
              const { data: titleData } = await supabase.functions.invoke('generate-session-title', {
                body: { 
                  content: snippet.generated_code || snippet.description || '', 
                  type: 'code' 
                }
              });

              if (titleData?.title) {
                // Update snippet with generated title
                await supabase
                  .from('code_snippets')
                  .update({ title: titleData.title })
                  .eq('id', snippet.id);

                return { 
                  id: snippet.id, 
                  title: titleData.title, 
                  created_at: snippet.created_at,
                  updated_at: snippet.updated_at,
                  type: 'code' as const 
                };
              }
            }
            return { 
              id: snippet.id, 
              title: snippet.title, 
              created_at: snippet.created_at,
              updated_at: snippet.updated_at,
              type: 'code' as const 
            };
          })
        );

        setSessions(codeWithTitles);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRename = async (sessionId: string) => {
    if (!editTitle.trim()) return;

    try {
      const table = type === 'chat' ? 'chat_sessions' : 'code_snippets';
      const { error } = await supabase
        .from(table)
        .update({ title: editTitle })
        .eq('id', sessionId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Title updated successfully',
      });

      setSessions(prev => 
        prev.map(s => s.id === sessionId ? { ...s, title: editTitle } : s)
      );
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Error renaming session:', error);
      toast({
        title: 'Error',
        description: 'Failed to update title',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading...</div>;
  }

  if (sessions.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No recent {type === 'chat' ? 'chats' : 'code snippets'} found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 p-2">
        {sessions.map((session) => (
          <Card 
            key={session.id} 
            className="p-3 hover:bg-accent/50 cursor-pointer transition-colors"
            onClick={() => !editingId && onSessionClick?.(session.id)}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                {type === 'chat' ? (
                  <MessageSquare className="h-4 w-4 mt-0.5 flex-shrink-0" />
                ) : (
                  <Code className="h-4 w-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  {editingId === session.id ? (
                    <div className="flex gap-1">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-7 text-sm"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(session.id);
                        }}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingId(null);
                          setEditTitle('');
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-medium truncate">{session.title}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {format(new Date(session.updated_at), 'MMM d, yyyy')}
                      </div>
                    </>
                  )}
                </div>
              </div>
              {editingId !== session.id && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(session.id);
                    setEditTitle(session.title);
                  }}
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
