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
    const { message, language = 'english', userProfile } = await req.json();
    console.log('Received message:', message, 'Language:', language);

    // Enhanced system prompt with profile awareness
    const profileContext = userProfile ? `
    User Profile:
    - Education: ${userProfile.education || 'Not specified'}
    - Skills: ${userProfile.skills?.join?.(', ') || userProfile.skills || 'Not specified'}
    - Interests: ${userProfile.interests?.join?.(', ') || userProfile.interests || 'Not specified'}
    - Experience: ${userProfile.experience || 'Not specified'}
    ` : '';

    const systemPrompt = `You are Vithal AI Assistant, a specialized career guidance counselor for Indian youth. 
    ${profileContext}
    
    Provide personalized career advice in ${language}. 
    
    Guidelines:
    - Give practical, actionable career advice based on user's profile
    - Mention specific Indian colleges, companies, and career paths when relevant
    - Include detailed information about placements, packages, job prospects, college rankings
    - Provide specific YouTube video titles or playlist names (don't search, suggest exact names)
    - Include job ideas and business ideas relevant to their background
    - Be encouraging and supportive
    - Keep responses conversational and engaging
    - When discussing courses, recommend comprehensive courses that include all necessary skills
    - Analyze user's skills and suggest improvements or new skills to learn
    - For college queries, provide complete details including placement statistics, average packages, top recruiters
    
    If user asks about colleges, provide:
    - College name and location
    - Placement percentage
    - Average package ranges
    - Top recruiting companies
    - Course curriculum highlights
    - Infrastructure and facilities
    
    Always include job opportunities and business ideas relevant to their query.`;

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
          topK: 40,
          topP: 0.95,
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
      courseSuggestions: generateYouTubeSuggestions(message, userProfile)
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

// Generate YouTube course suggestions based on user message and profile
function generateYouTubeSuggestions(message: string, userProfile: any): string[] {
  const messageLower = message.toLowerCase();
  
  const youtubeChannels = {
    programming: [
      "Code with Harry - Complete Python Course",
      "Apna College - Java Full Course",
      "CodeHelp by Babbar - DSA Complete Course",
      "Chai aur Code - JavaScript Complete Series"
    ],
    webdev: [
      "Code with Harry - Complete Web Development",
      "Thapa Technical - MERN Stack Course",
      "Apna College - Web Development Bootcamp",
      "CodeStep by Step - Complete Web Development"
    ],
    mobile: [
      "Code with Harry - Android Development Course",
      "Coding in Flow - Complete Android Course",
      "Flutter Official - Flutter Course for Beginners",
      "Reso Coder - Clean Architecture Flutter"
    ],
    data: [
      "Code with Harry - Data Science Complete Course",
      "Krish Naik - Complete Machine Learning Playlist",
      "5 Minutes Engineering - Data Science Basics",
      "Analytics Vidhya - Python for Data Science"
    ],
    design: [
      "AJ&Smart - Complete UX/UI Design Course",
      "Design Course - Graphic Design Tutorials",
      "Figma Academy - Complete Figma Course",
      "Adobe Creative Cloud - Photoshop Tutorials"
    ],
    business: [
      "Think School Case Studies - Business Analysis",
      "Digital Marketing Course by WsCube Tech",
      "Sandeep Maheshwari - Entrepreneurship Videos",
      "Power of ICT - Complete Digital Marketing"
    ],
    engineering: [
      "GATE Wallah - Complete Engineering Preparation",
      "Unacademy GATE - Subject Wise Courses",
      "Made Easy - GATE Preparation Videos",
      "Physics Wallah - Engineering Mathematics"
    ],
    college: [
      "College Pravesh - Engineering Colleges Guide",
      "Shiksha.com - College Selection Guide",
      "Career Anna - Placement Preparation",
      "Placement Preparation - Interview Skills"
    ]
  };

  const suggestions: string[] = [];
  
  // Check user profile for personalized suggestions
  if (userProfile?.interests) {
    const interests = (Array.isArray(userProfile.interests) ? userProfile.interests.join(' ') : userProfile.interests).toLowerCase();
    if (interests.includes('programming') || interests.includes('coding')) {
      suggestions.push(...youtubeChannels.programming.slice(0, 1));
    }
    if (interests.includes('design') || interests.includes('creative')) {
      suggestions.push(...youtubeChannels.design.slice(0, 1));
    }
  }
  
  // Check message content
  if (messageLower.includes('programming') || messageLower.includes('coding') || messageLower.includes('developer')) {
    suggestions.push(...youtubeChannels.programming.slice(0, 2));
  }
  
  if (messageLower.includes('web') || messageLower.includes('website') || messageLower.includes('frontend') || messageLower.includes('backend')) {
    suggestions.push(...youtubeChannels.webdev.slice(0, 2));
  }
  
  if (messageLower.includes('mobile') || messageLower.includes('app') || messageLower.includes('android') || messageLower.includes('flutter')) {
    suggestions.push(...youtubeChannels.mobile.slice(0, 2));
  }
  
  if (messageLower.includes('data') || messageLower.includes('machine learning') || messageLower.includes('analytics')) {
    suggestions.push(...youtubeChannels.data.slice(0, 2));
  }
  
  if (messageLower.includes('design') || messageLower.includes('ui') || messageLower.includes('ux') || messageLower.includes('graphic')) {
    suggestions.push(...youtubeChannels.design.slice(0, 2));
  }
  
  if (messageLower.includes('business') || messageLower.includes('marketing') || messageLower.includes('entrepreneur')) {
    suggestions.push(...youtubeChannels.business.slice(0, 2));
  }
  
  if (messageLower.includes('engineering') || messageLower.includes('gate') || messageLower.includes('jee')) {
    suggestions.push(...youtubeChannels.engineering.slice(0, 2));
  }
  
  if (messageLower.includes('college') || messageLower.includes('placement') || messageLower.includes('admission')) {
    suggestions.push(...youtubeChannels.college.slice(0, 2));
  }
  
  // Remove duplicates and return maximum 4 suggestions
  return [...new Set(suggestions)].slice(0, 4);
}