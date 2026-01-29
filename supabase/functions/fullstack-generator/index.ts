import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Template-specific prompts
const templatePrompts: Record<string, string> = {
  'contact-form': 'contact form application with name, email, phone, message fields, form validation, and submission storage',
  'blog-cms': 'blog CMS with post creation, editing, categories, tags, and markdown support',
  'todo-app': 'todo application with task lists, priorities, due dates, and completion tracking',
  'user-dashboard': 'user dashboard with profile management, settings, activity logs, and preferences',
  'ecommerce': 'e-commerce platform with product catalog, shopping cart, and order management',
  'booking-system': 'appointment booking system with calendar view, time slots, and confirmation emails',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const { 
      prompt,
      existingCode,     // Pass existing files for editing
      chatHistory = [], // Maintain conversation
      appTemplate,
      websiteStyle = 'modern',
      includeAuth = false,
      supabaseConnected = false,
      isEdit = false    // Flag: edit mode vs generate mode
    } = await req.json();

    console.log('Fullstack Generator Request:', { 
      appTemplate, 
      isEdit, 
      hasExistingCode: !!existingCode,
      chatHistoryLength: chatHistory.length,
      promptLength: prompt?.length 
    });

    let systemPrompt: string;
    
    if (isEdit && existingCode && existingCode.length > 0) {
      // EDIT MODE - Modify existing code based on user request
      const existingCodeStr = existingCode.map((f: { name: string; content: string }) => 
        `=== FILE: ${f.name} ===\n${f.content}`
      ).join('\n\n');
      
      systemPrompt = `You are an expert full-stack developer EDITING an existing application.

CURRENT APPLICATION CODE:
${existingCodeStr}

CRITICAL INSTRUCTIONS:
- Make ONLY the changes requested by the user
- Preserve ALL existing functionality unless specifically asked to change
- Keep the same file structure and naming
- Output the COMPLETE updated files (not just the changed parts)
- Use the EXACT same === FILE: filename === format for each file
- If user asks to change colors, update ONLY the color values
- If user asks to change text, update ONLY the text content
- Maintain all existing features and code quality

OUTPUT FORMAT (use exactly this format):
=== FILE: frontend/index.html ===
[Complete updated HTML]

=== FILE: frontend/styles.css ===
[Complete updated CSS]

=== FILE: frontend/script.js ===
[Complete updated JavaScript]

=== FILE: database/schema.sql ===
[Complete SQL - if changes needed]

=== FILE: database/rls.sql ===
[Complete RLS policies - if changes needed]

=== FILE: README.md ===
[Complete README]`;
    } else {
      // GENERATE MODE - Create new app
      const templateDesc = templatePrompts[appTemplate] || 'full-stack web application';
      
      systemPrompt = `You are an expert full-stack developer creating production-ready applications.

TASK: Create a ${templateDesc} with ${websiteStyle} styling.

TECHNICAL REQUIREMENTS:
- Use Supabase JavaScript SDK v2 (supabase-js)
- Include proper error handling and loading states
- Add form validation with user feedback
- Make everything responsive (mobile-first design)
- Use CSS custom properties for theming
- Include semantic HTML5 with accessibility attributes
${includeAuth ? '- Include user authentication (signup, login, logout)' : ''}
${supabaseConnected ? '- The app will connect to user\'s Supabase instance' : ''}

STYLE: ${websiteStyle}
- modern: Clean lines, subtle shadows, gradients, rounded corners
- minimal: Simple, lots of whitespace, monochromatic
- glassmorphism: Blur effects, transparency, soft backgrounds
- dark: Dark theme with accent colors
- gradient: Bold gradient backgrounds and elements

OUTPUT FORMAT (use exactly this format for each file):
=== FILE: frontend/index.html ===
[Complete HTML with proper head, meta tags, Supabase SDK CDN link]

=== FILE: frontend/styles.css ===
[Complete CSS with variables, animations, responsive design]

=== FILE: frontend/script.js ===
[Complete JavaScript with Supabase initialization, CRUD operations, error handling, loading states]

=== FILE: database/schema.sql ===
[Complete CREATE TABLE statements with proper types, constraints]

=== FILE: database/rls.sql ===
[Complete RLS policies for security]

=== FILE: README.md ===
[Complete deployment guide]

QUALITY STANDARDS:
- NO placeholders like "your-project-url" in the code - use proper initialization patterns
- Include toast/notification system for user feedback
- Add loading spinners during async operations
- Use try/catch blocks with user-friendly error messages
- Include proper form validation before submission
- Make buttons disabled during loading states`;
    }

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    // Add chat history for context (only for edit mode)
    if (chatHistory && chatHistory.length > 0) {
      for (const msg of chatHistory.slice(-6)) { // Keep last 6 messages for context
        messages.push({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      }
    }

    // Add current user prompt
    messages.push({ role: 'user', content: prompt });

    console.log('Calling Lovable AI Gateway with', messages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: 'Rate limit exceeded. Please wait a moment and try again.' 
        }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: 'API credits exhausted. Please add credits to continue.' 
        }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const generatedCode = data.choices?.[0]?.message?.content;

    if (!generatedCode) {
      throw new Error('No code generated from AI');
    }

    console.log('Generated code length:', generatedCode.length);

    return new Response(JSON.stringify({ 
      code: generatedCode,
      isEdit 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Fullstack Generator Error:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
