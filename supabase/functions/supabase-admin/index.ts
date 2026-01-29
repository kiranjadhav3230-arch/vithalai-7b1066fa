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
      sql,
      dryRun = false 
    } = body;

    console.log('Supabase Admin request:', { 
      operation, 
      urlProvided: !!userSupabaseUrl,
      keyProvided: !!userServiceKey,
      sqlLength: sql?.length,
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

      try {
        // Split SQL into statements and execute each
        const statements = sql
          .split(';')
          .map((s: string) => s.trim())
          .filter((s: string) => s.length > 0 && !s.startsWith('--'));

        const results: { statement: string; success: boolean; error?: string }[] = [];
        let tablesCreated: string[] = [];
        let policiesApplied = 0;

        for (const statement of statements) {
          console.log('Executing statement:', statement.substring(0, 100));
          
          // Try to execute via Supabase REST API with service role
          try {
            // Use the pg endpoint for raw SQL execution
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
              // Track what was created
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
              // If exec_sql function doesn't exist, try alternative approach
              if (execResponse.status === 404 || errorText.includes('function') && errorText.includes('not found')) {
                // Function doesn't exist - fall back to returning SQL for manual execution
                results.push({
                  statement: statement.substring(0, 80) + '...',
                  success: false,
                  error: 'exec_sql function not found on target database'
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
              policiesApplied
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
              policiesApplied
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        } else {
          // No statements succeeded - check if exec_sql function exists
          const needsSetup = results.some(r => r.error?.includes('exec_sql'));
          
          return new Response(
            JSON.stringify({ 
              success: false,
              executed: false,
              message: needsSetup 
                ? 'Database needs exec_sql function. Run the setup SQL first.'
                : 'SQL execution failed',
              statements: results,
              sql: sql,
              setupRequired: needsSetup,
              setupSql: needsSetup ? `-- Run this in Supabase SQL Editor first:
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
  RETURN json_build_object('success', true);
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION exec_sql(text) TO authenticated;
GRANT EXECUTE ON FUNCTION exec_sql(text) TO service_role;` : undefined
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
