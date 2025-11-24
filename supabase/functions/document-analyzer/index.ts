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

    const { documentId, documentText } = await req.json();

    if (!documentId || !documentText) {
      return new Response(
        JSON.stringify({ error: 'Document ID and text are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Analyzing document: ${documentId}`);

    // Update document status to analyzing
    await supabaseClient
      .from('documents')
      .update({ analysis_status: 'analyzing' })
      .eq('id', documentId);

    // Analyze document with Gemini 3.0 via Lovable AI Gateway
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!lovableApiKey) {
      throw new Error('LOVABLE_API_KEY is not set');
    }

    const prompt = `
Analyze this document and provide:
1. A comprehensive summary (2-3 paragraphs)
2. Key topics and concepts identified
3. Important definitions or terms
4. Main arguments or points
5. Study questions based on the content (10 questions)
6. Areas that might need further research

Document content:
${documentText}

Please format your response as JSON with the following structure:
{
  "summary": "...",
  "keyTopics": ["topic1", "topic2", ...],
  "definitions": [{"term": "...", "definition": "..."}],
  "mainPoints": ["point1", "point2", ...],
  "studyQuestions": ["question1", "question2", ...],
  "researchAreas": ["area1", "area2", ...]
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
            { role: 'system', content: 'You are an expert document analyzer. Always return valid JSON in the exact format requested.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 2048,
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini 3.0 response received');

    const analysisText = geminiData.choices?.[0]?.message?.content || '';
    
    // Try to parse as JSON, fallback to text
    let analysisResult;
    try {
      analysisResult = JSON.parse(analysisText);
    } catch {
      analysisResult = {
        summary: analysisText,
        keyTopics: [],
        definitions: [],
        mainPoints: [],
        studyQuestions: [],
        researchAreas: []
      };
    }

    // Update document with analysis results
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ 
        analysis_status: 'completed',
        analysis_result: analysisResult
      })
      .eq('id', documentId);

    if (updateError) {
      console.error('Error updating document:', updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        analysis: analysisResult 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in document-analyzer function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});