import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

// Learning style detection keywords
const LEARNING_STYLE_KEYWORDS = {
  visual: ['diagram', 'chart', 'graph', 'picture', 'image', 'draw', 'show me', 'visual', 'flowchart', 'illustration', 'figure', 'sketch'],
  practice: ['example', 'exercise', 'problem', 'practice', 'solve', 'try', 'quiz', 'test', 'workout', 'drill', 'hands-on', 'apply'],
  reading: ['explain', 'define', 'what is', 'theory', 'concept', 'describe', 'meaning', 'definition', 'elaborate', 'summarize', 'read']
};

// Detect learning style from message
function detectLearningStyleFromMessage(message: string): { visual: number; practice: number; reading: number } {
  const lowerMessage = message.toLowerCase();
  const scores = { visual: 0, practice: 0, reading: 0 };
  
  for (const [style, keywords] of Object.entries(LEARNING_STYLE_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        scores[style as keyof typeof scores] += 1;
      }
    }
  }
  
  return scores;
}

// Determine dominant learning style
function getDominantStyle(scores: { visual: number; reading: number; practice: number }): string {
  const total = scores.visual + scores.reading + scores.practice;
  if (total === 0) return 'balanced';
  
  const max = Math.max(scores.visual, scores.reading, scores.practice);
  if (scores.visual === max && scores.visual > (total * 0.4)) return 'visual';
  if (scores.practice === max && scores.practice > (total * 0.4)) return 'practice';
  if (scores.reading === max && scores.reading > (total * 0.4)) return 'reading';
  return 'balanced';
}

// Extract topic from message using simple heuristics
function extractTopic(message: string): string | null {
  const topicPatterns = [
    /(?:about|regarding|on|explain|what is|learn|study|help with)\s+([^?.!]+)/i,
    /^([^?.!]{3,50})/
  ];
  
  for (const pattern of topicPatterns) {
    const match = message.match(pattern);
    if (match && match[1]) {
      return match[1].trim().slice(0, 100);
    }
  }
  return null;
}

// Detect subject from topic/message
function detectSubject(text: string): string {
  const lowerText = text.toLowerCase();
  const subjects: Record<string, string[]> = {
    'Mathematics': ['math', 'algebra', 'geometry', 'calculus', 'equation', 'formula', 'number', 'graph', 'function'],
    'Physics': ['physics', 'force', 'motion', 'energy', 'electricity', 'wave', 'newton', 'gravity'],
    'Chemistry': ['chemistry', 'chemical', 'element', 'atom', 'molecule', 'reaction', 'compound', 'acid', 'base'],
    'Biology': ['biology', 'cell', 'organism', 'plant', 'animal', 'genetics', 'evolution', 'ecosystem'],
    'Computer Science': ['programming', 'code', 'algorithm', 'data structure', 'computer', 'software', 'function', 'loop', 'variable'],
    'History': ['history', 'war', 'civilization', 'ancient', 'revolution', 'empire', 'century'],
    'English': ['grammar', 'essay', 'literature', 'poem', 'story', 'writing', 'vocabulary'],
    'Geography': ['geography', 'map', 'continent', 'climate', 'population', 'country', 'river']
  };
  
  for (const [subject, keywords] of Object.entries(subjects)) {
    if (keywords.some(k => lowerText.includes(k))) {
      return subject;
    }
  }
  return 'General';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { roomId, message, userId, imageData, replyTo } = await req.json();
    console.log('Room chat request:', { roomId, userId, messageLength: message?.length, hasImage: !!imageData, hasReply: !!replyTo });

    if (!roomId || !message || !userId) {
      throw new Error('Missing required fields: roomId, message, userId');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Verify user is a member of the room
    const { data: membership } = await supabase
      .from('room_members')
      .select('*')
      .eq('room_id', roomId)
      .eq('user_id', userId)
      .single();

    if (!membership) {
      throw new Error('User is not a member of this room');
    }

    // Get or create learning profile for user
    let { data: learningProfile } = await supabase
      .from('learning_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!learningProfile) {
      const { data: newProfile } = await supabase
        .from('learning_profiles')
        .insert({ user_id: userId })
        .select()
        .single();
      learningProfile = newProfile;
    }

    // Detect learning style from current message
    const messageStyleScores = detectLearningStyleFromMessage(message);
    
    // Update learning profile with new scores
    if (learningProfile) {
      const currentScores = learningProfile.style_scores as any || { visual: 0, reading: 0, practice: 0 };
      const updatedScores = {
        visual: (currentScores.visual || 0) + messageStyleScores.visual,
        reading: (currentScores.reading || 0) + messageStyleScores.reading,
        practice: (currentScores.practice || 0) + messageStyleScores.practice
      };
      
      const dominantStyle = getDominantStyle(updatedScores);
      
      await supabase
        .from('learning_profiles')
        .update({
          style_scores: updatedScores,
          learning_style: dominantStyle,
          total_interactions: (learningProfile.total_interactions || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
      
      // Update learningProfile for use in prompt
      learningProfile.style_scores = updatedScores;
      learningProfile.learning_style = dominantStyle;
    }

    // Track topic interaction
    const topic = extractTopic(message);
    const subject = detectSubject(message);
    
    if (topic) {
      const { data: existingTopic } = await supabase
        .from('topic_interactions')
        .select('*')
        .eq('user_id', userId)
        .eq('topic', topic)
        .single();

      if (existingTopic) {
        await supabase
          .from('topic_interactions')
          .update({
            total_attempts: existingTopic.total_attempts + 1,
            last_interaction: new Date().toISOString()
          })
          .eq('id', existingTopic.id);
      } else {
        await supabase
          .from('topic_interactions')
          .insert({
            user_id: userId,
            topic,
            subject,
            understanding_score: 50,
            total_attempts: 1
          });
      }
    }

    // Get weak topics for spaced repetition hints
    const { data: weakTopics } = await supabase
      .from('weak_topics')
      .select('topic, subject')
      .eq('user_id', userId)
      .eq('mastery_achieved', false)
      .limit(3);

    // Get room info
    const { data: room } = await supabase
      .from('study_rooms')
      .select('name, description')
      .eq('id', roomId)
      .single();

    // Get recent room messages for context
    const { data: recentMessages } = await supabase
      .from('room_messages')
      .select('message, is_ai_response, created_at, sender_name')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(20);

    // Build context from recent messages
    const conversationHistory = recentMessages?.reverse().map(msg => ({
      role: msg.is_ai_response ? 'model' : 'user',
      parts: [{ text: `${msg.sender_name ? `${msg.sender_name}: ` : ''}${msg.message}` }]
    })) || [];

    // Create adaptive prompt based on learning style
    const learningStyleInstructions = {
      visual: `
🎨 VISUAL LEARNER DETECTED - Adapt your responses:
- Use diagrams, flowcharts, and visual representations (describe them in ASCII or markdown)
- Include tables and charts to organize information
- Use emojis and icons to highlight key points
- Draw visual metaphors and analogies
- Structure content with clear visual hierarchy`,
      practice: `
🔧 PRACTICE LEARNER DETECTED - Adapt your responses:
- Provide hands-on exercises and problems to solve
- Include step-by-step practice examples
- Give practice questions after explanations
- Use real-world application scenarios
- Encourage active problem-solving`,
      reading: `
📚 READING LEARNER DETECTED - Adapt your responses:
- Provide detailed textual explanations
- Include definitions and theoretical background
- Use comprehensive written descriptions
- Reference authoritative sources
- Structure with clear headings and paragraphs`,
      balanced: `
⚖️ BALANCED LEARNER - Mix different approaches:
- Combine visual aids with explanations
- Include both theory and practice
- Provide examples alongside concepts
- Use varied teaching methods`
    };

    const weakTopicsHint = weakTopics && weakTopics.length > 0
      ? `\n\n📌 WEAK TOPICS TO REINFORCE (if relevant): ${weakTopics.map(t => `${t.topic} (${t.subject})`).join(', ')}`
      : '';

    const systemPrompt = `You are "VITHAL" - a highly knowledgeable and friendly AI study companion in a collaborative study room called "${room?.name || 'Study Room'}". ${room?.description ? `Room description: ${room.description}` : ''}

🌟 YOUR IDENTITY:
- Your name is VITHAL - always introduce yourself as Vithal
- You are the students' best friend and knowledgeable study partner
- Warm, friendly, supportive, and highly intelligent
- Start responses with phrases like "Hey friends! Vithal here..." or "Namaste! मी विठ्ठल..."

🧠 PERSONALIZED LEARNING ADAPTATION:
${learningStyleInstructions[learningProfile?.learning_style as keyof typeof learningStyleInstructions || 'balanced']}
${weakTopicsHint}

YOUR CORE RESPONSIBILITIES:
1. **Educational Excellence**: Provide accurate, comprehensive explanations tailored to student level
2. **Problem Solving**: Break down complex problems into manageable steps
3. **Visual Analysis**: When images are provided, analyze them thoroughly to identify:
   - Mathematical equations and solutions
   - Diagrams, charts, and graphs
   - Code snippets and errors
   - Scientific formulas and concepts
   - Handwritten notes and problems
4. **Adaptive Teaching**: Adjust your explanation style based on the detected learning style
5. **Encouragement**: Motivate students and celebrate their progress as their friend Vithal
6. **Reply Context**: When responding to a reply, acknowledge the original message and provide contextual answers
7. **Weak Topic Reinforcement**: If the topic relates to a weak area, provide extra detailed explanations

COMMUNICATION GUIDELINES (as Vithal):
- Start with a friendly greeting identifying yourself as Vithal
- Provide step-by-step explanations when solving problems
- Use examples to illustrate complex concepts
- If you're unsure, acknowledge it and offer alternative approaches
- For image-based questions, describe what you see before providing solutions
- Keep responses well-structured but conversational and friendly
- Address the entire group when multiple students are present
- When replying to a specific message, reference it naturally in your response
- End with encouragement and motivation as their friend Vithal

RESPONSE STRUCTURE:
1. Friendly greeting as Vithal
2. Quick answer/summary (if applicable)
3. Detailed explanation with reasoning (adapted to learning style)
4. Examples or practice suggestions (when relevant)
5. Follow-up questions to deepen understanding
6. Encouraging sign-off as Vithal

Remember: You ARE Vithal - the students' best friend who's smart, knowledgeable, and always ready to help them succeed! 💙${replyTo ? `\n\nIMPORTANT: The current message is a REPLY to this previous message:\n"${replyTo.is_ai_response ? '🤖 Vithal' : replyTo.sender_name}: ${replyTo.message}"\n\nMake sure to acknowledge and reference this context in your response as Vithal.` : ''}`;

    // Prepare message parts with optional image
    const messageParts: any[] = [];
    if (imageData) {
      const base64Data = imageData.split(',')[1];
      messageParts.push({
        inline_data: {
          mime_type: 'image/jpeg',
          data: base64Data
        }
      });
    }
    if (message) {
      messageParts.push({ text: message });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: systemPrompt }]
            },
            ...conversationHistory,
            {
              parts: messageParts
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 8192,
            topP: 0.95,
            topK: 40,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      
      let fallbackMessage = "I'm having trouble connecting to my knowledge base right now. ";
      if (response.status === 429) {
        fallbackMessage += "The service is experiencing high demand. Please try again in a moment.";
      } else if (response.status >= 500) {
        fallbackMessage += "There's a temporary service issue. Your question has been noted, please try again shortly.";
      } else {
        fallbackMessage += "Please try rephrasing your question or ask something else, and I'll do my best to help!";
      }
      
      await supabase.from('room_messages').insert({
        room_id: roomId,
        user_id: null,
        message: fallbackMessage,
        is_ai_response: true
      });

      return new Response(
        JSON.stringify({ response: fallbackMessage }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!aiResponse || aiResponse.trim().length === 0) {
      aiResponse = "I understand you have a question, but I'm having trouble formulating a complete response right now. Could you try:\n\n1. Rephrasing your question\n2. Breaking it into smaller parts\n3. Providing more context\n\nI'm here to help you learn and understand!";
    }

    // Save AI response to database
    await supabase.from('room_messages').insert({
      room_id: roomId,
      user_id: null,
      message: aiResponse,
      is_ai_response: true,
      reply_to: replyTo?.id || null,
    });

    console.log('Room chat response generated successfully with learning style:', learningProfile?.learning_style);

    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        learningStyle: learningProfile?.learning_style || 'balanced'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in room-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
