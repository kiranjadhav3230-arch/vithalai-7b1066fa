import React, { useState, useRef } from 'react';
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
  Trash2
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
  const [prompt, setPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedTask, setSelectedTask] = useState('generate');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedSnippets, setSavedSnippets] = useState<CodeSnippet[]>([]);
  const [isLoadingSnippets, setIsLoadingSnippets] = useState(false);
  const codeRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

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

      const { data, error } = await supabase.functions.invoke('code-generator', {
        body: {
          prompt: prompt.trim(),
          language: selectedLanguage,
          task: selectedTask
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      setGeneratedCode(data.code || '');
      toast({
        title: "Code Generated!",
        description: `Successfully generated ${selectedLanguage} code.`,
      });

    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Code Generator</h1>
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>
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
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteSnippet(snippet.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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