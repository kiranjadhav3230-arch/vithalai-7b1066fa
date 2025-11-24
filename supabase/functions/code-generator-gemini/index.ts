import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, language, task, sourceLanguage, targetLanguage, attachments } = await req.json();
    console.log('Code generation request:', { language, task, sourceLanguage, targetLanguage, promptLength: prompt?.length, attachments: attachments?.length });

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

    // Build task-specific system prompt
    let systemPrompt = '';
    
    if (task === 'generate') {
      systemPrompt = `You are an expert ${language} code generator.

INSTRUCTIONS:
- Generate COMPLETE, PRODUCTION-READY ${language} code
- Include ALL necessary imports, functions, and classes
- Add clear comments explaining key sections
- Follow best practices and modern syntax
- Include error handling where appropriate
- Make the code fully functional and ready to use
- Do NOT truncate or abbreviate the code`;
    } else if (task === 'explain') {
      systemPrompt = `You are an expert code explainer for ${language}.

INSTRUCTIONS:
- Provide a DETAILED explanation in plain text (NOT code)
- Explain what the code does line by line
- Highlight key concepts and patterns
- Explain the purpose and logic
- Make it easy to understand for learners
- Use clear, simple language`;
    } else if (task === 'fix') {
      systemPrompt = `You are an expert ${language} debugger.

INSTRUCTIONS:
- Analyze the code for bugs and issues
- Generate the FIXED version of the code
- Add comments explaining what was fixed and why
- Ensure the fixed code is complete and functional`;
    } else if (task === 'optimize') {
      systemPrompt = `You are an expert ${language} code optimizer.

INSTRUCTIONS:
- Analyze the code for performance and quality improvements
- Generate the OPTIMIZED version of the code
- Add comments explaining each optimization made
- List the optimizations at the top as comments
- Focus on: performance, readability, best practices, memory usage
- Ensure the optimized code is complete and functional`;
    } else if (task === 'translate') {
      // Code translation from one language to another
      if (sourceLanguage && targetLanguage) {
        systemPrompt = `You are an expert code translator.

INSTRUCTIONS:
- Translate the provided ${sourceLanguage} code to ${targetLanguage}
- Maintain the same functionality and logic
- Use idiomatic ${targetLanguage} patterns and syntax
- Follow ${targetLanguage} best practices and conventions
- Include necessary imports/dependencies for ${targetLanguage}
- Add comments explaining ${targetLanguage}-specific features used
- Ensure the translated code is COMPLETE and FUNCTIONAL
- Make the code ready to run in ${targetLanguage}`;
      } else {
        // Legacy support
        systemPrompt = `You are an expert code translator.

INSTRUCTIONS:
- Translate the provided code to ${language}
- Maintain the same functionality and logic
- Use idiomatic ${language} patterns and syntax
- Add comments explaining ${language}-specific features used
- Ensure the translated code is complete and functional`;
      }
    }
    
    systemPrompt += `\n\nGenerate clean, well-structured output with proper formatting.`;

    // Build user message with attachments if provided
    let contentParts: any[] = [];
    
    if (prompt) {
      contentParts.push({ text: prompt });
    } else if (attachments && attachments.length > 0) {
      contentParts.push({ text: 'Generate code based on the attached image/design.' });
    }
    
    // Add image attachments
    if (attachments && attachments.length > 0) {
      for (const att of attachments) {
        if (att.type === 'image') {
          // Extract base64 data
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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: systemPrompt },
              ...contentParts
            ]
          }],
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

    // Keep the raw response with markdown - client will parse it
    const cleanCode = generatedCode.trim();

    console.log('Code generation successful, length:', cleanCode.length);

    return new Response(
      JSON.stringify({ 
        code: cleanCode,
        translation: cleanCode // Support both for backwards compatibility
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
        code: '' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
