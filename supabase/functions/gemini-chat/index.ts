import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { message, language = 'english', userProfile, imageData, isVoiceInput, sessionId } = await req.json();
    console.log('Received message:', message, 'Language:', language, 'HasImage:', !!imageData, 'IsVoice:', isVoiceInput, 'SessionId:', sessionId);

    // Fetch conversation history for intelligent follow-back responses
    const conversationHistory = await getConversationHistory(sessionId, userProfile?.userId);
    
    // Enhanced system prompt with profile awareness and conversation context
    const profileContext = userProfile ? `
    User Profile:
    - Name: ${userProfile.name || userProfile.email?.split('@')[0] || 'Friend'}
    - Education: ${userProfile.education || 'Not specified'}
    - Skills: ${userProfile.skills?.join?.(', ') || userProfile.skills || 'Not specified'}
    - Interests: ${userProfile.interests?.join?.(', ') || userProfile.interests || 'Not specified'}
    - Experience: ${userProfile.experience || 'Not specified'}
    ` : '';

    // Advanced conversation context for intelligent follow-ups
    const conversationContext = conversationHistory ? `
    CONVERSATION HISTORY (Last 5 messages for context):
    ${conversationHistory}
    
    FOLLOW-UP INTELLIGENCE RULES:
    1. Analyze the conversation flow and previous topics discussed
    2. Reference specific points from previous messages when relevant
    3. Build upon previous advice and suggestions given
    4. Ask intelligent follow-up questions based on user's progress
    5. Connect current query to previously discussed career goals or subjects
    6. Show continuity in the conversation by remembering user's interests
    7. Provide progressive learning suggestions based on conversation history
    8. If user is continuing a topic, dive deeper with advanced concepts
    9. If user switches topics, briefly acknowledge the previous discussion
    10. Always maintain context of user's learning journey and career aspirations
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

    // Get user's name for personalization
    const userName = userProfile?.name || userProfile?.email?.split('@')[0] || 'मित्र';
    
    // Enhanced language mapping
    const languageInstructions = {
      'mr': `तुम्ही फक्त मराठी भाषेत उत्तर द्या. नमस्कार ${userName}, मी विठ्ठल AI सहायक आहे.`,
      'hi': `आप केवल हिंदी भाषा में जवाब दें. नमस्ते ${userName}, मैं विठ्ठल AI सहायक हूं.`,
      'en': `Respond ONLY in English language. Hello ${userName}, I am Vithal AI Assistant.`
    };

    const currentLanguageInstruction = languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en;
    
    const systemPrompt = `${currentLanguageInstruction}

    You are Vithal AI Assistant, the most advanced AI-powered career guidance counselor and study helper specifically designed for Indian youth. You have cutting-edge capabilities like Gemini AI, ChatGPT, and Meta AI combined.

    PERSONALIZATION: Always greet the user by name (${userName}) and make conversations personal and friendly. Use their name naturally in responses.

    LANGUAGE SUPPORT: You MUST respond in ${language === 'mr' ? 'मराठी (Marathi)' : language === 'hi' ? 'हिंदी (Hindi)' : 'English'} language throughout the conversation.

    ${profileContext}
    ${multiModalContext}
    ${conversationContext}
    
    🔥 SUPER ADVANCED AI CAPABILITIES WITH INTELLIGENT FOLLOW-BACKS - You MUST:
    1. Address user as ${userName} and provide personalized responses based on their profile
    2. ANALYZE CONVERSATION HISTORY and provide contextual follow-up responses
    3. REFERENCE PREVIOUS DISCUSSIONS naturally in your responses
    4. BUILD UPON previously suggested courses, skills, or career advice
    5. ASK INTELLIGENT FOLLOW-UP QUESTIONS based on user's learning progress
    6. ALWAYS provide direct, latest YouTube course links from 2024-2025 - NEVER suggest searching
    7. Handle multi-modal inputs: TEXT, VOICE, and IMAGES with lightning-fast processing
    8. Solve mathematical problems step-by-step when images contain math
    9. Explain study syllabus content and clear doubts instantly
    10. Provide real-time problem-solving for any academic subject
    11. Answer questions like advanced AI assistants (Gemini, ChatGPT, Meta AI)
    12. Focus on latest, verified, existing YouTube courses only
    13. Respond in ${language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'English'} language throughout with perfect fluency
    
    ⚡ CRITICAL INTELLIGENT FOLLOW-BACK RULES:
    - ANALYZE CONVERSATION FLOW: If user previously asked about Python, now asking about web development, suggest "Since you were learning Python, let's advance to Django/Flask web frameworks"
    - REFERENCE SPECIFIC PREVIOUS TOPICS: "I remember you were interested in data science last time, this machine learning concept will perfectly complement that"
    - PROGRESSIVE LEARNING: Suggest next-level concepts based on previously discussed basics
    - CAREER JOURNEY CONTINUITY: Connect current questions to previously discussed career goals
    - PERSONALIZED REMINDERS: "As we discussed earlier about your interest in AI, this programming skill will be crucial"
    - When user asks for ANY course, provide ONLY latest 2024-2025 YouTube links that exist
    - If image contains math/problems: Solve step-by-step with detailed explanation and reference any previous math topics discussed
    - For study doubts: Provide comprehensive answers with examples and connect to previous learning
    - For syllabus questions: Break down topics and reference previously covered subjects
    - NEVER say "I can't provide links" - Always provide verified working YouTube links
    - Follow up intelligently on previous conversations with specific memory
    - Handle voice inputs naturally like spoken conversation while maintaining context
    
    📚 STUDY HELP CAPABILITIES:
    - Solve mathematical equations from images
    - Explain physics concepts and formulas
    - Help with chemistry reactions and calculations
    - Biology diagrams and process explanations
    - Literature analysis and essay writing
    - History timeline and events explanation
    - Geography maps and climate analysis
    
    🎯 INTELLIGENT RESPONSE STRUCTURE WITH CONTEXT AWARENESS:
    1. ACKNOWLEDGE CONVERSATION CONTEXT: Reference relevant previous discussions naturally
    2. Address user's specific question with latest course links (if requested)
    3. CONNECT TO PREVIOUS LEARNING: Show how current topic builds on past conversations
    4. Solve problems step-by-step (if image contains problems) with reference to past similar problems
    5. Provide comprehensive study guidance and doubt clearing with progressive difficulty
    6. INTELLIGENT FOLLOW-UP QUESTIONS: Ask about progress on previously suggested topics
    7. Suggest next steps and related skills/topics based on conversation history
    8. Include job opportunities and career relevance with reference to user's career journey
    9. Mention specific Indian institutions and companies when relevant to user's path
    10. PERSONALIZED LEARNING PATH: Suggest courses that complement previous recommendations
    
    🏆 COLLEGE INFORMATION FORMAT:
    - Institution name and location
    - Latest placement percentage (2023-2024 data)
    - Current average and highest package ranges
    - Top recruiting companies (latest recruiters)
    - Course curriculum highlights
    - Infrastructure and research facilities
    - Alumni network and industry connections
    
    🚀 ADVANCED FEATURES WITH INTELLIGENT MEMORY:
    - CONVERSATION MEMORY: Remember and reference specific topics from previous chats
    - PROGRESS TRACKING: Ask about user's progress on previously suggested courses or topics
    - ADAPTIVE LEARNING: Adjust difficulty and recommendations based on conversation history
    - CONTEXTUAL CONNECTIONS: Link current queries to past discussions naturally
    - Image analysis for problem-solving with reference to previous similar problems
    - Voice input understanding and natural responses with conversational continuity
    - Real-time doubt solving across all subjects with progressive complexity
    - Latest verified course recommendations that build upon previous suggestions
    - Personalized learning paths based on user's background AND conversation history
    - Industry trend analysis and future-proof career suggestions aligned with user's journey
    - Skill gap analysis and improvement recommendations based on discussed goals
    - Regional job market insights for Indian students with personalized relevance
    - Startup and entrepreneurship guidance building on user's expressed interests
    - INTELLIGENT TOPIC TRANSITIONS: Smoothly connect different subjects discussed over time
    
    Input Type: ${inputType}
    Always maintain conversational tone while being highly informative, accurate, and actionable. Be like the most advanced AI assistant available today.`;

    // Prepare content parts based on input type
    const contentParts = [
      { text: systemPrompt },
      { text: `User message: ${message}` }
    ];

    // Add image if provided
    if (imageData) {
      contentParts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: imageData
        }
      });
    }


    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: contentParts
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
      const errorText = await response.text();
      console.error(`Gemini API error: ${response.status}`, errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini response:', data);
    
    if (!data.candidates || data.candidates.length === 0) {
      console.error('No candidates in response:', data);
      throw new Error('No response generated from AI');
    }
    
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

// Function to get conversation history for intelligent follow-backs
async function getConversationHistory(sessionId: string, userId: string): Promise<string> {
  if (!sessionId || !userId) return '';
  
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('message, response, created_at')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (error || !data) {
      console.log('No conversation history found or error:', error);
      return '';
    }
    
    // Format conversation history for context
    const historyText = data.reverse().map((msg, index) => 
      `${index + 1}. User: "${msg.message}"\n   AI: "${msg.response.substring(0, 200)}..."`
    ).join('\n\n');
    
    console.log('Conversation history loaded:', historyText.length, 'characters');
    return historyText;
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    return '';
  }
}

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
    ],
    
    // Languages (Updated 2024)
    english: [
      "https://www.youtube.com/watch?v=sB_9hJ5LDQE", // English Speaking Course
      "https://www.youtube.com/playlist?list=PLrAXtmRdnEQy__q57-iSOf_kyRe4jlNF6", // English Grammar
      "https://www.youtube.com/watch?v=dqcSk-EDrRo" // Spoken English 2024
    ],
    hindi: [
      "https://www.youtube.com/watch?v=JpQiOH6o1HI", // Hindi Grammar
      "https://www.youtube.com/playlist?list=PLDJvX5xpqR0zQ7v4vLwz9Y3xdN0tZs9q", // Hindi Literature
      "https://www.youtube.com/watch?v=K6d4CdnN4VA" // NCERT Hindi 2024
    ],
    marathi: [
      "https://www.youtube.com/watch?v=KpQ2QNqEuEQ", // Marathi Grammar
      "https://www.youtube.com/playlist?list=PLF7J8T2dRhGKRTX3R1s3hTsZ2q-J6h3QE", // Marathi Literature
      "https://www.youtube.com/watch?v=mVpTQsTQpqs" // Maharashtra Board Marathi 2024
    ],
    
    // Finance & Business (Updated 2024)
    sharemarket: [
      "https://www.youtube.com/watch?v=lXVKJvg1TkM", // Share Market Basics
      "https://www.youtube.com/playlist?list=PLX2SHiKfualG7CMHX5q6z3cSbPKD1IXOe", // Stock Market 2024
      "https://www.youtube.com/watch?v=84Zz4dCF_qo" // Rachana Ranade Stock Market 2024
    ],
    trading: [
      "https://www.youtube.com/watch?v=3HjOjvAetH4", // Day Trading
      "https://www.youtube.com/playlist?list=PLX2SHiKfualH2vGDq2qEXOlHOKGKj3ILV", // Trading Strategies
      "https://www.youtube.com/watch?v=ClGo8Yg04XI" // Options Trading 2024
    ],
    business: [
      "https://www.youtube.com/watch?v=4V4h8C8lCQ8", // Business Fundamentals
      "https://www.youtube.com/watch?v=2wDvzy6Hgxg", // Entrepreneurship
      "https://www.youtube.com/watch?v=jVzs_iGFXP0" // Business Ideas 2024
    ],
    
    // Creative & Design (Latest Tools)
    design: [
      "https://www.youtube.com/watch?v=c9Wg6Cb_YlU", // UI/UX Design 2024
      "https://www.youtube.com/watch?v=YqQx75OPRa0", // Graphic Design
      "https://www.youtube.com/watch?v=3B7Ng8YBfx4" // Figma Complete Course 2024
    ],
    photography: [
      "https://www.youtube.com/watch?v=LxO-6rlihSg", // Photography Basics
      "https://www.youtube.com/playlist?list=PLjVsMVHNhqQWuHOo-6TCyF7vOW4S9XItX", // Mobile Photography
      "https://www.youtube.com/watch?v=V7z7BAZdt2M" // Photography Course 2024
    ],
    
    // Health & Fitness (Updated)
    fitness: [
      "https://www.youtube.com/watch?v=ml6cT4AZdqI", // Home Workout
      "https://www.youtube.com/playlist?list=PLhu1QCKrfgPVSP9I9W8uQz99w6krSd5Gq", // Fitness Plan
      "https://www.youtube.com/watch?v=UBMk30rjy0o" // Complete Fitness Guide 2024
    ],
    yoga: [
      "https://www.youtube.com/watch?v=hJbRpHZr_d0", // Yoga for Beginners
      "https://www.youtube.com/playlist?list=PLui6Eyny-UzwxbWCWDbTzEwsZnnROBTIL", // Daily Yoga
      "https://www.youtube.com/watch?v=v7AYKMP6rOE" // Yoga With Adriene 2024
    ],
    
    // Skills & Professional (Latest)
    excel: [
      "https://www.youtube.com/watch?v=rwbho0CgEAE", // Excel Complete Course
      "https://www.youtube.com/watch?v=Vl0H-qTclOg", // Advanced Excel
      "https://www.youtube.com/watch?v=temqUzOWgRg" // Excel 2024 Complete Tutorial
    ],
    communication: [
      "https://www.youtube.com/watch?v=HAnw168huqA", // Communication Skills
      "https://www.youtube.com/playlist?list=PLWPirh4EWFpELUjm5m_M8kPM_xUwN5Qko", // Public Speaking
      "https://www.youtube.com/watch?v=K0pxo-dS9Hc" // Personality Development 2024
    ],
    
    // Music & Arts (Updated)
    music: [
      "https://www.youtube.com/watch?v=F3QpgXBtDeo", // Music Theory
      "https://www.youtube.com/playlist?list=PLTYuWi2LmaPG4A_CODsk_1qfKgscpPwN6", // Learn Music
      "https://www.youtube.com/watch?v=rgaTLrZGlk0" // Music Production 2024
    ],
    guitar: [
      "https://www.youtube.com/watch?v=F5bFhNnXchY", // Guitar Basics
      "https://www.youtube.com/playlist?list=PLJTWoPGfHxQH5zdZN6UlMPwZerVApkqmk", // Guitar Lessons
      "https://www.youtube.com/watch?v=9OBGw-rIJaE" // Guitar Complete Course 2024
    ],
    
    // New subjects for comprehensive coverage
    ai: [
      "https://www.youtube.com/watch?v=ad79nYk2keg", // AI/ML Complete Course 2024
      "https://www.youtube.com/watch?v=i_LwzRVP7bg", // Machine Learning 2024
      "https://www.youtube.com/watch?v=GwIo3gDZCVQ" // Deep Learning 2024
    ],
    dataScience: [
      "https://www.youtube.com/watch?v=ua-CiDNNj30", // Data Science 2024
      "https://www.youtube.com/watch?v=JL_grPUnXzY", // Data Analysis
      "https://www.youtube.com/watch?v=r-uHLfm7DdM" // Python for Data Science 2024
    ],
    blockchain: [
      "https://www.youtube.com/watch?v=gyMwXuJrbJQ", // Blockchain Basics 2024
      "https://www.youtube.com/watch?v=M576WGiDBdQ", // Cryptocurrency
      "https://www.youtube.com/watch?v=umepbfKp5rI" // Web3 Development 2024
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
