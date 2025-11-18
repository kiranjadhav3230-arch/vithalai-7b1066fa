import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Code, Copy, Download, Send, Loader2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { User } from '@supabase/supabase-js';

const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'typescript', label: 'TypeScript' },
];

const CODE_TASKS = [
  { value: 'generate', label: 'Generate' },
  { value: 'explain', label: 'Explain' },
  { value: 'fix', label: 'Fix Bugs' },
  { value: 'optimize', label: 'Optimize' },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  isCode: boolean;
}

interface CodeGeneratorChatProps {
  user: User;
  sessionId?: string | null;
}

export const CodeGeneratorChat: React.FC<CodeGeneratorChatProps> = ({ user, sessionId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedTask, setSelectedTask] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (sessionId) {
      setCurrentSessionId(sessionId);
      loadMessages(sessionId);
    }
  }, [sessionId]);

  const loadMessages = async (sid: string) => {
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sid)
      .order('created_at');
    
    if (data) {
      const msgs: Message[] = [];
      data.forEach(m => {
        msgs.push({ id: m.id, role: 'user', content: m.message, isCode: false });
        if (m.response) msgs.push({ id: m.id + '-ai', role: 'assistant', content: m.response, isCode: true, language: selectedLanguage });
      });
      setMessages(msgs);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input, isCode: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => setProgress(p => Math.min(p + 10, 90)), 200);

    try {
      const { data, error } = await supabase.functions.invoke('code-generator-gemini', {
        body: { prompt: input, language: selectedLanguage, task: selectedTask }
      });

      clearInterval(interval);
      setProgress(100);

      if (error) throw error;

      const aiMsg: Message = { id: Date.now().toString(), role: 'assistant', content: data.code, isCode: true, language: selectedLanguage };
      setMessages(prev => [...prev, aiMsg]);

      if (currentSessionId) {
        await supabase.from('chat_messages').insert({
          session_id: currentSessionId,
          user_id: user.id,
          message: input,
          response: data.code,
          message_type: 'code'
        });
      }

      toast({ title: "Success", description: "Code generated!" });
    } catch (error: any) {
      clearInterval(interval);
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setTimeout(() => { setIsGenerating(false); setProgress(0); }, 500);
    }
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Code copied to clipboard" });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Code Assistant</h2>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTask} onValueChange={setSelectedTask}>
            <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>{CODE_TASKS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-28 h-8"><SelectValue /></SelectTrigger>
            <SelectContent>{PROGRAMMING_LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Code className="w-16 h-16 mb-4 opacity-20" />
            <p className="text-sm">Start coding with AI assistance</p>
          </div>
        ) : (
          <div className="space-y-3 max-w-4xl mx-auto">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-lg p-3' : ''}`}>
                  {msg.isCode ? (
                    <div className="relative group">
                      <Button size="sm" variant="ghost" onClick={() => copyCode(msg.content)} className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 z-10 h-7 w-7 p-0">
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                      <div className="rounded-lg overflow-hidden border">
                        <div className="bg-muted px-3 py-1.5"><Badge variant="outline" className="text-xs">{msg.language}</Badge></div>
                        <SyntaxHighlighter language={msg.language} style={vscDarkPlus} customStyle={{ margin: 0, fontSize: '13px', padding: '12px' }}>
                          {msg.content}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  ) : <div className="text-sm">{msg.content}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {isGenerating && <div className="px-4 py-2"><Progress value={progress} className="h-1" /></div>}

      <div className="border-t p-4">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Describe what you want to build..." className="min-h-[80px]" onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSend(); }} />
          <Button onClick={handleSend} disabled={isGenerating} className="h-auto">{isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-center">Ctrl+Enter to send</p>
      </div>
    </div>
  );
};
