import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.2";
import JSZip from "https://esm.sh/jszip@3.10.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface DeployRequest {
  subdomain: string;
  htmlContent: string;
  cssContent: string;
  jsContent: string;
  projectId?: string;
  projectName?: string;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Deploy to Netlify: Starting deployment...");

    // Get Netlify token
    const netlifyToken = Deno.env.get("NETLIFY_ACCESS_TOKEN");
    if (!netlifyToken) {
      console.error("NETLIFY_ACCESS_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "Netlify integration not configured. Please add NETLIFY_ACCESS_TOKEN." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body: DeployRequest = await req.json();
    const { subdomain, htmlContent, cssContent, jsContent, projectId, projectName } = body;

    console.log(`Deploy to Netlify: Subdomain requested: ${subdomain}`);

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!subdomain || !subdomainRegex.test(subdomain)) {
      return new Response(
        JSON.stringify({ error: "Invalid subdomain. Use only lowercase letters, numbers, and hyphens." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (subdomain.length < 3 || subdomain.length > 63) {
      return new Response(
        JSON.stringify({ error: "Subdomain must be between 3 and 63 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create ZIP archive with website files
    console.log("Deploy to Netlify: Creating ZIP archive...");
    const zip = new JSZip();
    
    // Add the main files
    zip.file("index.html", htmlContent);
    if (cssContent) {
      zip.file("styles.css", cssContent);
    }
    if (jsContent) {
      zip.file("script.js", jsContent);
    }

    // Add netlify.toml for configuration
    zip.file("netlify.toml", `[build]
  publish = "."

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
`);

    // Generate ZIP blob
    const zipBlob = await zip.generateAsync({ type: "uint8array" });
    console.log(`Deploy to Netlify: ZIP created, size: ${zipBlob.length} bytes`);

    // Step 1: Try to create a new site with the requested subdomain
    console.log("Deploy to Netlify: Creating site on Netlify...");
    
    let siteId: string;
    let siteUrl: string;

    const createSiteResponse = await fetch("https://api.netlify.com/api/v1/sites", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${netlifyToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: subdomain,
      }),
    });

    if (createSiteResponse.status === 422) {
      // Site name already taken - try to find if it's our site or someone else's
      console.log("Deploy to Netlify: Subdomain taken, checking if we own it...");
      
      // List user's sites to check if we own this subdomain
      const listSitesResponse = await fetch("https://api.netlify.com/api/v1/sites", {
        headers: {
          "Authorization": `Bearer ${netlifyToken}`,
        },
      });

      if (!listSitesResponse.ok) {
        const errorText = await listSitesResponse.text();
        console.error("Failed to list sites:", errorText);
        return new Response(
          JSON.stringify({ error: "Failed to check existing sites." }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const sites = await listSitesResponse.json();
      const existingSite = sites.find((site: any) => site.name === subdomain);

      if (existingSite) {
        // We own this site, use it for redeployment
        console.log(`Deploy to Netlify: Found existing site ${existingSite.id}, will redeploy`);
        siteId = existingSite.id;
        siteUrl = existingSite.ssl_url || existingSite.url;
      } else {
        // Someone else owns this subdomain
        return new Response(
          JSON.stringify({ error: "This subdomain is already taken. Please try another name." }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else if (!createSiteResponse.ok) {
      const errorText = await createSiteResponse.text();
      console.error("Failed to create site:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to create site on Netlify. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      const siteData = await createSiteResponse.json();
      siteId = siteData.id;
      siteUrl = siteData.ssl_url || siteData.url;
      console.log(`Deploy to Netlify: Site created with ID: ${siteId}`);
    }

    // Step 2: Deploy the ZIP to the site
    console.log("Deploy to Netlify: Deploying files...");
    
    const deployResponse = await fetch(`https://api.netlify.com/api/v1/sites/${siteId}/deploys`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${netlifyToken}`,
        "Content-Type": "application/zip",
      },
      body: zipBlob,
    });

    if (!deployResponse.ok) {
      const errorText = await deployResponse.text();
      console.error("Failed to deploy:", errorText);
      return new Response(
        JSON.stringify({ error: "Failed to deploy files to Netlify. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const deployData = await deployResponse.json();
    console.log(`Deploy to Netlify: Deployment successful! URL: ${siteUrl}`);

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        url: `https://${subdomain}.netlify.app`,
        siteId: siteId,
        deployId: deployData.id,
        state: deployData.state,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Deploy to Netlify error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
