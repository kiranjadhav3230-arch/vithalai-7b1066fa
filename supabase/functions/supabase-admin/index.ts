import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Dangerous SQL patterns that should be blocked
const DANGEROUS_PATTERNS = [
  /DROP\s+DATABASE/i,
  /DROP\s+SCHEMA\s+(IF\s+EXISTS\s+)?(public|auth|storage|realtime)/i,
  /TRUNCATE\s+(pg_|auth\.|storage\.)/i,
  /DELETE\s+FROM\s+(pg_|auth\.|storage\.)/i,
  /ALTER\s+ROLE/i,
  /CREATE\s+ROLE/i,
  /DROP\s+ROLE/i,
  /GRANT\s+.*\s+TO\s+postgres/i,
  /ALTER\s+DATABASE/i,
];

// Allowed SQL operations for app generation
const ALLOWED_OPERATIONS = [
  'CREATE TABLE',
  'ALTER TABLE',
  'CREATE INDEX',
  'CREATE POLICY',
  'ALTER TABLE.*ENABLE ROW LEVEL SECURITY',
  'CREATE OR REPLACE FUNCTION',
  'CREATE TRIGGER',
  'INSERT INTO',
  'CREATE TYPE',
  'CREATE EXTENSION',
];

function validateSQL(sql: string): { valid: boolean; error?: string } {
  // Check for dangerous patterns
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(sql)) {
      return { 
        valid: false, 
        error: `Dangerous SQL operation detected: ${pattern.toString()}` 
      };
    }
  }

  // Check if SQL contains at least one allowed operation
  const hasAllowedOp = ALLOWED_OPERATIONS.some(op => 
    new RegExp(op, 'i').test(sql)
  );

  if (!hasAllowedOp) {
    // Allow empty or comment-only SQL
    const trimmed = sql.trim();
    if (trimmed === '' || trimmed.startsWith('--')) {
      return { valid: true };
    }
    
    // Check for SELECT (read-only, generally safe)
    if (/^\s*SELECT/i.test(trimmed)) {
      return { valid: true };
    }
    
    return { 
      valid: false, 
      error: 'SQL must contain allowed operations (CREATE TABLE, CREATE POLICY, etc.)' 
    };
  }

  return { valid: true };
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { 
      operation, 
      userSupabaseUrl, 
      userServiceKey,
      accessToken, // NEW: Personal Access Token for Management API
      sql,
      functionName,
      functionCode,
      verifyJwt = true,
      dryRun = false 
    } = body;

    console.log('Supabase Admin request:', { 
      operation, 
      urlProvided: !!userSupabaseUrl,
      keyProvided: !!userServiceKey,
      accessTokenProvided: !!accessToken,
      sqlLength: sql?.length,
      functionName,
      dryRun
    });

    // Validate required inputs
    if (!userSupabaseUrl || !userServiceKey) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing Supabase credentials (URL and Service Key required)' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validate URL format
    if (!userSupabaseUrl.includes('supabase.co') && !userSupabaseUrl.includes('supabase.in')) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Invalid Supabase URL format' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Handle different operations
    if (operation === 'test_connection') {
      // Test connection by querying a simple endpoint
      const testResponse = await fetch(`${userSupabaseUrl}/rest/v1/`, {
        method: 'GET',
        headers: {
          'apikey': userServiceKey,
          'Authorization': `Bearer ${userServiceKey}`,
        },
      });

      if (testResponse.ok) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Connection successful' 
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      } else {
        const errorText = await testResponse.text();
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Connection failed: ${testResponse.status} - ${errorText}` 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    if (operation === 'execute_sql') {
      if (!sql) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'No SQL provided' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Validate SQL for safety
      const validation = validateSQL(sql);
      if (!validation.valid) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: validation.error,
            blocked: true
          }),
          { 
            status: 403, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // If dry run, just return validation result
      if (dryRun) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'SQL validated successfully (dry run)',
            sql: sql.substring(0, 500) + (sql.length > 500 ? '...' : '')
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      // Execute SQL using Supabase Management API
      // Extract project ref from URL
      const projectRef = userSupabaseUrl.match(/https:\/\/([^.]+)\.supabase/)?.[1];
      
      if (!projectRef) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Could not extract project reference from Supabase URL' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Executing SQL on project:', projectRef);
      console.log('SQL to execute:', sql.substring(0, 500));
      console.log('Access token provided:', !!accessToken);

      try {
        // Split SQL into statements
        const statements = sql
          .split(';')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0 && !s.startsWith('--'));

        const results: { statement: string; success: boolean; error?: string }[] = [];
        let tablesCreated: string[] = [];
        let policiesApplied = 0;

        // If access token is provided, use Supabase Management API
        if (accessToken) {
          console.log('Using Management API for SQL execution');
          
          // Execute SQL via Management API
          const execUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
          
          const execResponse = await fetch(execUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: sql })
          });

          if (execResponse.ok) {
            // Parse response for created tables and policies
            const createTableMatches = sql.matchAll(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)/gi);
            tablesCreated = [...createTableMatches].map(m => m[1]);
            
            const policyMatches = sql.matchAll(/CREATE\s+POLICY/gi);
            policiesApplied = [...policyMatches].length;

            return new Response(
              JSON.stringify({ 
                success: true,
                executed: true,
                message: 'SQL executed via Management API',
                tablesCreated,
                policiesApplied,
                method: 'management_api'
              }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          } else {
            const errorText = await execResponse.text();
            console.error('Management API error:', execResponse.status, errorText);
            
            // If Management API fails, try to give helpful error
            return new Response(
              JSON.stringify({ 
                success: false,
                executed: false,
                error: `Management API error: ${errorText}`,
                sql: sql,
                fallbackAvailable: true,
                fallbackInstructions: 'Copy the SQL and run it manually in Supabase SQL Editor'
              }),
              { 
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            );
          }
        }

        // Fallback: Try exec_sql RPC (requires user to set up function)
        console.log('Using exec_sql RPC fallback');
        
        for (const statement of statements) {
          console.log('Executing statement:', statement.substring(0, 100));
          
          try {
            const execResponse = await fetch(`${userSupabaseUrl}/rest/v1/rpc/exec_sql`, {
              method: 'POST',
              headers: {
                'apikey': userServiceKey,
                'Authorization': `Bearer ${userServiceKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
              },
              body: JSON.stringify({ query: statement })
            });

            if (execResponse.ok) {
              const createTableMatch = statement.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)/i);
              if (createTableMatch) {
                tablesCreated.push(createTableMatch[1]);
              }
              
              const createPolicyMatch = statement.match(/CREATE\s+POLICY/i);
              if (createPolicyMatch) {
                policiesApplied++;
              }

              results.push({
                statement: statement.substring(0, 80) + '...',
                success: true
              });
            } else {
              const errorText = await execResponse.text();
              if (execResponse.status === 404 || errorText.includes('function') && errorText.includes('not found')) {
                results.push({
                  statement: statement.substring(0, 80) + '...',
                  success: false,
                  error: 'exec_sql function not found - add Personal Access Token for auto-deploy'
                });
              } else {
                results.push({
                  statement: statement.substring(0, 80) + '...',
                  success: false,
                  error: errorText
                });
              }
            }
          } catch (stmtError) {
            results.push({
              statement: statement.substring(0, 80) + '...',
              success: false,
              error: stmtError instanceof Error ? stmtError.message : 'Unknown error'
            });
          }
        }

        const allSucceeded = results.every(r => r.success);
        const anySucceeded = results.some(r => r.success);

        if (allSucceeded) {
          return new Response(
            JSON.stringify({ 
              success: true,
              executed: true,
              message: 'SQL executed successfully',
              statements: results,
              tablesCreated,
              policiesApplied,
              method: 'exec_sql_rpc'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else if (anySucceeded) {
          return new Response(
            JSON.stringify({ 
              success: true,
              executed: true,
              partial: true,
              message: 'Some SQL statements executed successfully',
              statements: results,
              tablesCreated,
              policiesApplied,
              method: 'exec_sql_rpc'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else {
          const needsSetup = results.some(r => r.error?.includes('exec_sql') || r.error?.includes('Access Token'));
          
          return new Response(
            JSON.stringify({ 
              success: false,
              executed: false,
              message: needsSetup 
                ? 'Add a Personal Access Token in Supabase settings for automatic deployment, or copy the SQL below.'
                : 'SQL execution failed',
              statements: results,
              sql: sql,
              setupRequired: needsSetup,
              setupInstructions: needsSetup ? {
                option1: 'Add Personal Access Token in Supabase connection settings for automatic deployment',
                option1Link: 'https://supabase.com/dashboard/account/tokens',
                option2: 'Copy the SQL below and run it manually in Supabase SQL Editor',
                option2Link: `${userSupabaseUrl.replace('.co', '.com').replace('https://', 'https://supabase.com/dashboard/project/')}/sql/new`
              } : undefined
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }

      } catch (execError) {
        console.error('SQL execution error:', execError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            executed: false,
            error: `SQL execution failed: ${execError instanceof Error ? execError.message : 'Unknown error'}`,
            sql: sql
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    // NEW: Deploy Edge Function via Management API
    if (operation === 'deploy_edge_function') {
      if (!accessToken) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Personal Access Token required for edge function deployment. Add it in Supabase connection settings.',
            setupLink: 'https://supabase.com/dashboard/account/tokens'
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      if (!functionName || !functionCode) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Function name and code are required' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const projectRef = userSupabaseUrl.match(/https:\/\/([^.]+)\.supabase/)?.[1];
      if (!projectRef) {
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Could not extract project reference from Supabase URL' 
          }),
          { 
            status: 400, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log('Deploying edge function:', functionName, 'to project:', projectRef);

      try {
        const deployUrl = `https://api.supabase.com/v1/projects/${projectRef}/functions`;
        
        const deployResponse = await fetch(deployUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            slug: functionName,
            name: functionName,
            body: functionCode,
            verify_jwt: verifyJwt
          })
        });

        if (deployResponse.ok) {
          const deployData = await deployResponse.json();
          return new Response(
            JSON.stringify({ 
              success: true,
              deployed: true,
              message: `Edge function '${functionName}' deployed successfully`,
              functionUrl: `${userSupabaseUrl}/functions/v1/${functionName}`,
              data: deployData
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else {
          const errorText = await deployResponse.text();
          console.error('Edge function deployment error:', deployResponse.status, errorText);
          
          return new Response(
            JSON.stringify({ 
              success: false,
              deployed: false,
              error: `Deployment failed: ${errorText}`,
              functionName,
              fallbackInstructions: 'Use Supabase CLI to deploy: supabase functions deploy ' + functionName
            }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      } catch (deployError) {
        console.error('Edge function deployment error:', deployError);
        return new Response(
          JSON.stringify({ 
            success: false, 
            deployed: false,
            error: `Deployment failed: ${deployError instanceof Error ? deployError.message : 'Unknown error'}`,
            functionName
          }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }

    if (operation === 'list_tables') {
      // Query to list tables in the public schema
      const tablesQuery = `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
      `;

      // This would require a custom RPC function on the user's Supabase
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Table listing requires SQL execution capability',
          note: 'Run this query in SQL Editor: ' + tablesQuery
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Unknown operation
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Unknown operation: ${operation}` 
      }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Supabase Admin error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
