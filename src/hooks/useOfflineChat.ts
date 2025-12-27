import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOfflineChatReturn {
  isOnline: boolean;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  modelStatus: 'not-downloaded' | 'downloading' | 'ready' | 'error';
  downloadProgress: number;
  downloadModel: () => Promise<void>;
  generateOfflineResponse: (message: string, chatHistory?: Array<{ role: string; content: string }>) => Promise<string>;
  forceOffline: boolean;
  setForceOffline: (value: boolean) => void;
}

const MODEL_CACHE_KEY = 'vithal-offline-model-ready';

export const useOfflineChat = (): UseOfflineChatReturn => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [forceOffline, setForceOffline] = useState(false);
  const [modelStatus, setModelStatus] = useState<'not-downloaded' | 'downloading' | 'ready' | 'error'>('not-downloaded');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const generatorRef = useRef<any>(null);
  const isLoadingRef = useRef(false);

  // Check if model was previously downloaded
  useEffect(() => {
    const cached = localStorage.getItem(MODEL_CACHE_KEY);
    if (cached === 'true') {
      setModelStatus('ready');
    }
  }, []);

  // Online/Offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOfflineMode = !isOnline || forceOffline;

  const toggleOfflineMode = useCallback(() => {
    setForceOffline(prev => !prev);
  }, []);

  const downloadModel = useCallback(async () => {
    if (isLoadingRef.current || modelStatus === 'downloading') return;
    
    isLoadingRef.current = true;
    setModelStatus('downloading');
    setDownloadProgress(0);

    try {
      console.log('Loading offline model...');
      
      // Dynamic import for better compatibility
      const { pipeline } = await import('@huggingface/transformers');
      
      // Use a smaller, more compatible model
      const MODEL_ID = 'Xenova/gpt2';
      
      // Simulate progress since the model loading may not report progress
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);

      const generator = await pipeline('text-generation', MODEL_ID, {
        progress_callback: (progress: any) => {
          if (progress.progress !== undefined) {
            setDownloadProgress(Math.round(progress.progress));
          }
        },
      });

      clearInterval(progressInterval);
      generatorRef.current = generator;
      setModelStatus('ready');
      setDownloadProgress(100);
      localStorage.setItem(MODEL_CACHE_KEY, 'true');
      console.log('Offline model loaded successfully!');
    } catch (error) {
      console.error('Failed to load offline model:', error);
      setModelStatus('error');
      setDownloadProgress(0);
    } finally {
      isLoadingRef.current = false;
    }
  }, [modelStatus]);

  const loadModelIfNeeded = useCallback(async () => {
    if (generatorRef.current) return true;
    if (modelStatus !== 'ready') return false;
    if (isLoadingRef.current) return false;

    isLoadingRef.current = true;
    try {
      const { pipeline } = await import('@huggingface/transformers');
      const MODEL_ID = 'Xenova/gpt2';

      const generator = await pipeline('text-generation', MODEL_ID);
      generatorRef.current = generator;
      return true;
    } catch (error) {
      console.error('Failed to reload model:', error);
      return false;
    } finally {
      isLoadingRef.current = false;
    }
  }, [modelStatus]);

  const generateOfflineResponse = useCallback(async (
    message: string,
    chatHistory?: Array<{ role: string; content: string }>
  ): Promise<string> => {
    const modelLoaded = await loadModelIfNeeded();
    
    if (!modelLoaded || !generatorRef.current) {
      return "⚠️ Offline AI model not loaded. Please download the model first to use offline mode.";
    }

    try {
      // Simple prompt for GPT-2
      const prompt = `Question: ${message}\nAnswer:`;

      const result = await generatorRef.current(prompt, {
        max_new_tokens: 100,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      });

      const generated = Array.isArray(result) ? result[0] : result;
      let response = (generated as any)?.generated_text || '';
      
      // Clean up the response
      response = response.split('\n\n')[0].trim();
      response = response.split('Question:')[0].trim();

      if (!response) {
        response = "I'm running in offline mode with limited capabilities. How can I help you?";
      }

      return response;
    } catch (error) {
      console.error('Offline generation error:', error);
      return "⚠️ Error generating offline response. Please try again.";
    }
  }, [loadModelIfNeeded]);

  return {
    isOnline,
    isOfflineMode,
    toggleOfflineMode,
    modelStatus,
    downloadProgress,
    downloadModel,
    generateOfflineResponse,
    forceOffline,
    setForceOffline,
  };
};
