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
    const { prompt, language, task, sourceLanguage, targetLanguage } = await req.json();
    console.log('Code generation request:', { language, task, sourceLanguage, targetLanguage, promptLength: prompt?.length });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
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

    const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-pro-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
          ],
          max_tokens: 4096,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      }
      if (response.status === 402) {
        throw new Error('Payment required. Please add credits to your Lovable AI workspace.');
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log('AI response received');

    const generatedCode = data.choices?.[0]?.message?.content || '';
    
    if (!generatedCode) {
      throw new Error('No code generated from Gemini API');
    }

    // Clean up the code - remove markdown code blocks if present
    let cleanCode = generatedCode.trim();
    if (cleanCode.startsWith('```')) {
      // Remove opening code fence
      cleanCode = cleanCode.replace(/^```[\w]*\n/, '');
      // Remove closing code fence
      cleanCode = cleanCode.replace(/\n```$/, '');
    }

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
