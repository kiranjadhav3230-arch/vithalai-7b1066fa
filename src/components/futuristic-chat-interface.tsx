import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Plus, 
  MessageSquare, 
  Trash2, 
  User as UserIcon, 
  Bot,
  Settings,
  LogOut,
  Camera,
  Loader2,
  X,
  Globe
} from 'lucide-react';
import vithalLogo from '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileModal } from './profile-modal';
import { ContactSupportModal } from './contact-support-modal';
import type { User } from '@supabase/supabase-js';

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
}

interface ChatMessage {
  id: string;
  session_id: string;
  message: string;
  response: string | null;
  message_type: string;
  created_at: string;
}

interface FuturisticChatInterfaceProps {
  user: User;
  onLogout: () => void;
}

export const FuturisticChatInterface: React.FC<FuturisticChatInterfaceProps> = ({ user, onLogout }) => {
  const [message, setMessage] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    loadChatSessions();
    createNewSession();
  }, []);

  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
    }
  }, [currentSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const loadChatSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChatSessions(data || []);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };

  const loadMessages = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const createNewSession = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert({
          user_id: user.id,
          title: 'New Chat'
        })
        .select()
        .single();

      if (error) throw error;
      
      const newSession = data as ChatSession;
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
    } catch (error) {
      console.error('Error creating new session:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create new chat session"
      });
    }
  };

  const deleteSession = async (sessionId: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) throw error;
      
      setChatSessions(prev => prev.filter(s => s.id !== sessionId));
      
      if (currentSession?.id === sessionId) {
        const remainingSessions = chatSessions.filter(s => s.id !== sessionId);
        setCurrentSession(remainingSessions.length > 0 ? remainingSessions[0] : null);
        setMessages([]);
      }
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  };

  const updateSessionTitle = async (sessionId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title })
        .eq('id', sessionId);

      if (error) throw error;
      
      setChatSessions(prev => prev.map(s => 
        s.id === sessionId ? { ...s, title } : s
      ));
      
      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, title } : null);
      }
    } catch (error) {
      console.error('Error updating session title:', error);
    }
  };

  const generateSessionTitle = async (sessionId: string, userMessage: string, aiResponse: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          message: `Generate a concise 3-5 word title for this conversation topic. User asked: "${userMessage}" AI responded: "${aiResponse.substring(0, 200)}..." Just respond with the title only, no extra text.`,
          language: language,
          sessionId: sessionId
        }
      });

      if (!error && data?.response) {
        const title = data.response.trim().replace(/['"]/g, '');
        updateSessionTitle(sessionId, title);
      }
    } catch (error) {
      console.error('Error generating title:', error);
      const fallbackTitle = userMessage.length > 30 ? 
        userMessage.substring(0, 30) + '...' : userMessage;
      updateSessionTitle(sessionId, fallbackTitle);
    }
  };

  const sendMessage = async () => {
    if ((!message.trim() && !selectedImage) || loading) return;

    if (!currentSession) {
      await createNewSession();
      return;
    }

    setLoading(true);
    const userMessage = message.trim() || (selectedImage ? "📷 Image shared for analysis" : "");
    const hasImage = !!selectedImage;
    setMessage('');
    
    const imageDataToSend = imageFile;
    setSelectedImage(null);
    setImageFile(null);

    const tempMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: currentSession.id,
      message: userMessage,
      response: null,
      message_type: hasImage ? 'image' : 'text',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      let base64Data = null;
      if (imageDataToSend) {
        const reader = new FileReader();
        base64Data = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            const result = e.target?.result as string;
            resolve(result.split(',')[1]);
          };
          reader.readAsDataURL(imageDataToSend);
        });
      }

      const requestBody: any = { 
        message: userMessage,
        language: language,
        sessionId: currentSession.id,
        userProfile: {
          userId: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Friend'
        }
      };
      
      if (base64Data) {
        requestBody.imageData = base64Data;
      }

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: requestBody
      });

      if (error) throw error;
      if (!data || !data.response) throw new Error('No response from AI');

      const { data: savedMessage, error: saveError } = await supabase
        .from('chat_messages')
        .insert({
          session_id: currentSession.id,
          user_id: user.id,
          message: userMessage,
          response: data.response,
          message_type: hasImage ? 'image' : 'text'
        })
        .select()
        .single();

      if (saveError) throw saveError;

      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? (savedMessage as ChatMessage) : msg
      ));

      if (messages.length === 0) {
        generateSessionTitle(currentSession.id, userMessage, data.response);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image file"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Image size must be less than 5MB"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setSelectedImage(imageDataUrl);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImageFile(null);
  };

  const startVoiceRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Not Supported",
        description: "Speech recognition is not supported in your browser"
      });
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';

    recognitionInstance.onstart = () => {
      setIsRecording(true);
    };

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsRecording(false);
    };

    recognitionInstance.onerror = () => {
      setIsRecording(false);
      toast({
        variant: "destructive",
        title: "Speech Error",
        description: "Failed to recognize speech. Please try again."
      });
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    recognitionInstance.start();
  };

  const AppSidebar = () => (
    <Sidebar className="sidebar-glass">
      <div className="flex items-center justify-between p-6 border-b border-sidebar-border/30">
        <div className="flex items-center gap-3">
          <img src={vithalLogo} alt="Vithal AI" className="h-8 w-8" />
          <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Vithal AI
          </h2>
        </div>
        <Button
          onClick={createNewSession}
          size="sm"
          className="floating-action-btn h-8 w-8 p-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <SidebarContent className="px-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground font-medium">Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {chatSessions.map((session) => (
                <SidebarMenuItem key={session.id}>
                  <SidebarMenuButton
                    onClick={() => setCurrentSession(session)}
                    className={`w-full justify-between group rounded-xl transition-all duration-300 ${
                      currentSession?.id === session.id 
                        ? 'bg-primary/20 text-primary border border-primary/30' 
                        : 'hover:bg-card/50 hover:border border-border/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate text-sm">{session.title}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-background/95">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-card/80 backdrop-blur-md border-b border-border/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarImage src={vithalLogo} />
                    <AvatarFallback className="bg-primary/20">
                      <Bot className="h-5 w-5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h1 className="text-lg font-bold">Vithal AI Assistant</h1>
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/30">
                      Advanced AI • Professional
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'mr')}
                  className="px-3 py-2 rounded-xl bg-card/50 border border-border/30 text-sm"
                >
                  <option value="en">🇺🇸 English</option>
                  <option value="hi">🇮🇳 हिंदी</option>
                  <option value="mr">🇮🇳 मराठी</option>
                </select>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfile(true)}
                  className="rounded-xl hover:bg-card/50"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Profile
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="rounded-xl hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col relative">
            <ScrollArea className="flex-1 p-6">
              <div className="message-container max-w-4xl mx-auto">
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                      <Bot className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Welcome to Vithal AI</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Start a conversation to get personalized career guidance, course recommendations, and expert advice.
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <div key={msg.id} className="flex gap-4 mb-6">
                    {msg.response ? (
                      <>
                        {/* User Message */}
                        <div className="flex justify-end w-full mb-2">
                          <div className="chat-bubble-user">
                            <p className="text-sm font-medium">{msg.message}</p>
                          </div>
                        </div>
                        
                        {/* AI Response */}
                        <div className="flex gap-3 w-full">
                          <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                            <AvatarImage src={vithalLogo} />
                            <AvatarFallback className="bg-primary/20">
                              <Bot className="h-4 w-4 text-primary" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="chat-bubble-ai">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.response}</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      /* User Message Only */
                      <div className="flex justify-end w-full">
                        <div className="chat-bubble-user">
                          <p className="text-sm font-medium">{msg.message}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {loading && (
                  <div className="flex gap-3 mb-6">
                    <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                      <AvatarImage src={vithalLogo} />
                      <AvatarFallback className="bg-primary/20">
                        <Bot className="h-4 w-4 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="typing-indicator">
                      <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
                      <div className="typing-dot" style={{ animationDelay: '160ms' }}></div>
                      <div className="typing-dot" style={{ animationDelay: '320ms' }}></div>
                      <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
                    </div>
                  </div>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>

            {/* Image Preview */}
            {selectedImage && (
              <div className="px-6 pb-4">
                <div className="max-w-4xl mx-auto">
                  <div className="relative inline-block">
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="h-20 w-20 object-cover rounded-xl border border-border/30"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={removeSelectedImage}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t border-border/30 bg-card/30 backdrop-blur-sm">
              <div className="max-w-4xl mx-auto">
                <div className="chat-input-container">
                  <div className="flex items-end gap-3">
                    <Textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Ask anything about your career..."
                      className="chat-input flex-1 min-h-[44px] max-h-[120px] resize-none"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      disabled={loading}
                    />
                    
                    <div className="flex items-center gap-2">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10"
                        disabled={loading}
                      >
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cameraInputRef.current?.click()}
                        className="h-10 w-10 p-0 rounded-xl hover:bg-primary/10"
                        disabled={loading}
                      >
                        <Camera className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={startVoiceRecording}
                        className={`h-10 w-10 p-0 rounded-xl ${isRecording ? 'bg-destructive/10 text-destructive pulse-glow' : 'hover:bg-primary/10'}`}
                        disabled={loading}
                      >
                        <Mic className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        onClick={sendMessage}
                        disabled={(!message.trim() && !selectedImage) || loading}
                        className="floating-action-btn h-10 w-10 p-0"
                      >
                        {loading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showProfile && (
          <ProfileModal 
            isOpen={showProfile}
            user={user} 
            onClose={() => setShowProfile(false)} 
          />
        )}

        {showContactModal && (
          <ContactSupportModal 
            isOpen={showContactModal}
            onClose={() => setShowContactModal(false)} 
          />
        )}
      </div>
    </SidebarProvider>
  );
};