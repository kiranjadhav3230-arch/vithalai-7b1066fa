import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LanguageSelector } from '@/components/ui/language-selector';
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Plus, 
  MessageSquare, 
  Trash2, 
  User as UserIcon, 
  Settings,
  Loader2,
  LogOut,
  Globe,
  Camera,
  Volume2,
  VolumeX,
  Paperclip,
  X,
  User,
  Sparkles
} from 'lucide-react';
import vithalLogo from '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileModal } from './profile-modal';
import { ContactSupportModal } from './contact-support-modal';
import { TypewriterText } from './typewriter-text';
import { format } from 'date-fns';
import type { User as SupabaseUser } from '@supabase/supabase-js';

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

interface GeminiChatInterfaceProps {
  user: SupabaseUser;
  onLogout: () => void;
}

export const GeminiChatInterface: React.FC<GeminiChatInterfaceProps> = ({ user, onLogout }) => {
  const [message, setMessage] = useState('');
  const [recentSessions, setRecentSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [audioPlayback, setAudioPlayback] = useState<{ isPlaying: boolean; messageId: string; text: string } | null>(null);
  const [voiceTone, setVoiceTone] = useState<'male' | 'female'>('male');
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadRecentSessions();
    createNewSession();
  }, []);

  useEffect(() => {
    if (currentSession) {
      loadChatHistory(currentSession.id);
    }
  }, [currentSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRecentSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Filter out empty sessions and auto-delete them
      const sessionsWithMessages = [];
      for (const session of data || []) {
        const { data: messageCount } = await supabase
          .from('chat_messages')
          .select('id', { count: 'exact' })
          .eq('session_id', session.id);
        
        if (messageCount && messageCount.length > 0) {
          sessionsWithMessages.push(session);
        } else if (currentSession?.id !== session.id) {
          // Auto-delete empty sessions (except current one)
          await supabase
            .from('chat_sessions')
            .delete()
            .eq('id', session.id);
        }
      }
      
      setRecentSessions(sessionsWithMessages);
    } catch (error) {
      console.error('Error loading recent sessions:', error);
    }
  };

  const loadChatHistory = async (sessionId: string) => {
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading chat history:', error);
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
      setRecentSessions(prev => [newSession, ...prev]);
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

  const updateSessionTitle = async (sessionId: string, title: string) => {
    try {
      const { error } = await supabase
        .from('chat_sessions')
        .update({ title })
        .eq('id', sessionId);

      if (error) throw error;
      
      setRecentSessions(prev => prev.map(s => 
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
          language: language
        }
      });

      if (!error && data?.response) {
        const title = data.response.trim().replace(/['"]/g, ''); // Remove quotes
        updateSessionTitle(sessionId, title);
      }
    } catch (error) {
      console.error('Error generating title:', error);
      // Fallback to truncated user message
      const fallbackTitle = userMessage.length > 30 ? 
        userMessage.substring(0, 30) + '...' : userMessage;
      updateSessionTitle(sessionId, fallbackTitle);
    }
  };

  const sendMessage = async () => {
    if ((!message.trim() && !selectedImage)) return;

    // Ensure we have a session - create one if needed
    let sessionToUse = currentSession;
    if (!sessionToUse) {
      try {
        await createNewSession();
        // Wait a bit for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
        sessionToUse = currentSession;
        
        if (!sessionToUse) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create chat session"
          });
          return;
        }
      } catch (error) {
        console.error('Error creating session:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to create chat session"
        });
        return;
      }
    }

    setLoading(true);
    const userMessage = message.trim() || (selectedImage ? "📷 Image shared for analysis" : "");
    const hasImage = !!selectedImage;
    setMessage('');
    
    // Clear image preview after sending
    const imageDataToSend = imageFile;
    setSelectedImage(null);
    setImageFile(null);

    // Add user message to UI immediately
    const tempUserMessage: ChatMessage = {
      id: `temp-user-${Date.now()}`,
      session_id: sessionToUse.id,
      message: userMessage,
      response: null,
      message_type: hasImage ? 'image' : 'text',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      // Prepare image data if available
      let base64Data = null;
      if (imageDataToSend) {
        const reader = new FileReader();
        base64Data = await new Promise<string>((resolve) => {
          reader.onload = (e) => {
            const result = e.target?.result as string;
            resolve(result.split(',')[1]); // Remove data:image/...;base64, prefix
          };
          reader.readAsDataURL(imageDataToSend);
        });
      }

      // Call the Gemini function with language support and personalization
      const requestBody: any = { 
        message: userMessage,
        language: language,
        userProfile: {
          userId: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Friend'
        },
        sessionId: sessionToUse.id,
        previousMessages: messages.slice(-5).map(msg => ({
          message: msg.message,
          response: msg.response
        }))
      };
      
      if (base64Data) {
        requestBody.imageData = base64Data;
      }

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: requestBody
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data || !data.response) {
        throw new Error('No response from AI');
      }

      // Save user message to database with retry logic
      try {
        // Verify session exists before inserting message
        const { data: sessionCheck, error: sessionError } = await supabase
          .from('chat_sessions')
          .select('id')
          .eq('id', sessionToUse.id)
          .single();

        if (sessionError || !sessionCheck) {
          console.error('Session not found, creating new one:', sessionError);
          await createNewSession();
          await new Promise(resolve => setTimeout(resolve, 200));
          sessionToUse = currentSession;
        }

        if (sessionToUse?.id) {
          const { error: saveError } = await supabase
            .from('chat_messages')
            .insert({
              session_id: sessionToUse.id,
              user_id: user.id,
              message: userMessage,
              response: data.response,
              message_type: hasImage ? 'image' : 'text'
            });
          
          if (saveError) {
            console.error('Error saving message:', saveError);
          }
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
      }

      // Update the temporary message with the real response
      setMessages(prev => prev.map(msg => 
        msg.id === tempUserMessage.id 
          ? { ...msg, response: data.response, id: `msg-${Date.now()}` }
          : msg
      ));

      // Generate session title for first meaningful message
      if (messages.length === 0 && userMessage.length > 5) {
        await generateSessionTitle(sessionToUse.id, userMessage, data.response);
      }

      // Refresh sessions list
      await loadRecentSessions();

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Failed to send message. Please try again."
      });
      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid File",
        description: "Please select an image file"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File Too Large",
        description: "Image must be less than 5MB"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
    
    event.target.value = '';
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImageFile(null);
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
      return;
    }

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
      setIsListening(true);
    };

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsListening(false);
    };

    recognitionInstance.onerror = () => {
      setIsListening(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to recognize speech"
      });
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);
    recognitionInstance.start();
  };

  const playTextToSpeech = async (text: string) => {
    if (audioPlayback) {
      setAudioPlayback(null);
      return;
    }

    try {
      setAudioPlayback({ isPlaying: true, messageId: '', text });
      
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: text.substring(0, 500), // Limit text length
          voice: voiceTone === 'male' ? 'onwK4e9ZLuTAKqWW03F9' : '9BWtsMINqrJLrRacOk9x', // Daniel (male) or Aria (female)
          model: 'eleven_turbo_v2_5'
        }
      });

      if (error) {
        console.error('Text-to-speech error:', error);
        setAudioPlayback(null);
        
        // Show user-friendly error message
        if (error.message?.includes('Invalid API key') || error.message?.includes('401')) {
          toast({
            variant: "destructive",
            title: "API Key Required",
            description: "Please configure your ElevenLabs API key to use text-to-speech."
          });
        } else {
          toast({
            variant: "destructive",
            title: "Text-to-Speech Error",
            description: "Failed to generate audio. Please try again."
          });
        }
        return;
      }

      if (data?.audioContent) {
        // Convert base64 to blob
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        
        audio.onended = () => {
          setAudioPlayback(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setAudioPlayback(null);
          URL.revokeObjectURL(audioUrl);
          toast({
            variant: "destructive",
            title: "Audio Error",
            description: "Failed to play audio file."
          });
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing text-to-speech:', error);
      setAudioPlayback(null);
      toast({
        variant: "destructive",
        title: "Text-to-Speech Error",
        description: "An unexpected error occurred. Please try again."
      });
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar */}
      <aside className="w-80 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col animate-slide-in-right">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg animate-fade-in">Recent Chats</h2>
            <Button
              onClick={createNewSession}
              size="sm"
              className="h-8 w-8 p-0 hover-scale transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {recentSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground animate-fade-in">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent chats</p>
              </div>
            ) : (
              recentSessions.map((session, index) => (
                <button
                  key={session.id}
                  onClick={() => {
                    setCurrentSession(session);
                    loadChatHistory(session.id);
                  }}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 hover:bg-accent/50 hover-scale animate-fade-in ${
                    currentSession?.id === session.id ? 'bg-accent scale-105' : ''
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="font-medium text-sm truncate">
                    {session.title || 'New Chat'}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {format(new Date(session.created_at), 'MMM d, h:mm a')}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* User Profile Section */}
        <div className="mt-auto p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {user.user_metadata?.full_name || user.email}
                </div>
                <div className="text-xs text-muted-foreground">
                  Voice: {voiceTone === 'male' ? '♂ Male' : '♀ Female'}
                </div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowProfile(true)}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setVoiceTone(voiceTone === 'male' ? 'female' : 'male')}>
                  <Volume2 className="h-4 w-4 mr-2" />
                  Switch to {voiceTone === 'male' ? 'Female' : 'Male'} Voice
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-screen">
        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 max-w-4xl mx-auto">
              {messages.length === 0 && !loading && (
                <div className="text-center py-16 animate-fade-in">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-scale-in">
                    <img src={vithalLogo} alt="Vithal AI" className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-semibold mb-4">Welcome to Vithal AI</h2>
                  <p className="text-muted-foreground mb-8">
                    Your intelligent assistant for academics, career guidance, and problem-solving.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 border rounded-lg hover:bg-accent/10 transition-colors duration-200 animate-fade-in" style={{ animationDelay: '100ms' }}>
                      <h3 className="font-medium mb-2">📚 Academic Help</h3>
                      <p className="text-sm text-muted-foreground">Get assistance with subjects, assignments, and learning materials</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-accent/10 transition-colors duration-200 animate-fade-in" style={{ animationDelay: '200ms' }}>
                      <h3 className="font-medium mb-2">🎯 Career Guidance</h3>
                      <p className="text-sm text-muted-foreground">Discover career paths and get professional advice</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-accent/10 transition-colors duration-200 animate-fade-in" style={{ animationDelay: '300ms' }}>
                      <h3 className="font-medium mb-2">🔍 Problem Solving</h3>
                      <p className="text-sm text-muted-foreground">Get step-by-step solutions and explanations</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-accent/10 transition-colors duration-200 animate-fade-in" style={{ animationDelay: '400ms' }}>
                      <h3 className="font-medium mb-2">🎨 Creative Projects</h3>
                      <p className="text-sm text-muted-foreground">Brainstorm ideas and get creative inspiration</p>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 ${msg.message ? 'mb-6' : 'mb-4'} animate-fade-in`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 hover-scale transition-all duration-200">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-2">
                    {msg.message && (
                      <div className="bg-accent/30 p-3 rounded-lg hover:bg-accent/40 transition-colors duration-200 animate-scale-in">
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                    )}
                    {msg.response && (
                      <div className="space-y-2 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 hover-scale transition-all duration-300 animate-scale-in">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-muted-foreground">Vithal AI</span>
                            <div className="flex gap-1">
                              <Button
                                onClick={() => playTextToSpeech(msg.response!)}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 hover-scale transition-all duration-200"
                                title={`Play with ${voiceTone} voice`}
                              >
                                {audioPlayback?.isPlaying && audioPlayback.text === msg.response ? 
                                  <VolumeX className="h-3 w-3 animate-pulse" /> : 
                                  <Volume2 className="h-3 w-3" />
                                }
                              </Button>
                              <Button
                                onClick={() => setVoiceTone(voiceTone === 'male' ? 'female' : 'male')}
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-xs hover-scale transition-all duration-200"
                                title="Switch voice tone"
                              >
                                {voiceTone === 'male' ? '♂' : '♀'}
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="bg-accent/20 p-4 rounded-lg ml-10">
                          <TypewriterText 
                            text={msg.response}
                            speed={30}
                            className="prose prose-sm max-w-none dark:prose-invert leading-relaxed"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-3 mb-6 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-accent/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-[bounce_1s_infinite_200ms]"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-[bounce_1s_infinite_400ms]"></div>
                      </div>
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-card/80 backdrop-blur-sm animate-fade-in">
          {selectedImage && (
            <div className="mb-4 relative animate-scale-in">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="max-w-32 max-h-32 rounded-lg border object-cover hover-scale transition-transform duration-200"
              />
              <Button
                onClick={removeImage}
                size="sm"
                variant="destructive"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 hover-scale transition-all duration-200"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message Vithal AI..."
                className="pr-24 bg-background/50 border-2 hover:border-primary/20 focus:border-primary transition-colors duration-200"
                disabled={loading}
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                <Button
                  onClick={handleImageUpload}
                  size="sm"
                  variant="ghost"
                  className="h-10 w-10 p-0 hover-scale transition-all duration-200"
                  type="button"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                
                <Button
                  onClick={toggleVoiceRecognition}
                  size="sm"
                  variant="ghost"
                  className={`h-10 w-10 p-0 hover-scale transition-all duration-200 ${isListening ? 'bg-red-500 text-white animate-pulse' : ''}`}
                  type="button"
                >
                  <Mic className="h-4 w-4" />
                </Button>

                <Button
                  type="submit"
                  size="sm"
                  disabled={loading || (!message.trim() && !selectedImage)}
                  className="h-10 w-10 p-0 hover-scale transition-all duration-200"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
      </main>

      {/* Modals */}
      <ProfileModal 
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={user}
      />
      
      <ContactSupportModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
};