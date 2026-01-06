import { GitBranch, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  language: string;
  lineCount: number;
  isModified: boolean;
  lastSaved?: string;
}

export function StatusBar({ language, lineCount, isModified, lastSaved }: StatusBarProps) {
  return (
    <div className="h-6 bg-[#007acc] text-white text-xs flex items-center justify-between px-2 shrink-0">
      <div className="flex items-center gap-4">
        {/* Status indicator */}
        <div className="flex items-center gap-1">
          {isModified ? (
            <>
              <AlertCircle className="h-3.5 w-3.5" />
              <span>Modified</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Saved</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Line count */}
        <span>{lineCount} lines</span>
        
        {/* Encoding */}
        <span>UTF-8</span>
        
        {/* Language */}
        <span className="px-2 py-0.5 bg-white/10 rounded">{language.toUpperCase()}</span>
      </div>
    </div>
  );
}
