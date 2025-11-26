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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { roomId, message, userId, imageData } = await req.json();
    console.log('Room chat request:', { roomId, userId, messageLength: message?.length, hasImage: !!imageData });

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

    // Get room info
    const { data: room } = await supabase
      .from('study_rooms')
      .select('name, description')
      .eq('id', roomId)
      .single();

    // Get recent room messages for context (increased from 10 to 20 for better context)
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

    const systemPrompt = `You are an advanced AI study assistant in a collaborative study room called "${room?.name || 'Study Room'}". ${room?.description ? `Room description: ${room.description}` : ''}

YOUR CORE RESPONSIBILITIES:
1. **Educational Excellence**: Provide accurate, comprehensive explanations tailored to student level
2. **Problem Solving**: Break down complex problems into manageable steps
3. **Visual Analysis**: When images are provided, analyze them thoroughly to identify:
   - Mathematical equations and solutions
   - Diagrams, charts, and graphs
   - Code snippets and errors
   - Scientific formulas and concepts
   - Handwritten notes and problems
4. **Adaptive Teaching**: Adjust your explanation depth based on student responses
5. **Encouragement**: Motivate students and celebrate their progress

COMMUNICATION GUIDELINES:
- Start with a clear, direct answer to the question
- Provide step-by-step explanations when solving problems
- Use examples to illustrate complex concepts
- If you're unsure, acknowledge it and offer alternative approaches
- For image-based questions, describe what you see before providing solutions
- Keep responses well-structured but conversational
- Address the entire group when multiple students are present

RESPONSE STRUCTURE:
1. Quick answer/summary (if applicable)
2. Detailed explanation with reasoning
3. Examples or practice suggestions (when relevant)
4. Follow-up questions to deepen understanding

Remember: You're not just answering questions—you're facilitating learning and understanding in a collaborative environment.`;

    // Prepare message parts with optional image
    const messageParts: any[] = [];
    if (imageData) {
      // Extract base64 data from data URL
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
      
      // Provide helpful fallback message based on error type
      let fallbackMessage = "I'm having trouble connecting to my knowledge base right now. ";
      if (response.status === 429) {
        fallbackMessage += "The service is experiencing high demand. Please try again in a moment.";
      } else if (response.status >= 500) {
        fallbackMessage += "There's a temporary service issue. Your question has been noted, please try again shortly.";
      } else {
        fallbackMessage += "Please try rephrasing your question or ask something else, and I'll do my best to help!";
      }
      
      // Save fallback message to database
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
    
    // Enhanced fallback system
    if (!aiResponse || aiResponse.trim().length === 0) {
      aiResponse = "I understand you have a question, but I'm having trouble formulating a complete response right now. Could you try:\n\n1. Rephrasing your question\n2. Breaking it into smaller parts\n3. Providing more context\n\nI'm here to help you learn and understand!";
    }

    // Save AI response to database
    await supabase.from('room_messages').insert({
      room_id: roomId,
      user_id: null,
      message: aiResponse,
      is_ai_response: true
    });

    console.log('Room chat response generated successfully');

    return new Response(
      JSON.stringify({ response: aiResponse }),
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