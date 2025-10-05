import React, { useState, useRef } from 'react';
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
import { pipeline } from '@huggingface/transformers';
import { 
  Code, 
  Play, 
  Copy, 
  Download, 
  Save, 
  Sparkles, 
  Bug, 
  Zap, 
  Languages,
  BookOpen,
  Heart,
  Trash2,
  Brain,
  FileCode,
  Clock,
  Loader2
} from 'lucide-react';

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

// Removed: Generator modes - now only using Local AI

// Rule-based code templates
const codeTemplates: Record<string, Record<string, (name: string) => string>> = {
  javascript: {
    function: (name: string) => `function ${name}() {\n  // TODO: Implement function logic\n  return result;\n}`,
    class: (name: string) => `class ${name} {\n  constructor() {\n    // Initialize properties\n  }\n\n  method() {\n    // Method implementation\n  }\n}`,
    api: (name: string) => `async function fetch${name}() {\n  try {\n    const response = await fetch('/api/${name.toLowerCase()}');\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n    throw error;\n  }\n}`,
    sort: () => `function sortArray(arr) {\n  return arr.sort((a, b) => a - b);\n}`,
    filter: () => `function filterArray(arr, condition) {\n  return arr.filter(item => condition(item));\n}`,
  },
  python: {
    function: (name: string) => `def ${name}():\n    """Function description"""\n    # TODO: Implement function logic\n    return result`,
    class: (name: string) => `class ${name}:\n    def __init__(self):\n        # Initialize attributes\n        pass\n\n    def method(self):\n        # Method implementation\n        pass`,
    api: (name: string) => `import requests\n\ndef fetch_${name.toLowerCase()}():\n    try:\n        response = requests.get(f'/api/${name.toLowerCase()}')\n        response.raise_for_status()\n        return response.json()\n    except requests.exceptions.RequestException as e:\n        print(f'Error: {e}')\n        raise`,
    sort: () => `def sort_array(arr):\n    return sorted(arr)`,
    filter: () => `def filter_array(arr, condition):\n    return [item for item in arr if condition(item)]`,
  },
  typescript: {
    function: (name: string) => `function ${name}(): ReturnType {\n  // TODO: Implement function logic\n  return result;\n}`,
    class: (name: string) => `class ${name} {\n  constructor() {\n    // Initialize properties\n  }\n\n  method(): void {\n    // Method implementation\n  }\n}`,
    api: (name: string) => `async function fetch${name}(): Promise<DataType> {\n  try {\n    const response = await fetch('/api/${name.toLowerCase()}');\n    const data: DataType = await response.json();\n    return data;\n  } catch (error) {\n    console.error('Error:', error);\n    throw error;\n  }\n}`,
    sort: () => `function sortArray<T>(arr: T[]): T[] {\n  return arr.sort();\n}`,
    filter: () => `function filterArray<T>(arr: T[], condition: (item: T) => boolean): T[] {\n  return arr.filter(condition);\n}`,
  },
};

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: string;
  generated_code: string;
  is_favorite: boolean;
  created_at: string;
}

// Cache for the AI model
let cachedPipeline: any = null;

export const CodeGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedTask, setSelectedTask] = useState('generate');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState<CodeSnippet[]>([]);
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState(0);
  const [modelSize, setModelSize] = useState<string>('');
  const [downloadedSize, setDownloadedSize] = useState<string>('');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isModelDownloaded, setIsModelDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const codeRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Check if model is already in cache on component mount
  React.useEffect(() => {
    const checkModelCache = async () => {
      try {
        // Check localStorage first
        const cached = localStorage.getItem('vithal_ai_model_cached');
        
        if (cached === 'true') {
          // Try to load the cached model from browser cache
          setIsDownloading(true);
          setProgressStatus('Loading cached model...');
          setProgressPercent(50);
          
          try {
            // Attempt to load cached model
            cachedPipeline = await pipeline(
              'text-generation', 
              'onnx-community/Qwen2.5-Coder-0.5B-Instruct',
              {
                device: 'webgpu',
                dtype: 'q4',
              }
            );
            setIsModelDownloaded(true);
            setProgressStatus('Model ready!');
            setProgressPercent(100);
          } catch (gpuError) {
            // Fallback to WASM
            try {
              cachedPipeline = await pipeline(
                'text-generation',
                'Xenova/distilgpt2'
              );
              setIsModelDownloaded(true);
              setProgressStatus('Model ready!');
              setProgressPercent(100);
            } catch (error) {
              console.error('Failed to load cached model:', error);
              localStorage.removeItem('vithal_ai_model_cached');
              setIsModelDownloaded(false);
            }
          } finally {
            setIsDownloading(false);
            setProgressStatus('');
            setProgressPercent(0);
          }
        }
      } catch (error) {
        console.error('Error checking model cache:', error);
        localStorage.removeItem('vithal_ai_model_cached');
        setIsModelDownloaded(false);
      }
    };
    checkModelCache();
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

  // Rule-based code generation
  const generateRuleBasedCode = (prompt: string, lang: string): string => {
    const lowerPrompt = prompt.toLowerCase();
    const templates = codeTemplates[lang] || codeTemplates.javascript;
    
    // Extract potential function/class name
    const nameMatch = prompt.match(/(?:function|class|component|api|fetch)\s+(?:called\s+)?(\w+)/i);
    const name = nameMatch ? nameMatch[1] : 'myFunction';
    
    // Pattern matching for different code types
    if (lowerPrompt.includes('class') || lowerPrompt.includes('object')) {
      return templates.class(name);
    } else if (lowerPrompt.includes('api') || lowerPrompt.includes('fetch') || lowerPrompt.includes('request')) {
      return templates.api(name);
    } else if (lowerPrompt.includes('sort')) {
      return templates.sort ? templates.sort('') : templates.function(name);
    } else if (lowerPrompt.includes('filter')) {
      return templates.filter ? templates.filter('') : templates.function(name);
    } else {
      return templates.function(name);
    }
  };

  // Download Vithal.AI model
  const downloadModel = async () => {
    try {
      setIsDownloading(true);
      setProgressStatus('Initializing Vithal.AI Code Generator Model...');
      setProgressPercent(5);
      setEstimatedTime(20);
      setRemainingTime(20);
      setModelSize('~45 MB');

      let lastProgress = 0;
      
      // Progress callback for download
      const progressCallback = (progress: any) => {
        console.log('Download progress:', progress);
        
        if (progress.status === 'progress' && progress.total) {
          const percent = Math.round((progress.loaded / progress.total) * 100);
          const loadedMB = (progress.loaded / (1024 * 1024)).toFixed(1);
          const totalMB = (progress.total / (1024 * 1024)).toFixed(1);
          
          setDownloadedSize(`${loadedMB} / ${totalMB} MB`);
          setProgressPercent(10 + (percent * 0.5)); // 10-60% for download
          setRemainingTime(Math.max(1, Math.round(18 - (percent / 100) * 12)));
          lastProgress = percent;
        } else if (progress.status === 'initiate') {
          setProgressStatus(`Downloading ${progress.file}...`);
        } else if (progress.status === 'done') {
          setProgressStatus('Files downloaded!');
        }
      };
      
      try {
        // Try WebGPU first
        setProgressStatus('Loading Vithal.AI with WebGPU acceleration...');
        cachedPipeline = await pipeline(
          'text-generation', 
          'onnx-community/Qwen2.5-Coder-0.5B-Instruct',
          {
            device: 'webgpu',
            dtype: 'q4',
            progress_callback: progressCallback,
          }
        );
        setProgressStatus('WebGPU enabled!');
      } catch (gpuError) {
        console.warn('WebGPU failed, falling back to WASM:', gpuError);
        setProgressStatus('Loading Vithal.AI in CPU mode...');
        setProgressPercent(10);
        
        // Fallback to WASM (CPU)
        cachedPipeline = await pipeline(
          'text-generation',
          'Xenova/distilgpt2',
          {
            progress_callback: progressCallback,
          }
        );
        setProgressStatus('CPU mode loaded!');
      }
      
      setProgressStatus('Vithal.AI Model Ready!');
      setProgressPercent(100);
      setRemainingTime(0);
      
      // Save to localStorage
      localStorage.setItem('vithal_ai_model_cached', 'true');
      setIsModelDownloaded(true);
      
      toast({
        title: "Model Downloaded!",
        description: "Vithal.AI Code Generator is ready to use.",
      });
    } catch (error) {
      console.error('Model download error:', error);
      setProgressStatus('Download Failed');
      toast({
        title: "Download Failed",
        description: "Failed to download Vithal.AI model. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      setProgressPercent(0);
      setProgressStatus('');
    }
  };

  // Local AI code generation
  const generateLocalAICode = async (prompt: string, lang: string): Promise<string> => {
    try {
      if (!cachedPipeline) {
        throw new Error('Model not loaded. Please download the model first.');
      }

      setProgressStatus('Generating code...');
      setProgressPercent(50);
      
      const systemPrompt = `Generate ${lang} code:\n${prompt}\n\nCode:\n`;
      const result: any = await cachedPipeline(systemPrompt, {
        max_new_tokens: 150,
        temperature: 0.3,
        do_sample: true,
        top_k: 50,
      });
      
      setProgressStatus('Processing...');
      setProgressPercent(95);
      
      const generatedText = Array.isArray(result) ? result[0]?.generated_text : result?.generated_text;
      if (!generatedText) {
        throw new Error('No code generated');
      }
      
      setProgressStatus('Complete!');
      setProgressPercent(100);
      
      return generatedText.replace(systemPrompt, '').trim();
    } catch (error) {
      console.error('Local AI error:', error);
      setProgressStatus('Failed');
      throw new Error(`Code generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const generateCode = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a description for the code you want to generate.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setGeneratedCode('');
      setProgressStatus('Starting...');
      setProgressPercent(0);

      const code = await generateLocalAICode(prompt, selectedLanguage);
      setGeneratedCode(code);
      
      toast({
        title: "Code Generated!",
        description: "Code generated successfully using Vithal.AI.",
      });

    } catch (error: any) {
      console.error('Error generating code:', error);
      
      setProgressStatus('Failed');
      setProgressPercent(0);
      
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  // Show download screen if model not downloaded
  if (!isModelDownloaded) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src="/src/assets/vithal-ai-logo.png" 
                alt="Vithal.AI Logo" 
                className="h-20 w-20 object-contain"
              />
            </div>
            <CardTitle className="text-3xl">Vithal.AI Code Generator Model</CardTitle>
            <p className="text-muted-foreground">
              Download the AI model to start generating code locally in your browser
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Model Size</p>
                <p className="text-2xl font-bold">45 MB</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">Local</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <h3 className="font-semibold">Features:</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  Fast code generation in multiple languages
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  AI-powered intelligent suggestions
                </li>
                <li className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  Supports JavaScript, Python, Java, C++, and more
                </li>
                <li className="flex items-center gap-2">
                  <Save className="h-4 w-4 text-primary" />
                  Works offline after initial download
                </li>
              </ul>
            </div>

            {isDownloading && (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="font-medium">{progressStatus}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {modelSize && (
                        <Badge variant="outline" className="text-xs">
                          {modelSize}
                        </Badge>
                      )}
                      {downloadedSize && (
                        <span className="text-xs text-muted-foreground">{downloadedSize}</span>
                      )}
                    </div>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Please wait while the model is being downloaded...
                    </span>
                    {remainingTime > 0 && (
                      <div className="flex items-center gap-1 font-medium">
                        <Clock className="h-3 w-3" />
                        <span>~{remainingTime}s remaining</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <Button 
              onClick={downloadModel} 
              disabled={isDownloading}
              className="w-full"
              size="lg"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Downloading Model...
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 mr-2" />
                  Download Vithal.AI Model
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Vithal.AI Code Generator</h1>
        <p className="text-muted-foreground">Generate, explain, fix, and optimize code with AI assistance</p>
      </div>

      <Tabs defaultValue="generate" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Code Generator</TabsTrigger>
          <TabsTrigger value="snippets">Saved Snippets</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Code Generation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Programming Language</label>
                    <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                      <SelectTrigger>
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
                  <div>
                    <label className="text-sm font-medium mb-2 block">Task Type</label>
                    <Select value={selectedTask} onValueChange={setSelectedTask}>
                      <SelectTrigger>
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

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Describe what you want to {selectedTask === 'generate' ? 'create' : selectedTask}
                  </label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={`Example: Create a function that sorts an array of numbers...`}
                    className="min-h-32"
                  />
                </div>

                <Button 
                  onClick={generateCode} 
                  disabled={isLoading || !prompt.trim()}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>

                {/* Progress Dashboard */}
                {isLoading && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6 space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="font-medium">{progressStatus}</span>
                        </div>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          ⚡ Generating code with Vithal.AI...
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Generated Code
                  </div>
                  {generatedCode && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedLanguage}</Badge>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedCode ? (
                  <div className="space-y-4">
                    <Textarea
                      ref={codeRef}
                      value={generatedCode}
                      onChange={(e) => setGeneratedCode(e.target.value)}
                      className="min-h-64 font-mono text-sm"
                      placeholder="Generated code will appear here..."
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline" onClick={downloadCode}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline" onClick={saveCodeSnippet}>
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="min-h-64 flex items-center justify-center text-muted-foreground">
                    Generated code will appear here...
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="snippets">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Saved Code Snippets
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingSnippets ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : savedSnippets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No saved snippets yet. Generate and save some code to see them here!
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                     {savedSnippets.map((snippet) => (
                      <div key={snippet.id} className="border rounded-lg p-4 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="font-semibold">{snippet.title}</h3>
                            <p className="text-sm text-muted-foreground">{snippet.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">{snippet.language}</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(snippet.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copySnippetToClipboard(snippet.generated_code)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteSnippet(snippet.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Separator />
                        <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                          <code>{snippet.generated_code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};