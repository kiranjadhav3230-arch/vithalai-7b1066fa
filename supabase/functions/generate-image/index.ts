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

    console.log('Generating image with Gemini for prompt:', prompt, 'language:', language, 'style:', style);

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }

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

    const model = 'gemini-2.0-flash-exp-image-generation';
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

    let requestBody: any = {
      contents: [{
        parts: []
      }],
      generationConfig: {
        responseModalities: ["TEXT", "IMAGE"]
      }
    };

    if (imageUrl) {
      // Image editing workflow
      console.log('Starting image editing workflow with Gemini');
      
      // Extract base64 data if it's a data URL
      let base64Data = imageUrl;
      let mimeType = 'image/png';
      
      if (imageUrl.startsWith('data:')) {
        const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        }
      }

      requestBody.contents[0].parts = [
        { text: `Based on this image, ${enhancedPrompt}. Modify and enhance the image according to these instructions while maintaining the original subject and composition.` },
        { 
          inlineData: { 
            data: base64Data, 
            mimeType: mimeType 
          } 
        }
      ];
    } else {
      // Image generation workflow
      console.log('Generating new image with Gemini');
      requestBody.contents[0].parts = [
        { text: enhancedPrompt }
      ];
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini response received');

    // Extract image from response
    const candidate = data.candidates?.[0];
    if (!candidate || !candidate.content || !candidate.content.parts) {
      console.error('Invalid response structure:', JSON.stringify(data));
      throw new Error('Invalid response from Gemini API');
    }

    // Find the image data in the parts
    const imagePart = candidate.content.parts.find((part: any) => part.inlineData);
    
    if (!imagePart || !imagePart.inlineData || !imagePart.inlineData.data) {
      console.error('No image data in response:', JSON.stringify(data));
      throw new Error('No image data in response');
    }

    const imageBase64 = imagePart.inlineData.data;
    const imageMimeType = imagePart.inlineData.mimeType || 'image/png';

    console.log('Image generated successfully');

    // Return the base64 image data
    return new Response(
      JSON.stringify({ 
        imageUrl: `data:${imageMimeType};base64,${imageBase64}`,
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
