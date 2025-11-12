import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Code, Copy, Download, Send, Sparkles, Bug, Zap, Languages, BookOpen, Loader2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { User } from '@supabase/supabase-js';

const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'php', label: 'PHP' },
  { value: 'sql', label: 'SQL' },
];

const CODE_TASKS = [
  { value: 'generate', label: 'Generate Code', icon: Code },
  { value: 'explain', label: 'Explain Code', icon: BookOpen },
  { value: 'fix', label: 'Fix Bugs', icon: Bug },
  { value: 'optimize', label: 'Optimize Code', icon: Zap },
  { value: 'translate', label: 'Translate Language', icon: Languages },
];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  isCode: boolean;
  timestamp: string;
}

interface CodeGeneratorChatProps {
  user: User;
}

export const CodeGeneratorChat: React.FC<CodeGeneratorChatProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedTask, setSelectedTask] = useState('generate');
  const [sourceLanguage, setSourceLanguage] = useState('javascript');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // Create a new session on component mount
    createNewCodeSession();
  }, []);

  const createNewCodeSession = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: '💻 New Code Session'
        })
        .select()
        .single();

      if (error) throw error;
      setCurrentSessionId(data.id);
    } catch (error) {
      console.error('Error creating code session:', error);
    }
  };

  const generateSmartCodeTitle = async (sessionId: string, task: string, language: string, prompt: string) => {
    try {
      let smartTitle = '💻 Code Session';
      
      const taskEmoji = {
        generate: '✨',
        explain: '📖',
        fix: '🔧',
        optimize: '⚡',
        translate: '🔄'
      }[task] || '💻';

      const shortPrompt = prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt;
      smartTitle = `${taskEmoji} ${language}: ${shortPrompt}`;

      await supabase
        .from('chat_sessions')
        .update({ title: smartTitle })
        .eq('id', sessionId);
    } catch (error) {
      console.error('Error generating smart code title:', error);
    }
  };

  const saveMessageToSession = async (userPrompt: string, aiResponse: string, task: string, language: string) => {
    if (!currentSessionId) return;

    try {
      // Save user message
      await supabase.from('chat_messages').insert({
        session_id: currentSessionId,
        user_id: user.id,
        message: userPrompt,
        message_type: 'code_user'
      });

      // Save AI response
      await supabase.from('chat_messages').insert({
        session_id: currentSessionId,
        user_id: user.id,
        message: aiResponse,
        response: aiResponse,
        message_type: 'code_assistant'
      });

      // Generate smart title if first message
      if (messages.length === 0) {
        await generateSmartCodeTitle(currentSessionId, task, language, userPrompt);
      }
    } catch (error) {
      console.error('Error saving message to session:', error);
    }
  };

  const generateResponse = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please enter your prompt or code",
        variant: "destructive",
      });
      return;
    }

    // For translate task, check if source language is selected
    if (selectedTask === 'translate' && sourceLanguage === selectedLanguage) {
      toast({
        title: "Error",
        description: "Please select different source and target languages",
        variant: "destructive",
      });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      isCode: selectedTask !== 'generate',
      language: selectedTask !== 'generate' ? sourceLanguage : undefined,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 95) return prev;
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      // Build prompt based on task
      let finalPrompt = input;
      if (selectedTask === 'translate') {
        finalPrompt = `Translate this ${sourceLanguage} code to ${selectedLanguage}:\n\n${input}`;
      }

      const { data, error } = await supabase.functions.invoke('code-generator-gemini', {
        body: {
          prompt: finalPrompt,
          language: selectedLanguage,
          task: selectedTask,
        },
      });

      clearInterval(progressInterval);
      setGenerationProgress(100);

      if (error) throw error;
      if (!data || !data.code) throw new Error('No response from AI');

      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.code,
        isCode: selectedTask !== 'explain',
        language: selectedLanguage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save to recent chats
      await saveMessageToSession(input, data.code, selectedTask, selectedLanguage);

      toast({
        title: "Success",
        description: getSuccessMessage(selectedTask),
      });
    } catch (error) {
      console.error('Generation error:', error);
      clearInterval(progressInterval);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate response",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 500);
    }
  };

  const getSuccessMessage = (task: string): string => {
    switch (task) {
      case 'generate': return 'Code generated successfully!';
      case 'explain': return 'Code explained successfully!';
      case 'fix': return 'Bugs fixed successfully!';
      case 'optimize': return 'Code optimized successfully!';
      case 'translate': return 'Code translated successfully!';
      default: return 'Success!';
    }
  };

  const copyMessage = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Content copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy content.",
        variant: "destructive",
      });
    }
  };

  const downloadCode = (content: string, language: string) => {
    const extension = language === 'javascript' ? 'js' :
                     language === 'python' ? 'py' :
                     language === 'java' ? 'java' :
                     language === 'cpp' ? 'cpp' :
                     language === 'typescript' ? 'ts' : 'txt';
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const TaskIcon = CODE_TASKS.find((t) => t.value === selectedTask)?.icon || Code;

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-background to-muted/20">
      <Card className="flex-1 flex flex-col border-none shadow-lg">
        <CardHeader className="border-b bg-card/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              AI Code Assistant
            </CardTitle>
            <Badge variant="outline" className="gap-1">
              <TaskIcon className="w-3 h-3" />
              {CODE_TASKS.find((t) => t.value === selectedTask)?.label}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-4">
                <TaskIcon className="w-16 h-16 opacity-20" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Start Your Coding Journey</h3>
                  <p className="text-sm">
                    {selectedTask === 'generate' && 'Describe what code you want to generate'}
                    {selectedTask === 'explain' && 'Paste code you want explained'}
                    {selectedTask === 'fix' && 'Paste code with bugs to fix'}
                    {selectedTask === 'optimize' && 'Paste code you want optimized'}
                    {selectedTask === 'translate' && 'Paste code to translate to another language'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {message.isCode ? (
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs">
                              {message.language}
                            </Badge>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyMessage(message.content)}
                                className="h-6 w-6 p-0"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                              {message.role === 'assistant' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => downloadCode(message.content, message.language || 'txt')}
                                  className="h-6 w-6 p-0"
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <SyntaxHighlighter
                            language={message.language || 'javascript'}
                            style={vscDarkPlus}
                            showLineNumbers={true}
                            customStyle={{
                              margin: 0,
                              borderRadius: '0.5rem',
                              fontSize: '0.875rem',
                            }}
                          >
                            {message.content}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold opacity-70">
                              {message.role === 'user' ? 'You' : 'AI Assistant'}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyMessage(message.content)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Progress Bar */}
          {isGenerating && generationProgress > 0 && (
            <div className="px-4 py-2 border-t bg-muted/30">
              <div className="flex items-center gap-2">
                <Progress value={generationProgress} className="flex-1" />
                <span className="text-xs text-muted-foreground">{Math.round(generationProgress)}%</span>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t bg-card/50 backdrop-blur-sm p-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              <Select value={selectedTask} onValueChange={setSelectedTask}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CODE_TASKS.map((task) => {
                    const Icon = task.icon;
                    return (
                      <SelectItem key={task.value} value={task.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {task.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {selectedTask === 'translate' && (
                <>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAMMING_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="flex items-center text-muted-foreground">→</span>
                </>
              )}

              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={selectedTask === 'translate' ? 'To' : 'Language'} />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAMMING_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  selectedTask === 'generate'
                    ? "Describe the code you want to generate..."
                    : selectedTask === 'translate'
                    ? "Paste code to translate..."
                    : "Paste your code here..."
                }
                className="min-h-[100px] resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    generateResponse();
                  }
                }}
              />
              <Button
                onClick={generateResponse}
                disabled={isGenerating}
                className="self-end"
                size="lg"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {selectedTask === 'optimize' && '💡 Optimize improves code performance, readability, and follows best practices'}
              {selectedTask !== 'optimize' && 'Press Ctrl+Enter to send'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
