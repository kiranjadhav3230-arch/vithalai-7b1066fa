import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('OpenAI function called with method:', req.method);
    
    if (!OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      throw new Error('OPENAI_API_KEY not configured');
    }

    const requestBody = await req.json();
    console.log('Request body received:', requestBody);
    
    const { message, language = 'english', userProfile, imageData, isVoiceInput } = requestBody;
    console.log('Received message:', message, 'Language:', language, 'HasImage:', !!imageData, 'IsVoice:', isVoiceInput);

    // Enhanced system prompt with profile awareness
    const profileContext = userProfile ? `
    User Profile:
    - Education: ${userProfile.education || 'Not specified'}
    - Skills: ${userProfile.skills?.join?.(', ') || userProfile.skills || 'Not specified'}
    - Interests: ${userProfile.interests?.join?.(', ') || userProfile.interests || 'Not specified'}
    - Experience: ${userProfile.experience || 'Not specified'}
    ` : '';

    // Handle multi-modal inputs
    const inputType = imageData ? 'image' : (isVoiceInput ? 'voice' : 'text');
    const multiModalContext = imageData ? `
    [IMAGE PROVIDED] - User has shared an image. Analyze it for:
    - Mathematical problems or equations to solve
    - Study materials or textbook content to explain
    - Handwritten notes or assignments for guidance
    - Career-related images for advice
    ` : '';

    const systemPrompt = `You are Vithal AI Assistant, the most advanced AI-powered career guidance counselor and study helper specifically designed for Indian youth. You have cutting-edge capabilities like GPT-4, ChatGPT, and advanced AI combined.

    ${profileContext}
    ${multiModalContext}
    
    🔥 SUPER ADVANCED AI CAPABILITIES - You MUST:
    1. Provide intelligent, contextual responses based on user's complete profile and conversation history
    2. ALWAYS provide direct, latest YouTube course links from 2024-2025 - NEVER suggest searching
    3. Handle multi-modal inputs: TEXT, VOICE, and IMAGES
    4. Solve mathematical problems step-by-step when images contain math
    5. Explain study syllabus content and clear doubts instantly
    6. Provide real-time problem-solving for any academic subject
    7. Answer questions like advanced AI assistants (GPT-4, ChatGPT, Claude)
    8. Focus on latest, verified, existing YouTube courses only
    9. Respond in ${language} language throughout
    
    ⚡ CRITICAL RULES:
    - When user asks for ANY course, provide ONLY latest 2024-2025 YouTube links that exist
    - If image contains math/problems: Solve step-by-step with detailed explanation
    - For study doubts: Provide comprehensive answers with examples
    - For syllabus questions: Break down topics and provide learning roadmap
    - NEVER say "I can't provide links" - Always provide verified working YouTube links
    - Follow up intelligently on previous conversations
    - Handle voice inputs naturally like spoken conversation
    
    📚 STUDY HELP CAPABILITIES:
    - Solve mathematical equations from images
    - Explain physics concepts and formulas
    - Help with chemistry reactions and calculations
    - Biology diagrams and process explanations
    - Literature analysis and essay writing
    - History timeline and events explanation
    - Geography maps and climate analysis
    
    🎯 RESPONSE STRUCTURE:
    1. Address user's specific question with latest course links (if requested)
    2. Solve problems step-by-step (if image contains problems)
    3. Provide comprehensive study guidance and doubt clearing
    4. Suggest next steps and related skills/topics
    5. Include job opportunities and career relevance
    6. Mention specific Indian institutions and companies when relevant
    
    🏆 COLLEGE INFORMATION FORMAT:
    - Institution name and location
    - Latest placement percentage (2023-2024 data)
    - Current average and highest package ranges
    - Top recruiting companies (latest recruiters)
    - Course curriculum highlights
    - Infrastructure and research facilities
    - Alumni network and industry connections
    
    🚀 ADVANCED FEATURES:
    - Image analysis for problem-solving
    - Voice input understanding and natural responses
    - Real-time doubt solving across all subjects
    - Latest verified course recommendations only
    - Personalized learning paths based on user's background
    - Industry trend analysis and future-proof career suggestions
    - Skill gap analysis and improvement recommendations
    - Regional job market insights for Indian students
    - Startup and entrepreneurship guidance
    
    Input Type: ${inputType}
    Always maintain conversational tone while being highly informative, accurate, and actionable. Be like the most advanced AI assistant available today.`;

    // Prepare messages for OpenAI
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    // Add image if provided
    if (imageData) {
      messages[1].content = [
        { type: 'text', text: message },
        { 
          type: 'image_url', 
          image_url: { 
            url: `data:image/jpeg;base64,${imageData}` 
          } 
        }
      ];
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status}`, errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);
    
    if (!data.choices || data.choices.length === 0) {
      console.error('No choices in response:', data);
      throw new Error('No response generated from AI');
    }
    
    const aiResponse = data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';

    const youtubeCourses = await generateYouTubeCourses(message, userProfile);
    
    return new Response(JSON.stringify({ 
      response: aiResponse,
      courseSuggestions: youtubeCourses
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in openai-chat function:', error);
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
  
// Latest and verified course mapping for ALL subjects (2024-2025)
  const courseMapping = {
    // Programming & Technology (Latest 2024-2025)
    cpp: [
      "https://www.youtube.com/watch?v=j-_s8f5K30I", // C++ Full Course 2024
      "https://www.youtube.com/playlist?list=PLfqMhTWNBTe0b2nM6JHVCnAkhQRGiZMSJ", // Apna College C++ 2024
      "https://www.youtube.com/watch?v=yGB9jhsEsr8" // CodeHelp C++ Course 2024
    ],
    java: [
      "https://www.youtube.com/watch?v=CFD9EFcNZTQ", // Java Full Course 2024
      "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3LtFWcvwpqTkUSlB32kJop", // Apna College Java 2024
      "https://www.youtube.com/watch?v=ntLJmHOJ0ME" // Kunal Kushwaha Java DSA 2024
    ],
    python: [
      "https://www.youtube.com/watch?v=XKHEtdqhLK8", // Python Complete Course 2024
      "https://www.youtube.com/playlist?list=PLfqMhTWNBTe3H6gQN4Yp5HnTjSdJW1NQs", // Apna College Python 2024
      "https://www.youtube.com/watch?v=7wnove7K-ZQ" // Code With Harry Python 2024
    ],
    webdev: [
      "https://www.youtube.com/watch?v=l1EssrLxt7E", // Web Development Complete 2024
      "https://www.youtube.com/playlist?list=PLfqMhTWNBTe03C5k0R8vRIjgJQ_vlAGJl", // Apna College Web Dev 2024
      "https://www.youtube.com/watch?v=HcOc7P5BMi4" // Sigma Web Dev Course 2024
    ],
    
    // Academic Subjects (Latest Educational Content)
    mathematics: [
      "https://www.youtube.com/watch?v=WUvTyaaNkzM", // Khan Academy Math
      "https://www.youtube.com/playlist?list=PLDesaqWTN6ESsmwELdrzhcGiRhk5DjwLP", // Vedantu Math
      "https://www.youtube.com/watch?v=fNk_zzaMoSs" // Unacademy Math 2024
    ],
    physics: [
      "https://www.youtube.com/watch?v=ZM8ECpBuQYE", // Physics Wallah
      "https://www.youtube.com/playlist?list=PLF_gJMchlZ2Q723kMMkgIzgdoyqVuEbmD", // Khan Academy Physics
      "https://www.youtube.com/watch?v=tQSbms5MDvY" // Vedantu Physics 2024
    ],
    chemistry: [
      "https://www.youtube.com/watch?v=bka20Q9TN6M", // Organic Chemistry
      "https://www.youtube.com/playlist?list=PLm8dMdh2i5rEsa25U3jkPMMnPcE1nLhNz", // Khan Academy Chemistry
      "https://www.youtube.com/watch?v=5iTOphGnCtg" // Physics Wallah Chemistry 2024
    ],
    biology: [
      "https://www.youtube.com/watch?v=QnQe0xW_JY4", // Crash Course Biology
      "https://www.youtube.com/playlist?list=PLWKjhJtqVAbmfuXpZa8AWXBe4biuwhpIm", // Khan Academy Biology
      "https://www.youtube.com/watch?v=dQCsA2cCdvA" // Vedantu Biology 2024
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
  
  // Programming
  if (messageLower.includes('c++') || messageLower.includes('cpp')) {
    suggestions.push(...courseMapping.cpp.slice(0, 2));
  }
  
  if (messageLower.includes('java') && !messageLower.includes('javascript')) {
    suggestions.push(...courseMapping.java.slice(0, 2));
  }
  
  if (messageLower.includes('python')) {
    suggestions.push(...courseMapping.python.slice(0, 2));
  }

  if (messageLower.includes('web') || messageLower.includes('html') || messageLower.includes('css') || messageLower.includes('javascript')) {
    suggestions.push(...courseMapping.webdev.slice(0, 2));
  }

  // Remove duplicates and return max 3 suggestions
  const uniqueSuggestions = [...new Set(suggestions)];
  return uniqueSuggestions.slice(0, 3);
}