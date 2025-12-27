import React, { useState, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface VoiceInputButtonProps {
  onVoiceInput: (text: string) => void;
  prompt: string;
}

export const VoiceInputButton: React.FC<VoiceInputButtonProps> = ({
  onVoiceInput,
  prompt,
}) => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const startListening = useCallback(async () => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      toast({
        title: language === 'hi' ? 'असमर्थित' : language === 'mr' ? 'असमर्थित' : 'Not Supported',
        description: language === 'hi' 
          ? 'आपका ब्राउज़र वॉइस इनपुट का समर्थन नहीं करता'
          : language === 'mr'
          ? 'तुमचा ब्राउझर व्हॉइस इनपुट समर्थन करत नाही'
          : 'Your browser does not support voice input',
        variant: 'destructive',
      });
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    // Set language based on current selection
    switch (language) {
      case 'hi':
        recognition.lang = 'hi-IN';
        break;
      case 'mr':
        recognition.lang = 'mr-IN';
        break;
      default:
        recognition.lang = 'en-IN';
    }

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setIsListening(false);
      onVoiceInput(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      toast({
        title: language === 'hi' ? 'त्रुटि' : language === 'mr' ? 'त्रुटी' : 'Error',
        description: language === 'hi' 
          ? 'वॉइस इनपुट में समस्या हुई'
          : language === 'mr'
          ? 'व्हॉइस इनपुटमध्ये समस्या आली'
          : 'Voice input failed',
        variant: 'destructive',
      });
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Failed to start recognition:', error);
      setIsListening(false);
    }
  }, [language, onVoiceInput, toast]);

  return (
    <button
      onClick={startListening}
      disabled={isListening || isProcessing}
      className={cn(
        'group relative mx-auto flex w-full max-w-md flex-col items-center gap-3 rounded-2xl',
        'border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-6',
        'transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20',
        isListening && 'border-primary shadow-lg shadow-primary/30'
      )}
    >
      <div className={cn(
        'relative flex h-16 w-16 items-center justify-center rounded-full',
        'bg-gradient-to-br from-primary to-primary/80',
        'transition-transform duration-300 group-hover:scale-110',
        isListening && 'animate-pulse'
      )}>
        {isListening ? (
          <div className="relative">
            <Mic className="h-8 w-8 text-primary-foreground" />
            {/* Animated rings */}
            <span className="absolute -inset-4 animate-ping rounded-full border-2 border-primary/50" />
            <span className="absolute -inset-8 animate-ping rounded-full border border-primary/30" style={{ animationDelay: '0.5s' }} />
          </div>
        ) : isProcessing ? (
          <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
        ) : (
          <Mic className="h-8 w-8 text-primary-foreground" />
        )}
      </div>
      
      <span className="text-lg font-medium text-foreground">
        {isListening 
          ? (language === 'hi' ? 'सुन रहा हूं...' : language === 'mr' ? 'ऐकतोय...' : 'Listening...')
          : prompt
        }
      </span>
      
      <span className="text-sm text-muted-foreground">
        {language === 'hi' ? 'बोलने के लिए टैप करें' : 
         language === 'mr' ? 'बोलण्यासाठी टॅप करा' : 'Tap to speak'}
      </span>
    </button>
  );
};
