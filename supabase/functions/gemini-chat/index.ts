import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = "AIzaSyD8lfrlM6EEvNy8euGVaJ_Bg48Lm39R3Ig";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language = 'english' } = await req.json();
    console.log('Received message:', message, 'Language:', language);

    const systemPrompt = `You are Vithal AI Assistant, a career guidance AI specifically designed for Indian youth. Your role is to help young people discover their ideal career paths through personalized advice.

Instructions:
- Always respond in ${language} language
- Focus on career guidance, skill development, and educational opportunities
- Provide practical, actionable advice relevant to the Indian job market
- Be encouraging and supportive
- Ask follow-up questions to better understand their interests and goals
- Suggest relevant skills to develop and courses to take
- Keep responses conversational and engaging
- If asked about non-career topics, gently redirect to career-related discussions

Remember: You are here to empower Indian youth with AI-powered career guidance.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `User message: ${message}` }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);
    
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

    return new Response(JSON.stringify({ 
      response: aiResponse,
      courseSuggestions: generateCourseSuggestions(message)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(JSON.stringify({ 
      error: 'Sorry, there was an error processing your request. Please try again.',
      response: 'I apologize, but I am experiencing technical difficulties. Please try sending your message again.'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function generateCourseSuggestions(message: string): string[] {
  const courses: { [key: string]: string[] } = {
    'programming': [
      'Learn Python Programming - Complete Course',
      'JavaScript Full Course for Beginners',
      'React JS Tutorial for Beginners',
      'Java Programming Tutorial',
      'Web Development Complete Course'
    ],
    'design': [
      'Graphic Design Tutorial for Beginners',
      'UI/UX Design Complete Course',
      'Adobe Photoshop Tutorial',
      'Figma Design Tutorial',
      'Logo Design Masterclass'
    ],
    'marketing': [
      'Digital Marketing Complete Course',
      'Social Media Marketing Tutorial',
      'Content Marketing Strategy',
      'SEO Tutorial for Beginners',
      'Email Marketing Course'
    ],
    'business': [
      'Business Communication Skills',
      'Entrepreneurship Complete Guide',
      'Financial Literacy Course',
      'Leadership Development',
      'Project Management Tutorial'
    ],
    'data': [
      'Data Science Complete Course',
      'Excel Tutorial for Beginners',
      'SQL Database Tutorial',
      'Data Analysis with Python',
      'Machine Learning Course'
    ]
  };

  const messageLower = message.toLowerCase();
  
  if (messageLower.includes('programming') || messageLower.includes('coding') || messageLower.includes('software')) {
    return courses['programming'];
  } else if (messageLower.includes('design') || messageLower.includes('creative') || messageLower.includes('art')) {
    return courses['design'];
  } else if (messageLower.includes('marketing') || messageLower.includes('business') || messageLower.includes('sales')) {
    return courses['marketing'];
  } else if (messageLower.includes('data') || messageLower.includes('analytics') || messageLower.includes('statistics')) {
    return courses['data'];
  } else {
    return courses['business'];
  }
}