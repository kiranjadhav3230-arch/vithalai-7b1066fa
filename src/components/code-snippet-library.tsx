import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import Editor from '@monaco-editor/react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, X, Copy, Trash2, Star, StarOff, Code2, Calendar, Tag, Edit, Save, Download, Undo, ExternalLink, Play, Loader2, Terminal, CheckCircle, XCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { User } from '@supabase/supabase-js';
import { toast as sonnerToast } from 'sonner';

interface CodeSnippet {
  id: string;
  title: string;
  description: string | null;
  generated_code: string;
  language: string;
  tags: string[] | null;
  is_favorite: boolean | null;
  created_at: string;
}

interface CodeSnippetLibraryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

interface RunOutput {
  language: string;
  version: string;
  compile?: {
    stdout: string;
    stderr: string;
    exitCode: number;
  };
  run: {
    stdout: string;
    stderr: string;
    exitCode: number;
  };
  success: boolean;
}

// Language detection helpers
const isBrowserExecutable = (lang: string): boolean => {
  return ['html', 'css', 'javascript', 'js'].includes(lang.toLowerCase());
};

const isPistonExecutable = (lang: string): boolean => {
  return ['python', 'java', 'cpp', 'c', 'go', 'rust', 'ruby', 'php', 'kotlin', 'swift', 'csharp', 'typescript', 'bash'].includes(lang.toLowerCase());
};

const isExecutable = (lang: string): boolean => {
  return isBrowserExecutable(lang) || isPistonExecutable(lang);
};

export const CodeSnippetLibrary: React.FC<CodeSnippetLibraryProps> = ({ open, onOpenChange, user }) => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<CodeSnippet | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCode, setEditedCode] = useState('');
  const [originalCode, setOriginalCode] = useState('');
  const [showWelcomeAnimation, setShowWelcomeAnimation] = useState(false);
  
  // Run code states
  const [showRunPanel, setShowRunPanel] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [runOutput, setRunOutput] = useState<RunOutput | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadSnippets();
    }
  }, [open]);

  useEffect(() => {
    if (snippets.length > 0 && !selectedSnippet) {
      setSelectedSnippet(snippets[0]);
    }
  }, [snippets]);

  useEffect(() => {
    filterSnippets();
  }, [searchQuery, selectedTags, snippets]);

  // Close run panel when snippet changes
  useEffect(() => {
    setShowRunPanel(false);
    setRunOutput(null);
    setPreviewHtml('');
  }, [selectedSnippet?.id]);

  const loadSnippets = async () => {
    const { data, error } = await supabase
      .from('code_snippets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error", description: "Failed to load snippets", variant: "destructive" });
      return;
    }

    setSnippets(data || []);
    
    const tags = new Set<string>();
    data?.forEach(snippet => {
      snippet.tags?.forEach(tag => tags.add(tag));
    });
    setAllTags(Array.from(tags));
  };

  const filterSnippets = () => {
    let filtered = snippets;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(snippet =>
        snippet.title.toLowerCase().includes(query) ||
        snippet.description?.toLowerCase().includes(query) ||
        snippet.language.toLowerCase().includes(query) ||
        snippet.generated_code.toLowerCase().includes(query)
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(snippet =>
        selectedTags.every(tag => snippet.tags?.includes(tag))
      );
    }

    setFilteredSnippets(filtered);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const toggleFavorite = async (snippet: CodeSnippet) => {
    const { error } = await supabase
      .from('code_snippets')
      .update({ is_favorite: !snippet.is_favorite })
      .eq('id', snippet.id);

    if (error) {
      toast({ title: "Error", description: "Failed to update favorite", variant: "destructive" });
      return;
    }

    setSnippets(prev =>
      prev.map(s => s.id === snippet.id ? { ...s, is_favorite: !s.is_favorite } : s)
    );
    toast({ title: "Success", description: snippet.is_favorite ? "Removed from favorites" : "Added to favorites" });
  };

  const deleteSnippet = async (id: string) => {
    const { error } = await supabase
      .from('code_snippets')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete snippet", variant: "destructive" });
      return;
    }

    setSnippets(prev => prev.filter(s => s.id !== id));
    setSelectedSnippet(null);
    toast({ title: "Success", description: "Snippet deleted" });
  };

  const copyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Code copied to clipboard" });
  };

  const startEditing = (snippet: CodeSnippet) => {
    setShowWelcomeAnimation(true);
    setEditedCode(snippet.generated_code);
    setOriginalCode(snippet.generated_code);
    
    setTimeout(() => {
      setShowWelcomeAnimation(false);
      setIsEditing(true);
    }, 5000);
  };

  const saveEdit = async () => {
    if (!selectedSnippet) return;

    const { error } = await supabase
      .from('code_snippets')
      .update({ generated_code: editedCode })
      .eq('id', selectedSnippet.id);

    if (error) {
      toast({ title: "Error", description: "Failed to save changes", variant: "destructive" });
      return;
    }

    setSnippets(prev =>
      prev.map(s => s.id === selectedSnippet.id ? { ...s, generated_code: editedCode } : s)
    );
    setSelectedSnippet({ ...selectedSnippet, generated_code: editedCode });
    setIsEditing(false);
    toast({ title: "Success", description: "Code updated successfully" });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setShowWelcomeAnimation(false);
    setEditedCode(originalCode);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'z' && isEditing) {
      e.preventDefault();
      setEditedCode(originalCode);
      toast({ title: "Reverted", description: "Code reverted to original" });
    }
    if (e.ctrlKey && e.key === 's' && isEditing) {
      e.preventDefault();
      saveEdit();
    }
  };

  // Generate preview HTML for browser-executable languages
  const generatePreviewHtml = (code: string, language: string): string => {
    const lang = language.toLowerCase();
    
    if (lang === 'html') {
      return code;
    }
    
    if (lang === 'css') {
      return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #f5f5f5; }
    .demo-container { max-width: 600px; margin: 0 auto; }
    ${code}
  </style>
</head>
<body>
  <div class="demo-container">
    <h1>CSS Preview</h1>
    <p>Your CSS styles are applied to this preview page.</p>
    <button>Sample Button</button>
    <input type="text" placeholder="Sample Input" />
    <div class="card" style="padding: 16px; margin: 16px 0; border: 1px solid #ddd; border-radius: 8px;">
      <h3>Sample Card</h3>
      <p>This is sample content to preview your styles.</p>
    </div>
    <a href="#">Sample Link</a>
  </div>
</body>
</html>`;
    }
    
    if (lang === 'javascript' || lang === 'js') {
      return `<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 20px; font-family: system-ui, -apple-system, sans-serif; background: #1a1a2e; color: #eee; }
    #output { margin-top: 16px; padding: 16px; background: #16213e; border-radius: 8px; font-family: monospace; white-space: pre-wrap; min-height: 100px; }
    .log { color: #4ade80; margin: 4px 0; }
    .error { color: #f87171; margin: 4px 0; }
    h1 { color: #818cf8; }
  </style>
</head>
<body>
  <h1>JavaScript Output</h1>
  <div id="output"></div>
  <script>
    const outputEl = document.getElementById('output');
    const originalLog = console.log;
    const originalError = console.error;
    
    console.log = function(...args) {
      const message = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
      outputEl.innerHTML += '<div class="log">' + message + '</div>';
      originalLog.apply(console, args);
    };
    
    console.error = function(...args) {
      const message = args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ');
      outputEl.innerHTML += '<div class="error">Error: ' + message + '</div>';
      originalError.apply(console, args);
    };
    
    try {
      ${code}
    } catch (error) {
      outputEl.innerHTML += '<div class="error">Runtime Error: ' + error.message + '</div>';
    }
  </script>
</body>
</html>`;
    }
    
    return code;
  };

  // Run code handler
  const runCode = async (code: string, language: string) => {
    setIsRunning(true);
    setShowRunPanel(true);
    setRunOutput(null);
    setPreviewHtml('');

    try {
      if (isBrowserExecutable(language)) {
        // Browser execution
        const html = generatePreviewHtml(code, language);
        setPreviewHtml(html);
        sonnerToast.success('Code executed in browser preview');
      } else if (isPistonExecutable(language)) {
        // Piston API execution
        const { data, error } = await supabase.functions.invoke('code-runner', {
          body: { code, language }
        });

        if (error) {
          throw new Error(error.message || 'Failed to execute code');
        }

        if (data.error) {
          throw new Error(data.error);
        }

        setRunOutput(data);
        if (data.success) {
          sonnerToast.success('Code executed successfully');
        } else {
          sonnerToast.error('Code execution completed with errors');
        }
      } else {
        sonnerToast.error(`Language '${language}' is not supported for execution`);
      }
    } catch (error: any) {
      console.error('Code execution error:', error);
      sonnerToast.error(error.message || 'Failed to execute code');
    } finally {
      setIsRunning(false);
    }
  };

  const isHTMLLikeLanguage = (language: string): boolean => {
    const htmlLanguages = ['html', 'css', 'jsx', 'tsx', 'vue', 'svelte'];
    return htmlLanguages.includes(language.toLowerCase());
  };

  const getMonacoLanguage = (language: string): string => {
    const languageMap: { [key: string]: string } = {
      javascript: 'javascript',
      typescript: 'typescript',
      python: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'csharp',
      ruby: 'ruby',
      go: 'go',
      rust: 'rust',
      php: 'php',
      swift: 'swift',
      kotlin: 'kotlin',
      html: 'html',
      css: 'css',
      jsx: 'javascript',
      tsx: 'typescript',
      json: 'json',
      xml: 'xml',
      sql: 'sql',
      bash: 'shell',
    };
    return languageMap[language.toLowerCase()] || 'plaintext';
  };

  const downloadVSCodeFile = (code: string, language: string, title: string) => {
    const extensions: { [key: string]: string } = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      csharp: 'cs',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      php: 'php',
      swift: 'swift',
      kotlin: 'kt',
      html: 'html',
      css: 'css',
      jsx: 'jsx',
      tsx: 'tsx',
    };

    const extension = extensions[language.toLowerCase()] || 'txt';
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.${extension}`;
    
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Downloaded!", description: `File saved as ${fileName}` });
  };

  const downloadHTMLFile = (code: string, language: string, title: string) => {
    let htmlContent = code;
    
    if (!code.trim().toLowerCase().startsWith('<!doctype') && !code.trim().toLowerCase().startsWith('<html')) {
      htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  ${language === 'css' ? '<style>\n' + code + '\n</style>' : ''}
</head>
<body>
  ${language === 'css' ? '' : code}
</body>
</html>`;
    }
    
    const fileName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Downloaded!", description: `HTML file saved as ${fileName}` });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isPreviewable = (language: string) => {
    return ['html', 'css', 'javascript'].includes(language.toLowerCase());
  };

  const handleOpenPreview = (code: string, language: string) => {
    if (!isPreviewable(language)) {
      sonnerToast.error(`Live preview is not available for ${language}. Use the code in your development environment.`);
      return;
    }

    let content = code;

    if (language.toLowerCase() === 'css') {
      content = `<!DOCTYPE html>
<html>
  <head>
    <style>
      body { margin: 0; padding: 20px; font-family: system-ui; }
      ${code}
    </style>
  </head>
  <body>
    <h1>CSS Preview</h1>
    <p>Your CSS styles are applied to this preview.</p>
    <div class="demo-content">
      <button>Button</button>
      <input type="text" placeholder="Input field" />
      <p>Sample paragraph with styles applied.</p>
    </div>
  </body>
</html>`;
    } else if (language.toLowerCase() === 'javascript') {
      content = `<!DOCTYPE html>
<html>
  <head>
    <style>
      body { margin: 0; padding: 20px; font-family: system-ui; }
      #output { margin-top: 20px; padding: 10px; background: #f5f5f5; border-radius: 4px; }
    </style>
  </head>
  <body>
    <h1>JavaScript Preview</h1>
    <div id="output"></div>
    <script>
      try {
        ${code}
      } catch (error) {
        document.getElementById('output').innerHTML = '<strong>Error:</strong> ' + error.message;
      }
    </script>
  </body>
</html>`;
    }

    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      sonnerToast.error('Please allow pop-ups to open the preview.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`p-0 ${isEditing || showWelcomeAnimation ? 'max-w-full w-[95vw] h-[95vh]' : 'max-w-6xl h-[80vh]'}`}>
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            {isEditing || showWelcomeAnimation ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelEdit}
                className="mr-2"
              >
                <X className="h-4 w-4 mr-1" />
                Back to Library
              </Button>
            ) : null}
            <Code2 className="h-5 w-5 text-primary" />
            {isEditing || showWelcomeAnimation ? 'Code Editor' : 'Code Snippet Library'}
          </DialogTitle>
        </DialogHeader>

        {(isEditing || showWelcomeAnimation) && selectedSnippet ? (
          <div className="flex flex-col p-6 pt-4 overflow-hidden" style={{ height: 'calc(95vh - 80px)' }}>
            <div className="flex items-start justify-between mb-4 pb-4 border-b flex-shrink-0">
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{selectedSnippet.title}</h2>
                {selectedSnippet.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {selectedSnippet.description}
                  </p>
                )}
              </div>
              {isEditing && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={saveEdit}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditedCode(originalCode);
                      toast({ title: "Reverted", description: "Code reverted to original" });
                    }}
                    title="Revert (Ctrl+Z)"
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="flex-1 min-h-0 relative">
              {showWelcomeAnimation && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-primary/10 animate-fade-in">
                  <div className="text-center space-y-6 animate-scale-in">
                    <div className="relative">
                      <div className="absolute inset-0 animate-pulse">
                        <div className="w-32 h-32 mx-auto bg-primary/20 rounded-full blur-2xl"></div>
                      </div>
                      <img 
                        src="/src/assets/vithal-ai-logo-new.png" 
                        alt="Vithal AI" 
                        className="w-24 h-24 mx-auto relative animate-float-3d filter drop-shadow-lg"
                      />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-3xl font-bold gradient-text animate-fade-in">
                        Welcome to Vithal AI
                      </h2>
                      <p className="text-xl text-primary animate-fade-in font-semibold typing-effect">
                        Code Editor
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground animate-fade-in">
                      <Code2 className="h-5 w-5 animate-pulse" />
                      <span className="text-sm font-mono">Initializing editor...</span>
                    </div>
                  </div>
                </div>
              )}
              
              {isEditing && (
                <div className="absolute top-2 right-2 z-10 bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg animate-fade-in">
                  <div className="text-xs font-medium mb-2 flex items-center gap-2">
                    <Code2 className="h-3 w-3" />
                    Keyboard Shortcuts
                  </div>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center justify-between gap-4">
                      <span>Save changes</span>
                      <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Ctrl+S</kbd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span>Revert to original</span>
                      <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Ctrl+Z</kbd>
                    </div>
                  </div>
                </div>
              )}
              {isEditing ? (
                <div className="h-full border rounded-lg overflow-hidden animate-fade-in" onKeyDown={handleKeyDown}>
                  <Editor
                    height="100%"
                    language={getMonacoLanguage(selectedSnippet.language)}
                    value={editedCode}
                    onChange={(value) => setEditedCode(value || '')}
                    theme="vs-dark"
                    options={{
                      minimap: { enabled: true },
                      fontSize: 15,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 4,
                      insertSpaces: true,
                      wordWrap: 'on',
                      folding: true,
                      foldingStrategy: 'indentation',
                      showFoldingControls: 'always',
                      lineDecorationsWidth: 10,
                      lineNumbersMinChars: 3,
                      glyphMargin: true,
                      renderLineHighlight: 'all',
                      scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        useShadows: true,
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10,
                      },
                      suggestOnTriggerCharacters: true,
                      acceptSuggestionOnEnter: 'on',
                      quickSuggestions: true,
                      formatOnPaste: true,
                      formatOnType: true,
                      autoIndent: 'full',
                      bracketPairColorization: {
                        enabled: true,
                      },
                      guides: {
                        indentation: true,
                        bracketPairs: true,
                      },
                    }}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-4 p-6 pt-4 overflow-hidden" style={{ height: 'calc(80vh - 80px)' }}>
          {/* Sidebar */}
          <div className="w-full md:w-1/3 flex flex-col gap-4 min-h-0">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search snippets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Tag className="h-4 w-4" />
                  Tags
                </div>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <Badge
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                      {selectedTags.includes(tag) && (
                        <X className="ml-1 h-3 w-3" />
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Snippets List */}
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {filteredSnippets.map(snippet => (
                  <Card
                    key={snippet.id}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedSnippet?.id === snippet.id ? 'border-primary bg-accent' : ''
                    }`}
                    onClick={() => setSelectedSnippet(snippet)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-sm line-clamp-1">{snippet.title}</h3>
                        {snippet.is_favorite && (
                          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                      {snippet.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {snippet.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-xs">
                          {snippet.language}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(snippet.created_at)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {filteredSnippets.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Code2 className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No snippets found</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {selectedSnippet ? (
              <>
                <div className="flex items-start justify-between mb-4 pb-4 border-b flex-shrink-0">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{selectedSnippet.title}</h2>
                    {selectedSnippet.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {selectedSnippet.description}
                      </p>
                    )}
                    {selectedSnippet.tags && selectedSnippet.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {selectedSnippet.tags.map(tag => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {/* Run Code Button */}
                    <Button
                      variant={isExecutable(selectedSnippet.language) ? "default" : "ghost"}
                      size="sm"
                      onClick={() => runCode(selectedSnippet.generated_code, selectedSnippet.language)}
                      disabled={!isExecutable(selectedSnippet.language) || isRunning}
                      title={isExecutable(selectedSnippet.language) ? "Run Code" : `Execution not supported for ${selectedSnippet.language}`}
                      className={isExecutable(selectedSnippet.language) ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                    >
                      {isRunning ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      Run
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenPreview(selectedSnippet.generated_code, selectedSnippet.language)}
                      title="Open preview in new tab"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(selectedSnippet)}
                      title={selectedSnippet.is_favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      {selectedSnippet.is_favorite ? (
                        <StarOff className="h-4 w-4" />
                      ) : (
                        <Star className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyCode(selectedSnippet.generated_code)}
                      title="Copy code"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(selectedSnippet)}
                      title="Edit code"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadVSCodeFile(selectedSnippet.generated_code, selectedSnippet.language, selectedSnippet.title)}
                      title="Download VS Code File"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      VS Code
                    </Button>
                    {isHTMLLikeLanguage(selectedSnippet.language) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => downloadHTMLFile(selectedSnippet.generated_code, selectedSnippet.language, selectedSnippet.title)}
                        title="Download HTML File"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        HTML
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSnippet(selectedSnippet.id)}
                      title="Delete snippet"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Code and Run Panel */}
                <div className={`flex-1 min-h-0 flex ${showRunPanel ? 'flex-col gap-4' : ''}`}>
                  {/* Code Display */}
                  <ScrollArea className={showRunPanel ? "h-1/2" : "h-full"}>
                    <div className="rounded-lg overflow-hidden border">
                      <SyntaxHighlighter
                        language={selectedSnippet.language}
                        style={vscDarkPlus}
                        showLineNumbers
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          fontSize: '0.875rem',
                        }}
                      >
                        {selectedSnippet.generated_code}
                      </SyntaxHighlighter>
                    </div>
                  </ScrollArea>

                  {/* Run Output Panel */}
                  {showRunPanel && (
                    <div className="h-1/2 border rounded-lg overflow-hidden bg-card">
                      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/50">
                        <div className="flex items-center gap-2">
                          <Terminal className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {isBrowserExecutable(selectedSnippet.language) ? '🖥️ Live Preview' : '📟 Execution Output'}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowRunPanel(false);
                            setRunOutput(null);
                            setPreviewHtml('');
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Browser Preview (HTML/CSS/JS) */}
                      {isBrowserExecutable(selectedSnippet.language) && previewHtml && (
                        <iframe
                          srcDoc={previewHtml}
                          className="w-full h-[calc(100%-40px)] bg-white"
                          sandbox="allow-scripts"
                          title="Code Preview"
                        />
                      )}

                      {/* Piston Output (Python/Java/C++ etc.) */}
                      {isPistonExecutable(selectedSnippet.language) && runOutput && (
                        <ScrollArea className="h-[calc(100%-40px)]">
                          <div className="p-4 space-y-4">
                            {/* Language Info */}
                            <div className="flex items-center gap-4 text-sm">
                              <Badge variant="secondary">
                                {runOutput.language} {runOutput.version}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {runOutput.success ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                    <span className="text-green-500">Success</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 text-red-500" />
                                    <span className="text-red-500">Failed</span>
                                  </>
                                )}
                              </div>
                            </div>

                            {/* Compile Output (for compiled languages) */}
                            {runOutput.compile && (runOutput.compile.stdout || runOutput.compile.stderr) && (
                              <div className="space-y-2">
                                <div className="text-sm font-medium text-muted-foreground">Compilation:</div>
                                {runOutput.compile.stdout && (
                                  <pre className="p-3 rounded bg-muted text-sm font-mono whitespace-pre-wrap">
                                    {runOutput.compile.stdout}
                                  </pre>
                                )}
                                {runOutput.compile.stderr && (
                                  <pre className="p-3 rounded bg-red-500/10 text-red-500 text-sm font-mono whitespace-pre-wrap">
                                    {runOutput.compile.stderr}
                                  </pre>
                                )}
                              </div>
                            )}

                            {/* Run Output */}
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-muted-foreground">Output:</div>
                              {runOutput.run.stdout ? (
                                <pre className="p-3 rounded bg-muted text-sm font-mono whitespace-pre-wrap text-green-400">
                                  {runOutput.run.stdout}
                                </pre>
                              ) : (
                                <p className="text-sm text-muted-foreground italic">No output</p>
                              )}
                              {runOutput.run.stderr && (
                                <pre className="p-3 rounded bg-red-500/10 text-red-500 text-sm font-mono whitespace-pre-wrap">
                                  {runOutput.run.stderr}
                                </pre>
                              )}
                            </div>

                            {/* Exit Code */}
                            <div className="text-xs text-muted-foreground">
                              Exit Code: {runOutput.run.exitCode}
                            </div>
                          </div>
                        </ScrollArea>
                      )}

                      {/* Loading State */}
                      {isRunning && (
                        <div className="flex items-center justify-center h-[calc(100%-40px)]">
                          <div className="text-center space-y-3">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                            <p className="text-sm text-muted-foreground">Executing code...</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Code2 className="h-16 w-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">Select a snippet to view</p>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
