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
    const { prompt, language, task } = await req.json();
    console.log('Code generation request:', { language, task, promptLength: prompt?.length });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build comprehensive system prompt for code generation
    const systemPrompt = `You are an expert code generator specializing in ${language}. Your task is to ${task}.

CRITICAL INSTRUCTIONS:
- Generate COMPLETE, PRODUCTION-READY code
- Include ALL necessary imports, functions, and classes
- Add clear comments explaining key sections
- Follow best practices and modern syntax for ${language}
- Include error handling where appropriate
- Make the code fully functional and ready to use
- Generate between 100-500 lines of code depending on complexity
- Do NOT truncate or abbreviate the code
- Provide the FULL implementation

Generate clean, well-structured ${language} code with proper formatting.`;

    const response = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
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
      JSON.stringify({ code: cleanCode }),
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
