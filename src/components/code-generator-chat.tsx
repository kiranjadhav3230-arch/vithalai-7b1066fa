import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Code, Copy, Download, Send, Loader2, Paperclip, X, Image as ImageIcon, FileText, Code2, FolderDown } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { User } from '@supabase/supabase-js';
import JSZip from 'jszip';

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

const CODE_TASKS = [
  { value: 'generate', label: 'Generate' },
  { value: 'explain', label: 'Explain' },
  { value: 'fix', label: 'Fix Bugs' },
  { value: 'optimize', label: 'Optimize' },
  { value: 'translate', label: 'Translate Code' },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  isCode: boolean;
  attachments?: Array<{ type: 'image' | 'document'; data: string; name: string }>;
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
  const [sourceLanguage, setSourceLanguage] = useState('javascript');
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [attachments, setAttachments] = useState<Array<{ type: 'image' | 'document'; data: string; name: string }>>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        toast({ title: "File too large", description: `${file.name} exceeds 10MB limit`, variant: "destructive" });
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        const type = file.type.startsWith('image/') ? 'image' : 'document';
        setAttachments(prev => [...prev, { type, data: result, name: file.name }]);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      swift: 'swift',
      kotlin: 'kt',
      r: 'r',
      scala: 'scala',
      dart: 'dart',
      sql: 'sql',
      html: 'html',
      css: 'css',
    };
    return extensions[language] || 'txt';
  };

  const openInVSCodeWeb = async (code: string, language: string) => {
    const extension = getFileExtension(language);
    const fileName = `generated-code.${extension}`;
    
    try {
      // Copy code to clipboard first
      await navigator.clipboard.writeText(code);
      
      // Create and download the file
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Open VS Code Web immediately
      setTimeout(() => {
        window.open('https://vscode.dev/', '_blank');
      }, 100);
      
      toast({
        title: "Opening VS Code Web",
        description: `File downloaded as ${fileName}. Drag it into VS Code or press Ctrl+V to paste the code.`,
        duration: 5000,
      });
    } catch (error) {
      // Fallback
      try {
        await navigator.clipboard.writeText(code);
        window.open('https://vscode.dev/', '_blank');
        toast({
          title: "Code Copied",
          description: "VS Code Web opened. Press Ctrl+N for new file, then Ctrl+V to paste.",
          duration: 5000,
        });
      } catch {
        window.open('https://vscode.dev/', '_blank');
        toast({
          title: "VS Code Web Opened",
          description: "Please manually copy the code above.",
          variant: "destructive",
        });
      }
    }
  };

  const openInLocalVSCode = async (code: string, language: string) => {
    const extension = getFileExtension(language);
    const fileName = `generated-code.${extension}`;
    
    try {
      if ('showSaveFilePicker' in window) {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: [{
            description: 'Code File',
            accept: { 'text/plain': [`.${extension}`] }
          }]
        });
        
        const writable = await handle.createWritable();
        await writable.write(code);
        await writable.close();
        
        toast({
          title: "File Saved",
          description: "Open the file in VS Code to start editing",
        });
      } else {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
        toast({
          title: "File Downloaded",
          description: "Open the downloaded file in VS Code",
        });
      }
    } catch (error) {
      console.log('Save cancelled or failed');
    }
  };

  const downloadAsProject = async (code: string, language: string) => {
    const zip = new JSZip();
    const extension = getFileExtension(language);
    
    if (language === 'javascript' || language === 'typescript') {
      zip.file(`src/index.${extension}`, code);
      zip.file('package.json', JSON.stringify({
        name: 'generated-project',
        version: '1.0.0',
        main: `src/index.${extension}`,
        scripts: {
          start: `node src/index.${extension}`
        }
      }, null, 2));
    } else if (language === 'python') {
      zip.file('main.py', code);
      zip.file('requirements.txt', '# Add dependencies here');
    } else if (language === 'html') {
      zip.file('index.html', code);
      zip.file('styles.css', '/* Add your styles here */');
      zip.file('script.js', '// Add your JavaScript here');
    } else {
      zip.file(`main.${extension}`, code);
    }
    
    zip.file('.vscode/settings.json', JSON.stringify({
      'editor.formatOnSave': true,
      'editor.tabSize': 2,
    }, null, 2));
    
    zip.file('README.md', `# Generated Project\n\nGenerated by Vithal AI Code Generator\n\n## Usage\n\nOpen this folder in VS Code to start developing.`);
    
    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-project.zip';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Project Downloaded",
      description: "Extract the ZIP and open in VS Code",
    });
  };

  const parseResponse = (text: string) => {
    const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
    const parts: Array<{ type: 'text' | 'code', content: string, language?: string }> = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textContent = text.substring(lastIndex, match.index).trim();
        if (textContent) parts.push({ type: 'text', content: textContent });
      }
      const langMatch = text.substring(match.index, match.index + 10).match(/```(\w+)/);
      parts.push({ 
        type: 'code', 
        content: match[1], 
        language: langMatch ? langMatch[1] : selectedLanguage 
      });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      const textContent = text.substring(lastIndex).trim();
      if (textContent) parts.push({ type: 'text', content: textContent });
    }

    return parts.length > 0 ? parts : [{ type: 'code', content: text, language: selectedLanguage }];
  };

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;

    const userMsg: Message = { 
      id: Date.now().toString(), 
      role: 'user', 
      content: input, 
      isCode: false,
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    setMessages(prev => [...prev, userMsg]);
    
    const currentInput = input;
    const currentAttachments = [...attachments];
    setInput('');
    setAttachments([]);
    setIsGenerating(true);
    setProgress(0);

    const interval = setInterval(() => setProgress(p => Math.min(p + 10, 90)), 200);

    try {
      const requestBody = selectedTask === 'translate' 
        ? { prompt: currentInput, task: selectedTask, sourceLanguage, targetLanguage, attachments: currentAttachments }
        : { prompt: currentInput, language: selectedLanguage, task: selectedTask, attachments: currentAttachments };

      const { data, error } = await supabase.functions.invoke('code-generator-gemini', {
        body: requestBody
      });

      clearInterval(interval);
      setProgress(100);

      if (error) throw error;

      const responseText = data.code || data.translation;
      const parsedParts = parseResponse(responseText);
      
      parsedParts.forEach((part, index) => {
        const aiMsg: Message = { 
          id: `${Date.now()}-${index}`, 
          role: 'assistant', 
          content: part.content, 
          isCode: part.type === 'code', 
          language: part.language || selectedLanguage 
        };
        setMessages(prev => [...prev, aiMsg]);
      });

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
                <SelectTrigger className="w-32 h-8"><SelectValue placeholder="From" /></SelectTrigger>
                <SelectContent className="bg-background z-50 max-h-[300px]">
                  {PROGRAMMING_LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                </SelectContent>
              </Select>
              <span className="flex items-center text-muted-foreground">→</span>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger className="w-32 h-8"><SelectValue placeholder="To" /></SelectTrigger>
                <SelectContent className="bg-background z-50 max-h-[300px]">
                  {PROGRAMMING_LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
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
                    <div className="relative">
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCode(msg.content)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openInVSCodeWeb(msg.content, msg.language || 'javascript')}
                        >
                          <Code2 className="h-4 w-4 mr-2" />
                          VS Code Web
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openInLocalVSCode(msg.content, msg.language || 'javascript')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Save Local
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadAsProject(msg.content, msg.language || 'javascript')}
                        >
                          <FolderDown className="h-4 w-4 mr-2" />
                          Project ZIP
                        </Button>
                      </div>
                      <div className="rounded-lg overflow-hidden border">
                        <div className="bg-muted px-3 py-1.5"><Badge variant="outline" className="text-xs">{msg.language}</Badge></div>
                        <SyntaxHighlighter 
                          language={msg.language} 
                          style={vscDarkPlus} 
                          showLineNumbers={true}
                          customStyle={{ margin: 0, fontSize: '15px', padding: '14px', lineHeight: '1.6' }}
                          codeTagProps={{
                            style: {
                              fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', 'Monaco', monospace",
                              fontSize: '15px',
                            }
                          }}
                        >
                          {msg.content}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="text-sm">{msg.content}</div>
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {msg.attachments.map((att, i) => (
                            <div key={i} className="relative">
                              {att.type === 'image' ? (
                                <img src={att.data} alt={att.name} className="max-w-[200px] rounded border" />
                              ) : (
                                <div className="flex items-center gap-2 border rounded p-2 bg-background/50">
                                  <FileText className="w-4 h-4" />
                                  <span className="text-xs">{att.name}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {isGenerating && <div className="px-4 py-2"><Progress value={progress} className="h-1" /></div>}

      <div className="border-t p-4">
        <div className="max-w-4xl mx-auto">
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {attachments.map((att, i) => (
                <div key={i} className="relative group">
                  {att.type === 'image' ? (
                    <div className="relative">
                      <img src={att.data} alt={att.name} className="max-w-[120px] h-[120px] object-cover rounded border" />
                      <Button size="sm" variant="destructive" onClick={() => removeAttachment(i)} className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 border rounded p-2 pr-8 bg-muted relative">
                      <FileText className="w-4 h-4" />
                      <span className="text-xs max-w-[150px] truncate">{att.name}</span>
                      <Button size="sm" variant="ghost" onClick={() => removeAttachment(i)} className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100">
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex gap-2">
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,.pdf,.doc,.docx" multiple className="hidden" />
            <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isGenerating || attachments.length >= 5} className="h-auto">
              <Paperclip className="w-4 h-4" />
            </Button>
            <Textarea 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder={selectedTask === 'translate' ? "Paste code to translate..." : "Describe what you want or attach a UI screenshot..."} 
              className="min-h-[80px]" 
              onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleSend(); }} 
            />
            <Button onClick={handleSend} disabled={isGenerating} className="h-auto">{isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 text-center">Ctrl+Enter to send • Attach UI screenshots or designs (max 5 files, 10MB each)</p>
        </div>
      </div>
    </div>
  );
};
