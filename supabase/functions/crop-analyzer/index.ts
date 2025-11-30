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
    const { image, language = 'en' } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'Image is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Specialized agricultural analysis prompt
    const systemPrompt = `You are an expert agricultural AI assistant specializing in plant health diagnosis. Analyze the uploaded plant/leaf image and provide:

1. **Disease Detection**: Identify any fungal, bacterial, viral diseases, or pest damage. Be specific about the disease name and symptoms visible.
2. **Nutrient Deficiency Analysis**: Check for signs of nitrogen (N), phosphorus (P), potassium (K), calcium (Ca), magnesium (Mg), or iron (Fe) deficiencies based on leaf color, patterns, and growth.
3. **Health Score**: Rate the overall plant health from 0-100 (0=critically ill, 100=perfectly healthy).
4. **Treatment Recommendations**: Provide both organic and chemical treatment options with specific product types or home remedies.
5. **Prevention Tips**: Suggest preventive measures to avoid future problems.
6. **Crop Type Identification**: If possible, identify the plant/crop type.

Format your response in a clear, structured way. Use simple language that farmers can understand. Support multilingual responses (English, Hindi, Marathi) based on the language parameter.

Language: ${language}`;

    // Remove the data:image prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    // Call Gemini API with image
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: systemPrompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64Image
                }
              }
            ]
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const analysisText = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({
        analysis: analysisText,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Crop analyzer error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to analyze crop image',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
