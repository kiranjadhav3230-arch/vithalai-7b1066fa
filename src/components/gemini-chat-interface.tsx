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
import { LanguageSelector } from '@/components/ui/language-selector';
import { Send, Mic, Image as ImageIcon, Plus, MessageSquare, Trash2, Edit3, User as UserIcon, Menu, Star, Search, Settings, ChevronRight, Loader2, LogOut, Globe, Camera, Code, Copy, Check, X, Sparkles, MoreVertical, Download, Volume2, Square } from 'lucide-react';
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
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'code', 'imageGen'
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [referenceImageFile, setReferenceImageFile] = useState<File | null>(null);
  const [imageStyle, setImageStyle] = useState<string>('realistic');
  const [previousStyle, setPreviousStyle] = useState<string>('realistic');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageGenInputRef = useRef<HTMLInputElement>(null);
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
    if ((!message.trim() && !selectedImage) || !currentSession || loading) return;

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
      const { data: userMessageData, error: userMessageError } = await supabase
        .from('chat_messages')
        .insert([{
          session_id: currentSession.id,
          user_id: user.id,
          message: messageContent,
          message_type: messageType,
          image_data: imageToSend || null
        }])
        .select()
        .single();

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

      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: requestBody
      });

      if (error) throw error;

      // Update message with response
      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ 
          response: data.response,
          youtube_courses: data.youtubeCourses || null
        })
        .eq('id', userMessageData.id);

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
      toast({
        variant: "destructive",
        title: "❌ Error",
        description: error.message || "Failed to send message. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleImageGenSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReferenceImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setReferenceImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImageWithWatermark = async (imageUrl: string, prompt: string) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      const logoImg = new Image();
      await new Promise((resolve, reject) => {
        logoImg.onload = resolve;
        logoImg.onerror = reject;
        logoImg.src = vithalLogo;
      });

      canvas.width = img.width;
      canvas.height = img.height + 60;

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(img, 0, 0);

      const logoHeight = 40;
      const logoWidth = (logoImg.width / logoImg.height) * logoHeight;
      const logoX = (canvas.width - logoWidth) / 2;
      const logoY = img.height + 10;

      ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vithal-ai-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast({
          title: "✅ Image Downloaded",
          description: "Image saved with Vithal AI watermark",
        });
      }, 'image/png');
    } catch (error) {
      console.error('Error downloading image:', error);
      toast({
        title: "❌ Download Failed",
        description: "Could not download image",
        variant: "destructive",
      });
    }
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
          message: `🎨 Generate image (${imageStyle} style): ${prompt}`,
          message_type: 'text'
        }])
        .select()
        .single();

      if (userMessageError) throw userMessageError;

      // Reload messages to show user request
      await loadMessages(currentSession.id);

      // Call image generation function with style preset and language support
      const { data: imageData, error: functionError } = await supabase.functions.invoke('generate-image', {
        body: { 
          prompt,
          language,
          style: imageStyle,
          imageUrl: referenceImage || undefined
        }
      });

      if (functionError) throw functionError;

      if (!imageData?.imageUrl) {
        throw new Error('No image URL received');
      }

      // Save AI response with generated image
      const responseContent = `![Generated Image](${imageData.imageUrl})\n\n✨ Generated in ${imageStyle} style!`;
      
      const { error: responseError } = await supabase
        .from('chat_messages')
        .update({ 
          response: responseContent
        })
        .eq('id', userMessageData.id);

      if (responseError) throw responseError;

      await loadMessages(currentSession.id);
      
      // Generate smart title for first message in session
      if (messages.length === 0) {
        await generateSmartSessionTitle(currentSession.id, `🎨 Generate image: ${prompt}`, responseContent);
      }
      
      // Clear reference image after generation
      setReferenceImage(null);
      setReferenceImageFile(null);
      
      toast({
        title: "✅ Image Generated!",
        description: `Image created successfully in ${imageStyle} style`
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

  const handleEditMessage = async (messageId: string, newContent: string) => {
    if (!newContent.trim() || !currentSession) return;

    try {
      // Update the message in the database
      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({ message: newContent.trim() })
        .eq('id', messageId);

      if (updateError) throw updateError;

      // Clear the AI response for this message
      await supabase
        .from('chat_messages')
        .update({ response: null })
        .eq('id', messageId);

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
      const chatHistory = messages
        .filter(m => m.created_at <= messageToRegenerate.created_at && m.id !== messageId)
        .map(msg => ({
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

      // Check if this is an image generation request
      if (contentToUse.includes('🎨 Generate image:')) {
        const prompt = contentToUse.replace('🎨 Generate image:', '').trim();
        const { data: imageData, error: functionError } = await supabase.functions.invoke('generate-image', {
          body: { 
            prompt,
            language,
            imageUrl: referenceImage || undefined
          }
        });

        if (functionError) throw functionError;

        if (!imageData?.imageUrl) {
          throw new Error('No image URL received');
        }

        const responseContent = `![Generated Image](${imageData.imageUrl})\n\n${imageData.description || 'Image generated successfully'}`;
        
        await supabase
          .from('chat_messages')
          .update({ response: responseContent })
          .eq('id', messageId);

      } else {
        // Regular chat regeneration
        const { data, error } = await supabase.functions.invoke('gemini-chat', {
          body: requestBody
        });

        if (error) throw error;

        // Update message with new response
        await supabase
          .from('chat_messages')
          .update({ 
            response: data.response,
            youtube_courses: data.youtubeCourses || null
          })
          .eq('id', messageId);
      }

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
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        
        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(',')[1];
          
          try {
            // Call voice-to-text edge function
            const { data, error } = await supabase.functions.invoke('voice-to-text', {
              body: { 
                audio: base64Audio,
                language: language === 'hi' ? 'hi' : language === 'mr' ? 'mr' : 'en'
              }
            });

            if (error) throw error;

            if (data?.text) {
              setMessage(data.text);
              toast({
                title: "✅ Speech Recognized!",
                description: "Text has been transcribed"
              });
            }
          } catch (error: any) {
            console.error('Transcription error:', error);
            toast({
              variant: "destructive",
              title: "❌ Transcription Failed",
              description: error.message || "Could not transcribe audio"
            });
          }
        };
        reader.readAsDataURL(audioBlob);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks([]);
      recorder.start();
      setIsRecording(true);
      
      toast({
        title: "🎤 Recording...",
        description: "Speak now, I'm listening!"
      });
    } catch (error: any) {
      console.error('Microphone access error:', error);
      toast({
        variant: "destructive",
        title: "❌ Microphone Error",
        description: "Could not access microphone. Please check permissions."
      });
    }
  };

  const stopVoiceRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const playTextToSpeech = async (text: string, messageId: string) => {
    try {
      // Stop any currently playing audio
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      setPlayingAudio(messageId);

      // Clean the text for TTS
      const cleanText = text
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`[^`]*`/g, '') // Remove inline code
        .replace(/\*\*([^\*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^\*]+)\*/g, '$1') // Remove italic
        .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '') // Remove images
        .substring(0, 4000); // Limit to 4000 chars for TTS

      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { 
          text: cleanText,
          language: language === 'hi' ? 'hi' : language === 'mr' ? 'mr' : 'en'
        }
      });

      if (error) throw error;

      if (data?.audioContent) {
        // Convert base64 to audio
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audioContent), c => c.charCodeAt(0))],
          { type: 'audio/mpeg' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        
        audio.onended = () => {
          setPlayingAudio(null);
          URL.revokeObjectURL(audioUrl);
        };
        
        audio.onerror = () => {
          setPlayingAudio(null);
          URL.revokeObjectURL(audioUrl);
          toast({
            variant: "destructive",
            title: "❌ Playback Error",
            description: "Could not play audio"
          });
        };
        
        await audio.play();
      }
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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingAudio(null);
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
                <div className="hidden sm:flex relative items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-orange-500/20 overflow-hidden">
                  {/* Flowing Liquid Bubble Background */}
                  <div 
                    className="absolute inset-y-0.5 rounded-md transition-all duration-500 ease-out"
                    style={{
                      width: 'calc((100% - 0.25rem) / 3)',
                      left: `calc(0.125rem + (100% - 0.25rem) / 3 * ${currentView === 'chat' ? 0 : currentView === 'code' ? 1 : 2})`,
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(236, 72, 153, 0.7) 25%, rgba(59, 130, 246, 0.7) 50%, rgba(168, 85, 247, 0.8) 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'liquid-gradient-shift 3s ease infinite, liquid-glow-pulse 2s ease-in-out infinite, morph 4s ease-in-out infinite',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(236, 72, 153, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.3)',
                      zIndex: 0,
                    }}
                  />
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('chat')} 
                    size="sm" 
                    className={`relative h-6 px-2 text-[10px] md:text-xs transition-all z-10 ${
                      currentView === 'chat' 
                        ? 'text-white' 
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
                    className={`relative h-6 px-2 text-[10px] md:text-xs transition-all z-10 ${
                      currentView === 'code' 
                        ? 'text-white' 
                        : 'text-orange-400/70 hover:text-orange-400'
                    }`}
                  >
                    <Code className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">Code</span>
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('imageGen')} 
                    size="sm" 
                    className={`relative h-6 px-2 text-[10px] md:text-xs transition-all z-10 ${
                      currentView === 'imageGen' 
                        ? 'text-white' 
                        : 'text-orange-400/70 hover:text-orange-400'
                    }`}
                  >
                    <Sparkles className="h-3 w-3 md:mr-1" />
                    <span className="hidden md:inline">Image</span>
                  </Button>
                </div>

                {/* Mobile View Toggle */}
                <div className="sm:hidden relative flex items-center gap-1 bg-black/50 p-0.5 rounded-lg border border-orange-500/20 overflow-hidden">
                  {/* Flowing Liquid Bubble Background */}
                  <div 
                    className="absolute inset-y-0.5 rounded-md transition-all duration-500 ease-out"
                    style={{
                      width: 'calc((100% - 0.25rem) / 3)',
                      left: `calc(0.125rem + (100% - 0.25rem) / 3 * ${currentView === 'chat' ? 0 : currentView === 'code' ? 1 : 2})`,
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(236, 72, 153, 0.7) 25%, rgba(59, 130, 246, 0.7) 50%, rgba(168, 85, 247, 0.8) 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'liquid-gradient-shift 3s ease infinite, liquid-glow-pulse 2s ease-in-out infinite, morph 4s ease-in-out infinite',
                      backdropFilter: 'blur(20px)',
                      boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(236, 72, 153, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.3)',
                      zIndex: 0,
                    }}
                  />
                  
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('chat')} 
                    size="sm" 
                    className={`relative h-7 w-7 p-0 z-10 ${currentView === 'chat' ? 'text-white' : 'text-orange-400/50'}`}
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('code')} 
                    size="sm" 
                    className={`relative h-7 w-7 p-0 z-10 ${currentView === 'code' ? 'text-white' : 'text-orange-400/50'}`}
                  >
                    <Code className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setCurrentView('imageGen')} 
                    size="sm" 
                    className={`relative h-7 w-7 p-0 z-10 ${currentView === 'imageGen' ? 'text-white' : 'text-orange-400/50'}`}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
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
          {currentView === 'code' ? (
            <div className="flex-1 overflow-auto">
              <CodeGenerator />
            </div>
          ) : currentView === 'imageGen' ? (
            <>
              {/* Image Generation Chat Interface */}
              <div className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-3 md:p-6">
                    <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
                      {messages.length === 0 && !isGeneratingImage && (
                        <div className="text-center py-8 md:py-16">
                          <div className="w-16 h-16 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-600/10 flex items-center justify-center shadow-2xl shadow-purple-500/40 animate-pulse-glow">
                            <Sparkles className="w-8 h-8 md:w-12 md:h-12 text-purple-400" />
                          </div>
                          <h2 className="text-xl md:text-3xl font-bold mb-2 md:mb-3 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-600 bg-clip-text text-transparent px-4">Vithal AI Chitrakar</h2>
                          <p className="text-purple-400/70 text-sm md:text-lg mb-4 max-w-md mx-auto px-4">
                            Upload an image to edit or generate new images from text. Supports English, Hindi, and Marathi.
                          </p>


                          <div className="flex items-center justify-center gap-2 text-xs text-purple-400/60">
                            <span>🌐 English • 🇮🇳 हिंदी • 🇮🇳 मराठी</span>
                          </div>
                        </div>
                      )}

                      {messages.map(msg => (
                        <div key={msg.id} className="space-y-4">
                          {/* User Request */}
                          <div className="flex justify-end">
                            <div className="max-w-[85%] rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-3 shadow-xl shadow-purple-500/30">
                              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                              <div className="text-xs opacity-70 mt-1">
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>

                          {/* AI Generated Image/Response */}
                          {msg.response && (
                            <div className="flex justify-start">
                              <div className="flex items-start gap-3 w-full">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-600/10 flex items-center justify-center flex-shrink-0 mt-1 border border-purple-500/30 shadow-lg shadow-purple-500/20">
                                  <Sparkles className="w-6 h-6 text-purple-400" />
                                </div>
                                <div className="flex-1 max-w-[85%] rounded-2xl border border-purple-500/20 bg-black/50 backdrop-blur-sm px-6 py-4 shadow-lg group relative">
                                  <ChatMessageRenderer content={msg.response} />
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="text-xs text-purple-400/70">
                                      {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    {msg.response.includes('![Generated Image') && (
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => {
                                          const match = msg.response?.match(/!\[Generated Image[^\]]*\]\(([^)]+)\)/);
                                          if (match && match[1]) {
                                            downloadImageWithWatermark(match[1], msg.message);
                                          }
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs hover:bg-purple-500/10 text-purple-400"
                                      >
                                        <Download className="h-3 w-3 mr-1" />
                                        Download
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {isGeneratingImage && (
                        <div className="flex justify-start">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-600/10 flex items-center justify-center flex-shrink-0 mt-1 border border-purple-500/30 shadow-lg shadow-purple-500/20">
                              <Sparkles className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="max-w-[85%] rounded-2xl border border-purple-500/20 bg-black/50 backdrop-blur-sm px-6 py-4 shadow-lg">
                              <div className="flex items-center gap-3">
                                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                                <span className="text-sm text-purple-400">Creating your image...</span>
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

              {/* Image Generation Input */}
              <div className="border-t border-border/50 bg-background/80 backdrop-blur-2xl flex-shrink-0">
                <div className="max-w-5xl mx-auto px-4 py-4 md:py-5">
                  {/* Style Selection Bar */}
                  <div className="mb-3">
                    <div className="relative flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/30 border border-border/50 overflow-hidden">
                      {/* Flowing Liquid Bubble Background */}
                      <div 
                        className="absolute inset-y-1.5 rounded-md transition-all duration-500 ease-out"
                        style={{
                          width: 'calc((100% - 0.75rem) / 4)',
                          left: `calc(0.375rem + (100% - 0.75rem) / 4 * ${['realistic', 'cartoon', 'watercolor', 'sketch'].indexOf(imageStyle)})`,
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.8) 0%, rgba(236, 72, 153, 0.7) 25%, rgba(59, 130, 246, 0.7) 50%, rgba(168, 85, 247, 0.8) 100%)',
                          backgroundSize: '200% 200%',
                          animation: 'liquid-gradient-shift 3s ease infinite, liquid-glow-pulse 2s ease-in-out infinite, morph 4s ease-in-out infinite',
                          backdropFilter: 'blur(20px)',
                          boxShadow: '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(236, 72, 153, 0.3), inset 0 0 20px rgba(168, 85, 247, 0.3)',
                          zIndex: 0,
                        }}
                      />
                      
                      {[
                        { value: 'realistic', label: 'Realistic' },
                        { value: 'cartoon', label: 'Cartoon' },
                        { value: 'watercolor', label: 'Watercolor' },
                        { value: 'sketch', label: 'Sketch' }
                      ].map((style) => (
                        <button
                          key={style.value}
                          onClick={() => {
                            setPreviousStyle(imageStyle);
                            setImageStyle(style.value);
                          }}
                          className={`relative flex-1 px-3 py-1.5 rounded-md transition-all text-xs font-medium z-10 ${
                            imageStyle === style.value
                              ? 'text-white'
                              : 'hover:bg-muted/50'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Reference Image Preview */}
                  {referenceImage && (
                    <div className="mb-3">
                      <div className="relative inline-block rounded-xl overflow-hidden border border-purple-500/30 shadow-lg">
                        <img 
                          src={referenceImage} 
                          alt="Reference" 
                          className="max-h-32 md:max-h-40 object-contain bg-muted/50" 
                        />
                        <button 
                          onClick={() => {
                            setReferenceImage(null);
                            setReferenceImageFile(null);
                          }} 
                          className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1.5 shadow-lg transition-all hover:scale-110"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-purple-400/70 mt-2">Reference image for editing</p>
                    </div>
                  )}

                  <div className="relative flex items-end gap-2 md:gap-3 rounded-3xl bg-muted/50 border border-border/50 px-3 md:px-4 py-2 focus-within:border-primary/50 focus-within:bg-muted/70 transition-all duration-200 shadow-sm hover:shadow-md">
                    {/* Hidden File Input */}
                    <input 
                      ref={imageGenInputRef} 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageGenSelect} 
                      className="hidden" 
                    />

                    {/* Upload Image Button */}
                    <Button 
                      onClick={() => imageGenInputRef.current?.click()}
                      variant="ghost" 
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                      disabled={isGeneratingImage}
                    >
                      <ImageIcon className="h-5 w-5" />
                    </Button>

                    {/* Textarea */}
                    <Textarea
                      ref={textareaRef}
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        // Auto-resize textarea
                        if (textareaRef.current) {
                          textareaRef.current.style.height = 'auto';
                          textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (message.trim()) {
                            generateImage(message.trim());
                            setMessage('');
                            if (textareaRef.current) textareaRef.current.style.height = 'auto';
                          }
                        }
                      }}
                      placeholder={referenceImage ? "Describe how to modify this image..." : "Describe the image you want to create..."}
                      className="flex-1 bg-transparent border-0 outline-none text-sm md:text-base text-foreground placeholder:text-muted-foreground resize-none min-h-[40px] max-h-[160px] py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                      disabled={isGeneratingImage}
                      rows={1}
                    />

                    {/* Send Button */}
                    <Button 
                      onClick={() => {
                        if (message.trim()) {
                          generateImage(message.trim());
                          setMessage('');
                          if (textareaRef.current) textareaRef.current.style.height = 'auto';
                        }
                      }}
                      size="icon"
                      className="h-9 w-9 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex-shrink-0"
                      disabled={isGeneratingImage || !message.trim()}
                    >
                      {isGeneratingImage ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Sparkles className="h-5 w-5" />
                      )}
                    </Button>
                  </div>

                  {/* Helper Text */}
                  <div className="mt-2 text-center">
                    <p className="text-xs text-muted-foreground">
                      {referenceImage 
                        ? "Vithal AI Chitrakar - Edit or modify your uploaded image" 
                        : "Vithal AI Chitrakar - Supports English, Hindi (हिंदी), and Marathi (मराठी)"
                      }
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
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
                      <div className="flex justify-end group">
                        <div className="max-w-[85%]">
                          {editingMessageId === msg.id ? (
                            <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 shadow-xl shadow-orange-500/30">
                              <Textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 mb-2 min-h-[60px]"
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleEditMessage(msg.id, editedContent)}
                                  className="bg-white text-orange-600 hover:bg-white/90"
                                >
                                  <Check className="h-3 w-3 mr-1" />
                                  Save
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setEditingMessageId(null);
                                    setEditedContent('');
                                  }}
                                  className="text-white hover:bg-white/10"
                                >
                                  <X className="h-3 w-3 mr-1" />
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 shadow-xl shadow-orange-500/30">
                                {msg.message_type === 'image' && (msg as any).image_data && (
                                  <img 
                                    src={(msg as any).image_data} 
                                    alt="Uploaded" 
                                    className="mb-2 rounded-lg max-w-full h-auto max-h-64 object-contain"
                                  />
                                )}
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                                <div className="text-xs opacity-70 mt-1">
                                  {new Date(msg.created_at).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingMessageId(msg.id);
                                  setEditedContent(msg.message);
                                }}
                                className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 hover:bg-orange-500/10 text-orange-400"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          )}
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
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        if (playingAudio === msg.id) {
                                          stopTextToSpeech();
                                        } else {
                                          playTextToSpeech(msg.response || '', msg.id);
                                        }
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs hover:bg-orange-500/10 text-orange-400"
                                      disabled={loading}
                                    >
                                      {playingAudio === msg.id ? (
                                        <>
                                          <Square className="h-3 w-3 mr-1 fill-current" />
                                          Stop
                                        </>
                                      ) : (
                                        <>
                                          <Volume2 className="h-3 w-3 mr-1" />
                                          Listen
                                        </>
                                      )}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => regenerateResponse(msg.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity h-7 px-2 text-xs hover:bg-orange-500/10 text-orange-400"
                                      disabled={loading}
                                    >
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
              {selectedImage && (
                <div className="mb-3">
                  <div className="relative inline-block rounded-xl overflow-hidden border border-border/50 shadow-lg">
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="max-h-32 md:max-h-40 object-contain bg-muted/50" 
                    />
                    <button 
                      onClick={removeSelectedImage} 
                      className="absolute top-2 right-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-full p-1.5 shadow-lg transition-all hover:scale-110"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Input Container */}
              <div className="relative flex items-end gap-2 md:gap-3 rounded-3xl bg-muted/50 border border-border/50 px-3 md:px-4 py-2 focus-within:border-primary/50 focus-within:bg-muted/70 transition-all duration-200 shadow-sm hover:shadow-md">
                {/* Hidden File Inputs */}
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

                {/* Textarea */}
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    // Auto-resize textarea
                    if (textareaRef.current) {
                      textareaRef.current.style.height = 'auto';
                      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
                    }
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                      if (textareaRef.current) textareaRef.current.style.height = 'auto';
                    }
                  }}
                  placeholder={t('typeYourMessage') || "Message Vithal AI..."}
                  className="flex-1 bg-transparent border-0 outline-none text-sm md:text-base text-foreground placeholder:text-muted-foreground resize-none min-h-[40px] max-h-[160px] py-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                  disabled={loading}
                  rows={1}
                />

                {/* Mic Button */}
                <Button 
                  onClick={isRecording ? stopVoiceRecording : startVoiceRecording} 
                  variant="ghost" 
                  size="icon"
                  className={`h-9 w-9 rounded-full transition-all flex-shrink-0 ${
                    isRecording 
                      ? 'bg-destructive/20 text-destructive hover:bg-destructive/30 animate-pulse' 
                      : 'hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                  disabled={loading}
                >
                  <Mic className="h-5 w-5" />
                </Button>

                {/* Three Dot Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" 
                      disabled={loading}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-popover/95 backdrop-blur-xl border-border/50">
                    <DropdownMenuItem 
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer text-sm py-2.5"
                    >
                      <ImageIcon className="h-4 w-4 mr-3 text-primary" />
                      <span>Upload Image</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => cameraInputRef.current?.click()}
                      className="cursor-pointer text-sm py-2.5"
                    >
                      <Camera className="h-4 w-4 mr-3 text-primary" />
                      <span>Take Photo</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => setCurrentView('imageGen')}
                      className="cursor-pointer text-sm py-2.5"
                    >
                      <Sparkles className="h-4 w-4 mr-3 text-purple-500" />
                      <span>Generate Image</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Send Button */}
                <Button 
                  onClick={() => {
                    sendMessage();
                    if (textareaRef.current) textareaRef.current.style.height = 'auto';
                  }}
                  size="icon"
                  className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 flex-shrink-0"
                  disabled={loading || (!message.trim() && !selectedImage)}
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
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
            </>
          )}
        </main>

        <ProfileModal isOpen={showProfile} onClose={() => setShowProfile(false)} user={user} />
        <ContactSupportModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
      </div>
    </SidebarProvider>;
};