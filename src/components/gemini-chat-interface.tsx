import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { LanguageSelector } from '@/components/ui/language-selector';
import { Send, Mic, Image as ImageIcon, Plus, MessageSquare, Trash2, Edit3, User as UserIcon, Menu, Star, Search, Settings, ChevronRight, Loader2, LogOut, Globe, Camera, Code, Copy, Check, X, MoreVertical, Download, Volume2, Square, Users, Leaf, Smartphone } from 'lucide-react';
import vithalLogo from '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileModal } from './profile-modal';
import { ContactSupportModal } from './contact-support-modal';
import { CodeGeneratorChat } from './code-generator-chat';
import { ChatMessageRenderer } from './chat-message-renderer';
import { StudyRooms } from './study-rooms';
import { CropHealthAnalyzer } from './crop-health-analyzer';
import type { User } from '@supabase/supabase-js';
import { usePWAInstall } from '@/hooks/usePWAInstall';
interface ChatSession {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  is_archived: boolean;
  session_type?: 'chat' | 'code';
}
interface ChatMessage {
  id: string;
  session_id: string;
  message: string;
  response: string | null;
  message_type: string;
  created_at: string;
  image_data?: string | null;
  youtube_courses?: any;
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
  const [speechRecognition, setSpeechRecognition] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'code', 'studyRooms', 'crop'
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [collapsedTabs, setCollapsedTabs] = useState<{
    chat: boolean;
    code: boolean;
  }>({
    chat: true,
    code: true
  });

  // Haptic feedback for mobile devices
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10); // Short 10ms vibration
    }
  };

  // Sound effects using Web Audio API for better reliability
  const playSound = (frequency: number, duration: number = 100) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Audio playback not supported');
    }
  };

  // Mode-specific sounds
  const playChatSound = () => {
    playSound(800, 80); // Higher pitch, quick
    triggerHaptic();
  };
  const playCodeSound = () => {
    playSound(600, 100); // Mid pitch, slightly longer
    triggerHaptic();
  };
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState('');
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
  const {
    isInstallable,
    isInstalled,
    isIOS,
    isAndroid,
    hasPrompt,
    installApp
  } = usePWAInstall();
  const [showInstallDialog, setShowInstallDialog] = useState(false);
  const handleInstallApp = async () => {
    const result = await installApp();
    if (result.success) {
      toast({
        title: "Success!",
        description: "Vithal AI has been installed successfully!"
      });
      setShowInstallDialog(false);
    } else if (result.showInstructions) {
      // Show the dialog with instructions if direct install failed
      setShowInstallDialog(true);
    }
  };
  useEffect(() => {
    loadChatSessions();
    loadUserProfile();
    // Always start with a new chat (default type)
    createNewSession('chat');
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
      setChatSessions(data as ChatSession[] || []);
    } catch (error) {
      console.error('Error loading chat sessions:', error);
    }
  };
  const switchToSession = (session: ChatSession) => {
    setCurrentSession(session);
    // Auto-switch to the correct view based on session type
    const sessionType = session.session_type || 'chat';
    if (sessionType === 'code') {
      setCurrentView('code');
      playCodeSound();
    } else {
      setCurrentView('chat');
      playChatSound();
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
  const createNewSession = async (sessionType: 'chat' | 'code' = 'chat') => {
    try {
      const titles = {
        chat: 'New Chat',
        code: '💻 New Code Session'
      };
      const {
        data,
        error
      } = await supabase.from('chat_sessions').insert({
        user_id: user.id,
        title: titles[sessionType],
        session_type: sessionType
      }).select().single();
      if (error) throw error;
      const newSession = data as ChatSession;
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      setMessages([]);
      setCurrentView(sessionType === 'chat' ? 'chat' : 'code');
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
  const clearChats = async (type: 'chat' | 'code' | 'all') => {
    const typeLabels = {
      chat: 'chat',
      code: 'code',
      all: 'all'
    };
    if (!confirm(`Are you sure you want to delete ${type === 'all' ? 'all' : `all ${typeLabels[type]}`} sessions? This cannot be undone.`)) {
      return;
    }
    try {
      let query = supabase.from('chat_sessions').delete().eq('user_id', user.id);
      if (type !== 'all') {
        query = query.eq('session_type', type);
      }
      const {
        error
      } = await query;
      if (error) throw error;

      // Update local state
      if (type === 'all') {
        setChatSessions([]);
        setCurrentSession(null);
        setMessages([]);
      } else {
        const remaining = chatSessions.filter(s => (s.session_type || 'chat') !== type);
        setChatSessions(remaining);

        // If current session was deleted, switch to first remaining
        if (currentSession && (currentSession.session_type || 'chat') === type) {
          setCurrentSession(remaining.length > 0 ? remaining[0] : null);
          setMessages([]);
        }
      }
      toast({
        title: "Success",
        description: `${type === 'all' ? 'All chats' : type === 'chat' ? 'Chat history' : 'Code history'} cleared successfully`
      });
    } catch (error) {
      console.error('Error clearing chats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear chats"
      });
    }
  };
  const toggleTab = (type: 'chat' | 'code') => {
    setCollapsedTabs(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    triggerHaptic();
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
      if (message.includes('🎨') || message.includes('generate image') || message.includes('chitrakar')) {
        // Extract the actual prompt from image generation message
        const promptMatch = userMessage.match(/: (.+)$/);
        const actualPrompt = promptMatch ? promptMatch[1] : userMessage;
        smartTitle = `🎨 Image: ${actualPrompt.substring(0, 30)}...`;
      } else if (message.includes('math') || message.includes('calculate') || message.includes('solve')) {
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
    if (!message.trim() && !selectedImage || !currentSession || loading) return;
    const userMessage = message.trim();
    const imageToSend = selectedImage;
    setMessage('');
    setSelectedImage(null);
    setImageFile(null);
    setLoading(true);
    try {
      // Determine message type and content
      let messageType = 'text';
      let messageContent = userMessage;
      if (imageToSend) {
        messageType = 'image';
        // If there's both image and text, combine them
        messageContent = userMessage || 'Analyze this image';
      }

      // Save user message
      const {
        data: userMessageData,
        error: userMessageError
      } = await supabase.from('chat_messages').insert([{
        session_id: currentSession.id,
        user_id: user.id,
        message: messageContent,
        message_type: messageType,
        image_data: imageToSend || null
      }]).select().single();
      if (userMessageError) throw userMessageError;

      // Reload messages to show user message
      await loadMessages(currentSession.id);

      // Get chat history for context
      const chatHistory = messages.map(msg => ({
        role: msg.message_type === 'user' ? 'user' : 'assistant',
        content: msg.message
      }));

      // Call Gemini chat with image support
      const requestBody: any = {
        message: messageContent,
        profile: userProfile,
        language: language,
        chatHistory: chatHistory
      };

      // Add image if present
      if (imageToSend) {
        requestBody.image = imageToSend;
      }
      const {
        data,
        error
      } = await supabase.functions.invoke('gemini-chat', {
        body: requestBody
      });
      if (error) throw error;

      // Check if the response contains an error from the edge function
      if (data?.error) {
        throw new Error(data.response || data.error);
      }

      // Update message with response
      const {
        error: updateError
      } = await supabase.from('chat_messages').update({
        response: data.response,
        youtube_courses: data.youtubeCourses || null
      }).eq('id', userMessageData.id);
      if (updateError) throw updateError;

      // Reload messages
      await loadMessages(currentSession.id);

      // Generate smart title for first message
      if (messages.length === 0) {
        await generateSmartSessionTitle(currentSession.id, userMessage, data.response);
      }
      toast({
        title: "✅ Response received!",
        description: "AI has processed your message"
      });
    } catch (error: any) {
      console.error('Error sending message:', error);

      // Check for specific rate limit error
      const errorMessage = error.message || "Failed to send message. Please try again.";
      const isRateLimit = errorMessage.toLowerCase().includes('rate limit');
      toast({
        variant: "destructive",
        title: isRateLimit ? "⏳ Rate Limit Reached" : "❌ Error",
        description: isRateLimit ? "Your Gemini API key has reached its rate limit. Please wait 60 seconds before trying again, or upgrade your API quota at Google AI Studio." : errorMessage,
        duration: isRateLimit ? 10000 : 5000
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!newContent.trim() || !currentSession) return;
    try {
      // Update the message in the database
      const {
        error: updateError
      } = await supabase.from('chat_messages').update({
        message: newContent.trim()
      }).eq('id', messageId);
      if (updateError) throw updateError;

      // Clear the AI response for this message
      await supabase.from('chat_messages').update({
        response: null
      }).eq('id', messageId);

      // Reload messages
      await loadMessages(currentSession.id);

      // Auto-regenerate the response
      await regenerateResponse(messageId, newContent.trim());
      setEditingMessageId(null);
      setEditedContent('');
      toast({
        title: "✅ Message Updated",
        description: "Regenerating AI response..."
      });
    } catch (error: any) {
      console.error('Error editing message:', error);
      toast({
        variant: "destructive",
        title: "❌ Edit Failed",
        description: "Failed to update message"
      });
    }
  };
  const regenerateResponse = async (messageId: string, messageContent?: string) => {
    if (!currentSession) return;
    setLoading(true);
    try {
      // Find the message
      const messageToRegenerate = messages.find(m => m.id === messageId);
      if (!messageToRegenerate) throw new Error('Message not found');
      const contentToUse = messageContent || messageToRegenerate.message;

      // Get chat history up to this message
      const chatHistory = messages.filter(m => m.created_at <= messageToRegenerate.created_at && m.id !== messageId).map(msg => ({
        role: msg.message_type === 'user' ? 'user' : 'assistant',
        content: msg.message
      }));

      // Call Gemini chat
      const requestBody: any = {
        message: contentToUse,
        profile: userProfile,
        language: language,
        chatHistory: chatHistory
      };

      // Call Gemini chat
      const {
        data,
        error
      } = await supabase.functions.invoke('gemini-chat', {
        body: requestBody
      });
      if (error) throw error;

      // Update message with new response
      await supabase.from('chat_messages').update({
        response: data.response,
        youtube_courses: data.youtubeCourses || null
      }).eq('id', messageId);

      // Reload messages
      await loadMessages(currentSession.id);
      toast({
        title: "✅ Response Regenerated!",
        description: "New AI response generated"
      });
    } catch (error: any) {
      console.error('Error regenerating response:', error);
      toast({
        variant: "destructive",
        title: "❌ Regeneration Failed",
        description: error.message || "Failed to regenerate response"
      });
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
  const startVoiceRecording = async () => {
    try {
      // Check if Web Speech API is available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          variant: "destructive",
          title: "❌ Not Supported",
          description: "Speech recognition is not supported. Please use Chrome or Edge browser."
        });
        return;
      }

      // Request microphone permission first
      try {
        await navigator.mediaDevices.getUserMedia({
          audio: true
        });
      } catch (permError) {
        toast({
          variant: "destructive",
          title: "❌ Microphone Access Denied",
          description: "Please allow microphone access to use speech recognition."
        });
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Set language based on current selection
      if (language === 'hi') {
        recognition.lang = 'hi-IN';
      } else if (language === 'mr') {
        recognition.lang = 'mr-IN';
      } else {
        recognition.lang = 'en-US';
      }
      let finalTranscript = '';
      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        setMessage(finalTranscript + interimTranscript);
      };
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setSpeechRecognition(null);
        setIsRecording(false);
        let errorMessage = 'Speech recognition failed';
        if (event.error === 'no-speech') {
          errorMessage = 'No speech detected. Please try again.';
        } else if (event.error === 'audio-capture') {
          errorMessage = 'No microphone found. Please check your device.';
        } else if (event.error === 'not-allowed') {
          errorMessage = 'Microphone access denied. Please allow in browser settings.';
        } else if (event.error === 'network') {
          errorMessage = 'Network error. Please check your internet connection.';
        }
        toast({
          variant: "destructive",
          title: "❌ Speech Error",
          description: errorMessage
        });
      };
      recognition.onend = () => {
        setSpeechRecognition(null);
        setIsRecording(false);
        if (finalTranscript.trim()) {
          toast({
            title: "✅ Speech Recognized!",
            description: "Your speech has been transcribed"
          });
        }
      };
      setSpeechRecognition(recognition);
      recognition.start();
      setIsRecording(true);
      toast({
        title: "🎤 Listening...",
        description: "Speak now, I'm listening!"
      });
    } catch (error: any) {
      console.error('Speech recognition error:', error);
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: "Could not start speech recognition. Please try again."
      });
    }
  };
  const stopVoiceRecording = () => {
    if (speechRecognition) {
      speechRecognition.stop();
      setSpeechRecognition(null);
    }
    setIsRecording(false);
  };
  const playTextToSpeech = async (text: string, messageId: string) => {
    try {
      // Stop any currently playing speech
      window.speechSynthesis.cancel();
      setPlayingAudio(messageId);

      // Clean the text for TTS
      const cleanText = text.replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`[^`]*`/g, '') // Remove inline code
      .replace(/\*\*([^\*]+)\*\*/g, '$1') // Remove bold
      .replace(/\*([^\*]+)\*/g, '$1') // Remove italic
      .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '') // Remove images
      .substring(0, 4000); // Limit to 4000 chars for TTS

      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Set language based on current selection
      if (language === 'hi') {
        utterance.lang = 'hi-IN';
      } else if (language === 'mr') {
        utterance.lang = 'mr-IN';
      } else {
        utterance.lang = 'en-US';
      }

      // Get available voices and select male voice
      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = null;

      // Find male voice for the selected language
      if (language === 'hi') {
        selectedVoice = voices.find(v => v.lang.includes('hi') && v.name.toLowerCase().includes('male')) || voices.find(v => v.lang.includes('hi'));
      } else if (language === 'mr') {
        selectedVoice = voices.find(v => v.lang.includes('mr') && v.name.toLowerCase().includes('male')) || voices.find(v => v.lang.includes('mr')) || voices.find(v => v.lang.includes('hi')); // Fallback to Hindi
      } else {
        // English - prefer Google US English Male or similar
        selectedVoice = voices.find(v => v.lang.includes('en') && v.name.toLowerCase().includes('male')) || voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang.includes('en-US'));
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      utterance.rate = 1.0;
      utterance.pitch = 0.9; // Slightly lower pitch for male voice
      utterance.volume = 1.0;
      utterance.onend = () => {
        setPlayingAudio(null);
      };
      utterance.onerror = event => {
        console.error('Speech synthesis error:', event);
        setPlayingAudio(null);
        toast({
          variant: "destructive",
          title: "❌ Speech Error",
          description: "Could not play speech"
        });
      };
      window.speechSynthesis.speak(utterance);
    } catch (error: any) {
      console.error('Text-to-speech error:', error);
      setPlayingAudio(null);
      toast({
        variant: "destructive",
        title: "❌ Speech Generation Failed",
        description: error.message || "Could not generate speech"
      });
    }
  };
  const stopTextToSpeech = () => {
    window.speechSynthesis.cancel();
    setPlayingAudio(null);
  };
  const AppSidebar = () => {
    return <Sidebar className="border-r border-orange-500/20 bg-black/95 backdrop-blur-xl">
        {/* Header with New Chat */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-orange-500/20">
          <h2 className="font-semibold text-sm md:text-lg bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">Vithal AI</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-7 w-7 md:h-8 md:w-8 p-0 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                <Plus className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-xl border-orange-500/20">
              <DropdownMenuItem onClick={() => createNewSession('chat')} className="cursor-pointer hover:bg-orange-500/10">
                <MessageSquare className="h-4 w-4 mr-2 text-orange-400" />
                New Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => createNewSession('code')} className="cursor-pointer hover:bg-orange-500/10">
                <Code className="h-4 w-4 mr-2 text-orange-400" />
                New Code Session
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Clear Chats Dropdown */}
        {chatSessions.length > 0 && <div className="px-3 py-2 border-b border-orange-500/10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3 w-3 mr-2" />
                  Clear History
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 bg-background/95 backdrop-blur-sm border-orange-500/20">
                <DropdownMenuItem onClick={() => clearChats('chat')} className="cursor-pointer text-xs hover:bg-orange-500/10">
                  <MessageSquare className="h-3 w-3 mr-2" />
                  Delete Chats Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => clearChats('code')} className="cursor-pointer text-xs hover:bg-orange-500/10">
                  <Code className="h-3 w-3 mr-2" />
                  Delete Codes Only
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => clearChats('all')} className="cursor-pointer text-xs text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3 w-3 mr-2" />
                  Delete All
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>}
        
        <ScrollArea className="flex-1">
          <SidebarContent>
            {/* Recent Chats with Collapsible Tabs */}
            {['chat', 'code'].map(type => {
            const sessions = chatSessions.filter(s => (s.session_type || 'chat') === type);
            const labels = {
              chat: '💬 Chats',
              code: '💻 Codes'
            };
            const isCollapsed = collapsedTabs[type as keyof typeof collapsedTabs];
            return <SidebarGroup key={type} className="mb-2">
                  <SidebarGroupLabel onClick={() => toggleTab(type as 'chat' | 'code')} className="text-orange-400 font-semibold text-xs cursor-pointer hover:bg-orange-500/10 rounded-md px-2 py-1.5 transition-all flex items-center justify-between">
                    <span>{labels[type as keyof typeof labels]} ({sessions.length})</span>
                    <ChevronRight className={`h-3 w-3 transition-transform ${isCollapsed ? '' : 'rotate-90'}`} />
                  </SidebarGroupLabel>
                  
                  {!isCollapsed && <SidebarGroupContent>
                      <SidebarMenu>
                        {sessions.length > 0 ? sessions.map(session => <SidebarMenuItem key={session.id}>
                              <SidebarMenuButton onClick={() => switchToSession(session)} className={`w-full justify-between group ${currentSession?.id === session.id ? 'bg-orange-500/10 text-orange-400 border-l-2 border-orange-500' : 'text-foreground hover:bg-orange-500/5 hover:text-orange-400'}`}>
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
                                  <span className="truncate text-xs">{session.title}</span>
                                </div>
                                <Button onClick={e => {
                        e.stopPropagation();
                        deleteSession(session.id);
                      }} variant="ghost" size="sm" className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10">
                                  <Trash2 className="h-3 w-3 text-destructive" />
                                </Button>
                              </SidebarMenuButton>
                            </SidebarMenuItem>) : <div className="px-3 py-2 text-xs text-muted-foreground text-center">
                            No sessions yet
                          </div>}
                      </SidebarMenu>
                    </SidebarGroupContent>}
                </SidebarGroup>;
          })}
            
            {/* Settings & Support Section */}
            <SidebarGroup className="mt-4 border-t border-orange-500/20 pt-4">
              <SidebarGroupLabel className="text-orange-400/70 font-semibold text-xs px-2">Settings</SidebarGroupLabel>
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
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => window.open('https://vithalaitermscondition.lovable.app', '_blank')} className="w-full hover:bg-orange-500/10 hover:text-orange-400">
                      <div className="flex items-center gap-2">
                        <svg className="h-3.5 w-3.5 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-xs md:text-sm">Terms & Conditions</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {!isInstalled && isInstallable && <SidebarMenuItem>
                      <SidebarMenuButton onClick={handleInstallApp} className="w-full hover:bg-orange-500/10 hover:text-orange-400 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-3.5 w-3.5 md:h-4 md:w-4 text-orange-400" />
                          <span className="text-xs md:text-sm text-orange-400 font-medium">Install Vithal AI App</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </ScrollArea>

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
                <div className="hidden sm:flex relative items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-orange-500/20 overflow-hidden">
                  {/* Flowing Liquid Bubble Background */}
                  <div className="absolute inset-y-0.5 rounded-md transition-all duration-500 ease-out" style={{
                  width: 'calc((100% - 0.5rem) / 4)',
                  left: `calc(0.125rem + (100% - 0.5rem) / 4 * ${currentView === 'chat' ? 0 : currentView === 'code' ? 1 : currentView === 'studyRooms' ? 2 : 3})`,
                  background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.8) 0%, rgba(249, 115, 22, 0.9) 50%, rgba(234, 88, 12, 0.8) 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'liquid-gradient-shift 3s ease infinite, liquid-glow-pulse 2s ease-in-out infinite, morph 4s ease-in-out infinite',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(251, 146, 60, 0.3), inset 0 0 20px rgba(234, 88, 12, 0.3)',
                  zIndex: 0
                }} />
                  
                  <Button variant="ghost" onClick={async () => {
                  playChatSound();
                  setCurrentView('chat');
                  if (!currentSession || currentSession.session_type === 'code') {
                    await createNewSession('chat');
                  }
                }} size="sm" className={`relative h-6 px-2 text-[10px] md:text-xs transition-all z-10 ${currentView === 'chat' ? 'text-white' : 'text-orange-400/70 hover:text-orange-400'}`}>
                    <MessageSquare className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">Chat</span>
                  </Button>
                  <Button variant="ghost" onClick={async () => {
                  playCodeSound();
                  setCurrentView('code');
                  if (!currentSession || currentSession.session_type !== 'code') {
                    await createNewSession('code');
                  }
                }} size="sm" className={`relative h-6 px-2 text-[10px] md:text-xs transition-all z-10 ${currentView === 'code' ? 'text-white' : 'text-orange-400/70 hover:text-orange-400'}`}>
                    <Code className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">Code</span>
                  </Button>
                  <Button variant="ghost" onClick={() => {
                  playChatSound();
                  setCurrentView('studyRooms');
                }} size="sm" className={`relative h-6 px-2 text-[10px] md:text-xs transition-all z-10 ${currentView === 'studyRooms' ? 'text-white' : 'text-orange-400/70 hover:text-orange-400'}`}>
                    <Users className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">Rooms</span>
                  </Button>
                  <Button variant="ghost" onClick={() => {
                  playChatSound();
                  setCurrentView('crop');
                }} size="sm" className={`relative h-6 px-2 text-[10px] md:text-xs transition-all z-10 ${currentView === 'crop' ? 'text-white' : 'text-orange-400/70 hover:text-orange-400'}`}>
                    <Leaf className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">Crop</span>
                  </Button>
                </div>

                {/* Mobile View Toggle */}
                <div className="sm:hidden relative flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-orange-500/20 overflow-hidden">
                  {/* Flowing Liquid Bubble Background */}
                  <div className="absolute inset-y-0.5 rounded-md transition-all duration-500 ease-out" style={{
                  width: 'calc((100% - 0.5rem) / 4)',
                  left: `calc(0.125rem + (100% - 0.5rem) / 4 * ${currentView === 'chat' ? 0 : currentView === 'code' ? 1 : currentView === 'studyRooms' ? 2 : 3})`,
                  background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.8) 0%, rgba(249, 115, 22, 0.9) 50%, rgba(234, 88, 12, 0.8) 100%)',
                  backgroundSize: '200% 200%',
                  animation: 'liquid-gradient-shift 3s ease infinite, liquid-glow-pulse 2s ease-in-out infinite, morph 4s ease-in-out infinite',
                  backdropFilter: 'blur(20px)',
                  boxShadow: '0 0 20px rgba(249, 115, 22, 0.4), 0 0 40px rgba(251, 146, 60, 0.3), inset 0 0 20px rgba(234, 88, 12, 0.3)',
                  zIndex: 0
                }} />
                  
                  <Button variant="ghost" onClick={async () => {
                  playChatSound();
                  setCurrentView('chat');
                  if (!currentSession || currentSession.session_type === 'code') {
                    await createNewSession('chat');
                  }
                }} size="sm" className={`relative h-7 w-7 p-0 z-10 ${currentView === 'chat' ? 'text-white' : 'text-orange-400/50'}`}>
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" onClick={async () => {
                  playCodeSound();
                  setCurrentView('code');
                  if (!currentSession || currentSession.session_type !== 'code') {
                    await createNewSession('code');
                  }
                }} size="sm" className={`relative h-7 w-7 p-0 z-10 ${currentView === 'code' ? 'text-white' : 'text-orange-400/50'}`}>
                    <Code className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" onClick={() => {
                  playChatSound();
                  setCurrentView('studyRooms');
                }} size="sm" className={`relative h-7 w-7 p-0 z-10 ${currentView === 'studyRooms' ? 'text-white' : 'text-orange-400/50'}`}>
                    <Users className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" onClick={() => {
                  playChatSound();
                  setCurrentView('crop');
                }} size="sm" className={`relative h-7 w-7 p-0 z-10 ${currentView === 'crop' ? 'text-white' : 'text-orange-400/50'}`}>
                    <Leaf className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* New Chat Button */}
                <Button onClick={() => {
                const sessionType = currentView === 'code' ? 'code' : 'chat';
                createNewSession(sessionType);
              }} size="sm" variant="ghost" className="h-7 w-7 md:w-auto md:px-2 p-0 text-orange-400 hover:bg-orange-500/10 border border-orange-500/20">
                  <Plus className="h-3.5 w-3.5" />
                  <span className="hidden md:inline ml-1 text-xs">New</span>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 md:w-auto md:px-2 p-0 hover:bg-orange-500/10 border border-orange-500/20">
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
                      <LanguageSelector language={language} onLanguageChange={lang => setLanguage(lang as 'en' | 'hi' | 'mr')} />
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

          {/* Main Content Area */}
          {currentView === 'code' ? <div className="flex-1 overflow-auto">
              <CodeGeneratorChat user={user} sessionId={currentSession?.id} onSessionTitleUpdate={(sessionId, newTitle) => {
            setChatSessions(prev => prev.map(session => session.id === sessionId ? {
              ...session,
              title: newTitle
            } : session));
          }} />
            </div> : currentView === 'studyRooms' ? <div className="flex-1 overflow-auto">
              <StudyRooms user={user} />
            </div> : currentView === 'crop' ? <div className="flex-1 overflow-auto">
              <CropHealthAnalyzer />
            </div> : <>
          {/* Chat Messages - Scrollable - Mobile Optimized */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3 md:p-6">
                <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                  {messages.length === 0 && !loading && <div className="flex flex-col items-center justify-center min-h-[50vh] sm:min-h-[55vh] md:min-h-[40vh] lg:min-h-[45vh] py-6 md:py-8 lg:py-6 px-3 sm:px-4">
                      {/* Logo and Welcome - Responsive */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-16 md:h-16 lg:w-18 lg:h-18 mx-auto mb-3 sm:mb-4 md:mb-4 rounded-xl sm:rounded-2xl bg-gradient-to-br from-orange-500/40 to-orange-600/20 flex items-center justify-center shadow-2xl shadow-orange-500/50 border border-orange-500/30 animate-fade-in">
                        <img src={vithalLogo} alt="Vithal AI" className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-11 lg:h-11" />
                      </div>
                      
                      <h2 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent text-center animate-fade-in">
                        Welcome to Vithal AI
                      </h2>
                      <p className="text-orange-400/70 text-xs sm:text-sm md:text-sm mb-4 sm:mb-5 md:mb-6 max-w-md mx-auto text-center leading-relaxed animate-fade-in">
                        Your AI-powered learning companion
                      </p>
                      
                      {/* Feature Cards Grid - 2 cols mobile, 4 cols tablet/desktop */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-3 lg:gap-4 w-full max-w-xs sm:max-w-lg md:max-w-3xl lg:max-w-4xl mx-auto">
                        {/* AI Chat Card */}
                        <button onClick={() => setCurrentView('chat')} className="group p-3 sm:p-4 md:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-black/60 hover:from-orange-500/20 hover:to-orange-600/10 hover:border-orange-400/50 transition-all duration-300 text-left hover:scale-[1.02] md:hover:scale-105 hover:shadow-lg hover:shadow-orange-500/20 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-orange-400" />
                          </div>
                          <h3 className="font-bold text-xs sm:text-sm md:text-xs lg:text-sm mb-0.5 text-orange-400 group-hover:text-orange-300">AI Chat</h3>
                          <p className="text-[9px] sm:text-[10px] md:text-[9px] lg:text-[10px] text-foreground/60 leading-relaxed line-clamp-2">Ask questions & learn</p>
                        </button>

                        {/* Code Generator Card */}
                        <button onClick={async () => {
                        playCodeSound();
                        setCurrentView('code');
                        if (!currentSession || currentSession.session_type !== 'code') {
                          await createNewSession('code');
                        }
                      }} className="group p-3 sm:p-4 md:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-black/60 hover:from-blue-500/20 hover:to-blue-600/10 hover:border-blue-400/50 transition-all duration-300 text-left hover:scale-[1.02] md:hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-blue-500/30 to-blue-600/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Code className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-blue-400" />
                          </div>
                          <h3 className="font-bold text-xs sm:text-sm md:text-xs lg:text-sm mb-0.5 text-blue-400 group-hover:text-blue-300">Code Generator</h3>
                          <p className="text-[9px] sm:text-[10px] md:text-[9px] lg:text-[10px] text-foreground/60 leading-relaxed line-clamp-2">Generate in 20+ languages</p>
                        </button>

                        {/* Study Rooms Card */}
                        <button onClick={() => {
                        playChatSound();
                        setCurrentView('studyRooms');
                      }} className="group p-3 sm:p-4 md:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-black/60 hover:from-purple-500/20 hover:to-purple-600/10 hover:border-purple-400/50 transition-all duration-300 text-left hover:scale-[1.02] md:hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-purple-500/30 to-purple-600/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-purple-400" />
                          </div>
                          <h3 className="font-bold text-xs sm:text-sm md:text-xs lg:text-sm mb-0.5 text-purple-400 group-hover:text-purple-300">Study Rooms</h3>
                          <p className="text-[9px] sm:text-[10px] md:text-[9px] lg:text-[10px] text-foreground/60 leading-relaxed line-clamp-2">Collaborate with AI</p>
                        </button>

                        {/* Crop Health Analyzer Card */}
                        <button onClick={() => {
                        playChatSound();
                        setCurrentView('crop');
                      }} className="group p-3 sm:p-4 md:p-3 lg:p-4 rounded-lg sm:rounded-xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-black/60 hover:from-green-500/20 hover:to-green-600/10 hover:border-green-400/50 transition-all duration-300 text-left hover:scale-[1.02] md:hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 opacity-0 animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-9 md:h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-green-500/30 to-green-600/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                            <Leaf className="w-4 h-4 sm:w-5 sm:h-5 md:w-4 md:h-4 lg:w-5 lg:h-5 text-green-400" />
                          </div>
                          <h3 className="font-bold text-xs sm:text-sm md:text-xs lg:text-sm mb-0.5 text-green-400 group-hover:text-green-300">Crop Analyzer</h3>
                          <p className="text-[9px] sm:text-[10px] md:text-[9px] lg:text-[10px] text-foreground/60 leading-relaxed line-clamp-2">Plant health & advice</p>
                        </button>
                      </div>
                      
                      <div className="text-[9px] sm:text-[10px] md:text-[10px] text-orange-400/50 mt-4 sm:mt-5 md:mt-6 text-center animate-fade-in">
                        <p>Powered by <span className="font-semibold text-orange-500">Gemini AI</span> • Developed By <span className="font-semibold text-orange-400">Kapil Kiran Jadhav</span></p>
                      </div>
                    </div>}

                  {messages.map(msg => <div key={msg.id} className="space-y-4">
                      {/* User Message */}
                      <div className="flex justify-end group">
                        <div className="max-w-[85%]">
                          {editingMessageId === msg.id ? <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 shadow-xl shadow-orange-500/30">
                              <Textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} className="bg-white/10 border-white/20 text-white placeholder:text-white/60 mb-2 min-h-[60px]" autoFocus />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleEditMessage(msg.id, editedContent)} className="bg-white text-orange-600 hover:bg-white/90">
                                  <Check className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => {
                              setEditingMessageId(null);
                              setEditedContent('');
                            }} className="text-white hover:bg-white/10">
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div> : <div className="relative">
                              <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 shadow-xl shadow-orange-500/30">
                                {msg.message_type === 'image' && (msg as any).image_data && <img src={(msg as any).image_data} alt="Uploaded" className="mb-2 rounded-lg max-w-full h-auto max-h-64 object-contain" />}
                                <p className="text-sm leading-relaxed whitespace-pre-wrap font-chat">{msg.message}</p>
                                <div className="text-xs opacity-70 mt-1">
                                  {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => {
                            setEditingMessageId(msg.id);
                            setEditedContent(msg.message);
                          }} className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-orange-500/10 text-orange-400">
                                <Edit3 className="h-3.5 w-3.5" />
                              </Button>
                            </div>}
                        </div>
                      </div>

                      {/* AI Response */}
                      {msg.response && <div className="flex justify-start group">
                          <div className="flex items-start gap-3 w-full">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/30 to-orange-600/10 flex items-center justify-center flex-shrink-0 mt-1 border border-orange-500/30 shadow-lg shadow-orange-500/20">
                              <img src={vithalLogo} alt="Vithal AI" className="w-6 h-6" />
                            </div>
                            <div className="flex-1 max-w-[85%]">
                              <div className="rounded-2xl border border-orange-500/20 bg-black/50 backdrop-blur-sm px-6 py-4 shadow-lg relative">
                                <ChatMessageRenderer content={msg.response} />
                                <div className="flex items-center justify-between mt-3">
                                  <div className="text-xs text-orange-400/70">
                                    {new Date(msg.created_at).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => {
                                  if (playingAudio === msg.id) {
                                    stopTextToSpeech();
                                  } else {
                                    playTextToSpeech(msg.response || '', msg.id);
                                  }
                                }} className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs hover:bg-orange-500/10 text-orange-400" disabled={loading}>
                                      {playingAudio === msg.id ? <>
                                          <Square className="h-3 w-3 mr-1 fill-current" />
                                          Stop
                                        </> : <>
                                          <Volume2 className="h-3 w-3 mr-1" />
                                          Listen
                                        </>}
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => regenerateResponse(msg.id)} className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs hover:bg-orange-500/10 text-orange-400" disabled={loading}>
                                      <Loader2 className={`h-3 w-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                                      Regenerate
                                    </Button>
                                  </div>
                                </div>
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

          {/* Input Area - Professional Bottom Bar */}
          <div className="border-t border-border/50 bg-background/80 backdrop-blur-2xl flex-shrink-0">
            <div className="max-w-5xl mx-auto px-4 py-4 md:py-5">
              {/* Image Preview */}
              {selectedImage && <div className="mb-3">
                  <div className="relative inline-block rounded-xl overflow-hidden border border-border/50 shadow-lg">
                    <img src={selectedImage} alt="Selected" className="max-h-32 md:max-h-40 object-contain bg-muted/50" />
                    <button onClick={removeSelectedImage} className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1.5 shadow-lg transition-all hover:scale-110">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>}

              {/* Input Container */}
              <div className="relative flex items-end gap-2 md:gap-3 rounded-3xl bg-muted/50 border border-border/50 px-3 md:px-4 py-2 focus-within:border-primary/50 focus-within:bg-muted/70 transition-all duration-200 shadow-sm hover:shadow-md">
                {/* Hidden File Inputs */}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />

                {/* Textarea */}
                <Textarea ref={textareaRef} value={message} onChange={e => {
                  setMessage(e.target.value);
                  // Auto-resize textarea
                  if (textareaRef.current) {
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
                  }
                }} onKeyPress={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                    if (textareaRef.current) textareaRef.current.style.height = 'auto';
                  }
                }} placeholder={t('typeYourMessage') || "Message Vithal AI..."} className="flex-1 bg-transparent border-0 outline-none text-sm md:text-base text-foreground placeholder:text-muted-foreground resize-none min-h-[40px] max-h-[160px] py-2 focus-visible:ring-0 focus-visible:ring-offset-0" disabled={loading} rows={1} />

                {/* Mic Button */}
                <Button onClick={isRecording ? stopVoiceRecording : startVoiceRecording} variant="ghost" size="icon" className={`h-9 w-9 rounded-full transition-all flex-shrink-0 ${isRecording ? 'bg-destructive/20 text-destructive hover:bg-destructive/30 animate-pulse' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}`} disabled={loading}>
                  <Mic className="h-5 w-5" />
                </Button>

                {/* Three Dot Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" disabled={loading}>
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-xl border-border/50">
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer text-sm py-2.5">
                      <ImageIcon className="h-4 w-4 mr-3 text-primary" />
                      <span>Upload Image</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => cameraInputRef.current?.click()} className="cursor-pointer text-sm py-2.5">
                      <Camera className="h-4 w-4 mr-3 text-primary" />
                      <span>Take Photo</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Send Button */}
                <Button onClick={() => {
                  sendMessage();
                  if (textareaRef.current) textareaRef.current.style.height = 'auto';
                }} size="icon" className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex-shrink-0" disabled={loading || !message.trim() && !selectedImage}>
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </div>

              {/* Helper Text */}
              <div className="mt-2 text-center">
                <p className="text-xs text-muted-foreground">
                  Vithal AI can make mistakes. Verify important information.
                </p>
              </div>
            </div>
          </div>
            </>}
        </main>

        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} user={user} />
        <ContactSupportModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
        
        {/* PWA Install Dialog */}
        <Dialog open={showInstallDialog} onOpenChange={setShowInstallDialog}>
          <DialogContent className="sm:max-w-md bg-black/95 border-orange-500/30">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-orange-500" />
                Install Vithal AI App
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Install Vithal AI on your device for the best experience
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Install Button */}
              <Button onClick={handleInstallApp} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-6 rounded-xl shadow-lg shadow-orange-500/30">
                <Smartphone className="h-5 w-5 mr-2" />
                Install Vithal AI App
              </Button>

              {/* Platform-specific instructions */}
              <div className="space-y-3 text-sm">
                {isIOS ? <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <p className="font-semibold text-orange-400 mb-2">iOS Installation:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Tap the Share button <span className="inline-block px-1">⬆️</span></li>
                      <li>Scroll down and tap "Add to Home Screen"</li>
                      <li>Tap "Add" to confirm</li>
                    </ol>
                  </div> : isAndroid ? <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <p className="font-semibold text-orange-400 mb-2">Android Installation:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Tap the menu button (⋮) in Chrome</li>
                      <li>Select "Add to Home Screen" or "Install App"</li>
                      <li>Tap "Install" to confirm</li>
                    </ol>
                  </div> : <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
                    <p className="font-semibold text-orange-400 mb-2">Desktop Installation:</p>
                    <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                      <li>Click the install icon in the address bar</li>
                      <li>Or use browser menu → "Install Vithal AI"</li>
                      <li>Click "Install" to confirm</li>
                    </ol>
                  </div>}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </SidebarProvider>;
};