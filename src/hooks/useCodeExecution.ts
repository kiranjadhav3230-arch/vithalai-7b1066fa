import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ExecutionResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTime?: number;
  language?: string;
  version?: string;
  signal?: string | null;
}

// Languages that can be executed in the browser
const BROWSER_LANGUAGES = ['javascript', 'js'];

// Languages supported by Piston API
const SERVER_LANGUAGES = [
  'python', 'java', 'cpp', 'c++', 'c', 'go', 'golang', 
  'rust', 'ruby', 'php', 'kotlin', 'swift', 'csharp', 
  'c#', 'typescript', 'bash', 'shell'
];

export const useCodeExecution = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeJavaScript = useCallback((code: string): ExecutionResult => {
    const logs: string[] = [];
    const errors: string[] = [];
    const startTime = performance.now();

    try {
      // Override console.log temporarily
      const originalLog = console.log;
      const originalError = console.error;
      const originalWarn = console.warn;
      const originalInfo = console.info;

      console.log = (...args: unknown[]) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };
      console.error = (...args: unknown[]) => {
        errors.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };
      console.warn = (...args: unknown[]) => {
        logs.push('[WARN] ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };
      console.info = (...args: unknown[]) => {
        logs.push('[INFO] ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      try {
        // Execute the code using Function constructor
        const execFunc = new Function(code);
        execFunc();
      } finally {
        // Restore original console methods
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        console.info = originalInfo;
      }

      const executionTime = Math.round(performance.now() - startTime);

      return {
        stdout: logs.join('\n'),
        stderr: errors.join('\n'),
        exitCode: errors.length > 0 ? 1 : 0,
        executionTime,
        language: 'javascript',
      };
    } catch (err) {
      const executionTime = Math.round(performance.now() - startTime);
      const errorMessage = err instanceof Error ? err.message : String(err);
      
      return {
        stdout: logs.join('\n'),
        stderr: errorMessage,
        exitCode: 1,
        executionTime,
        language: 'javascript',
      };
    }
  }, []);

  const executeServerCode = useCallback(async (code: string, language: string): Promise<ExecutionResult> => {
    const { data, error } = await supabase.functions.invoke('code-runner', {
      body: { code, language },
    });

    if (error) {
      throw new Error(error.message || 'Execution failed');
    }

    return data as ExecutionResult;
  }, []);

  const executeCode = useCallback(async (code: string, language: string) => {
    setIsExecuting(true);
    setError(null);
    setResult(null);

    const normalizedLang = language.toLowerCase();

    try {
      let executionResult: ExecutionResult;

      if (BROWSER_LANGUAGES.includes(normalizedLang)) {
        // Execute JavaScript in browser
        executionResult = executeJavaScript(code);
      } else if (SERVER_LANGUAGES.includes(normalizedLang)) {
        // Execute via Piston API
        executionResult = await executeServerCode(code, language);
      } else {
        throw new Error(`Language "${language}" is not supported for execution. Supported: JavaScript, Python, Java, C++, Go, Rust, Ruby, PHP, TypeScript, Kotlin, Swift, C#, Bash`);
      }

      setResult(executionResult);
      return executionResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Execution failed';
      setError(errorMessage);
      setResult({
        stdout: '',
        stderr: errorMessage,
        exitCode: 1,
      });
      return null;
    } finally {
      setIsExecuting(false);
    }
  }, [executeJavaScript, executeServerCode]);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  const isExecutable = useCallback((language: string): boolean => {
    const normalizedLang = language.toLowerCase();
    return BROWSER_LANGUAGES.includes(normalizedLang) || SERVER_LANGUAGES.includes(normalizedLang);
  }, []);

  return {
    executeCode,
    isExecuting,
    result,
    error,
    clearResult,
    isExecutable,
  };
};
