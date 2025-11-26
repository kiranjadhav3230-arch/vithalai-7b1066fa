import React, { useState, useEffect, useRef } from 'react';
import { FileText, Plus, Search, Send, Loader2, Sparkles, Download, Share2, Settings, MoreVertical, BookOpen, Mic, Video, Brain, FileQuestion, Zap, BookmarkPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface NotebookLMInterfaceProps {
  user: any;
  onLogout: () => void;
}

interface Document {
  id: string;
  title: string;
  file_url: string;
  document_text: string | null;
  analysis_result: any;
  analysis_status: string | null;
  created_at: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: string[];
}

export const NotebookLMInterface: React.FC<NotebookLMInterfaceProps> = ({ user, onLogout }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [notebookTitle, setNotebookTitle] = useState('Untitled Notebook');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadDocuments();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
      
      // Auto-select all documents
      if (data && data.length > 0) {
        setSelectedDocs(new Set(data.map(d => d.id)));
        if (data.length === 1) {
          setNotebookTitle(data[0].title);
        }
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('Failed to load documents');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    setIsUploading(true);
    try {
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Extract text from PDF (simplified - in production, use proper PDF parser)
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        
        // Insert document record
        const { data: docData, error: insertError } = await supabase
          .from('documents')
          .insert({
            user_id: user.id,
            title: file.name.replace('.pdf', ''),
            file_url: publicUrl,
            file_size: file.size,
            document_text: text.substring(0, 50000), // Limit text size
            analysis_status: 'pending'
          })
          .select()
          .single();

        if (insertError) throw insertError;

        // Trigger analysis
        const { error: functionError } = await supabase.functions.invoke('document-analyzer', {
          body: {
            documentId: docData.id,
            documentText: text.substring(0, 50000)
          }
        });

        if (functionError) {
          console.error('Analysis error:', functionError);
          toast.warning('Document uploaded but analysis failed');
        } else {
          toast.success('Document uploaded and analysis started');
        }

        loadDocuments();
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleDocumentSelection = (docId: string) => {
    const newSelected = new Set(selectedDocs);
    if (newSelected.has(docId)) {
      newSelected.delete(docId);
    } else {
      newSelected.add(docId);
    }
    setSelectedDocs(newSelected);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;
    if (selectedDocs.size === 0) {
      toast.error('Please select at least one document');
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Get selected documents content
      const selectedDocuments = documents.filter(d => selectedDocs.has(d.id));
      const context = selectedDocuments.map(d => ({
        title: d.title,
        content: d.document_text || '',
        analysis: d.analysis_result
      }));

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: {
          message: input,
          context: JSON.stringify(context),
          conversationHistory: messages.slice(-5) // Last 5 messages for context
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        sources: selectedDocuments.map(d => d.title)
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to get response');
      setMessages(prev => prev.slice(0, -1)); // Remove user message on error
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    'Summarize the key points from these documents',
    'What are the main topics discussed?',
    'Create a study guide based on this content',
    'What questions might be asked about this material?'
  ];

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">{notebookTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Content - 3 Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Sources */}
        <div className="w-80 border-r border-border flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Sources</h2>
              <Button variant="ghost" size="icon">
                <BookOpen className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Add sources
                </>
              )}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <ScrollArea className="flex-1 p-4">
            {documents.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No documents yet</p>
                <p className="text-xs mt-1">Upload PDFs to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (selectedDocs.size === documents.length) {
                      setSelectedDocs(new Set());
                    } else {
                      setSelectedDocs(new Set(documents.map(d => d.id)));
                    }
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent rounded-md flex items-center gap-2"
                >
                  <input
                    type="checkbox"
                    checked={selectedDocs.size === documents.length}
                    onChange={() => {}}
                    className="w-4 h-4"
                  />
                  Select all sources
                </button>
                
                {documents.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => toggleDocumentSelection(doc.id)}
                    className="w-full text-left px-3 py-2 hover:bg-accent rounded-md flex items-center gap-3"
                  >
                    <input
                      type="checkbox"
                      checked={selectedDocs.has(doc.id)}
                      onChange={() => {}}
                      className="w-4 h-4"
                    />
                    <FileText className="w-5 h-5 text-destructive flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{doc.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.analysis_status === 'completed' ? 'Analyzed' : 'Processing...'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Middle Panel - Chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">Chat</h2>
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xs">i</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Zap className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6">
            {messages.length === 0 && documents.length > 0 ? (
              <div className="max-w-2xl mx-auto text-center py-12">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-2">{notebookTitle}</h3>
                <p className="text-muted-foreground mb-4">
                  {selectedDocs.size} source{selectedDocs.size !== 1 ? 's' : ''} selected
                </p>
                <p className="text-sm text-muted-foreground">
                  Ask questions about your documents or explore the content
                </p>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6">
                {messages.map((msg, idx) => (
                  <div key={idx} className={msg.role === 'user' ? 'flex justify-end' : ''}>
                    <div className={`${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-4 max-w-[80%]`}>
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-border/50">
                          <p className="text-xs opacity-70">
                            Sources: {msg.sources.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Analyzing documents...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t border-border">
            {messages.length === 0 && selectedDocs.size > 0 && (
              <div className="mb-3 flex gap-2 flex-wrap">
                {suggestedQuestions.map((q, idx) => (
                  <Button
                    key={idx}
                    variant="outline"
                    size="sm"
                    onClick={() => setInput(q)}
                    className="text-xs"
                  >
                    {q}
                  </Button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={selectedDocs.size > 0 ? "Ask about your sources..." : "Select sources first..."}
                disabled={isLoading || selectedDocs.size === 0}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim() || selectedDocs.size === 0}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              {selectedDocs.size} source{selectedDocs.size !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Right Panel - Studio */}
        <div className="w-96 border-l border-border flex flex-col">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold">Studio</h2>
            <Button variant="ghost" size="icon">
              <BookOpen className="w-4 h-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <Card className="mb-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Create an Audio Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Generate a podcast-style audio discussion about your sources
                </p>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1" disabled>
                    <Mic className="w-3 h-3 mr-1" />
                    Audio
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    <Download className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <Video className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Video Overview</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full" disabled>
                    <Plus className="w-3 h-3 mr-1" />
                    Create
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <Brain className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Mind Map</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full" disabled>
                    <Plus className="w-3 h-3 mr-1" />
                    Create
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Reports</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full" disabled>
                    <Plus className="w-3 h-3 mr-1" />
                    Create
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors">
                <CardContent className="p-4 text-center">
                  <BookmarkPlus className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Flashcards</p>
                  <Button size="sm" variant="outline" className="mt-2 w-full" disabled>
                    <Plus className="w-3 h-3 mr-1" />
                    Create
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:bg-accent transition-colors col-span-2">
                <CardContent className="p-4 text-center">
                  <FileQuestion className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm font-medium">Quiz</p>
                  <Button size="sm" variant="outline" className="mt-2" disabled>
                    <Plus className="w-3 h-3 mr-1" />
                    Create Quiz
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <h3 className="text-sm font-semibold mb-2">Recent Creations</h3>
              <p className="text-xs text-muted-foreground text-center py-4">
                No creations yet
              </p>
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <Button variant="outline" size="sm" className="w-full">
              <BookmarkPlus className="w-3 h-3 mr-2" />
              Add note
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
