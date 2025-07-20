import React, { useState, useEffect } from 'react';
import { Send, User, Bot, Settings, Youtube, BookOpen, Star, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/hooks/useLanguage';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  courses?: string[];
}

interface ChatInterfaceProps {
  onLogout: () => void;
  user: any;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ onLogout, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [profile, setProfile] = useState({
    display_name: '',
    bio: '',
    skills: [] as string[],
    interests: [] as string[],
    education: '',
    experience: '',
    phone: ''
  });
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    loadChatHistory();
    loadProfile();
    initializeSpeechRecognition();
  }, []);

  const initializeSpeechRecognition = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
        toast({
          title: "Error",
          description: "Voice recognition failed. Please try again.",
          variant: "destructive"
        });
      };
      
      setRecognition(recognition);
    }
  };

  const loadProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setProfile({
        display_name: data.display_name || '',
        bio: data.bio || '',
        skills: data.skills || [],
        interests: data.interests || [],
        education: data.education || '',
        experience: data.experience || '',
        phone: data.phone || ''
      });
    }
  };

  const updateProfile = async () => {
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setShowProfile(false);
    }
  };

  const loadChatHistory = async () => {
    const { data, error } = await supabase
      .from('chat_history')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(50);

    if (data) {
      const chatMessages: Message[] = data.map(chat => [
        {
          id: `${chat.id}-user`,
          text: chat.message,
          isUser: true,
          timestamp: new Date(chat.created_at)
        },
        {
          id: `${chat.id}-ai`,
          text: chat.response,
          isUser: false,
          timestamp: new Date(chat.created_at)
        }
      ]).flat();
      setMessages(chatMessages);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('gemini-chat', {
        body: { 
          message: inputMessage,
          language: language === 'hi' ? 'hindi' : language === 'mr' ? 'marathi' : 'english',
          userProfile: profile
        }
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date(),
        courses: data.courseSuggestions
      };

      setMessages(prev => [...prev, aiMessage]);

      // Save to chat history
      await supabase.from('chat_history').insert({
        user_id: user.id,
        message: inputMessage,
        response: data.response,
        language: language === 'hi' ? 'hindi' : language === 'mr' ? 'marathi' : 'english'
      });

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was an error processing your message. Please try again.',
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const openYouTubeSearch = (course: string) => {
    const searchQuery = encodeURIComponent(course);
    window.open(`https://www.youtube.com/results?search_query=${searchQuery}`, '_blank');
  };

  const toggleVoiceRecognition = () => {
    if (!recognition) {
      toast({
        title: "Voice Recognition Not Supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-US';
      recognition.start();
      setIsListening(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png" 
              alt="Vithal AI Logo" 
              className="h-10 w-10"
            />
            <h1 className="text-xl font-bold text-foreground">Vithal AI Assistant</h1>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'mr')}
              className="px-3 py-1 rounded border bg-background"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
            
            <Dialog open={showProfile} onOpenChange={setShowProfile}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profile.display_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, display_name: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Input
                      id="education"
                      value={profile.education}
                      onChange={(e) => setProfile(prev => ({ ...prev, education: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                      id="experience"
                      value={profile.experience}
                      onChange={(e) => setProfile(prev => ({ ...prev, experience: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={updateProfile} className="flex-1">
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setShowProfile(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="container mx-auto p-4 h-[calc(100vh-80px)] flex flex-col">
        <ScrollArea className="flex-1 mb-4 p-4 border rounded-lg bg-card/50">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-semibold mb-2">Welcome to Vithal AI Assistant!</h3>
              <p>I'm here to help you discover your ideal career path. Ask me anything about:</p>
              <div className="grid grid-cols-2 gap-2 mt-4 max-w-md mx-auto">
                <Badge variant="secondary">Career Planning</Badge>
                <Badge variant="secondary">Skill Development</Badge>
                <Badge variant="secondary">Job Market</Badge>
                <Badge variant="secondary">Education Paths</Badge>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      message.isUser ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
                    }`}>
                      {message.isUser ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <img 
                          src="/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png" 
                          alt="Vithal AI" 
                          className="h-6 w-6 rounded-full"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Card className={`p-3 ${
                        message.isUser 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary text-secondary-foreground'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      </Card>
                      
                      {/* Course Suggestions */}
                      {!message.isUser && message.courses && message.courses.length > 0 && (
                        <Card className="p-3 bg-accent/30">
                          <div className="flex items-center gap-2 mb-2">
                            <Youtube className="h-4 w-4 text-red-500" />
                            <span className="text-sm font-medium">Recommended Free Courses:</span>
                          </div>
                          <div className="space-y-1">
                            {message.courses.map((course, index) => (
                              <button
                                key={index}
                                onClick={() => openYouTubeSearch(course)}
                                className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <BookOpen className="h-3 w-3 inline mr-1" />
                                {course}
                              </button>
                            ))}
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                  <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
                    <img 
                      src="/lovable-uploads/86deae4c-83c0-473f-9e54-1500aa44cd3c.png" 
                      alt="Vithal AI" 
                      className="h-6 w-6 rounded-full"
                    />
                  </div>
                    <Card className="p-3 bg-secondary text-secondary-foreground">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                        <span className="text-sm">Thinking...</span>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me about your career goals..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={toggleVoiceRecognition} 
            disabled={isLoading}
            variant={isListening ? "destructive" : "outline"}
            size="icon"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground mt-2 space-y-1">
          <p>Made by <span className="font-semibold text-primary">Shree Alankar</span></p>
          <p>Powered by <span className="font-semibold text-accent">Google Gemini AI</span></p>
        </div>
      </div>
    </div>
  );
};