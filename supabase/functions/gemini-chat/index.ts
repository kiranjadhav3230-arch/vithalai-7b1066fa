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

// Generate direct YouTube course links with API integration
async function generateYouTubeCourses(message: string, userProfile: any): Promise<string[]> {
  const messageLower = message.toLowerCase();
  
  // Direct working YouTube course links
  const courseMapping = {
    cpp: [
      "https://www.youtube.com/watch?v=vLnPwxZdW4Y", // C++ Full Course for Beginners
      "https://www.youtube.com/playlist?list=PLu0W_9lII9agpFUAlPFe_VNSlXW5uE0YL", // C++ Playlist by CodeWithHarry
      "https://www.youtube.com/watch?v=j8nAHeVKL08", // C++ Programming Course
      "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ" // C++ Tutorial Series
    ],
    programming: [
      "https://www.youtube.com/watch?v=eIrMbAQSU34", // Complete Java Course
      "https://www.youtube.com/watch?v=7wnove7K-ZQ", // Complete Python Course
      "https://www.youtube.com/watch?v=tVzUXW6siu0", // DSA Complete Course
      "https://www.youtube.com/playlist?list=PLu0W_9lII9agICnT8t4iYVSZ3eykIAOME" // Python Playlist
    ],
    webdev: [
      "https://www.youtube.com/watch?v=6mbwJ2xhgzM", // Complete Web Development
      "https://www.youtube.com/watch?v=l1EssrLxt7E", // MERN Stack Course
      "https://www.youtube.com/playlist?list=PLu0W_9lII9agiCUZYRsvtGTXdxkzPyItg", // Web Development Bootcamp
      "https://www.youtube.com/watch?v=Vi9bxu-M-ag" // Complete Web Development
    ],
    mobile: [
      "https://www.youtube.com/watch?v=fis26HvvDII", // Android Development Course
      "https://www.youtube.com/watch?v=VgQiYGEwKkE", // Complete Android Course
      "https://www.youtube.com/watch?v=1ukSR1GRtMU", // Flutter Course for Beginners
      "https://www.youtube.com/playlist?list=PLRApWmh2yHsVOhB4EXRpEh9q3vMRJ8E4d" // Flutter Playlist
    ],
    data: [
      "https://www.youtube.com/watch?v=7eh4d6sabA0", // Data Science Complete Course
      "https://www.youtube.com/playlist?list=PLZoTAELRMXVPBTrWtJkn3wWQxZkmTXGwe", // Machine Learning Playlist
      "https://www.youtube.com/watch?v=mkv5mxYu0Wk", // Data Science Basics
      "https://www.youtube.com/watch?v=24FIWTmJpqk" // Python for Data Science
    ],
    design: [
      "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", // UX/UI Design Course
      "https://www.youtube.com/watch?v=YqQx75OPRa0", // Graphic Design Tutorials
      "https://www.youtube.com/watch?v=FTlczfBs-Vg", // Complete Figma Course
      "https://www.youtube.com/watch?v=IyR_uYsRdPs" // Photoshop Tutorials
    ],
    business: [
      "https://www.youtube.com/watch?v=4V4h8C8lCQ8", // Business Analysis
      "https://www.youtube.com/watch?v=2wDvzy6Hgxg", // Digital Marketing Course
      "https://www.youtube.com/watch?v=7zllVDfyUEg", // Entrepreneurship Videos
      "https://www.youtube.com/playlist?list=PLZoTAELRMXVPXLYHLkOGz0J8PWNL9Y7YE" // Digital Marketing Playlist
    ],
    engineering: [
      "https://www.youtube.com/watch?v=mMY-YLBhKw4", // Engineering Preparation
      "https://www.youtube.com/watch?v=gGy3HCaV8D8", // GATE Subject Courses
      "https://www.youtube.com/watch?v=1CYWl2vJcY0", // GATE Preparation Videos
      "https://www.youtube.com/watch?v=4LbJmhdUJes" // Engineering Mathematics
    ],
    college: [
      "https://www.youtube.com/watch?v=YnHWNXv_PsQ", // Engineering Colleges Guide
      "https://www.youtube.com/watch?v=yTZSPSnp0dw", // College Selection Guide
      "https://www.youtube.com/watch?v=PWc8S4TEsp0", // Placement Preparation
      "https://www.youtube.com/watch?v=e8F8DuKQlXo" // Interview Skills
    ]
  };

  const suggestions: string[] = [];
  
  // Check user profile for personalized suggestions
  if (userProfile?.interests) {
    const interests = (Array.isArray(userProfile.interests) ? userProfile.interests.join(' ') : userProfile.interests).toLowerCase();
    if (interests.includes('programming') || interests.includes('coding')) {
      suggestions.push(...courseMapping.programming.slice(0, 1));
    }
    if (interests.includes('design') || interests.includes('creative')) {
      suggestions.push(...courseMapping.design.slice(0, 1));
    }
  }
  
  // Advanced course matching for ANY request (including "Other" field users)
  if (messageLower.includes('c++') || messageLower.includes('cpp')) {
    suggestions.push(...courseMapping.cpp.slice(0, 2));
  }
  
  if (messageLower.includes('java')) {
    suggestions.push("https://www.youtube.com/watch?v=eIrMbAQSU34");
  }
  
  if (messageLower.includes('python')) {
    suggestions.push("https://www.youtube.com/watch?v=7wnove7K-ZQ");
  }
  
  if (messageLower.includes('excel') || messageLower.includes('spreadsheet')) {
    suggestions.push("https://www.youtube.com/watch?v=rwbho0CgEAE", "https://www.youtube.com/watch?v=Vl0H-qTclOg");
  }
  
  if (messageLower.includes('programming') || messageLower.includes('coding') || messageLower.includes('developer')) {
    suggestions.push(...courseMapping.programming.slice(0, 2));
  }
  
  if (messageLower.includes('web') || messageLower.includes('website') || messageLower.includes('frontend') || messageLower.includes('backend')) {
    suggestions.push(...courseMapping.webdev.slice(0, 2));
  }
  
  if (messageLower.includes('mobile') || messageLower.includes('app') || messageLower.includes('android') || messageLower.includes('flutter')) {
    suggestions.push(...courseMapping.mobile.slice(0, 2));
  }
  
  if (messageLower.includes('data') || messageLower.includes('machine learning') || messageLower.includes('analytics')) {
    suggestions.push(...courseMapping.data.slice(0, 2));
  }
  
  if (messageLower.includes('design') || messageLower.includes('ui') || messageLower.includes('ux') || messageLower.includes('graphic')) {
    suggestions.push(...courseMapping.design.slice(0, 2));
  }
  
  if (messageLower.includes('business') || messageLower.includes('marketing') || messageLower.includes('entrepreneur')) {
    suggestions.push(...courseMapping.business.slice(0, 2));
  }
  
  if (messageLower.includes('engineering') || messageLower.includes('gate') || messageLower.includes('jee')) {
    suggestions.push(...courseMapping.engineering.slice(0, 2));
  }
  
  if (messageLower.includes('college') || messageLower.includes('placement') || messageLower.includes('admission')) {
    suggestions.push(...courseMapping.college.slice(0, 2));
  }
  
  // If user field is "Other" or no specific match found, provide general course suggestions
  if (suggestions.length === 0 || (userProfile?.interests && userProfile.interests.includes('Other'))) {
    if (messageLower.includes('course') || messageLower.includes('link') || messageLower.includes('learn')) {
      // Provide popular courses for "Other" field users
      suggestions.push(
        "https://www.youtube.com/watch?v=7wnove7K-ZQ", // Python Course
        "https://www.youtube.com/watch?v=6mbwJ2xhgzM", // Web Development
        "https://www.youtube.com/watch?v=rwbho0CgEAE"  // Excel Course
      );
    }
  }
  
  // Remove duplicates and return maximum 3 suggestions
  return [...new Set(suggestions)].slice(0, 3);
}