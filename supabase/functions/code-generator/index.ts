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

    const hfToken = Deno.env.get('HF_API_TOKEN');
    if (!hfToken) {
      throw new Error('HF_API_TOKEN not found');
    }

    let model = 'bigcode/starcoder2-3b';
    let systemPrompt = '';

    // Configure model and prompt based on task
    switch (task) {
      case 'generate':
        systemPrompt = `You are an expert ${language} programmer. Generate clean, efficient, and well-commented code based on the user's request. Only return the code without explanations.`;
        break;
      case 'explain':
        model = 'microsoft/DialoGPT-medium';
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

    const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: `${systemPrompt}\n\nUser request: ${prompt}`,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.1,
          do_sample: true,
          top_p: 0.95,
          return_full_text: false
        },
        options: {
          wait_for_model: true
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Hugging Face API error:', errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('HF Response:', result);

    let generatedCode = '';
    if (Array.isArray(result) && result.length > 0) {
      generatedCode = result[0].generated_text || result[0].text || '';
    } else if (result.generated_text) {
      generatedCode = result.generated_text;
    } else {
      throw new Error('Unexpected response format from Hugging Face');
    }

    // Clean up the generated code
    generatedCode = generatedCode.trim();
    
    // Remove system prompt if it appears in response
    if (generatedCode.includes(systemPrompt)) {
      generatedCode = generatedCode.replace(systemPrompt, '').trim();
    }

    return new Response(JSON.stringify({ 
      code: generatedCode,
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