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
    const { prompt, language = 'en', imageUrl, style = 'realistic' } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating image with Pollinations.ai for prompt:', prompt, 'language:', language, 'style:', style);

    // Style mapping for image generation
    const styleInstructions: Record<string, string> = {
      realistic: 'ultra-realistic, photorealistic, highly detailed, professional photography, 8K resolution',
      cartoon: 'cartoon style, animated, colorful, fun, playful illustration, vibrant colors',
      watercolor: 'watercolor painting, artistic, soft brushstrokes, painted texture, gentle colors',
      sketch: 'pencil sketch, hand-drawn, artistic lines, detailed drawing, black and white'
    };

    const stylePrompt = styleInstructions[style] || styleInstructions['realistic'];

    // Build enhanced prompt with language context
    let enhancedPrompt = `${prompt}. Style: ${stylePrompt}. High resolution, detailed, professional quality.`;
    
    if (language === 'hi') {
      enhancedPrompt = `${prompt}। शैली: ${stylePrompt}। उच्च रिज़ॉल्यूशन, विस्तृत, पेशेवर गुणवत्ता।`;
    } else if (language === 'mr') {
      enhancedPrompt = `${prompt}। शैली: ${stylePrompt}। उच्च रिझोल्यूशन, तपशीलवार, व्यावसायिक गुणवत्ता।`;
    }

    // Build Pollinations.ai URL
    const params = new URLSearchParams({
      width: '1024',
      height: '1024',
      model: imageUrl ? 'kontext' : 'flux',
      enhance: 'true',
      nologo: 'true',
      private: 'true'
    });

    // Add image parameter for image editing
    if (imageUrl) {
      console.log('Starting image editing workflow with Pollinations.ai');
      params.append('image', imageUrl);
    } else {
      console.log('Generating new image with Pollinations.ai');
    }

    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedPrompt)}?${params}`;
    console.log('Fetching from Pollinations.ai...');

    // Fetch the image
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pollinations.ai error:', response.status, errorText);
      throw new Error(`Pollinations.ai error: ${response.status} - ${errorText}`);
    }

    // Convert image to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    console.log('Image generated successfully');

    // Return the base64 image data
    return new Response(
      JSON.stringify({ 
        imageUrl: `data:${contentType};base64,${base64}`,
        revisedPrompt: enhancedPrompt
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in generate-image function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
