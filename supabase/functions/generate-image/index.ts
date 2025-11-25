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
    const { prompt, language = 'en', imageUrl, style = 'realistic' } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating/editing image for prompt:', prompt, 'in language:', language, 'style:', style, 'with reference:', !!imageUrl);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Style presets mapping
    const styleInstructions: Record<string, string> = {
      realistic: 'ultra-realistic, photorealistic, highly detailed, professional photography',
      cartoon: 'cartoon style, animated, colorful, fun, playful illustration',
      watercolor: 'watercolor painting, artistic, soft brushstrokes, painted texture',
      sketch: 'pencil sketch, hand-drawn, artistic lines, detailed drawing'
    };

    const stylePrompt = styleInstructions[style] || styleInstructions['realistic'];

    // Add language context and style to the prompt
    let enhancedPrompt = prompt;
    if (language === 'hi') {
      enhancedPrompt = imageUrl 
        ? `Edit this image based on this Hindi description: ${prompt}. Understand the Hindi context and modify the image accordingly. Style: ${stylePrompt}.`
        : `Generate an image based on this Hindi description: ${prompt}. Understand the Hindi context and create an accurate visual representation. Style: ${stylePrompt}.`;
    } else if (language === 'mr') {
      enhancedPrompt = imageUrl
        ? `Edit this image based on this Marathi description: ${prompt}. Understand the Marathi context and modify the image accordingly. Style: ${stylePrompt}.`
        : `Generate an image based on this Marathi description: ${prompt}. Understand the Marathi context and create an accurate visual representation. Style: ${stylePrompt}.`;
    } else if (imageUrl) {
      enhancedPrompt = `Edit this image: ${prompt}. Style: ${stylePrompt}.`;
    } else {
      enhancedPrompt = `${prompt}. Style: ${stylePrompt}.`;
    }

    if (imageUrl) {
      // For image editing with reference image
      const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${LOVABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash-image-preview',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: enhancedPrompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          modalities: ['image', 'text']
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Image editing error:', response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        if (response.status === 402) {
          return new Response(
            JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
            { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw new Error(`Image editing failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const editedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      
      if (!editedImageUrl) {
        console.error('No image in response:', JSON.stringify(data));
        throw new Error('No edited image generated');
      }

      return new Response(
        JSON.stringify({ 
          imageUrl: editedImageUrl,
          description: 'Image edited successfully'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Image generation using Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: enhancedPrompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Image generation error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`Image generation failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Image generation response received');

    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!generatedImageUrl) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ 
        imageUrl: generatedImageUrl,
        description: 'Image generated successfully'
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
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
