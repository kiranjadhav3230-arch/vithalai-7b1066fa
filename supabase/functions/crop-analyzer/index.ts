import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { image, language = 'en', location } = await req.json();

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

    // Build location context with current date/time for live weather inference
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    const currentYear = currentDate.getFullYear();
    const season = currentMonth >= 6 && currentMonth <= 9 ? 'monsoon/rainy' : 
                   currentMonth >= 3 && currentMonth <= 5 ? 'summer/hot' : 
                   currentMonth >= 10 && currentMonth <= 11 ? 'post-monsoon/autumn' : 'winter/cold';
    
    let locationContext = '';
    if (location) {
      locationContext = `

🌍 **CRITICAL LOCATION & WEATHER CONTEXT** (MUST ANALYZE FIRST):
- Location: ${location.name || `${location.lat}, ${location.lng}`}
- Current Date: ${currentDateStr} (${currentDay}/${currentMonth}/${currentYear})
- Current Season: ${season}
- Region: India (likely Maharashtra/agricultural region)

📡 **STEP 1 - LIVE WEATHER INFERENCE (DO THIS FIRST)**:
Based on the location "${location.name || 'this region'}" and current date ${currentDateStr}, you MUST first search/infer the current live weather conditions:
- Current Temperature (approximate)
- Humidity levels
- Recent rainfall (last 7 days)
- Weather forecast for next few days
- Any extreme weather alerts

Use your knowledge of typical weather patterns for this location during ${season} season in ${currentMonth}/${currentYear}.

📋 **STEP 2 - WEATHER-INFORMED ANALYSIS**:
After determining weather, include in your analysis:
7. **🌤️ Current Weather Conditions**: Based on ${location.name || 'this location'} on ${currentDateStr}, provide inferred live weather (temperature, humidity, rainfall, conditions).
8. **🐛 Regional Pest & Disease Alerts**: Based on current weather + location, list active pest/disease threats RIGHT NOW.
9. **🌱 Weather-Based Care Tips**: Specific advice considering current weather conditions for disease prevention and treatment.
10. **⚠️ Weather Impact on Treatment**: How current weather affects pesticide/fertilizer application timing.`;
    } else {
      locationContext = `

📅 **DATE CONTEXT**: Current date is ${currentDateStr}, season is ${season}.
Please provide general advice appropriate for this time of year in Indian agricultural context.`;
    }

    // Specialized agricultural analysis prompt
    const systemPrompt = `You are "VITHAL" - a highly knowledgeable and friendly AI agricultural expert companion specializing in plant health diagnosis. Your name is Vithal and you are the farmer's best friend.

🌟 YOUR IDENTITY:
- Your name is VITHAL - always introduce yourself as Vithal
- Start your analysis with "Hey! Vithal here with your crop analysis..." or "Namaste! मी विठ्ठल, तुमच्या पिकाचे विश्लेषण..."

Analyze the uploaded plant/leaf image and provide:

1. **Disease Detection**: Identify any fungal, bacterial, viral diseases, or pest damage. Be specific about the disease name and symptoms visible.
2. **Nutrient Deficiency Analysis**: Check for signs of nitrogen (N), phosphorus (P), potassium (K), calcium (Ca), magnesium (Mg), or iron (Fe) deficiencies based on leaf color, patterns, and growth.
3. **Health Score**: Rate the overall plant health from 0-100 (0=critically ill, 100=perfectly healthy).
4. **Treatment Recommendations**: Provide both organic and chemical treatment options with specific product types or home remedies.
5. **Prevention Tips**: Suggest preventive measures to avoid future problems.
6. **Crop Type Identification**: If possible, identify the plant/crop type.${locationContext}

Format your response in a clear, structured way. Use simple language that farmers can understand. Support multilingual responses (English, Hindi, Marathi) based on the language parameter. Always be friendly and encouraging as Vithal - their trusted agricultural friend! 💚

Language: ${language}`;

    // Build content parts for Gemini API
    const contentParts: any[] = [{ text: systemPrompt }];
    
    // Add image
    const matches = image.match(/^data:([^;]+);base64,(.+)$/);
    if (matches) {
      contentParts.push({
        inline_data: {
          mime_type: matches[1],
          data: matches[2]
        }
      });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: contentParts }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 8000,
          }
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limits exceeded, please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
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
