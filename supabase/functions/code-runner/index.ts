import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Piston API language versions
const LANGUAGE_VERSIONS: Record<string, string> = {
  python: '3.10.0',
  java: '15.0.2',
  cpp: '10.2.0',
  c: '10.2.0',
  go: '1.16.2',
  rust: '1.68.2',
  ruby: '3.0.1',
  php: '8.2.3',
  kotlin: '1.8.20',
  swift: '5.3.3',
  csharp: '6.12.0',
  typescript: '5.0.3',
  bash: '5.2.0',
};

// Map language names to Piston language identifiers
const LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  java: 'java',
  cpp: 'c++',
  'c++': 'c++',
  c: 'c',
  go: 'go',
  golang: 'go',
  rust: 'rust',
  ruby: 'ruby',
  php: 'php',
  kotlin: 'kotlin',
  swift: 'swift',
  csharp: 'csharp',
  'c#': 'csharp',
  typescript: 'typescript',
  bash: 'bash',
  shell: 'bash',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language, stdin = '' } = await req.json();
    
    if (!code || !language) {
      throw new Error('Code and language are required');
    }

    const normalizedLang = language.toLowerCase();
    const pistonLang = LANGUAGE_MAP[normalizedLang];
    
    if (!pistonLang) {
      throw new Error(`Unsupported language: ${language}. Supported: ${Object.keys(LANGUAGE_MAP).join(', ')}`);
    }

    const version = LANGUAGE_VERSIONS[normalizedLang] || LANGUAGE_VERSIONS[pistonLang];
    
    console.log(`Executing ${pistonLang} code (version ${version})`);

    const startTime = Date.now();

    // Call Piston API
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: pistonLang,
        version: version,
        files: [{ content: code }],
        stdin: stdin,
        run_timeout: 30000, // 30 second timeout
      }),
    });

    const executionTime = Date.now() - startTime;

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Piston API error:', errorText);
      throw new Error(`Execution failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('Execution completed:', result);

    // Extract run results
    const runResult = result.run || {};
    
    return new Response(JSON.stringify({
      stdout: runResult.stdout || '',
      stderr: runResult.stderr || '',
      exitCode: runResult.code ?? 0,
      signal: runResult.signal || null,
      executionTime: executionTime,
      language: pistonLang,
      version: version,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in code-runner function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      stdout: '',
      stderr: error.message,
      exitCode: 1,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
