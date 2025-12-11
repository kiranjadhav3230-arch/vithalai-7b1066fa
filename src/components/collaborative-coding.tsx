import React, { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Editor from '@monaco-editor/react';
import { 
  Users, 
  Plus, 
  Copy, 
  Link as LinkIcon, 
  LogOut, 
  Play, 
  Lightbulb,
  Bug,
  Zap,
  Shield,
  Check,
  X,
  Loader2,
  Settings,
  Sparkles,
  FolderOpen,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface CodingSession {
  id: string;
  name: string;
  language: string;
  code_content: string;
  created_by: string;
  invite_code: string;
  is_active: boolean;
}

interface Participant {
  id: string;
  session_id: string;
  user_id: string;
  display_name?: string;
  cursor_line: number;
  cursor_column: number;
  cursor_color: string;
  is_online: boolean;
}

interface AISuggestion {
  id: string;
  suggestion_type: string;
  original_code: string;
  suggested_code: string;
  explanation: string;
  line_number?: number;
  accepted?: boolean;
  dismissed: boolean;
}

interface CodeSnippet {
  id: string;
  title: string;
  generated_code: string;
  language: string;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
];

const CURSOR_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899'
];

interface CollaborativeCodingProps {
  user: any;
  onBack?: () => void;
}

export const CollaborativeCoding: React.FC<CollaborativeCodingProps> = ({ user, onBack }) => {
  const [sessions, setSessions] = useState<CodingSession[]>([]);
  const [currentSession, setCurrentSession] = useState<CodingSession | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [code, setCode] = useState('// Start coding together!\n');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [newSessionName, setNewSessionName] = useState('');
  const [newSessionLanguage, setNewSessionLanguage] = useState('javascript');
  const [joinCode, setJoinCode] = useState('');
  const [codeSnippets, setCodeSnippets] = useState<CodeSnippet[]>([]);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSessions();
    if (user?.id) {
      loadCodeSnippets();
    }
  }, [user?.id]);

  useEffect(() => {
    if (!currentSession) return;

    // Subscribe to code changes
    const codeChannel = supabase
      .channel(`coding-session-${currentSession.id}`)
      .on('broadcast', { event: 'code_change' }, ({ payload }) => {
        if (payload.user_id !== user.id) {
          setCode(payload.code);
        }
      })
      .on('broadcast', { event: 'cursor_move' }, ({ payload }) => {
        if (payload.user_id !== user.id) {
          setParticipants(prev => prev.map(p => 
            p.user_id === payload.user_id 
              ? { ...p, cursor_line: payload.line, cursor_column: payload.column }
              : p
          ));
        }
      })
      .subscribe();

    // Subscribe to suggestions
    const suggestionsChannel = supabase
      .channel(`suggestions-${currentSession.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'ai_code_suggestions',
          filter: `session_id=eq.${currentSession.id}`
        },
        (payload) => {
          setSuggestions(prev => [...prev, payload.new as AISuggestion]);
        }
      )
      .subscribe();

    // Subscribe to participants
    const participantsChannel = supabase
      .channel(`participants-${currentSession.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'coding_session_participants',
          filter: `session_id=eq.${currentSession.id}`
        },
        () => {
          loadParticipants();
        }
      )
      .subscribe();

    loadParticipants();
    loadSuggestions();

    return () => {
      supabase.removeChannel(codeChannel);
      supabase.removeChannel(suggestionsChannel);
      supabase.removeChannel(participantsChannel);
    };
  }, [currentSession?.id, user?.id]);

  const loadSessions = async () => {
    // Load ALL active sessions (RLS disabled)
    const { data } = await supabase
      .from('coding_sessions')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (data) {
      setSessions(data);
    }
  };

  const loadCodeSnippets = async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('code_snippets')
      .select('id, title, generated_code, language')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setCodeSnippets(data);
    }
  };

  const loadParticipants = async () => {
    if (!currentSession) return;

    const { data: participantData } = await supabase
      .from('coding_session_participants')
      .select('*')
      .eq('session_id', currentSession.id);

    if (participantData) {
      const userIds = participantData.map(p => p.user_id);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p.display_name]) || []);
      
      const enrichedParticipants = participantData.map(p => ({
        ...p,
        display_name: profileMap.get(p.user_id) || 'User'
      }));

      setParticipants(enrichedParticipants);
    }
  };

  const loadSuggestions = async () => {
    if (!currentSession) return;

    const { data } = await supabase
      .from('ai_code_suggestions')
      .select('*')
      .eq('session_id', currentSession.id)
      .eq('dismissed', false)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setSuggestions(data);
    }
  };

  const createSession = async () => {
    if (!newSessionName.trim() || !user?.id) return;

    const { data, error } = await supabase
      .from('coding_sessions')
      .insert({
        name: newSessionName,
        language: newSessionLanguage,
        created_by: user.id,
        code_content: `// ${newSessionName}\n// Language: ${newSessionLanguage}\n\n`
      })
      .select()
      .single();

    if (error) {
      toast({ title: 'Error', description: 'Failed to create session', variant: 'destructive' });
      return;
    }

    // Join as participant
    const cursorColor = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
    await supabase.from('coding_session_participants').insert({
      session_id: data.id,
      user_id: user.id,
      cursor_color: cursorColor
    });

    setCurrentSession(data);
    setCode(data.code_content);
    setIsCreateOpen(false);
    setNewSessionName('');
    loadSessions();

    toast({ title: 'Session Created!', description: `Invite code: ${data.invite_code}` });
  };

  const joinSession = async () => {
    if (!joinCode.trim() || !user?.id) return;

    const { data: session } = await supabase
      .from('coding_sessions')
      .select('*')
      .eq('invite_code', joinCode.toUpperCase())
      .eq('is_active', true)
      .single();

    if (!session) {
      toast({ title: 'Error', description: 'Invalid invite code', variant: 'destructive' });
      return;
    }

    // Check if already a participant
    const { data: existing } = await supabase
      .from('coding_session_participants')
      .select('id')
      .eq('session_id', session.id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      const cursorColor = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
      await supabase.from('coding_session_participants').insert({
        session_id: session.id,
        user_id: user.id,
        cursor_color: cursorColor
      });
    }

    setCurrentSession(session);
    setCode(session.code_content);
    setIsJoinOpen(false);
    setJoinCode('');
    loadSessions();

    toast({ title: 'Joined!', description: `Welcome to ${session.name}` });
  };

  const joinSessionDirectly = async (session: CodingSession) => {
    if (!user?.id) return;

    // Check if already a participant
    const { data: existing } = await supabase
      .from('coding_session_participants')
      .select('id')
      .eq('session_id', session.id)
      .eq('user_id', user.id)
      .single();

    if (!existing) {
      const cursorColor = CURSOR_COLORS[Math.floor(Math.random() * CURSOR_COLORS.length)];
      await supabase.from('coding_session_participants').insert({
        session_id: session.id,
        user_id: user.id,
        cursor_color: cursorColor
      });
    }

    setCurrentSession(session);
    setCode(session.code_content || '// Start coding together!\n');
  };

  const leaveSession = async () => {
    if (!currentSession || !user?.id) return;

    await supabase
      .from('coding_session_participants')
      .delete()
      .eq('session_id', currentSession.id)
      .eq('user_id', user.id);

    setCurrentSession(null);
    setCode('// Start coding together!\n');
    setParticipants([]);
    setSuggestions([]);
    setPreviewHtml(null);
    loadSessions();
  };

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (!value || !currentSession) return;
    setCode(value);

    // Broadcast code change
    supabase.channel(`coding-session-${currentSession.id}`).send({
      type: 'broadcast',
      event: 'code_change',
      payload: { code: value, user_id: user.id }
    });

    // Save to database periodically
    supabase
      .from('coding_sessions')
      .update({ code_content: value })
      .eq('id', currentSession.id);
  }, [currentSession, user?.id]);

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;

    editor.onDidChangeCursorPosition((e: any) => {
      if (!currentSession) return;
      
      supabase.channel(`coding-session-${currentSession.id}`).send({
        type: 'broadcast',
        event: 'cursor_move',
        payload: {
          user_id: user.id,
          line: e.position.lineNumber,
          column: e.position.column
        }
      });
    });
  };

  const importFromLibrary = (snippet: CodeSnippet) => {
    setCode(snippet.generated_code);
    handleCodeChange(snippet.generated_code);
    setIsImportOpen(false);
    toast({ title: 'Imported!', description: `Code from "${snippet.title}" imported` });
  };

  const runCode = () => {
    if (!currentSession) return;
    setIsRunning(true);

    const lang = currentSession.language;
    
    if (['html', 'javascript', 'css'].includes(lang)) {
      let htmlContent = '';
      
      if (lang === 'html') {
        htmlContent = code;
      } else if (lang === 'javascript') {
        htmlContent = `<!DOCTYPE html>
<html>
<head><title>Code Preview</title></head>
<body>
<div id="output"></div>
<script>
try {
  ${code}
} catch(e) {
  document.getElementById('output').innerHTML = '<pre style="color:red">' + e.message + '</pre>';
}
</script>
</body>
</html>`;
      } else if (lang === 'css') {
        htmlContent = `<!DOCTYPE html>
<html>
<head>
<title>CSS Preview</title>
<style>${code}</style>
</head>
<body>
<div class="preview">
  <h1>CSS Preview</h1>
  <p>Your CSS styles are applied to this page.</p>
  <button>Sample Button</button>
  <div class="box">Sample Box</div>
</div>
</body>
</html>`;
      }

      setPreviewHtml(htmlContent);
    } else {
      toast({ 
        title: 'Preview not available', 
        description: `Live preview is only available for HTML, CSS, and JavaScript. ${lang} requires a backend compiler.`,
        variant: 'destructive'
      });
    }

    setIsRunning(false);
  };

  const openPreviewInNewTab = () => {
    if (!previewHtml) return;
    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const requestAISuggestions = async () => {
    if (!currentSession || isLoadingSuggestions) return;

    setIsLoadingSuggestions(true);
    try {
      const { data, error } = await supabase.functions.invoke('code-assistant', {
        body: {
          sessionId: currentSession.id,
          code: code,
          language: currentSession.language,
          userId: user.id,
          action: 'full_analysis'
        }
      });

      if (error) throw error;

      if (data.suggestions?.length === 0) {
        toast({ title: '✨ Code looks great!', description: 'No suggestions at this time.' });
      } else {
        toast({ title: '💡 Suggestions ready!', description: `${data.suggestions?.length || 0} suggestions available` });
      }
    } catch (error) {
      console.error('Error getting suggestions:', error);
      toast({ title: 'Error', description: 'Failed to get AI suggestions', variant: 'destructive' });
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const applySuggestion = async (suggestion: AISuggestion) => {
    if (suggestion.original_code && suggestion.suggested_code) {
      const newCode = code.replace(suggestion.original_code, suggestion.suggested_code);
      handleCodeChange(newCode);
    }

    await supabase
      .from('ai_code_suggestions')
      .update({ accepted: true })
      .eq('id', suggestion.id);

    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    toast({ title: 'Applied!', description: 'Suggestion applied successfully' });
  };

  const dismissSuggestion = async (suggestionId: string) => {
    await supabase
      .from('ai_code_suggestions')
      .update({ dismissed: true })
      .eq('id', suggestionId);

    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const copyInviteCode = () => {
    if (!currentSession) return;
    navigator.clipboard.writeText(currentSession.invite_code);
    toast({ title: 'Copied!', description: 'Invite code copied to clipboard' });
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'bug_fix': return <Bug className="h-4 w-4 text-red-400" />;
      case 'optimization': return <Zap className="h-4 w-4 text-yellow-400" />;
      case 'security': return <Shield className="h-4 w-4 text-orange-400" />;
      case 'style': return <Settings className="h-4 w-4 text-purple-400" />;
      default: return <Lightbulb className="h-4 w-4 text-blue-400" />;
    }
  };

  // Session List View
  if (!currentSession) {
    return (
      <div className="h-full flex flex-col p-4 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            Live Collaborative Coding
          </h2>
          <div className="flex gap-2 flex-wrap">
            <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Join
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join Coding Session</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Enter invite code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  />
                  <Button onClick={joinSession} className="w-full">
                    Join Session
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Coding Session</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Session name"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                  />
                  <Select value={newSessionLanguage} onValueChange={setNewSessionLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={createSession} className="w-full">
                    Create Session
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.length === 0 ? (
              <Card className="col-span-full flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">No active sessions</p>
                  <p className="text-sm text-muted-foreground">Create or join a session to start coding together!</p>
                </div>
              </Card>
            ) : (
              sessions.map(session => (
                <Card 
                  key={session.id} 
                  className="cursor-pointer hover:border-primary/50 transition-colors"
                  onClick={() => joinSessionDirectly(session)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{session.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge>{session.language}</Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Code: {session.invite_code}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    );
  }

  // Active Session View
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-border/50 bg-card/50 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={leaveSession}>
            <LogOut className="h-4 w-4 mr-1" />
            Leave
          </Button>
          <div>
            <h3 className="font-semibold text-sm">{currentSession.name}</h3>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">{currentSession.language}</Badge>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {participants.length}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          {/* Import from Library */}
          <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderOpen className="h-4 w-4 mr-1" />
                Import
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[70vh]">
              <DialogHeader>
                <DialogTitle>Import from Library</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-96 mt-4">
                {codeSnippets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FolderOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No saved code snippets</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {codeSnippets.map(snippet => (
                      <Card 
                        key={snippet.id} 
                        className="p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => importFromLibrary(snippet)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{snippet.title}</p>
                            <Badge variant="outline" className="mt-1">{snippet.language}</Badge>
                          </div>
                          <Button size="sm" variant="ghost">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </DialogContent>
          </Dialog>

          {/* Run Code */}
          <Button variant="outline" size="sm" onClick={runCode} disabled={isRunning}>
            {isRunning ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-1" />
            )}
            Run
          </Button>

          {/* Preview in new tab */}
          {previewHtml && (
            <Button variant="outline" size="sm" onClick={openPreviewInNewTab}>
              <ExternalLink className="h-4 w-4 mr-1" />
              New Tab
            </Button>
          )}

          <Button variant="outline" size="sm" onClick={copyInviteCode}>
            <Copy className="h-4 w-4 mr-1" />
            {currentSession.invite_code}
          </Button>
          
          <Button 
            size="sm" 
            onClick={requestAISuggestions}
            disabled={isLoadingSuggestions}
          >
            {isLoadingSuggestions ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-1" />
            )}
            AI
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Code Editor + Preview */}
        <div className="flex-1 flex flex-col">
          <div className={`${previewHtml ? 'h-1/2' : 'h-full'} relative`}>
            <Editor
              height="100%"
              language={currentSession.language}
              value={code}
              onChange={handleCodeChange}
              onMount={handleEditorMount}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true,
              }}
            />

            {/* Participant Cursors Overlay */}
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none">
              {participants.filter(p => p.user_id !== user.id).map(p => (
                <div
                  key={p.id}
                  className="absolute text-xs px-1 rounded"
                  style={{
                    backgroundColor: p.cursor_color,
                    top: `${(p.cursor_line - 1) * 19}px`,
                    left: `${p.cursor_column * 7.8 + 60}px`
                  }}
                >
                  {p.display_name}
                </div>
              ))}
            </div>
          </div>

          {/* Live Preview */}
          {previewHtml && (
            <div className="h-1/2 border-t border-border/50">
              <div className="flex items-center justify-between px-3 py-1 bg-muted/30 border-b border-border/30">
                <span className="text-xs font-medium flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  Live Preview
                </span>
                <Button variant="ghost" size="sm" onClick={() => setPreviewHtml(null)} className="h-6 px-2">
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <iframe
                srcDoc={previewHtml}
                className="w-full h-[calc(100%-28px)] bg-white"
                sandbox="allow-scripts"
                title="Code Preview"
              />
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-72 border-l border-border/50 flex flex-col">
          <Tabs defaultValue="suggestions" className="flex-1 flex flex-col">
            <TabsList className="mx-2 mt-2">
              <TabsTrigger value="suggestions" className="flex-1 text-xs">
                <Lightbulb className="h-3 w-3 mr-1" />
                AI ({suggestions.length})
              </TabsTrigger>
              <TabsTrigger value="participants" className="flex-1 text-xs">
                <Users className="h-3 w-3 mr-1" />
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="flex-1 m-0 p-2 overflow-hidden">
              <ScrollArea className="h-full">
                {suggestions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Click "AI" for suggestions</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {suggestions.map(s => (
                      <Card key={s.id} className="p-2 bg-card/50">
                        <div className="flex items-start gap-2">
                          {getSuggestionIcon(s.suggestion_type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium capitalize">
                              {s.suggestion_type.replace('_', ' ')}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {s.explanation}
                            </p>
                            {s.line_number && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                Line {s.line_number}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-7 text-xs"
                            onClick={() => applySuggestion(s)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Apply
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2"
                            onClick={() => dismissSuggestion(s.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="participants" className="flex-1 m-0 p-2 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {participants.map(p => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-card/50"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: p.cursor_color }}
                      />
                      <span className="flex-1 truncate text-sm">
                        {p.display_name}
                        {p.user_id === user.id && ' (You)'}
                      </span>
                      {p.is_online && (
                        <Badge variant="outline" className="text-xs text-green-400 border-green-500/30">
                          Online
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
