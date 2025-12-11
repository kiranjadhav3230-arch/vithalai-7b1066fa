import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Piston API language mappings
const languageVersions: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  java: { language: 'java', version: '15.0.2' },
  cpp: { language: 'c++', version: '10.2.0' },
  c: { language: 'c', version: '10.2.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
  ruby: { language: 'ruby', version: '3.0.1' },
  php: { language: 'php', version: '8.2.3' },
  kotlin: { language: 'kotlin', version: '1.8.20' },
  swift: { language: 'swift', version: '5.3.3' },
  csharp: { language: 'csharp', version: '6.12.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  bash: { language: 'bash', version: '5.2.0' },
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code, language } = await req.json();

    if (!code || !language) {
      return new Response(
        JSON.stringify({ error: 'Code and language are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const langKey = language.toLowerCase();
    const langConfig = languageVersions[langKey];

    if (!langConfig) {
      return new Response(
        JSON.stringify({ 
          error: `Language '${language}' is not supported for execution`,
          supportedLanguages: Object.keys(languageVersions)
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Executing ${langConfig.language} code (version ${langConfig.version})`);

    // Call Piston API
    const pistonResponse = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [
          {
            name: `main.${getFileExtension(langKey)}`,
            content: code,
          },
        ],
        stdin: '',
        args: [],
        compile_timeout: 10000,
        run_timeout: 10000,
        compile_memory_limit: -1,
        run_memory_limit: -1,
      }),
    });

    if (!pistonResponse.ok) {
      const errorText = await pistonResponse.text();
      console.error('Piston API error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: 'Code execution service unavailable',
          details: errorText 
        }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await pistonResponse.json();
    console.log('Piston execution result:', JSON.stringify(result));

    // Extract execution results
    const response = {
      language: langConfig.language,
      version: langConfig.version,
      compile: result.compile ? {
        stdout: result.compile.stdout || '',
        stderr: result.compile.stderr || '',
        exitCode: result.compile.code ?? 0,
      } : null,
      run: {
        stdout: result.run?.stdout || '',
        stderr: result.run?.stderr || '',
        exitCode: result.run?.code ?? 0,
      },
      success: (result.run?.code ?? 0) === 0 && (!result.compile || (result.compile.code ?? 0) === 0),
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in code-runner function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

function getFileExtension(language: string): string {
  const extensions: Record<string, string> = {
    python: 'py',
    java: 'java',
    cpp: 'cpp',
    c: 'c',
    go: 'go',
    rust: 'rs',
    ruby: 'rb',
    php: 'php',
    kotlin: 'kt',
    swift: 'swift',
    csharp: 'cs',
    typescript: 'ts',
    bash: 'sh',
  };
  return extensions[language] || 'txt';
}
