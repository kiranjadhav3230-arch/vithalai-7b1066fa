import { useState } from 'react';
import { ChevronRight, ChevronDown, Globe, Star, StarOff, Trash2, MoreVertical, Download, Eye } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface WebsiteProjectFile {
  id: string;
  file_name: string;
  file_content: string;
  language: string;
  file_order: number;
}

export interface WebsiteProject {
  id: string;
  name: string;
  description: string | null;
  website_type: string | null;
  style_type: string | null;
  color_scheme: string | null;
  is_favorite: boolean;
  tags: string[] | null;
  created_at: string;
  files: WebsiteProjectFile[];
}

interface WebsiteProjectsPanelProps {
  projects: WebsiteProject[];
  selectedProjectId: string | null;
  selectedFileId: string | null;
  onSelectProject: (project: WebsiteProject) => void;
  onSelectFile: (project: WebsiteProject, file: WebsiteProjectFile) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onDeleteProject: (id: string) => void;
  onPreviewProject: (project: WebsiteProject) => void;
  onDownloadProject: (project: WebsiteProject) => void;
}

const fileIcons: Record<string, string> = {
  html: '🌐',
  css: '🎨',
  javascript: '🟨',
};

export function WebsiteProjectsPanel({
  projects,
  selectedProjectId,
  selectedFileId,
  onSelectProject,
  onSelectFile,
  onToggleFavorite,
  onDeleteProject,
  onPreviewProject,
  onDownloadProject,
}: WebsiteProjectsPanelProps) {
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [projectsSectionOpen, setProjectsSectionOpen] = useState(true);

  const toggleProjectExpanded = (projectId: string) => {
    setExpandedProjects(prev => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  };

  const getFileIcon = (language: string) => {
    return fileIcons[language.toLowerCase()] || '📄';
  };

  const favorites = projects.filter(p => p.is_favorite);
  const allProjects = projects;

  const ProjectItem = ({ project }: { project: WebsiteProject }) => {
    const isExpanded = expandedProjects.has(project.id);
    const isSelected = selectedProjectId === project.id;

    return (
      <div className="mb-1">
        <div
          className={cn(
            "group flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm transition-colors",
            isSelected && !selectedFileId
              ? "bg-[#094771] text-white"
              : "hover:bg-[#2a2d2e] text-[#cccccc]"
          )}
          onClick={() => {
            toggleProjectExpanded(project.id);
            onSelectProject(project);
          }}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-[#858585]" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-[#858585]" />
          )}
          <Globe className="h-4 w-4 shrink-0 text-blue-400" />
          <span className="truncate flex-1 text-sm">{project.name}</span>
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(project.id, !project.is_favorite);
              }}
              className="p-1 hover:bg-[#3c3c3c] rounded"
            >
              {project.is_favorite ? (
                <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
              ) : (
                <StarOff className="h-3.5 w-3.5" />
              )}
            </button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className="p-1 hover:bg-[#3c3c3c] rounded">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#252526] border-[#3c3c3c] text-white min-w-[160px]">
                <DropdownMenuItem
                  className="hover:bg-[#094771] cursor-pointer"
                  onClick={() => onPreviewProject(project)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Website
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="hover:bg-[#094771] cursor-pointer"
                  onClick={() => onDownloadProject(project)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download for Netlify
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-[#3c3c3c]" />
                <DropdownMenuItem
                  className="hover:bg-[#094771] cursor-pointer text-red-400 focus:text-red-400"
                  onClick={() => onDeleteProject(project.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Project
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Project Files and Actions */}
        {isExpanded && (
          <div className="ml-6">
            {/* Quick Action Buttons */}
            <div className="flex gap-1 px-2 py-2 border-b border-[#3c3c3c] mb-1">
              <Button
                onClick={() => onPreviewProject(project)}
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs bg-blue-500/10 hover:bg-blue-500/20 text-blue-400"
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
              <Button
                onClick={() => onDownloadProject(project)}
                size="sm"
                variant="ghost"
                className="h-7 px-2 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400"
              >
                <Download className="h-3 w-3 mr-1" />
                Download ZIP
              </Button>
            </div>
            
            {/* File List */}
            {project.files
              ?.sort((a, b) => a.file_order - b.file_order)
              .map(file => (
                <div
                  key={file.id}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 cursor-pointer rounded-sm transition-colors",
                    selectedFileId === file.id
                      ? "bg-[#094771] text-white"
                      : "hover:bg-[#2a2d2e] text-[#cccccc]"
                  )}
                  onClick={() => onSelectFile(project, file)}
                >
                  <span className="text-sm shrink-0">{getFileIcon(file.language)}</span>
                  <span className="truncate text-sm">{file.file_name}</span>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  const SectionHeader = ({
    title,
    count,
    isOpen,
    onToggle,
    icon: Icon,
  }: {
    title: string;
    count: number;
    isOpen: boolean;
    onToggle: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-[#bbbbbb] uppercase tracking-wider hover:bg-[#2a2d2e] transition-colors"
    >
      {isOpen ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
      {Icon && <Icon className="h-4 w-4" />}
      <span className="flex-1 text-left">{title}</span>
      <Badge variant="secondary" className="bg-[#3c3c3c] text-[#858585] text-[10px] px-1.5 py-0">
        {count}
      </Badge>
    </button>
  );

  return (
    <div className="h-full bg-[#252526] border-r border-[#3c3c3c] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#3c3c3c]">
        <span className="text-xs font-semibold text-[#bbbbbb] uppercase tracking-wider flex items-center gap-2">
          <Globe className="h-4 w-4" />
          Website Projects
        </span>
      </div>

      {/* Projects List */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div>
              <SectionHeader
                title="Favorites"
                count={favorites.length}
                isOpen={true}
                onToggle={() => {}}
              />
              <div className="ml-2">
                {favorites.map((project) => (
                  <ProjectItem key={project.id} project={project} />
                ))}
              </div>
            </div>
          )}

          {/* All Projects Section */}
          <div>
            <SectionHeader
              title="All Projects"
              count={allProjects.length}
              isOpen={projectsSectionOpen}
              onToggle={() => setProjectsSectionOpen(!projectsSectionOpen)}
            />
            {projectsSectionOpen && (
              <div className="ml-2">
                {allProjects.length > 0 ? (
                  allProjects.map((project) => (
                    <ProjectItem key={project.id} project={project} />
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-[#858585] text-sm">
                    <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No website projects</p>
                    <p className="text-xs mt-1">Generate a website and save it to your library</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
