import { useState, useEffect } from 'react';
import { Play, Trash2, ChevronUp, ChevronDown, Loader2, CheckCircle2, XCircle, Clock, Terminal, Keyboard, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime?: number;
}

interface InputDetection {
  hasInputFunctions: boolean;
  detectedFunctions: string[];
  inputCount: number;
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
  stdin: string;
  onStdinChange: (value: string) => void;
  inputDetection?: InputDetection;
}

type TabType = 'output' | 'problems' | 'input';

export function TerminalPanel({
  result,
  isExecuting,
  language,
  onRun,
  onClear,
  isCollapsed,
  onToggleCollapse,
  canRun,
  stdin,
  onStdinChange,
  inputDetection,
}: TerminalPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('output');
  const [showInputWarning, setShowInputWarning] = useState(false);

  const inputLineCount = stdin.trim() ? stdin.trim().split('\n').length : 0;
  const needsInput = inputDetection?.hasInputFunctions && inputLineCount === 0;

  // Auto-switch to INPUT tab when input functions detected and no input provided
  useEffect(() => {
    if (inputDetection?.hasInputFunctions && inputLineCount === 0 && !result) {
      setActiveTab('input');
      setShowInputWarning(true);
    }
  }, [inputDetection?.hasInputFunctions, inputLineCount, result]);

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
          <button
            onClick={() => setActiveTab('input')}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-sm transition-colors flex items-center gap-1",
              activeTab === 'input'
                ? "text-white bg-[#1e1e1e]"
                : needsInput
                  ? "text-amber-400 hover:text-amber-300"
                  : "text-[#858585] hover:text-white"
            )}
          >
            INPUT
            {needsInput ? (
              <AlertTriangle className="h-3 w-3 text-amber-400 animate-pulse" />
            ) : inputLineCount > 0 ? (
              <span className="px-1.5 py-0.5 text-[10px] rounded bg-blue-500/20 text-blue-400">
                {inputLineCount}
              </span>
            ) : null}
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

            {activeTab === 'input' && (
              <div className="space-y-3">
                {/* Input Required Warning */}
                {inputDetection?.hasInputFunctions && showInputWarning && inputLineCount === 0 && (
                  <div className="flex items-start gap-2 p-3 rounded-md bg-amber-500/10 border border-amber-500/30">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-sm text-amber-300 font-medium">Input Required</p>
                      <p className="text-xs text-amber-400/80">
                        Your code uses <span className="font-mono text-amber-300">{inputDetection.detectedFunctions.join(', ')}</span> which requires {inputDetection.inputCount} input value{inputDetection.inputCount > 1 ? 's' : ''}. 
                        Please enter the values below before running.
                      </p>
                    </div>
                    <button 
                      onClick={() => setShowInputWarning(false)}
                      className="text-amber-400/60 hover:text-amber-400 text-xs shrink-0"
                    >
                      ✕
                    </button>
                  </div>
                )}

                <div className="flex items-center gap-2 text-[#858585]">
                  <Keyboard className="h-4 w-4" />
                  <span>Enter input values (one per line)</span>
                  {inputDetection?.hasInputFunctions && (
                    <span className="text-xs text-amber-400/70">
                      ({inputDetection.inputCount} expected)
                    </span>
                  )}
                </div>
                <Textarea
                  value={stdin}
                  onChange={(e) => onStdinChange(e.target.value)}
                  placeholder={inputDetection?.hasInputFunctions 
                    ? `Enter ${inputDetection.inputCount} value${inputDetection.inputCount > 1 ? 's' : ''}, one per line...`
                    : "10\n20\nHello World"}
                  className={cn(
                    "min-h-[120px] bg-[#2d2d2d] border-[#3c3c3c] text-white font-mono text-sm placeholder:text-[#5a5a5a] focus-visible:ring-blue-500",
                    needsInput && "border-amber-500/50 focus-visible:ring-amber-500"
                  )}
                  autoFocus={needsInput}
                />
                <p className="text-xs text-[#858585]">
                  💡 These values will be used when your code reads input (e.g., Python's <code className="text-blue-400">input()</code>, C's <code className="text-blue-400">scanf</code>, Java's <code className="text-blue-400">Scanner</code>)
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
