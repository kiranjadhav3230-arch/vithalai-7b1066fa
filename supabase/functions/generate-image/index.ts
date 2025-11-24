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

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
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
      // Step 1: Use Gemini 2.5 Flash to analyze the image and create an enhanced prompt
      const base64Match = imageUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      const imageData = base64Match ? base64Match[2] : imageUrl;
      const mimeType = base64Match ? `image/${base64Match[1]}` : 'image/jpeg';

      const analysisUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const analysisBody = {
        contents: [
          {
            parts: [
              { 
                text: `Analyze this image and create a detailed image generation prompt that incorporates these changes: ${enhancedPrompt}. 
                Describe the complete scene including what should remain from the original and what should change. 
                Be specific about colors, style, composition, and details. Return only the prompt, nothing else.` 
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: imageData
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      };

      const analysisResponse = await fetch(analysisUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisBody),
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error('Gemini analysis error:', analysisResponse.status, errorText);
        throw new Error(`Image analysis failed: ${analysisResponse.status}`);
      }

      const analysisData = await analysisResponse.json();
      const editedPrompt = analysisData.candidates?.[0]?.content?.parts?.[0]?.text || enhancedPrompt;
      console.log('Generated edit prompt:', editedPrompt);

      // Step 2: Use Gemini 2.5 Flash to generate the edited image
      const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
      if (!LOVABLE_API_KEY) {
        throw new Error('LOVABLE_API_KEY is not configured');
      }

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
              content: editedPrompt
            }
          ],
          modalities: ['image', 'text']
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini generation error:', response.status, errorText);
        
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
      const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
      if (!imageUrl) {
        console.error('No image in response:', JSON.stringify(data));
        throw new Error('No edited image generated');
      }

      return new Response(
        JSON.stringify({ 
          imageUrl: imageUrl,
          description: 'Image edited successfully'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Image generation with Gemini 2.5 Flash
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

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
      console.error('Gemini API error:', response.status, errorText);
      
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

      throw new Error(`Gemini API error: ${response.status} ${errorText}`);
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
