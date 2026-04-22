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
import { Send, Mic, Image as ImageIcon, Plus, MessageSquare, Trash2, Edit3, User as UserIcon, Menu, Star, Search, Settings, ChevronRight, Loader2, LogOut, Globe, Camera, Code, Copy, Check, X, MoreVertical, Download, Volume2, Square, Users, Leaf, Smartphone, Scale, Grid3X3, Library, Rocket, Lock, LockOpen, Shield, ShieldCheck, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import vithalLogo from '@/assets/vithal-pin-logo.png';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ProfileModal } from './profile-modal';
import { ContactSupportModal } from './contact-support-modal';
import { CodeGeneratorChat } from './code-generator-chat';
import { CodeSnippetLibrary } from './code-snippet-library';
import { ChatMessageRenderer } from './chat-message-renderer';
import { StudyRooms } from './study-rooms';
import { CropHealthAnalyzer } from './crop-health-analyzer';
import { HaqJaanoIntegrated } from './haq-jaano-integrated';
import { FullstackAppBuilder } from './fullstack-app-builder';
import type { User } from '@supabase/supabase-js';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { WelcomeSection } from './welcome-section';
import { PublishNetlifyModal } from './publish-netlify-modal';
import {
  isEncryptionEnabled,
  setEncryptionEnabled as setEncryptionEnabledUtil,
  deriveEncryptionKey,
  storeKeyInSession,
  getStoredKey,
  hasKeyInSession,
  encryptMessage as encryptText,
  tryDecrypt,
} from '@/lib/encryption';
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
  initialView?: 'chat' | 'code' | 'studyRooms' | 'crop' | 'haq-jaano' | 'fullstack';
}
export const GeminiChatInterface: React.FC<GeminiChatInterfaceProps> = ({
  user,
  onLogout,
  initialView
}) => {
  const navigate = useNavigate();
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
  const [currentView, setCurrentView] = useState<'chat' | 'code' | 'studyRooms' | 'crop' | 'haq-jaano' | 'fullstack'>(initialView || 'chat');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [collapsedTabs, setCollapsedTabs] = useState<{
    chat: boolean;
    code: boolean;
    websites: boolean;
  }>({
    chat: true,
    code: true,
    websites: true
  });
  const [websiteProjects, setWebsiteProjects] = useState<any[]>([]);
  const [showCodeLibrary, setShowCodeLibrary] = useState(false);
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [projectToPublish, setProjectToPublish] = useState<any>(null);

  // E2E Encryption state
  const [encryptionOn, setEncryptionOn] = useState(() => isEncryptionEnabled(user.id));
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);
  const [showPassphraseDialog, setShowPassphraseDialog] = useState(false);
  const [passphrase, setPassphrase] = useState('');
  const [passphraseConfirm, setPassphraseConfirm] = useState('');
  const [passphraseMode, setPassphraseMode] = useState<'setup' | 'unlock'>('setup');

  // Load encryption key from session on mount
  useEffect(() => {
    if (encryptionOn) {
      getStoredKey(user.id).then(key => {
        if (key) {
          setEncryptionKey(key);
        } else {
          // Need passphrase to unlock
          setPassphraseMode('unlock');
          setShowPassphraseDialog(true);
        }
      });
    }
  }, []);

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
    loadWebsiteProjects();
    // Always start with a new chat (default type)
    createNewSession('chat');
  }, []);
  // Reload messages when session changes OR when encryption key becomes available
  useEffect(() => {
    if (currentSession) {
      loadMessages(currentSession.id);
    }
  }, [currentSession, encryptionKey]);
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
  const handlePassphraseSubmit = async () => {
    if (passphraseMode === 'setup') {
      if (passphrase.length < 6) {
        toast({ variant: "destructive", title: "Error", description: "Passphrase must be at least 6 characters" });
        return;
      }
      if (passphrase !== passphraseConfirm) {
        toast({ variant: "destructive", title: "Error", description: "Passphrases don't match" });
        return;
      }
    }
    try {
      const key = await deriveEncryptionKey(user.id, passphrase);
      await storeKeyInSession(user.id, key);
      setEncryptionKey(key);
      setEncryptionEnabledUtil(user.id, true);
      setEncryptionOn(true);
      setShowPassphraseDialog(false);
      setPassphrase('');
      setPassphraseConfirm('');
      toast({ title: "🔒 Encryption Enabled", description: "Your messages are now encrypted at rest" });
      // Reload current session messages with decryption
      if (currentSession) {
        setTimeout(() => loadMessages(currentSession.id), 100);
      }
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to set up encryption" });
    }
  };

  const handleDisableEncryption = () => {
    setEncryptionEnabledUtil(user.id, false);
    setEncryptionOn(false);
    setEncryptionKey(null);
    toast({ title: "🔓 Encryption Disabled", description: "Messages will be stored in plaintext" });
  };

  const handleToggleEncryption = () => {
    if (encryptionOn) {
      handleDisableEncryption();
    } else {
      setPassphraseMode('setup');
      setShowPassphraseDialog(true);
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
      
      // Decrypt messages if encryption key is available
      if (encryptionKey && data) {
        const decryptedData = await Promise.all(
          data.map(async (msg: any) => ({
            ...msg,
            message: await tryDecrypt(msg.message, encryptionKey) || msg.message,
            response: await tryDecrypt(msg.response, encryptionKey),
          }))
        );
        setMessages(decryptedData || []);
      } else {
        setMessages(data || []);
      }
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
  const toggleTab = (type: 'chat' | 'code' | 'websites') => {
    setCollapsedTabs(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    triggerHaptic();
  };

  const loadWebsiteProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('website_projects')
        .select(`
          *,
          files:website_project_files(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setWebsiteProjects(data || []);
    } catch (error) {
      console.error('Error loading website projects:', error);
    }
  };

  const handlePreviewWebsite = (project: any) => {
    const htmlFile = project.files?.find((f: any) => f.language === 'html');
    const cssFile = project.files?.find((f: any) => f.language === 'css');
    const jsFile = project.files?.find((f: any) => f.language === 'javascript');
    
    if (!htmlFile) {
      toast({ title: "Error", description: "No HTML file found in project" });
      return;
    }
    
    let html = htmlFile.file_content;
    if (cssFile) {
      html = html.replace('</head>', `<style>${cssFile.file_content}</style></head>`);
    }
    if (jsFile) {
      html = html.replace('</body>', `<script>${jsFile.file_content}</script></body>`);
    }
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownloadWebsite = async (project: any) => {
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Add each file to the zip
      project.files?.forEach((file: any) => {
        zip.file(file.file_name, file.file_content);
      });
      
      // Add netlify.toml for deployment
      zip.file('netlify.toml', `[build]
  publish = "/"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
`);
      
      // Add README
      zip.file('README.md', `# ${project.name}

${project.description || 'Website project generated by Vithal AI'}

## Deploy to Netlify

1. Go to [Netlify Drop](https://app.netlify.com/drop)
2. Drag and drop this folder
3. Your site will be live in seconds!

## Files Included
${project.files?.map((f: any) => `- ${f.file_name}`).join('\n') || ''}
`);
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-netlify.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({ title: "Downloaded!", description: "Netlify-ready ZIP downloaded successfully" });
    } catch (error) {
      console.error('Error downloading project:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to download project" });
    }
  };

  const handleDeleteWebsiteProject = async (projectId: string) => {
    try {
      const { error } = await supabase.from('website_projects').delete().eq('id', projectId);
      if (error) throw error;
      
      setWebsiteProjects(prev => prev.filter(p => p.id !== projectId));
      toast({ title: "Deleted", description: "Website project deleted successfully" });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({ variant: "destructive", title: "Error", description: "Failed to delete project" });
    }
  };

  const handleSaveWebsiteToLibrary = (project: any) => {
    // Open the code library with the websites view
    setShowCodeLibrary(true);
    toast({ 
      title: "Website Library", 
      description: `"${project.name}" is already saved in your library. Opening website library...` 
    });
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

      // Encrypt message content if encryption is enabled
      const storedMessage = encryptionOn && encryptionKey 
        ? await encryptText(messageContent, encryptionKey) 
        : messageContent;

      // Save user message
      const {
        data: userMessageData,
        error: userMessageError
      } = await supabase.from('chat_messages').insert([{
        session_id: currentSession.id,
        user_id: user.id,
        message: storedMessage,
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

      let responseText = '';

      // Use Gemini API
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
      
      responseText = data.response;

      // Encrypt response before storing
      const storedResponse = encryptionOn && encryptionKey
        ? await encryptText(responseText, encryptionKey)
        : responseText;

      // Update message with response
      const {
        error: updateError
      } = await supabase.from('chat_messages').update({
        response: storedResponse,
        youtube_courses: null
      }).eq('id', userMessageData.id);
      if (updateError) throw updateError;

      // Reload messages
      await loadMessages(currentSession.id);

      // Generate smart title for first message
      if (messages.length === 0) {
        await generateSmartSessionTitle(currentSession.id, userMessage, responseText);
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
    return <Sidebar className="border-r border-orange-500/20 glass-surface">
        {/* Header with New Chat */}
        <div className="flex items-center justify-between p-3 md:p-4 border-b border-orange-500/20">
          <div className="flex items-center gap-2">
            <img src={vithalLogo} alt="Vithal AI" className="w-6 h-6 md:w-7 md:h-7 rounded-md" />
            <h2 className="font-semibold text-sm md:text-lg gradient-text-orange">Vithal AI</h2>
          </div>
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
                  <SidebarGroupLabel onClick={() => toggleTab(type as 'chat' | 'code' | 'websites')} className="text-orange-400 font-semibold text-xs cursor-pointer hover:bg-orange-500/10 rounded-md px-2 py-1.5 transition-all flex items-center justify-between">
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

            {/* Website Projects Section */}
            <SidebarGroup className="mb-2">
              <SidebarGroupLabel 
                onClick={() => toggleTab('websites')} 
                className="text-orange-400 font-semibold text-xs cursor-pointer hover:bg-orange-500/10 rounded-md px-2 py-1.5 transition-all flex items-center justify-between"
              >
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3 w-3" />
                  🌐 Websites ({websiteProjects.length})
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-white animate-pulse">
                    NEW
                  </span>
                </span>
                <ChevronRight className={`h-3 w-3 transition-transform ${collapsedTabs.websites ? '' : 'rotate-90'}`} />
              </SidebarGroupLabel>
              
              {!collapsedTabs.websites && (
                <SidebarGroupContent>
                  <SidebarMenu>
                    {websiteProjects.length > 0 ? websiteProjects.map(project => (
                      <SidebarMenuItem key={project.id}>
                        <div className="w-full px-2 py-1.5 group">
                          <div className="flex items-center gap-2 text-foreground">
                            <Globe className="h-3.5 w-3.5 flex-shrink-0 text-blue-400" />
                            <span className="truncate text-xs flex-1">{project.name}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              onClick={() => handlePreviewWebsite(project)}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-[10px] hover:bg-blue-500/10 hover:text-blue-400"
                            >
                              👁️ Preview
                            </Button>
                            <Button
                              onClick={() => handleSaveWebsiteToLibrary(project)}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-[10px] hover:bg-purple-500/10 hover:text-purple-400"
                            >
                              💾 Save
                            </Button>
                            <Button
                              onClick={() => handleDownloadWebsite(project)}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-[10px] hover:bg-green-500/10 hover:text-green-400"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              ZIP
                            </Button>
                            <Button
                              onClick={() => {
                                setProjectToPublish(project);
                                setPublishModalOpen(true);
                              }}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-[10px] hover:bg-teal-500/10 hover:text-teal-400"
                            >
                              <Rocket className="h-3 w-3 mr-1" />
                              Publish
                            </Button>
                            <Button
                              onClick={() => handleDeleteWebsiteProject(project.id)}
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-3 w-3 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </SidebarMenuItem>
                    )) : (
                      <div className="px-3 py-4 text-xs text-muted-foreground text-center">
                        <Globe className="h-6 w-6 mx-auto mb-1.5 opacity-40" />
                        No websites yet
                        <p className="text-[10px] mt-0.5 opacity-70">Generate in Code → Website</p>
                      </div>
                    )}
                  </SidebarMenu>
                </SidebarGroupContent>
              )}
            </SidebarGroup>
            
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
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="app-shell-frame flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
          <header className="flex-shrink-0 border-b border-border/50 px-2 py-2 sm:px-4 sm:py-3">
            <div className="app-shell-band mx-auto flex w-full max-w-6xl flex-col gap-2 rounded-2xl px-2.5 py-2 sm:px-3.5 sm:py-2.5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2 flex-1">
                  <SidebarTrigger className="app-shell-pill h-9 w-9 rounded-xl p-0 flex-shrink-0" />
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md shadow-primary/25 ring-1 ring-primary/30 flex-shrink-0">
                    <img src={vithalLogo} alt="Vithal AI" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground leading-tight">Workspace</p>
                    <h1 className="truncate text-sm font-semibold gradient-text-orange leading-tight">
                      {currentSession?.title || 'New Chat'}
                    </h1>
                  </div>
                  <h1 className="sm:hidden truncate text-sm font-semibold gradient-text-orange">
                    {currentSession?.title || 'New Chat'}
                  </h1>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={handleToggleEncryption}
                    size="sm"
                    variant="ghost"
                    className={`h-10 rounded-2xl px-3 ${encryptionOn ? 'app-shell-pill-active' : 'app-shell-pill'}`}
                    title={encryptionOn ? 'E2E Encryption ON' : 'Enable E2E Encryption'}
                  >
                    {encryptionOn ? <ShieldCheck className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                    <span className="ml-2 hidden sm:inline text-xs font-medium">{encryptionOn ? 'Secure' : 'Encrypt'}</span>
                  </Button>

                  <Button
                    onClick={() => {
                      const sessionType = currentView === 'code' ? 'code' : 'chat';
                      createNewSession(sessionType);
                    }}
                    size="sm"
                    variant="ghost"
                    className="app-shell-pill h-10 rounded-2xl px-3 sm:px-4"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="ml-2 text-xs font-medium">{language === 'hi' ? 'नया' : language === 'mr' ? 'नवीन' : 'New'}</span>
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="app-shell-pill h-10 rounded-2xl px-2.5 sm:px-3">
                        <Avatar className="h-6 w-6 border border-primary/35">
                          <AvatarImage src={user.user_metadata?.avatar_url} />
                          <AvatarFallback className="bg-gradient-to-r from-primary to-accent text-primary-foreground text-[10px]">
                            {user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="ml-2 hidden lg:inline max-w-[110px] truncate text-xs text-foreground/80">
                          {user.email?.split('@')[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 border-border/70 bg-card/95 backdrop-blur-xl">
                      <DropdownMenuItem onClick={() => setShowProfile(true)} className="cursor-pointer text-foreground/80 hover:bg-primary/10">
                        <UserIcon className="mr-2 h-3.5 w-3.5" />
                        Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setShowContactModal(true)} className="cursor-pointer text-foreground/80 hover:bg-primary/10">
                        <svg className="mr-2 h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                        Support
                      </DropdownMenuItem>
                      <div className="border-t border-border/60 px-2 py-1.5">
                        <div className="mb-1 text-[10px] text-muted-foreground">Language</div>
                        <LanguageSelector language={language} onLanguageChange={lang => setLanguage(lang as 'en' | 'hi' | 'mr')} />
                      </div>
                      <DropdownMenuItem onClick={onLogout} className="cursor-pointer text-destructive hover:bg-destructive/10">
                        <LogOut className="mr-2 h-3.5 w-3.5" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { key: 'chat', icon: MessageSquare, label: language === 'hi' ? 'चैट' : language === 'mr' ? 'चॅट' : 'Chats', onClick: async () => { playChatSound(); setCurrentView('chat'); if (!currentSession || currentSession.session_type === 'code') { await createNewSession('chat'); } } },
                  { key: 'studyRooms', icon: Users, label: language === 'hi' ? 'रूम' : language === 'mr' ? 'रूम' : 'Room', onClick: () => { playChatSound(); setCurrentView('studyRooms'); } },
                  { key: 'haq-jaano', icon: Scale, label: language === 'hi' ? 'हक जानो' : language === 'mr' ? 'हक्क जाणा' : 'Haq Jaano', onClick: () => { playChatSound(); setCurrentView('haq-jaano'); } },
                  { key: 'fullstack', icon: Rocket, label: language === 'hi' ? 'ऐप बिल्डर' : language === 'mr' ? 'ॲप बिल्डर' : 'App Builder', onClick: () => { playCodeSound(); setCurrentView('fullstack'); } },
                ].map(item => {
                  const active = currentView === item.key;
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.key}
                      variant="ghost"
                      size="sm"
                      onClick={item.onClick}
                      className={`h-10 rounded-2xl px-4 text-xs sm:text-sm font-medium ${active ? 'app-shell-pill-active' : 'app-shell-pill'}`}
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  );
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllFeatures(true)}
                  className="app-shell-pill h-10 rounded-2xl px-4 text-xs sm:text-sm font-medium"
                >
                  <Grid3X3 className="mr-2 h-4 w-4" />
                  <span>{language === 'hi' ? 'सभी' : language === 'mr' ? 'सर्व' : 'All'}</span>
                </Button>
              </div>
            </div>
          </header>

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
            </div> : currentView === 'haq-jaano' ? <div className="flex-1 overflow-auto">
              <HaqJaanoIntegrated onBackToHome={() => setCurrentView('chat')} />
            </div> : currentView === 'fullstack' ? <div className="flex-1 overflow-hidden">
              <FullstackAppBuilder user={user} onBack={() => setCurrentView('chat')} />
            </div> : <>
          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className={messages.length === 0 && !loading ? 'min-h-full flex items-center justify-center px-3 py-6 sm:px-4 sm:py-8 lg:px-6 lg:py-10' : 'px-3 py-4 sm:px-4 sm:py-6 lg:px-6'}>
                <div className={`mx-auto w-full max-w-5xl ${messages.length === 0 && !loading ? '' : 'space-y-4 sm:space-y-6'}`}>
                  {messages.length === 0 && !loading && <WelcomeSection language={language} onSuggestionClick={suggestion => {
                      setMessage(suggestion);
                      triggerHaptic();
                    }} />}

                  {messages.map(msg => <div key={msg.id} className="space-y-4 sm:space-y-5">
                      <div className="group flex justify-end">
                        <div className="max-w-[min(92%,42rem)]">
                          {editingMessageId === msg.id ? <div className="rounded-[24px] bg-gradient-to-r from-primary to-accent px-5 py-4 text-primary-foreground shadow-xl shadow-primary/20">
                              <Textarea value={editedContent} onChange={e => setEditedContent(e.target.value)} className="mb-3 min-h-[88px] border-white/20 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:ring-0 focus-visible:ring-offset-0" autoFocus />
                              <div className="flex flex-wrap gap-2">
                                <Button size="sm" onClick={() => handleEditMessage(msg.id, editedContent)} className="bg-background text-foreground hover:bg-background/90">
                                  <Check className="mr-1 h-3 w-3" />
                                  Save
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => {
                              setEditingMessageId(null);
                              setEditedContent('');
                            }} className="text-primary-foreground hover:bg-white/10">
                                  <X className="mr-1 h-3 w-3" />
                                  Cancel
                                </Button>
                              </div>
                            </div> : <div className="relative">
                              <div className="rounded-[24px] bg-gradient-to-r from-primary to-accent px-5 py-4 text-primary-foreground shadow-xl shadow-primary/20">
                                {msg.message_type === 'image' && (msg as any).image_data && <img src={(msg as any).image_data} alt="Uploaded" className="mb-3 max-h-64 h-auto max-w-full rounded-2xl object-contain" />}
                                <p className="whitespace-pre-wrap text-sm leading-relaxed sm:text-[15px]">{msg.message}</p>
                                <div className="mt-2 text-xs text-primary-foreground/70">
                                  {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => {
                            setEditingMessageId(msg.id);
                            setEditedContent(msg.message);
                          }} className="absolute -left-11 top-2 h-9 w-9 rounded-full p-0 text-primary opacity-0 transition-opacity hover:bg-primary/10 group-hover:opacity-100">
                                <Edit3 className="h-3.5 w-3.5" />
                              </Button>
                            </div>}
                        </div>
                      </div>

                      {msg.response && <div className="group flex justify-start">
                          <div className="flex w-full items-start gap-3">
                            <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-lg shadow-primary/10">
                              <img src={vithalLogo} alt="Vithal AI" className="h-6 w-6" />
                            </div>
                            <div className="max-w-[min(100%,48rem)] flex-1">
                              <div className="rounded-[24px] border border-border/70 bg-card/65 px-5 py-4 shadow-lg backdrop-blur-md">
                                <ChatMessageRenderer content={msg.response} />
                                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                                  <div className="text-xs text-muted-foreground">
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
                                }} className="h-8 rounded-full px-3 text-xs text-primary opacity-0 transition-opacity hover:bg-primary/10 group-hover:opacity-100" disabled={loading}>
                                      {playingAudio === msg.id ? <>
                                          <Square className="mr-1 h-3 w-3 fill-current" />
                                          Stop
                                        </> : <>
                                          <Volume2 className="mr-1 h-3 w-3" />
                                          Listen
                                        </>}
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => regenerateResponse(msg.id)} className="h-8 rounded-full px-3 text-xs text-primary opacity-0 transition-opacity hover:bg-primary/10 group-hover:opacity-100" disabled={loading}>
                                      <Loader2 className={`mr-1 h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
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
                        <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 shadow-lg shadow-primary/10">
                          <img src={vithalLogo} alt="Vithal AI" className="h-6 w-6" />
                        </div>
                        <div className="rounded-[24px] border border-border/70 bg-card/65 px-5 py-4 shadow-lg backdrop-blur-md">
                          <div className="flex items-center gap-3 text-primary">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm">AI is thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>}

                  <div ref={messagesEndRef} />
                </div>
              </div>
            </ScrollArea>
          </div>

          {encryptionOn && currentView === 'chat' && <div className="mx-3 mb-2 sm:mx-4 lg:mx-6">
              <div className="mx-auto flex max-w-5xl items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs text-primary">
                <ShieldCheck className="h-3 w-3" />
                <span>Messages are end-to-end encrypted</span>
              </div>
            </div>}

          <div className="flex-shrink-0 px-3 pb-3 pt-2 sm:px-4 sm:pb-4 lg:px-6">
            <div className="chat-composer-shell mx-auto max-w-5xl rounded-[28px] px-3 py-3 sm:px-4 sm:py-4">
              {selectedImage && <div className="mb-3 inline-flex rounded-2xl border border-border/70 bg-card/50 p-2">
                  <div className="relative overflow-hidden rounded-xl">
                    <img src={selectedImage} alt="Selected" className="max-h-24 object-contain" />
                    <button onClick={removeSelectedImage} className="absolute right-1 top-1 rounded-full bg-background/85 p-1 text-destructive transition-colors hover:bg-background">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>}

              <div className="flex items-end gap-2 sm:gap-3">
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" onChange={handleCameraCapture} className="hidden" />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="app-shell-pill h-11 w-11 rounded-2xl flex-shrink-0" disabled={loading}>
                      <Plus className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="border-border/70 bg-card/95 backdrop-blur-xl">
                    <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer text-foreground/80 hover:bg-primary/10">
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Upload Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => cameraInputRef.current?.click()} className="cursor-pointer text-foreground/80 hover:bg-primary/10">
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex-1 rounded-[24px] border border-border/70 bg-background/50 px-4">
                  <Textarea
                    ref={textareaRef}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    rows={1}
                    placeholder={language === 'hi' ? 'अपना सवाल यहाँ लिखें...' : language === 'mr' ? 'तुमचा प्रश्न येथे टाइप करा...' : 'Type your message...'}
                    className="min-h-[52px] max-h-36 resize-none border-0 bg-transparent px-0 py-3 text-sm text-foreground shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-base"
                    disabled={loading}
                  />
                </div>

                <Button
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
                  variant="ghost"
                  size="icon"
                  className={`h-11 w-11 rounded-2xl flex-shrink-0 ${isRecording ? 'border border-destructive/40 bg-destructive/10 text-destructive' : 'app-shell-pill'}`}
                  disabled={loading}
                >
                  <Mic className="h-4 w-4" />
                </Button>

                <Button
                  onClick={sendMessage}
                  size="icon"
                  className="h-11 w-11 rounded-2xl bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 disabled:opacity-50 flex-shrink-0"
                  disabled={loading || (!message.trim() && !selectedImage)}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
            </>}
        </main>

        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} user={user} />
        <ContactSupportModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />

        {/* E2E Encryption Passphrase Dialog */}
        <Dialog open={showPassphraseDialog} onOpenChange={setShowPassphraseDialog}>
          <DialogContent className="sm:max-w-md bg-black/95 border-green-500/30">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-green-500" />
                <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                  {passphraseMode === 'setup' ? 'Set Up Encryption' : 'Unlock Encrypted Messages'}
                </span>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {passphraseMode === 'setup'
                  ? 'Create a passphrase to encrypt your messages. Remember it — you\'ll need it to decrypt your messages on new sessions.'
                  : 'Enter your passphrase to decrypt your stored messages.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-green-400">Passphrase</label>
                <input
                  type="password"
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  placeholder="Enter your secret passphrase..."
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-green-500/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/60"
                  onKeyPress={(e) => { if (e.key === 'Enter' && passphraseMode === 'unlock') handlePassphraseSubmit(); }}
                />
              </div>
              {passphraseMode === 'setup' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-green-400">Confirm Passphrase</label>
                  <input
                    type="password"
                    value={passphraseConfirm}
                    onChange={(e) => setPassphraseConfirm(e.target.value)}
                    placeholder="Confirm your passphrase..."
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-green-500/30 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-green-500/60"
                    onKeyPress={(e) => { if (e.key === 'Enter') handlePassphraseSubmit(); }}
                  />
                </div>
              )}
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 mb-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-green-400" />
                  <span className="font-semibold text-green-400">How it works</span>
                </div>
                <ul className="space-y-1 ml-5 list-disc">
                  <li>Messages are encrypted with AES-256-GCM before storing in database</li>
                  <li>Encryption key is derived from your passphrase using PBKDF2 (100K iterations)</li>
                  <li>Key never leaves your browser — stored only in session memory</li>
                  <li>AI still reads your messages to respond, but database stores only ciphertext</li>
                </ul>
              </div>
              <Button
                onClick={handlePassphraseSubmit}
                disabled={!passphrase || (passphraseMode === 'setup' && !passphraseConfirm)}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-6 rounded-xl"
              >
                <ShieldCheck className="h-5 w-5 mr-2" />
                {passphraseMode === 'setup' ? 'Enable Encryption' : 'Unlock Messages'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
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

        {/* All Features Dialog */}
        <Dialog open={showAllFeatures} onOpenChange={setShowAllFeatures}>
          <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <Grid3X3 className="h-5 w-5 text-primary" />
                {language === 'hi' ? 'सभी सुविधाएं' : language === 'mr' ? 'सर्व वैशिष्ट्ये' : 'All Features'}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-3 py-4">
              {/* AI Chat */}
              <button
                onClick={() => {
                  setCurrentView('chat');
                  setShowAllFeatures(false);
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border/50 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                    <MessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-orange-400 transition-colors">
                      {language === 'hi' ? 'AI चैट सहायक' : language === 'mr' ? 'AI चॅट सहाय्यक' : 'AI Chat Assistant'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {language === 'hi' ? 'Gemini द्वारा संचालित बुद्धिमान AI चैटबॉट' : language === 'mr' ? 'Gemini द्वारे समर्थित बुद्धिमान AI चॅटबॉट' : 'Intelligent AI chatbot powered by Gemini'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Code Generator */}
              <button
                onClick={() => {
                  setCurrentView('code');
                  setShowAllFeatures(false);
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border/50 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-600 to-red-500 shadow-lg">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-orange-400 transition-colors">
                      {language === 'hi' ? 'कोड जेनरेटर' : language === 'mr' ? 'कोड जनरेटर' : 'Code Generator'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {language === 'hi' ? '18+ प्रोग्रामिंग भाषाओं में कोड जनरेट करें' : language === 'mr' ? '18+ प्रोग्रामिंग भाषांमध्ये कोड तयार करा' : 'Generate code in 18+ programming languages'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Study Rooms */}
              <button
                onClick={() => {
                  setCurrentView('studyRooms');
                  setShowAllFeatures(false);
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border/50 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-orange-400 transition-colors">
                      {language === 'hi' ? 'स्टडी रूम' : language === 'mr' ? 'स्टडी रूम' : 'Study Rooms'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {language === 'hi' ? 'AI सहायता के साथ सहयोगी अध्ययन स्थान' : language === 'mr' ? 'AI सहाय्यासह सहयोगी अभ्यास जागा' : 'Collaborative study spaces with AI assistance'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Crop Health Analyzer */}
              <button
                onClick={() => {
                  setCurrentView('crop');
                  setShowAllFeatures(false);
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border/50 hover:border-green-500/50 hover:bg-green-500/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-green-400 transition-colors">
                      {language === 'hi' ? 'फसल स्वास्थ्य विश्लेषक' : language === 'mr' ? 'पीक आरोग्य विश्लेषक' : 'Crop Health Analyzer'}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {language === 'hi' ? 'AI-संचालित पौधों की बीमारी का निदान' : language === 'mr' ? 'AI-संचालित वनस्पती रोग निदान' : 'AI-powered plant disease diagnosis'}
                    </p>
                  </div>
                </div>
              </button>

              {/* Haq Jaano */}
              <button
                onClick={() => {
                  setCurrentView('haq-jaano');
                  setShowAllFeatures(false);
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border/50 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                    <Scale className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-blue-400 transition-colors">
                        {language === 'hi' ? 'हक जानो' : language === 'mr' ? 'हक्क जाणा' : 'Haq Jaano'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white animate-pulse">
                        NEW
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {language === 'hi' ? 'भारत का पहला AI कानूनी अधिकार सहायक' : language === 'mr' ? 'भारताचा पहिला AI कायदेशीर हक्क सहाय्यक' : "India's first AI Legal Rights Assistant"}
                    </p>
                  </div>
                </div>
              </button>

              {/* App Builder */}
              <button
                onClick={() => {
                  setCurrentView('fullstack');
                  setShowAllFeatures(false);
                }}
                className="w-full p-4 rounded-xl bg-gradient-to-r from-card to-card/50 border border-border/50 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 text-left group"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground group-hover:text-purple-400 transition-colors">
                        {language === 'hi' ? 'ऐप बिल्डर' : language === 'mr' ? 'ॲप बिल्डर' : 'App Builder'}
                      </h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white animate-pulse">
                        NEW
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {language === 'hi' ? 'अपने Supabase के साथ पूर्ण-स्टैक ऐप्स बनाएं' : language === 'mr' ? 'तुमच्या Supabase सह फुल-स्टॅक ॲप्स तयार करा' : "Build full-stack apps with your Supabase"}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Code Snippet Library Modal */}
        <CodeSnippetLibrary 
          open={showCodeLibrary}
          onOpenChange={setShowCodeLibrary}
          user={user} 
        />

        {/* Publish to Netlify Modal */}
        <PublishNetlifyModal
          open={publishModalOpen}
          onOpenChange={setPublishModalOpen}
          project={projectToPublish}
          onSuccess={(url) => {
            toast({
              title: '🚀 Published!',
              description: `Your website is live at ${url}`,
            });
          }}
        />
      </div>
    </SidebarProvider>;
};