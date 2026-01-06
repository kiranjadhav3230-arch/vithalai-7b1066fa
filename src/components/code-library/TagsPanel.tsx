import React, { useState, useMemo } from 'react';
import { Tag, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Snippet {
  id: string;
  title: string;
  language: string;
  tags: string[];
}

interface TagsPanelProps {
  snippets: Snippet[];
  onSelectSnippet: (snippetId: string) => void;
}

export function TagsPanel({ snippets, onSelectSnippet }: TagsPanelProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Get all unique tags with counts
  const tagsWithCounts = useMemo(() => {
    const tagMap: { [key: string]: number } = {};
    
    snippets.forEach(snippet => {
      (snippet.tags || []).forEach(tag => {
        tagMap[tag] = (tagMap[tag] || 0) + 1;
      });
    });

    return Object.entries(tagMap)
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }, [snippets]);

  // Filter snippets by selected tags
  const filteredSnippets = useMemo(() => {
    if (selectedTags.length === 0) return [];

    return snippets.filter(snippet => {
      const snippetTags = snippet.tags || [];
      return selectedTags.every(tag => snippetTags.includes(tag));
    });
  }, [snippets, selectedTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="h-full flex flex-col bg-[#252526] text-[#cccccc]">
      {/* Header */}
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#bbbbbb] border-b border-[#3c3c3c]">
        Tags
      </div>

      <ScrollArea className="flex-1">
        {/* Tags List */}
        <div className="p-2">
          <div className="text-xs text-[#858585] uppercase tracking-wide mb-2 px-2">
            Filter by Tags
          </div>
          
          {tagsWithCounts.length === 0 ? (
            <div className="px-2 py-4 text-sm text-[#858585] text-center">
              No tags found
            </div>
          ) : (
            <div className="space-y-0.5">
              {tagsWithCounts.map(({ tag, count }) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "w-full px-2 py-1.5 flex items-center justify-between rounded text-sm hover:bg-[#2a2d2e] transition-colors",
                    selectedTags.includes(tag) && "bg-[#094771]"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-[#858585]" />
                    <span className="text-[#cccccc]">{tag}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#858585]">{count}</span>
                    {selectedTags.includes(tag) && (
                      <Check className="h-3.5 w-3.5 text-[#007acc]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filtered Results */}
        {selectedTags.length > 0 && (
          <div className="border-t border-[#3c3c3c] mt-2 p-2">
            <div className="text-xs text-[#858585] uppercase tracking-wide mb-2 px-2">
              Filtered Snippets ({filteredSnippets.length})
            </div>

            {filteredSnippets.length === 0 ? (
              <div className="px-2 py-4 text-sm text-[#858585] text-center">
                No snippets match selected tags
              </div>
            ) : (
              <div className="space-y-0.5">
                {filteredSnippets.map(snippet => (
                  <button
                    key={snippet.id}
                    onClick={() => onSelectSnippet(snippet.id)}
                    className="w-full px-2 py-1.5 flex items-center gap-2 rounded text-sm hover:bg-[#2a2d2e] text-left"
                  >
                    <span className="text-[#e8ab53] truncate flex-1">{snippet.title}</span>
                    <span className="text-xs text-[#858585] shrink-0">{snippet.language}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
