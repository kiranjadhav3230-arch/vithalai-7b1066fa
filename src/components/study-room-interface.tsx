import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, Users, FileText, Plus, Loader2, Image, X, Heart, ThumbsUp, Smile, Bot, BotOff, UserPlus, Copy, Link as LinkIcon, Trash2, Settings, Reply, LogOut, Bell } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { StudyRoomWelcomeAnimation } from './study-room-welcome-animation';

interface Message {
  id: string;
  message: string;
  is_ai_response: boolean;
  user_id: string | null;
  created_at: string;
  image_data?: string | null;
  sender_name?: string | null;
  reactions?: { type: string; count: number; users: string[] }[];
  reply_to?: string | null;
  replied_message?: {
    id: string;
    message: string;
    is_ai_response: boolean;
    sender_name?: string | null;
  };
}

interface Note {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
  display_name?: string | null;
  is_online?: boolean;
}

export const StudyRoomInterface: React.FC<{
  room: any;
  user: any;
  onBack: () => void;
}> = ({ room, user, onBack }) => {
  const [showWelcome, setShowWelcome] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [inputMessage, setInputMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [aiMode, setAiMode] = useState(true);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Note form states
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  // Invite dialog state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  
  // Member management dialog state
  const [isMemberManagementOpen, setIsMemberManagementOpen] = useState(false);
  const [updatingMemberId, setUpdatingMemberId] = useState<string | null>(null);
  
  // Reply state
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  
  // Leave confirmation state
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  
  // Notification permission state
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);

  // Check notification permission on mount and setup real-time message listener
  useEffect(() => {
    if ('Notification' in window) {
      const currentPermission = Notification.permission;
      setNotificationPermission(currentPermission);
      
      // Hide banner if already granted
      if (currentPermission === 'granted') {
        setShowNotificationBanner(false);
      }
    }

    // Subscribe to real-time messages for browser notifications
    const channel = supabase
      .channel('room-messages-' + room.id)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_messages',
          filter: `room_id=eq.${room.id}`
        },
        (payload) => {
          const newMessage = payload.new;
          
          // Only send notification if message is not from current user and user has granted permission
          if (newMessage.user_id !== user.id && Notification.permission === 'granted') {
            const senderName = newMessage.sender_name || 'Someone';
            const messageText = newMessage.message.length > 50 
              ? newMessage.message.substring(0, 50) + '...' 
              : newMessage.message;
            
            const notification = new Notification(`${senderName} in ${room.name}`, {
              body: messageText,
              icon: '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png',
              tag: room.id,
              requireInteraction: false,
            });

            // Update unread count in localStorage (for badge counter)
            const currentCount = parseInt(localStorage.getItem('studyRoomUnreadCount') || '0');
            localStorage.setItem('studyRoomUnreadCount', (currentCount + 1).toString());
            
            // Trigger storage event for cross-component communication
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'studyRoomUnreadCount',
              newValue: (currentCount + 1).toString(),
            }));

            notification.onclick = () => {
              window.focus();
              notification.close();
            };

            // Auto-close after 5 seconds
            setTimeout(() => notification.close(), 5000);
          }

          // Refresh messages to show new message
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room.id, user.id]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Notifications are not supported in this browser.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // This triggers the browser's native permission popup
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      
      if (permission === 'granted') {
        setShowNotificationBanner(false);
        toast({
          title: 'Notifications Enabled',
          description: 'You will receive room updates.',
        });
        
        // Send a test notification
        new Notification('Vithal AI Study Room', {
          body: 'Notifications are now enabled for this room!',
          icon: '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png',
        });
      } else if (permission === 'denied') {
        setShowNotificationBanner(false);
        toast({
          title: 'Notifications Blocked',
          description: 'Please enable notifications in your browser settings.',
          variant: 'destructive',
        });
      } else {
        // User dismissed the popup without choosing
        toast({
          title: 'Permission Required',
          description: 'Please allow notifications to receive updates.',
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: 'Error',
        description: 'Failed to request notification permission.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    loadMessages();
    loadNotes();
    loadMembers();

    // Set up presence tracking
    const presenceChannel = supabase.channel(`room-presence-${room.id}`, {
      config: { presence: { key: user.id } }
    });

    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const state = presenceChannel.presenceState();
        const online = new Set<string>();
        Object.values(state).forEach((presences: any) => {
          presences.forEach((presence: any) => {
            if (presence.user_id) {
              online.add(presence.user_id);
            }
          });
        });
        setOnlineUsers(online);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
          });
        }
      });

    // Subscribe to realtime updates
    const messagesChannel = supabase
      .channel(`room-messages-${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_messages',
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => [...prev, newMessage]);
          
          // Show browser notification if document is hidden and user didn't send the message
          if (document.hidden && newMessage.user_id !== user.id && notificationPermission === 'granted') {
            const notificationTitle = newMessage.is_ai_response 
              ? '🤖 AI Assistant in ' + room.name
              : (newMessage.sender_name || 'Someone') + ' in ' + room.name;
            const notificationBody = newMessage.message.length > 100 
              ? newMessage.message.substring(0, 100) + '...' 
              : newMessage.message;
            
            new Notification(notificationTitle, {
              body: notificationBody,
              icon: '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png',
              tag: 'room-message-' + newMessage.id,
            });
          }
        }
      )
      .subscribe();

    const notesChannel = supabase
      .channel(`room-notes-${room.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'room_notes',
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          loadNotes();
        }
      )
      .subscribe();

    const membersChannel = supabase
      .channel(`room-members-${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'room_members',
          filter: `room_id=eq.${room.id}`,
        },
        async (payload) => {
          loadMembers();
          
          // Show notification when someone joins
          if (document.hidden && notificationPermission === 'granted' && payload.new.user_id !== user.id) {
            // Fetch the user's profile to get display name
            const { data: profile } = await supabase
              .from('profiles')
              .select('display_name')
              .eq('user_id', payload.new.user_id)
              .single();
            
            const memberName = profile?.display_name || 'Someone';
            new Notification('New Member Joined', {
              body: `${memberName} joined ${room.name}`,
              icon: '/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png',
              tag: 'room-member-joined-' + payload.new.id,
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'room_members',
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          loadMembers();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'room_members',
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          loadMembers();
        }
      )
      .subscribe();

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel(`room-typing-${room.id}`)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.user_id !== user.id) {
          setTypingUsers(prev => ({
            ...prev,
            [payload.user_id]: payload.display_name
          }));
          
          // Clear typing indicator after 3 seconds
          setTimeout(() => {
            setTypingUsers(prev => {
              const updated = { ...prev };
              delete updated[payload.user_id];
              return updated;
            });
          }, 3000);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(presenceChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(notesChannel);
      supabase.removeChannel(membersChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [room.id, user.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update members when online users change
  useEffect(() => {
    if (members.length > 0) {
      const updatedMembers = members.map(m => ({
        ...m,
        is_online: onlineUsers.has(m.user_id)
      }));
      setMembers(updatedMembers);
    }
  }, [onlineUsers]);

  const loadMessages = async () => {
    const { data } = await supabase
      .from('room_messages')
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: true });

    if (data) {
      // Load reactions and replied message for each message
      const messagesWithReactions = await Promise.all(data.map(async (msg) => {
        // Fetch reactions
        const { data: reactionsData } = await supabase
          .from('room_message_reactions')
          .select('reaction_type, user_id')
          .eq('message_id', msg.id);

        // Group reactions by type
        const reactionsMap = new Map<string, { count: number; users: string[] }>();
        reactionsData?.forEach(r => {
          const existing = reactionsMap.get(r.reaction_type) || { count: 0, users: [] };
          existing.count++;
          existing.users.push(r.user_id);
          reactionsMap.set(r.reaction_type, existing);
        });

        const reactions = Array.from(reactionsMap.entries()).map(([type, data]) => ({
          type,
          count: data.count,
          users: data.users
        }));

        // Fetch replied message if exists
        let replied_message = null;
        if (msg.reply_to) {
          const { data: replyData } = await supabase
            .from('room_messages')
            .select('id, message, is_ai_response, sender_name')
            .eq('id', msg.reply_to)
            .single();
          
          replied_message = replyData;
        }

        return { ...msg, reactions, replied_message };
      }));

      setMessages(messagesWithReactions);
    }
  };

  const loadNotes = async () => {
    const { data } = await supabase
      .from('room_notes')
      .select('*')
      .eq('room_id', room.id)
      .order('created_at', { ascending: false });

    if (data) setNotes(data);
  };

  const loadMembers = async () => {
    const { data: memberData } = await supabase
      .from('room_members')
      .select('id, user_id, role, joined_at')
      .eq('room_id', room.id);

    if (memberData) {
      // Fetch profiles for all members
      const userIds = memberData.map(m => m.user_id);
      const { data: profileData } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      const profileMap = new Map(profileData?.map(p => [p.user_id, p.display_name]) || []);
      
      const enrichedMembers = memberData.map(m => ({
        ...m,
        display_name: profileMap.get(m.user_id),
        is_online: onlineUsers.has(m.user_id)
      }));

      setMembers(enrichedMembers);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTyping = async () => {
    if (!user) return;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Get user profile for display name
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('user_id', user.id)
      .single();

    // Broadcast typing status
    const typingChannel = supabase.channel(`room-typing-${room.id}`);
    await typingChannel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        user_id: user.id,
        display_name: profile?.display_name || 'Someone'
      }
    });

    // Set timeout to stop showing typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      typingTimeoutRef.current = null;
    }, 3000);
  };

  const sendMessage = async () => {
    if ((!inputMessage.trim() && !selectedImage) || isLoadingAI) return;

    const messageText = inputMessage;
    const imageData = selectedImage;
    const replyToMessage = replyingTo;
    setInputMessage('');
    setSelectedImage(null);
    setReplyingTo(null);

    try {
      // Get sender name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();

      // Save user message
      const { error } = await supabase.from('room_messages').insert({
        room_id: room.id,
        user_id: user.id,
        message: messageText || (imageData ? 'Sent an image' : ''),
        image_data: imageData,
        sender_name: profile?.display_name || 'User',
        is_ai_response: false,
        reply_to: replyToMessage?.id || null,
      });

      if (error) throw error;

      // Get AI response if there's text and AI mode is enabled
      if ((messageText.trim() || imageData) && aiMode) {
        setIsLoadingAI(true);
        const { data, error: aiError } = await supabase.functions.invoke('room-chat', {
          body: {
            roomId: room.id,
            message: messageText || 'Please analyze this image',
            userId: user.id,
            imageData: imageData,
            replyTo: replyToMessage ? {
              id: replyToMessage.id,
              message: replyToMessage.message,
              is_ai_response: replyToMessage.is_ai_response,
              sender_name: replyToMessage.sender_name
            } : null,
          },
        });

        if (aiError) throw aiError;
        setIsLoadingAI(false);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoadingAI(false);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const createNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('room_notes').insert({
        room_id: room.id,
        user_id: user.id,
        title: noteTitle,
        content: noteContent,
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Note created successfully',
      });

      setIsNoteOpen(false);
      setNoteTitle('');
      setNoteContent('');
    } catch (error) {
      console.error('Error creating note:', error);
      toast({
        title: 'Error',
        description: 'Failed to create note',
        variant: 'destructive',
      });
    }
  };

  const addReaction = async (messageId: string, reactionType: string) => {
    try {
      const { error } = await supabase.from('room_message_reactions').insert({
        message_id: messageId,
        user_id: user.id,
        reaction_type: reactionType,
      });

      if (error) {
        // If already reacted, remove the reaction
        if (error.code === '23505') {
          await supabase
            .from('room_message_reactions')
            .delete()
            .eq('message_id', messageId)
            .eq('user_id', user.id)
            .eq('reaction_type', reactionType);
        } else {
          throw error;
        }
      }

      // Reload messages to update reactions
      await loadMessages();
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to add reaction',
        variant: 'destructive',
      });
    }
  };

  const copyInviteCode = () => {
    if (room.invite_code) {
      navigator.clipboard.writeText(room.invite_code);
      toast({
        title: 'Copied!',
        description: 'Invite code copied to clipboard',
      });
    }
  };

  const copyInviteLink = () => {
    const inviteLink = `${window.location.origin}/?invite=${room.invite_code}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: 'Copied!',
      description: 'Invite link copied to clipboard',
    });
  };

  const leaveRoom = async () => {
    try {
      const { error } = await supabase
        .from('room_members')
        .delete()
        .eq('room_id', room.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'You have left the room',
      });

      setShowLeaveConfirm(false);
      onBack();
    } catch (error) {
      console.error('Error leaving room:', error);
      toast({
        title: 'Error',
        description: 'Failed to leave room',
        variant: 'destructive',
      });
    }
  };
  
  const handleLeaveClick = () => {
    setShowLeaveConfirm(true);
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    setUpdatingMemberId(memberId);
    try {
      const { error } = await supabase
        .from('room_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Member role updated successfully',
      });
      
      loadMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const handleRemoveMember = async (memberId: string, userId: string) => {
    if (userId === user?.id) {
      toast({
        title: 'Error',
        description: 'You cannot remove yourself',
        variant: 'destructive',
      });
      return;
    }

    setUpdatingMemberId(memberId);
    try {
      const { error } = await supabase
        .from('room_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Member removed successfully',
      });
      
      loadMembers();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setUpdatingMemberId(null);
    }
  };

  const isRoomCreator = user?.id === room.created_by;

  if (showWelcome) {
    return <StudyRoomWelcomeAnimation onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-xl font-bold">{room.name}</h2>
            {room.description && (
              <p className="text-sm text-muted-foreground">{room.description}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Members</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Invite Code</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={room.invite_code || ''} 
                      readOnly 
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={copyInviteCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Invite Link</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={`${window.location.origin}/?invite=${room.invite_code}`}
                      readOnly 
                      className="flex-1 text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={copyInviteLink}
                    >
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {isRoomCreator && (
            <Dialog open={isMemberManagementOpen} onOpenChange={setIsMemberManagementOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Members
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Manage Members</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 mt-4">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          {onlineUsers.has(member.user_id) && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">User {member.user_id.slice(0, 8)}</div>
                          <div className="text-xs text-muted-foreground capitalize">
                            {member.role}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Select
                          value={member.role}
                          onValueChange={(value) => handleRoleChange(member.id, value)}
                          disabled={updatingMemberId === member.id || member.user_id === user?.id}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="moderator">Moderator</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMember(member.id, member.user_id)}
                          disabled={updatingMemberId === member.id || member.user_id === user?.id}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          <Button variant="destructive" size="sm" onClick={handleLeaveClick}>
            <LogOut className="h-4 w-4 mr-2" />
            Leave Room
          </Button>
          
          <AlertDialog open={showLeaveConfirm} onOpenChange={setShowLeaveConfirm}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Leave Room?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to leave "{room.name}"? You'll need the invite code to rejoin.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={leaveRoom} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Leave Room
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            {onlineUsers.size} online / {members.length} total
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="notes">Notes ({notes.length})</TabsTrigger>
          <TabsTrigger value="members">Members ({members.length})</TabsTrigger>
        </TabsList>

        {/* Notification Permission Banner */}
        {showNotificationBanner && notificationPermission !== 'granted' && (
          <div className="mx-4 mt-4 bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <Bell className="h-5 w-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">Enable Notifications</h4>
                  <p className="text-xs text-muted-foreground mb-3">
                    Get real-time updates when members send messages, AI responds, or new members join the room.
                  </p>
                  <Button 
                    size="sm" 
                    onClick={requestNotificationPermission}
                    className="h-8"
                  >
                    Enable Notifications
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowNotificationBanner(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden p-4">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.is_ai_response ? 'items-start' : msg.user_id === user.id ? 'items-end' : 'items-start'}`}
                >
                  {!msg.is_ai_response && msg.user_id !== user.id && (
                    <div className="text-xs text-muted-foreground mb-1 ml-2">
                      {msg.sender_name || 'User'}
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.is_ai_response
                        ? 'bg-primary/10 border border-primary/20'
                        : msg.user_id === user.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {msg.is_ai_response && (
                      <div className="text-xs font-semibold mb-1">AI Assistant</div>
                    )}
                    {msg.user_id === user.id && (
                      <div className="text-xs opacity-70 mb-1">You</div>
                    )}
                    
                    {/* Show replied message context */}
                    {msg.replied_message && (
                      <div className={`mb-2 p-2 rounded border-l-2 text-xs ${
                        msg.is_ai_response || msg.user_id !== user.id
                          ? 'border-primary/40 bg-background/30'
                          : 'border-primary-foreground/40 bg-primary-foreground/10'
                      }`}>
                        <div className="font-semibold opacity-80">
                          {msg.replied_message.is_ai_response 
                            ? '🤖 AI Assistant' 
                            : msg.replied_message.sender_name || 'User'}
                        </div>
                        <div className="opacity-70 line-clamp-2">
                          {msg.replied_message.message}
                        </div>
                      </div>
                    )}
                    
                    {msg.image_data && (
                      <img
                        src={msg.image_data}
                        alt="Shared image"
                        className="max-w-full rounded-lg mb-2"
                      />
                    )}
                    <p className="text-sm whitespace-pre-wrap font-chat">{msg.message}</p>
                    <p className="text-xs opacity-60 mt-1">
                      {new Date(msg.created_at).toLocaleTimeString()}
                    </p>
                    {msg.reactions && msg.reactions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.reactions.map((reaction) => (
                          <button
                            key={reaction.type}
                            onClick={() => addReaction(msg.id, reaction.type)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                              reaction.users.includes(user.id)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            }`}
                          >
                            {reaction.type === 'like' && '👍'}
                            {reaction.type === 'heart' && '❤️'}
                            {reaction.type === 'smile' && '😊'}
                            <span>{reaction.count}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 mt-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 px-2"
                      onClick={() => setReplyingTo(msg)}
                    >
                      <Reply className="h-3 w-3" />
                    </Button>
                    {!msg.is_ai_response && (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                          onClick={() => addReaction(msg.id, 'like')}
                        >
                          👍
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                          onClick={() => addReaction(msg.id, 'heart')}
                        >
                          ❤️
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2"
                          onClick={() => addReaction(msg.id, 'smile')}
                        >
                          😊
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {isLoadingAI && (
                <div className="flex justify-start">
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              
              {/* Typing Indicator */}
              {Object.keys(typingUsers).length > 0 && (
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>
                    {Object.values(typingUsers).join(', ')} {Object.keys(typingUsers).length === 1 ? 'is' : 'are'} typing...
                  </span>
                </div>
              )}
              
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          <div className="space-y-2 mt-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button
                variant={aiMode ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAiMode(!aiMode)}
                className="gap-2"
              >
                {aiMode ? <Bot className="h-4 w-4" /> : <BotOff className="h-4 w-4" />}
                {aiMode ? 'AI Mode On' : 'AI Mode Off'}
              </Button>
            </div>
            
            {/* Reply context UI */}
            {replyingTo && (
              <div className="bg-muted p-3 rounded-lg relative">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-muted-foreground mb-1">
                      Replying to {replyingTo.is_ai_response ? '🤖 AI Assistant' : replyingTo.sender_name || 'User'}
                    </div>
                    <div className="text-sm line-clamp-2">
                      {replyingTo.message}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => setReplyingTo(null)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )}
            
            {selectedImage && (
              <div className="relative inline-block">
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="max-h-32 rounded-lg"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageSelect}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoadingAI}
              >
                <Image className="h-4 w-4" />
              </Button>
              <Input
                placeholder="Type your message..."
                value={inputMessage}
                onChange={(e) => {
                  setInputMessage(e.target.value);
                  handleTyping();
                }}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                disabled={isLoadingAI}
              />
              <Button onClick={sendMessage} disabled={isLoadingAI || (!inputMessage.trim() && !selectedImage)}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="flex-1 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Shared Notes</h3>
            <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Note</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      placeholder="Note title"
                    />
                  </div>
                  <div>
                    <Label>Content</Label>
                    <Textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Write your note here..."
                      rows={8}
                    />
                  </div>
                  <Button onClick={createNote} className="w-full">
                    Create Note
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-3">
              {notes.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No notes yet</p>
                  </CardContent>
                </Card>
              ) : (
                notes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader>
                      <CardTitle className="text-base">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(note.created_at).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="members" className="flex-1 p-4">
          <h3 className="text-lg font-semibold mb-4">Room Members ({members.length})</h3>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-2">
              {members.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No members found</p>
                  </CardContent>
                </Card>
              ) : (
                members.map((member) => (
                  <Card key={member.user_id}>
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${onlineUsers.has(member.user_id) ? 'bg-green-500' : 'bg-gray-400'}`} />
                          <div>
                            <p className="font-medium">
                              {member.display_name || 'User'}
                              {member.user_id === user.id && ' (You)'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {onlineUsers.has(member.user_id) ? 'Online' : 'Offline'} • Joined {new Date(member.joined_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};