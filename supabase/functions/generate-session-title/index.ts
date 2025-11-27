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
    const { content, type } = await req.json();
    console.log('Generating title for:', { type, contentLength: content?.length });

    if (!content) {
      throw new Error('Content is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = type === 'code' 
      ? 'Generate a short, descriptive title (max 6 words) for this code snippet. Focus on what the code does. Return ONLY the title text, nothing else.'
      : 'Generate a short, descriptive title (max 6 words) for this chat conversation. Focus on the main topic. Return ONLY the title text, nothing else.';

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: content.substring(0, 1000) } // Limit content size
        ],
        max_completion_tokens: 50,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      // Fallback titles
      const fallbackTitle = type === 'code' 
        ? 'Code Snippet' 
        : 'Chat Session';
      
      return new Response(
        JSON.stringify({ title: fallbackTitle }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    let title = data.choices?.[0]?.message?.content?.trim() || (type === 'code' ? 'Code Snippet' : 'Chat Session');
    
    // Clean up title - remove quotes if present
    title = title.replace(/^["']|["']$/g, '');
    
    // Ensure title is not too long
    if (title.length > 50) {
      title = title.substring(0, 47) + '...';
    }

    console.log('Generated title:', title);

    return new Response(
      JSON.stringify({ title }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-session-title function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        title: 'Untitled Session'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
