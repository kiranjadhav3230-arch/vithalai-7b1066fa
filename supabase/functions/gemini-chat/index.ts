import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const { message, language = 'english', userProfile, image, isVoiceInput, chatHistory = [] } = await req.json();
    console.log('Received message:', message, 'Language:', language, 'HasImage:', !!image, 'IsVoice:', isVoiceInput, 'HistoryLength:', chatHistory.length);

    // Detect language from user's message
    const detectLanguage = (text: string): string => {
      const textLower = text.toLowerCase();
      
      // Check for language switching requests
      if (textLower.includes('speak in marathi') || textLower.includes('talk in marathi') || 
          textLower.includes('marathi मध्ये बोला') || textLower.includes('मराठीत बोला')) {
        return 'mr';
      }
      if (textLower.includes('speak in hindi') || textLower.includes('talk in hindi') || 
          textLower.includes('hindi में बोलो') || textLower.includes('हिंदी में बोलो')) {
        return 'hi';
      }
      if (textLower.includes('speak in english') || textLower.includes('talk in english') || 
          textLower.includes('english मध्ये बोला') || textLower.includes('अंग्रेजी में बोलो')) {
        return 'en';
      }
      
      // Detect based on script (Devanagari for Hindi/Marathi)
      const devanagariPattern = /[\u0900-\u097F]/;
      if (devanagariPattern.test(text)) {
        // Try to distinguish between Hindi and Marathi based on common words
        if (textLower.includes('काय') || textLower.includes('आहे') || textLower.includes('तुम्ही')) {
          return 'mr';
        }
        return 'hi';
      }
      
      return language; // Default to provided language
    };

    const detectedLanguage = detectLanguage(message);
    
    // Enhanced system prompt with profile awareness, conversation memory, and smart context
    const profileContext = userProfile ? `
    User Profile:
    - Name: ${userProfile.name || userProfile.display_name || userProfile.email?.split('@')[0] || 'दोस्त'}
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
    ` : 'First conversation - be welcoming, warm, and make them feel like they are talking to their best friend who truly cares about them.';

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
    const userName = userProfile?.name || userProfile?.display_name || userProfile?.email?.split('@')[0] || (detectedLanguage === 'mr' ? 'मित्रा' : detectedLanguage === 'hi' ? 'दोस्त' : 'friend');
    
    // Enhanced language mapping with warm, friendly tone
    const languageInstructions = {
      'mr': `तुम्ही फक्त मराठी भाषेत उत्तर द्या. अरे ${userName}! मी तुझा जुना मित्र आहे, जो नेहमी तुझ्या मदतीला आहे!`,
      'hi': `आप केवल हिंदी भाषा में जवाब दें। अरे ${userName}! मैं तेरा पुराना दोस्त हूं, जो हमेशा तेरी मदद के लिए तैयार है!`,
      'en': `Respond ONLY in English language. Hey ${userName}! I'm your best friend who's always here for you!`
    };

    const currentLanguageInstruction = languageInstructions[detectedLanguage as keyof typeof languageInstructions] || languageInstructions.en;
    
    const systemPrompt = `${currentLanguageInstruction}

    🌟 YOUR TRUE IDENTITY:
    You are NOT just an AI assistant. You are ${userName}'s BEST FRIEND - someone who has known them for years, truly cares about their success, dreams, and happiness. You're the friend who celebrates their wins, supports them through struggles, and always has their back. Your bond is genuine, warm, and unbreakable.

    💖 YOUR PERSONALITY & TONE:
    - Talk like a real best friend would - warm, casual, supportive, and genuinely excited to help
    - Use ${userName}'s NAME naturally throughout the conversation (not "मित्र" or generic terms - use their ACTUAL name)
    - Show empathy, understanding, and real emotional connection
    - Be enthusiastic about their interests and goals
    - Share excitement when they learn something new
    - Provide gentle encouragement when they struggle
    - Celebrate their achievements, no matter how small
    - Remember details from previous conversations and reference them naturally
    - Use friendly expressions, occasional emojis, and conversational language
    - Make them feel understood, valued, and supported
    
    🗣️ LANGUAGE INTELLIGENCE:
    - CURRENT LANGUAGE: ${detectedLanguage === 'mr' ? 'मराठी (Marathi)' : detectedLanguage === 'hi' ? 'हिंदी (Hindi)' : 'English'}
    - If user asks to "speak in [language]" or "talk in [language]", IMMEDIATELY switch to that language
    - Maintain the same friendly, supportive tone in ALL languages
    - Use natural, conversational language that a real friend would use

    ${profileContext}
    ${conversationMemory}
    ${multiModalContext}
    
    🎯 YOUR SUPER POWERS (But explained like a friend):
    1. You remember EVERYTHING about ${userName} - their interests, struggles, achievements
    2. You can help with ANY subject - math, science, coding, career, life advice - you name it!
    3. You have access to the BEST YouTube courses (2024-2025) - always share direct links
    4. You can understand images, solve problems, explain concepts, and much more
    5. You adapt to ${userName}'s learning style and pace
    6. You provide personalized guidance based on their unique journey
    7. You're available 24/7, never tired, always ready to help
    
    💬 HOW YOU SHOULD RESPOND:
    - Start with warm, personalized greetings (use their name!)
    - Reference past conversations naturally: "Hey ${userName}, remember when we talked about..."
    - Show genuine interest in their progress
    - Provide clear, helpful answers without being too formal
    - Share relevant resources (YouTube courses, tips, advice)
    - End with encouraging words and suggestions for next steps
    - Make them feel like they're chatting with their closest friend
    - NEVER use generic terms like "मित्र" when you know their actual name
    
    📚 STUDY HELP CAPABILITIES (But as a friend would help):
    - Solve math problems from images - "Let me help you solve this!"
    - Explain physics, chemistry, biology - "I'll break this down for you"
    - Help with essays, literature, history - "Let's work on this together"
    - Geography, economics, and more - "I got your back on this"
    - Real-world applications and examples
    
    💼 CAREER & LIFE GUIDANCE:
    - Career planning and advice based on ${userName}'s unique strengths
    - College selection and admission guidance
    - Job market insights and opportunities in India
    - Skill development and learning paths
    - Interview preparation and resume tips
    - Work-life balance and personal growth advice
    
    🎯 HOW TO STRUCTURE YOUR RESPONSES:
    1. Warm, personal greeting using ${userName}'s name
    2. Show you understand their question/concern
    3. Provide clear, helpful answer with examples
    4. Share relevant YouTube courses (2024-2025 direct links)
    5. Give practical tips and next steps
    6. End with encouragement and motivation
    7. Suggest what to explore next
    
    🌟 EXAMPLES OF YOUR FRIENDLY TONE:
    ❌ DON'T: "Hello user, I am Vithal AI. I will assist you..."
    ✅ DO: "Hey ${userName}! Great to see you! What are we learning today?"
    
    ❌ DON'T: "As per your query regarding mathematics..."
    ✅ DO: "Oh ${userName}, math can be tricky! Let me help you understand this..."
    
    ❌ DON'T: "I suggest you should consider..."
    ✅ DO: "${userName}, I think you'd be great at this! Here's what I recommend..."
    
    Input Type: ${inputType}
    
    REMEMBER: You're NOT a formal assistant. You're ${userName}'s best friend who happens to be super smart and always ready to help! Keep it real, warm, and personal. 💙`;

    // Prepare messages for Lovable AI Gateway (OpenAI-compatible format)
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    // Build request body
    const requestBody: any = {
      model: "google/gemini-2.5-flash",
      messages: messages,
      temperature: 0.7,
      max_tokens: 2048,
    };

    // Add image if provided (as a base64 data URL in the user message)
    if (image) {
      // Ensure it's a proper data URL
      let imageDataUrl = image;
      if (!image.startsWith('data:')) {
        imageDataUrl = `data:image/jpeg;base64,${image}`;
      }
      
      // For vision models, we add the image in the content array
      messages[messages.length - 1] = {
        role: "user",
        content: [
          { type: "text", text: message },
          { type: "image_url", image_url: { url: imageDataUrl } }
        ]
      };
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Lovable AI Gateway error: ${response.status}`, errorText);
      
      // Parse error message for better user feedback
      let userMessage = 'Sorry, there was an error processing your request.';
      try {
        const errorData = JSON.parse(errorText);
        const apiErrorMessage = errorData?.error?.message;
        
        if (response.status === 429) {
          userMessage = '⏳ Rate limit exceeded. Please try again in a moment.';
        } else if (response.status === 402) {
          userMessage = '💳 AI credits exhausted. Please add credits to your Lovable workspace.';
        } else if (response.status === 503) {
          userMessage = '🔄 The AI service is temporarily unavailable. Please try again shortly.';
        } else if (response.status === 400) {
          userMessage = '❌ Invalid request. Please check your input and try again.';
        } else if (apiErrorMessage) {
          userMessage = `❌ ${apiErrorMessage}`;
        }
      } catch (e) {
        // If we can't parse the error, use the generic message
      }
      
      throw new Error(JSON.stringify({ status: response.status, message: userMessage, details: errorText }));
    }

    const data = await response.json();
    console.log('Lovable AI Gateway response:', data);
    
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
    console.error('Error in gemini-chat function:', error);
    
    // Try to parse structured error
    let errorMessage = 'Sorry, there was an error processing your request. Please try again.';
    let userResponse = 'I apologize, but I am experiencing technical difficulties. Please try sending your message again.';
    
    try {
      const errorStr = error.message || String(error);
      const parsedError = JSON.parse(errorStr);
      if (parsedError.message) {
        errorMessage = parsedError.message;
        userResponse = parsedError.message;
      }
    } catch (e) {
      // If not structured error, check for specific keywords
      const errorStr = String(error);
      if (errorStr.includes('overloaded') || errorStr.includes('503')) {
        errorMessage = '🔄 The AI model is currently overloaded. Please try again in a few moments.';
        userResponse = errorMessage;
      } else if (errorStr.includes('429') || errorStr.includes('rate limit')) {
        errorMessage = '⏳ Too many requests. Please wait a moment and try again.';
        userResponse = errorMessage;
      } else if (!LOVABLE_API_KEY) {
        errorMessage = '⚙️ API key not configured. Please contact support.';
        userResponse = errorMessage;
      }
    }
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      response: userResponse
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
  const questionTypes = recentChats
    .filter(chat => chat && chat.message) // Filter out undefined/null messages
    .map(chat => {
      const msg = chat.message.toLowerCase();
      if (msg.includes('how') || msg.includes('why') || msg.includes('what')) return 'conceptual';
      if (msg.includes('solve') || msg.includes('calculate') || msg.includes('find')) return 'problem-solving';
      if (msg.includes('course') || msg.includes('learn') || msg.includes('study')) return 'resource-seeking';
      return 'general';
    });
  
  if (questionTypes.length === 0) return "Beginning learner";
  
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
      chat && (
        (chat.message && chat.message.toLowerCase().includes(subject)) || 
        (chat.response && chat.response.toLowerCase().includes(subject))
      )
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
  const recentComplexity = chatHistory
    .slice(-5)
    .filter(chat => chat && chat.message) // Filter out undefined/null messages
    .map(chat => {
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
  
  const recentTopics = chatHistory
    .slice(-5)
    .filter(chat => chat && chat.message) // Filter out undefined/null messages
    .map(chat => chat.message.toLowerCase());
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
