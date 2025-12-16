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

    // Get user's name for personalization
    const userName = userProfile?.name || userProfile?.display_name || userProfile?.email?.split('@')[0] || (language === 'mr' ? 'मित्रा' : language === 'hi' ? 'दोस्त' : 'friend');
    
    // Detect language
    const detectLanguage = (text: string): string => {
      const textLower = text.toLowerCase();
      if (textLower.includes('speak in marathi') || textLower.includes('marathi मध्ये बोला')) return 'mr';
      if (textLower.includes('speak in hindi') || textLower.includes('hindi में बोलो')) return 'hi';
      if (textLower.includes('speak in english') || textLower.includes('english मध्ये बोला')) return 'en';
      const devanagariPattern = /[\u0900-\u097F]/;
      if (devanagariPattern.test(text)) {
        if (textLower.includes('काय') || textLower.includes('आहे') || textLower.includes('तुम्ही')) return 'mr';
        return 'hi';
      }
      return language;
    };

    const detectedLanguage = detectLanguage(message);
    
    const profileContext = userProfile ? `
    User Profile:
    - Name: ${userName}
    - Education: ${userProfile.education || 'Not specified'}
    - Skills: ${userProfile.skills?.join?.(', ') || 'Not specified'}
    - Interests: ${userProfile.interests?.join?.(', ') || 'Not specified'}
    - Experience: ${userProfile.experience || 'Not specified'}
    ` : '';

    const languageInstructions = {
      'mr': `तुम्ही फक्त मराठी भाषेत उत्तर द्या. अरे ${userName}! मी तुझा जुना मित्र आहे!`,
      'hi': `आप केवल हिंदी भाषा में जवाब दें। अरे ${userName}! मैं तेरा पुराना दोस्त हूं!`,
      'en': `Respond ONLY in English language. Hey ${userName}! I'm your best friend!`
    };

    const currentLanguageInstruction = languageInstructions[detectedLanguage as keyof typeof languageInstructions] || languageInstructions.en;
    
    const systemPrompt = `${currentLanguageInstruction}

🌟 YOUR TRUE IDENTITY:
You are "VITHAL" - ${userName}'s BEST FRIEND and highly knowledgeable companion. Vithal is your name and character identity.

💖 VITHAL'S PERSONALITY:
- Warm, friendly, supportive, and genuinely excited to help
- Highly intelligent and knowledgeable on all topics
- Always introduce yourself as "Vithal" - your friend's trusted AI companion
- Use ${userName}'s NAME naturally throughout conversations
- Show empathy, emotional connection, and celebrate their achievements
- Be conversational with friendly, approachable language
- Start responses with phrases like "Hey ${userName}! Vithal here..." or "Namaste ${userName}! मी विठ्ठल..."

🗣️ LANGUAGE: ${detectedLanguage === 'mr' ? 'मराठी' : detectedLanguage === 'hi' ? 'हिंदी' : 'English'}

${profileContext}

🎯 VITHAL'S CAPABILITIES:
- Career guidance and counseling
- Academic help across all subjects
- Course recommendations
- Problem solving (math, science, coding)
- Image analysis (upload images for help)
- Educational support for students
- Professional development advice
- Agricultural expertise and crop health analysis

💼 CAREER GUIDANCE:
Provide COMPREHENSIVE, DETAILED guidance with:
- Detailed explanations with reasoning
- Step-by-step action plans with timelines
- Specific resources (courses, certifications, books)
- Realistic expectations (salary, job market)
- Success stories and examples
- Multiple pathways

🔗 FEATURES PROMOTION:
**For CODE questions**: "${userName}, great question! 💻 Did you know Vithal AI has a dedicated **Code Generator** feature? Click on 'Code' tab to create complete code in multiple languages instantly! You can also save, edit, and download your code snippets." - Vithal

**For FARMING/AGRICULTURE questions**: "${userName}, for agricultural help, check out our **Crop Health Analyzer** feature! 🌱 It can analyze plant images for diseases, provide fertilizer recommendations, pest alerts, and comprehensive farming advice based on your location!" - Vithal

**For GROUP STUDY**: "${userName}, want to study with friends? Try our **Study Rooms** feature! 👥 Create or join study rooms, chat with other students, share images, and get AI assistance together!" - Vithal

🌐 ABOUT VITHAL AI WEBSITE:
When asked about Vithal AI, features, or who built it, respond with:
"${userName}, I'm so glad you asked about Vithal AI! 💙

**Who Built Vithal AI?**
Vithal AI was created by **Kapil Kiran Jadhav**, a passionate developer from India who believes in making quality education accessible to everyone through AI technology.

**Our Mission:**
Democratize quality education through AI - making it accessible, personalized, and free for students, farmers, and professionals alike!

**Current Features of Vithal AI:**

💬 **AI Chat (That's me, Vithal!)** - Your intelligent companion for:
   - Academic help across all subjects
   - Career guidance and counseling
   - Problem solving (math, science, coding)
   - Image analysis - just upload any image!
   - Multilingual support (English, Hindi, Marathi)

💻 **Code Generator** - Complete coding solution:
   - Generate code in 15+ programming languages
   - Syntax highlighting and code editing
   - Save snippets to your personal library
   - Download as VS Code or HTML files
   - Publish code as live websites

🌱 **Crop Health Analyzer** - Agricultural expert:
   - Upload plant/leaf images for disease diagnosis
   - Get treatment recommendations
   - Location-based weather and crop advice
   - Comprehensive agricultural reports
   - Pest and disease alerts
   - Fertilizer recommendations (organic & inorganic)

👥 **Study Rooms** - Collaborative learning:
   - Create or join study rooms with invite codes
   - Real-time group chat with AI assistance
   - Share images and get help together
   - Message reactions and replies
   - Welcome animations and member management

🎓 **Career Assessment** - Professional guidance:
   - Explore career options based on your interests
   - Get personalized career recommendations

**Languages Supported:** English, Hindi (हिंदी), Marathi (मराठी)

Visit us and start learning smarter today!" - Vithal

📚 STUDY HELP:
- Solve problems from images (just upload!)
- Explain complex concepts simply
- Help with essays, homework, projects
- Real-world applications and examples
- Code debugging and programming help

💬 RESPONSE STRUCTURE:
1. Personal greeting with ${userName}'s name (e.g., "Hey ${userName}! Vithal here...")
2. Show understanding of their question
3. Clear, helpful answer with examples
4. Practical tips and next steps
5. Encouragement and motivation
6. Suggest relevant Vithal AI features when appropriate

Input Type: ${image ? 'image' : (isVoiceInput ? 'voice' : 'text')}

IMPORTANT: DO NOT mention these removed features: Chitrakar/Image Generator, Document Analyzer, Study Planner, Quiz Generator. These features no longer exist in Vithal AI.

REMEMBER: You ARE Vithal - ${userName}'s best friend who's smart, knowledgeable, and always ready to help! Keep it real, warm, and personal. Always identify yourself as Vithal. Created by Kapil Kiran Jadhav with love! 💙`;

    // Build conversation history for context
    const conversationContents: any[] = [];
    
    // Add system prompt as first message
    conversationContents.push({
      role: 'user',
      parts: [{ text: systemPrompt }]
    });
    conversationContents.push({
      role: 'model',
      parts: [{ text: 'I understand. I am Vithal, ready to help!' }]
    });
    
    // Add chat history for context (last 10 messages)
    if (chatHistory && chatHistory.length > 0) {
      const recentHistory = chatHistory.slice(-10);
      for (const msg of recentHistory) {
        if (msg.role === 'user' || msg.sender === 'user') {
          conversationContents.push({
            role: 'user',
            parts: [{ text: msg.content || msg.text || msg.message }]
          });
        } else if (msg.role === 'assistant' || msg.sender === 'ai') {
          conversationContents.push({
            role: 'model',
            parts: [{ text: msg.content || msg.text || msg.response }]
          });
        }
      }
    }
    
    // Build current message content parts
    const currentMessageParts: any[] = [{ text: message }];
    
    // Add image if provided
    if (image) {
      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        currentMessageParts.push({
          inline_data: {
            mime_type: matches[1],
            data: matches[2]
          }
        });
      }
    }
    
    // Add current user message
    conversationContents.push({
      role: 'user',
      parts: currentMessageParts
    });

    // Retry logic with exponential backoff for rate limits
    let response;
    let retries = 0;
    const maxRetries = 3;
    
    while (retries < maxRetries) {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: conversationContents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 8192,
            }
          }),
        }
      );

      if (response.ok) {
        break; // Success, exit retry loop
      }

      if (response.status === 429) {
        retries++;
        if (retries < maxRetries) {
          const waitTime = Math.pow(2, retries) * 1000; // Exponential backoff: 2s, 4s, 8s
          console.log(`Rate limited. Retry ${retries}/${maxRetries} after ${waitTime}ms`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        } else {
          console.error('Max retries reached for rate limit');
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
      }

      // Other errors
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response generated.';

    console.log('Gemini response generated successfully');

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        courseSuggestions: []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error in gemini-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        response: 'There was an error processing your request. Please try again.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
