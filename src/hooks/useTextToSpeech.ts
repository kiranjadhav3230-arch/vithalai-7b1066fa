import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useTextToSpeech = (language: string = 'en') => {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const { toast } = useToast();

  // Load voices when available
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string, id: string) => {
    try {
      // Stop any currently playing speech
      window.speechSynthesis.cancel();
      setPlayingId(id);

      // Clean the text for TTS
      const cleanText = text
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
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
      const availableVoices = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
      let selectedVoice = null;

      // Find male voice for the selected language
      if (language === 'hi') {
        selectedVoice = availableVoices.find(v => v.lang.includes('hi') && v.name.toLowerCase().includes('male')) ||
          availableVoices.find(v => v.lang.includes('hi'));
      } else if (language === 'mr') {
        selectedVoice = availableVoices.find(v => v.lang.includes('mr') && v.name.toLowerCase().includes('male')) ||
          availableVoices.find(v => v.lang.includes('mr')) ||
          availableVoices.find(v => v.lang.includes('hi')); // Fallback to Hindi
      } else {
        // English - prefer Google US English Male or similar
        selectedVoice = availableVoices.find(v => v.lang.includes('en') && v.name.toLowerCase().includes('male')) ||
          availableVoices.find(v => v.name.includes('Google US English')) ||
          availableVoices.find(v => v.lang.includes('en-US'));
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      // Match exact settings from main chat
      utterance.rate = 1.0;
      utterance.pitch = 0.9; // Slightly lower pitch for male voice
      utterance.volume = 1.0;

      utterance.onend = () => {
        setPlayingId(null);
      };

      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setPlayingId(null);
        toast({
          variant: "destructive",
          title: "Speech Error",
          description: "Could not play speech"
        });
      };

      window.speechSynthesis.speak(utterance);
    } catch (error: any) {
      console.error('Text-to-speech error:', error);
      setPlayingId(null);
      toast({
        variant: "destructive",
        title: "Speech Failed",
        description: error.message || "Could not generate speech"
      });
    }
  }, [language, voices, toast]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setPlayingId(null);
  }, []);

  const isPlaying = useCallback((id: string) => playingId === id, [playingId]);

  return { speak, stop, isPlaying, playingId };
};
