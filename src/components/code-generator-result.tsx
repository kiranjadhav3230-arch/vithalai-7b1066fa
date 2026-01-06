import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Copy, Download, Save, ExternalLink, Play } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { CodeExecutionOutput } from '@/components/code-execution-output';

interface CodeGeneratorResultProps {
  generatedCode: string;
  selectedLanguage: string;
  onCopy: () => void;
  onDownload: () => void;
  onSave: () => void;
}

export const CodeGeneratorResult: React.FC<CodeGeneratorResultProps> = ({
  generatedCode,
  selectedLanguage,
  onCopy,
  onDownload,
  onSave,
}) => {
  const { executeCode, isExecuting, result, clearResult, isExecutable } = useCodeExecution();
  
  // Check if the language supports preview
  const isPreviewable = ['html', 'css', 'javascript'].includes(selectedLanguage.toLowerCase());
  const canExecute = isExecutable(selectedLanguage);

  const handleRunCode = async () => {
    await executeCode(generatedCode, selectedLanguage);
  };

  const handleOpenPreview = () => {
    if (!isPreviewable) {
      toast.error(`Live preview is not available for ${selectedLanguage}. Use the code in your development environment.`);
      return;
    }

    let content = generatedCode;

    // For CSS, wrap in HTML structure
    if (selectedLanguage.toLowerCase() === 'css') {
      content = `<!DOCTYPE html>
<html>
  <head>
    <style>
      body { margin: 0; padding: 20px; font-family: system-ui; }
      ${generatedCode}
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
    }
    // For JavaScript, wrap in HTML structure
    else if (selectedLanguage.toLowerCase() === 'javascript') {
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
        ${generatedCode}
      } catch (error) {
        document.getElementById('output').innerHTML = '<strong>Error:</strong> ' + error.message;
      }
    </script>
  </body>
</html>`;
    }

    // Create blob and open in new tab
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } else {
      toast.error('Please allow pop-ups to open the preview.');
    }
  };

  return (
    <Card className="border-2 border-primary/20 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-b">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            Generated Code
            <Badge variant="outline" className="ml-2 border-primary/50">
              {selectedLanguage}
            </Badge>
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            {canExecute && (
              <Button 
                onClick={handleRunCode} 
                variant="outline" 
                size="sm" 
                className="gap-2 hover:border-emerald-500 text-emerald-600 border-emerald-500/50"
                disabled={isExecuting}
              >
                <Play className="h-4 w-4" />
                {isExecuting ? 'Running...' : 'Run Code'}
              </Button>
            )}
            <Button 
              onClick={handleOpenPreview} 
              variant="outline" 
              size="sm" 
              className="gap-2 hover:border-primary"
            >
              <ExternalLink className="h-4 w-4" />
              Open Preview
            </Button>
            <Button onClick={onCopy} variant="outline" size="sm" className="gap-2 hover:border-primary">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button onClick={onDownload} variant="outline" size="sm" className="gap-2 hover:border-primary">
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button onClick={onSave} size="sm" className="gap-2 bg-primary hover:bg-primary/90">
              <Save className="h-4 w-4" />
              Save Snippet
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px] w-full">
          <SyntaxHighlighter
            language={selectedLanguage === 'cpp' ? 'cpp' : selectedLanguage}
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
                fontSize: '0.875rem',
              }
            }}
          >
            {generatedCode}
          </SyntaxHighlighter>
        </ScrollArea>
        
        <CodeExecutionOutput 
          result={result} 
          isExecuting={isExecuting} 
          onClear={clearResult} 
        />
      </CardContent>
    </Card>
  );
};
