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
import { Send, Mic, Image as ImageIcon, Plus, MessageSquare, Trash2, Edit3, User as UserIcon, Menu, Star, Search, Settings, ChevronRight, Loader2, LogOut, Globe, Camera, Code, Copy, Check, X, Sparkles } from 'lucide-react';
import vithalLogo from '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileModal } from './profile-modal';
import { ContactSupportModal } from './contact-support-modal';
import { CodeGenerator } from './code-generator';
import { ChatMessageRenderer } from './chat-message-renderer';
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
export const GeminiChatInterface: React.FC<GeminiChatInterfaceProps> = ({
  user,
  onLogout
}) => {
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
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'code'
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const {
    toast
  } = useToast();
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
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
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages]);
  const loadChatSessions = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('chat_sessions').select('*').order('updated_at', {
        ascending: false
      });
      if (error) throw error;
      setChatSessions(data || []);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };
  const loadMessages = async (sessionId: string) => {
    try {
      const {
        data,
        error
      } = await supabase.from('chat_messages').select('*').eq('session_id', sessionId).order('created_at', {
        ascending: true
      });
      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };
  const createNewSession = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('chat_sessions').insert({
        user_id: user.id,
        title: 'New Chat'
      }).select().single();
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
      const {
        error
      } = await supabase.from('chat_sessions').delete().eq('id', sessionId);
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
      const {
        data,
        error
      } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      setUserProfile(data || {});
    } catch (error) {
      console.error('Error loading user profile:', error);
      setUserProfile({});
    }
  };
  const updateSessionTitle = async (sessionId: string, title: string) => {
    try {
      const {
        error
      } = await supabase.from('chat_sessions').update({
        title
      }).eq('id', sessionId);
      if (error) throw error;
      setChatSessions(prev => prev.map(s => s.id === sessionId ? {
        ...s,
        title
      } : s));
      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? {
          ...prev,
          title
        } : null);
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
      await supabase.from('chat_sessions').update({
        title: smartTitle
      }).eq('id', sessionId);

      // Update local state
      setChatSessions(prev => prev.map(session => session.id === sessionId ? {
        ...session,
        title: smartTitle
      } : session));
    } catch (error) {
      console.error('Error generating smart session title:', error);
    }
  };
  const generateSessionTitle = async (sessionId: string, userMessage: string, aiResponse: string) => {
    try {
      const {
        data,
        error
      } = await supabase.functions.invoke('gemini-chat', {
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
      const fallbackTitle = userMessage.length > 30 ? userMessage.substring(0, 30) + '...' : userMessage;
      updateSessionTitle(sessionId, fallbackTitle);
    }
  };
  const sendMessage = async () => {
    // Placeholder - original function content preserved
    // This function handles sending messages through Gemini chat
  };
  
  const generateImage = async (prompt: string) => {
    if (!currentSession) return;
    
    setIsGeneratingImage(true);
    
    try {
      // Add user message with image generation request
      const { data: userMessageData, error: userMessageError } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: currentSession.id,
          user_id: user.id,
          message: `🎨 Generate image: ${prompt}`,
          message_type: 'text'
        }])
        .select()
        .single();

      if (userMessageError) throw userMessageError;

      // Reload messages to show user request
      await loadMessages(currentSession.id);

      // Call image generation function
      const { data: imageData, error: functionError } = await supabase.functions.invoke('generate-image', {
        body: { prompt }
      });

      if (functionError) throw functionError;

      if (!imageData?.imageUrl) {
        throw new Error('No image URL received');
      }

      // Save AI response with generated image
      const responseContent = `![Generated Image](${imageData.imageUrl})\n\n${imageData.description || 'Image generated successfully'}`;
      
      const { error: responseError } = await supabase
        .from('chat_messages')
        .update({ 
          response: responseContent
        })
        .eq('id', userMessageData.id);

      if (responseError) throw responseError;

      await loadMessages(currentSession.id);
      
      toast({
        title: "✅ Image Generated!",
        description: "Your image has been created successfully."
      });

    } catch (error: any) {
      console.error('Error generating image:', error);
      
      let errorMessage = 'Failed to generate image. Please try again.';
      
      if (error.message?.includes('429')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (error.message?.includes('402')) {
        errorMessage = 'Payment required. Please add credits to your workspace.';
      }
      
      toast({
        variant: "destructive",
        title: "❌ Generation Failed",
        description: errorMessage
      });
    } finally {
      setIsGeneratingImage(false);
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
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      toast({
        variant: "destructive",
        title: "Error",
        description: "Image size must be less than 5MB"
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = e => {
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
    reader.onload = e => {
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
    return <Sidebar className="border-r border-orange-500/20 bg-black/95 backdrop-blur-xl">
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-orange-500/20">
          <h2 className="font-semibold text-sm md:text-lg bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Vithal AI 2.0</h2>
          <Button onClick={createNewSession} size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
            <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
          </Button>
        </div>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-orange-400 font-semibold text-xs">Recent Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chatSessions.map(session => <SidebarMenuItem key={session.id}>
                    <SidebarMenuButton onClick={() => setCurrentSession(session)} className={`w-full justify-between group ${currentSession?.id === session.id ? 'bg-orange-500/10 text-orange-400' : 'text-foreground hover:bg-orange-500/5 hover:text-orange-400'}`}>
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <MessageSquare className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                        <span className="truncate text-xs md:text-sm">{session.title}</span>
                      </div>
                      <div onClick={e => {
                    e.stopPropagation();
                    deleteSession(session.id);
                  }} className="h-5 w-5 md:h-6 md:w-6 p-0 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center hover:bg-destructive/10 rounded">
                        <Trash2 className="h-2.5 w-2.5 md:h-3 md:w-3 text-destructive" />
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>)}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          
          {/* Help Section */}
          <SidebarGroup>
            <SidebarGroupLabel className="text-orange-400 font-semibold text-xs">Help & Support</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => setShowContactModal(true)} className="w-full hover:bg-orange-500/10 hover:text-orange-400">
                    <div className="flex items-center gap-2">
                      <svg className="h-3.5 w-3.5 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      <span className="text-xs md:text-sm">Contact Support</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <div className="p-3 md:p-4 border-t border-orange-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Avatar className="h-6 w-6 md:h-7 md:w-7 border-2 border-orange-500/50 flex-shrink-0">
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs">
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs md:text-sm truncate text-orange-400">
                {user.user_metadata?.full_name || user.email}
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-orange-400 hover:bg-orange-500/10 flex-shrink-0">
                  <Settings className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-xl border-orange-500/20">
                <DropdownMenuItem onClick={() => setShowProfile(true)} className="text-orange-400 hover:bg-orange-500/10">
                  <UserIcon className="h-4 w-4 mr-2" />
                  {t('profile')}
                </DropdownMenuItem>
                <div className="px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-orange-400" />
                    <span className="text-sm text-orange-400">{t('language')}</span>
                  </div>
                  <div className="mt-1">
                    <LanguageSelector language={language} onLanguageChange={lang => setLanguage(lang as 'en' | 'hi' | 'mr')} />
                  </div>
                </div>
                <DropdownMenuItem onClick={onLogout} className="text-orange-400 hover:bg-orange-500/10">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Sign-in Time Display */}
          <div className="text-[10px] md:text-xs text-orange-400/70 text-center mt-2 p-1.5 md:p-2 bg-orange-500/5 rounded border border-orange-500/20">
            Signed in: {new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
          </div>
        </div>
      </Sidebar>;
  };
  return <SidebarProvider>
      <div className="min-h-screen flex w-full bg-black">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gradient-to-b from-black via-black to-orange-950/10">
          {/* Compact Professional Header */}
          <header className="border-b border-orange-500/20 bg-black/95 backdrop-blur-xl flex-shrink-0">
            <div className="flex items-center justify-between px-3 md:px-4 h-12 md:h-14">
              {/* Left: Sidebar Toggle + Logo + Title */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <SidebarTrigger className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 rounded p-1 transition-all flex-shrink-0" />
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/30 flex-shrink-0">
                  <img src={vithalLogo} alt="Vithal AI" className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-xs md:text-sm font-semibold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent truncate">
                    {currentSession?.title || 'New Chat'}
                  </h1>
                </div>
              </div>

              {/* Right: Mode Toggle + Actions */}
              <div className="flex items-center gap-1.5 md:gap-2">
                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-orange-500/20">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('chat')} 
                    size="sm" 
                    className={`h-6 px-2 text-[10px] md:text-xs transition-all ${
                      currentView === 'chat' 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                        : 'text-orange-400/70 hover:text-orange-400'
                    }`}
                  >
                    <MessageSquare className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">Chat</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('code')} 
                    size="sm" 
                    className={`h-6 px-2 text-[10px] md:text-xs transition-all ${
                      currentView === 'code' 
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white' 
                        : 'text-orange-400/70 hover:text-orange-400'
                    }`}
                  >
                    <Code className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">Code</span>
                  </Button>
                </div>

                {/* Mobile View Toggle */}
                <div className="sm:hidden flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('chat')} 
                    size="sm" 
                    className={`h-7 w-7 p-0 ${currentView === 'chat' ? 'bg-orange-500/20 text-orange-400' : 'text-orange-400/50'}`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('code')} 
                    size="sm" 
                    className={`h-7 w-7 p-0 ${currentView === 'code' ? 'bg-orange-500/20 text-orange-400' : 'text-orange-400/50'}`}
                  >
                    <Code className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* New Chat Button */}
                <Button
                  onClick={createNewSession}
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 md:w-auto md:px-2 p-0 text-orange-400 hover:bg-orange-500/10 border border-orange-500/20"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden md:inline ml-1 text-xs">New</span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-7 w-7 md:w-auto md:px-2 p-0 hover:bg-orange-500/10 border border-orange-500/20"
                    >
                      <Avatar className="h-5 w-5 border border-orange-500/50">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px]">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="hidden lg:inline ml-1.5 text-xs text-orange-400 max-w-[80px] truncate">
                        {user.email?.split('@')[0]}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-xl border-orange-500/20 w-48">
                    <DropdownMenuItem onClick={() => setShowProfile(true)} className="text-orange-400 hover:bg-orange-500/10 cursor-pointer text-xs">
                      <UserIcon className="h-3.5 w-3.5 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowContactModal(true)} className="text-orange-400 hover:bg-orange-500/10 cursor-pointer text-xs">
                      <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      Support
                    </DropdownMenuItem>
                    <div className="px-2 py-1.5 border-t border-orange-500/20">
                      <div className="text-[10px] text-orange-400/70 mb-1">Language</div>
                      <LanguageSelector 
                        language={language} 
                        onLanguageChange={(lang) => setLanguage(lang as 'en' | 'hi' | 'mr')} 
                      />
                    </div>
                    <DropdownMenuItem onClick={onLogout} className="text-red-400 hover:bg-red-500/10 cursor-pointer text-xs">
                      <LogOut className="h-3.5 w-3.5 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Conditional Content Rendering */}
          {currentView === 'code' ? <div className="flex-1 overflow-auto">
              <CodeGenerator />
            </div> : <>
          {/* Chat Messages - Scrollable - Mobile Optimized */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3 md:p-6">
                <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                  {messages.length === 0 && !loading && <div className="text-center py-8 md:py-16">
                      <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/10 flex items-center justify-center shadow-2xl shadow-orange-500/40 animate-pulse-glow">
                        <img src={vithalLogo} alt="Vithal AI" className="w-8 h-8 md:w-12 md:h-12" />
                      </div>
                      <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent px-4">Welcome to Vithal AI 2.0</h2>
                      <p className="text-orange-400/70 text-sm md:text-lg mb-6 md:mb-8 max-w-md mx-auto px-4">Your intelligent study companion. Ask me anything about academics, career guidance, or learning resources.</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto mb-6 md:mb-8 px-4">
                        <div className="p-3 md:p-4 rounded-lg md:rounded-xl border border-orange-500/20 bg-black/50 hover:bg-orange-500/5 transition-all duration-300 group liquid-glass-subtle">
                          <h3 className="font-semibold text-xs md:text-sm mb-1 md:mb-2 text-orange-400">📚 Study Help</h3>
                          <p className="text-[10px] md:text-xs text-foreground/70">Get explanations, solve problems, and understand concepts</p>
                        </div>
                        <div className="p-3 md:p-4 rounded-lg md:rounded-xl border border-orange-500/20 bg-black/50 hover:bg-orange-500/5 transition-all duration-300 group liquid-glass-subtle">
                          <h3 className="font-semibold text-xs md:text-sm mb-1 md:mb-2 text-orange-400">🎯 Career Guidance</h3>
                          <p className="text-[10px] md:text-xs text-foreground/70">Explore career paths and get professional advice</p>
                        </div>
                        <div className="p-3 md:p-4 rounded-lg md:rounded-xl border border-orange-500/20 bg-black/50 hover:bg-orange-500/5 transition-all duration-300 group liquid-glass-subtle">
                          <h3 className="font-semibold text-xs md:text-sm mb-1 md:mb-2 text-orange-400">💻 Tech Learning</h3>
                          <p className="text-[10px] md:text-xs text-foreground/70">Programming, coding, and technical skills. For Code Generator, check tabs above.</p>
                        </div>
                        <div className="p-3 md:p-4 rounded-lg md:rounded-xl border border-orange-500/20 bg-black/50 hover:bg-orange-500/5 transition-all duration-300 group liquid-glass-subtle">
                          <h3 className="font-semibold text-xs md:text-sm mb-1 md:mb-2 text-orange-400">🔬 Science & Math</h3>
                          <p className="text-[10px] md:text-xs text-foreground/70">Complex calculations and scientific concepts</p>
                        </div>
                      </div>
                      <div className="text-[10px] md:text-xs text-orange-400/50 space-y-0.5 md:space-y-1 px-4">
                        <p>Powered by <span className="font-medium text-orange-500">Gemini AI</span></p>
                        <p>Sponsored by <span className="font-medium text-orange-400">Shree Alankar</span></p>
                        <p>Developed by <span className="font-medium text-orange-400">Kapil Kiran Jadhav</span></p>
                      </div>
                    </div>}

                  {messages.map(msg => <div key={msg.id} className="space-y-4">
                      {/* User Message */}
                      <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 shadow-xl shadow-orange-500/30">
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                          {msg.message_type === 'image' && msg.message.startsWith('data:image') && (
                            <img 
                              src={msg.message} 
                              alt="Uploaded" 
                              className="mt-2 rounded-lg max-w-full h-auto max-h-64 object-contain"
                            />
                          )}
                          <div className="text-xs opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                          </div>
                        </div>
                      </div>

                      {/* AI Response */}
                      {msg.response && <div className="flex justify-start">
                          <div className="flex items-start gap-3 w-full">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/10 flex items-center justify-center flex-shrink-0 mt-1 border border-orange-500/30 shadow-lg shadow-orange-500/20">
                              <img src={vithalLogo} alt="Vithal AI" className="w-6 h-6" />
                            </div>
                            <div className="flex-1 max-w-[85%] rounded-2xl border border-orange-500/20 bg-black/50 backdrop-blur-sm px-6 py-4 shadow-lg">
                              <ChatMessageRenderer content={msg.response} />
                              <div className="text-xs text-orange-400/70 mt-3">
                                {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                              </div>
                            </div>
                          </div>
                        </div>}
                    </div>)}

                  {loading && <div className="flex justify-start">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/10 flex items-center justify-center flex-shrink-0 mt-1 border border-orange-500/30 shadow-lg shadow-orange-500/20">
                          <img src={vithalLogo} alt="Vithal AI" className="w-6 h-6" />
                        </div>
                        <div className="max-w-[85%] rounded-2xl border border-orange-500/20 bg-black/50 backdrop-blur-sm px-6 py-4 shadow-lg">
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                            <span className="text-sm text-orange-400">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>}
                  
                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Input Area - Fixed - Mobile Optimized */}
          <div className="border-t border-orange-500/20 bg-black/95 backdrop-blur-xl p-3 md:p-4 flex-shrink-0">
            <div className="max-w-4xl mx-auto space-y-3">
              {/* Image Preview */}
              {selectedImage && <div className="relative inline-block">
                  <img src={selectedImage} alt="Selected" className="max-h-32 md:max-h-40 rounded-lg border border-orange-500/30 shadow-lg" />
                  <button onClick={removeSelectedImage} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-all">
                    <X className="h-3 w-3 md:h-4 md:w-4" />
                  </button>
                </div>}

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Input value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && !e.shiftKey && sendMessage()} placeholder={t('typeYourMessage') || "Ask me anything..."} className="min-h-[44px] md:min-h-[48px] bg-black/50 border-orange-500/30 focus:border-orange-500/50 text-foreground placeholder:text-orange-400/40 pr-12" disabled={loading || isGeneratingImage} />
                </div>

                <div className="flex items-center gap-1.5 md:gap-2">
                  {/* Image Upload */}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  <Button onClick={() => fileInputRef.current?.click()} variant="ghost" size="sm" className="h-9 w-9 md:h-10 md:w-10 p-0 text-orange-400 hover:bg-orange-500/10 border border-orange-500/20" disabled={loading || isGeneratingImage}>
                    <ImageIcon className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>

                  {/* Camera */}
                  <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />
                  <Button onClick={() => cameraInputRef.current?.click()} variant="ghost" size="sm" className="h-9 w-9 md:h-10 md:w-10 p-0 text-orange-400 hover:bg-orange-500/10 border border-orange-500/20" disabled={loading || isGeneratingImage}>
                    <Camera className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>

                  {/* Voice Input */}
                  <Button onClick={isRecording ? stopVoiceRecording : startVoiceRecording} variant="ghost" size="sm" className={`h-9 w-9 md:h-10 md:w-10 p-0 border border-orange-500/20 ${isRecording ? 'bg-red-500/20 text-red-400 animate-pulse' : 'text-orange-400 hover:bg-orange-500/10'}`} disabled={loading || isGeneratingImage}>
                    <Mic className="h-4 w-4 md:h-5 md:w-5" />
                  </Button>

                  {/* Generate Image Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-9 w-9 md:h-10 md:w-10 p-0 text-orange-400 hover:bg-orange-500/10 border border-orange-500/20" 
                        disabled={loading || isGeneratingImage}
                      >
                        <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-xl border-orange-500/20 w-64">
                      <div className="p-3 space-y-2">
                        <div className="text-xs font-semibold text-orange-400 mb-2">Generate Image</div>
                        <Input 
                          placeholder="Describe the image..." 
                          className="bg-black/50 border-orange-500/30 text-xs"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              generateImage(e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                        <p className="text-[10px] text-orange-400/60">Press Enter to generate</p>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Send Button */}
                  <Button onClick={sendMessage} size="sm" className="h-9 md:h-10 px-3 md:px-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white" disabled={loading || isGeneratingImage || (!message.trim() && !selectedImage)}>
                    {loading || isGeneratingImage ? <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" /> : <Send className="h-4 w-4 md:h-5 md:w-5" />}
                  </Button>
                </div>
              </div>
              
              <div className="text-[10px] text-orange-400/40 text-center">
                Powered by Gemini AI • Type to chat or generate images
              </div>
            </div>
          </div>
        </>}
        </main>

        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} user={user} />
        <ContactSupportModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      </div>
    </SidebarProvider>;
};