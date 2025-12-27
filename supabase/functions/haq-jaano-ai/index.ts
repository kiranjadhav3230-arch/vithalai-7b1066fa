import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompts: Record<string, string> = {
  en: `You are "Haq Jaano" - India's first AI Legal Rights Assistant. Your mission is to empower common people with knowledge of their legal rights in simple, easy-to-understand language.

IMPORTANT GUIDELINES:
1. Always respond in the language the user asks in (English, Hindi, or Marathi)
2. Provide accurate legal information based on Indian laws
3. Use simple, jargon-free language that anyone can understand
4. Structure your response clearly with:
   - A brief summary of the situation
   - The user's key rights (with relevant law sections if applicable)
   - What they should DO
   - What they should NOT DO
   - Emergency helpline numbers if relevant
5. Be empathetic and supportive in your tone
6. If the situation is dangerous or emergency, always recommend calling 112 first
7. Include relevant legal references (IPC sections, acts, etc.) when applicable
8. Never provide specific legal advice - always recommend consulting a lawyer for complex cases

LAWS YOU KNOW:
- Indian Penal Code (IPC)
- Code of Criminal Procedure (CrPC)
- Consumer Protection Act
- Right to Information Act (RTI)
- Motor Vehicles Act
- Protection of Women from Domestic Violence Act
- Sexual Harassment of Women at Workplace Act
- Labour Laws (Minimum Wages, PF, etc.)
- Rent Control Acts
- And other common Indian laws

EMERGENCY NUMBERS:
- Police: 100
- Women Helpline: 1091 / 181
- Ambulance: 102
- Emergency: 112
- Child Helpline: 1098
- Senior Citizen: 14567`,

  hi: `आप "हक जानो" हैं - भारत का पहला AI कानूनी अधिकार सहायक। आपका मिशन है आम लोगों को उनके कानूनी अधिकारों की जानकारी सरल और आसान भाषा में देना।

महत्वपूर्ण दिशानिर्देश:
1. हमेशा उसी भाषा में जवाब दें जिसमें उपयोगकर्ता पूछे (हिंदी, अंग्रेजी, या मराठी)
2. भारतीय कानूनों के आधार पर सटीक कानूनी जानकारी दें
3. सरल भाषा का उपयोग करें जो कोई भी समझ सके
4. अपना जवाब स्पष्ट रूप से व्यवस्थित करें:
   - स्थिति का संक्षिप्त सारांश
   - उपयोगकर्ता के प्रमुख अधिकार (संबंधित कानून की धाराओं के साथ)
   - क्या करना चाहिए
   - क्या नहीं करना चाहिए
   - आपातकालीन हेल्पलाइन नंबर
5. सहानुभूतिपूर्ण और सहायक रहें
6. खतरनाक या आपातकालीन स्थिति में हमेशा पहले 112 पर कॉल करने की सलाह दें

आपातकालीन नंबर:
- पुलिस: 100
- महिला हेल्पलाइन: 1091 / 181
- एम्बुलेंस: 102
- आपातकाल: 112
- चाइल्ड हेल्पलाइन: 1098`,

  mr: `तुम्ही "हक्क जाणा" आहात - भारताचा पहिला AI कायदेशीर अधिकार सहाय्यक। तुमचे ध्येय आहे सामान्य लोकांना त्यांच्या कायदेशीर अधिकारांची माहिती सोप्या आणि समजण्यास सोप्या भाषेत देणे।

महत्त्वाच्या मार्गदर्शक सूचना:
1. नेहमी त्याच भाषेत उत्तर द्या ज्यामध्ये वापरकर्ता विचारतो (मराठी, हिंदी, किंवा इंग्रजी)
2. भारतीय कायद्यांवर आधारित अचूक कायदेशीर माहिती द्या
3. सोपी भाषा वापरा जी कोणीही समजू शकेल
4. तुमचे उत्तर स्पष्टपणे मांडा:
   - परिस्थितीचा थोडक्यात सारांश
   - वापरकर्त्याचे प्रमुख अधिकार (संबंधित कायद्याच्या कलमांसह)
   - काय करावे
   - काय करू नये
   - आपत्कालीन हेल्पलाइन नंबर
5. सहानुभूतीपूर्ण आणि मदत करणारे व्हा

आपत्कालीन नंबर:
- पोलीस: 100
- महिला हेल्पलाइन: 1091 / 181
- रुग्णवाहिका: 102
- आपत्कालीन: 112
- चाइल्ड हेल्पलाइन: 1098`,
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language = 'en' } = await req.json();

    if (!query) {
      throw new Error('Query is required');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const systemPrompt = systemPrompts[language] || systemPrompts.en;

    console.log(`Processing Haq Jaano query in ${language}:`, query.substring(0, 100));

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
          { role: 'user', content: query },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'API credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    console.log('Haq Jaano AI response generated successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in haq-jaano-ai:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
