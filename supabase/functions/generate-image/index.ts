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
    const { prompt, language = 'en', imageUrl } = await req.json();
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Prompt is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating/editing image for prompt:', prompt, 'in language:', language, 'with reference:', !!imageUrl);

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Add language context to the prompt if not in English
    let enhancedPrompt = prompt;
    if (language === 'hi') {
      enhancedPrompt = imageUrl 
        ? `Edit this image based on this Hindi description: ${prompt}. Understand the Hindi context and modify the image accordingly.`
        : `Generate an image based on this Hindi description: ${prompt}. Understand the Hindi context and create an accurate visual representation.`;
    } else if (language === 'mr') {
      enhancedPrompt = imageUrl
        ? `Edit this image based on this Marathi description: ${prompt}. Understand the Marathi context and modify the image accordingly.`
        : `Generate an image based on this Marathi description: ${prompt}. Understand the Marathi context and create an accurate visual representation.`;
    } else if (imageUrl) {
      enhancedPrompt = `Edit this image: ${prompt}`;
    }

    // Prepare message content for image generation or editing
    const messageContent: any = imageUrl 
      ? [
          { type: 'text', text: enhancedPrompt },
          { type: 'image_url', image_url: { url: imageUrl } }
        ]
      : enhancedPrompt;

    // Call Lovable AI Gateway for image generation/editing
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: messageContent
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
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

      throw new Error(`AI Gateway error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Image generation/editing response received');

    // Extract the generated image
    const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    const textResponse = data.choices?.[0]?.message?.content;

    if (!generatedImageUrl) {
      console.error('No image URL in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ 
        imageUrl: generatedImageUrl,
        description: textResponse || 'Image generated successfully'
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
