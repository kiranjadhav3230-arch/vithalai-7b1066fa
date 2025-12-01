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
    const { message, language = 'en', chatHistory = [], location } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    // Build language-specific prompt
    const languageInstructions = {
      en: 'Respond in English',
      hi: 'Respond in Hindi (हिंदी में जवाब दें)',
      mr: 'Respond in Marathi (मराठीत उत्तर द्या)'
    };

    // Build location context
    let locationContext = '';
    if (location) {
      const currentMonth = new Date().getMonth() + 1;
      const season = currentMonth >= 6 && currentMonth <= 9 ? 'monsoon' : 
                     currentMonth >= 3 && currentMonth <= 5 ? 'summer' : 'winter';
      
      locationContext = `

Location Context: ${location.name || `${location.lat}, ${location.lng}`}
Current Season: ${season}

When providing advice, consider:
- Regional pests and diseases common in this area during this season
- Local weather patterns and their impact on crop health
- Season-specific agricultural practices for this region`;
    }

    const systemPrompt = `You are an expert agricultural AI assistant specializing in crop health, plant diseases, farming practices, and sustainable agriculture. 

Your expertise includes:
- Disease identification and treatment
- Nutrient deficiency analysis and solutions
- Pest control (organic and chemical methods)
- Soil health management
- Irrigation best practices
- Crop rotation and intercropping
- Organic farming techniques
- Seasonal planting advice
- Fertilizer recommendations
- Weather-related crop protection
- Post-harvest management${locationContext}

${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en}

Provide practical, actionable advice that farmers can implement. Use simple language and explain technical terms. When discussing treatments, provide both organic and chemical options where applicable.`;

    // Build conversation history for context
    const messages = [
      { role: 'user', parts: [{ text: systemPrompt }] }
    ];

    // Add chat history (last 10 messages for context)
    const recentHistory = chatHistory.slice(-10);
    for (const msg of recentHistory) {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: messages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 8000,
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

    const aiResponse = data.candidates[0].content.parts[0].text;

    return new Response(
      JSON.stringify({
        response: aiResponse,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error: any) {
    console.error('Crop chat error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process chat message',
        details: error.toString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
