import { useState } from 'react';
import { Search, ChevronRight, ChevronDown, Star, StarOff, Trash2, FileCode, MoreVertical } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface CodeSnippet {
  id: string;
  title: string;
  generated_code: string;
  language: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
}

interface ExplorerSidebarProps {
  snippets: CodeSnippet[];
  selectedSnippetId: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectSnippet: (snippet: CodeSnippet) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onDeleteSnippet: (id: string) => void;
  onCopyCode: (code: string) => void;
}

const languageIcons: Record<string, string> = {
  javascript: '🟨',
  typescript: '🔷',
  python: '🐍',
  java: '☕',
  html: '🌐',
  css: '🎨',
  react: '⚛️',
  cpp: '⚙️',
  c: '⚙️',
  go: '🔵',
  rust: '🦀',
  ruby: '💎',
  php: '🐘',
  swift: '🍎',
  kotlin: '🟣',
  bash: '💻',
  sql: '🗃️',
};

export function ExplorerSidebar({
  snippets,
  selectedSnippetId,
  searchQuery,
  onSearchChange,
  onSelectSnippet,
  onToggleFavorite,
  onDeleteSnippet,
  onCopyCode,
}: ExplorerSidebarProps) {
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [allSnippetsOpen, setAllSnippetsOpen] = useState(true);

  const favorites = snippets.filter(s => s.is_favorite);
  const allSnippets = snippets;

  const getLanguageIcon = (language: string) => {
    return languageIcons[language.toLowerCase()] || '📄';
  };

  const SnippetItem = ({ snippet }: { snippet: CodeSnippet }) => (
    <div
      className={cn(
        "group flex items-center gap-2 px-2 py-1.5 cursor-pointer rounded-sm transition-colors",
        selectedSnippetId === snippet.id
          ? "bg-[#094771] text-white"
          : "hover:bg-[#2a2d2e] text-[#cccccc]"
      )}
      onClick={() => onSelectSnippet(snippet)}
    >
      <span className="text-sm shrink-0">{getLanguageIcon(snippet.language)}</span>
      <span className="truncate flex-1 text-sm">{snippet.title}</span>
      
      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(snippet.id, !snippet.is_favorite);
          }}
          className="p-1 hover:bg-[#3c3c3c] rounded"
        >
          {snippet.is_favorite ? (
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
              onClick={() => onCopyCode(snippet.generated_code)}
            >
              Copy Code
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-[#3c3c3c]" />
            <DropdownMenuItem
              className="hover:bg-[#094771] cursor-pointer text-red-400 focus:text-red-400"
              onClick={() => onDeleteSnippet(snippet.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  const SectionHeader = ({
    title,
    count,
    isOpen,
    onToggle,
  }: {
    title: string;
    count: number;
    isOpen: boolean;
    onToggle: () => void;
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
      <span className="flex-1 text-left">{title}</span>
      <Badge variant="secondary" className="bg-[#3c3c3c] text-[#858585] text-[10px] px-1.5 py-0">
        {count}
      </Badge>
    </button>
  );

  return (
    <div className="h-full bg-[#252526] border-r border-[#3c3c3c] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 text-xs font-semibold text-[#bbbbbb] uppercase tracking-wider border-b border-[#3c3c3c]">
        Explorer
      </div>

      {/* Search */}
      <div className="p-2 border-b border-[#3c3c3c]">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#858585]" />
          <Input
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 bg-[#3c3c3c] border-[#3c3c3c] text-white placeholder:text-[#858585] h-7 text-sm focus-visible:ring-[#007acc]"
          />
        </div>
      </div>

      {/* Snippets List */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {/* Favorites Section */}
          {favorites.length > 0 && (
            <div>
              <SectionHeader
                title="Favorites"
                count={favorites.length}
                isOpen={favoritesOpen}
                onToggle={() => setFavoritesOpen(!favoritesOpen)}
              />
              {favoritesOpen && (
                <div className="ml-2">
                  {favorites.map((snippet) => (
                    <SnippetItem key={snippet.id} snippet={snippet} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* All Snippets Section */}
          <div>
            <SectionHeader
              title="All Snippets"
              count={allSnippets.length}
              isOpen={allSnippetsOpen}
              onToggle={() => setAllSnippetsOpen(!allSnippetsOpen)}
            />
            {allSnippetsOpen && (
              <div className="ml-2">
                {allSnippets.length > 0 ? (
                  allSnippets.map((snippet) => (
                    <SnippetItem key={snippet.id} snippet={snippet} />
                  ))
                ) : (
                  <div className="px-4 py-8 text-center text-[#858585] text-sm">
                    <FileCode className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No snippets found</p>
                    <p className="text-xs mt-1">Generate code to save snippets</p>
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
