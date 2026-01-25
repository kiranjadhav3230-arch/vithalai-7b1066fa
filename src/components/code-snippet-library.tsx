import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ResizablePanelGroup, 
  ResizablePanel, 
  ResizableHandle 
} from '@/components/ui/resizable';
import { TooltipProvider } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import type { User } from '@supabase/supabase-js';
import { useCodeExecution } from '@/hooks/useCodeExecution';
import { useEditorSettings } from '@/hooks/useEditorSettings';
import { useInputDetection } from '@/hooks/useInputDetection';
import {
  ActivityBar,
  ExplorerSidebar,
  EditorTabs,
  CodeEditorPane,
  TerminalPanel,
  StatusBar,
  SearchPanel,
  TagsPanel,
  SettingsPanel,
  WebsiteProjectsPanel,
  type ActivityView,
  type WebsiteProject,
  type WebsiteProjectFile,
} from '@/components/code-library';
import { PublishNetlifyModal } from '@/components/publish-netlify-modal';
import JSZip from 'jszip';

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

interface OpenTab {
  id: string;
  title: string;
  language: string;
  isModified: boolean;
  code: string;
  originalCode: string;
}

export const CodeSnippetLibrary: React.FC<CodeSnippetLibraryProps> = ({ open, onOpenChange, user }) => {
  const [snippets, setSnippets] = useState<CodeSnippet[]>([]);
  const [filteredSnippets, setFilteredSnippets] = useState<CodeSnippet[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSnippetId, setSelectedSnippetId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActivityView>('files');
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [terminalCollapsed, setTerminalCollapsed] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [stdinInput, setStdinInput] = useState('');
  
  // Website projects state
  const [websiteProjects, setWebsiteProjects] = useState<WebsiteProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  
  // Publish modal state
  const [publishModalOpen, setPublishModalOpen] = useState(false);
  const [projectToPublish, setProjectToPublish] = useState<WebsiteProject | null>(null);
  
  const { toast } = useToast();
  const { executeCode, isExecuting, result, clearResult, isExecutable } = useCodeExecution();
  const { settings, updateSetting, resetSettings } = useEditorSettings();

  // Get current active tab data
  const activeTab = openTabs.find(t => t.id === activeTabId);
  const currentCode = activeTab?.code || '';
  const currentLanguage = activeTab?.language || '';
  const currentTitle = activeTab?.title || '';
  const isCurrentModified = activeTab?.isModified || false;

  // Detect input functions in current code
  const inputDetection = useInputDetection(currentCode, currentLanguage);

  // Load snippets and website projects when opened
  useEffect(() => {
    if (open) {
      loadSnippets();
      loadWebsiteProjects();
    }
  }, [open]);

  // Filter snippets when search changes
  useEffect(() => {
    filterSnippets();
  }, [searchQuery, snippets]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+B: Toggle sidebar
      if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        setSidebarCollapsed(prev => !prev);
      }
      // Ctrl+J: Toggle terminal
      if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        setTerminalCollapsed(prev => !prev);
      }
      // Escape: Close library
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
      // F5: Run code
      if (e.key === 'F5' && activeTab && isExecutable(activeTab.language)) {
        e.preventDefault();
        handleRunCode();
      }
      // Ctrl+S: Save current tab
      if (e.ctrlKey && e.key === 's' && activeTab?.isModified) {
        e.preventDefault();
        handleSave();
      }
      // Ctrl+W: Close current tab
      if (e.ctrlKey && e.key === 'w' && activeTabId) {
        e.preventDefault();
        handleTabClose(activeTabId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, activeTab, activeTabId]);

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
  };

  const loadWebsiteProjects = async () => {
    // Load projects
    const { data: projectsData, error: projectsError } = await supabase
      .from('website_projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (projectsError) {
      console.error('Error loading website projects:', projectsError);
      return;
    }

    // Load files for each project
    const projectsWithFiles: WebsiteProject[] = [];
    for (const project of projectsData || []) {
      const { data: filesData } = await supabase
        .from('website_project_files')
        .select('*')
        .eq('project_id', project.id)
        .order('file_order', { ascending: true });
      
      projectsWithFiles.push({
        ...project,
        is_favorite: project.is_favorite || false,
        files: filesData || [],
      });
    }

    setWebsiteProjects(projectsWithFiles);
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

    setFilteredSnippets(filtered);
  };

  const handleSelectSnippet = (snippet: CodeSnippet) => {
    setSelectedSnippetId(snippet.id);
    
    // Check if tab already exists
    const existingTab = openTabs.find(t => t.id === snippet.id);
    if (existingTab) {
      setActiveTabId(snippet.id);
      return;
    }

    // Add new tab
    const newTab: OpenTab = {
      id: snippet.id,
      title: snippet.title,
      language: snippet.language,
      isModified: false,
      code: snippet.generated_code,
      originalCode: snippet.generated_code,
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTabId(snippet.id);
    setIsEditing(true);
  };

  const handleTabSelect = (tabId: string) => {
    setActiveTabId(tabId);
    setSelectedSnippetId(tabId);
  };

  const handleTabClose = (tabId: string) => {
    const tab = openTabs.find(t => t.id === tabId);
    if (tab?.isModified) {
      const confirmClose = window.confirm('You have unsaved changes. Close anyway?');
      if (!confirmClose) return;
    }

    setOpenTabs(prev => prev.filter(t => t.id !== tabId));
    
    if (activeTabId === tabId) {
      const remainingTabs = openTabs.filter(t => t.id !== tabId);
      setActiveTabId(remainingTabs.length > 0 ? remainingTabs[remainingTabs.length - 1].id : null);
    }
  };

  const handleCodeChange = (newCode: string) => {
    if (!activeTabId) return;

    setOpenTabs(prev => prev.map(tab => {
      if (tab.id === activeTabId) {
        return {
          ...tab,
          code: newCode,
          isModified: newCode !== tab.originalCode,
        };
      }
      return tab;
    }));
  };

  const handleSave = async () => {
    if (!activeTab || !activeTab.isModified) return;

    // Check if this is a website project file (ID format: project-{projectId}-{fileId})
    const isProjectFile = activeTab.id.startsWith('project-');
    
    if (isProjectFile) {
      // Extract file ID from tab ID: project-{projectId}-{fileId}
      // Format: "project-" (8 chars) + projectId (36 chars UUID) + "-" (1 char) + fileId (36 chars UUID)
      // Total prefix before fileId: 8 + 36 + 1 = 45 chars
      const fileId = activeTab.id.substring(45); // Extract the last 36 chars (file UUID)
      
      const { error } = await supabase
        .from('website_project_files')
        .update({ 
          file_content: activeTab.code,
          updated_at: new Date().toISOString()
        })
        .eq('id', fileId);

      if (error) {
        toast({ title: "Error", description: "Failed to save project file", variant: "destructive" });
        return;
      }

      // Update tab state
      setOpenTabs(prev => prev.map(tab => {
        if (tab.id === activeTab.id) {
          return { ...tab, isModified: false, originalCode: tab.code };
        }
        return tab;
      }));

      // Update website projects state
      setWebsiteProjects(prev => prev.map(project => ({
        ...project,
        files: project.files.map(file => 
          file.id === fileId ? { ...file, file_content: activeTab.code } : file
        )
      })));

      sonnerToast.success('Project file saved successfully');
    } else {
      // Regular code snippet save
      const { error } = await supabase
        .from('code_snippets')
        .update({ generated_code: activeTab.code })
        .eq('id', activeTab.id);

      if (error) {
        toast({ title: "Error", description: "Failed to save changes", variant: "destructive" });
        return;
      }

      // Update tab state
      setOpenTabs(prev => prev.map(tab => {
        if (tab.id === activeTab.id) {
          return { ...tab, isModified: false, originalCode: tab.code };
        }
        return tab;
      }));

      // Update snippets list
      setSnippets(prev => prev.map(s => 
        s.id === activeTab.id ? { ...s, generated_code: activeTab.code } : s
      ));

      sonnerToast.success('Code saved successfully');
    }
  };

  const handleToggleFavorite = async (id: string, isFavorite: boolean) => {
    const { error } = await supabase
      .from('code_snippets')
      .update({ is_favorite: isFavorite })
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: "Failed to update favorite", variant: "destructive" });
      return;
    }

    setSnippets(prev => prev.map(s => s.id === id ? { ...s, is_favorite: isFavorite } : s));
    sonnerToast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleDeleteSnippet = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this snippet?');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('code_snippets')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete snippet", variant: "destructive" });
      return;
    }

    setSnippets(prev => prev.filter(s => s.id !== id));
    handleTabClose(id);
    sonnerToast.success('Snippet deleted');
  };

  const handleCopyCode = async (code: string) => {
    await navigator.clipboard.writeText(code);
    sonnerToast.success('Code copied to clipboard');
  };

  const handleRunCode = () => {
    if (activeTab && isExecutable(activeTab.language)) {
      executeCode(activeTab.code, activeTab.language, stdinInput);
      setTerminalCollapsed(false);
    }
  };

  const handleCreateSnippet = async (name: string, language: string) => {
    const { data, error } = await supabase
      .from('code_snippets')
      .insert({
        user_id: user.id,
        title: name,
        generated_code: `// ${name}\n// Write your ${language} code here\n`,
        language: language,
        tags: [],
        is_favorite: false,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to create snippet", variant: "destructive" });
      return;
    }

    // Add to snippets list
    setSnippets(prev => [data, ...prev]);
    
    // Open the new snippet in a tab
    handleSelectSnippet(data);
    
    sonnerToast.success('New snippet created');
  };

  // Website project handlers
  const handleSelectProject = (project: WebsiteProject) => {
    setSelectedProjectId(project.id);
    setSelectedFileId(null);
    setSelectedSnippetId(null);
  };

  const handleSelectProjectFile = (project: WebsiteProject, file: WebsiteProjectFile) => {
    setSelectedProjectId(project.id);
    setSelectedFileId(file.id);
    setSelectedSnippetId(null);

    // Check if tab already exists
    const tabId = `project-${project.id}-${file.id}`;
    const existingTab = openTabs.find(t => t.id === tabId);
    if (existingTab) {
      setActiveTabId(tabId);
      return;
    }

    // Add new tab
    const newTab: OpenTab = {
      id: tabId,
      title: `${project.name} / ${file.file_name}`,
      language: file.language,
      isModified: false,
      code: file.file_content,
      originalCode: file.file_content,
    };

    setOpenTabs(prev => [...prev, newTab]);
    setActiveTabId(tabId);
    setIsEditing(true);
  };

  const handleToggleProjectFavorite = async (id: string, isFavorite: boolean) => {
    const { error } = await supabase
      .from('website_projects')
      .update({ is_favorite: isFavorite })
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: "Failed to update favorite", variant: "destructive" });
      return;
    }

    setWebsiteProjects(prev => prev.map(p => p.id === id ? { ...p, is_favorite: isFavorite } : p));
    sonnerToast.success(isFavorite ? 'Added to favorites' : 'Removed from favorites');
  };

  const handleDeleteProject = async (id: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this website project? This will delete all files in the project.');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('website_projects')
      .delete()
      .eq('id', id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete project", variant: "destructive" });
      return;
    }

    setWebsiteProjects(prev => prev.filter(p => p.id !== id));
    // Close any open tabs for this project
    setOpenTabs(prev => prev.filter(t => !t.id.startsWith(`project-${id}-`)));
    sonnerToast.success('Project deleted');
  };

  const handlePreviewProject = (project: WebsiteProject) => {
    const html = project.files.find(f => f.file_name === 'index.html')?.file_content || '';
    const css = project.files.find(f => f.file_name === 'styles.css')?.file_content || '';
    const js = project.files.find(f => f.file_name === 'script.js')?.file_content || '';

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

  const handleDownloadProject = async (project: WebsiteProject) => {
    const zip = new JSZip();

    project.files.forEach(file => {
      zip.file(file.file_name, file.file_content);
    });

    zip.file('README.md', `# ${project.name}

## 🚀 Deploy to Netlify (3 Easy Steps)

1. Go to [netlify.com](https://netlify.com)
2. Drag and drop this folder to the deploy zone
3. Your site will be live in seconds!

## 🎨 Generated by Vithal AI Website Generator
`);

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
    a.download = `${project.name.toLowerCase().replace(/\s+/g, '-')}-netlify.zip`;
    a.click();
    URL.revokeObjectURL(url);

    sonnerToast.success('Website downloaded for Netlify');
  };

  const handlePublishProject = (project: WebsiteProject) => {
    setProjectToPublish(project);
    setPublishModalOpen(true);
  };

  const handleClose = () => {
    // Check for unsaved changes
    const hasUnsaved = openTabs.some(t => t.isModified);
    if (hasUnsaved) {
      const confirmClose = window.confirm('You have unsaved changes. Close anyway?');
      if (!confirmClose) return;
    }
    onOpenChange(false);
  };

  if (!open) return null;

  const lineCount = currentCode.split('\n').length;
  const canRun = activeTab ? isExecutable(activeTab.language) : false;

  return (
    <TooltipProvider>
      <div className="fixed inset-0 z-50 bg-[#1e1e1e] flex flex-col overflow-hidden">
        <div className="flex flex-1 min-h-0">
          {/* Activity Bar */}
          <ActivityBar
            activeView={activeView}
            onViewChange={setActiveView}
            onClose={handleClose}
          />

          {/* Main Content */}
          <ResizablePanelGroup direction="horizontal" className="flex-1">
            {/* Sidebar - Changes based on activeView */}
            {!sidebarCollapsed && (
              <>
                <ResizablePanel defaultSize={20} minSize={15} maxSize={35}>
                  {activeView === 'files' && (
                    <ExplorerSidebar
                      snippets={filteredSnippets.map(s => ({
                        id: s.id,
                        title: s.title,
                        generated_code: s.generated_code,
                        language: s.language,
                        tags: s.tags || [],
                        is_favorite: s.is_favorite || false,
                        created_at: s.created_at,
                      }))}
                      selectedSnippetId={selectedSnippetId}
                      searchQuery={searchQuery}
                      onSearchChange={setSearchQuery}
                      onSelectSnippet={(snippet) => {
                        const fullSnippet = snippets.find(s => s.id === snippet.id);
                        if (fullSnippet) handleSelectSnippet(fullSnippet);
                      }}
                      onToggleFavorite={handleToggleFavorite}
                      onDeleteSnippet={handleDeleteSnippet}
                      onCopyCode={handleCopyCode}
                      onCreateSnippet={handleCreateSnippet}
                    />
                  )}
                  {activeView === 'websites' && (
                    <WebsiteProjectsPanel
                      projects={websiteProjects}
                      selectedProjectId={selectedProjectId}
                      selectedFileId={selectedFileId}
                      onSelectProject={handleSelectProject}
                      onSelectFile={handleSelectProjectFile}
                      onToggleFavorite={handleToggleProjectFavorite}
                      onDeleteProject={handleDeleteProject}
                      onPreviewProject={handlePreviewProject}
                      onDownloadProject={handleDownloadProject}
                      onPublishProject={handlePublishProject}
                    />
                  )}
                  {activeView === 'search' && (
                    <SearchPanel
                      snippets={snippets.map(s => ({
                        id: s.id,
                        title: s.title,
                        generated_code: s.generated_code,
                        language: s.language,
                      }))}
                      onSelectResult={(snippetId, lineNumber) => {
                        const snippet = snippets.find(s => s.id === snippetId);
                        if (snippet) {
                          handleSelectSnippet(snippet);
                        }
                      }}
                    />
                  )}
                  {activeView === 'tags' && (
                    <TagsPanel
                      snippets={snippets.map(s => ({
                        id: s.id,
                        title: s.title,
                        language: s.language,
                        tags: s.tags || [],
                      }))}
                      onSelectSnippet={(snippetId) => {
                        const snippet = snippets.find(s => s.id === snippetId);
                        if (snippet) {
                          handleSelectSnippet(snippet);
                        }
                      }}
                    />
                  )}
                  {activeView === 'settings' && (
                    <SettingsPanel
                      settings={settings}
                      onUpdateSetting={updateSetting}
                      onReset={resetSettings}
                    />
                  )}
                </ResizablePanel>
                <ResizableHandle className="w-1 bg-[#3c3c3c] hover:bg-[#007acc] transition-colors" />
              </>
            )}

            {/* Editor Area */}
            <ResizablePanel defaultSize={80}>
              <ResizablePanelGroup direction="vertical">
                {/* Editor */}
                <ResizablePanel defaultSize={terminalCollapsed ? 100 : 70}>
                  <div className="h-full flex flex-col bg-[#1e1e1e]">
                    {/* Tabs */}
                    <EditorTabs
                      tabs={openTabs}
                      activeTabId={activeTabId}
                      onTabSelect={handleTabSelect}
                      onTabClose={handleTabClose}
                    />

                    {/* Editor Pane */}
                    <CodeEditorPane
                      code={currentCode}
                      language={currentLanguage}
                      title={currentTitle}
                      isEditing={isEditing}
                      onCodeChange={handleCodeChange}
                      onSave={handleSave}
                    />
                  </div>
                </ResizablePanel>

                {/* Terminal Panel */}
                {!terminalCollapsed && (
                  <>
                    <ResizableHandle className="h-1 bg-[#3c3c3c] hover:bg-[#007acc] transition-colors" />
                    <ResizablePanel defaultSize={30} minSize={15} maxSize={50}>
                      <TerminalPanel
                        result={result}
                        isExecuting={isExecuting}
                        language={currentLanguage}
                        onRun={handleRunCode}
                        onClear={clearResult}
                        isCollapsed={false}
                        onToggleCollapse={() => setTerminalCollapsed(true)}
                        canRun={canRun}
                        stdin={stdinInput}
                        onStdinChange={setStdinInput}
                        inputDetection={inputDetection}
                      />
                    </ResizablePanel>
                  </>
                )}
              </ResizablePanelGroup>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Status Bar */}
        <StatusBar
          language={currentLanguage || 'plaintext'}
          lineCount={lineCount}
          isModified={isCurrentModified}
          code={currentCode}
          onSave={handleSave}
          title={currentTitle}
        />

        {/* Publish to Netlify Modal */}
        <PublishNetlifyModal
          open={publishModalOpen}
          onOpenChange={setPublishModalOpen}
          project={projectToPublish}
          onSuccess={(url) => {
            sonnerToast.success(`Published to ${url}`);
          }}
        />
      </div>
    </TooltipProvider>
  );
};
