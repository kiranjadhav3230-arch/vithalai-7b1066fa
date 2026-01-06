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

// Code validation patterns - Extended for more languages
const CODE_VALIDATION_PATTERNS: Record<string, { patterns: RegExp[], checks: string[], weight: number }> = {
  javascript: {
    patterns: [
      /function\s+\w+\s*\(|const\s+\w+\s*=|let\s+\w+\s*=|class\s+\w+|=>\s*{/,
      /import\s+|export\s+|require\s*\(|module\.exports/,
      /return\s+|console\.|throw\s+/,
    ],
    checks: ['Has function/variable declarations', 'Has module syntax', 'Has control flow'],
    weight: 1.0
  },
  typescript: {
    patterns: [
      /interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean|any|void)/,
      /function\s+\w+|const\s+\w+|class\s+\w+|=>\s*{/,
      /<\w+>|as\s+\w+|readonly\s+/,
    ],
    checks: ['Has type definitions', 'Has proper declarations', 'Has TypeScript features'],
    weight: 1.0
  },
  python: {
    patterns: [
      /def\s+\w+\s*\(|class\s+\w+:|async\s+def/,
      /import\s+\w+|from\s+\w+\s+import/,
      /return\s+|if\s+.*:|for\s+.*:|while\s+.*:/,
    ],
    checks: ['Has function/class definitions', 'Has imports', 'Has control structures'],
    weight: 1.0
  },
  java: {
    patterns: [
      /public\s+class\s+\w+|private\s+|protected\s+/,
      /void\s+\w+\s*\(|int\s+\w+|String\s+\w+|boolean\s+\w+/,
      /import\s+java\.|package\s+\w+/,
      /new\s+\w+\s*\(|return\s+|throw\s+new/,
    ],
    checks: ['Has class declaration', 'Has typed variables/methods', 'Has imports/package', 'Has instantiation/returns'],
    weight: 1.0
  },
  cpp: {
    patterns: [
      /#include\s*<|using\s+namespace|int\s+main\s*\(/,
      /class\s+\w+|struct\s+\w+|void\s+\w+\s*\(/,
      /std::|cout|cin|nullptr|auto\s+\w+/,
      /return\s+|new\s+|delete\s+/,
    ],
    checks: ['Has includes/namespace', 'Has class/function definitions', 'Has C++ features', 'Has memory/returns'],
    weight: 1.0
  },
  csharp: {
    patterns: [
      /using\s+System|namespace\s+\w+|public\s+class/,
      /void\s+\w+\s*\(|int\s+\w+|string\s+\w+|bool\s+\w+/,
      /new\s+\w+\s*\(|return\s+|async\s+Task/,
    ],
    checks: ['Has namespace/using', 'Has typed members', 'Has C# features'],
    weight: 1.0
  },
  go: {
    patterns: [
      /package\s+\w+|import\s+\(|func\s+\w+\s*\(/,
      /var\s+\w+|const\s+\w+|type\s+\w+\s+struct/,
      /return\s+|if\s+|for\s+|defer\s+|go\s+/,
      /:=|make\(|append\(/,
    ],
    checks: ['Has package/imports/functions', 'Has declarations', 'Has control flow', 'Has Go idioms'],
    weight: 1.0
  },
  rust: {
    patterns: [
      /fn\s+\w+\s*\(|impl\s+\w+|struct\s+\w+|enum\s+\w+/,
      /let\s+(mut\s+)?\w+|const\s+\w+|use\s+\w+/,
      /pub\s+|mod\s+|->|::\s*\w+/,
      /match\s+|if\s+let|Result<|Option</,
    ],
    checks: ['Has function/struct definitions', 'Has variable declarations', 'Has Rust syntax', 'Has Rust patterns'],
    weight: 1.0
  },
  php: {
    patterns: [
      /<\?php|function\s+\w+\s*\(|class\s+\w+/,
      /\$\w+\s*=|public\s+|private\s+|protected\s+/,
      /echo\s+|return\s+|new\s+\w+/,
      /use\s+\w+|namespace\s+\w+|require|include/,
    ],
    checks: ['Has PHP declaration', 'Has variables/access modifiers', 'Has output/returns', 'Has includes/namespace'],
    weight: 1.0
  },
  ruby: {
    patterns: [
      /def\s+\w+|class\s+\w+|module\s+\w+/,
      /require\s+|attr_accessor|attr_reader/,
      /end\s*$|do\s*\||\|.*\|/,
      /puts\s+|return\s+|@\w+/,
    ],
    checks: ['Has method/class definitions', 'Has requires/attributes', 'Has Ruby syntax', 'Has output/instance vars'],
    weight: 1.0
  },
  kotlin: {
    patterns: [
      /fun\s+\w+\s*\(|class\s+\w+|object\s+\w+/,
      /val\s+\w+|var\s+\w+|import\s+\w+/,
      /:\s*(Int|String|Boolean|List|Map)|->|suspend\s+fun/,
      /return\s+|when\s*\{|if\s*\(/,
    ],
    checks: ['Has function/class definitions', 'Has variable declarations', 'Has Kotlin types', 'Has control flow'],
    weight: 1.0
  },
  swift: {
    patterns: [
      /func\s+\w+\s*\(|class\s+\w+|struct\s+\w+|enum\s+\w+/,
      /let\s+\w+|var\s+\w+|import\s+\w+/,
      /:\s*(Int|String|Bool|Array|Dictionary)|->|guard\s+let/,
      /return\s+|if\s+let|switch\s+\w+/,
    ],
    checks: ['Has function/type definitions', 'Has variable declarations', 'Has Swift types', 'Has control flow'],
    weight: 1.0
  },
  html: {
    patterns: [
      /<html|<body|<head|<div|<section|<!DOCTYPE/i,
      /<\/\w+>/,
      /<(script|style|link|meta)/i,
    ],
    checks: ['Has HTML structure', 'Has closing tags', 'Has resources/metadata'],
    weight: 0.8
  },
  css: {
    patterns: [
      /\.\w+\s*\{|#\w+\s*\{|\w+\s*\{/,
      /:\s*(#[0-9a-f]+|rgb|hsl|\d+px|\d+em|flex|grid)/i,
      /@media|@keyframes|@import/,
    ],
    checks: ['Has selectors', 'Has property values', 'Has at-rules'],
    weight: 0.8
  },
  sql: {
    patterns: [
      /SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER/i,
      /FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING/i,
      /PRIMARY KEY|FOREIGN KEY|INDEX|CONSTRAINT/i,
    ],
    checks: ['Has SQL commands', 'Has query clauses', 'Has constraints'],
    weight: 0.9
  },
};

// Validate generated code quality with improved algorithm
function validateCode(code: string, language: string): { isValid: boolean; score: number; issues: string[] } {
  const issues: string[] = [];
  let score = 100;
  let bonusScore = 0;
  
  // Get language weight (some languages are harder to validate)
  const validation = CODE_VALIDATION_PATTERNS[language];
  const languageWeight = validation?.weight || 0.9;
  
  // Check for truncation patterns
  const truncationPatterns = [
    /\.\.\.$/,
    /\/\/\s*\.\.\.$/,
    /#\s*\.\.\.$/,
    /\/\/\s*rest of code/i,
    /\/\/\s*more code here/i,
    /\/\/\s*TODO:/i,
    /\/\*\s*\.\.\.\s*\*\/$/,
  ];
  
  for (const pattern of truncationPatterns) {
    if (pattern.test(code.trim())) {
      issues.push('Code appears truncated');
      score -= 20;
      break;
    }
  }
  
  // Check for incomplete code blocks (brace-based languages)
  const braceLanguages = ['javascript', 'typescript', 'java', 'cpp', 'csharp', 'go', 'rust', 'kotlin', 'swift', 'php'];
  if (braceLanguages.includes(language)) {
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    const braceDiff = Math.abs(openBraces - closeBraces);
    
    if (braceDiff > 0) {
      issues.push(`Unbalanced braces (${braceDiff} missing)`);
      score -= Math.min(braceDiff * 5, 15);
    }
  }
  
  // Check for incomplete parentheses
  const openParens = (code.match(/\(/g) || []).length;
  const closeParens = (code.match(/\)/g) || []).length;
  const parenDiff = Math.abs(openParens - closeParens);
  
  if (parenDiff > 0) {
    issues.push(`Unbalanced parentheses (${parenDiff} missing)`);
    score -= Math.min(parenDiff * 3, 10);
  }
  
  // Check for incomplete brackets (arrays)
  const openBrackets = (code.match(/\[/g) || []).length;
  const closeBrackets = (code.match(/\]/g) || []).length;
  const bracketDiff = Math.abs(openBrackets - closeBrackets);
  
  if (bracketDiff > 0) {
    issues.push(`Unbalanced brackets (${bracketDiff} missing)`);
    score -= Math.min(bracketDiff * 3, 10);
  }
  
  // Language-specific validation with weighted scoring
  if (validation) {
    const patternCount = validation.patterns.length;
    let matchedPatterns = 0;
    
    validation.patterns.forEach((pattern, index) => {
      if (pattern.test(code)) {
        matchedPatterns++;
      } else {
        issues.push(`Missing: ${validation.checks[index]}`);
      }
    });
    
    // Calculate pattern match percentage
    const matchPercentage = matchedPatterns / patternCount;
    if (matchPercentage < 1) {
      score -= Math.round((1 - matchPercentage) * 15 * languageWeight);
    }
    
    // Bonus for matching all patterns
    if (matchPercentage === 1) {
      bonusScore += 3;
    }
  }
  
  // Check minimum code length based on language complexity
  const minLengths: Record<string, number> = {
    html: 100, css: 50, sql: 30,
    javascript: 80, typescript: 100, python: 60,
    java: 150, cpp: 120, csharp: 150,
    go: 80, rust: 100, php: 80, ruby: 60,
    kotlin: 100, swift: 100
  };
  
  const minLength = minLengths[language] || 50;
  if (code.length < minLength) {
    issues.push(`Code is short (min ${minLength} chars)`);
    score -= 15;
  } else if (code.length > minLength * 3) {
    // Bonus for comprehensive code
    bonusScore += 2;
  }
  
  // Check for comments (bonus for well-documented code)
  const commentPatterns = [/\/\//, /\/\*/, /#(?!\!)|"""/, /<!--/];
  const hasComments = commentPatterns.some(p => p.test(code));
  if (hasComments) {
    bonusScore += 2;
  }
  
  // Check for proper imports/dependencies
  const importPatterns: Record<string, RegExp> = {
    javascript: /import\s+|require\s*\(/,
    typescript: /import\s+|require\s*\(/,
    python: /import\s+|from\s+\w+\s+import/,
    java: /import\s+java\.|import\s+\w+\./,
    cpp: /#include\s*[<"]/,
    csharp: /using\s+\w+;/,
    go: /import\s+[\("]/,
    rust: /use\s+\w+/,
    php: /require|include|use\s+\w+/,
    ruby: /require\s+['"]|require_relative/,
    kotlin: /import\s+\w+/,
    swift: /import\s+\w+/,
  };
  
  const importPattern = importPatterns[language];
  if (importPattern && importPattern.test(code)) {
    bonusScore += 2;
  }
  
  // Calculate final score with bonus (cap at 100)
  const finalScore = Math.min(100, Math.max(0, score + bonusScore));
  
  return {
    isValid: finalScore >= 70,
    score: finalScore,
    issues: issues.length > 0 ? issues : ['Code looks good']
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
              maxOutputTokens: 32000,
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
            maxOutputTokens: 32000,
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
