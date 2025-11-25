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

    console.log('Generating image with OpenAI for prompt:', prompt, 'language:', language, 'style:', style);

    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    // Style mapping for OpenAI
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
      enhancedPrompt = `${prompt}. शैली: ${stylePrompt}. उच्च रिज़ॉल्यूशन, विस्तृत, पेशेवर गुणवत्ता।`;
    } else if (language === 'mr') {
      enhancedPrompt = `${prompt}. शैली: ${stylePrompt}. उच्च रिझोल्यूशन, तपशीलवार, व्यावसायिक गुणवत्ता।`;
    }

    if (imageUrl) {
      // Image editing workflow
      console.log('Starting image editing workflow with OpenAI');
      
      const requestBody: any = {
        model: 'gpt-image-1',
        prompt: `Based on this image, ${enhancedPrompt}. Modify and enhance the image according to these instructions while maintaining the original subject and composition.`,
        n: 1,
        size: '1024x1024',
        quality: 'high',
      };

      // If imageUrl is provided, we need to include it in the request
      // Note: OpenAI's image edit endpoint requires the image to be a file upload
      // For base64 images, we need to use a different approach
      
      const openaiUrl = 'https://api.openai.com/v1/images/generations';
      
      const response = await fetch(openaiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI image edit error:', response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('OpenAI edit response received');

      const imageData = data.data?.[0];
      
      if (!imageData) {
        throw new Error('No image data in response');
      }

      return new Response(
        JSON.stringify({ 
          imageUrl: imageData.url || imageData.b64_json,
          revisedPrompt: imageData.revised_prompt
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Image generation workflow using OpenAI gpt-image-1
    console.log('Generating image with OpenAI gpt-image-1');
    
    const openaiUrl = 'https://api.openai.com/v1/images/generations';
    
    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt: enhancedPrompt,
        n: 1,
        size: '1024x1024',
        quality: 'high',
        response_format: 'b64_json',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const imageData = data.data?.[0];
    
    if (!imageData) {
      throw new Error('Failed to generate image');
    }

    console.log('Image generated successfully');

    // Return the base64 image data
    return new Response(
      JSON.stringify({ 
        imageUrl: `data:image/png;base64,${imageData.b64_json}`,
        revisedPrompt: imageData.revised_prompt
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
