// src/config/env.ts
// Centralized frontend environment configuration.
// Sensitive server keys (DIFY_API_KEY) are NEVER exposed to the frontend bundle.

export const env = {
  // Supabase — safe for frontend use (anon key is public by design)
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL as string | undefined,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined,
  },

  // App URL
  appUrl: (import.meta.env.VITE_APP_URL as string | undefined) || 'http://localhost:5173',

  // Demo mode check
  isDemoMode: !import.meta.env.VITE_SUPABASE_URL,
} as const;
