import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle, Radio, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  language: string;
  lineCount: number;
  isModified: boolean;
  code: string;
  lastSaved?: string;
  onSave?: () => void;
}

const PREVIEWABLE_LANGUAGES = ['html', 'css', 'javascript', 'js'];
const PREVIEW_STORAGE_KEY = 'code-library-preview-content';

export function StatusBar({ language, lineCount, isModified, code, lastSaved, onSave }: StatusBarProps) {
  const [isLive, setIsLive] = useState(false);
  const previewWindowRef = useRef<Window | null>(null);

  const isPreviewable = PREVIEWABLE_LANGUAGES.includes(language.toLowerCase());

  // Update preview content when code changes (for auto-refresh)
  useEffect(() => {
    if (isLive && isPreviewable) {
      const previewContent = generatePreviewContent(code, language);
      localStorage.setItem(PREVIEW_STORAGE_KEY, previewContent);
    }
  }, [code, isLive, language, isPreviewable]);

  // Check if preview window is still open
  useEffect(() => {
    const checkWindow = setInterval(() => {
      if (previewWindowRef.current && previewWindowRef.current.closed) {
        setIsLive(false);
        previewWindowRef.current = null;
      }
    }, 1000);

    return () => clearInterval(checkWindow);
  }, []);

  const generatePreviewContent = (sourceCode: string, lang: string): string => {
    const lowerLang = lang.toLowerCase();
    
    if (lowerLang === 'html') {
      return sourceCode;
    }
    
    if (lowerLang === 'css') {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Preview</title>
  <style>${sourceCode}</style>
</head>
<body>
  <div class="preview-container">
    <h1>CSS Preview</h1>
    <p>Add HTML elements to see your styles in action.</p>
    <button>Sample Button</button>
    <div class="box">Sample Box</div>
  </div>
</body>
</html>`;
    }
    
    if (lowerLang === 'javascript' || lowerLang === 'js') {
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>JavaScript Preview</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; padding: 20px; background: #1e1e1e; color: #fff; }
    #output { background: #252526; padding: 16px; border-radius: 8px; font-family: monospace; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h3>Console Output:</h3>
  <div id="output"></div>
  <script>
    const output = document.getElementById('output');
    const originalLog = console.log;
    console.log = (...args) => {
      output.textContent += args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : a).join(' ') + '\\n';
      originalLog(...args);
    };
    console.error = (...args) => {
      output.innerHTML += '<span style="color:#f44">' + args.join(' ') + '</span>\\n';
    };
    try {
      ${sourceCode}
    } catch (e) {
      console.error('Error:', e.message);
    }
  </script>
</body>
</html>`;
    }

    return sourceCode;
  };

  const handleGoLive = () => {
    if (isLive && previewWindowRef.current && !previewWindowRef.current.closed) {
      // Stop live preview
      previewWindowRef.current.close();
      previewWindowRef.current = null;
      setIsLive(false);
      localStorage.removeItem(PREVIEW_STORAGE_KEY);
      return;
    }

    // Start live preview
    const previewContent = generatePreviewContent(code, language);
    localStorage.setItem(PREVIEW_STORAGE_KEY, previewContent);

    // Create preview HTML with auto-refresh
    const previewHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Live Preview - Code Library</title>
  <style>
    body, html { margin: 0; padding: 0; height: 100%; }
    iframe { width: 100%; height: 100%; border: none; }
  </style>
</head>
<body>
  <iframe id="preview-frame"></iframe>
  <script>
    const STORAGE_KEY = '${PREVIEW_STORAGE_KEY}';
    let lastContent = '';
    
    function updatePreview() {
      const content = localStorage.getItem(STORAGE_KEY);
      if (content && content !== lastContent) {
        lastContent = content;
        const iframe = document.getElementById('preview-frame');
        iframe.srcdoc = content;
      }
    }
    
    // Initial load
    updatePreview();
    
    // Poll for changes
    setInterval(updatePreview, 500);
  </script>
</body>
</html>`;

    const blob = new Blob([previewHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    previewWindowRef.current = window.open(url, '_blank', 'width=800,height=600');
    
    if (previewWindowRef.current) {
      setIsLive(true);
    }
  };

  return (
    <div className="h-6 bg-[#007acc] text-white text-xs flex items-center justify-between px-2 shrink-0">
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-1">
          {isModified ? (
            <>
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Modified</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Saved</span>
            </>
          )}
        </div>

        {/* Save Button - Only show when modified */}
        {isModified && onSave && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="h-5 px-2 text-xs font-medium gap-1.5 bg-white/10 hover:bg-white/20 text-white"
            title="Save (Ctrl+S)"
          >
            <Save className="h-3 w-3" />
            Save
          </Button>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Line count */}
        <span>{lineCount} lines</span>
        
        {/* Encoding */}
        <span>UTF-8</span>
        
        {/* Language */}
        <span className="px-2 py-0.5 bg-white/10 rounded">{language.toUpperCase()}</span>

        {/* Go Live Button - Only for HTML/CSS/JS */}
        {isPreviewable && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoLive}
            className={cn(
              "h-5 px-2 text-xs font-medium gap-1.5",
              isLive 
                ? "bg-[#c41e3a] hover:bg-[#a01830] text-white" 
                : "bg-white/10 hover:bg-white/20 text-white"
            )}
          >
            <Radio className={cn("h-3 w-3", isLive && "animate-pulse")} />
            {isLive ? 'Stop' : 'Go Live'}
          </Button>
        )}
      </div>
    </div>
  );
}
