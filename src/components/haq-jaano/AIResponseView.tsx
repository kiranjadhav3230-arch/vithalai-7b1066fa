import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Sparkles, Loader2, Copy, Volume2, VolumeX, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/hooks/useLanguage';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIResponseViewProps {
  query: string;
  onBack: () => void;
}

export const AIResponseView: React.FC<AIResponseViewProps> = ({
  query,
  onBack,
}) => {
  const { language } = useLanguage();
  const { speak, stop, isPlaying } = useTextToSpeech(language);
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!hasFetched && query) {
      sendMessage(query);
      setHasFetched(true);
    }
  }, [query, hasFetched]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: messageText };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await supabase.functions.invoke('haq-jaano-ai', {
        body: { messages: updatedMessages, language },
      });

      if (response.error) throw response.error;

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response || '',
      };
      setMessages([...updatedMessages, assistantMessage]);
    } catch (error) {
      console.error('Error asking AI:', error);
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' ? 'AI से उत्तर नहीं मिल सका' :
          language === 'mr' ? 'AI कडून उत्तर मिळू शकले नाही' : 'Could not get AI response',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: language === 'hi' ? 'कॉपी हुआ' : language === 'mr' ? 'कॉपी झाले' : 'Copied',
      description: language === 'hi' ? 'जवाब क्लिपबोर्ड पर कॉपी हुआ' :
        language === 'mr' ? 'उत्तर क्लिपबोर्डवर कॉपी झाले' : 'Response copied to clipboard',
    });
  };

  const handleSpeak = (text: string, id: string) => {
    if (isPlaying(id)) {
      stop();
    } else {
      speak(text, id);
    }
  };

  const getTitle = () => {
    switch (language) {
      case 'hi': return 'AI सहायक';
      case 'mr': return 'AI सहाय्यक';
      default: return 'AI Assistant';
    }
  };

  const getInputPlaceholder = () => {
    switch (language) {
      case 'hi': return 'अपना सवाल लिखें...';
      case 'mr': return 'तुमचा प्रश्न लिहा...';
      default: return 'Type your question...';
    }
  };

  const getSendText = () => {
    switch (language) {
      case 'hi': return 'भेजें';
      case 'mr': return 'पाठवा';
      default: return 'Send';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border/50 bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex items-center gap-4 px-4 py-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">{getTitle()}</h1>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3",
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card border border-border/50 rounded-bl-md'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/30">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Haq Jaano AI</span>
                  <div className="ml-auto flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSpeak(message.content, `msg-${index}`)}
                      className="h-7 w-7"
                    >
                      {isPlaying(`msg-${index}`) ? (
                        <VolumeX className="h-3.5 w-3.5" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopy(message.content)}
                      className="h-7 w-7"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              )}
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-card border border-border/50 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  {language === 'hi' ? 'सोच रहा हूं...' :
                    language === 'mr' ? 'विचार करत आहे...' : 'Thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-background/95 backdrop-blur-sm p-4">
        <form onSubmit={handleSubmit} className="container mx-auto flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={getInputPlaceholder()}
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl"
          />
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="h-12 px-6 rounded-xl gap-2"
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">{getSendText()}</span>
          </Button>
        </form>
      </div>
    </div>
  );
};
