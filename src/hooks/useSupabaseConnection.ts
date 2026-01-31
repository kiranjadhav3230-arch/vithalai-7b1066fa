import { useState, useEffect, useCallback } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseConnection {
  url: string;
  anonKey: string;
  serviceKey: string;
  accessToken?: string;  // Personal Access Token for Management API
  projectRef?: string;   // Extracted from URL (e.g., 'abc123' from 'abc123.supabase.co')
  projectName?: string;
  connectedAt: number;
}

interface UseSupabaseConnectionReturn {
  connection: SupabaseConnection | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: (url: string, anonKey: string, serviceKey: string, accessToken?: string) => Promise<boolean>;
  disconnect: () => void;
  testConnection: (url: string, anonKey: string) => Promise<{ success: boolean; projectName?: string; error?: string }>;
  getUserClient: () => SupabaseClient | null;
}

// Simple encryption for localStorage (basic obfuscation, not military-grade)
const encryptKey = (key: string): string => {
  return btoa(key.split('').reverse().join(''));
};

const decryptKey = (encrypted: string): string => {
  try {
    return atob(encrypted).split('').reverse().join('');
  } catch {
    return '';
  }
};

const STORAGE_KEY = 'vithal_user_supabase_connection';

export const useSupabaseConnection = (): UseSupabaseConnectionReturn => {
  const [connection, setConnection] = useState<SupabaseConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load connection from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConnection({
          ...parsed,
          anonKey: decryptKey(parsed.anonKey),
          serviceKey: decryptKey(parsed.serviceKey),
          accessToken: parsed.accessToken ? decryptKey(parsed.accessToken) : undefined,
        });
      }
    } catch (err) {
      console.error('Failed to load Supabase connection:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Test connection to user's Supabase project
  const testConnection = useCallback(async (
    url: string, 
    anonKey: string
  ): Promise<{ success: boolean; projectName?: string; error?: string }> => {
    try {
      // Validate URL format
      if (!url.includes('supabase.co') && !url.includes('supabase.in')) {
        return { success: false, error: 'Invalid Supabase URL format' };
      }

      // Create a test client with anon key
      const testClient = createClient(url, anonKey);
      
      // Try a simple query to verify connection
      const { error: connectionError } = await testClient.auth.getSession();
      
      if (connectionError && !connectionError.message.includes('session')) {
        return { success: false, error: connectionError.message };
      }

      // Extract project name from URL
      const projectMatch = url.match(/https:\/\/([^.]+)\.supabase/);
      const projectName = projectMatch ? projectMatch[1] : 'Connected Project';

      return { success: true, projectName };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Connection test failed' 
      };
    }
  }, []);

  // Connect to user's Supabase project
  const connect = useCallback(async (
    url: string, 
    anonKey: string,
    serviceKey: string,
    accessToken?: string
  ): Promise<boolean> => {
    setError(null);
    
    // Test connection first
    const testResult = await testConnection(url, anonKey);
    if (!testResult.success) {
      setError(testResult.error || 'Connection failed');
      return false;
    }

    // Extract project ref from URL
    const projectMatch = url.match(/https:\/\/([^.]+)\.supabase/);
    const projectRef = projectMatch ? projectMatch[1] : undefined;

    const newConnection: SupabaseConnection = {
      url: url.trim(),
      anonKey: anonKey.trim(),
      serviceKey: serviceKey.trim(),
      accessToken: accessToken?.trim() || undefined,
      projectRef,
      projectName: testResult.projectName,
      connectedAt: Date.now(),
    };

    // Save to state
    setConnection(newConnection);

    // Save to localStorage (encrypted)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...newConnection,
        anonKey: encryptKey(newConnection.anonKey),
        serviceKey: encryptKey(newConnection.serviceKey),
        accessToken: newConnection.accessToken ? encryptKey(newConnection.accessToken) : undefined,
      }));
    } catch (err) {
      console.error('Failed to save connection:', err);
    }

    return true;
  }, [testConnection]);

  // Disconnect from user's Supabase project
  const disconnect = useCallback(() => {
    setConnection(null);
    setError(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get a Supabase client for the user's project
  const getUserClient = useCallback((): SupabaseClient | null => {
    if (!connection) return null;
    return createClient(connection.url, connection.anonKey);
  }, [connection]);

  return {
    connection,
    isConnected: !!connection,
    isLoading,
    error,
    connect,
    disconnect,
    testConnection,
    getUserClient,
  };
};
