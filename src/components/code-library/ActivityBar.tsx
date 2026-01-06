import { Files, Search, Tags, Settings, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export type ActivityView = 'files' | 'search' | 'tags' | 'settings';

interface ActivityBarProps {
  activeView: ActivityView;
  onViewChange: (view: ActivityView) => void;
  onClose: () => void;
}

const activities = [
  { id: 'files' as const, icon: Files, label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
  { id: 'search' as const, icon: Search, label: 'Search', shortcut: 'Ctrl+Shift+F' },
  { id: 'tags' as const, icon: Tags, label: 'Tags', shortcut: 'Ctrl+Shift+T' },
  { id: 'settings' as const, icon: Settings, label: 'Settings', shortcut: 'Ctrl+,' },
];

export function ActivityBar({ activeView, onViewChange, onClose }: ActivityBarProps) {
  return (
    <div className="w-12 bg-[#181818] border-r border-[#3c3c3c] flex flex-col items-center py-2 shrink-0">
      {activities.map((activity) => (
        <Tooltip key={activity.id}>
          <TooltipTrigger asChild>
            <button
              onClick={() => onViewChange(activity.id)}
              className={cn(
                "w-12 h-12 flex items-center justify-center relative transition-colors",
                activeView === activity.id
                  ? "text-white before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-[#007acc]"
                  : "text-[#858585] hover:text-white"
              )}
            >
              <activity.icon className="h-5 w-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="bg-[#252526] border-[#3c3c3c] text-white">
            <p>{activity.label} <span className="text-[#858585] ml-2">{activity.shortcut}</span></p>
          </TooltipContent>
        </Tooltip>
      ))}
      
      <div className="flex-1" />
      
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center text-[#858585] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-[#252526] border-[#3c3c3c] text-white">
          <p>Close Library <span className="text-[#858585] ml-2">Escape</span></p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
