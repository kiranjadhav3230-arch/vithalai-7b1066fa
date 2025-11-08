import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { message, language = 'english', userProfile, image, isVoiceInput, chatHistory = [] } = await req.json();
    console.log('Received message:', message, 'Language:', language, 'HasImage:', !!image, 'IsVoice:', isVoiceInput, 'HistoryLength:', chatHistory.length);

    // Enhanced system prompt with profile awareness, conversation memory, and smart context
    const profileContext = userProfile ? `
    User Profile:
    - Name: ${userProfile.name || userProfile.email?.split('@')[0] || 'Friend'}
    - Education: ${userProfile.education || 'Not specified'}
    - Skills: ${userProfile.skills?.join?.(', ') || userProfile.skills || 'Not specified'}
    - Interests: ${userProfile.interests?.join?.(', ') || userProfile.interests || 'Not specified'}
    - Experience: ${userProfile.experience || 'Not specified'}
    - Previous conversation topics: ${chatHistory.slice(-5).map(h => h.message).join(', ') || 'First conversation'}
    ` : '';

    // Smart conversation memory for context-aware responses
    const conversationMemory = chatHistory.length > 0 ? `
    CONVERSATION MEMORY (Last 5 interactions):
    ${chatHistory.slice(-5).map((chat, index) => `
    ${index + 1}. User: ${chat.message}
       AI: ${chat.response?.substring(0, 150)}...
    `).join('')}
    
    SMART CONTEXT ANALYSIS:
    - User's learning pattern: ${analyzeUserLearningPattern(chatHistory)}
    - Preferred subjects: ${extractUserInterests(chatHistory)}
    - Question complexity level: ${assessQuestionComplexity(message, chatHistory)}
    - Recommended next topics: ${suggestNextTopics(chatHistory, userProfile)}
    ` : 'First conversation - be welcoming and comprehensive.';

    // Handle multi-modal inputs
    const inputType = image ? 'image' : (isVoiceInput ? 'voice' : 'text');
    const multiModalContext = image ? `
    [IMAGE PROVIDED] - User has shared an image. Analyze it for:
    - Visual content analysis and description
    - Mathematical problems or equations to solve
    - Study materials or textbook content to explain
    - Handwritten notes or assignments for guidance
    - Career-related images for advice
    - Image editing requests (e.g., "make it rainy", "change background")
    - Answer questions about the image content
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

    SMART PERSONALIZATION: Always address ${userName} by name and provide highly personalized responses based on their profile and conversation history. Reference previous conversations naturally.

    LANGUAGE SUPPORT: You MUST respond in ${language === 'mr' ? 'मराठी (Marathi)' : language === 'hi' ? 'हिंदी (Hindi)' : 'English'} language throughout the conversation.

    ${profileContext}
    ${conversationMemory}
    ${multiModalContext}
    
    🚀 SUPER INTELLIGENT AI CAPABILITIES - You MUST:
    1. Address ${userName} personally and remember previous conversations naturally
    2. Provide adaptive learning paths based on user's progress and interests
    3. ALWAYS provide direct, latest YouTube course links from 2024-2025 - NEVER suggest searching
    4. Handle multi-modal inputs: TEXT, VOICE, and IMAGES with contextual understanding
    5. Solve mathematical problems step-by-step with detailed explanations
    6. Explain concepts at the right difficulty level based on user's background
    7. Provide real-time, intelligent problem-solving for any academic subject
    8. Remember user preferences and learning style from conversation history
    9. Suggest personalized study schedules and career paths
    10. Answer with the intelligence of advanced AI assistants (Gemini, ChatGPT, Meta AI)
    11. Focus on latest, verified, existing YouTube courses with smart recommendations
    12. Respond in ${language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : 'English'} language with perfect fluency
    
    ⚡ INTELLIGENT BEHAVIOR RULES:
    - Reference previous conversations when relevant: "As we discussed earlier..." or "Building on your interest in..."
    - Adapt explanation complexity based on user's demonstrated understanding level
    - When user asks for ANY course, provide ONLY latest 2024-2025 YouTube links that exist
    - If image contains math/problems: Solve step-by-step with detailed explanation at appropriate level
    - For study doubts: Provide comprehensive answers with examples tailored to their background
    - For syllabus questions: Break down topics and provide personalized learning roadmap
    - NEVER say "I can't provide links" - Always provide verified working YouTube links
    - Follow up intelligently on previous conversations with specific references
    - Handle voice inputs naturally like spoken conversation with memory of context
    - Predict what the user might want to learn next based on their journey
    - Provide encouragement and motivation based on their progress
    
    📚 STUDY HELP CAPABILITIES:
    - Solve mathematical equations from images
    - Explain physics concepts and formulas
    - Help with chemistry reactions and calculations
    - Biology diagrams and process explanations
    - Literature analysis and essay writing
    - History timeline and events explanation
    - Geography maps and climate analysis
    
    🎯 SMART RESPONSE STRUCTURE:
    1. Personal greeting with reference to previous conversations if relevant
    2. Address user's specific question with contextual understanding
    3. Provide latest course links (2024-2025) when requested with personalized recommendations
    4. Solve problems step-by-step (if image contains problems) at appropriate difficulty level
    5. Provide comprehensive study guidance with adaptive learning suggestions
    6. Reference user's learning pattern and suggest optimized next steps
    7. Include job opportunities and career relevance based on their interests
    8. Mention specific Indian institutions and companies when relevant
    9. End with encouraging, personalized motivation and next learning suggestions
    
    🏆 COLLEGE INFORMATION FORMAT:
    - Institution name and location
    - Latest placement percentage (2023-2024 data)
    - Current average and highest package ranges
    - Top recruiting companies (latest recruiters)
    - Course curriculum highlights
    - Infrastructure and research facilities
    - Alumni network and industry connections
    
    🚀 SUPER INTELLIGENT FEATURES:
    - Advanced image analysis for problem-solving with contextual explanations
    - Voice input understanding with conversation memory
    - Real-time doubt solving across all subjects with adaptive difficulty
    - Latest verified course recommendations with personalized curation
    - AI-powered learning paths based on user's background and progress
    - Industry trend analysis and future-proof career suggestions
    - Intelligent skill gap analysis and improvement recommendations
    - Regional job market insights for Indian students with personalized advice
    - Startup and entrepreneurship guidance based on user's interests
    - Conversation continuity and context-aware responses
    - Predictive learning suggestions based on user behavior
    - Smart motivation and encouragement tailored to user's journey
    
    Input Type: ${inputType}
    Always maintain conversational tone while being highly informative, accurate, and actionable. Be like the most advanced AI assistant available today.`;

    // Prepare content parts based on input type
    const contentParts = [
      { text: systemPrompt },
      { text: `User message: ${message}` }
    ];

    // Add image if provided
    if (image) {
      // Extract base64 data if it's a data URL
      let base64Data = image;
      if (image.includes('base64,')) {
        base64Data = image.split('base64,')[1];
      }
      
      contentParts.push({
        inline_data: {
          mime_type: "image/jpeg",
          data: base64Data
        }
      });
    }


    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
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

// Smart analysis functions for personalized AI responses
function analyzeUserLearningPattern(chatHistory: any[]): string {
  if (chatHistory.length === 0) return "Beginning learner";
  
  const recentChats = chatHistory.slice(-10);
  const questionTypes = recentChats.map(chat => {
    const msg = chat.message.toLowerCase();
    if (msg.includes('how') || msg.includes('why') || msg.includes('what')) return 'conceptual';
    if (msg.includes('solve') || msg.includes('calculate') || msg.includes('find')) return 'problem-solving';
    if (msg.includes('course') || msg.includes('learn') || msg.includes('study')) return 'resource-seeking';
    return 'general';
  });
  
  const pattern = questionTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const dominant = Object.entries(pattern).sort(([,a], [,b]) => b - a)[0];
  
  if (dominant[0] === 'conceptual') return "Deep thinker - enjoys understanding concepts";
  if (dominant[0] === 'problem-solving') return "Practical learner - focuses on problem-solving";
  if (dominant[0] === 'resource-seeking') return "Resource-oriented - actively seeks learning materials";
  return "Versatile learner - balanced approach";
}

function extractUserInterests(chatHistory: any[]): string {
  if (chatHistory.length === 0) return "Exploring various topics";
  
  const subjects = ['math', 'physics', 'chemistry', 'biology', 'programming', 'business', 'design', 'language', 'music', 'fitness'];
  const mentions = subjects.map(subject => ({
    subject,
    count: chatHistory.filter(chat => 
      chat.message.toLowerCase().includes(subject) || 
      chat.response?.toLowerCase().includes(subject)
    ).length
  })).filter(item => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);
  
  if (mentions.length === 0) return "Discovering interests";
  return mentions.map(m => m.subject).join(', ');
}

function assessQuestionComplexity(currentMessage: string, chatHistory: any[]): string {
  const msg = currentMessage.toLowerCase();
  
  // Check for advanced keywords
  const advancedKeywords = ['algorithm', 'analysis', 'synthesis', 'evaluate', 'compare', 'complex', 'advanced'];
  const basicKeywords = ['what is', 'how to', 'explain', 'simple', 'basic', 'introduction'];
  
  const hasAdvanced = advancedKeywords.some(keyword => msg.includes(keyword));
  const hasBasic = basicKeywords.some(keyword => msg.includes(keyword));
  
  // Consider conversation history for context
  const recentComplexity = chatHistory.slice(-5).map(chat => {
    const chatMsg = chat.message.toLowerCase();
    if (advancedKeywords.some(kw => chatMsg.includes(kw))) return 'advanced';
    if (basicKeywords.some(kw => chatMsg.includes(kw))) return 'basic';
    return 'intermediate';
  });
  
  const avgComplexity = recentComplexity.length > 0 ? 
    recentComplexity.reduce((acc, level) => {
      if (level === 'advanced') return acc + 3;
      if (level === 'intermediate') return acc + 2;
      return acc + 1;
    }, 0) / recentComplexity.length : 2;
  
  if (hasAdvanced || avgComplexity > 2.5) return "Advanced - provide detailed, technical explanations";
  if (hasBasic || avgComplexity < 1.5) return "Beginner - use simple, clear explanations with examples";
  return "Intermediate - balanced explanations with practical examples";
}

function suggestNextTopics(chatHistory: any[], userProfile: any): string {
  if (chatHistory.length === 0) return "Foundation building in core subjects";
  
  const recentTopics = chatHistory.slice(-5).map(chat => chat.message.toLowerCase());
  const allText = recentTopics.join(' ');
  
  // Smart topic progression suggestions
  if (allText.includes('python') && !allText.includes('django')) {
    return "Django web development, Data Science with Python";
  }
  if (allText.includes('math') && !allText.includes('calculus')) {
    return "Calculus fundamentals, Statistics applications";
  }
  if (allText.includes('business') && !allText.includes('marketing')) {
    return "Digital Marketing, Financial Management";
  }
  if (allText.includes('design') && !allText.includes('ui')) {
    return "UI/UX Design principles, Design thinking";
  }
  
  // Based on user profile
  if (userProfile?.interests?.includes('technology')) {
    return "AI/ML fundamentals, Cloud computing basics";
  }
  
  return "Skill advancement in current areas, Career planning sessions";
}
