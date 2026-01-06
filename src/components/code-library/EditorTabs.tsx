import { X, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface Tab {
  id: string;
  title: string;
  language: string;
  isModified?: boolean;
}

interface EditorTabsProps {
  tabs: Tab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
}

const languageColors: Record<string, string> = {
  javascript: '#f7df1e',
  typescript: '#3178c6',
  python: '#3776ab',
  java: '#ed8b00',
  html: '#e34c26',
  css: '#1572b6',
  react: '#61dafb',
  cpp: '#00599c',
  c: '#00599c',
  go: '#00add8',
  rust: '#dea584',
  ruby: '#cc342d',
  php: '#777bb4',
  swift: '#fa7343',
  kotlin: '#7f52ff',
  bash: '#4eaa25',
  sql: '#336791',
};

export function EditorTabs({ tabs, activeTabId, onTabSelect, onTabClose }: EditorTabsProps) {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="h-9 bg-[#252526] border-b border-[#3c3c3c] flex items-center">
      <ScrollArea className="w-full">
        <div className="flex">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={cn(
                "group flex items-center gap-2 px-3 h-9 border-r border-[#3c3c3c] cursor-pointer transition-colors min-w-[120px] max-w-[200px]",
                activeTabId === tab.id
                  ? "bg-[#1e1e1e] text-white border-t-2 border-t-[#007acc]"
                  : "bg-[#2d2d2d] text-[#969696] hover:bg-[#2d2d2d]/80"
              )}
              onClick={() => onTabSelect(tab.id)}
            >
              {/* Language indicator dot */}
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: languageColors[tab.language.toLowerCase()] || '#858585' }}
              />
              
              {/* Tab title */}
              <span className="truncate flex-1 text-sm">{tab.title}</span>
              
              {/* Modified indicator or close button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className={cn(
                  "p-0.5 rounded hover:bg-[#3c3c3c] transition-colors shrink-0",
                  tab.isModified
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                )}
              >
                {tab.isModified ? (
                  <Circle className="h-3 w-3 fill-current" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </button>
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-1" />
      </ScrollArea>
    </div>
  );
}
