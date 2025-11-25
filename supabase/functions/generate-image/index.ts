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
      // Step 1: Analyze image with Gemini 2.5 Flash
      const base64Match = imageUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      const inputImageData = base64Match ? base64Match[2] : imageUrl;
      const inputMimeType = base64Match ? `image/${base64Match[1]}` : 'image/jpeg';

      const analysisUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const analysisResponse = await fetch(analysisUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: `Create a detailed prompt for image generation based on this image and requested changes: ${enhancedPrompt}. Be specific and detailed.` },
              { inline_data: { mime_type: inputMimeType, data: inputImageData } }
            ]
          }]
        }),
      });

      if (!analysisResponse.ok) {
        const errorText = await analysisResponse.text();
        console.error('Analysis error:', analysisResponse.status, errorText);
        throw new Error(`Image analysis failed: ${analysisResponse.status}`);
      }

      const analysisData = await analysisResponse.json();
      const detailedPrompt = analysisData.candidates?.[0]?.content?.parts?.[0]?.text || enhancedPrompt;
      console.log('Enhanced prompt:', detailedPrompt);

      // Step 2: Generate with Imagen 3
      const imageGenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(imageGenUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: detailedPrompt,
          number_of_images: 1,
          aspect_ratio: "1:1",
          safety_filter_level: "block_some",
          person_generation: "allow_adult"
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Imagen error:', response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        throw new Error(`Image generation failed: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      const imageData = data.images?.[0]?.bytesBase64Encoded;
      
      if (!imageData) {
        console.error('No image in response:', JSON.stringify(data));
        throw new Error('No edited image generated');
      }

      return new Response(
        JSON.stringify({ 
          imageUrl: `data:image/png;base64,${imageData}`,
          description: 'Image edited successfully'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Image generation with Google Imagen 3
    const imageGenUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:generateImage?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(imageGenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: enhancedPrompt,
        number_of_images: 1,
        aspect_ratio: "1:1",
        safety_filter_level: "block_some",
        person_generation: "allow_adult"
      }),
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

    const imageData = data.images?.[0]?.bytesBase64Encoded;
    
    if (!imageData) {
      console.error('No image in response:', JSON.stringify(data));
      throw new Error('No image generated');
    }

    return new Response(
      JSON.stringify({ 
        imageUrl: `data:image/png;base64,${imageData}`,
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
