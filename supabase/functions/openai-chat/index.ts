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
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'API key missing',
        response: 'Gemini API key not configured'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { message, language = 'en', userProfile = null } = await req.json();

    const profileText = userProfile ? `
    User Profile:
    - Name: ${userProfile.name || userProfile.display_name || userProfile.email?.split('@')[0] || 'दोस्त'}
    - Education: ${userProfile.education || 'Not specified'}
    - Skills: ${userProfile.skills?.join?.(', ') || userProfile.skills || 'Not specified'}
    - Interests: ${userProfile.interests?.join?.(', ') || userProfile.interests || 'Not specified'}
    - Experience: ${userProfile.experience || 'Not specified'}
    ` : '';

    const systemPrompt = `You are Vithal AI Assistant, a helpful career guidance counselor for Indian students. 
            
**LANGUAGE SUPPORT:**
- Always respond in the user's preferred language (English, Hindi, or Marathi)
- When language is "hi", respond in Hindi (हिंदी)
- When language is "mr", respond in Marathi (मराठी)  
- When language is "en", respond in English
- Current user language: ${language}

**CAPABILITIES:**
- Career guidance and counseling
- Academic help and study assistance  
- Course recommendations with 2024-2025 content
- Problem solving (math, science, etc.)
- Educational support for Indian students
- Professional development advice

**RESPONSE STYLE:**
- Be helpful, encouraging, and culturally sensitive
- Provide practical, actionable advice
- Include relevant examples for Indian context
- Keep responses concise but comprehensive
- Use appropriate greetings like "Namaste" when suitable

${profileText}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: `Gemini API error: ${response.status}`,
        response: 'Sorry, there was an error with the AI service.'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response generated.';

    return new Response(JSON.stringify({ 
      response: aiResponse,
      courseSuggestions: []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error.message,
      response: 'There was an error processing your request.'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
