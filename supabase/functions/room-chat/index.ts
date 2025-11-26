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

    // Get recent room messages for context
    const { data: recentMessages } = await supabase
      .from('room_messages')
      .select('message, is_ai_response, created_at')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(10);

    // Build context from recent messages
    const conversationHistory = recentMessages?.reverse().map(msg => ({
      role: msg.is_ai_response ? 'model' : 'user',
      parts: [{ text: msg.message }]
    })) || [];

    const systemPrompt = `You are an AI study assistant in a collaborative study room called "${room?.name || 'Study Room'}". ${room?.description ? `Room description: ${room.description}` : ''}

Your role:
- Help students with their studies collaboratively
- Answer questions, explain concepts, and provide guidance
- Be encouraging and supportive
- Keep responses clear and concise
- If multiple students are present, address the group

Remember: This is a shared space where multiple students can interact with you together.`;

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
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.';

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