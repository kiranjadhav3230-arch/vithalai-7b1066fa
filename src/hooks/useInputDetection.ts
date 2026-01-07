import { useMemo } from 'react';

interface InputDetectionResult {
  hasInputFunctions: boolean;
  detectedFunctions: string[];
  inputCount: number;
  language: string;
}

// Patterns for detecting input functions in various languages
const INPUT_PATTERNS: Record<string, { pattern: RegExp; name: string }[]> = {
  python: [
    { pattern: /\binput\s*\(/g, name: 'input()' },
    { pattern: /\bsys\.stdin/g, name: 'sys.stdin' },
  ],
  c: [
    { pattern: /\bscanf\s*\(/g, name: 'scanf()' },
    { pattern: /\bgets\s*\(/g, name: 'gets()' },
    { pattern: /\bgetchar\s*\(/g, name: 'getchar()' },
    { pattern: /\bfgets\s*\(/g, name: 'fgets()' },
  ],
  cpp: [
    { pattern: /\bcin\s*>>/g, name: 'cin' },
    { pattern: /\bscanf\s*\(/g, name: 'scanf()' },
    { pattern: /\bgetline\s*\(/g, name: 'getline()' },
    { pattern: /\bgets\s*\(/g, name: 'gets()' },
  ],
  java: [
    { pattern: /Scanner\s*\(/g, name: 'Scanner' },
    { pattern: /\.nextLine\s*\(/g, name: 'nextLine()' },
    { pattern: /\.nextInt\s*\(/g, name: 'nextInt()' },
    { pattern: /\.next\s*\(/g, name: 'next()' },
    { pattern: /\.nextDouble\s*\(/g, name: 'nextDouble()' },
    { pattern: /BufferedReader/g, name: 'BufferedReader' },
  ],
  javascript: [
    { pattern: /\bprompt\s*\(/g, name: 'prompt()' },
    { pattern: /readline\s*\(/g, name: 'readline()' },
  ],
  typescript: [
    { pattern: /\bprompt\s*\(/g, name: 'prompt()' },
    { pattern: /readline\s*\(/g, name: 'readline()' },
  ],
  go: [
    { pattern: /fmt\.Scan/g, name: 'fmt.Scan' },
    { pattern: /bufio\.NewReader/g, name: 'bufio.Reader' },
    { pattern: /bufio\.NewScanner/g, name: 'bufio.Scanner' },
  ],
  rust: [
    { pattern: /std::io::stdin/g, name: 'stdin()' },
    { pattern: /\.read_line\s*\(/g, name: 'read_line()' },
  ],
  ruby: [
    { pattern: /\bgets\b/g, name: 'gets' },
    { pattern: /\bgets\.chomp/g, name: 'gets.chomp' },
    { pattern: /STDIN\.gets/g, name: 'STDIN.gets' },
  ],
  php: [
    { pattern: /\bfgets\s*\(\s*STDIN/g, name: 'fgets(STDIN)' },
    { pattern: /\breadline\s*\(/g, name: 'readline()' },
    { pattern: /\bfscanf\s*\(/g, name: 'fscanf()' },
  ],
  csharp: [
    { pattern: /Console\.ReadLine\s*\(/g, name: 'Console.ReadLine()' },
    { pattern: /Console\.Read\s*\(/g, name: 'Console.Read()' },
  ],
  kotlin: [
    { pattern: /\breadLine\s*\(/g, name: 'readLine()' },
    { pattern: /\breadln\s*\(/g, name: 'readln()' },
    { pattern: /Scanner\s*\(/g, name: 'Scanner' },
  ],
  swift: [
    { pattern: /\breadLine\s*\(/g, name: 'readLine()' },
  ],
  bash: [
    { pattern: /\bread\s+/g, name: 'read' },
    { pattern: /\bread\s+-/g, name: 'read' },
  ],
};

// Normalize language names
const normalizeLanguage = (lang: string): string => {
  const langLower = lang.toLowerCase();
  const languageMap: Record<string, string> = {
    'c++': 'cpp',
    'c#': 'csharp',
    'python3': 'python',
    'py': 'python',
    'js': 'javascript',
    'ts': 'typescript',
    'sh': 'bash',
    'shell': 'bash',
  };
  return languageMap[langLower] || langLower;
};

export function detectInputFunctions(code: string, language: string): InputDetectionResult {
  const normalizedLang = normalizeLanguage(language);
  const patterns = INPUT_PATTERNS[normalizedLang] || [];
  
  const detectedFunctions: string[] = [];
  let totalInputCount = 0;

  for (const { pattern, name } of patterns) {
    // Reset regex lastIndex
    pattern.lastIndex = 0;
    const matches = code.match(pattern);
    if (matches && matches.length > 0) {
      if (!detectedFunctions.includes(name)) {
        detectedFunctions.push(name);
      }
      totalInputCount += matches.length;
    }
  }

  return {
    hasInputFunctions: detectedFunctions.length > 0,
    detectedFunctions,
    inputCount: totalInputCount,
    language: normalizedLang,
  };
}

export function useInputDetection(code: string, language: string): InputDetectionResult {
  return useMemo(() => {
    return detectInputFunctions(code, language);
  }, [code, language]);
}
