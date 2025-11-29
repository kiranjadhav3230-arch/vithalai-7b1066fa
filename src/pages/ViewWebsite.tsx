import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

export default function ViewWebsite() {
  const { subdomain } = useParams<{ subdomain: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [websiteData, setWebsiteData] = useState<{
    html_content: string;
    css_content: string | null;
    js_content: string | null;
    title: string;
  } | null>(null);

  useEffect(() => {
    const fetchWebsite = async () => {
      if (!subdomain) {
        setError('No subdomain provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch the published website
        const { data, error: fetchError } = await supabase
          .from('published_websites')
          .select('html_content, css_content, js_content, title, id, view_count')
          .eq('subdomain', subdomain)
          .eq('is_published', true)
          .maybeSingle();

        if (fetchError) {
          console.error('Error fetching website:', fetchError);
          setError('Failed to load website');
          setLoading(false);
          return;
        }

        if (!data) {
          setError('Website not found');
          setLoading(false);
          return;
        }

        setWebsiteData(data);

        // Increment view count
        await supabase
          .from('published_websites')
          .update({ view_count: (data.view_count || 0) + 1 })
          .eq('id', data.id);

        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError('An unexpected error occurred');
        setLoading(false);
      }
    };

    fetchWebsite();
  }, [subdomain]);

  useEffect(() => {
    if (websiteData) {
      // Update page title
      document.title = websiteData.title;

      // Construct complete HTML document
      let fullHtml = websiteData.html_content;

      // If HTML doesn't include DOCTYPE, wrap it properly
      if (!fullHtml.toLowerCase().includes('<!doctype')) {
        const cssTag = websiteData.css_content 
          ? `<style>${websiteData.css_content}</style>` 
          : '';
        const jsTag = websiteData.js_content 
          ? `<script>${websiteData.js_content}</script>` 
          : '';

        fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${websiteData.title}</title>
  ${cssTag}
</head>
<body>
  ${websiteData.html_content}
  ${jsTag}
</body>
</html>`;
      } else {
        // If it's already complete HTML, inject CSS and JS if they're separate
        if (websiteData.css_content && !fullHtml.includes(websiteData.css_content)) {
          fullHtml = fullHtml.replace('</head>', `<style>${websiteData.css_content}</style></head>`);
        }
        if (websiteData.js_content && !fullHtml.includes(websiteData.js_content)) {
          fullHtml = fullHtml.replace('</body>', `<script>${websiteData.js_content}</script></body>`);
        }
      }

      // Replace entire document with the published website
      document.open();
      document.write(fullHtml);
      document.close();
    }
  }, [websiteData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading website...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">🌐</div>
          <h1 className="text-2xl font-bold mb-2">Website Not Found</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <a 
            href="/" 
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            Go to Vithal AI
          </a>
        </div>
      </div>
    );
  }

  // Content is rendered via document.write in useEffect
  return null;
}
