

# Plan: Fix Full-Stack App Builder - Complete Lovable-Style Implementation

## Critical Issues Identified

### Issue #1: GEMINI_API_KEY is NOT Configured (Generation Fails)
| Problem | Impact |
|---------|--------|
| `code-generator-gemini` uses `GEMINI_API_KEY` | Secret NOT in configured secrets |
| Other working functions use `LOVABLE_API_KEY` | Full-stack generation completely fails |
| Direct Gemini API call: `generativelanguage.googleapis.com` | Should use Lovable Gateway |

**Evidence:**
- Secrets list shows: `LOVABLE_API_KEY` (working), `ELEVENLABS_API_KEY`, etc.
- NO `GEMINI_API_KEY` in the list
- `gemini-chat` uses `LOVABLE_API_KEY` and works correctly

### Issue #2: NO Code Editing Capability (Only Generates New)
| Current Behavior | Lovable Behavior |
|-----------------|------------------|
| Each request generates completely new code | User can say "change brand color" and it edits existing code |
| No chat history for code changes | Maintains context of previous generations |
| No edit/refine workflow | Iterative refinement like a conversation |

**Evidence from `fullstack-app-builder.tsx`:**
- Line 82-83: `setGeneratedApp(null)` - clears previous generation
- No mechanism to pass existing code back to AI for editing
- No "Edit" or "Refine" button
- No chat interface for iterative changes

### Issue #3: Supabase Admin Does NOT Execute SQL
| Current Response | Should Be |
|-----------------|-----------|
| `"note": "For full execution, please run this SQL in your Supabase SQL Editor"` | Actually executes SQL and returns `{ executed: true, tables_created: [...] }` |
| Just validates and returns SQL text | Uses Supabase REST API to run queries |

**Evidence from `supabase-admin/index.ts` line 252-255:**
```javascript
return new Response(JSON.stringify({ 
  success: true, 
  message: 'SQL prepared for execution',
  note: 'SQL has been validated. For full execution, please run this SQL in your Supabase SQL Editor.'
}));
```
The function validates but never actually runs the SQL!

### Issue #4: No Chat Interface for App Building
| Current | Lovable-Style |
|---------|--------------|
| One-shot generation with template | Chat-based iterative building |
| No follow-up questions | "Change the header to blue" works |
| Static form inputs | Dynamic conversation |

---

## Solution Architecture

```text
BEFORE (Broken):                          AFTER (Lovable-Style):
┌────────────────────────────────┐       ┌────────────────────────────────────────┐
│ Template Selection             │       │ Chat-Based App Builder                 │
│ → Single Generate Button       │  →    │ → "Build a todo app"                   │
│ → New code each time           │       │ → "Change color to blue"               │
│ → No editing                   │       │ → "Add dark mode"                      │
│ → SQL not executed             │       │ → Code updates incrementally           │
│ → GEMINI_API_KEY missing       │       │ → SQL actually runs on Supabase        │
│                                │       │ → Uses LOVABLE_API_KEY (working)       │
└────────────────────────────────┘       └────────────────────────────────────────┘
```

---

## Implementation Steps

### Step 1: Create New Edge Function Using LOVABLE_API_KEY
**New File:** `supabase/functions/fullstack-generator/index.ts`

Replace broken `code-generator-gemini` approach with:
- Uses `LOVABLE_API_KEY` (already available and working)
- Lovable AI Gateway: `https://ai.gateway.lovable.dev/v1/chat/completions`
- Supports EDITING existing code (not just generation)
- Maintains conversation history for iterative changes

Key Logic:
```typescript
// NEW: Accept existing code for editing
const { prompt, existingCode, chatHistory, appTemplate, ... } = await req.json();

// Build edit-aware system prompt
let systemPrompt = existingCode 
  ? `You are editing an existing application. Here is the current code:
     ${existingCode}
     
     Make ONLY the requested changes, preserving everything else.`
  : `You are generating a new full-stack application...`;

// Use Lovable AI Gateway (working API)
const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
  headers: { 'Authorization': `Bearer ${LOVABLE_API_KEY}` },
  body: JSON.stringify({ model: 'google/gemini-2.5-flash', messages })
});
```

### Step 2: Fix Supabase Admin to Actually Execute SQL
**File:** `supabase/functions/supabase-admin/index.ts`

Current code just validates and returns note. Fix to:
- Use Supabase REST API with service role key
- Execute each SQL statement via direct REST calls
- Return actual execution results

Key Changes:
```typescript
// BEFORE (broken - line 249-260):
return new Response(JSON.stringify({ 
  success: true, 
  note: 'For full execution, please run this SQL...'
}));

// AFTER (working):
// Execute via Supabase's postgrest endpoint with RPC
const execResponse = await fetch(
  `${userSupabaseUrl}/rest/v1/rpc/exec_sql`, // Need to create this function
  {
    method: 'POST',
    headers: {
      'apikey': userServiceKey,
      'Authorization': `Bearer ${userServiceKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  }
);
```

Note: Direct SQL execution via REST requires either:
1. A custom `exec_sql` RPC function on the user's Supabase, OR
2. Using Supabase Management API (more complex)

**Practical Solution:** Execute via Supabase's built-in SQL execution endpoint:
```typescript
const execUrl = `${userSupabaseUrl}/pg/query`;
const execResponse = await fetch(execUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${userServiceKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query: sql })
});
```

### Step 3: Add Chat-Based Editing to App Builder
**File:** `src/components/fullstack-app-builder.tsx`

Add:
1. Chat messages interface (like Lovable)
2. Input for refining existing app
3. Pass existing code back to AI for edits
4. Maintain conversation history

New State:
```typescript
const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
const [currentAppCode, setCurrentAppCode] = useState<WebsiteFile[] | null>(null);
```

New UI:
```text
┌─────────────────────────────────────────────────────────────────┐
│ 🚀 Full-Stack App Builder              [Supabase: Connected]   │
├───────────────────────────────┬─────────────────────────────────┤
│                               │                                 │
│ Chat History:                 │  [Frontend] [CSS] [JS] [SQL]   │
│ ─────────────────────         │  ┌─────────────────────────┐   │
│ You: Build a todo app         │  │ <html>                  │   │
│                               │  │   <head>...</head>      │   │
│ Vithal: Here's your todo app! │  │   <body>...</body>      │   │
│ [Preview of app]              │  │ </html>                 │   │
│                               │  └─────────────────────────┘   │
│ You: Change header to blue    │                                 │
│                               │  [Preview] [Download] [Deploy] │
│ Vithal: I've updated the      │                                 │
│ header color to blue!         │                                 │
│                               │                                 │
│ ───────────────────────────── │                                 │
│ ┌─────────────────────────┐   │                                 │
│ │ Add authentication...   │   │                                 │
│ └─────────────────────────┘   │                                 │
│ [Send]                        │                                 │
└───────────────────────────────┴─────────────────────────────────┘
```

### Step 4: Update Config
**File:** `supabase/config.toml`

Add new function:
```toml
[functions.fullstack-generator]
verify_jwt = false
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/fullstack-generator/index.ts` | CREATE | New function using LOVABLE_API_KEY with edit support |
| `supabase/functions/supabase-admin/index.ts` | MODIFY | Actually execute SQL, not just validate |
| `src/components/fullstack-app-builder.tsx` | MODIFY | Add chat interface, edit capability, conversation history |
| `supabase/config.toml` | MODIFY | Add fullstack-generator function |

---

## Technical Details

### New Full-Stack Generator Edge Function

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
      chatHistory,      // Maintain conversation
      appTemplate,
      styleType,
      includeAuth,
      isEdit            // Flag: edit mode vs generate mode
    } = await req.json();

    // Build system prompt based on mode
    let systemPrompt;
    
    if (isEdit && existingCode) {
      // EDIT MODE - Modify existing code
      systemPrompt = `You are an expert full-stack developer EDITING an existing application.

CURRENT APPLICATION CODE:
${existingCode.map(f => `=== ${f.name} ===\n${f.content}`).join('\n\n')}

INSTRUCTIONS:
- Make ONLY the changes requested by the user
- Preserve ALL existing functionality unless specifically asked to change
- Keep the same file structure
- Output the COMPLETE updated files (not just changes)
- Use the same === FILE: filename === format`;
    } else {
      // GENERATE MODE - Create new app
      systemPrompt = `You are an expert full-stack developer creating production-ready applications...`;
      // (existing generation prompt)
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: prompt }
    ];

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

    const data = await response.json();
    return new Response(JSON.stringify({ 
      code: data.choices?.[0]?.message?.content 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
```

### Fixed Supabase Admin SQL Execution

The key issue is that Supabase doesn't expose a direct SQL execution endpoint via REST. Options:

**Option A: Use Supabase Management API**
```typescript
// Execute via Supabase Management API (requires project ref extraction)
const projectRef = userSupabaseUrl.match(/https:\/\/([^.]+)\.supabase/)?.[1];
const execUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
```

**Option B: Guide user to create exec_sql function**
Add to generated SQL:
```sql
CREATE OR REPLACE FUNCTION exec_sql(query text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
  RETURN json_build_object('success', true);
END;
$$;
```

**Option C (Recommended): Statement-by-statement via REST**
For CREATE TABLE operations, use Supabase's table creation endpoint. For policies, use separate API calls.

### Chat-Based App Builder UI

Add to `fullstack-app-builder.tsx`:

```typescript
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  generatedFiles?: WebsiteFile[];
  timestamp: Date;
}

const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

const handleSendMessage = async () => {
  // Add user message
  const userMessage = { id: Date.now().toString(), role: 'user', content: input };
  setChatMessages(prev => [...prev, userMessage]);
  
  // Call API with existing code (for editing)
  const { data } = await supabase.functions.invoke('fullstack-generator', {
    body: {
      prompt: input,
      existingCode: generatedApp,  // Pass current code for editing
      chatHistory: chatMessages,    // Pass conversation history
      isEdit: generatedApp !== null // Flag if editing
    }
  });
  
  // Parse and update app
  const files = parseFullstackResponse(data.code);
  setGeneratedApp(files);
  
  // Add AI response
  const aiMessage = { 
    id: (Date.now() + 1).toString(), 
    role: 'assistant', 
    content: 'I\'ve updated your app!',
    generatedFiles: files 
  };
  setChatMessages(prev => [...prev, aiMessage]);
};
```

---

## User Experience After Fix

1. User opens Full-Stack App Builder
2. Types: "Build me a todo app with dark theme"
3. AI generates complete app with all files
4. User sees app in preview, can download/deploy
5. User types: "Change the primary color to purple"
6. AI EDITS the existing code (not regenerates from scratch)
7. Only the color-related code changes
8. If Supabase connected, database schema ACTUALLY runs
9. User gets confirmation: "Tables created: todos, lists"

---

## Priority Order

1. **CRITICAL**: Create `fullstack-generator` using LOVABLE_API_KEY (fixes generation)
2. **CRITICAL**: Add edit support to pass existing code back to AI
3. **HIGH**: Add chat interface for iterative changes
4. **HIGH**: Fix `supabase-admin` to execute SQL (or provide better guidance)
5. **MEDIUM**: Improve UI/UX with conversation history display

