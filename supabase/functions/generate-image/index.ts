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

      // Step 2: Use Imagen to generate the edited image based on the enhanced prompt
      const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(imagenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: [{ prompt: editedPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            negativePrompt: "blurry, low quality, distorted, ugly",
            safetyFilterLevel: "block_medium_and_above",
            personGeneration: "allow_adult"
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Imagen generation error:', response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw new Error(`Image generation failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const imageBytes = data.predictions?.[0]?.bytesBase64Encoded;
      if (!imageBytes) {
        console.error('No image in response:', JSON.stringify(data));
        throw new Error('No edited image generated');
      }

      return new Response(
        JSON.stringify({ 
          imageUrl: `data:image/png;base64,${imageBytes}`,
          description: 'Image edited successfully'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Image generation with Imagen
    const imagenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${GEMINI_API_KEY}`;
    
    const requestBody = {
      instances: [{ prompt: enhancedPrompt }],
      parameters: {
        sampleCount: 1,
        aspectRatio: "1:1",
        negativePrompt: "blurry, low quality, distorted, ugly",
        safetyFilterLevel: "block_medium_and_above",
        personGeneration: "allow_adult"
      }
    };

    const response = await fetch(imagenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Imagen API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`Imagen API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Image generation response received');

    const imageBytes = data.predictions?.[0]?.bytesBase64Encoded;
    if (!imageBytes) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    const generatedImageUrl = `data:image/png;base64,${imageBytes}`;

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
