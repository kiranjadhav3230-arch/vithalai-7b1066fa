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
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ 
        error: 'API key missing',
        response: 'Lovable API key not configured'
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

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limits exceeded, please try again later.',
          response: 'Service is busy. Please try again in a moment.'
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'Payment required',
          response: 'Service temporarily unavailable. Please try again later.'
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: `Lovable AI error: ${response.status}`,
        response: 'Sorry, there was an error with the AI service.'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, no response generated.';

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
