import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LanguageSelector } from '@/components/ui/language-selector';
import { 
  Send, 
  Mic, 
  Image as ImageIcon, 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit3, 
  User as UserIcon, 
  Menu,
  Star,
  Search,
  Settings,
  ChevronRight,
  Loader2,
  LogOut,
  Globe,
  Camera
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

interface GeminiChatInterfaceProps {
  user: User;
  onLogout: () => void;
}

export const GeminiChatInterface: React.FC<GeminiChatInterfaceProps> = ({ user, onLogout }) => {
  const [message, setMessage] = useState('');
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatSessions();
    loadUserProfile();
    // Always start with a new chat
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

  const loadChatSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      
      // Automatically delete blank chats
      await deleteBlankChats(true);
      
      // Reload sessions after cleanup
      const { data: cleanData, error: cleanError } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('updated_at', { ascending: false });

      if (cleanError) throw cleanError;
      setChatSessions(cleanData || []);
      
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

  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      setUserProfile(data || {});
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile({});
    }
  };

  const deleteBlankChats = async (silent: boolean = false) => {
    try {
      // Get all sessions for the user
      const { data: sessions, error: sessionsError } = await supabase
        .from('chat_sessions')
        .select('id')
        .eq('user_id', user.id);

      if (sessionsError) throw sessionsError;

      // Check which sessions have no messages
      const blankSessionIds: string[] = [];
      
      for (const session of sessions || []) {
        const { data: messages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('id')
          .eq('session_id', session.id)
          .limit(1);

        if (messagesError) throw messagesError;

        // If no messages found, it's a blank chat
        if (!messages || messages.length === 0) {
          blankSessionIds.push(session.id);
        }
      }

      // Delete all blank sessions
      if (blankSessionIds.length > 0) {
        const { error: deleteError } = await supabase
          .from('chat_sessions')
          .delete()
          .in('id', blankSessionIds);

        if (deleteError) throw deleteError;

        // Update local state
        setChatSessions(prev => prev.filter(s => !blankSessionIds.includes(s.id)));
        
        // If current session was deleted, clear it
        if (currentSession && blankSessionIds.includes(currentSession.id)) {
          const remainingSessions = chatSessions.filter(s => !blankSessionIds.includes(s.id));
          setCurrentSession(remainingSessions.length > 0 ? remainingSessions[0] : null);
          setMessages([]);
        }

        if (!silent) {
          toast({
            title: "Success",
            description: `Deleted ${blankSessionIds.length} blank chat${blankSessionIds.length === 1 ? '' : 's'}`
          });
        }
      } else if (!silent) {
        toast({
          title: "No blank chats",
          description: "All your chats have messages"
        });
      }
    } catch (error) {
      console.error('Error deleting blank chats:', error);
      if (!silent) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to delete blank chats"
        });
      }
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

  const generateSmartSessionTitle = async (sessionId: string, userMessage: string, aiResponse: string) => {
    try {
      // AI-powered title generation based on conversation context
      let smartTitle = "New Chat";
      
      const message = userMessage.toLowerCase();
      
      // Smart title generation based on content analysis
      if (message.includes('math') || message.includes('calculate') || message.includes('solve')) {
        smartTitle = `📊 Math: ${userMessage.substring(0, 30)}...`;
      } else if (message.includes('code') || message.includes('program') || message.includes('python') || message.includes('java')) {
        smartTitle = `💻 Programming: ${userMessage.substring(0, 25)}...`;
      } else if (message.includes('career') || message.includes('job') || message.includes('interview')) {
        smartTitle = `🎯 Career: ${userMessage.substring(0, 30)}...`;
      } else if (message.includes('course') || message.includes('learn') || message.includes('study')) {
        smartTitle = `📚 Learning: ${userMessage.substring(0, 28)}...`;
      } else if (message.includes('business') || message.includes('startup') || message.includes('entrepreneur')) {
        smartTitle = `💼 Business: ${userMessage.substring(0, 28)}...`;
      } else if (message.includes('physics') || message.includes('chemistry') || message.includes('biology')) {
        smartTitle = `🔬 Science: ${userMessage.substring(0, 30)}...`;
      } else if (message.includes('design') || message.includes('ui') || message.includes('ux')) {
        smartTitle = `🎨 Design: ${userMessage.substring(0, 32)}...`;
      } else if (message.includes('fitness') || message.includes('health') || message.includes('yoga')) {
        smartTitle = `💪 Health: ${userMessage.substring(0, 32)}...`;
      } else if (message.includes('language') || message.includes('english') || message.includes('communication')) {
        smartTitle = `🗣️ Language: ${userMessage.substring(0, 28)}...`;
      } else {
        // Extract key topics from the message
        const words = userMessage.split(' ').filter(word => word.length > 3);
        const keyWord = words[0] || 'Question';
        smartTitle = `💭 ${keyWord}: ${userMessage.substring(0, 35)}...`;
      }
      
      // Update session title
      await supabase
        .from('chat_sessions')
        .update({ title: smartTitle })
        .eq('id', sessionId);
        
      // Update local state
      setChatSessions(prev => prev.map(session => 
        session.id === sessionId 
          ? { ...session, title: smartTitle }
          : session
      ));
      
    } catch (error) {
      console.error('Error generating smart session title:', error);
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

    // Create session if none exists
    if (!currentSession) {
      try {
        await createNewSession();
        // After creating session, don't return - continue with sending the message
      } catch (error) {
        console.error('Failed to create session:', error);
        return;
      }
    }

    // Get the current session (either existing or newly created)
    const sessionToUse = currentSession;
    
    // Check again if we have a session after potential creation
    if (!sessionToUse) {
      console.error('No session available for sending message');
      setLoading(false);
      return;
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


      // Call the Gemini function with language support, personalization, and conversation history
      const requestBody: any = { 
        message: userMessage,
        language: language,
        userProfile: {
          userId: user.id,
          email: user.email,
          name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Friend',
          ...userProfile
        },
        chatHistory: messages.slice(-10) // Send last 10 messages for context
      };
      
      if (base64Data) {
        requestBody.imageData = base64Data;
      }

      console.log('About to call Gemini function with:', requestBody);
      
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: requestBody
      });

      console.log('Gemini function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      if (!data || !data.response) {
        throw new Error('No response from AI');
      }

      // Save message to database
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

      // Update messages with real data
      setMessages(prev => prev.map(msg => 
        msg.id === tempMessage.id ? (savedMessage as ChatMessage) : msg
      ));

      // Update session title if it's the first message using AI-powered smart title generation
      if (messages.length === 0) {
        generateSmartSessionTitle(currentSession.id, userMessage, data.response);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again."
      });
      // Remove the temporary message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please upload an image file"
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        variant: "destructive",
        title: "Error", 
        description: "Image size must be less than 5MB"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setSelectedImage(imageDataUrl);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
    
    // Clear the input so the same file can be uploaded again
    event.target.value = '';
  };

  const handleCameraCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      setSelectedImage(imageDataUrl);
      setImageFile(file);
    };
    reader.readAsDataURL(file);
    
    // Clear the input
    event.target.value = '';
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImageFile(null);
  };

  const startVoiceRecording = () => {
    // Check if speech recognition is supported
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
      toast({
        title: "🎤 Listening...",
        description: "Speak now, I'm listening!"
      });
    };

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setMessage(transcript);
      setIsRecording(false);
      toast({
        title: "✅ Speech captured!",
        description: "Click send to process your voice message"
      });
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
      toast({
        variant: "destructive",
        title: "❌ Speech Error",
        description: "Failed to recognize speech. Please try again."
      });
    };

    recognitionInstance.onend = () => {
      setIsRecording(false);
    };

    setRecognition(recognitionInstance);
    recognitionInstance.start();
  };

  const stopVoiceRecording = () => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
      setRecognition(null);
    }
  };

  const AppSidebar = () => {
    return (
      <Sidebar className="border-r">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold text-lg">Vithal AI</h2>
          <Button
            onClick={createNewSession}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <SidebarContent>
          <SidebarGroup>
            <div className="flex items-center justify-between px-3 py-2">
              <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
              <Button
                onClick={() => deleteBlankChats()}
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                title="Delete blank chats"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            <SidebarGroupContent>
              <SidebarMenu>
                {chatSessions.map((session) => (
                  <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton
                      onClick={() => setCurrentSession(session)}
                      className={`w-full justify-between group ${
                        currentSession?.id === session.id ? 'bg-accent' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{session.title}</span>
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSession(session.id);
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center hover:bg-destructive/10 rounded"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Help Section */}
          <SidebarGroup>
            <SidebarGroupLabel>Help & Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => setShowContactModal(true)}
                    className="w-full"
                  >
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      <span>Contact Support</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm truncate">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                >
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setShowProfile(true)}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  {t('profile')}
                </DropdownMenuItem>
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">{t('language')}</span>
                  </div>
                  <div className="mt-1">
                    <LanguageSelector 
                      language={language} 
                      onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')} 
                    />
                  </div>
                </div>
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Sign-in Time Display */}
          <div className="text-xs text-muted-foreground text-center mt-2 p-2 bg-muted/50 rounded">
            Signed in: {new Date().toLocaleDateString('en-IN', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </Sidebar>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header - Fixed */}
          <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex-shrink-0">
            <div className="flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-2">
                <SidebarTrigger />
                <h1 className="font-semibold ml-4">
                  {currentSession?.title || 'Vithal AI Chat'}
                </h1>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="outline" className="text-xs">
                      <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      Help
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => window.open('mailto:vithalai2112@gmail.com', '_blank')}>
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      Email Support
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.open('https://www.instagram.com/vithal_ai?igsh=MWF0Zmk5aDZtZmdocA==', '_blank')}>
                      <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowProfile(true)}>
                      <UserIcon className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Chat Messages - Scrollable */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <div className="max-w-3xl mx-auto space-y-4">
                  {messages.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <img src={vithalLogo} alt="Vithal AI" className="w-8 h-8" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Start a conversation</h3>
                      <p className="text-muted-foreground">
                        Ask me anything! I can help with studies, problems, courses, and more.
                      </p>
                      <div className="mt-6 text-xs text-muted-foreground/70 space-y-1">
                        <p>Made by <span className="font-medium">Shree Alankar</span></p>
                        <p>Powered by <span className="font-medium">Gemini AI</span></p>
                      </div>
                    </div>
                  )}

                  {messages.map((msg) => (
                    <div key={msg.id} className="space-y-4">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="max-w-[80%] rounded-2xl bg-primary text-primary-foreground px-4 py-2">
                          <p>{msg.message}</p>
                        </div>
                      </div>

                      {/* AI Response */}
                      {msg.response && (
                        <div className="flex justify-start">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                              <img src={vithalLogo} alt="Vithal AI" className="w-5 h-5" />
                            </div>
                            <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2">
                              <div 
                                className="prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ 
                                  __html: msg.response.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                }} 
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <img src={vithalLogo} alt="Vithal AI" className="w-5 h-5" />
                        </div>
                        <div className="max-w-[80%] rounded-2xl bg-muted px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Input Area - Fixed */}
          <div className="border-t bg-background p-4 flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              {/* Image Preview */}
              {selectedImage && (
                <div className="mb-4 relative inline-block">
                  <img 
                    src={selectedImage} 
                    alt="Selected for upload" 
                    className="max-w-xs max-h-32 rounded-lg object-cover border"
                  />
                  <Button
                    onClick={removeSelectedImage}
                    size="sm"
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                  >
                    ×
                  </Button>
                </div>
              )}

              
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Message Vithal AI..."
                    className="pr-16 rounded-full border-2"
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    disabled={loading}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <Button
                      onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                      size="sm"
                      variant="ghost"
                      className={`h-8 w-8 p-0 rounded-full ${isRecording ? 'text-red-500' : ''}`}
                      disabled={loading}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 rounded-full"
                          disabled={loading}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => fileInputRef.current?.click()}>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Upload Image
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => cameraInputRef.current?.click()}>
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                <Button
                  onClick={sendMessage}
                  disabled={loading || (!message.trim() && !selectedImage)}
                  size="sm"
                  className="rounded-full h-10 w-10 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* File inputs */}
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
            onChange={handleCameraCapture}
            className="hidden"
          />

        <ProfileModal 
          isOpen={showProfile}
          onClose={() => setShowProfile(false)}
          user={user}
        />
        
        <ContactSupportModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
        </main>
      </div>
    </SidebarProvider>
  );
};
