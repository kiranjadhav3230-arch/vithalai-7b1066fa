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

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build language-specific prompt
    const languageInstructions = {
      en: 'Respond in English',
      hi: 'Respond in Hindi (हिंदी में जवाब दें)',
      mr: 'Respond in Marathi (मराठीत उत्तर द्या)'
    };

    // Build location context with current date/time for live weather inference
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const season = currentMonth >= 6 && currentMonth <= 9 ? 'monsoon/rainy' : 
                   currentMonth >= 3 && currentMonth <= 5 ? 'summer/hot' : 
                   currentMonth >= 10 && currentMonth <= 11 ? 'post-monsoon/autumn' : 'winter/cold';
    
    // Check if this is a comprehensive report request
    const isComprehensiveReport = message.includes('COMPREHENSIVE AGRICULTURAL ANALYSIS REPORT') || 
                                   message.includes('LIVE WEATHER CONDITIONS') ||
                                   message.includes('WEEKLY ACTION PLAN');

    let systemPrompt = '';
    
    if (isComprehensiveReport) {
      systemPrompt = `You are VITHAL - an expert agricultural advisor. Follow the EXACT format and structure provided in the user's request. 
      
CRITICAL INSTRUCTIONS:
1. Generate ALL 9 sections mentioned in the request
2. Use the EXACT section headers and formatting provided
3. Be SPECIFIC with product names, quantities, dosages, and timings
4. Include BOTH organic and chemical options for every treatment
5. Make recommendations ACTIONABLE and PRACTICAL for farmers
6. ${languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en}

DO NOT give a generic introduction. START DIRECTLY with Section 1 (Weather Conditions).
DO NOT skip any section. ALL 9 sections are MANDATORY.`;
    } else {
      let locationContext = '';
      if (location) {
        locationContext = `

🌍 **CRITICAL LOCATION & DATE CONTEXT**:
- Location: ${location.name || `${location.lat}, ${location.lng}`}
- Current Date: ${currentDateStr} (${currentDay}/${currentMonth}/${currentYear})
- Current Season: ${season}
- Region: India (likely Maharashtra/agricultural region)

📡 **LIVE WEATHER INFERENCE (MUST DO FIRST)**:
Before answering any agricultural question, you MUST first infer/search the current live weather conditions for "${location.name || 'this location'}" on ${currentDateStr}:
- Current Temperature (approximate based on location + date)
- Humidity levels
- Recent rainfall patterns
- Weather forecast considerations
- Any seasonal weather patterns

🌤️ **WEATHER-INFORMED ADVICE**:
All your advice MUST consider the current weather conditions:
- How weather affects pest/disease spread
- Best timing for pesticide/fertilizer application
- Irrigation needs based on current conditions
- Weather-specific treatment recommendations
- Protection measures for current weather`;
      } else {
        locationContext = `

📅 **DATE CONTEXT**: Current date is ${currentDateStr}, season is ${season}.
Provide advice appropriate for this time of year in Indian agricultural context.`;
      }

      systemPrompt = `You are "VITHAL" - a highly knowledgeable and friendly AI agricultural expert companion. Your name is Vithal and you specialize in crop health, plant diseases, farming practices, and sustainable agriculture.

🌟 YOUR IDENTITY:
- Your name is VITHAL - always introduce yourself as Vithal
- You are the farmer's best friend and knowledgeable companion
- Warm, friendly, supportive, and highly intelligent about agriculture
- Start responses with phrases like "Hey! Vithal here..." or "Namaste! मी विठ्ठल, तुमचा शेती मित्र..."

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

As Vithal, provide practical, actionable advice that farmers can implement. Use simple language and explain technical terms. When discussing treatments, provide both organic and chemical options where applicable. Always be friendly and encouraging as their trusted agricultural friend Vithal. 💚`;
    }

    // Build conversation messages for Lovable AI
    const messages: any[] = [
      { role: 'system', content: systemPrompt }
    ];

    // Add chat history (last 10 messages for context) - only for regular chat, not reports
    if (!isComprehensiveReport && chatHistory.length > 0) {
      const recentHistory = chatHistory.slice(-10);
      for (const msg of recentHistory) {
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      }
    }

    // Add the actual user message
    messages.push({ role: 'user', content: message });

    console.log('Sending crop chat request to Lovable AI...');
    console.log('Is comprehensive report:', isComprehensiveReport);

    // Call Lovable AI Gateway
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: isComprehensiveReport ? 16000 : 8000,
        temperature: isComprehensiveReport ? 0.4 : 0.7,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment and try again.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your Lovable AI workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Lovable AI API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0]?.message?.content) {
      throw new Error('Invalid response from Lovable AI API');
    }

    const aiResponse = data.choices[0].message.content;
    console.log('Crop chat response received, length:', aiResponse.length);

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
