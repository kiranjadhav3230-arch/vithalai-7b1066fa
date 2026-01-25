

# Plan: Publish to Netlify (xyz.netlify.app)

## Overview
This plan implements a **direct Netlify deployment** feature that allows users to publish their website projects to real Netlify URLs like `xyz.netlify.app`. The deployment happens through the Netlify API, with the Personal Access Token (PAT) stored securely as a Supabase secret.

---

## How It Works

```text
User clicks "Publish to Netlify" on a website project
                    ↓
Publish Modal opens with:
  - Project name as title  
  - Suggested subdomain (auto-generated from name)
  - Real-time "xyz.netlify.app" preview
                    ↓
User clicks "Deploy to Netlify"
                    ↓
Frontend creates ZIP blob with index.html, styles.css, script.js
                    ↓
Edge function receives ZIP + subdomain
                    ↓
Edge function calls Netlify API:
  1. Create site with subdomain name
  2. Deploy ZIP to the site
                    ↓
Success! Returns live URL: https://xyz.netlify.app
```

---

## Implementation Steps

### Step 1: Add Netlify API Token as Supabase Secret
**Action**: Add `NETLIFY_ACCESS_TOKEN` to Supabase secrets

You will need to provide your Netlify Personal Access Token:
1. Go to https://app.netlify.com/user/applications#personal-access-tokens
2. Click "New access token"
3. Name it "Vithal AI Publisher" 
4. Copy the token

---

### Step 2: Create New Edge Function for Netlify Deployment
**File**: `supabase/functions/deploy-to-netlify/index.ts`

This edge function will:
- Receive the website files (HTML, CSS, JS) and desired subdomain
- Create a ZIP archive using JSZip
- Call Netlify API to create a site with the specified subdomain name
- Deploy the ZIP to that site
- Return the live Netlify URL

**Key API calls**:
```text
POST https://api.netlify.com/api/v1/sites
  Body: { "name": "xyz" }
  Returns: site_id, url

POST https://api.netlify.com/api/v1/sites/{site_id}/deploys
  Body: ZIP file (multipart/form-data)
  Returns: deploy_url
```

---

### Step 3: Create Publish to Netlify Modal Component
**File**: `src/components/publish-netlify-modal.tsx`

A dialog component with:
- Title input (pre-filled from project name)
- Subdomain input with real-time URL preview (`xyz.netlify.app`)
- Validation (lowercase, alphanumeric, hyphens only)
- Deploy button with loading state
- Success state showing the live URL with copy button

---

### Step 4: Add "Publish to Netlify" Button to UI Components

**Files to modify**:

| File | Changes |
|------|---------|
| `WebsiteProjectsPanel.tsx` | Add "Publish to Netlify" button in quick actions and dropdown menu |
| `code-snippet-library.tsx` | Add state for modal, integrate publish modal, add handler |
| `gemini-chat-interface.tsx` | Add publish button to website list in sidebar |

---

### Step 5: Update Database Schema (Optional Enhancement)
**Migration**: Add `netlify_url` column to `published_websites` table

This allows tracking which projects have been deployed to Netlify:
```sql
ALTER TABLE published_websites 
ADD COLUMN netlify_url TEXT,
ADD COLUMN netlify_site_id TEXT;
```

---

## Files Summary

| File | Action | Description |
|------|--------|-------------|
| `supabase/functions/deploy-to-netlify/index.ts` | CREATE | Edge function for Netlify API calls |
| `src/components/publish-netlify-modal.tsx` | CREATE | UI modal for publishing |
| `src/components/code-library/WebsiteProjectsPanel.tsx` | MODIFY | Add publish button |
| `src/components/code-snippet-library.tsx` | MODIFY | Integrate modal, add handler |
| `src/components/gemini-chat-interface.tsx` | MODIFY | Add publish option in sidebar |
| New migration file | CREATE | Add netlify_url columns |

---

## Technical Details

### Edge Function Logic (`deploy-to-netlify/index.ts`)

```text
1. Authenticate user via Supabase JWT
2. Receive: { subdomain, htmlContent, cssContent, jsContent, projectId }
3. Validate subdomain format
4. Create ZIP blob:
   - index.html
   - styles.css
   - script.js
5. Call Netlify API:
   - Create site: POST /api/v1/sites { name: subdomain }
   - Handle 422 if name taken
   - Deploy: POST /api/v1/sites/{site_id}/deploys with ZIP
6. Save netlify_url and site_id to published_websites table
7. Return: { success: true, url: "https://xyz.netlify.app" }
```

### Modal Component Props

```text
interface PublishNetlifyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: WebsiteProject;
  onSuccess: (url: string) => void;
}
```

### Button Placement

1. **WebsiteProjectsPanel Quick Actions**: Next to Preview and Download buttons
2. **Dropdown Menu**: Under "Download for Netlify" option  
3. **Sidebar**: In the website project list actions

---

## User Flow

1. User generates or saves a website project
2. User clicks "Publish to Netlify" button
3. Modal opens with suggested subdomain (from project name)
4. User can edit the subdomain
5. Real-time preview shows: `https://xyz.netlify.app`
6. User clicks "Deploy"
7. Loading spinner while deploying
8. Success: Shows live URL with "Copy" and "Open" buttons
9. Project is marked as published with the Netlify URL saved

---

## Error Handling

| Error | User Message |
|-------|-------------|
| Subdomain taken (422) | "This subdomain is already taken. Please try another name." |
| Invalid format | "Subdomain can only contain lowercase letters, numbers, and hyphens." |
| Netlify API error | "Failed to deploy. Please try again." |
| No Netlify token | "Netlify integration not configured. Please contact support." |

---

## Prerequisites

Before implementation, you need to:
1. Create a Netlify account (free) if you don't have one
2. Generate a Personal Access Token from Netlify
3. Add `NETLIFY_ACCESS_TOKEN` to Supabase secrets

