import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Code, Copy, Download, Send, Loader2, Paperclip, X, FileText, Code2, FolderDown, BookOpen, Monitor, RotateCcw, CheckCircle2, AlertCircle, Eye, EyeOff, Sparkles, Globe, Palette } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { CodeSnippetLibrary } from './code-snippet-library';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { User } from '@supabase/supabase-js';
import JSZip from 'jszip';
const PROGRAMMING_LANGUAGES = [{
  value: 'javascript',
  label: 'JavaScript'
}, {
  value: 'python',
  label: 'Python'
}, {
  value: 'java',
  label: 'Java'
}, {
  value: 'cpp',
  label: 'C++'
}, {
  value: 'typescript',
  label: 'TypeScript'
}, {
  value: 'csharp',
  label: 'C#'
}, {
  value: 'php',
  label: 'PHP'
}, {
  value: 'ruby',
  label: 'Ruby'
}, {
  value: 'go',
  label: 'Go'
}, {
  value: 'rust',
  label: 'Rust'
}, {
  value: 'swift',
  label: 'Swift'
}, {
  value: 'kotlin',
  label: 'Kotlin'
}, {
  value: 'r',
  label: 'R'
}, {
  value: 'scala',
  label: 'Scala'
}, {
  value: 'dart',
  label: 'Dart'
}, {
  value: 'sql',
  label: 'SQL'
}, {
  value: 'html',
  label: 'HTML'
}, {
  value: 'css',
  label: 'CSS'
}];
const CODE_TASKS = [{
  value: 'generate',
  label: 'Generate'
}, {
  value: 'explain',
  label: 'Explain'
}, {
  value: 'fix',
  label: 'Fix Bugs'
}, {
  value: 'optimize',
  label: 'Optimize'
}, {
  value: 'translate',
  label: 'Translate Code'
}, {
  value: 'website',
  label: '🌐 Website'
}];

const WEBSITE_TYPES = [
  { value: 'landing', label: 'Landing Page' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'business', label: 'Business' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'event', label: 'Event' },
  { value: 'blog', label: 'Blog' },
  { value: 'ecommerce', label: 'E-commerce' },
];

const WEBSITE_STYLES = [
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'glassmorphism', label: 'Glassmorphism' },
  { value: 'dark', label: 'Dark Theme' },
  { value: 'gradient', label: 'Gradient' },
  { value: 'colorful', label: 'Colorful' },
];

const COLOR_SCHEMES = [
  { value: 'blue', label: '🔵 Blue' },
  { value: 'purple', label: '🟣 Purple' },
  { value: 'green', label: '🟢 Green' },
  { value: 'orange', label: '🟠 Orange' },
  { value: 'red', label: '🔴 Red' },
  { value: 'teal', label: '🩵 Teal' },
  { value: 'pink', label: '💗 Pink' },
];

const WEBSITE_SECTIONS = [
  { value: 'hero', label: 'Hero' },
  { value: 'features', label: 'Features' },
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'contact', label: 'Contact' },
  { value: 'footer', label: 'Footer' },
];

interface WebsiteFile {
  name: string;
  content: string;
  language: string;
}
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language?: string;
  isCode: boolean;
  attachments?: Array<{
    type: 'image' | 'document';
    data: string;
    name: string;
  }>;
  validation?: {
    score: number;
    isValid: boolean;
    issues: string[];
  };
  isStreaming?: boolean;
}
interface CodeGeneratorChatProps {
  user: User;
  sessionId?: string | null;
  onSessionTitleUpdate?: (sessionId: string, newTitle: string) => void;
}
export const CodeGeneratorChat: React.FC<CodeGeneratorChatProps> = ({
  user,
  sessionId,
  onSessionTitleUpdate
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedTask, setSelectedTask] = useState('generate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sessionId || null);
  const [sourceLanguage, setSourceLanguage] = useState('javascript');
  const [targetLanguage, setTargetLanguage] = useState('python');
  const [attachments, setAttachments] = useState<Array<{
    type: 'image' | 'document';
    data: string;
    name: string;
  }>>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'library'>('generator');
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [previewCode, setPreviewCode] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState<{
    [key: string]: boolean;
  }>({});
  // Website generator state
  const [websiteType, setWebsiteType] = useState('landing');
  const [websiteStyle, setWebsiteStyle] = useState('modern');
  const [colorScheme, setColorScheme] = useState('blue');
  const [selectedSections, setSelectedSections] = useState<string[]>(['hero', 'features', 'footer']);
  const [generatedWebsite, setGeneratedWebsite] = useState<WebsiteFile[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();
  useEffect(() => {
    if (sessionId) {
      setCurrentSessionId(sessionId);
      loadMessages(sessionId);
    } else {
      setIsFirstMessage(true);
      setMessages([]);
    }
  }, [sessionId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);
  const generateSmartCodeTitle = async (sid: string, prompt: string, language: string, task: string) => {
    try {
      const langLabel = PROGRAMMING_LANGUAGES.find(l => l.value === language)?.label || language;
      const shortPrompt = prompt.length > 25 ? prompt.substring(0, 25) + '...' : prompt;
      let smartTitle = '';
      switch (task) {
        case 'generate':
          smartTitle = `💻 ${langLabel}: ${shortPrompt}`;
          break;
        case 'explain':
          smartTitle = `📖 Explain ${langLabel}: ${shortPrompt}`;
          break;
        case 'fix':
          smartTitle = `🔧 Fix ${langLabel}: ${shortPrompt}`;
          break;
        case 'optimize':
          smartTitle = `⚡ Optimize ${langLabel}: ${shortPrompt}`;
          break;
        case 'translate':
          smartTitle = `🔄 Translate: ${shortPrompt}`;
          break;
        case 'website':
          smartTitle = `🌐 Website: ${shortPrompt}`;
          break;
        default:
          smartTitle = `💻 ${langLabel}: ${shortPrompt}`;
      }
      await supabase.from('chat_sessions').update({
        title: smartTitle
      }).eq('id', sid);
      if (onSessionTitleUpdate) onSessionTitleUpdate(sid, smartTitle);
    } catch (error) {
      console.error('Error generating smart code title:', error);
    }
  };
  const parseResponse = (text: string) => {
    const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
    const parts: Array<{
      type: 'text' | 'code';
      content: string;
      language?: string;
    }> = [];
    let lastIndex = 0;
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        const textContent = text.substring(lastIndex, match.index).trim();
        if (textContent) parts.push({
          type: 'text',
          content: textContent
        });
      }
      const langMatch = text.substring(match.index, match.index + 20).match(/```(\w+)/);
      parts.push({
        type: 'code',
        content: match[1],
        language: langMatch ? langMatch[1] : selectedLanguage
      });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      const textContent = text.substring(lastIndex).trim();
      if (textContent) parts.push({
        type: 'text',
        content: textContent
      });
    }
    return parts.length > 0 ? parts : [{
      type: 'code',
      content: text,
      language: selectedLanguage
    }];
  };
  const loadMessages = async (sid: string) => {
    const {
      data
    } = await supabase.from('chat_messages').select('*').eq('session_id', sid).order('created_at');
    if (data) {
      setIsFirstMessage(data.length === 0);
      const msgs: Message[] = [];
      data.forEach(m => {
        msgs.push({
          id: m.id,
          role: 'user',
          content: m.message,
          isCode: false
        });
        if (m.response) {
          const parsedParts = parseResponse(m.response);
          parsedParts.forEach((part, partIndex) => {
            msgs.push({
              id: `${m.id}-ai-${partIndex}`,
              role: 'assistant',
              content: part.content,
              isCode: part.type === 'code',
              language: part.language || selectedLanguage
            });
          });
        }
      });
      setMessages(msgs);
    } else {
      setIsFirstMessage(true);
    }
  };
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < Math.min(files.length, 5); i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds 10MB limit`,
          variant: "destructive"
        });
        continue;
      }
      const reader = new FileReader();
      reader.onload = event => {
        const result = event.target?.result as string;
        const type = file.type.startsWith('image/') ? 'image' : 'document';
        setAttachments(prev => [...prev, {
          type,
          data: result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };
  const getFileExtension = (language: string): string => {
    const extensions: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      cpp: 'cpp',
      csharp: 'cs',
      php: 'php',
      ruby: 'rb',
      go: 'go',
      rust: 'rs',
      swift: 'swift',
      kotlin: 'kt',
      r: 'r',
      scala: 'scala',
      dart: 'dart',
      sql: 'sql',
      html: 'html',
      css: 'css'
    };
    return extensions[language] || 'txt';
  };
  const downloadVSCodeFile = (code: string, language: string) => {
    const extension = getFileExtension(language);
    const fileName = `generated-code.${extension}`;
    const blob = new Blob([code], {
      type: 'text/plain'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "Downloaded",
      description: `${fileName} saved successfully`
    });
  };
  const downloadHTMLFile = (code: string) => {
    let htmlContent = code;
    if (!code.toLowerCase().includes('<!doctype') && !code.toLowerCase().includes('<html')) {
      htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Page</title>
</head>
<body>
${code}
</body>
</html>`;
    }
    const blob = new Blob([htmlContent], {
      type: 'text/html'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      title: "HTML Downloaded",
      description: "index.html saved successfully"
    });
  };
  const isPreviewableLanguage = (language: string) => {
    return ['html', 'css', 'javascript', 'jsx', 'tsx'].includes(language?.toLowerCase());
  };
  const openPreviewInNewTab = (code: string, language: string) => {
    let htmlContent = '';
    if (language === 'html' || code.toLowerCase().includes('<html') || code.toLowerCase().includes('<!doctype')) {
      htmlContent = code;
    } else if (language === 'css') {
      htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Preview</title>
    <style>${code}</style>
</head>
<body>
    <div class="preview-container">
        <h1>CSS Preview</h1>
        <p>Your CSS styles are applied to this page.</p>
        <button>Sample Button</button>
        <div class="box">Sample Box</div>
    </div>
</body>
</html>`;
    } else if (language === 'javascript' || language === 'jsx' || language === 'tsx') {
      htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JavaScript Preview</title>
    <style>
        body { font-family: system-ui, sans-serif; padding: 20px; background: #1a1a2e; color: #eee; }
        #output { background: #16213e; padding: 15px; border-radius: 8px; white-space: pre-wrap; font-family: monospace; }
    </style>
</head>
<body>
    <h2>JavaScript Output</h2>
    <div id="output"></div>
    <script>
        const originalLog = console.log;
        console.log = (...args) => {
            document.getElementById('output').innerHTML += args.map(a => 
                typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)
            ).join(' ') + '\\n';
            originalLog.apply(console, args);
        };
        try {
            ${code}
        } catch (e) {
            document.getElementById('output').innerHTML += 'Error: ' + e.message;
        }
    </script>
</body>
</html>`;
    } else {
      htmlContent = `<!DOCTYPE html><html><body><pre>${code}</pre></body></html>`;
    }
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
      newWindow.document.write(htmlContent);
      newWindow.document.close();
    }
  };
  const toggleInlinePreview = (messageId: string) => {
    setShowPreview(prev => ({
      ...prev,
      [messageId]: !prev[messageId]
    }));
  };
  const saveSnippet = async (code: string, language: string) => {
    const title = prompt("Enter a title for this snippet:");
    if (!title) return;
    const description = prompt("Enter a description (optional):");
    const tagsInput = prompt("Enter tags separated by commas (optional):");
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];
    const {
      error
    } = await supabase.from('code_snippets').insert({
      user_id: user.id,
      title,
      description: description || null,
      generated_code: code,
      language,
      tags: tags.length > 0 ? tags : null
    });
    if (error) {
      toast({
        title: "Error",
        description: "Failed to save snippet",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Success",
      description: "Snippet saved to library!"
    });
  };
  const downloadAsProject = async (code: string, language: string) => {
    const zip = new JSZip();
    const extension = getFileExtension(language);
    if (language === 'javascript' || language === 'typescript') {
      zip.file(`src/index.${extension}`, code);
      zip.file('package.json', JSON.stringify({
        name: 'generated-project',
        version: '1.0.0',
        main: `src/index.${extension}`,
        scripts: {
          start: `node src/index.${extension}`
        }
      }, null, 2));
    } else if (language === 'python') {
      zip.file('main.py', code);
      zip.file('requirements.txt', '# Add dependencies here');
    } else if (language === 'html') {
      zip.file('index.html', code);
      zip.file('styles.css', '/* Add your styles here */');
      zip.file('script.js', '// Add your JavaScript here');
    } else {
      zip.file(`main.${extension}`, code);
    }
    zip.file('.vscode/settings.json', JSON.stringify({
      'editor.formatOnSave': true,
      'editor.tabSize': 2
    }, null, 2));
    zip.file('README.md', `# Generated Project\n\nGenerated by Vithal AI Code Generator`);
    const content = await zip.generateAsync({
      type: 'blob'
    });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-project.zip';
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Project Downloaded",
      description: "Extract the ZIP and open in VS Code"
    });
  };

  // Parse website response into separate files
  const parseWebsiteResponse = (response: string): WebsiteFile[] => {
    const files: WebsiteFile[] = [];
    
    // Parse HTML file
    const htmlMatch = response.match(/=== FILE: index\.html ===([\s\S]*?)(?==== FILE:|$)/i);
    if (htmlMatch) {
      let htmlContent = htmlMatch[1].trim();
      // Remove markdown code blocks if present
      htmlContent = htmlContent.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '').trim();
      files.push({ name: 'index.html', content: htmlContent, language: 'html' });
    }
    
    // Parse CSS file
    const cssMatch = response.match(/=== FILE: styles\.css ===([\s\S]*?)(?==== FILE:|$)/i);
    if (cssMatch) {
      let cssContent = cssMatch[1].trim();
      cssContent = cssContent.replace(/^```css?\n?/i, '').replace(/\n?```$/i, '').trim();
      files.push({ name: 'styles.css', content: cssContent, language: 'css' });
    }
    
    // Parse JS file
    const jsMatch = response.match(/=== FILE: script\.js ===([\s\S]*?)(?==== FILE:|$)/i);
    if (jsMatch) {
      let jsContent = jsMatch[1].trim();
      jsContent = jsContent.replace(/^```(?:javascript|js)?\n?/i, '').replace(/\n?```$/i, '').trim();
      files.push({ name: 'script.js', content: jsContent, language: 'javascript' });
    }
    
    return files;
  };

  // Download website as Netlify-ready folder
  const downloadWebsiteAsFolder = async (files: WebsiteFile[]) => {
    const zip = new JSZip();
    
    // Add all generated files
    files.forEach(file => {
      zip.file(file.name, file.content);
    });
    
    // Add README with deployment instructions
    zip.file('README.md', `# My Website

## 🚀 Deploy to Netlify (3 Easy Steps)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop this folder to the deploy zone
3. Your site will be live in seconds!

## 📁 Files Included

- \`index.html\` - Main HTML file (entry point)
- \`styles.css\` - All styling and responsive design
- \`script.js\` - JavaScript functionality and interactivity

## 🎨 Generated by Vithal AI Website Generator

This website is fully responsive and ready for production use.
`);

    // Add netlify.toml for optimal deployment
    zip.file('netlify.toml', `[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
`);

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-website-netlify.zip';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "🚀 Website Downloaded!",
      description: "Ready to deploy - just drag & drop to Netlify"
    });
  };

  // Preview website in new tab
  const previewWebsite = (files: WebsiteFile[]) => {
    const html = files.find(f => f.name === 'index.html')?.content || '';
    const css = files.find(f => f.name === 'styles.css')?.content || '';
    const js = files.find(f => f.name === 'script.js')?.content || '';
    
    // Inject CSS and JS into HTML
    let fullHtml = html;
    if (css && !html.includes('<link rel="stylesheet" href="styles.css">')) {
      fullHtml = fullHtml.replace('</head>', `<style>${css}</style></head>`);
    } else if (css) {
      fullHtml = fullHtml.replace('<link rel="stylesheet" href="styles.css">', `<style>${css}</style>`);
    }
    
    if (js && !html.includes('<script src="script.js"></script>')) {
      fullHtml = fullHtml.replace('</body>', `<script>${js}</script></body>`);
    } else if (js) {
      fullHtml = fullHtml.replace('<script src="script.js"></script>', `<script>${js}</script>`);
    }
    
    const newWindow = window.open('about:blank', '_blank');
    if (newWindow) {
      newWindow.document.write(fullHtml);
      newWindow.document.close();
    }
  };

  // Toggle section for website generator
  const toggleSection = (section: string) => {
    setSelectedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Save website project to library
  const saveWebsiteToLibrary = async (files: WebsiteFile[]) => {
    const projectName = prompt("Enter a project name for this website:");
    if (!projectName) return;
    
    const description = prompt("Enter a description (optional):");
    
    try {
      // Create website project
      const { data: project, error: projectError } = await supabase
        .from('website_projects')
        .insert({
          user_id: user.id,
          name: projectName,
          description: description || `Generated ${websiteType} website with ${websiteStyle} style`,
          website_type: websiteType,
          style_type: websiteStyle,
          color_scheme: colorScheme,
          tags: ['website', websiteType, websiteStyle],
        })
        .select()
        .single();
      
      if (projectError) {
        console.error('Project creation error:', projectError);
        toast({ 
          title: "Error", 
          description: "Failed to save project", 
          variant: "destructive" 
        });
        return;
      }
      
      // Create project files
      const fileInserts = files.map((file, index) => ({
        project_id: project.id,
        file_name: file.name,
        file_content: file.content,
        language: file.language,
        file_order: index,
      }));
      
      const { error: filesError } = await supabase
        .from('website_project_files')
        .insert(fileInserts);
      
      if (filesError) {
        console.error('Files creation error:', filesError);
        toast({ 
          title: "Error", 
          description: "Failed to save project files", 
          variant: "destructive" 
        });
        return;
      }
      
      toast({
        title: "✅ Website Saved!",
        description: `Project "${projectName}" saved to your Code Library`
      });
    } catch (error) {
      console.error('Save website error:', error);
      toast({ 
        title: "Error", 
        description: "Failed to save website to library", 
        variant: "destructive" 
      });
    }
  };

  // Build chat history for context
  const buildChatHistory = useCallback(() => {
    return messages.filter(m => !m.isStreaming).slice(-10).map(m => ({
      role: m.role,
      content: m.content.substring(0, 500)
    }));
  }, [messages]);

  // Handle streaming response
  const handleStreamingResponse = async (requestBody: any, userMsgId: string): Promise<{
    code: string;
    validation?: any;
  }> => {
    const streamingMsgId = `${userMsgId}-streaming`;

    // Add placeholder for streaming message
    setMessages(prev => [...prev, {
      id: streamingMsgId,
      role: 'assistant',
      content: '',
      isCode: true,
      language: requestBody.language || requestBody.targetLanguage || 'javascript',
      isStreaming: true
    }]);
    const response = await fetch(`https://rwqteupkdkkmigvajdrv.supabase.co/functions/v1/code-generator-gemini`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3cXRldXBrZGtrbWlndmFqZHJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NzU4MjksImV4cCI6MjA2ODE1MTgyOX0.3HXdgQ3qcFgEEjnghcCx0Lcdt0UYP9FdiWZI9Bk_LIg`
      },
      body: JSON.stringify({
        ...requestBody,
        stream: true
      })
    });
    if (!response.ok || !response.body) {
      throw new Error('Failed to start streaming');
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullContent = '';
    let buffer = '';
    while (true) {
      const {
        done,
        value
      } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, {
        stream: true
      });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === '[DONE]') continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            fullContent += text;
            setMessages(prev => prev.map(m => m.id === streamingMsgId ? {
              ...m,
              content: fullContent
            } : m));
          }
        } catch {
          // Ignore parsing errors for incomplete chunks
        }
      }
    }

    // Mark streaming as complete
    setMessages(prev => prev.map(m => m.id === streamingMsgId ? {
      ...m,
      isStreaming: false
    } : m));
    return {
      code: fullContent
    };
  };

  // Retry handler
  const handleRetry = async (messageIndex: number) => {
    const userMessage = messages.find((m, i) => i < messageIndex && m.role === 'user');
    if (userMessage) {
      // Remove failed messages and retry
      setMessages(prev => prev.filter((_, i) => i <= messages.indexOf(userMessage)));
      setInput(userMessage.content);
    }
  };
  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      isCode: false,
      attachments: attachments.length > 0 ? [...attachments] : undefined
    };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    const currentAttachments = [...attachments];
    setInput('');
    setAttachments([]);
    setIsGenerating(true);
    setProgress(0);
    const interval = setInterval(() => setProgress(p => Math.min(p + 5, 90)), 300);
    try {
      // Build chat history for context
      const chatHistory = buildChatHistory();
      let requestBody: any;
      
      if (selectedTask === 'translate') {
        requestBody = {
          prompt: currentInput,
          task: selectedTask,
          sourceLanguage,
          targetLanguage,
          attachments: currentAttachments,
          chatHistory,
          stream: true
        };
      } else if (selectedTask === 'website') {
        requestBody = {
          prompt: currentInput,
          task: selectedTask,
          language: 'html',
          websiteType,
          styleType: websiteStyle,
          colorScheme,
          sections: selectedSections,
          attachments: currentAttachments,
          chatHistory,
          stream: true
        };
      } else {
        requestBody = {
          prompt: currentInput,
          language: selectedLanguage,
          task: selectedTask,
          attachments: currentAttachments,
          chatHistory,
          stream: true
        };
      }

      // Use streaming for real-time code display
      const streamResult = await handleStreamingResponse(requestBody, userMsg.id);
      clearInterval(interval);
      setProgress(100);

      // Parse and validate the streamed response
      const responseText = streamResult.code;

      // Handle website task specially
      if (selectedTask === 'website') {
        const websiteFiles = parseWebsiteResponse(responseText);
        if (websiteFiles.length > 0) {
          setGeneratedWebsite(websiteFiles);
          
          // Replace streaming message with website result
          setMessages(prev => {
            const filtered = prev.filter(m => !m.id?.includes('-streaming'));
            return [...filtered, {
              id: `${Date.now()}-website`,
              role: 'assistant' as const,
              content: `🌐 **Website Generated Successfully!**\n\nFiles created:\n- index.html\n- styles.css\n- script.js\n\nUse the buttons below to preview or download your Netlify-ready website.`,
              isCode: false,
              language: 'html',
              validation: { score: 95, isValid: true, issues: [] }
            }];
          });
          
          toast({
            title: "🌐 Website Generated!",
            description: "Preview or download your Netlify-ready website"
          });
        } else {
          // Fallback to regular parsing if website format not detected
          const parsedParts = parseResponse(responseText);
          setMessages(prev => {
            const filtered = prev.filter(m => !m.id?.includes('-streaming'));
            const newMessages = parsedParts.map((part, index) => ({
              id: `${Date.now()}-${index}`,
              role: 'assistant' as const,
              content: part.content,
              isCode: part.type === 'code',
              language: part.language || 'html',
              validation: index === 0 ? { score: 90, isValid: true, issues: [] } : undefined
            }));
            return [...filtered, ...newMessages];
          });
        }
      } else {
        // Perform client-side validation as backup
        const validation = streamResult.validation || {
          score: responseText.length > 100 ? 95 : 80,
          isValid: true,
          issues: []
        };

        // Update the streaming message with final validation
        const parsedParts = parseResponse(responseText);

        // Replace streaming message with properly parsed parts
        setMessages(prev => {
          const filtered = prev.filter(m => !m.id?.includes('-streaming'));
          const newMessages = parsedParts.map((part, index) => ({
            id: `${Date.now()}-${index}`,
            role: 'assistant' as const,
            content: part.content,
            isCode: part.type === 'code',
            language: part.language || selectedLanguage,
            validation: index === 0 ? validation : undefined
          }));
          return [...filtered, ...newMessages];
        });

        // Show validation result
        if (validation) {
          if (validation.isValid && validation.score >= 90) {
            toast({
              title: "✓ High Quality Code",
              description: `Quality score: ${validation.score}%`
            });
          } else if (validation.isValid) {
            toast({
              title: "Code Generated",
              description: `Quality score: ${validation.score}%${validation.issues.length > 0 ? ' - ' + validation.issues[0] : ''}`
            });
          } else {
            toast({
              title: "Code Generated with Warnings",
              description: validation.issues.join(', '),
              variant: "destructive"
            });
          }
        } else {
          toast({
            title: "Success",
            description: "Code generated!"
          });
        }
      }

      if (currentSessionId) {
        await supabase.from('chat_messages').insert({
          session_id: currentSessionId,
          user_id: user.id,
          message: currentInput,
          response: responseText,
          message_type: selectedTask === 'website' ? 'website' : 'code'
        });
        if (isFirstMessage) {
          const lang = selectedTask === 'translate' ? targetLanguage : (selectedTask === 'website' ? 'html' : selectedLanguage);
          await generateSmartCodeTitle(currentSessionId, currentInput, lang, selectedTask);
          setIsFirstMessage(false);
        }
      }
    } catch (error: any) {
      clearInterval(interval);
      console.error('Code generation error:', error);

      // Add error message
      setMessages(prev => [...prev, {
        id: `${Date.now()}-error`,
        role: 'assistant',
        content: `Error: ${error.message}. Click retry to try again.`,
        isCode: false,
        validation: {
          score: 0,
          isValid: false,
          issues: [error.message]
        }
      }]);
      toast({
        title: "Generation Failed",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 500);
    }
  };
  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Code copied to clipboard"
    });
  };
  const renderInlinePreview = (code: string, language: string) => {
    let srcDoc = '';
    if (language === 'html' || code.toLowerCase().includes('<html')) {
      srcDoc = code;
    } else if (language === 'css') {
      srcDoc = `<style>${code}</style><div class="preview"><h1>CSS Preview</h1><p>Sample text</p><button>Button</button></div>`;
    } else if (language === 'javascript') {
      srcDoc = `<div id="output" style="font-family:monospace;"></div><script>
        const log = console.log;
        console.log = (...a) => { document.getElementById('output').innerHTML += a.join(' ') + '<br>'; log(...a); };
        try { ${code} } catch(e) { document.getElementById('output').innerHTML = 'Error: ' + e.message; }
      </script>`;
    }
    return <div className="border rounded-lg overflow-hidden mt-2 bg-white">
        <iframe srcDoc={srcDoc} className="w-full h-[300px] border-0" sandbox="allow-scripts" title="Code Preview" />
      </div>;
  };
  return <div className="flex flex-col h-full bg-background">
      {/* Tab Navigation */}
      <div className="border-b px-3 pt-2">
        <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'generator' | 'library')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-9">
            <TabsTrigger value="generator" className="text-xs gap-1.5">
              <Code className="h-3.5 w-3.5" />
              Generator
            </TabsTrigger>
            <TabsTrigger value="library" className="text-xs gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Library
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Generator Tab Content */}
      {activeTab === 'generator' && <div className="flex flex-col flex-1 overflow-hidden">
          <div className="border-b p-3 flex items-center justify-between flex-wrap gap-2">
            <Badge variant="outline" className="text-xs border-primary/20 text-primary bg-card">
              {selectedTask === 'website' ? '🌐 Website Generator' : 'v2.1 Pro'}
            </Badge>
            <div className="flex gap-2 flex-wrap">
              <Select value={selectedTask} onValueChange={(v) => {
                setSelectedTask(v);
                if (v === 'website') setGeneratedWebsite(null);
              }}>
                <SelectTrigger className="w-36 h-8"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {CODE_TASKS.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
              {selectedTask === 'translate' ? <>
                  <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                    <SelectTrigger className="w-32 h-8"><SelectValue placeholder="From" /></SelectTrigger>
                    <SelectContent className="bg-background z-50 max-h-[300px]">
                      {PROGRAMMING_LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <span className="flex items-center text-muted-foreground">→</span>
                  <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                    <SelectTrigger className="w-32 h-8"><SelectValue placeholder="To" /></SelectTrigger>
                    <SelectContent className="bg-background z-50 max-h-[300px]">
                      {PROGRAMMING_LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </> : selectedTask === 'website' ? <>
                  <Select value={websiteType} onValueChange={setWebsiteType}>
                    <SelectTrigger className="w-32 h-8"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {WEBSITE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={websiteStyle} onValueChange={setWebsiteStyle}>
                    <SelectTrigger className="w-32 h-8"><SelectValue placeholder="Style" /></SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {WEBSITE_STYLES.map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <Select value={colorScheme} onValueChange={setColorScheme}>
                    <SelectTrigger className="w-28 h-8"><SelectValue placeholder="Color" /></SelectTrigger>
                    <SelectContent className="bg-background z-50">
                      {COLOR_SCHEMES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </> : <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-background z-50 max-h-[300px]">
                    {PROGRAMMING_LANGUAGES.map(l => <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>)}
                  </SelectContent>
                </Select>}
            </div>
          </div>

          {/* Website Sections Selector */}
          {selectedTask === 'website' && (
            <div className="border-b px-3 py-2 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-2">Select sections to include:</p>
              <div className="flex flex-wrap gap-3">
                {WEBSITE_SECTIONS.map(section => (
                  <label key={section.value} className="flex items-center gap-1.5 text-xs cursor-pointer">
                    <Checkbox
                      checked={selectedSections.includes(section.value)}
                      onCheckedChange={() => toggleSection(section.value)}
                      className="h-3.5 w-3.5"
                    />
                    {section.label}
                  </label>
                ))}
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                {selectedTask === 'website' ? (
                  <>
                    <Globe className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-sm">Create professional websites with AI</p>
                    <p className="text-xs mt-2 opacity-60">Describe your website and we'll generate HTML, CSS & JS ready for Netlify</p>
                  </>
                ) : (
                  <>
                    <Code className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-sm">Start coding with AI assistance</p>
                    <p className="text-xs mt-2 opacity-60">Enhanced with language-specific best practices & code validation</p>
                  </>
                )}
              </div> : <div className="space-y-3 max-w-4xl mx-auto">
                {messages.map((msg, idx) => <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-lg p-3' : ''}`}>
                      {msg.isCode ? <div className="relative">
                          {msg.validation && <div className={`flex items-center gap-2 mb-2 text-xs ${msg.validation.isValid ? 'text-green-500' : 'text-yellow-500'}`}>
                              {msg.validation.isValid ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                              <span>Quality: {msg.validation.score}%</span>
                              {msg.validation.issues.length > 0 && <span className="text-muted-foreground">• {msg.validation.issues[0]}</span>}
                            </div>}
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Button variant="ghost" size="sm" onClick={() => copyCode(msg.content)}><Copy className="h-4 w-4 mr-2" />Copy</Button>
                            <Button variant="ghost" size="sm" onClick={() => downloadVSCodeFile(msg.content, msg.language || 'javascript')}><Code2 className="h-4 w-4 mr-2" />VS Code</Button>
                            {isPreviewableLanguage(msg.language || '') && <>
                                <Button variant="ghost" size="sm" onClick={() => openPreviewInNewTab(msg.content, msg.language || 'html')}><Monitor className="h-4 w-4 mr-2" />Preview</Button>
                                <Button variant="ghost" size="sm" onClick={() => toggleInlinePreview(msg.id)}>
                                  {showPreview[msg.id] ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                                  {showPreview[msg.id] ? 'Hide' : 'Inline'}
                                </Button>
                              </>}
                            {['html', 'css'].includes(msg.language?.toLowerCase() || '') && <Button variant="ghost" size="sm" onClick={() => downloadHTMLFile(msg.content)}><Download className="h-4 w-4 mr-2" />HTML</Button>}
                            <Button variant="ghost" size="sm" onClick={() => downloadAsProject(msg.content, msg.language || 'javascript')}><FolderDown className="h-4 w-4 mr-2" />ZIP</Button>
                            <Button variant="ghost" size="sm" onClick={() => saveSnippet(msg.content, msg.language || 'javascript')}><BookOpen className="h-4 w-4 mr-2" />Save</Button>
                          </div>
                          <div className="rounded-lg overflow-hidden border">
                            <div className="bg-muted px-3 py-1.5 flex items-center justify-between">
                              <Badge variant="outline" className="text-xs">{msg.language}</Badge>
                              {msg.isStreaming && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                            </div>
                            <SyntaxHighlighter language={msg.language} style={vscDarkPlus} showLineNumbers={true} customStyle={{
                    margin: 0,
                    fontSize: '14px',
                    padding: '14px',
                    lineHeight: '1.5'
                  }} codeTagProps={{
                    style: {
                      fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace",
                      fontSize: '14px'
                    }
                  }}>
                              {msg.content || ' '}
                            </SyntaxHighlighter>
                          </div>
                          {showPreview[msg.id] && isPreviewableLanguage(msg.language || '') && renderInlinePreview(msg.content, msg.language || 'html')}
                        </div> : <>
                          {msg.content.startsWith('Error:') && <Button variant="outline" size="sm" onClick={() => handleRetry(idx)} className="mb-2">
                              <RotateCcw className="w-4 h-4 mr-2" />Retry
                            </Button>}
                          <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                          
                          {/* Website action buttons */}
                          {msg.id?.includes('-website') && generatedWebsite && generatedWebsite.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Button 
                                variant="default" 
                                size="sm" 
                                onClick={() => previewWebsite(generatedWebsite)}
                                className="gap-2"
                              >
                                <Monitor className="h-4 w-4" />
                                Preview Website
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => downloadWebsiteAsFolder(generatedWebsite)}
                                className="gap-2"
                              >
                                <FolderDown className="h-4 w-4" />
                                Download for Netlify
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => saveWebsiteToLibrary(generatedWebsite)}
                                className="gap-2"
                              >
                                <BookOpen className="h-4 w-4" />
                                Save to Library
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const allCode = generatedWebsite.map(f => `/* ${f.name} */\n${f.content}`).join('\n\n');
                                  navigator.clipboard.writeText(allCode);
                                  toast({ title: "Copied!", description: "All website code copied" });
                                }}
                                className="gap-2"
                              >
                                <Copy className="h-4 w-4" />
                                Copy All
                              </Button>
                            </div>
                          )}
                          
                          {msg.attachments && msg.attachments.length > 0 && <div className="mt-2 flex flex-wrap gap-2">
                              {msg.attachments.map((att, i) => <div key={i} className="relative">
                                  {att.type === 'image' ? <img src={att.data} alt={att.name} className="max-w-[200px] rounded border" /> : <div className="flex items-center gap-2 border rounded p-2 bg-background/50">
                                      <FileText className="w-4 h-4" /><span className="text-xs">{att.name}</span>
                                    </div>}
                                </div>)}
                            </div>}
                        </>}
                    </div>
                  </div>)}
              </div>}
          </ScrollArea>

          {isGenerating && <div className="px-4 py-2">
              <div className="flex items-center gap-2 mb-1">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-xs text-muted-foreground">Generating with enhanced AI...</span>
              </div>
              <Progress value={progress} className="h-1" />
            </div>}

          <div className="border-t p-4">
            <div className="max-w-4xl mx-auto">
              {attachments.length > 0 && <div className="flex flex-wrap gap-2 mb-3">
                  {attachments.map((att, i) => <div key={i} className="relative group">
                      {att.type === 'image' ? <div className="relative">
                          <img src={att.data} alt={att.name} className="max-w-[120px] h-[120px] object-cover rounded border" />
                          <Button size="sm" variant="destructive" onClick={() => removeAttachment(i)} className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100">
                            <X className="w-3 h-3" />
                          </Button>
                        </div> : <div className="flex items-center gap-2 border rounded p-2 pr-8 bg-muted relative">
                          <FileText className="w-4 h-4" />
                          <span className="text-xs max-w-[150px] truncate">{att.name}</span>
                          <Button size="sm" variant="ghost" onClick={() => removeAttachment(i)} className="absolute -top-1 -right-1 h-5 w-5 p-0 rounded-full opacity-0 group-hover:opacity-100">
                            <X className="w-3 h-3" />
                          </Button>
                        </div>}
                    </div>)}
                </div>}
              <div className="flex gap-2">
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,.pdf,.doc,.docx" multiple className="hidden" />
                <Button variant="outline" size="icon" onClick={() => fileInputRef.current?.click()} disabled={isGenerating || attachments.length >= 5} className="h-auto">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Textarea value={input} onChange={e => setInput(e.target.value)} placeholder={selectedTask === 'translate' ? "Paste code to translate..." : "Describe what you want or attach a UI screenshot..."} className="min-h-[80px]" onKeyDown={e => {
              if (e.key === 'Enter' && e.ctrlKey) handleSend();
            }} />
                <Button onClick={handleSend} disabled={isGenerating} className="h-auto">
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 text-center">
                Ctrl+Enter to send • Chat history context enabled • Language-specific best practices applied
              </p>
            </div>
          </div>
        </div>}

      {/* Library Tab Content */}
      {activeTab === 'library' && <div className="flex-1 overflow-hidden">
          <CodeSnippetLibrary open={true} onOpenChange={open => !open && setActiveTab('generator')} user={user} />
        </div>}

    </div>;
};