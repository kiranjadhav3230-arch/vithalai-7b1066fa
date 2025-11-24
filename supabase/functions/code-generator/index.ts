import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt, language = 'javascript', task = 'generate' } = await req.json();
    console.log(`Code generation request: ${task} in ${language}`);

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY not found');
    }

    let systemPrompt = '';

    // Configure prompt based on task
    switch (task) {
      case 'generate':
        systemPrompt = `You are an expert ${language} programmer. Generate clean, efficient, and well-commented code based on the user's request. Only return the code without explanations.`;
        break;
      case 'explain':
        systemPrompt = `You are a code tutor. Explain the provided ${language} code clearly and concisely, breaking down what each part does.`;
        break;
      case 'fix':
        systemPrompt = `You are a debugging expert. Analyze the ${language} code and provide the corrected version with comments explaining the fixes.`;
        break;
      case 'optimize':
        systemPrompt = `You are a performance expert. Optimize the provided ${language} code for better performance and readability. Return only the optimized code.`;
        break;
      case 'translate':
        systemPrompt = `You are a programming language expert. Translate the given code to ${language}. Maintain the same functionality and logic.`;
        break;
      default:
        systemPrompt = `You are a helpful ${language} programming assistant.`;
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser request: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 8000,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('Gemini Response received');

    const generatedCode = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!generatedCode) {
      throw new Error('No code generated from Gemini API');
    }

    return new Response(JSON.stringify({ 
      code: generatedCode.trim(),
      language,
      task
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in code-generator function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Failed to generate code. Please try again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});