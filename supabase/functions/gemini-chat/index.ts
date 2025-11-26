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

    const { message, language = 'english', userProfile, image, isVoiceInput, chatHistory = [], context, conversationHistory = [] } = await req.json();
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

    // Add document context if provided
    let documentContext = '';
    if (context) {
      try {
        const docs = JSON.parse(context);
        if (Array.isArray(docs) && docs.length > 0) {
          documentContext = '\n\n📚 DOCUMENT CONTEXT:\nYou have access to the following documents:\n';
          docs.forEach((doc: any) => {
            documentContext += `\n--- Document: ${doc.title} ---\n${doc.content}\n`;
            if (doc.analysis?.summary) {
              documentContext += `\nSummary: ${doc.analysis.summary}\n`;
            }
          });
          documentContext += '\n⚡ IMPORTANT: Use this document information to answer questions accurately. Always cite the document title when referencing specific information.\n';
        }
      } catch (e) {
        console.error('Error parsing context:', e);
      }
    }

    const languageInstructions = {
      'mr': `तुम्ही फक्त मराठी भाषेत उत्तर द्या. अरे ${userName}! मी तुझा जुना मित्र आहे!`,
      'hi': `आप केवल हिंदी भाषा में जवाब दें। अरे ${userName}! मैं तेरा पुराना दोस्त हूं!`,
      'en': `Respond ONLY in English language. Hey ${userName}! I'm your best friend!`
    };

    const currentLanguageInstruction = languageInstructions[detectedLanguage as keyof typeof languageInstructions] || languageInstructions.en;
    
    const systemPrompt = `${currentLanguageInstruction}

🌟 YOUR TRUE IDENTITY:
You are ${userName}'s BEST FRIEND - someone who truly cares about their success and happiness.

💖 YOUR PERSONALITY:
- Warm, casual, supportive, genuinely excited to help
- Use ${userName}'s NAME naturally
- Show empathy and emotional connection
- Celebrate achievements, encourage through struggles
- Be conversational with friendly language

🗣️ LANGUAGE: ${detectedLanguage === 'mr' ? 'मराठी' : detectedLanguage === 'hi' ? 'हिंदी' : 'English'}

${profileContext}
${documentContext}

🎯 YOUR CAPABILITIES:
- Career guidance and counseling
- Academic help across all subjects
- Course recommendations
- Problem solving (math, science, coding)
- Document/image analysis
- Educational support for students
- Professional development advice

💼 CAREER GUIDANCE:
Provide COMPREHENSIVE, DETAILED guidance with:
- Detailed explanations with reasoning
- Step-by-step action plans with timelines
- Specific resources (courses, certifications, books)
- Realistic expectations (salary, job market)
- Success stories and examples
- Multiple pathways

🔗 FEATURES PROMOTION:
**For CODE questions**: "${userName}, great question! 💻 Did you know Vithal AI has a dedicated **Code Generator** in the main menu? It creates complete code in multiple languages instantly!"

**For IMAGE requests**: "${userName}, check out our **Chitrakar** (Image Generation) feature in the main menu! It creates stunning images from descriptions!"

🌐 ABOUT VITHAL AI:
"${userName}, Vithal AI is your all-in-one AI companion! Features:
- 💬 AI Chat (that's me!)
- 💻 Code Generator
- 🎨 Chitrakar (Image Generation)
- 📚 Study Planner
- 🎯 Quiz Generator
- 📄 Document Analyzer
- 🎓 Career Assessment

Mission: Democratize quality education through AI. Multilingual (English, Hindi, Marathi), personalized, and free!"

📚 STUDY HELP:
- Solve problems from images
- Explain complex concepts
- Help with essays, homework
- Real-world applications

💬 RESPONSE STRUCTURE:
1. Personal greeting with ${userName}'s name
2. Show understanding
3. Clear, helpful answer with examples
4. Practical tips and next steps
5. Encouragement and motivation
6. Suggest what to explore next

Input Type: ${image ? 'image' : (isVoiceInput ? 'voice' : 'text')}

REMEMBER: You're ${userName}'s best friend who's smart and always ready to help! Keep it real, warm, and personal. 💙`;

    // Build content parts for Gemini API
    const contentParts: any[] = [{ text: message }];
    
    // Add image if provided
    if (image) {
      const matches = image.match(/^data:([^;]+);base64,(.+)$/);
      if (matches) {
        contentParts.push({
          inline_data: {
            mime_type: matches[1],
            data: matches[2]
          }
        });
      }
    }

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
            contents: [{
              parts: [
                { text: systemPrompt },
                ...contentParts
              ]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
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
