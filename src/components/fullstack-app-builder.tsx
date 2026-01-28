import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, Loader2, X, FolderDown, BookOpen, Monitor, CheckCircle2, 
  Database, Rocket, Link, Copy, ArrowLeft, Sparkles
} from 'lucide-react';
import { SupabaseConnectionModal } from './supabase-connection-modal';
import { useSupabaseConnection } from '@/hooks/useSupabaseConnection';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { User } from '@supabase/supabase-js';
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

interface FullstackAppBuilderProps {
  user: User;
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
  
  const { connection: supabaseConnection, isConnected: isSupabaseConnected } = useSupabaseConnection();
  const { toast } = useToast();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    const templateData = FULLSTACK_TEMPLATES.find(t => t.value === template);
    if (templateData) {
      setInput(`Create a ${templateData.label.replace(/[📬📝✅👤🛒📅]/g, '').trim()} application`);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate || !input.trim()) {
      toast({ title: "Please select a template and describe your app", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setGeneratedApp(null);

    const interval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 15, 90));
    }, 500);

    try {
      const templateInfo = FULLSTACK_TEMPLATES.find(t => t.value === selectedTemplate);
      
      const { data, error } = await supabase.functions.invoke('code-generator-gemini', {
        body: {
          prompt: input,
          task: 'fullstack-app',
          language: 'html',
          appTemplate: selectedTemplate,
          websiteStyle: selectedStyle,
          includeAuth,
          supabaseConnected: isSupabaseConnected,
        }
      });

      if (error) throw error;

      clearInterval(interval);
      setProgress(100);

      // Parse the response to extract files
      const responseText = data.code || data.response || '';
      const files = parseFullstackResponse(responseText);
      
      setGeneratedApp(files);
      setActiveFile(files.length > 0 ? files[0].name : null);

      // Auto-deploy if connected and enabled
      if (isSupabaseConnected && autoDeployDb && files.length > 0) {
        await handleDeployDatabase(files);
      }

      toast({ title: "✨ Full-Stack App Generated!", description: `${files.length} files created` });
    } catch (error: any) {
      clearInterval(interval);
      toast({ title: "Generation Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsGenerating(false);
      setProgress(0);
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
      for (const file of sqlFiles) {
        const { data, error } = await supabase.functions.invoke('supabase-admin', {
          body: {
            operation: 'execute_sql',
            userSupabaseUrl: supabaseConnection.url,
            userServiceKey: supabaseConnection.serviceKey,
            sql: file.content
          }
        });

        if (error) throw error;
      }

      toast({ 
        title: "🗄️ Database Deployed!", 
        description: `${sqlFiles.length} SQL file(s) executed on your Supabase` 
      });
    } catch (error: any) {
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
          database?.file(file.name, file.content);
        } else {
          frontend?.file(file.name, file.content);
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
          description: input,
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
              <p className="text-xs text-muted-foreground">Build apps with database & authentication</p>
            </div>
          </div>
        </div>
        
        {/* Supabase Connection Status */}
        <div className="flex items-center gap-2">
          {isSupabaseConnected ? (
            <Badge variant="default" className="gap-1.5 bg-green-500/20 text-green-500 border-green-500/30">
              <CheckCircle2 className="h-3 w-3" />
              Connected
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
        {/* Left Panel - Template Selection & Input */}
        <div className="w-1/2 border-r flex flex-col">
          <ScrollArea className="flex-1 p-4">
            {/* Template Grid */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Choose a Template
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
                placeholder="Describe the features and functionality you need..."
                className="min-h-[100px]"
              />
            </div>
          </ScrollArea>

          {/* Generate Button */}
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
              disabled={isGenerating || !selectedTemplate}
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
        </div>

        {/* Right Panel - Generated Code & Actions */}
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
                    onClick={() => setActiveFile(file.name)}
                    className="text-xs shrink-0"
                  >
                    {file.name}
                  </Button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="border-b p-3 flex flex-wrap gap-2 bg-muted/20">
                <Button variant="default" size="sm" onClick={previewApp} className="gap-2">
                  <Monitor className="h-4 w-4" />
                  Preview
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

              {/* Code Viewer */}
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
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8">
              <div>
                <Rocket className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium mb-2">Build Your App</h3>
                <p className="text-sm max-w-sm">
                  Select a template, describe your requirements, and generate a complete 
                  full-stack application with frontend, database schema, and authentication.
                </p>
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
