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

    // Analyze document with Gemini
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
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
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
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
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini response:', geminiData);

    const analysisText = geminiData.candidates[0].content.parts[0].text;
    
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

    // Update document with analysis results and store document text
    const { error: updateError } = await supabaseClient
      .from('documents')
      .update({ 
        analysis_status: 'completed',
        analysis_result: analysisResult,
        document_text: documentText
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