import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
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
  HardDrive
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
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

    setIsGenerating(true);
    setGeneratedCode('');

    try {
      const code = await generateCodeWithGemini(prompt, selectedLanguage, selectedTask);
      
      if (code) {
        setGeneratedCode(code);
        toast({
          title: "Success",
          description: "Code generated successfully with Gemini AI!",
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
                    <span className="font-medium">Model size: 822.2 MB</span>
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
                  Offline Mode - Privacy-focused code generation
                </>
              )}
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setModelType(null)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
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

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Task</label>
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

                <div className="space-y-2">
                  <label className="text-sm font-medium">Prompt</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the code you want to generate..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button 
                  onClick={generateCode}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating with Gemini AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Code
                    </>
                  )}
                </Button>

                {isGenerating && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating code with Gemini AI...</span>
                  </div>
                )}

                {generatedCode && (
                  <div className="space-y-4">
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Generated Code</label>
                        <Badge variant="secondary">{selectedLanguage}</Badge>
                      </div>
                      <Textarea
                        value={generatedCode}
                        readOnly
                        className="min-h-[300px] font-mono text-sm"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button onClick={copyToClipboard} variant="outline" size="sm">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button onClick={downloadCode} variant="outline" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button onClick={saveCodeSnippet} variant="outline" size="sm">
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : savedSnippets.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No saved snippets yet</p>
                    <p className="text-sm mt-2">Generate and save code to see it here</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="space-y-4">
                      {savedSnippets.map((snippet) => (
                        <Card key={snippet.id} className="overflow-hidden">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-4">
                              <div className="space-y-1 flex-1">
                                <CardTitle className="text-base">{snippet.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">{snippet.description}</p>
                              </div>
                              <Badge variant="secondary">{snippet.language}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <Textarea
                              value={snippet.generated_code}
                              readOnly
                              className="min-h-[200px] font-mono text-sm"
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={() => copySnippetToClipboard(snippet.generated_code)}
                                variant="outline"
                                size="sm"
                              >
                                <Copy className="mr-2 h-3 w-3" />
                                Copy
                              </Button>
                              <Button
                                onClick={() => deleteSnippet(snippet.id)}
                                variant="outline"
                                size="sm"
                              >
                                <Trash2 className="mr-2 h-3 w-3" />
                                Delete
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
