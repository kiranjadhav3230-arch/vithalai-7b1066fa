import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Copy, Download, Save, Eye, EyeOff } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const [showPreview, setShowPreview] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Check if the language supports preview
  const isPreviewable = ['html', 'css', 'javascript', 'react', 'typescript'].includes(selectedLanguage.toLowerCase());

  // Update preview when code changes
  useEffect(() => {
    if (showPreview && iframeRef.current && isPreviewable) {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        let previewContent = generatedCode;

        // For CSS, wrap in HTML structure
        if (selectedLanguage.toLowerCase() === 'css') {
          previewContent = `
            <!DOCTYPE html>
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
            </html>
          `;
        }
        // For JavaScript, wrap in HTML structure
        else if (selectedLanguage.toLowerCase() === 'javascript') {
          previewContent = `
            <!DOCTYPE html>
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
            </html>
          `;
        }
        // For React/TypeScript, show a message
        else if (['react', 'typescript'].includes(selectedLanguage.toLowerCase())) {
          previewContent = `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { 
                    margin: 0; 
                    padding: 40px; 
                    font-family: system-ui; 
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  }
                  .message {
                    background: white;
                    padding: 30px;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                    text-align: center;
                    max-width: 500px;
                  }
                  h2 { color: #667eea; margin: 0 0 10px 0; }
                  p { color: #666; line-height: 1.6; }
                  code { 
                    background: #f5f5f5; 
                    padding: 2px 8px; 
                    border-radius: 4px;
                    font-family: monospace;
                    color: #e83e8c;
                  }
                </style>
              </head>
              <body>
                <div class="message">
                  <h2>⚛️ ${selectedLanguage} Code</h2>
                  <p>Live preview is not available for ${selectedLanguage} components. Use the code in your development environment with proper build setup.</p>
                  <p>Copy the code and paste it into your <code>${selectedLanguage === 'react' ? 'React' : 'TypeScript'}</code> project to see it in action!</p>
                </div>
              </body>
            </html>
          `;
        }

        iframeDoc.open();
        iframeDoc.write(previewContent);
        iframeDoc.close();
      }
    }
  }, [generatedCode, showPreview, selectedLanguage, isPreviewable]);

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
            {isPreviewable && (
              <Button 
                onClick={() => setShowPreview(!showPreview)} 
                variant={showPreview ? "default" : "outline"} 
                size="sm" 
                className="gap-2 hover:border-primary"
              >
                {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </Button>
            )}
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
        <div className={`grid ${showPreview ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'} gap-0`}>
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
          
          {showPreview && isPreviewable && (
            <div className="h-[600px] w-full border-l border-border bg-background">
              <div className="h-full w-full relative">
                <div className="absolute top-0 left-0 right-0 bg-muted/50 border-b border-border px-4 py-2 flex items-center gap-2">
                  <Eye className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Live Preview</span>
                </div>
                <iframe
                  ref={iframeRef}
                  className="w-full h-full pt-10"
                  sandbox="allow-scripts"
                  title="Code Preview"
                  style={{
                    border: 'none',
                    background: 'white',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
