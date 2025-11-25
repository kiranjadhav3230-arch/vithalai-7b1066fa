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

    // Style presets
    const styleInstructions: Record<string, string> = {
      realistic: 'ultra-realistic, photorealistic, highly detailed, professional photography, 8K resolution',
      cartoon: 'cartoon style, animated, colorful, fun, playful illustration, vibrant colors',
      watercolor: 'watercolor painting, artistic, soft brushstrokes, painted texture, gentle colors',
      sketch: 'pencil sketch, hand-drawn, artistic lines, detailed drawing, black and white'
    };

    const stylePrompt = styleInstructions[style] || styleInstructions['realistic'];

    // Build enhanced prompt with language context
    let enhancedPrompt = `Create a high-quality image: ${prompt}. Style: ${stylePrompt}. High resolution, detailed, professional quality.`;
    
    if (language === 'hi') {
      enhancedPrompt = `यह हिंदी विवरण के आधार पर एक उच्च गुणवत्ता वाली छवि बनाएं: ${prompt}. शैली: ${stylePrompt}. उच्च रिज़ॉल्यूशन, विस्तृत, पेशेवर गुणवत्ता।`;
    } else if (language === 'mr') {
      enhancedPrompt = `या मराठी वर्णनाच्या आधारावर उच्च दर्जाची प्रतिमा तयार करा: ${prompt}. शैली: ${stylePrompt}. उच्च रिझोल्यूशन, तपशीलवार, व्यावसायिक गुणवत्ता।`;
    }

    if (imageUrl) {
      // Image editing workflow
      console.log('Starting image editing workflow');
      
      const base64Match = imageUrl.match(/^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/);
      const imageData = base64Match ? base64Match[2] : imageUrl;
      const mimeType = base64Match ? `image/${base64Match[1]}` : 'image/jpeg';

      const editPrompt = `Based on this image, ${enhancedPrompt}. Modify and enhance the image according to these instructions while maintaining the original subject and composition.`;

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: editPrompt },
              { 
                inline_data: { 
                  mime_type: mimeType, 
                  data: imageData 
                } 
              }
            ]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini image edit error:', response.status, errorText);
        
        if (response.status === 429) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
            { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Gemini edit response received');

      // For image editing, we return a text description since Gemini doesn't support direct image output
      // The user would need to use the description with an image generation service
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!textResponse) {
        throw new Error('No response from Gemini');
      }

      return new Response(
        JSON.stringify({ 
          description: textResponse,
          message: 'Image editing description generated. Use this with an image generation service to create the edited image.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Image generation workflow using Gemini for description
    console.log('Generating image description with Gemini');
    
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Create a detailed, vivid image generation prompt based on this request: ${enhancedPrompt}. Make it extremely detailed and descriptive, focusing on visual elements, composition, lighting, colors, and atmosphere. Return ONLY the image description, nothing else.`
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const detailedPrompt = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!detailedPrompt) {
      throw new Error('Failed to generate image description');
    }

    console.log('Generated detailed prompt:', detailedPrompt);

    // Return the detailed description
    // Note: Gemini API doesn't directly support image generation in the free tier
    // Users would need to use this with an image generation service
    return new Response(
      JSON.stringify({ 
        description: detailedPrompt,
        message: 'Image description generated successfully. Use this detailed prompt with an image generation service.',
        prompt: enhancedPrompt
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
        details: 'Image generation requires a service with image generation capabilities. Gemini API free tier provides text descriptions only.'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
