import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import vithalLogo from '@/assets/vithal-ai-logo-new.png';
import { 
  Code, 
  Copy, 
  Download, 
  Save, 
  Sparkles, 
  Bug, 
  Zap, 
  Languages,
  BookOpen,
  Trash2,
  Loader2,
  Wifi,
  WifiOff,
  Lock,
  HardDrive,
  Terminal,
  Play
} from 'lucide-react';
import { pipeline, env } from '@huggingface/transformers';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CodeGeneratorResult } from './code-generator-result';

const PROGRAMMING_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'react', label: 'React' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'php', label: 'PHP' },
  { value: 'sql', label: 'SQL' }
];

const CODE_TASKS = [
  { value: 'generate', label: 'Generate Code', icon: Code },
  { value: 'explain', label: 'Explain Code', icon: BookOpen },
  { value: 'fix', label: 'Fix Bugs', icon: Bug },
  { value: 'optimize', label: 'Optimize Code', icon: Zap },
  { value: 'translate', label: 'Translate Language', icon: Languages }
];

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  generated_code: string;
  is_favorite: boolean;
  created_at: string;
}

export const CodeGenerator = () => {
  const [modelType, setModelType] = useState<'online' | 'offline' | null>(null);
  const [prompt, setPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedTask, setSelectedTask] = useState('generate');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState<CodeSnippet[]>([]);
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false);
  const [isDownloadingModel, setIsDownloadingModel] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [offlineModel, setOfflineModel] = useState<any>(null);
  const [modelStatus, setModelStatus] = useState<'not-downloaded' | 'downloading' | 'ready'>('not-downloaded');
  const [usingWebGPU, setUsingWebGPU] = useState(false);
  const [modelSize, setModelSize] = useState('125 MB'); // Combined size estimate
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Configure transformers.js to use cache
  useEffect(() => {
    env.allowLocalModels = false;
    env.useBrowserCache = true;
  }, []);

  // Load saved snippets
  const loadSnippets = async () => {
    try {
      setIsLoadingSnippets(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('code_snippets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSavedSnippets(data || []);
    } catch (error) {
      console.error('Error loading snippets:', error);
    } finally {
      setIsLoadingSnippets(false);
    }
  };

  React.useEffect(() => {
    loadSnippets();
  }, []);

  // Check WebGPU availability
  const checkWebGPUSupport = async (): Promise<boolean> => {
    try {
      // @ts-ignore - WebGPU is not yet in TypeScript Navigator type
      if (!navigator.gpu) {
        console.log('WebGPU not available');
        return false;
      }
      // @ts-ignore - WebGPU is not yet in TypeScript Navigator type
      const adapter = await navigator.gpu.requestAdapter();
      if (!adapter) {
        console.log('WebGPU adapter not available');
        return false;
      }
      console.log('WebGPU is available');
      return true;
    } catch (error) {
      console.error('Error checking WebGPU:', error);
      return false;
    }
  };

  // Download and initialize offline model
  const downloadOfflineModel = async () => {
    try {
      setIsDownloadingModel(true);
      setDownloadProgress(0);
      setModelStatus('downloading');

      toast({
        title: "Downloading Model",
        description: "Downloading AI model to your device...",
      });

      // Check for WebGPU support
      const hasWebGPU = await checkWebGPUSupport();
      setUsingWebGPU(hasWebGPU);

      let model;
      let modelName;
      let deviceConfig: any = {};

      if (hasWebGPU) {
        // Try WebGPU optimized model
        modelName = 'onnx-community/Qwen2.5-Coder-0.5B-Instruct';
        deviceConfig = { 
          device: 'webgpu',
          dtype: {
            embed_tokens: 'fp16',
            vision_encoder: 'fp16',
            decoder_model_merged: 'q4',
          }
        };
        setModelSize('45 MB');
        console.log('Attempting to load Qwen2.5-Coder with WebGPU');
      } else {
        // CPU fallback
        modelName = 'Xenova/distilgpt2';
        deviceConfig = { device: 'wasm' };
        setModelSize('80 MB');
        console.log('Loading distilgpt2 for CPU');
      }

      model = await pipeline(
        'text-generation',
        modelName,
        {
          ...deviceConfig,
          progress_callback: (progress: any) => {
            console.log('Download progress:', progress);
            if (progress.status === 'progress' && progress.file) {
              const percent = Math.round((progress.loaded / progress.total) * 100);
              setDownloadProgress(Math.min(percent, 100));
              console.log(`${progress.file}: ${percent}%`);
            } else if (progress.status === 'done') {
              console.log('File download complete:', progress.file);
            } else if (progress.status === 'ready') {
              setDownloadProgress(100);
            }
          }
        }
      );

      console.log('Model loaded successfully');
      setOfflineModel(model);
      setModelStatus('ready');
      setIsDownloadingModel(false);

      toast({
        title: "Model Ready",
        description: `AI model ready with ${hasWebGPU ? 'GPU acceleration' : 'CPU'}!`,
      });
    } catch (error) {
      console.error('Error downloading model:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // If WebGPU fails, try CPU fallback
      if (usingWebGPU) {
        console.log('WebGPU failed, trying CPU fallback...');
        setUsingWebGPU(false);
        
        try {
          setDownloadProgress(0);
          const fallbackModel = await pipeline(
            'text-generation',
            'Xenova/distilgpt2',
            {
              device: 'wasm',
              progress_callback: (progress: any) => {
                if (progress.status === 'progress' && progress.file) {
                  const percent = Math.round((progress.loaded / progress.total) * 100);
                  setDownloadProgress(Math.min(percent, 100));
                }
              }
            }
          );
          
          setOfflineModel(fallbackModel);
          setModelStatus('ready');
          setIsDownloadingModel(false);
          setModelSize('80 MB');
          
          toast({
            title: "Model Ready",
            description: "AI model ready with CPU (WebGPU unavailable)!",
          });
          return;
        } catch (fallbackError) {
          console.error('Fallback also failed:', fallbackError);
        }
      }
      
      setIsDownloadingModel(false);
      setModelStatus('not-downloaded');
      
      toast({
        title: "Download Failed",
        description: `Failed: ${errorMessage}. Please use the online model instead.`,
        variant: "destructive",
      });
    }
  };

  // Generate code using offline model
  const generateCodeWithOfflineModel = async (prompt: string, lang: string, task: string): Promise<string> => {
    if (!offlineModel) {
      throw new Error('Offline model not loaded');
    }

    try {
      // Build a clear instruction
      let instruction = '';
      if (task === 'generate') {
        instruction = `Write a ${lang} function that ${prompt}`;
      } else if (task === 'explain') {
        instruction = `Explain the following ${lang} code:\n${prompt}`;
      } else if (task === 'fix') {
        instruction = `Fix the bugs in this ${lang} code:\n${prompt}`;
      } else if (task === 'optimize') {
        instruction = `Optimize the following ${lang} code:\n${prompt}`;
      } else if (task === 'translate') {
        instruction = `Translate this code to ${lang}:\n${prompt}`;
      }

      console.log('Generating code with instruction:', instruction);
      
      // Generate with the model
      const result = await offlineModel(instruction, {
        max_new_tokens: 300,
        temperature: 0.7,
        do_sample: true,
        top_p: 0.9,
        repetition_penalty: 1.2,
      });

      console.log('Generation result:', result);
      
      // Extract the generated text
      let generatedText = '';
      if (Array.isArray(result) && result.length > 0) {
        generatedText = result[0].generated_text || '';
      } else if (typeof result === 'object' && result !== null) {
        generatedText = (result as any).generated_text || '';
      }
      
      if (!generatedText) {
        throw new Error('No text generated from model');
      }
      
      // Clean up: remove the prompt if it's included in the output
      if (generatedText.includes(instruction)) {
        generatedText = generatedText.replace(instruction, '').trim();
      }
      
      // If output is still empty or too short, return the original
      if (generatedText.length < 10) {
        return '// Code generation produced minimal output. Please try with a more specific prompt.';
      }
      
      return generatedText;
    } catch (error) {
      console.error('Offline generation error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Generation failed: ${errorMsg}`);
    }
  };

  // Generate code using Gemini API
  const generateCodeWithGemini = async (prompt: string, lang: string, task: string): Promise<string> => {
    try {
      console.log('Calling Gemini API for code generation...');
      
      const { data, error } = await supabase.functions.invoke('code-generator-gemini', {
        body: { 
          prompt, 
          language: lang,
          task 
        }
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate code');
      }

      if (!data || !data.code) {
        throw new Error('No code returned from API');
      }

      console.log('Code generated successfully, length:', data.code.length);
      return data.code;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  };

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a code generation prompt",
        variant: "destructive",
      });
      return;
    }

    // Check if offline model is selected but not ready
    if (modelType === 'offline' && modelStatus !== 'ready') {
      toast({
        title: "Error",
        description: "Please download the offline model first",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedCode('');

    try {
      let code: string;
      
      if (modelType === 'offline') {
        code = await generateCodeWithOfflineModel(prompt, selectedLanguage, selectedTask);
      } else {
        code = await generateCodeWithGemini(prompt, selectedLanguage, selectedTask);
      }
      
      if (code) {
        setGeneratedCode(code);
        toast({
          title: "Success",
          description: `Code generated successfully with ${modelType === 'offline' ? 'Offline AI' : 'Gemini AI'}!`,
        });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate code",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode);
      toast({
        title: "Copied!",
        description: "Code copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code.",
        variant: "destructive",
      });
    }
  };

  const downloadCode = () => {
    const extension = selectedLanguage === 'javascript' ? 'js' : 
                     selectedLanguage === 'python' ? 'py' :
                     selectedLanguage === 'java' ? 'java' :
                     selectedLanguage === 'cpp' ? 'cpp' :
                     selectedLanguage === 'typescript' ? 'ts' : 'txt';
    
    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-code.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const saveCodeSnippet = async () => {
    if (!generatedCode.trim()) {
      toast({
        title: "Error",
        description: "No code to save.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "Please log in to save code snippets.",
          variant: "destructive",
        });
        return;
      }

      const title = prompt.slice(0, 50) + (prompt.length > 50 ? '...' : '');
      
      const { error } = await supabase
        .from('code_snippets')
        .insert({
          user_id: user.id,
          title,
          description: prompt,
          language: selectedLanguage,
          prompt,
          generated_code: generatedCode
        });

      if (error) throw error;

      toast({
        title: "Saved!",
        description: "Code snippet saved successfully.",
      });

      loadSnippets();
    } catch (error) {
      console.error('Error saving snippet:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save code snippet.",
        variant: "destructive",
      });
    }
  };

  const copySnippetToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "Copied!",
        description: "Code snippet copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code.",
        variant: "destructive",
      });
    }
  };

  const deleteSnippet = async (id: string) => {
    try {
      const { error } = await supabase
        .from('code_snippets')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Code snippet deleted successfully.",
      });

      loadSnippets();
    } catch (error) {
      console.error('Error deleting snippet:', error);
      toast({
        title: "Error",
        description: "Failed to delete code snippet.",
        variant: "destructive",
      });
    }
  };

  // Model selection screen
  if (!modelType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto p-4 md:p-6 max-w-4xl">
          <div className="mb-8 text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src={vithalLogo} 
                alt="Vithal.AI Logo" 
                className="h-20 w-20 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Vithal.AI Code Generator
            </h1>
            <p className="text-muted-foreground">
              Choose your preferred AI model
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Online Model Card */}
            <Card 
              className="relative overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
              onClick={() => setModelType('online')}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Wifi className="h-8 w-8 text-primary" />
                  <Badge variant="default">Recommended</Badge>
                </div>
                <CardTitle className="text-xl">
                  Vithal AI Code Generator
                </CardTitle>
                <p className="text-sm text-muted-foreground">Powered By Gemini AI</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">Fully Online</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Latest Gemini AI model</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Always up-to-date</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Works on all devices</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Requires internet connection</span>
                  </li>
                </ul>
                <Button className="w-full" size="lg">
                  <Wifi className="mr-2 h-4 w-4" />
                  Use Online Model
                </Button>
              </CardContent>
            </Card>

            {/* Offline Model Card */}
            <Card 
              className={`relative overflow-hidden transition-all duration-300 ${
                isMobile ? 'opacity-60' : 'cursor-pointer hover:shadow-lg hover:scale-105'
              }`}
              onClick={() => !isMobile && setModelType('offline')}
            >
              {isMobile && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center p-6">
                  <div className="text-center space-y-3">
                    <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="font-semibold text-sm">Device Not Compatible</p>
                    <p className="text-xs text-muted-foreground">
                      This device is not capable to use this AI Model. Please use Online Model.
                    </p>
                  </div>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <WifiOff className="h-8 w-8 text-primary" />
                  {!isMobile && <Badge variant="secondary">Desktop Only</Badge>}
                </div>
                <CardTitle className="text-xl">
                  Vithal AI Code Generator
                </CardTitle>
                <p className="text-sm text-muted-foreground">Offline</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <HardDrive className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-primary">Offline</span>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Works without internet</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Privacy-focused</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>Desktop/Laptop only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span className="font-medium">Model size: {modelSize}</span>
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={isMobile}
                  variant={isMobile ? "outline" : "default"}
                >
                  {isMobile ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Not Available
                    </>
                  ) : (
                    <>
                      <WifiOff className="mr-2 h-4 w-4" />
                      Use Offline Model
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show model download screen for offline mode
  if (modelType === 'offline' && modelStatus !== 'ready') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <div className="container mx-auto p-4 md:p-6 max-w-2xl">
          <div className="mb-8 text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src={vithalLogo} 
                alt="Vithal.AI Logo" 
                className="h-20 w-20 object-contain"
              />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Vithal.AI Code Generator
            </h1>
            <p className="text-muted-foreground flex items-center justify-center gap-2">
              <WifiOff className="h-4 w-4 text-primary" />
              Offline Mode
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                Download Offline AI Model
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <HardDrive className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium mb-1">Local AI Model</p>
                    <p className="text-sm text-muted-foreground">
                      Download and install the AI model on your device for offline code generation
                    </p>
                  </div>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model:</span>
                    <span className="font-semibold">
                      {usingWebGPU ? 'Qwen2.5-Coder (WebGPU)' : 'distilgpt2 (CPU)'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Model Size:</span>
                    <span className="font-semibold">{modelSize}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Storage:</span>
                    <span className="font-medium">Browser Cache</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <Badge variant={modelStatus === 'downloading' ? 'default' : 'secondary'}>
                      {modelStatus === 'downloading' ? 'Downloading...' : 'Not Downloaded'}
                    </Badge>
                  </div>
                </div>

                {isDownloadingModel && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Download Progress</span>
                      <span className="font-medium">{downloadProgress}%</span>
                    </div>
                    <Progress value={downloadProgress} className="h-2" />
                    <p className="text-xs text-muted-foreground text-center">
                      Please wait... This may take a few minutes depending on your connection
                    </p>
                  </div>
                )}

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 space-y-2">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    ℹ️ Important Information
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                    <li>• The model will be saved in your browser cache</li>
                    <li>• Works completely offline after download</li>
                    <li>• No data is sent to external servers</li>
                    <li>• Download is required only once</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={downloadOfflineModel}
                  disabled={isDownloadingModel}
                  className="flex-1"
                  size="lg"
                >
                  {isDownloadingModel ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Downloading... {downloadProgress}%
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Download Model ({modelSize})
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setModelType(null)}
                  disabled={isDownloadingModel}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto p-4 md:p-6 max-w-7xl">
        <div className="mb-8 text-center space-y-4">
          <div className="flex justify-center">
            <img 
              src={vithalLogo} 
              alt="Vithal.AI Logo" 
              className="h-20 w-20 object-contain"
            />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Vithal.AI Code Generator
          </h1>
          <div className="flex items-center justify-center gap-3">
            <p className="text-muted-foreground flex items-center gap-2">
              {modelType === 'online' ? (
                <>
                  <Wifi className="h-4 w-4 text-primary" />
                  Powered by Gemini AI - Generate complete, production-ready code instantly
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-primary" />
                  <Badge variant="default" className="mr-2">Model Ready</Badge>
                  Offline Mode - Privacy-focused code generation
                </>
              )}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setModelType(null);
                setModelStatus('not-downloaded');
              }}
            >
              Change Model
            </Button>
          </div>
        </div>

        <Tabs defaultValue="generator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="generator" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Code Generator
            </TabsTrigger>
            <TabsTrigger value="snippets" className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Saved Snippets
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Generate Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Code className="h-4 w-4 text-primary" />
                      Programming Language
                    </label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PROGRAMMING_LANGUAGES.map((lang) => (
                          <SelectItem key={lang.value} value={lang.value}>
                            {lang.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Task Type
                    </label>
                    <Select value={selectedTask} onValueChange={setSelectedTask}>
                      <SelectTrigger className="h-11 border-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CODE_TASKS.map((task) => (
                          <SelectItem key={task.value} value={task.value}>
                            <div className="flex items-center gap-2">
                              <task.icon className="h-4 w-4" />
                              {task.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-primary" />
                    Describe Your Code
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Example: Create a function that sorts an array using quicksort algorithm..."
                    className="min-h-[140px] border-2 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Be specific about functionality, edge cases, and any special requirements
                  </p>
                </div>

                <Button 
                  onClick={generateCode}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Code with AI...
                    </>
                  ) : (
                    <>
                      <Play className="mr-2 h-5 w-5" />
                      Generate Code
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="flex items-center justify-center gap-3 py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">Generating Your Code...</p>
                        <p className="text-xs text-muted-foreground">AI is crafting the perfect solution</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {generatedCode && (
              <CodeGeneratorResult
                generatedCode={generatedCode}
                selectedLanguage={selectedLanguage}
                onCopy={copyToClipboard}
                onDownload={downloadCode}
                onSave={saveCodeSnippet}
              />
            )}
          </TabsContent>

          <TabsContent value="snippets" className="space-y-6">
            {isLoadingSnippets ? (
              <div className="text-center py-12">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="text-muted-foreground mt-4">Loading snippets...</p>
              </div>
            ) : savedSnippets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Save className="h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-lg font-medium text-muted-foreground">No saved snippets yet</p>
                  <p className="text-sm text-muted-foreground mt-2">Generate code and save it to see it here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {savedSnippets.map((snippet) => (
                  <Card key={snippet.id} className="overflow-hidden border-2 hover:border-primary/30 transition-colors">
                    <CardHeader className="bg-gradient-to-r from-card to-card/50 border-b">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Code className="h-5 w-5 text-primary" />
                            {snippet.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-2">{snippet.description}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge variant="secondary" className="border-primary/30">
                              {PROGRAMMING_LANGUAGES.find(l => l.value === snippet.language)?.label}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <span>•</span>
                              {new Date(snippet.created_at).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => copySnippetToClipboard(snippet.generated_code)}
                            variant="outline"
                            size="sm"
                            className="gap-2 hover:border-primary"
                          >
                            <Copy className="h-4 w-4" />
                            Copy
                          </Button>
                          <Button
                            onClick={() => deleteSnippet(snippet.id)}
                            variant="outline"
                            size="sm"
                            className="gap-2 text-destructive hover:text-destructive hover:border-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[350px] w-full">
                        <SyntaxHighlighter
                          language={snippet.language === 'cpp' ? 'cpp' : snippet.language}
                          style={vscDarkPlus}
                          showLineNumbers={true}
                          wrapLines={true}
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            fontSize: '0.875rem',
                            padding: '1.5rem',
                            background: 'hsl(var(--card))',
                          }}
                          codeTagProps={{
                            style: {
                              fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', 'Monaco', monospace",
                            }
                          }}
                        >
                          {snippet.generated_code}
                        </SyntaxHighlighter>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
