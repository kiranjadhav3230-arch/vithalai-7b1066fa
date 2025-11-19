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
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'r', label: 'R' },
  { value: 'scala', label: 'Scala' },
  { value: 'dart', label: 'Dart' },
  { value: 'sql', label: 'SQL' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
];

const HUMAN_LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi (हिन्दी)' },
  { value: 'mr', label: 'Marathi (मराठी)' },
  { value: 'es', label: 'Spanish (Español)' },
  { value: 'fr', label: 'French (Français)' },
  { value: 'de', label: 'German (Deutsch)' },
  { value: 'zh', label: 'Chinese (中文)' },
  { value: 'ja', label: 'Japanese (日本語)' },
  { value: 'ko', label: 'Korean (한국어)' },
  { value: 'ar', label: 'Arabic (العربية)' },
  { value: 'pt', label: 'Portuguese (Português)' },
  { value: 'ru', label: 'Russian (Русский)' },
  { value: 'it', label: 'Italian (Italiano)' },
  { value: 'bn', label: 'Bengali (বাংলা)' },
  { value: 'ta', label: 'Tamil (தமிழ்)' },
];

const CODE_TASKS = [
  { value: 'generate', label: 'Generate' },
  { value: 'explain', label: 'Explain' },
  { value: 'fix', label: 'Fix Bugs' },
  { value: 'optimize', label: 'Optimize' },
  { value: 'translate', label: 'Translate Languages' },
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
  const [sourceLanguage, setSourceLanguage] = useState('en');
  const [targetLanguage, setTargetLanguage] = useState('hi');
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
      const requestBody = selectedTask === 'translate' 
        ? { prompt: input, task: selectedTask, sourceLanguage, targetLanguage }
        : { prompt: input, language: selectedLanguage, task: selectedTask };

      const { data, error } = await supabase.functions.invoke('code-generator-gemini', {
        body: requestBody
      });

      clearInterval(interval);
      setProgress(100);

      if (error) throw error;

      const aiMsg: Message = { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: data.code || data.translation, 
        isCode: selectedTask !== 'translate', 
        language: selectedTask === 'translate' ? undefined : selectedLanguage 
      };
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
        <div className="flex gap-2 flex-wrap">
          <Select value={selectedTask} onValueChange={setSelectedTask}>
            <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
            <SelectContent className="bg-background z-50">
              {CODE_TASKS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
          
          {selectedTask === 'translate' ? (
            <>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger className="w-40 h-8"><SelectValue placeholder="From Language" /></SelectTrigger>
                <SelectContent className="bg-background z-50 max-h-[300px]">
                  {HUMAN_LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <span className="flex items-center text-muted-foreground">→</span>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-40 h-8"><SelectValue placeholder="To Language" /></SelectTrigger>
                <SelectContent className="bg-background z-50 max-h-[300px]">
                  {HUMAN_LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </>
          ) : (
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-background z-50 max-h-[300px]">
                {PROGRAMMING_LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
              </SelectContent>
            </Select>
          )}
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
                        <SyntaxHighlighter 
                          language={msg.language} 
                          style={vscDarkPlus} 
                          showLineNumbers={true}
                          customStyle={{ margin: 0, fontSize: '13px', padding: '12px' }}
                        >
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
          <Textarea 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder={selectedTask === 'translate' ? "Enter text to translate..." : "Describe what you want to build..."} 
            className="min-h-[80px]" 
            onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSend(); }} 
          />
          <Button onClick={handleSend} disabled={isGenerating} className="h-auto">{isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1.5 text-center">Ctrl+Enter to send</p>
      </div>
    </div>
  );
};
