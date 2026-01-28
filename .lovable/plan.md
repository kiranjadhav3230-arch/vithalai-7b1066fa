
# Plan: Full-Stack App Builder (Lovable-Style) for Vithal AI

## Overview

Transform Vithal AI's Website Generator into a **full-stack application builder** that works like Lovable:
1. Users connect their own Supabase project (Project URL + Service Role Key)
2. Vithal AI generates complete applications (not just landing pages)
3. Vithal AI automatically creates database tables, RLS policies, and edge functions in the user's Supabase project
4. Frontend files deploy to Netlify as before

---

## Current Problem

| Issue | Current State |
|-------|--------------|
| Only Landing Pages | Website generator only creates static HTML/CSS/JS |
| No Backend | Cannot create APIs, databases, authentication |
| Manual Setup | Users must manually configure Supabase |
| Limited Templates | Only blog, portfolio, business websites |

---

## Solution Architecture

```text
User in Vithal AI
       ↓
Connects their Supabase Project:
  - Project URL (e.g., https://xyz.supabase.co)
  - Service Role Key (for admin operations)
       ↓
Chooses App Template:
  - Contact Form App
  - Blog/CMS
  - Todo App
  - E-commerce Store
  - SaaS Dashboard
  - Portfolio with CMS
       ↓
Vithal AI Generates:
  ├── Frontend (HTML/CSS/JS with Supabase SDK)
  ├── Database Schema (CREATE TABLE SQL)
  ├── RLS Policies (security rules)
  └── Edge Function (API logic)
       ↓
Vithal AI Executes on User's Supabase:
  1. Runs SQL migrations via Supabase REST API
  2. Creates database tables
  3. Applies RLS policies
       ↓
User Downloads:
  ├── Frontend files (deploy to Netlify)
  └── Edge function code (deploy via CLI)
```

---

## Implementation Steps

### Step 1: Create User Supabase Connection UI
**New Component**: `src/components/supabase-connection-modal.tsx`

A modal/dialog where users can:
- Enter their Supabase Project URL
- Enter their Supabase Service Role Key (stored securely in localStorage, encrypted)
- Test connection before saving
- View connected status

**UI Design**:
```text
┌─────────────────────────────────────────────────────┐
│  🔗 Connect Your Supabase Project                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Project URL:                                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ https://your-project.supabase.co            │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Service Role Key: (Admin access - keep private)   │
│  ┌─────────────────────────────────────────────┐   │
│  │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...     │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ⚠️ The Service Role Key has full database access. │
│     Never share it publicly.                        │
│                                                     │
│  [Test Connection]  [Save & Connect]               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### Step 2: Create Edge Function for Supabase Operations
**New File**: `supabase/functions/supabase-admin/index.ts`

This edge function will:
- Receive user's Supabase credentials
- Execute SQL migrations on the user's database
- Create tables, RLS policies, and functions
- Return success/error status

**Operations Supported**:
```text
POST /supabase-admin
{
  "operation": "execute_sql",
  "userSupabaseUrl": "https://xyz.supabase.co",
  "userServiceKey": "eyJ...",
  "sql": "CREATE TABLE contacts (...)"
}
```

**Security Considerations**:
- Validate SQL to prevent dangerous operations (DROP DATABASE, etc.)
- Rate limit requests
- Log all operations for user transparency
- Never store service keys on server

---

### Step 3: Expand App Templates
**Update**: `src/components/code-generator-chat.tsx`

Add new application templates beyond simple websites:

**Static Websites (Current)**:
- Landing Page
- Portfolio
- Business
- Restaurant
- Event
- Blog (static)

**Full-Stack Applications (New)**:
| Template | Description | Database Tables | Features |
|----------|-------------|-----------------|----------|
| Contact Form App | Form that saves to database | `contacts` | Form submission, admin view |
| Blog CMS | Blog with admin panel | `posts`, `categories` | CRUD posts, categories |
| Todo App | Task management | `todos`, `lists` | Create/complete tasks |
| User Dashboard | User data management | `profiles`, `settings` | Auth, profile editing |
| E-commerce Basic | Product catalog + cart | `products`, `orders`, `cart` | Catalog, cart, checkout |
| Booking System | Appointment booking | `services`, `bookings` | Calendar, booking form |

---

### Step 4: Update Code Generator Prompts
**Update**: `supabase/functions/code-generator-gemini/index.ts`

Add new task type `fullstack-app` with specialized prompts that generate:

**Output Structure for Full-Stack Apps**:
```text
=== FILE: frontend/index.html ===
[Complete HTML with Supabase SDK integration]

=== FILE: frontend/styles.css ===
[Complete CSS styling]

=== FILE: frontend/script.js ===
[JavaScript with Supabase client calls]

=== FILE: database/schema.sql ===
[CREATE TABLE statements with proper types]

=== FILE: database/rls.sql ===
[RLS policies for security]

=== FILE: supabase/functions/api/index.ts ===
[Edge function code if needed]

=== FILE: README.md ===
[Setup and deployment instructions]
```

---

### Step 5: Create Full-Stack App Builder UI
**Update**: `src/components/code-generator-chat.tsx`

Add new UI section when "Full-Stack App" is selected:

**New State Variables**:
```typescript
const [appCategory, setAppCategory] = useState<'static' | 'fullstack'>('static');
const [appTemplate, setAppTemplate] = useState('contact-form');
const [supabaseConnected, setSupabaseConnected] = useState(false);
const [autoDeployDb, setAutoDeployDb] = useState(true);
```

**UI for Full-Stack Mode**:
```text
┌─────────────────────────────────────────────────────┐
│  🚀 Full-Stack App Builder                          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Choose App Template:                               │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │ Contact │ │  Blog   │ │  Todo   │              │
│  │  Form   │ │   CMS   │ │   App   │              │
│  └─────────┘ └─────────┘ └─────────┘              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐              │
│  │Dashboard│ │E-commerce│ │ Booking │              │
│  └─────────┘ └─────────┘ └─────────┘              │
│                                                     │
│  Supabase Connection: 🟢 Connected (xyz.supabase.co)│
│                                                     │
│  ☑️ Auto-create database tables                     │
│  ☑️ Apply RLS security policies                     │
│                                                     │
│  Describe your app:                                 │
│  ┌─────────────────────────────────────────────┐   │
│  │ A contact form where users can submit...    │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [🚀 Generate Full-Stack App]                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

### Step 6: Implement Auto-Deploy to User's Supabase
**Update**: `src/components/code-generator-chat.tsx`

After generating the app, if user has connected Supabase:

```typescript
const deployToUserSupabase = async (schemaSQL: string, rlsSQL: string) => {
  const userSupabase = getUserSupabaseCredentials(); // From localStorage
  
  // Execute schema creation
  await supabase.functions.invoke('supabase-admin', {
    body: {
      operation: 'execute_sql',
      userSupabaseUrl: userSupabase.url,
      userServiceKey: userSupabase.serviceKey,
      sql: schemaSQL
    }
  });
  
  // Execute RLS policies
  await supabase.functions.invoke('supabase-admin', {
    body: {
      operation: 'execute_sql',
      userSupabaseUrl: userSupabase.url,
      userServiceKey: userSupabase.serviceKey,
      sql: rlsSQL
    }
  });
};
```

---

### Step 7: Update Download for Full-Stack Projects
**Update**: `src/components/code-generator-chat.tsx`

New ZIP structure for full-stack apps:

```text
my-fullstack-app/
├── frontend/
│   ├── index.html (with Supabase SDK)
│   ├── styles.css
│   └── script.js
├── supabase/
│   ├── functions/
│   │   └── api/
│   │       └── index.ts (if edge function needed)
│   └── migrations/
│       ├── 001_schema.sql
│       └── 002_rls.sql
├── netlify.toml
├── .env.example (with SUPABASE_URL, SUPABASE_ANON_KEY placeholders)
└── README.md (complete deployment guide)
```

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/components/supabase-connection-modal.tsx` | CREATE | Modal for connecting user's Supabase |
| `supabase/functions/supabase-admin/index.ts` | CREATE | Edge function for executing SQL on user's Supabase |
| `src/components/code-generator-chat.tsx` | MODIFY | Add full-stack mode, templates, auto-deploy |
| `supabase/functions/code-generator-gemini/index.ts` | MODIFY | Add full-stack app generation prompts |
| `src/hooks/useSupabaseConnection.ts` | CREATE | Hook for managing user's Supabase connection |
| `supabase/config.toml` | MODIFY | Add supabase-admin function config |

---

## Technical Details

### Supabase Admin Edge Function

```typescript
// supabase/functions/supabase-admin/index.ts

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const { operation, userSupabaseUrl, userServiceKey, sql } = await req.json();

  // Validate inputs
  if (!userSupabaseUrl || !userServiceKey) {
    return new Response(JSON.stringify({ error: 'Missing Supabase credentials' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  // Security: Block dangerous SQL
  const dangerousPatterns = [
    /DROP\s+DATABASE/i,
    /DROP\s+SCHEMA/i,
    /TRUNCATE\s+pg_/i,
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(sql)) {
      return new Response(JSON.stringify({ error: 'Dangerous SQL blocked' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
  }

  // Create client for user's Supabase
  const userSupabase = createClient(userSupabaseUrl, userServiceKey);

  if (operation === 'execute_sql') {
    // Execute SQL using Supabase's REST API
    const response = await fetch(`${userSupabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'apikey': userServiceKey,
        'Authorization': `Bearer ${userServiceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql })
    });
    
    // Return result
  }
});
```

---

### Frontend Template Example (Contact Form App)

**index.html**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form</title>
  <link rel="stylesheet" href="styles.css">
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <form id="contactForm">
    <input type="text" id="name" placeholder="Your Name" required>
    <input type="email" id="email" placeholder="Email" required>
    <textarea id="message" placeholder="Message" required></textarea>
    <button type="submit">Send Message</button>
  </form>
  <script src="script.js"></script>
</body>
</html>
```

**script.js**:
```javascript
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const { error } = await supabase.from('contacts').insert({
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    message: document.getElementById('message').value,
  });
  
  if (error) {
    alert('Error: ' + error.message);
  } else {
    alert('Message sent successfully!');
  }
});
```

**schema.sql**:
```sql
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contacts"
ON contacts FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Only authenticated can view contacts"
ON contacts FOR SELECT
TO authenticated
USING (true);
```

---

## User Flow

1. User opens Code Generator in Vithal AI
2. Selects "Full-Stack App" category
3. Clicks "Connect Supabase" to link their project
4. Enters Supabase URL and Service Role Key
5. Tests connection (success/fail feedback)
6. Chooses app template (Contact Form, Blog, etc.)
7. Describes customizations
8. Clicks "Generate Full-Stack App"
9. Vithal AI generates all files
10. If auto-deploy enabled: executes SQL on user's Supabase
11. User downloads frontend files
12. Deploys frontend to Netlify
13. App is live with working backend

---

## Security Considerations

1. **Service Role Key Storage**: Stored only in localStorage (client-side), never sent to Vithal AI's backend unless needed for immediate operation
2. **SQL Validation**: Block dangerous operations (DROP DATABASE, etc.)
3. **User Consent**: Always show what SQL will be executed before running
4. **Encryption**: Consider encrypting keys in localStorage
5. **Session-based**: Keys are not permanently stored on server

---

## Limitations

1. **Edge Function Deployment**: Users must manually deploy edge functions via Supabase CLI (Supabase API doesn't support this yet)
2. **Auth Setup**: Users may need to configure Auth providers in Supabase dashboard
3. **Storage Buckets**: Creating storage buckets may require manual setup
4. **Complex Apps**: Very complex apps may need additional customization

---

## Future Enhancements

1. One-click Supabase project creation (requires Supabase OAuth)
2. Real-time preview with mock backend
3. More templates (Social network, Marketplace, etc.)
4. Integration with user's existing database schema
5. Edge function deployment via API (when Supabase supports it)
