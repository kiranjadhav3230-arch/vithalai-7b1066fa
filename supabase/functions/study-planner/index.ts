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

    const { subjects, duration, studyHoursPerDay, goals, userId } = await req.json();

    if (!subjects || !duration || !userId) {
      return new Response(
        JSON.stringify({ error: 'Subjects, duration, and user ID are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Creating study plan for ${duration} days with subjects:`, subjects);

    // Generate study plan with Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const prompt = `
Create a comprehensive study plan for the following subjects: ${subjects.join(', ')}

Duration: ${duration} days
Daily study hours: ${studyHoursPerDay || 2} hours
Goals: ${goals || 'General learning and understanding'}

Create a detailed schedule that:
1. Distributes subjects evenly across the duration
2. Includes review sessions and practice tests
3. Balances difficulty and variety
4. Includes break days for rest
5. Provides specific daily tasks and topics

Format your response as JSON:
{
  "title": "Study Plan Title",
  "description": "Brief description of the plan",
  "totalHours": total_estimated_hours,
  "schedule": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "subject": "Subject Name",
      "topic": "Specific topic to study",
      "duration": hours_for_this_session,
      "tasks": ["task1", "task2", "task3"],
      "resources": ["resource1", "resource2"],
      "type": "study|review|practice|break"
    }
  ],
  "weeklyGoals": [
    {
      "week": 1,
      "goals": ["goal1", "goal2"],
      "milestones": ["milestone1", "milestone2"]
    }
  ]
}`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.5,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4000,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response received for study plan');

    const planText = geminiData.candidates[0].content.parts[0].text;
    
    // Parse the study plan JSON
    let planData;
    try {
      const jsonMatch = planText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing plan JSON:', parseError);
      // Fallback: create a simple plan structure
      const startDate = new Date();
      planData = {
        title: "Study Plan for " + subjects.join(', '),
        description: "A comprehensive study plan",
        totalHours: duration * (studyHoursPerDay || 2),
        schedule: subjects.map((subject, index) => ({
          day: index + 1,
          date: new Date(startDate.getTime() + (index * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
          subject: subject,
          topic: `Introduction to ${subject}`,
          duration: studyHoursPerDay || 2,
          tasks: [`Study ${subject} basics`, `Review key concepts`, `Practice problems`],
          resources: [`${subject} textbook`, "Online videos"],
          type: "study"
        })),
        weeklyGoals: [{
          week: 1,
          goals: [`Master ${subjects[0]} fundamentals`],
          milestones: ["Complete first week of study"]
        }]
      };
    }

    // Calculate dates
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (duration * 24 * 60 * 60 * 1000));

    // Save study plan to database
    const { data: studyPlan, error: insertError } = await supabaseClient
      .from('study_plans')
      .insert({
        user_id: userId,
        title: planData.title,
        description: planData.description,
        subjects: subjects,
        schedule: planData.schedule,
        total_hours: planData.totalHours,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        status: 'active'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error saving study plan:', insertError);
      throw insertError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        studyPlan: studyPlan,
        planDetails: planData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in study-planner function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});