import { useState, useEffect, useCallback, useRef } from 'react';
import { pipeline, TextGenerationPipeline } from '@huggingface/transformers';

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

const MODEL_ID = 'Xenova/Qwen2.5-0.5B-Instruct';
const MODEL_CACHE_KEY = 'vithal-offline-model-ready';

export const useOfflineChat = (): UseOfflineChatReturn => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [forceOffline, setForceOffline] = useState(false);
  const [modelStatus, setModelStatus] = useState<'not-downloaded' | 'downloading' | 'ready' | 'error'>('not-downloaded');
  const [downloadProgress, setDownloadProgress] = useState(0);
  const generatorRef = useRef<TextGenerationPipeline | null>(null);
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
      // Check WebGPU support
      const hasWebGPU = 'gpu' in navigator;
      const device = hasWebGPU ? 'webgpu' : 'wasm';
      
      console.log(`Loading offline model with ${device}...`);

      const generator = await pipeline('text-generation', MODEL_ID, {
        device: device as 'webgpu' | 'wasm',
        progress_callback: (progress: any) => {
          if (progress.progress !== undefined) {
            setDownloadProgress(Math.round(progress.progress));
          }
        },
      });

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
      const hasWebGPU = 'gpu' in navigator;
      const device = hasWebGPU ? 'webgpu' : 'wasm';

      const generator = await pipeline('text-generation', MODEL_ID, {
        device: device as 'webgpu' | 'wasm',
      });

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
      // Build conversation with system prompt
      const systemPrompt = `You are Vithal AI, a helpful assistant running in offline mode. Keep responses concise and helpful. You're a friendly AI tutor.`;
      
      let conversationText = `<|im_start|>system\n${systemPrompt}<|im_end|>\n`;
      
      // Add chat history (last 4 messages for context)
      if (chatHistory && chatHistory.length > 0) {
        const recentHistory = chatHistory.slice(-4);
        for (const msg of recentHistory) {
          const role = msg.role === 'user' ? 'user' : 'assistant';
          conversationText += `<|im_start|>${role}\n${msg.content}<|im_end|>\n`;
        }
      }
      
      conversationText += `<|im_start|>user\n${message}<|im_end|>\n<|im_start|>assistant\n`;

      const result = await generatorRef.current(conversationText, {
        max_new_tokens: 256,
        temperature: 0.7,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      });

      const generated = Array.isArray(result) ? result[0] : result;
      let response = (generated as any)?.generated_text || '';
      
      // Clean up the response
      response = response.split('<|im_end|>')[0].trim();
      response = response.split('<|im_start|>')[0].trim();

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
