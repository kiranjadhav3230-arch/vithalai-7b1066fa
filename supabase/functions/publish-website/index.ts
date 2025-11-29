import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized - Missing auth header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Extract JWT token from Bearer header
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(JSON.stringify({ error: 'Unauthorized - Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { 
      title, 
      subdomain, 
      customDomain, 
      htmlContent, 
      cssContent, 
      jsContent, 
      language,
      codeSnippetId 
    } = await req.json();

    if (!title || !subdomain || !htmlContent) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, subdomain, htmlContent' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate subdomain format (alphanumeric and hyphens only)
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      return new Response(
        JSON.stringify({ error: 'Subdomain can only contain lowercase letters, numbers, and hyphens' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if subdomain already exists
    const { data: existing } = await supabase
      .from('published_websites')
      .select('id')
      .eq('subdomain', subdomain)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Subdomain already taken' }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert the published website
    const { data, error } = await supabase
      .from('published_websites')
      .insert({
        user_id: user.id,
        code_snippet_id: codeSnippetId || null,
        title,
        subdomain,
        custom_domain: customDomain || null,
        html_content: htmlContent,
        css_content: cssContent || null,
        js_content: jsContent || null,
        language: language || 'html',
        is_published: true,
        view_count: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error publishing website:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to publish website' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const publishedUrl = `https://${subdomain}.vithal-web.app`;
    
    return new Response(
      JSON.stringify({
        success: true,
        website: data,
        url: publishedUrl,
        message: 'Website published successfully!',
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in publish-website function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
