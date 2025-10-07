import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Terminal, Copy, Download, Save } from 'lucide-react';
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
      </CardContent>
    </Card>
  );
};
