

# Plan: End-to-End Encrypted AI Chat

## Overview

Add client-side encryption so chat messages stored in Supabase are encrypted at rest. Only the user's browser can decrypt them using a key derived from their password/identity.

## How It Works

```text
User types message
    ↓
Browser encrypts with AES-256-GCM (Web Crypto API)
    ↓
Encrypted ciphertext stored in Supabase
    ↓
AI response received → encrypted → stored
    ↓
On load: browser decrypts messages for display
```

The encryption key is derived from the user's ID + a passphrase using PBKDF2. Messages sent to the AI edge function are still sent in plaintext (the AI needs to read them), but what's **stored in the database** is encrypted.

## Architecture

| Layer | What Happens |
|-------|-------------|
| **Send message** | Encrypt message → store ciphertext in DB → send plaintext to AI → encrypt AI response → store ciphertext |
| **Load messages** | Fetch ciphertext from DB → decrypt in browser → display |
| **Key management** | Derive key from user ID + salt using PBKDF2, store derived key in sessionStorage (cleared on logout) |

**Important tradeoff**: Messages must be sent unencrypted to the AI edge function (it needs to read them). E2E encryption here means **data at rest in the database is encrypted** -- no one reading the DB can see messages. This is the same model used by many "privacy-first" AI apps.

## Implementation

### Step 1: Create Encryption Utility
**New file**: `src/lib/encryption.ts`

- `generateEncryptionKey(userId, passphrase)` - PBKDF2 key derivation
- `encryptMessage(plaintext, key)` - AES-256-GCM encrypt, returns base64 `{iv}:{ciphertext}`
- `decryptMessage(encrypted, key)` - AES-256-GCM decrypt
- `getOrCreateKey(userId)` - manages key in sessionStorage
- Uses Web Crypto API (built into all browsers, no dependencies)

### Step 2: Add Encryption Toggle + Key Setup
**Modify**: `src/components/gemini-chat-interface.tsx`

- Add encryption state: `const [encryptionEnabled, setEncryptionEnabled] = useState(false)`
- Add lock icon in header showing encryption status
- On first enable: prompt user to set an encryption passphrase
- Store passphrase preference in localStorage (encrypted flag only, not the passphrase)

### Step 3: Encrypt Messages Before Storage
**Modify**: `src/components/gemini-chat-interface.tsx` (sendMessage function)

```text
Current flow:
  message → insert to DB (plaintext) → send to AI → update DB with response (plaintext)

New flow:
  message → encrypt → insert to DB (ciphertext) → send to AI (plaintext) → 
  get response → encrypt response → update DB (ciphertext)
```

### Step 4: Decrypt Messages on Load
**Modify**: `src/components/gemini-chat-interface.tsx` (loadMessages function)

After fetching from Supabase, decrypt each message and response before setting state.

### Step 5: Add Privacy Indicator UI
**Modify**: `src/components/gemini-chat-interface.tsx`

- Green lock icon when encryption is ON
- "Messages are end-to-end encrypted" badge in chat
- Privacy info tooltip explaining what's encrypted

### Step 6: Handle Code Generator Chat Too
**Modify**: `src/components/code-generator-chat.tsx`

Apply same encryption/decryption to code generator messages.

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `src/lib/encryption.ts` | CREATE | AES-256-GCM encryption utilities using Web Crypto API |
| `src/components/gemini-chat-interface.tsx` | MODIFY | Add encryption toggle, encrypt/decrypt messages |
| `src/components/code-generator-chat.tsx` | MODIFY | Add encryption support for code chat |

## Privacy Guarantees

- Messages in Supabase database are AES-256-GCM encrypted
- Encryption key never leaves the browser
- Key derived from user ID + passphrase (PBKDF2 with 100,000 iterations)
- Clearing browser data = need to re-enter passphrase to decrypt old messages
- No new dependencies needed (Web Crypto API is built-in)

