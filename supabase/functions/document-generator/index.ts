import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const documentTemplates = {
  complaint: {
    en: `Generate a formal complaint letter in English for an Indian citizen. The letter should:
- Be addressed to the appropriate authority
- Include sender's details
- Clearly state the grievance
- Reference relevant Indian laws/rights if applicable
- Request specific action
- Be professional and assertive`,
    hi: `एक औपचारिक शिकायत पत्र हिंदी में लिखें। पत्र में:
- उचित अधिकारी को संबोधित हो
- भेजने वाले का विवरण शामिल हो
- शिकायत स्पष्ट रूप से बताई जाए
- संबंधित भारतीय कानून/अधिकारों का संदर्भ हो
- विशिष्ट कार्रवाई की मांग हो`,
    mr: `एक औपचारिक तक्रार पत्र मराठी मध्ये लिहा. पत्रात:
- योग्य अधिकाऱ्याला संबोधित असावे
- पाठवणाऱ्याचा तपशील समाविष्ट असावा
- तक्रार स्पष्टपणे नमूद असावी
- संबंधित भारतीय कायदे/हक्कांचा संदर्भ असावा
- विशिष्ट कारवाईची मागणी असावी`,
  },
  rti: {
    en: `Generate an RTI (Right to Information) application in English. The application should:
- Be addressed to the Public Information Officer
- Include applicant's details
- Clearly state the information being sought
- Reference RTI Act, 2005
- Include the fee details (₹10)
- Be in the proper RTI format`,
    hi: `एक RTI (सूचना का अधिकार) आवेदन हिंदी में लिखें। आवेदन में:
- जन सूचना अधिकारी को संबोधित हो
- आवेदक का विवरण शामिल हो
- मांगी गई जानकारी स्पष्ट हो
- RTI अधिनियम, 2005 का संदर्भ हो
- शुल्क विवरण (₹10) शामिल हो`,
    mr: `एक RTI (माहितीचा अधिकार) अर्ज मराठी मध्ये लिहा. अर्जात:
- जन माहिती अधिकाऱ्याला संबोधित असावे
- अर्जदाराचा तपशील समाविष्ट असावा
- मागितलेली माहिती स्पष्ट असावी
- RTI कायदा, 2005 चा संदर्भ असावा
- शुल्क तपशील (₹10) समाविष्ट असावा`,
  },
  notice: {
    en: `Generate a legal notice in English. The notice should:
- Be formal and professional
- Clearly identify the sender and recipient
- State the legal basis for the notice
- Describe the grievance in detail
- Demand specific remedy/action
- Set a time limit for response (typically 15-30 days)
- Warn of legal consequences if not complied`,
    hi: `एक कानूनी नोटिस हिंदी में लिखें। नोटिस में:
- औपचारिक और पेशेवर हो
- भेजने वाले और प्राप्तकर्ता की पहचान स्पष्ट हो
- कानूनी आधार बताया जाए
- शिकायत का विस्तार से वर्णन हो
- विशिष्ट उपाय/कार्रवाई की मांग हो
- जवाब के लिए समय सीमा (आमतौर पर 15-30 दिन) हो`,
    mr: `एक कायदेशीर नोटीस मराठी मध्ये लिहा. नोटीसमध्ये:
- औपचारिक आणि व्यावसायिक असावे
- पाठवणारा आणि प्राप्तकर्ता स्पष्टपणे ओळखता यावा
- कायदेशीर आधार नमूद असावा
- तक्रारीचे तपशीलवार वर्णन असावे
- विशिष्ट उपाय/कारवाईची मागणी असावी
- प्रतिसादासाठी कालमर्यादा (सामान्यतः 15-30 दिवस) असावी`,
  },
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentType, language, formData, situationTitle, situationDescription, rights } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const template = documentTemplates[documentType as keyof typeof documentTemplates];
    const templatePrompt = template[language as keyof typeof template] || template.en;

    const userDetails = `
Sender Details:
- Name: ${formData.fullName || 'Not provided'}
- Address: ${formData.address || 'Not provided'}
- Phone: ${formData.phone || 'Not provided'}
- Email: ${formData.email || 'Not provided'}

Incident Details:
- Date: ${formData.incidentDate || 'Not provided'}
- Location: ${formData.incidentLocation || 'Not provided'}
- Description: ${formData.incidentDescription || 'Not provided'}

Accused/Respondent:
- Name: ${formData.accusedName || 'Not provided'}
- Designation: ${formData.accusedDesignation || 'Not provided'}

Witnesses: ${formData.witnessDetails || 'None mentioned'}

Situation Context: ${situationTitle || 'General complaint'}
${situationDescription ? `Details: ${situationDescription}` : ''}
${rights?.length ? `Relevant Rights:\n${rights.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}` : ''}
`;

    const systemPrompt = `You are an expert legal document writer in India. Generate professional, legally sound documents that protect citizens' rights. 
Always use proper formatting with clear sections. Include relevant Indian laws and acts when applicable.
Write the entire document in the language specified (English/Hindi/Marathi).
Today's date: ${new Date().toLocaleDateString('en-IN')}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `${templatePrompt}\n\n${userDetails}` },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'API credits exhausted. Please contact support.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error('Failed to generate document');
    }

    const data = await response.json();
    const document = data.choices?.[0]?.message?.content || '';

    return new Response(
      JSON.stringify({ document }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Document generator error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to generate document' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
