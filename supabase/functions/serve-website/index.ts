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
    const url = new URL(req.url);
    const subdomain = url.searchParams.get('subdomain');
    const customDomain = url.searchParams.get('domain');

    if (!subdomain && !customDomain) {
      return new Response(
        JSON.stringify({ error: 'Subdomain or custom domain parameter required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch website by subdomain or custom domain
    let query = supabase
      .from('published_websites')
      .select('*')
      .eq('is_published', true);

    if (subdomain) {
      query = query.eq('subdomain', subdomain);
    } else if (customDomain) {
      query = query.eq('custom_domain', customDomain);
    }

    const { data: website, error } = await query.single();

    if (error || !website) {
      return new Response(
        JSON.stringify({ error: 'Website not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Increment view count
    await supabase
      .from('published_websites')
      .update({ view_count: website.view_count + 1 })
      .eq('id', website.id);

    // Build complete HTML with CSS and JS
    let fullHtml = website.html_content;

    // Inject CSS if provided
    if (website.css_content) {
      fullHtml = fullHtml.replace(
        '</head>',
        `<style>${website.css_content}</style></head>`
      );
    }

    // Inject JS if provided
    if (website.js_content) {
      fullHtml = fullHtml.replace(
        '</body>',
        `<script>${website.js_content}</script></body>`
      );
    }

    // Add meta tags if not present
    if (!fullHtml.includes('<html')) {
      fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${website.title}</title>
  ${website.css_content ? `<style>${website.css_content}</style>` : ''}
</head>
<body>
  ${fullHtml}
  ${website.js_content ? `<script>${website.js_content}</script>` : ''}
</body>
</html>`;
    }

    return new Response(fullHtml, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error serving website:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
