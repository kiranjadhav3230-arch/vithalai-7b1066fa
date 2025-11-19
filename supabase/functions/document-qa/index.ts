import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    const { documentId, question } = await req.json();

    if (!documentId || !question) {
      return new Response(
        JSON.stringify({ error: 'Document ID and question are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing Q&A for document: ${documentId}`);

    // Fetch document content
    const { data: document, error: docError } = await supabaseClient
      .from('documents')
      .select('document_text, title')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      throw new Error('Document not found or has no content');
    }

    if (!document.document_text) {
      return new Response(
        JSON.stringify({ error: 'Document content not available. Please re-upload the document.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use Gemini API for Q&A
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    // RAG Pattern: Use document content as context for answering
    const prompt = `You are a helpful assistant answering questions about a document.

Document Title: ${document.title}

Document Content:
${document.document_text}

Question: ${question}

Instructions:
1. Answer the question based ONLY on the document content provided above
2. If the answer includes specific information, mention which part of the document it comes from
3. If the question cannot be answered from the document, clearly state that
4. Be concise but comprehensive
5. If applicable, cite page numbers or sections (if mentioned in the content)

Provide your response in JSON format:
{
  "answer": "Your detailed answer here",
  "references": ["Reference 1", "Reference 2"],
  "confidence": "high/medium/low"
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
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    console.log('Gemini Q&A response received');

    const responseText = geminiData.candidates[0].content.parts[0].text;
    
    // Try to parse as JSON, fallback to simple structure
    let qaResult;
    try {
      // Remove markdown code blocks if present
      const cleanText = responseText.replace(/```json\n?|\n?```/g, '').trim();
      qaResult = JSON.parse(cleanText);
    } catch {
      qaResult = {
        answer: responseText,
        references: [],
        confidence: 'medium'
      };
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        question: question,
        ...qaResult
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in document-qa function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process question' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});