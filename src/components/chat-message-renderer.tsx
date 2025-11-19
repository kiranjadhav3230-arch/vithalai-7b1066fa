import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Copy, Check, Edit3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MessageRendererProps {
  content: string;
  onImageClick?: (imageUrl: string) => void;
}

export const ChatMessageRenderer: React.FC<MessageRendererProps> = ({ content, onImageClick }) => {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlocks(prev => new Set(prev).add(index));
      toast({
        title: "Copied!",
        description: "Code copied to clipboard",
      });
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy code",
        variant: "destructive",
      });
    }
  };

  const renderContent = () => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const parts: JSX.Element[] = [];
    let lastIndex = 0;
    let match;
    let blockIndex = 0;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textContent = content.substring(lastIndex, match.index);
        parts.push(
          <div 
            key={`text-${blockIndex}`}
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ 
              __html: textContent
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
            }}
          />
        );
      }

      // Add code block with syntax highlighting
      const language = match[1] || 'plaintext';
      const code = match[2].trim();
      const currentBlockIndex = blockIndex;

      parts.push(
        <div key={`code-${blockIndex}`} className="relative group my-4">
          <div className="absolute right-2 top-2 z-10">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => copyToClipboard(code, currentBlockIndex)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copiedBlocks.has(currentBlockIndex) ? (
                <>
                  <Check className="h-3 w-3 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            showLineNumbers={true}
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              padding: '1.5rem',
            }}
            codeTagProps={{
              style: {
                fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
              }
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      );

      lastIndex = match.index + match[0].length;
      blockIndex++;
    }

    // Add remaining text with image support
    if (lastIndex < content.length) {
      let textContent = content.substring(lastIndex);
      const imageParts: JSX.Element[] = [];
      let imageLastIndex = 0;
      let imageMatch;
      let imageIndex = 0;

      while ((imageMatch = imageRegex.exec(textContent)) !== null) {
        // Add text before image
        if (imageMatch.index > imageLastIndex) {
          const beforeText = textContent.substring(imageLastIndex, imageMatch.index);
          imageParts.push(
            <div 
              key={`before-img-${imageIndex}`}
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ 
                __html: beforeText
                  .replace(/\n/g, '<br>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
              }}
            />
          );
        }

        // Add image
        const altText = imageMatch[1];
        const imageUrl = imageMatch[2];
        imageParts.push(
          <div key={`img-wrapper-${imageIndex}`} className="relative group my-4">
            <img 
              key={`img-${imageIndex}`}
              src={imageUrl} 
              alt={altText}
              className="max-w-full h-auto rounded-lg shadow-lg cursor-pointer transition-all hover:shadow-2xl hover:scale-[1.02]"
              onClick={() => onImageClick?.(imageUrl)}
              title="Click to edit this image"
            />
            {onImageClick && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="bg-white/90 text-black px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" />
                  Click to edit
                </div>
              </div>
            )}
          </div>
        );

        imageLastIndex = imageMatch.index + imageMatch[0].length;
        imageIndex++;
      }

      // Add remaining text after images
      if (imageLastIndex < textContent.length) {
        const afterText = textContent.substring(imageLastIndex);
        imageParts.push(
          <div 
            key={`text-final`}
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ 
              __html: afterText
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
            }}
          />
        );
      } else if (imageParts.length === 0) {
        // No images found, render as normal text
        imageParts.push(
          <div 
            key={`text-final`}
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ 
              __html: textContent
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
            }}
          />
        );
      }

      parts.push(...imageParts);
    }

    return parts;
  };

  return <div className="space-y-2">{renderContent()}</div>;
};
