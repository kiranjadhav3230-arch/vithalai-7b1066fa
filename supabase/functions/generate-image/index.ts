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

    const GETIMG_API_KEY = Deno.env.get('GETIMG_API_KEY');
    if (!GETIMG_API_KEY) {
      console.error('GETIMG_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'GetImg.ai API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating image with GetImg.ai for prompt:', prompt, 'language:', language, 'style:', style);

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

    // GetImg.ai FLUX Schnell only supports text-to-image, not image editing
    if (imageUrl) {
      console.log('Note: Image editing is not supported with GetImg.ai FLUX Schnell model');
      return new Response(
        JSON.stringify({ error: 'Image editing is not supported with the current model. Only text-to-image generation is available.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating new image with GetImg.ai');
    
    const endpoint = 'https://api.getimg.ai/v1/flux-schnell/text-to-image';
    const requestBody: any = {
      prompt: enhancedPrompt,
      width: 1024,
      height: 1024,
      steps: 4,
      output_format: 'jpeg'
    };

    console.log('Calling GetImg.ai API...');

    // Call GetImg.ai API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GETIMG_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('GetImg.ai error:', response.status, errorText);
      throw new Error(`GetImg.ai API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Image generated successfully');

    // GetImg.ai returns base64 image in the 'image' field
    const base64Image = data.image;
    
    if (!base64Image) {
      console.error('No image data in response:', data);
      throw new Error('No image data received from GetImg.ai');
    }

    // Return the base64 image data
    return new Response(
      JSON.stringify({ 
        imageUrl: `data:image/jpeg;base64,${base64Image}`,
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
