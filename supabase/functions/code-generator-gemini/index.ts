import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language-specific best practices and standards
const LANGUAGE_BEST_PRACTICES: Record<string, string> = {
  javascript: `
- Use ES6+ syntax (const/let, arrow functions, template literals, destructuring)
- Follow ESLint recommended rules
- Use async/await for asynchronous operations
- Add JSDoc comments for functions
- Handle errors with try-catch blocks
- Use meaningful variable names (camelCase)
- Avoid var, use const by default, let when reassignment is needed`,

  typescript: `
- Define proper TypeScript interfaces and types
- Use strict mode features (strict null checks, no implicit any)
- Prefer interface over type for object shapes
- Use generics where appropriate
- Export types alongside implementations
- Use readonly for immutable properties
- Add proper return types to all functions`,

  python: `
- Follow PEP 8 style guide
- Use type hints (Python 3.5+)
- Use f-strings for string formatting
- Use list/dict comprehensions where readable
- Add docstrings to functions and classes
- Use context managers (with statements) for resources
- Handle exceptions with specific error types
- Use snake_case for variables and functions`,

  java: `
- Follow Java naming conventions (PascalCase for classes, camelCase for methods)
- Use appropriate access modifiers (private, public, protected)
- Implement proper exception handling
- Use StringBuilder for string concatenation
- Follow SOLID principles
- Add Javadoc comments
- Use Optional for nullable returns`,

  cpp: `
- Use modern C++ (C++17/20 features where applicable)
- Prefer smart pointers over raw pointers
- Use RAII for resource management
- Follow const correctness
- Use references instead of pointers when possible
- Add proper header guards
- Use nullptr instead of NULL`,

  sql: `
- Use uppercase for SQL keywords
- Use proper indexing strategies
- Avoid SELECT * in production code
- Use parameterized queries to prevent SQL injection
- Add appropriate constraints (PRIMARY KEY, FOREIGN KEY, NOT NULL)
- Use meaningful table and column names
- Add comments for complex queries`,

  html: `
- Use semantic HTML5 elements (header, nav, main, section, article, footer)
- Add proper meta tags and viewport
- Ensure accessibility with ARIA labels and alt text
- Use proper heading hierarchy (h1-h6)
- Include lang attribute on html tag
- Use proper form labels and inputs`,

  css: `
- Use CSS custom properties (variables) for colors and spacing
- Follow BEM or similar naming convention
- Use flexbox/grid for layouts
- Add responsive media queries
- Use rem/em units for sizing
- Organize styles logically (layout, typography, components)`,

  go: `
- Follow Go conventions (exported names start with capital)
- Use gofmt for formatting
- Handle errors explicitly (don't ignore returned errors)
- Use defer for cleanup
- Keep functions short and focused
- Use interfaces for abstraction
- Add godoc comments`,

  rust: `
- Follow Rust naming conventions (snake_case for functions/variables)
- Use Result and Option types properly
- Implement proper error handling with ? operator
- Use lifetimes correctly
- Prefer borrowing over cloning
- Add documentation comments with ///
- Use match for exhaustive pattern matching`,
};

// Code validation patterns
const CODE_VALIDATION_PATTERNS: Record<string, { patterns: RegExp[], checks: string[] }> = {
  javascript: {
    patterns: [
      /function\s+\w+\s*\(|const\s+\w+\s*=|let\s+\w+\s*=|class\s+\w+/,
      /import\s+|export\s+|require\s*\(/,
    ],
    checks: ['Has function/variable declarations', 'Has module syntax']
  },
  typescript: {
    patterns: [
      /interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean|any)/,
      /function\s+\w+|const\s+\w+|class\s+\w+/,
    ],
    checks: ['Has type definitions', 'Has proper declarations']
  },
  python: {
    patterns: [
      /def\s+\w+\s*\(|class\s+\w+/,
      /import\s+\w+|from\s+\w+\s+import/,
    ],
    checks: ['Has function/class definitions', 'Has imports']
  },
  html: {
    patterns: [
      /<html|<body|<head|<div|<section/i,
      /<\/\w+>/,
    ],
    checks: ['Has HTML structure', 'Has closing tags']
  },
  sql: {
    patterns: [
      /SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER/i,
      /FROM|WHERE|JOIN|GROUP BY|ORDER BY/i,
    ],
    checks: ['Has SQL keywords', 'Has query structure']
  },
};

// Validate generated code quality
function validateCode(code: string, language: string): { isValid: boolean; score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;
  
  // Check for truncation
  if (code.endsWith('...') || code.endsWith('// ...') || code.endsWith('# ...')) {
    issues.push('Code appears truncated');
    score -= 20;
  }
  
  // Check for incomplete code blocks
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces && ['javascript', 'typescript', 'java', 'cpp', 'csharp', 'go', 'rust'].includes(language)) {
    issues.push('Unbalanced braces detected');
    score -= 15;
  }
  
  // Check for incomplete parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    issues.push('Unbalanced parentheses detected');
    score -= 10;
  }
  
  // Language-specific validation
  const validation = CODE_VALIDATION_PATTERNS[language];
  if (validation) {
    validation.patterns.forEach((pattern, index) => {
      if (!pattern.test(code)) {
        issues.push(`Missing: ${validation.checks[index]}`);
        score -= 5;
      }
    });
  }
  
  // Check minimum code length
  if (code.length < 50) {
    issues.push('Code is too short');
    score -= 25;
  }
  
  return {
    isValid: score >= 70,
    score: Math.max(0, score),
    issues
  };
}

// Retry with exponential backoff
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  maxRetries: number = 3
): Promise<Response> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 429) {
        // Rate limit - wait with exponential backoff
        const waitTime = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        console.log(`Rate limited, waiting ${waitTime}ms before retry ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      if (response.status >= 500) {
        // Server error - retry
        const waitTime = Math.pow(2, attempt) * 500;
        console.log(`Server error ${response.status}, waiting ${waitTime}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // Client error - don't retry
      return response;
    } catch (error) {
      lastError = error as Error;
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      if (attempt < maxRetries - 1) {
        const waitTime = Math.pow(2, attempt) * 500;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError || new Error('All retry attempts failed');
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      prompt, 
      language, 
      task, 
      sourceLanguage, 
      targetLanguage, 
      attachments,
      chatHistory,
      stream 
    } = await req.json();
    
    console.log('Code generation request:', { 
      language, 
      task, 
      sourceLanguage, 
      targetLanguage, 
      promptLength: prompt?.length, 
      attachments: attachments?.length,
      historyLength: chatHistory?.length,
      stream 
    });

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Get language-specific best practices
    const langKey = language?.toLowerCase() || 'javascript';
    const bestPractices = LANGUAGE_BEST_PRACTICES[langKey] || '';
    const targetBestPractices = targetLanguage ? (LANGUAGE_BEST_PRACTICES[targetLanguage.toLowerCase()] || '') : '';

    // Build enhanced task-specific system prompt
    let systemPrompt = '';
    
    if (task === 'generate') {
      systemPrompt = `You are an expert ${language} code generator with deep knowledge of industry best practices.

LANGUAGE-SPECIFIC BEST PRACTICES FOR ${language.toUpperCase()}:
${bestPractices}

STRICT INSTRUCTIONS:
- Generate COMPLETE, PRODUCTION-READY ${language} code - NEVER truncate or abbreviate
- Include ALL necessary imports, dependencies, and boilerplate
- Add comprehensive comments explaining key sections
- Follow the best practices listed above
- Include robust error handling and edge case management
- Make the code fully functional and ready to deploy
- Use meaningful variable and function names
- Structure code logically with proper separation of concerns
- Include input validation where appropriate
- Add example usage if helpful

QUALITY REQUIREMENTS:
- Code must compile/run without errors
- All functions must have proper signatures
- All blocks must be properly closed (braces, parentheses)
- Do NOT use placeholder comments like "// rest of code here"`;

    } else if (task === 'explain') {
      systemPrompt = `You are an expert code educator specializing in ${language}.

INSTRUCTIONS:
- Provide a COMPREHENSIVE explanation in plain text
- Break down the code line by line or section by section
- Explain the PURPOSE of each component
- Highlight important patterns, algorithms, and design decisions
- Explain any language-specific features used
- Mention potential improvements or alternatives
- Use clear, beginner-friendly language
- Include a summary at the end
- If there are performance considerations, explain them`;

    } else if (task === 'fix') {
      systemPrompt = `You are an expert ${language} debugger and code quality specialist.

LANGUAGE-SPECIFIC BEST PRACTICES FOR ${language.toUpperCase()}:
${bestPractices}

INSTRUCTIONS:
- Carefully analyze the code for ALL bugs, issues, and anti-patterns
- Generate the COMPLETE FIXED version of the code
- Add comments with "// FIXED:" or "# FIXED:" explaining each fix
- List all identified issues at the top as comments
- Ensure the fixed code follows best practices
- Check for: syntax errors, logic errors, runtime errors, security issues
- Verify all edge cases are handled
- The fixed code must be complete and functional
- Do NOT omit any part of the code`;

    } else if (task === 'optimize') {
      systemPrompt = `You are an expert ${language} performance engineer and code optimizer.

LANGUAGE-SPECIFIC BEST PRACTICES FOR ${language.toUpperCase()}:
${bestPractices}

INSTRUCTIONS:
- Analyze the code for ALL optimization opportunities
- Generate the COMPLETE OPTIMIZED version of the code
- Add comments with "// OPTIMIZED:" explaining each optimization
- List all optimizations at the top as a summary comment
- Focus on:
  * Time complexity improvements
  * Space complexity improvements
  * Memory efficiency
  * Code readability and maintainability
  * Modern language features that improve performance
  * Caching opportunities
  * Reducing redundant operations
- Ensure the optimized code maintains the same functionality
- The optimized code must be complete - do NOT truncate`;

    } else if (task === 'translate') {
      const sourceLang = sourceLanguage || language;
      const targetLang = targetLanguage || language;
      
      systemPrompt = `You are an expert polyglot programmer specializing in code translation.

SOURCE LANGUAGE (${sourceLang.toUpperCase()}) PATTERNS TO UNDERSTAND:
${LANGUAGE_BEST_PRACTICES[sourceLang?.toLowerCase()] || ''}

TARGET LANGUAGE (${targetLang.toUpperCase()}) BEST PRACTICES:
${targetBestPractices}

INSTRUCTIONS:
- Translate the provided ${sourceLang} code to ${targetLang}
- Maintain EXACT same functionality and logic
- Use IDIOMATIC ${targetLang} patterns and syntax
- Follow ${targetLang} naming conventions
- Include all necessary imports/dependencies for ${targetLang}
- Add comments explaining ${targetLang}-specific features
- The translated code must be COMPLETE and READY TO RUN
- Handle any language-specific differences gracefully
- If a feature doesn't exist in ${targetLang}, use the closest equivalent
- Do NOT truncate or abbreviate any part of the code`;
    }
    
    systemPrompt += `

OUTPUT FORMAT:
- Wrap code in proper markdown code blocks with language identifier
- Generate clean, well-structured, properly indented code
- Include helpful comments throughout
- Make the code ready to copy-paste and run`;

    // Build chat context from history
    let contextPrompt = '';
    if (chatHistory && chatHistory.length > 0) {
      contextPrompt = '\n\nPREVIOUS CONVERSATION CONTEXT:\n';
      const recentHistory = chatHistory.slice(-5); // Last 5 messages for context
      recentHistory.forEach((msg: { role: string; content: string }) => {
        contextPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content.substring(0, 500)}\n`;
      });
      contextPrompt += '\nContinue based on this context.\n';
    }

    // Build user message with attachments if provided
    let contentParts: any[] = [];
    
    const userPrompt = prompt || (attachments?.length > 0 ? 'Generate code based on the attached image/design.' : '');
    contentParts.push({ text: systemPrompt + contextPrompt + '\n\nUser Request: ' + userPrompt });
    
    // Add image attachments
    if (attachments && attachments.length > 0) {
      for (const att of attachments) {
        if (att.type === 'image') {
          const matches = att.data.match(/^data:([^;]+);base64,(.+)$/);
          if (matches) {
            contentParts.push({
              inline_data: {
                mime_type: matches[1],
                data: matches[2]
              }
            });
          }
        }
      }
    }

    // Handle streaming response
    if (stream) {
      const response = await fetchWithRetry(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: contentParts }],
            generationConfig: {
              temperature: 0.1,
              maxOutputTokens: 16000,
            }
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini streaming error:', response.status, errorText);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      // Return the streaming response directly
      return new Response(response.body, {
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        },
      });
    }

    // Non-streaming response
    const response = await fetchWithRetry(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: contentParts }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 16000,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response received');

    const generatedCode = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    if (!generatedCode) {
      throw new Error('No code generated from Gemini API');
    }

    const cleanCode = generatedCode.trim();

    // Validate the generated code
    const validation = validateCode(cleanCode, langKey);
    console.log('Code validation:', { 
      language: langKey, 
      score: validation.score, 
      isValid: validation.isValid,
      issues: validation.issues,
      codeLength: cleanCode.length 
    });

    // If validation fails significantly, log a warning but still return
    if (!validation.isValid) {
      console.warn('Code validation warning:', validation.issues);
    }

    return new Response(
      JSON.stringify({ 
        code: cleanCode,
        translation: cleanCode,
        validation: {
          score: validation.score,
          isValid: validation.isValid,
          issues: validation.issues
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in code-generator-gemini function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        code: '',
        validation: { score: 0, isValid: false, issues: ['Generation failed'] }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
