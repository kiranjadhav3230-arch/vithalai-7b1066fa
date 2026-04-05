/**
 * End-to-End Encryption Utility
 * Uses AES-256-GCM via Web Crypto API
 * Keys derived from user ID + passphrase using PBKDF2
 */

const PBKDF2_ITERATIONS = 100000;
const SALT_PREFIX = 'vithal-ai-e2e-v1';
const KEY_STORAGE_PREFIX = 'vithal_e2e_key_';
const ENCRYPTION_FLAG_PREFIX = 'vithal_e2e_enabled_';

// Check if encryption is enabled for a user
export const isEncryptionEnabled = (userId: string): boolean => {
  return localStorage.getItem(`${ENCRYPTION_FLAG_PREFIX}${userId}`) === 'true';
};

// Toggle encryption enabled state
export const setEncryptionEnabled = (userId: string, enabled: boolean): void => {
  localStorage.setItem(`${ENCRYPTION_FLAG_PREFIX}${userId}`, String(enabled));
  if (!enabled) {
    // Clear the derived key from session
    sessionStorage.removeItem(`${KEY_STORAGE_PREFIX}${userId}`);
  }
};

// Convert string to ArrayBuffer
const stringToBuffer = (str: string): ArrayBuffer => {
  return new TextEncoder().encode(str).buffer;
};

// Convert ArrayBuffer to base64
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Convert base64 to ArrayBuffer
const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

// Derive encryption key from userId + passphrase using PBKDF2
export const deriveEncryptionKey = async (
  userId: string,
  passphrase: string
): Promise<CryptoKey> => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    stringToBuffer(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const salt = stringToBuffer(`${SALT_PREFIX}:${userId}`);

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new Uint8Array(salt),
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true, // extractable so we can export to session storage
    ['encrypt', 'decrypt']
  );

  return key;
};

// Export key to store in sessionStorage
const exportKey = async (key: CryptoKey): Promise<string> => {
  const exported = await crypto.subtle.exportKey('raw', key);
  return bufferToBase64(exported);
};

// Import key from sessionStorage
const importKey = async (keyData: string): Promise<CryptoKey> => {
  const keyBuffer = base64ToBuffer(keyData);
  return crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

// Store derived key in sessionStorage (cleared on tab close)
export const storeKeyInSession = async (userId: string, key: CryptoKey): Promise<void> => {
  const exported = await exportKey(key);
  sessionStorage.setItem(`${KEY_STORAGE_PREFIX}${userId}`, exported);
};

// Get stored key from sessionStorage
export const getStoredKey = async (userId: string): Promise<CryptoKey | null> => {
  const stored = sessionStorage.getItem(`${KEY_STORAGE_PREFIX}${userId}`);
  if (!stored) return null;
  try {
    return await importKey(stored);
  } catch {
    sessionStorage.removeItem(`${KEY_STORAGE_PREFIX}${userId}`);
    return null;
  }
};

// Check if key exists in session
export const hasKeyInSession = (userId: string): boolean => {
  return sessionStorage.getItem(`${KEY_STORAGE_PREFIX}${userId}`) !== null;
};

// Encrypt a message - returns "iv:ciphertext" in base64
export const encryptMessage = async (
  plaintext: string,
  key: CryptoKey
): Promise<string> => {
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV for GCM
  const encoded = new TextEncoder().encode(plaintext);

  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  const ivBase64 = bufferToBase64(iv.buffer);
  const ctBase64 = bufferToBase64(ciphertext);

  return `${ivBase64}:${ctBase64}`;
};

// Decrypt a message - expects "iv:ciphertext" in base64
export const decryptMessage = async (
  encrypted: string,
  key: CryptoKey
): Promise<string> => {
  const [ivBase64, ctBase64] = encrypted.split(':');
  if (!ivBase64 || !ctBase64) {
    throw new Error('Invalid encrypted format');
  }

  const iv = new Uint8Array(base64ToBuffer(ivBase64));
  const ciphertext = base64ToBuffer(ctBase64);

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  return new TextDecoder().decode(decrypted);
};

// Check if a string looks like encrypted data (base64:base64 format)
export const isEncryptedString = (str: string): boolean => {
  if (!str || !str.includes(':')) return false;
  const parts = str.split(':');
  if (parts.length !== 2) return false;
  try {
    atob(parts[0]);
    atob(parts[1]);
    return parts[0].length === 16; // 12-byte IV = 16 base64 chars
  } catch {
    return false;
  }
};

// Try to decrypt, return original if not encrypted or decryption fails
export const tryDecrypt = async (
  text: string | null,
  key: CryptoKey | null
): Promise<string | null> => {
  if (!text) return null;
  if (!key) return text;
  if (!isEncryptedString(text)) return text;
  try {
    return await decryptMessage(text, key);
  } catch {
    return text; // Return as-is if decryption fails
  }
};
