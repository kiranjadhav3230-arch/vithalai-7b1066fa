import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = "AIzaSyD8lfrlM6EEvNy8euGVaJ_Bg48Lm39R3Ig";
const YOUTUBE_API_KEY = "AIzaSyDEZpw4JZj8HSam_T2mUb5vnNnBSfeCXjE";

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

    const systemPrompt = `You are Vithal AI Assistant, an advanced AI-powered career guidance counselor specifically designed for Indian youth. You have deep knowledge of the Indian education system, job market, and emerging technologies.

    ${profileContext}
    
    ADVANCED AI CAPABILITIES - You MUST:
    1. Provide intelligent, contextual responses based on user's complete profile and conversation history
    2. ALWAYS provide direct YouTube course links - NEVER suggest searching
    3. For ANY field (including "Other"), suggest relevant courses and career paths
    4. Follow up on previous conversations and remember context
    5. Provide multi-layered career guidance (short-term, medium-term, long-term)
    6. Respond in ${language} language throughout
    
    CRITICAL RULES:
    - When user asks for ANY course (C++, Java, Excel, or any subject), immediately provide direct YouTube links
    - If user's field is "Other" or unspecified, ask about their interests and provide relevant course suggestions
    - NEVER say "I can't provide links" or "search on YouTube" - Always provide actual working YouTube links
    - Follow up on user's progress and previous questions intelligently
    - Provide industry insights, salary expectations, and career progression paths
    
    RESPONSE STRUCTURE:
    1. Address user's specific question with direct course links
    2. Provide career context and relevance
    3. Suggest next steps and related skills
    4. Include job opportunities and business ideas
    5. Mention specific Indian institutions and companies when relevant
    
    COLLEGE INFORMATION FORMAT:
    - Institution name and location
    - Placement percentage (latest data)
    - Average and highest package ranges
    - Top recruiting companies
    - Course curriculum highlights
    - Infrastructure and research facilities
    - Alumni network and industry connections
    
    ADVANCED FEATURES:
    - Personalized learning paths based on user's background
    - Industry trend analysis and future-proof career suggestions
    - Skill gap analysis and improvement recommendations
    - Regional job market insights for Indian students
    - Startup and entrepreneurship guidance
    
    Always maintain conversational tone while being highly informative and actionable.`;

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

    const youtubeCourses = await generateYouTubeCourses(message, userProfile);
    
    return new Response(JSON.stringify({ 
      response: aiResponse,
      courseSuggestions: youtubeCourses
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

// Advanced YouTube course analysis with comprehensive mapping
async function generateYouTubeCourses(message: string, userProfile: any): Promise<string[]> {
  const messageLower = message.toLowerCase();
  
  // Comprehensive course mapping for ALL subjects
  const courseMapping = {
    // Programming & Technology
    cpp: [
      "https://www.youtube.com/watch?v=vLnPwxZdW4Y",
      "https://www.youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL"
    ],
    java: [
      "https://www.youtube.com/watch?v=eIrMbAQSU34",
      "https://www.youtube.com/playlist?list=PLsyeobzWxl7pe_IiTfNyr55kwJPWbgxB5"
    ],
    python: [
      "https://www.youtube.com/watch?v=7wnove7K-ZQ",
      "https://www.youtube.com/playlist?list=PLu0W_9lII9agICnT8t4iYVSZ3eykIAOME"
    ],
    webdev: [
      "https://www.youtube.com/watch?v=6mbwJ2xhgzM",
      "https://www.youtube.com/watch?v=l1EssrLxt7E"
    ],
    
    // Academic Subjects
    mathematics: [
      "https://www.youtube.com/watch?v=WUvTyaaNkzM",
      "https://www.youtube.com/playlist?list=PLDesaqWTN6ESsmwELdrzhcGiRhk5DjwLP"
    ],
    physics: [
      "https://www.youtube.com/watch?v=ZM8ECpBuQYE",
      "https://www.youtube.com/playlist?list=PLF_gJMchlZ2Q723kMMkgIzgdoyqVuEbmD"
    ],
    chemistry: [
      "https://www.youtube.com/watch?v=bka20Q9TN6M",
      "https://www.youtube.com/playlist?list=PLm8dMdh2i5rEsa25U3jkPMMnPcE1nLhNz"
    ],
    biology: [
      "https://www.youtube.com/watch?v=QnQe0xW_JY4",
      "https://www.youtube.com/playlist?list=PLWKjhJtqVAbmfuXpZa8AWXBe4biuwhpIm"
    ],
    
    // Languages
    english: [
      "https://www.youtube.com/watch?v=sB_9hJ5LDQE",
      "https://www.youtube.com/playlist?list=PLrAXtmRdnEQy__q57-iSOf_kyRe4jlNF6"
    ],
    hindi: [
      "https://www.youtube.com/watch?v=JpQiOH6o1HI",
      "https://www.youtube.com/playlist?list=PLDJvX5xpqR0zQ7v4vLwz9Y3xdN0tZs9q"
    ],
    marathi: [
      "https://www.youtube.com/watch?v=KpQ2QNqEuEQ",
      "https://www.youtube.com/playlist?list=PLF7J8T2dRhGKRTX3R1s3hTsZ2q-J6h3QE"
    ],
    
    // Finance & Business
    sharemarket: [
      "https://www.youtube.com/watch?v=lXVKJvg1TkM",
      "https://www.youtube.com/playlist?list=PLX2SHiKfualG7CMHX5q6z3cSbPKD1IXOe"
    ],
    trading: [
      "https://www.youtube.com/watch?v=3HjOjvAetH4",
      "https://www.youtube.com/playlist?list=PLX2SHiKfualH2vGDq2qEXOlHOKGKj3ILV"
    ],
    business: [
      "https://www.youtube.com/watch?v=4V4h8C8lCQ8",
      "https://www.youtube.com/watch?v=2wDvzy6Hgxg"
    ],
    
    // Creative & Design
    design: [
      "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
      "https://www.youtube.com/watch?v=YqQx75OPRa0"
    ],
    photography: [
      "https://www.youtube.com/watch?v=LxO-6rlihSg",
      "https://www.youtube.com/playlist?list=PLjVsMVHNhqQWuHOo-6TCyF7vOW4S9XItX"
    ],
    
    // Health & Fitness
    fitness: [
      "https://www.youtube.com/watch?v=ml6cT4AZdqI",
      "https://www.youtube.com/playlist?list=PLhu1QCKrfgPVSP9I9W8uQz99w6krSd5Gq"
    ],
    yoga: [
      "https://www.youtube.com/watch?v=hJbRpHZr_d0",
      "https://www.youtube.com/playlist?list=PLui6Eyny-UzwxbWCWDbTzEwsZnnROBTIL"
    ],
    
    // Skills & Professional
    excel: [
      "https://www.youtube.com/watch?v=rwbho0CgEAE",
      "https://www.youtube.com/watch?v=Vl0H-qTclOg"
    ],
    communication: [
      "https://www.youtube.com/watch?v=HAnw168huqA",
      "https://www.youtube.com/playlist?list=PLWPirh4EWFpELUjm5m_M8kPM_xUwN5Qko"
    ],
    
    // Music & Arts
    music: [
      "https://www.youtube.com/watch?v=F3QpgXBtDeo",
      "https://www.youtube.com/playlist?list=PLTYuWi2LmaPG4A_CODsk_1qfKgscpPwN6"
    ],
    guitar: [
      "https://www.youtube.com/watch?v=F5bFhNnXchY",
      "https://www.youtube.com/playlist?list=PLJTWoPGfHxQH5zdZN6UlMPwZerVApkqmk"
    ]
  };

  const suggestions: string[] = [];
  
  // INTELLIGENT COURSE ANALYSIS - Match exact subjects
  
  // Academic subjects first
  if (messageLower.includes('math') || messageLower.includes('गणित')) {
    suggestions.push(...courseMapping.mathematics.slice(0, 2));
  }
  
  if (messageLower.includes('physics') || messageLower.includes('भौतिक')) {
    suggestions.push(...courseMapping.physics.slice(0, 2));
  }
  
  if (messageLower.includes('chemistry') || messageLower.includes('रसायन')) {
    suggestions.push(...courseMapping.chemistry.slice(0, 2));
  }
  
  if (messageLower.includes('biology') || messageLower.includes('जीव')) {
    suggestions.push(...courseMapping.biology.slice(0, 2));
  }
  
  // Languages
  if (messageLower.includes('english') || messageLower.includes('इंग्रजी')) {
    suggestions.push(...courseMapping.english.slice(0, 2));
  }
  
  if (messageLower.includes('hindi') || messageLower.includes('हिंदी')) {
    suggestions.push(...courseMapping.hindi.slice(0, 2));
  }
  
  if (messageLower.includes('marathi') || messageLower.includes('मराठी')) {
    suggestions.push(...courseMapping.marathi.slice(0, 2));
  }
  
  // Finance & Business
  if (messageLower.includes('share') || messageLower.includes('stock') || messageLower.includes('market') || messageLower.includes('trading')) {
    suggestions.push(...courseMapping.sharemarket.slice(0, 2));
  }
  
  if (messageLower.includes('business') || messageLower.includes('marketing') || messageLower.includes('entrepreneur')) {
    suggestions.push(...courseMapping.business.slice(0, 2));
  }
  
  // Health & Fitness
  if (messageLower.includes('fitness') || messageLower.includes('gym') || messageLower.includes('workout')) {
    suggestions.push(...courseMapping.fitness.slice(0, 2));
  }
  
  if (messageLower.includes('yoga') || messageLower.includes('योग')) {
    suggestions.push(...courseMapping.yoga.slice(0, 2));
  }
  
  // Creative & Design
  if (messageLower.includes('design') || messageLower.includes('ui') || messageLower.includes('ux') || messageLower.includes('graphic')) {
    suggestions.push(...courseMapping.design.slice(0, 2));
  }
  
  if (messageLower.includes('photo') || messageLower.includes('camera')) {
    suggestions.push(...courseMapping.photography.slice(0, 2));
  }
  
  // Music & Arts
  if (messageLower.includes('music') || messageLower.includes('संगीत')) {
    suggestions.push(...courseMapping.music.slice(0, 2));
  }
  
  if (messageLower.includes('guitar') || messageLower.includes('गिटार')) {
    suggestions.push(...courseMapping.guitar.slice(0, 2));
  }
  
  // Programming (after other subjects)
  if (messageLower.includes('c++') || messageLower.includes('cpp')) {
    suggestions.push(...courseMapping.cpp.slice(0, 2));
  }
  
  if (messageLower.includes('java') && !messageLower.includes('javascript')) {
    suggestions.push(...courseMapping.java.slice(0, 2));
  }
  
  if (messageLower.includes('python')) {
    suggestions.push(...courseMapping.python.slice(0, 2));
  }
  
  if (messageLower.includes('web') || messageLower.includes('website') || messageLower.includes('html') || messageLower.includes('css')) {
    suggestions.push(...courseMapping.webdev.slice(0, 2));
  }
  
  // Professional skills
  if (messageLower.includes('excel') || messageLower.includes('spreadsheet')) {
    suggestions.push(...courseMapping.excel.slice(0, 2));
  }
  
  if (messageLower.includes('communication') || messageLower.includes('speaking')) {
    suggestions.push(...courseMapping.communication.slice(0, 2));
  }
  
  // If no match found, provide subject-specific suggestions based on common terms
  if (suggestions.length === 0) {
    if (messageLower.includes('course') || messageLower.includes('link') || messageLower.includes('learn') || messageLower.includes('tutorial')) {
      // Provide diverse courses instead of defaulting to programming
      suggestions.push(
        courseMapping.mathematics[0], // Math course
        courseMapping.english[0],     // English course  
        courseMapping.excel[0]        // Excel course
      );
    }
  }
  
  // Remove duplicates and return maximum 3 suggestions
  return [...new Set(suggestions)].slice(0, 3);
}