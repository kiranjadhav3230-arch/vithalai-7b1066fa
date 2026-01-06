import { useState } from 'react';
import { Play, Trash2, X, ChevronUp, ChevronDown, Loader2, CheckCircle2, XCircle, Clock, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime?: number;
}

interface TerminalPanelProps {
  result: ExecutionResult | null;
  isExecuting: boolean;
  language: string;
  onRun: () => void;
  onClear: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  canRun: boolean;
}

type TabType = 'output' | 'problems';

export function TerminalPanel({
  result,
  isExecuting,
  language,
  onRun,
  onClear,
  isCollapsed,
  onToggleCollapse,
  canRun,
}: TerminalPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('output');

  const hasError = result && (result.stderr || result.exitCode !== 0);
  const hasOutput = result && (result.stdout || result.stderr);

  return (
    <div className={cn(
      "bg-[#1e1e1e] border-t border-[#3c3c3c] flex flex-col transition-all",
      isCollapsed ? "h-9" : "h-full"
    )}>
      {/* Terminal Header */}
      <div className="h-9 flex items-center justify-between px-2 border-b border-[#3c3c3c] bg-[#252526] shrink-0">
        <div className="flex items-center gap-1">
          {/* Tabs */}
          <button
            onClick={() => setActiveTab('output')}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-sm transition-colors",
              activeTab === 'output'
                ? "text-white bg-[#1e1e1e]"
                : "text-[#858585] hover:text-white"
            )}
          >
            OUTPUT
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1",
              activeTab === 'problems'
                ? "text-white bg-[#1e1e1e]"
                : "text-[#858585] hover:text-white"
            )}
          >
            PROBLEMS
            {hasError && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Run Button */}
          {canRun && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onRun}
              disabled={isExecuting}
              className="h-6 px-2 text-xs text-green-400 hover:text-green-300 hover:bg-green-500/10"
            >
              {isExecuting ? (
                <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 mr-1 fill-current" />
              )}
              {isExecuting ? 'Running...' : `Run ${language}`}
            </Button>
          )}
          
          {/* Clear Button */}
          {hasOutput && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClear}
              className="h-6 px-2 text-[#858585] hover:text-white hover:bg-[#3c3c3c]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          
          {/* Collapse Toggle */}
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggleCollapse}
            className="h-6 px-2 text-[#858585] hover:text-white hover:bg-[#3c3c3c]"
          >
            {isCollapsed ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      {!isCollapsed && (
        <ScrollArea className="flex-1">
          <div className="p-3 font-mono text-sm">
            {isExecuting && (
              <div className="flex items-center gap-2 text-[#858585]">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Executing {language} code...</span>
              </div>
            )}

            {!isExecuting && !result && (
              <div className="flex items-center gap-2 text-[#858585]">
                <Terminal className="h-4 w-4" />
                <span>Ready. {canRun ? 'Click Run to execute code.' : 'Select an executable snippet.'}</span>
              </div>
            )}

            {result && activeTab === 'output' && (
              <div className="space-y-2">
                {/* Execution info */}
                <div className="flex items-center gap-4 text-xs text-[#858585] pb-2 border-b border-[#3c3c3c]">
                  {result.exitCode === 0 ? (
                    <span className="flex items-center gap-1 text-green-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Exit code: 0
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-400">
                      <XCircle className="h-3.5 w-3.5" />
                      Exit code: {result.exitCode}
                    </span>
                  )}
                  {result.executionTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {result.executionTime}ms
                    </span>
                  )}
                </div>

                {/* stdout */}
                {result.stdout && (
                  <div className="space-y-1">
                    <div className="text-[#858585] text-xs">stdout:</div>
                    <pre className="text-green-400 whitespace-pre-wrap break-all">
                      {result.stdout}
                    </pre>
                  </div>
                )}

                {/* stderr */}
                {result.stderr && (
                  <div className="space-y-1">
                    <div className="text-[#858585] text-xs">stderr:</div>
                    <pre className="text-red-400 whitespace-pre-wrap break-all">
                      {result.stderr}
                    </pre>
                  </div>
                )}

                {/* No output */}
                {!result.stdout && !result.stderr && (
                  <div className="text-[#858585]">
                    (No output)
                  </div>
                )}
              </div>
            )}

            {result && activeTab === 'problems' && (
              <div>
                {result.stderr ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-red-400">
                      <XCircle className="h-4 w-4" />
                      <span>Errors detected</span>
                    </div>
                    <pre className="text-red-400 whitespace-pre-wrap break-all pl-6">
                      {result.stderr}
                    </pre>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>No problems detected</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
