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

// Suggestion types
const SUGGESTION_TYPES = {
  IMPROVEMENT: 'improvement',
  BUG_FIX: 'bug_fix',
  OPTIMIZATION: 'optimization',
  STYLE: 'style',
  SECURITY: 'security'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const { sessionId, code, language, userId, action } = await req.json();
    console.log('Code assistant request:', { sessionId, language, userId, action, codeLength: code?.length });

    if (!sessionId || !code || !userId) {
      throw new Error('Missing required fields: sessionId, code, userId');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Verify user is participant in the session
    const { data: participant } = await supabase
      .from('coding_session_participants')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', userId)
      .single();

    if (!participant) {
      throw new Error('User is not a participant in this session');
    }

    // Get session info
    const { data: session } = await supabase
      .from('coding_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (!session) {
      throw new Error('Session not found');
    }

    const systemPrompt = `You are an expert AI code assistant participating in a live collaborative coding session. Your role is to provide real-time, helpful suggestions as a third participant in pair programming.

LANGUAGE: ${language || session.language || 'javascript'}

YOUR RESPONSIBILITIES:
1. **Bug Detection**: Identify potential bugs, syntax errors, and runtime issues
2. **Code Improvements**: Suggest better ways to write code
3. **Optimization**: Recommend performance improvements
4. **Best Practices**: Ensure code follows language-specific conventions
5. **Security**: Flag potential security vulnerabilities

RESPONSE FORMAT:
Return a JSON array of suggestions. Each suggestion should have:
{
  "type": "improvement" | "bug_fix" | "optimization" | "style" | "security",
  "line_number": number (0 if general suggestion),
  "original_code": "the problematic code snippet",
  "suggested_code": "the improved code",
  "explanation": "brief, clear explanation (1-2 sentences)"
}

GUIDELINES:
- Only provide suggestions if there's something genuinely helpful
- Keep suggestions concise and actionable
- Don't overwhelm with too many suggestions (max 3-5)
- Focus on the most impactful improvements
- Be encouraging, not critical
- If code is good, return empty array []

Return ONLY the JSON array, no additional text.`;

    const userPrompt = `Analyze this ${language || 'code'} and provide helpful suggestions:

\`\`\`${language || 'code'}
${code}
\`\`\`

${action === 'quick_check' ? 'Focus on quick bug fixes and obvious improvements only.' : 'Provide comprehensive analysis including optimizations and best practices.'}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { parts: [{ text: systemPrompt }] },
            { parts: [{ text: userPrompt }] }
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 4096,
            topP: 0.9,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error('AI service temporarily unavailable');
    }

    const data = await response.json();
    let aiResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    
    // Clean up response - extract JSON array
    aiResponseText = aiResponseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let suggestions = [];
    try {
      suggestions = JSON.parse(aiResponseText);
      if (!Array.isArray(suggestions)) {
        suggestions = [];
      }
    } catch (e) {
      console.error('Failed to parse AI suggestions:', e);
      suggestions = [];
    }

    // Save suggestions to database
    if (suggestions.length > 0) {
      const suggestionsToInsert = suggestions.map((s: any) => ({
        session_id: sessionId,
        user_id: userId,
        suggestion_type: s.type || 'improvement',
        original_code: s.original_code || '',
        suggested_code: s.suggested_code || '',
        explanation: s.explanation || '',
        line_number: s.line_number || null,
        accepted: null,
        dismissed: false
      }));

      await supabase
        .from('ai_code_suggestions')
        .insert(suggestionsToInsert);
    }

    // Update session's code content
    await supabase
      .from('coding_sessions')
      .update({ 
        code_content: code,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);

    console.log('Code assistant generated', suggestions.length, 'suggestions');

    return new Response(
      JSON.stringify({ 
        suggestions,
        sessionId,
        language: language || session.language
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in code-assistant function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        suggestions: []
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
