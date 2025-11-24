import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { topic, difficulty, questionCount, userId } = await req.json();

    if (!topic || !userId) {
      return new Response(
        JSON.stringify({ error: 'Topic and user ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Generating quiz for topic: ${topic}, difficulty: ${difficulty}, questions: ${questionCount}`);

    // Generate quiz with Gemini 3.0 via Lovable AI Gateway
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    const difficultyLevel = difficulty || 'medium';
    const numQuestions = questionCount || 10;

    const prompt = `
Create a ${difficultyLevel} difficulty quiz about ${topic} with ${numQuestions} multiple choice questions.

Requirements:
- Each question should have 4 options (A, B, C, D)
- Only one correct answer per question
- Include a brief explanation for the correct answer
- Questions should progressively test understanding
- Mix factual recall, comprehension, and application questions

Format your response as JSON:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": {
        "A": "Option A text",
        "B": "Option B text", 
        "C": "Option C text",
        "D": "Option D text"
      },
      "correctAnswer": "A",
      "explanation": "Brief explanation of why this is correct"
    }
  ]
}`;

    const geminiResponse = await fetch(
      'https://ai.gateway.lovable.dev/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-3-pro-preview',
          messages: [
            { role: 'system', content: 'You are an expert quiz creator. Always return valid JSON in the exact format requested.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 3000,
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini 3.0 response received');

    const quizText = geminiData.choices?.[0]?.message?.content || '';
    
    // Parse the quiz JSON
    let quizData;
    try {
      // Clean the response text to extract JSON
      const jsonMatch = quizText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        quizData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing quiz JSON:', parseError);
      // Fallback: create a simple quiz structure
      quizData = {
        questions: [{
          question: "This is a sample question about " + topic,
          options: {
            A: "Option A",
            B: "Option B", 
            C: "Option C",
            D: "Option D"
          },
          correctAnswer: "A",
          explanation: "This is a sample explanation."
        }]
      };
    }

    // Save quiz session to database
    const { data: quizSession, error: insertError } = await supabaseClient
      .from('quiz_sessions')
      .insert({
        user_id: userId,
        topic: topic,
        difficulty_level: difficultyLevel,
        questions: quizData.questions,
        total_questions: quizData.questions.length,
        status: 'active'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error saving quiz session:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        quizSession: quizSession
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in quiz-generator function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});