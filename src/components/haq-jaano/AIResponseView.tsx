import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sparkles, Loader2, Copy, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { useHaqJaano } from '@/hooks/useHaqJaano';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AIResponseViewProps {
  query: string;
  onBack: () => void;
}

export const AIResponseView: React.FC<AIResponseViewProps> = ({
  query,
  onBack,
}) => {
  const { language } = useLanguage();
  const { askAI, isAiLoading, aiResponse } = useHaqJaano();
  const { speak, stop, isPlaying } = useTextToSpeech(language);
  const { toast } = useToast();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    if (!hasFetched && query) {
      askAI(query);
      setHasFetched(true);
    }
  }, [query, askAI, hasFetched]);

  const handleCopy = () => {
    navigator.clipboard.writeText(aiResponse);
    toast({
      title: language === 'hi' ? 'कॉपी हुआ' : language === 'mr' ? 'कॉपी झाले' : 'Copied',
      description: language === 'hi' ? 'जवाब क्लिपबोर्ड पर कॉपी हुआ' : 
        language === 'mr' ? 'उत्तर क्लिपबोर्डवर कॉपी झाले' : 'Response copied to clipboard',
    });
  };

  const handleSpeak = () => {
    if (isPlaying('ai-response')) {
      stop();
    } else {
      speak(aiResponse, 'ai-response');
    }
  };

  const getTitle = () => {
    switch (language) {
      case 'hi': return 'AI सहायक';
      case 'mr': return 'AI सहाय्यक';
      default: return 'AI Assistant';
    }
  };

  const getYourQuery = () => {
    switch (language) {
      case 'hi': return 'आपका सवाल';
      case 'mr': return 'तुमचा प्रश्न';
      default: return 'Your Question';
    }
  };

  const getAIResponse = () => {
    switch (language) {
      case 'hi': return 'AI का जवाब';
      case 'mr': return 'AI चे उत्तर';
      default: return 'AI Response';
    }
  };

  return (
    <div className="min-h-screen bg-background">
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

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* User Query */}
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          <p className="text-sm font-medium text-muted-foreground">{getYourQuery()}</p>
          <p className="mt-2 text-foreground">{query}</p>
        </div>

        {/* AI Response */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{getAIResponse()}</span>
            </div>
            {aiResponse && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSpeak}
                  className="h-8 w-8"
                >
                  {isPlaying('ai-response') ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopy}
                  className="h-8 w-8"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {isAiLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : aiResponse ? (
            <div className="prose prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground">{aiResponse}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">
              {language === 'hi' ? 'कोई जवाब नहीं मिला' : 
               language === 'mr' ? 'कोणतेही उत्तर सापडले नाही' : 
               'No response received'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
