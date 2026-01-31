import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, Loader2, X, FolderDown, BookOpen, Monitor, CheckCircle2, 
  Database, Rocket, Link, Copy, ArrowLeft, Sparkles, MessageCircle,
  User, Bot, RefreshCw, AlertCircle, ExternalLink
} from 'lucide-react';
import { SupabaseConnectionModal } from './supabase-connection-modal';
import { useSupabaseConnection } from '@/hooks/useSupabaseConnection';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import JSZip from 'jszip';

const FULLSTACK_TEMPLATES = [
  { value: 'contact-form', label: '📬 Contact Form', description: 'Form with database storage', icon: '📬' },
  { value: 'blog-cms', label: '📝 Blog CMS', description: 'Blog with posts & categories', icon: '📝' },
  { value: 'todo-app', label: '✅ Todo App', description: 'Task management with lists', icon: '✅' },
  { value: 'user-dashboard', label: '👤 Dashboard', description: 'User profile & settings', icon: '👤' },
  { value: 'ecommerce', label: '🛒 E-commerce', description: 'Products, cart & orders', icon: '🛒' },
  { value: 'booking-system', label: '📅 Booking', description: 'Appointment scheduling', icon: '📅' },
];

const STYLE_OPTIONS = [
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'glassmorphism', label: 'Glass' },
  { value: 'dark', label: 'Dark' },
  { value: 'gradient', label: 'Gradient' },
];

interface WebsiteFile {
  name: string;
  content: string;
  language: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  generatedFiles?: WebsiteFile[];
  timestamp: Date;
  isError?: boolean;
}

interface FullstackAppBuilderProps {
  user: SupabaseUser;
  onBack?: () => void;
}

export const FullstackAppBuilder: React.FC<FullstackAppBuilderProps> = ({ user, onBack }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('modern');
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [includeAuth, setIncludeAuth] = useState(false);
  const [autoDeployDb, setAutoDeployDb] = useState(true);
  const [showSupabaseModal, setShowSupabaseModal] = useState(false);
  const [generatedApp, setGeneratedApp] = useState<WebsiteFile[] | null>(null);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  
  // Chat-based editing state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [editInput, setEditInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  
  const { connection: supabaseConnection, isConnected: isSupabaseConnected } = useSupabaseConnection();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Scroll chat to bottom when new messages added
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Update preview when files change
  useEffect(() => {
    if (generatedApp && showLivePreview) {
      updatePreview();
    }
  }, [generatedApp, showLivePreview]);

  const updatePreview = () => {
    if (!generatedApp) return;
    
    const htmlFile = generatedApp.find(f => f.language === 'html');
    const cssFile = generatedApp.find(f => f.language === 'css');
    const jsFile = generatedApp.find(f => f.language === 'javascript');
    
    if (!htmlFile) return;
    
    let html = htmlFile.content;
    if (cssFile) {
      html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
    }
    if (jsFile) {
      html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);
    }
    
    setPreviewHtml(html);
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    const templateData = FULLSTACK_TEMPLATES.find(t => t.value === template);
    if (templateData) {
      setInput(`Create a ${templateData.label.replace(/[📬📝✅👤🛒📅]/g, '').trim()} application`);
    }
  };

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast({ title: "Please describe your app", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 500);

    try {
      // Use the new fullstack-generator edge function
      const { data, error } = await supabase.functions.invoke('fullstack-generator', {
        body: {
          prompt: input,
          appTemplate: selectedTemplate || 'custom',
          websiteStyle: selectedStyle,
          includeAuth,
          supabaseConnected: isSupabaseConnected,
          chatHistory: chatMessages.map(m => ({ role: m.role, content: m.content })),
          existingCode: null,
          isEdit: false
        }
      });

      if (error) throw error;

      clearInterval(interval);
      setProgress(100);

      // Parse the response to extract files
      const responseText = data.code || data.response || '';
      const files = parseFullstackResponse(responseText);
      
      if (files.length === 0) {
        throw new Error('No files generated. Please try again with a more specific description.');
      }

      setGeneratedApp(files);
      setActiveFile(files.length > 0 ? files[0].name : null);

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `✨ I've generated your ${selectedTemplate ? FULLSTACK_TEMPLATES.find(t => t.value === selectedTemplate)?.label || 'app' : 'app'}! It includes ${files.length} files. You can:\n\n• **Preview** - See your app in action\n• **Edit** - Ask me to change colors, text, features\n• **Deploy** - Push the database schema to Supabase\n• **Download** - Get the full project as a ZIP`,
        generatedFiles: files,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);

      // Auto-deploy if connected and enabled
      if (isSupabaseConnected && autoDeployDb && files.length > 0) {
        await handleDeployDatabase(files);
      }

      toast({ title: "✨ Full-Stack App Generated!", description: `${files.length} files created` });
    } catch (error: any) {
      clearInterval(interval);
      
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Generation failed: ${error.message}. Please try again.`,
        timestamp: new Date(),
        isError: true
      };
      setChatMessages(prev => [...prev, errorMessage]);
      
      toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
      setProgress(0);
      setInput('');
    }
  };

  const handleEditApp = async () => {
    if (!editInput.trim() || !generatedApp) {
      toast({ title: "Please describe the changes you want", variant: "destructive" });
      return;
    }

    setIsEditing(true);

    // Add user edit request to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: editInput,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);

    try {
      // Call the generator in EDIT mode with existing code
      const { data, error } = await supabase.functions.invoke('fullstack-generator', {
        body: {
          prompt: editInput,
          appTemplate: selectedTemplate || 'custom',
          websiteStyle: selectedStyle,
          includeAuth,
          supabaseConnected: isSupabaseConnected,
          chatHistory: chatMessages.map(m => ({ role: m.role, content: m.content })),
          existingCode: generatedApp, // Pass existing code for editing
          isEdit: true // Flag for edit mode
        }
      });

      if (error) throw error;

      // Parse the updated response
      const responseText = data.code || data.response || '';
      const files = parseFullstackResponse(responseText);
      
      if (files.length === 0) {
        throw new Error('Failed to apply changes. Please try with a different request.');
      }

      setGeneratedApp(files);

      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `✅ Done! I've applied the changes you requested. Check the preview to see the updates.`,
        generatedFiles: files,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);

      toast({ title: "✅ Changes Applied!", description: "Your app has been updated" });
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `❌ Edit failed: ${error.message}. Please try again with different wording.`,
        timestamp: new Date(),
        isError: true
      };
      setChatMessages(prev => [...prev, errorMessage]);
      
      toast({ title: "Edit Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsEditing(false);
      setEditInput('');
    }
  };

  const parseFullstackResponse = (text: string): WebsiteFile[] => {
    const files: WebsiteFile[] = [];
    const fileRegex = /===\s*FILE:\s*([^\s=]+)\s*===\s*([\s\S]*?)(?====\s*FILE:|$)/gi;
    let match;
    
    while ((match = fileRegex.exec(text)) !== null) {
      const fileName = match[1].trim();
      let content = match[2].trim();
      
      // Remove markdown code blocks
      content = content.replace(/```[\w]*\n?/g, '').replace(/```$/g, '').trim();
      
      const extension = fileName.split('.').pop()?.toLowerCase() || '';
      const languageMap: Record<string, string> = {
        'html': 'html',
        'css': 'css',
        'js': 'javascript',
        'ts': 'typescript',
        'sql': 'sql',
        'md': 'markdown',
      };
      
      files.push({
        name: fileName,
        content,
        language: languageMap[extension] || 'text'
      });
    }
    
    // If no files found with the format, try to extract code blocks
    if (files.length === 0) {
      const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
      let blockMatch;
      let index = 0;
      
      while ((blockMatch = codeBlockRegex.exec(text)) !== null) {
        const lang = blockMatch[1] || 'html';
        const content = blockMatch[2].trim();
        
        const extMap: Record<string, string> = {
          'html': 'html',
          'css': 'css',
          'javascript': 'js',
          'js': 'js',
          'sql': 'sql',
        };
        
        files.push({
          name: lang === 'sql' ? `schema${index > 0 ? index : ''}.sql` : `file${index}.${extMap[lang] || 'txt'}`,
          content,
          language: lang
        });
        index++;
      }
    }

    return files;
  };

  const handleDeployDatabase = async (files: WebsiteFile[]) => {
    if (!isSupabaseConnected || !supabaseConnection) return;

    const sqlFiles = files.filter(f => f.language === 'sql');
    if (sqlFiles.length === 0) {
      toast({ title: "No SQL files", description: "No database schema found to deploy" });
      return;
    }

    setIsDeploying(true);

    try {
      let tablesCreated: string[] = [];
      let policiesApplied = 0;
      let deployMethod = '';
      
      for (const file of sqlFiles) {
        const { data, error } = await supabase.functions.invoke('supabase-admin', {
          body: {
            operation: 'execute_sql',
            userSupabaseUrl: supabaseConnection.url,
            userServiceKey: supabaseConnection.serviceKey,
            accessToken: supabaseConnection.accessToken, // Pass access token for Management API
            sql: file.content
          }
        });

        if (error) throw error;
        
        if (data.executed) {
          tablesCreated = [...tablesCreated, ...(data.tablesCreated || [])];
          policiesApplied += data.policiesApplied || 0;
          deployMethod = data.method || 'auto';
        } else if (data.setupRequired || data.setupInstructions) {
          // No access token - show guidance to user
          const setupMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'assistant',
            content: `⚠️ **Manual Deployment Required**\n\nTo enable automatic deployment, you have two options:\n\n**Option 1: Add Personal Access Token (Recommended)**\n1. Go to [Supabase Account Tokens](https://supabase.com/dashboard/account/tokens)\n2. Create a new token\n3. Add it in the Supabase connection settings (click "Manage")\n\n**Option 2: Run SQL Manually**\n1. Copy the SQL below\n2. Open your [Supabase SQL Editor](${supabaseConnection.url.replace('.co', '.com').replace('https://', 'https://supabase.com/dashboard/project/')}/sql/new)\n3. Paste and run the SQL\n\n---\n\n\`\`\`sql\n${file.content}\n\`\`\``,
            timestamp: new Date()
          };
          setChatMessages(prev => [...prev, setupMessage]);
          
          toast({ 
            title: "⚠️ Manual Setup Required", 
            description: "Add Personal Access Token or run SQL manually. See chat for details.",
          });
          return;
        }
      }

      const successMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `🗄️ **Database Deployed Successfully!**\n\n${tablesCreated.length > 0 ? `• Tables created: ${tablesCreated.join(', ')}\n` : ''}${policiesApplied > 0 ? `• RLS policies applied: ${policiesApplied}\n` : ''}${deployMethod === 'management_api' ? '• Method: Supabase Management API ✨' : ''}`,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, successMessage]);

      toast({ 
        title: "🗄️ Database Deployed!", 
        description: `${tablesCreated.length} tables created on your Supabase` 
      });
    } catch (error: any) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `❌ **Deployment Failed**\n\n${error.message}\n\nPlease try adding a Personal Access Token in the Supabase connection settings, or run the SQL manually.`,
        timestamp: new Date(),
        isError: true
      };
      setChatMessages(prev => [...prev, errorMessage]);
      
      toast({ 
        title: "Deploy Failed", 
        description: error.message || "Failed to deploy database schema",
        variant: "destructive" 
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const previewApp = () => {
    if (!generatedApp) return;
    
    const htmlFile = generatedApp.find(f => f.language === 'html');
    const cssFile = generatedApp.find(f => f.language === 'css');
    const jsFile = generatedApp.find(f => f.language === 'javascript');
    
    if (!htmlFile) {
      toast({ title: "No HTML file found", variant: "destructive" });
      return;
    }
    
    let html = htmlFile.content;
    if (cssFile) {
      html = html.replace('</head>', `<style>${cssFile.content}</style></head>`);
    }
    if (jsFile) {
      html = html.replace('</body>', `<script>${jsFile.content}</script></body>`);
    }
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const downloadProject = async () => {
    if (!generatedApp) return;

    try {
      const zip = new JSZip();
      const frontend = zip.folder('frontend');
      const database = zip.folder('database');
      
      generatedApp.forEach(file => {
        if (file.language === 'sql') {
          database?.file(file.name.replace('database/', ''), file.content);
        } else {
          frontend?.file(file.name.replace('frontend/', ''), file.content);
        }
      });
      
      // Add netlify.toml
      frontend?.file('netlify.toml', `[build]
  publish = "/"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
`);
      
      // Add .env.example
      zip.file('.env.example', `# Replace with your Supabase credentials
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
`);
      
      // Add README
      const template = FULLSTACK_TEMPLATES.find(t => t.value === selectedTemplate);
      zip.file('README.md', `# ${template?.label || 'Full-Stack App'}

${template?.description || 'Generated by Vithal AI'}

## Setup Instructions

### 1. Database Setup
1. Create a Supabase project at https://supabase.com
2. Go to SQL Editor
3. Run the SQL files in the \`database/\` folder in order

### 2. Frontend Setup
1. Update the Supabase credentials in the frontend files
2. Deploy the \`frontend/\` folder to Netlify:
   - Go to https://app.netlify.com/drop
   - Drag and drop the \`frontend\` folder
   - Your app will be live!

## Files Included
${generatedApp.map(f => `- ${f.name}`).join('\n')}

---
Generated by Vithal AI Full-Stack App Builder
`);
      
      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${selectedTemplate || 'fullstack-app'}-project.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({ title: "Downloaded!", description: "Full-stack project ZIP downloaded" });
    } catch (error) {
      toast({ title: "Download failed", variant: "destructive" });
    }
  };

  const saveToLibrary = async () => {
    if (!generatedApp) return;

    try {
      const template = FULLSTACK_TEMPLATES.find(t => t.value === selectedTemplate);
      const projectName = `${template?.label || 'App'} - ${new Date().toLocaleDateString()}`;
      
      // Save as website project
      const { data: project, error: projectError } = await supabase
        .from('website_projects')
        .insert({
          user_id: user.id,
          name: projectName,
          description: input || chatMessages[0]?.content || '',
          website_type: selectedTemplate,
          style_type: selectedStyle,
          tags: ['fullstack', selectedTemplate || 'app']
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Save files
      for (const file of generatedApp) {
        await supabase.from('website_project_files').insert({
          project_id: project.id,
          file_name: file.name,
          file_content: file.content,
          language: file.language
        });
      }

      toast({ title: "Saved!", description: `${projectName} saved to library` });
    } catch (error: any) {
      toast({ title: "Save failed", description: error.message, variant: "destructive" });
    }
  };

  const copyAllCode = () => {
    if (!generatedApp) return;
    const allCode = generatedApp.map(f => `/* === ${f.name} === */\n${f.content}`).join('\n\n');
    navigator.clipboard.writeText(allCode);
    toast({ title: "Copied!", description: "All code copied to clipboard" });
  };

  const startNewApp = () => {
    setGeneratedApp(null);
    setChatMessages([]);
    setSelectedTemplate(null);
    setInput('');
    setEditInput('');
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b px-4 py-3 flex items-center justify-between bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-primary/80">
              <Rocket className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">Full-Stack App Builder</h1>
              <p className="text-xs text-muted-foreground">Build & edit apps with chat</p>
            </div>
          </div>
        </div>
        
        {/* Supabase Connection Status */}
        <div className="flex items-center gap-2">
          {generatedApp && (
            <Button variant="outline" size="sm" onClick={startNewApp} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              New App
            </Button>
          )}
          {isSupabaseConnected ? (
            <Badge variant="default" className="gap-1.5 bg-green-500/20 text-green-500 border-green-500/30">
              <CheckCircle2 className="h-3 w-3" />
              {supabaseConnection?.projectName || 'Connected'}
            </Badge>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowSupabaseModal(true)} className="gap-2">
              <Link className="h-4 w-4" />
              Connect Supabase
            </Button>
          )}
          {isSupabaseConnected && (
            <Button variant="ghost" size="sm" onClick={() => setShowSupabaseModal(true)}>
              Manage
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chat & Template Selection */}
        <div className="w-1/2 border-r flex flex-col">
          {!generatedApp ? (
            // Initial Generation View
            <ScrollArea className="flex-1 p-4">
              {/* Template Grid */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Choose a Template (Optional)
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {FULLSTACK_TEMPLATES.map(template => (
                    <Card 
                      key={template.value}
                      className={`cursor-pointer transition-all hover:border-primary/50 ${
                        selectedTemplate === template.value 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : ''
                      }`}
                      onClick={() => handleTemplateSelect(template.value)}
                    >
                      <CardHeader className="p-3 pb-1">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <span className="text-lg">{template.icon}</span>
                          {template.label.replace(/[📬📝✅👤🛒📅]/g, '').trim()}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-3 pt-0">
                        <CardDescription className="text-xs">{template.description}</CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Style Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Style</h3>
                <div className="flex flex-wrap gap-2">
                  {STYLE_OPTIONS.map(style => (
                    <Badge 
                      key={style.value}
                      variant={selectedStyle === style.value ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setSelectedStyle(style.value)}
                    >
                      {style.label}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="mb-6 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <Checkbox 
                    checked={includeAuth} 
                    onCheckedChange={(checked) => setIncludeAuth(!!checked)} 
                  />
                  Include User Authentication
                </label>
                {isSupabaseConnected && (
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <Checkbox 
                      checked={autoDeployDb} 
                      onCheckedChange={(checked) => setAutoDeployDb(!!checked)} 
                    />
                    Auto-deploy Database Schema
                  </label>
                )}
              </div>

              {/* Description Input */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Describe Your App</h3>
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Build a lead generation app with email capture, admin dashboard, and analytics..."
                  className="min-h-[120px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Tip: Be specific about features you need. You can also skip templates and describe any custom app!
                </p>
              </div>
            </ScrollArea>
          ) : (
            // Chat-Based Editing View
            <div className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
                <div className="space-y-4">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                      {msg.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div className={`max-w-[80%] ${
                        msg.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : msg.isError 
                            ? 'bg-destructive/10 border border-destructive/30'
                            : 'bg-muted'
                      } rounded-lg p-3`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        {msg.generatedFiles && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {msg.generatedFiles.map(f => (
                              <Badge key={f.name} variant="secondary" className="text-xs">
                                {f.name}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <span className="text-[10px] opacity-60 mt-1 block">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isEditing && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">Applying changes...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              {/* Edit Input */}
              <div className="border-t p-3 bg-muted/30">
                <div className="flex gap-2">
                  <Input
                    value={editInput}
                    onChange={(e) => setEditInput(e.target.value)}
                    placeholder="Change the header color to blue..."
                    className="flex-1"
                    disabled={isEditing}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleEditApp();
                      }
                    }}
                  />
                  <Button 
                    onClick={handleEditApp}
                    disabled={isEditing || !editInput.trim()}
                    size="icon"
                  >
                    {isEditing ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Ask me to change colors, text, layout, features, or add new functionality
                </p>
              </div>
            </div>
          )}

          {/* Generate Button (only for initial) */}
          {!generatedApp && (
            <div className="p-4 border-t">
              {isGenerating && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Generating your app...</span>
                  </div>
                  <Progress value={progress} className="h-1.5" />
                </div>
              )}
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !input.trim()}
                className="w-full gap-2"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Rocket className="h-4 w-4" />
                    Generate Full-Stack App
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Right Panel - Generated Code & Preview */}
        <div className="w-1/2 flex flex-col">
          {generatedApp ? (
            <>
              {/* File Tabs */}
              <div className="border-b px-2 py-1 flex items-center gap-1 overflow-x-auto bg-muted/30">
                {generatedApp.map(file => (
                  <Button
                    key={file.name}
                    variant={activeFile === file.name ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setActiveFile(file.name);
                      setShowLivePreview(false);
                    }}
                    className="text-xs shrink-0"
                  >
                    {file.name.replace('frontend/', '').replace('database/', '')}
                  </Button>
                ))}
                <div className="flex-1" />
                <Button
                  variant={showLivePreview ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setShowLivePreview(!showLivePreview);
                    if (!showLivePreview) updatePreview();
                  }}
                  className="text-xs shrink-0 gap-1"
                >
                  <Monitor className="h-3 w-3" />
                  Live Preview
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="border-b p-3 flex flex-wrap gap-2 bg-muted/20">
                <Button variant="default" size="sm" onClick={previewApp} className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Open Preview
                </Button>
                <Button variant="outline" size="sm" onClick={downloadProject} className="gap-2">
                  <FolderDown className="h-4 w-4" />
                  Download ZIP
                </Button>
                <Button variant="outline" size="sm" onClick={saveToLibrary} className="gap-2">
                  <BookOpen className="h-4 w-4" />
                  Save
                </Button>
                {isSupabaseConnected && (
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => handleDeployDatabase(generatedApp)}
                    disabled={isDeploying}
                    className="gap-2"
                  >
                    {isDeploying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Database className="h-4 w-4" />
                    )}
                    Deploy DB
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={copyAllCode} className="gap-2">
                  <Copy className="h-4 w-4" />
                  Copy All
                </Button>
              </div>

              {/* Code Viewer or Live Preview */}
              {showLivePreview ? (
                <div className="flex-1 bg-background">
                  <iframe
                    ref={iframeRef}
                    srcDoc={previewHtml}
                    className="w-full h-full border-0"
                    title="Live Preview"
                    sandbox="allow-scripts"
                  />
                </div>
              ) : (
                <ScrollArea className="flex-1" ref={scrollRef}>
                  {activeFile && generatedApp.find(f => f.name === activeFile) && (
                    <div className="p-4">
                      <SyntaxHighlighter
                        language={generatedApp.find(f => f.name === activeFile)?.language || 'text'}
                        style={vscDarkPlus}
                        showLineNumbers
                        customStyle={{
                          margin: 0,
                          borderRadius: '0.5rem',
                          fontSize: '13px'
                        }}
                      >
                        {generatedApp.find(f => f.name === activeFile)?.content || ''}
                      </SyntaxHighlighter>
                    </div>
                  )}
                </ScrollArea>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8">
              <div>
                <Rocket className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">Build Your App</h3>
                <p className="text-sm max-w-sm">
                  Describe any app you want to build, or select a template to get started. 
                  After generation, you can chat with me to make changes!
                </p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  <Badge variant="outline">Chat-based editing</Badge>
                  <Badge variant="outline">Live preview</Badge>
                  <Badge variant="outline">Database deploy</Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Supabase Connection Modal */}
      <SupabaseConnectionModal
        open={showSupabaseModal}
        onOpenChange={setShowSupabaseModal}
      />
    </div>
  );
};
