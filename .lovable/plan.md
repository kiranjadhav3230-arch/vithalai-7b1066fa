
# Plan: Fix Full-Stack App Builder Database & Edge Function Deployment

## Problems Identified

### Issue #1: Database Schema Not Deploying to User's Supabase
| Current Behavior | Expected Behavior |
|-----------------|-------------------|
| SQL files generated as text only | SQL should execute on user's Supabase |
| `supabase-admin` tries to call `exec_sql` RPC | RPC doesn't exist on user's project |
| Requires user to manually create `exec_sql` function | Should work automatically |

**Root Cause:** Supabase REST API doesn't expose direct SQL execution. The current approach tries to call `exec_sql` RPC which doesn't exist on the user's project.

### Issue #2: No Edge Function Deployment
| Current | Should Be |
|---------|-----------|
| Generates JS code for edge functions | No way to deploy to user's Supabase |
| Edge functions stay as text | Should deploy via Supabase Management API |

**Root Cause:** Deploying edge functions requires Supabase Management API with a Personal Access Token or Project API key - not just the service role key.

### Issue #3: Architecture Mismatch
The Full-Stack App Builder was designed assuming we could deploy to user's Supabase, but Supabase's API has these limitations:
- **Service Role Key**: Can read/write data, but cannot execute DDL (CREATE TABLE, etc.)
- **Management API**: Required for schema changes and edge function deployment, needs separate API token

---

## Solution Options

### Option A: Supabase Management API Integration (Recommended)
Require users to provide a **Supabase Personal Access Token** in addition to service role key. This enables:
- Direct SQL execution via Management API
- Edge function deployment via Management API
- Full control like Lovable has

### Option B: Setup Script Approach (Fallback)
Keep current architecture but:
- Generate a complete setup script for users
- Provide clear one-click copy instructions
- Show SQL in expandable panel for easy copying

### Option C: Hybrid Approach (Best UX)
- Try Management API if token provided
- Fall back to guided manual setup if not
- Clear status showing what was deployed vs what needs manual action

---

## Implementation Plan (Hybrid Approach)

### Step 1: Add Supabase Personal Access Token Field
**File:** `src/components/supabase-connection-modal.tsx`

Add optional field for Supabase Personal Access Token:
```text
┌─────────────────────────────────────────────────────────────────┐
│ Connect Your Supabase Project                                  │
├─────────────────────────────────────────────────────────────────┤
│ Project URL: [https://xxx.supabase.co]                        │
│ Anon Key: [eyJ...] 👁                                         │
│ Service Role Key: [eyJ...] 👁 ⚠️ SECRET                       │
│                                                                 │
│ ═══ Advanced (Optional) ═══                                    │
│ Personal Access Token: [sbp_xxx...] 👁                        │
│ (Enables automatic schema deployment and edge functions)       │
│ [Link: Get your token from dashboard.supabase.com]            │
└─────────────────────────────────────────────────────────────────┘
```

### Step 2: Update useSupabaseConnection Hook
**File:** `src/hooks/useSupabaseConnection.ts`

Add `accessToken` field to connection interface:
```typescript
interface SupabaseConnection {
  url: string;
  anonKey: string;
  serviceKey: string;
  accessToken?: string;  // NEW: Personal Access Token
  projectRef?: string;   // Extract from URL
  projectName?: string;
  connectedAt: number;
}
```

### Step 3: Fix supabase-admin to Use Management API
**File:** `supabase/functions/supabase-admin/index.ts`

Update to use Supabase Management API for SQL execution when access token is provided:

```typescript
// If access token provided, use Management API
if (accessToken) {
  const execUrl = `https://api.supabase.com/v1/projects/${projectRef}/database/query`;
  const response = await fetch(execUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: sql })
  });
  // Handle response
}
```

### Step 4: Add Edge Function Deployment via Management API
**File:** `supabase/functions/supabase-admin/index.ts`

Add new operation `deploy_edge_function`:

```typescript
if (operation === 'deploy_edge_function') {
  if (!accessToken) {
    return { error: 'Access token required for edge function deployment' };
  }
  
  // Use Management API to create/update edge function
  const response = await fetch(
    `https://api.supabase.com/v1/projects/${projectRef}/functions`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        slug: functionName,
        body: functionCode,
        verify_jwt: verifyJwt
      })
    }
  );
}
```

### Step 5: Update UI for Deployment Status
**File:** `src/components/fullstack-app-builder.tsx`

Show clear deployment status with what was deployed vs what needs manual action:

```text
┌─────────────────────────────────────────────────────────────────┐
│ 🚀 Deployment Status                                           │
├─────────────────────────────────────────────────────────────────┤
│ ✅ Database Schema    - Deployed (3 tables, 6 policies)       │
│ ✅ Edge Functions     - Deployed (api-handler)                 │
│ ────────────────────────────────────────────────────────────── │
│ OR (if no access token):                                       │
│ ⚠️ Database Schema    - Manual Setup Required [Copy SQL]      │
│ ⚠️ Edge Functions     - Cannot deploy without Access Token    │
│ [Get Access Token] for automatic deployment                    │
└─────────────────────────────────────────────────────────────────┘
```

### Step 6: Improve Fallback with Copy-Friendly SQL
**File:** `src/components/fullstack-app-builder.tsx`

When Management API not available, show:
- Expandable SQL panels with copy buttons
- Step-by-step instructions
- Direct link to user's SQL Editor

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/supabase-connection-modal.tsx` | MODIFY | Add Personal Access Token field |
| `src/hooks/useSupabaseConnection.ts` | MODIFY | Store access token, extract project ref |
| `supabase/functions/supabase-admin/index.ts` | MODIFY | Add Management API calls for SQL and edge functions |
| `src/components/fullstack-app-builder.tsx` | MODIFY | Better deployment status UI, copy-friendly SQL |

---

## Technical Details

### Supabase Management API Endpoints

**Execute SQL:**
```
POST https://api.supabase.com/v1/projects/{project_ref}/database/query
Headers: Authorization: Bearer {access_token}
Body: { "query": "CREATE TABLE..." }
```

**Deploy Edge Function:**
```
POST https://api.supabase.com/v1/projects/{project_ref}/functions
Headers: Authorization: Bearer {access_token}
Body: { "slug": "function-name", "body": "..." }
```

**Get Access Token:**
Users get this from: `https://supabase.com/dashboard/account/tokens`

### Updated Connection Modal UI

```text
Current Fields:
├── Project URL (required)
├── Anon Key (required)
└── Service Role Key (required)

New Fields:
├── Project URL (required)
├── Anon Key (required)
├── Service Role Key (required)
└── Personal Access Token (optional - for full automation)
    └── "Without this, you'll need to manually run SQL in Supabase Dashboard"
```

### Deployment Flow

```text
User clicks "Deploy Database":

┌──────────────────────────────┐
│ Has Personal Access Token?   │
└──────────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
   YES           NO
    │             │
    ▼             ▼
┌─────────┐  ┌─────────────────────────┐
│ Call    │  │ Show SQL with copy      │
│ Mgmt    │  │ button + link to        │
│ API     │  │ user's SQL Editor       │
└─────────┘  └─────────────────────────┘
    │             │
    ▼             ▼
┌─────────┐  ┌─────────────────────────┐
│ Success │  │ "Paste & run this SQL   │
│ Toast   │  │ in your SQL Editor"     │
└─────────┘  └─────────────────────────┘
```

---

## User Experience After Fix

### With Access Token (Full Automation):
1. User connects Supabase with all credentials including Access Token
2. Generates full-stack app
3. Clicks "Deploy Database"
4. Tables and policies are created automatically on user's Supabase
5. Edge functions are deployed automatically
6. User sees success confirmation with details

### Without Access Token (Guided Manual):
1. User connects with just URL + keys (no Access Token)
2. Generates full-stack app
3. Clicks "Deploy Database"
4. System shows clear message: "Access Token required for auto-deploy"
5. Shows expandable SQL with one-click copy
6. Direct link to user's SQL Editor opens in new tab
7. User pastes SQL and runs
8. Edge function code shown with instructions for Supabase CLI

---

## Priority Order

1. **HIGH**: Add Access Token field to connection modal
2. **HIGH**: Update supabase-admin to use Management API with access token
3. **HIGH**: Fix SQL execution with proper Management API endpoint
4. **MEDIUM**: Add edge function deployment capability
5. **MEDIUM**: Improve fallback UI with copy-friendly SQL panels
6. **LOW**: Add deployment status tracking
