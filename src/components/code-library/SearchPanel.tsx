import React, { useState, useMemo } from 'react';
import { Search, CaseSensitive, WholeWord } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Snippet {
  id: string;
  title: string;
  generated_code: string;
  language: string;
}

interface SearchResult {
  snippetId: string;
  snippetTitle: string;
  language: string;
  lineNumber: number;
  lineContent: string;
  matchStart: number;
  matchEnd: number;
}

interface SearchPanelProps {
  snippets: Snippet[];
  onSelectResult: (snippetId: string, lineNumber: number) => void;
}

export function SearchPanel({ snippets, onSelectResult }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const searchResults: SearchResult[] = [];
    const query = matchCase ? searchQuery : searchQuery.toLowerCase();

    snippets.forEach(snippet => {
      const lines = snippet.generated_code.split('\n');
      
      lines.forEach((line, index) => {
        const searchLine = matchCase ? line : line.toLowerCase();
        let matchIndex = -1;

        if (wholeWord) {
          const regex = new RegExp(`\\b${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, matchCase ? 'g' : 'gi');
          const match = regex.exec(line);
          if (match) {
            matchIndex = match.index;
          }
        } else {
          matchIndex = searchLine.indexOf(query);
        }

        if (matchIndex !== -1) {
          searchResults.push({
            snippetId: snippet.id,
            snippetTitle: snippet.title,
            language: snippet.language,
            lineNumber: index + 1,
            lineContent: line.trim(),
            matchStart: matchIndex,
            matchEnd: matchIndex + query.length,
          });
        }
      });
    });

    return searchResults;
  }, [searchQuery, snippets, matchCase, wholeWord]);

  const groupedResults = useMemo(() => {
    const groups: { [key: string]: { title: string; language: string; results: SearchResult[] } } = {};
    
    results.forEach(result => {
      if (!groups[result.snippetId]) {
        groups[result.snippetId] = {
          title: result.snippetTitle,
          language: result.language,
          results: [],
        };
      }
      groups[result.snippetId].results.push(result);
    });

    return groups;
  }, [results]);

  const fileCount = Object.keys(groupedResults).length;

  return (
    <div className="h-full flex flex-col bg-[#252526] text-[#cccccc]">
      {/* Header */}
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#bbbbbb] border-b border-[#3c3c3c]">
        Search
      </div>

      {/* Search Input */}
      <div className="p-2 space-y-2 border-b border-[#3c3c3c]">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#858585]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in all files..."
            className="pl-8 h-7 bg-[#3c3c3c] border-[#3c3c3c] text-sm text-[#cccccc] placeholder:text-[#858585] focus:border-[#007acc]"
          />
        </div>

        {/* Options */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6",
              matchCase ? "bg-[#007acc] text-white" : "text-[#858585] hover:text-[#cccccc]"
            )}
            onClick={() => setMatchCase(!matchCase)}
            title="Match Case"
          >
            <CaseSensitive className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6",
              wholeWord ? "bg-[#007acc] text-white" : "text-[#858585] hover:text-[#cccccc]"
            )}
            onClick={() => setWholeWord(!wholeWord)}
            title="Whole Word"
          >
            <WholeWord className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      {searchQuery && (
        <div className="px-4 py-2 text-xs text-[#858585] border-b border-[#3c3c3c]">
          {results.length} result{results.length !== 1 ? 's' : ''} in {fileCount} file{fileCount !== 1 ? 's' : ''}
        </div>
      )}

      {/* Results List */}
      <ScrollArea className="flex-1">
        <div className="py-1">
          {Object.entries(groupedResults).map(([snippetId, group]) => (
            <div key={snippetId} className="mb-2">
              {/* File Header */}
              <div className="px-4 py-1 text-xs font-medium text-[#cccccc] flex items-center gap-2">
                <span className="text-[#e8ab53]">{group.title}</span>
                <span className="text-[#858585]">({group.results.length})</span>
              </div>
              
              {/* Matches */}
              {group.results.map((result, idx) => (
                <button
                  key={`${result.snippetId}-${result.lineNumber}-${idx}`}
                  onClick={() => onSelectResult(result.snippetId, result.lineNumber)}
                  className="w-full px-6 py-1 text-left text-xs hover:bg-[#2a2d2e] flex items-start gap-2"
                >
                  <span className="text-[#858585] shrink-0">Line {result.lineNumber}:</span>
                  <span className="text-[#d4d4d4] truncate">
                    {result.lineContent.substring(0, 80)}
                    {result.lineContent.length > 80 ? '...' : ''}
                  </span>
                </button>
              ))}
            </div>
          ))}

          {searchQuery && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[#858585]">
              No results found
            </div>
          )}

          {!searchQuery && (
            <div className="px-4 py-8 text-center text-sm text-[#858585]">
              Type to search across all snippets
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
