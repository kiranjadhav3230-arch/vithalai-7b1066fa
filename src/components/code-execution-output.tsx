import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Terminal, 
  Copy, 
  X, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import type { ExecutionResult } from '@/hooks/useCodeExecution';

interface CodeExecutionOutputProps {
  result: ExecutionResult | null;
  isExecuting: boolean;
  onClear: () => void;
}

export const CodeExecutionOutput: React.FC<CodeExecutionOutputProps> = ({
  result,
  isExecuting,
  onClear,
}) => {
  if (!result && !isExecuting) {
    return null;
  }

  const handleCopyOutput = () => {
    const output = result ? `${result.stdout}${result.stderr ? '\n' + result.stderr : ''}` : '';
    navigator.clipboard.writeText(output);
    toast.success('Output copied to clipboard');
  };

  const isSuccess = result?.exitCode === 0;
  const hasOutput = result && (result.stdout || result.stderr);

  return (
    <Card className="mt-4 border-border/50 bg-zinc-950">
      <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <CardTitle className="text-sm font-medium text-zinc-200">
            Output
          </CardTitle>
          {isExecuting && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400">
              <Loader2 className="h-3 w-3 animate-spin" />
              Running...
            </div>
          )}
          {result && !isExecuting && (
            <div className="flex items-center gap-3">
              {isSuccess ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Exit: 0
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-red-400">
                  <XCircle className="h-3 w-3" />
                  Exit: {result.exitCode}
                </span>
              )}
              {result.executionTime !== undefined && (
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="h-3 w-3" />
                  {result.executionTime}ms
                </span>
              )}
              {result.language && (
                <span className="text-xs text-zinc-600">
                  {result.language} {result.version && `v${result.version}`}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasOutput && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-zinc-400 hover:text-zinc-200"
              onClick={handleCopyOutput}
            >
              <Copy className="h-3 w-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-zinc-400 hover:text-zinc-200"
            onClick={onClear}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-64">
          <div className="p-4 pt-0 font-mono text-sm">
            {isExecuting && !result && (
              <div className="text-zinc-500 animate-pulse">
                Executing code...
              </div>
            )}
            {result?.stdout && (
              <pre className="whitespace-pre-wrap text-emerald-400 mb-2">
                {result.stdout}
              </pre>
            )}
            {result?.stderr && (
              <pre className="whitespace-pre-wrap text-red-400">
                {result.stderr}
              </pre>
            )}
            {result && !result.stdout && !result.stderr && (
              <div className="text-zinc-500 italic">
                No output
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
