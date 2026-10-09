// src/context/AuthContext.tsx
// Centralized authentication and profile context using Supabase Auth.
// Exposes user, session, profile, loading, signUp, signIn, signOut, updateProfile, resetPassword, and updatePassword.

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { fetchUserProfile, createOrEnsureProfile, updateUserProfile } from '../services/profileService';
import type { UserProfile } from '../services/profileService';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{
    error: AuthError | Error | null;
    needsEmailVerification: boolean;
  }>;
  signIn: (email: string, password: string) => Promise<{
    error: AuthError | Error | null;
  }>;
  signOut: () => Promise<{
    error: AuthError | Error | null;
  }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{
    error: Error | null;
  }>;
  resetPassword: (email: string) => Promise<{
    error: AuthError | Error | null;
  }>;
  updatePassword: (newPassword: string) => Promise<{
    error: AuthError | Error | null;
  }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const configured = isSupabaseConfigured();

  // Helper to load or create profile for authenticated user
  const syncProfile = async (currentUser: User | null, preferredName?: string) => {
    if (!currentUser) {
      setProfile(null);
      return;
    }

    let p = await fetchUserProfile(currentUser.id);
    if (!p) {
      p = await createOrEnsureProfile(currentUser, preferredName);
    }
    setProfile(p);
  };

  useEffect(() => {
    if (!supabase || !configured) {
      // In demo mode without configured keys: check local demo session if any
      const savedDemoUser = localStorage.getItem('capgraph_demo_user');
      if (savedDemoUser) {
        try {
          const parsed = JSON.parse(savedDemoUser);
          setUser(parsed);
          setProfile({
            id: parsed.id,
            name: parsed.user_metadata?.full_name || 'Indraj Gupta',
            bio: 'AI/ML Developer',
          });
        } catch (e) {
          localStorage.removeItem('capgraph_demo_user');
        }
      }
      setLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Initial session restoration
    supabase.auth.getSession().then(async ({ data: { session: initialSession }, error }) => {
      if (!isMounted) return;
      if (error) {
        console.warn('[AuthContext] Session retrieval error:', error.message);
      }
      setSession(initialSession);
      setUser(initialSession?.user ?? null);

      if (initialSession?.user) {
        await syncProfile(initialSession.user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    // 2. Real-time auth state subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        await syncProfile(currentSession.user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured]);

  // Sign Up
  const signUp = async (email: string, password: string, name?: string) => {
    if (!supabase || !configured) {
      // Fallback demo user
      const demoUser = {
        id: 'usr_demo_' + Math.random().toString(36).substring(2, 9),
        email,
        user_metadata: { full_name: name || 'Indraj Gupta', name: name || 'Indraj Gupta' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(demoUser);
      setProfile({
        id: demoUser.id,
        name: name || 'Indraj Gupta',
        bio: 'AI/ML Developer',
      });
      localStorage.setItem('capgraph_demo_user', JSON.stringify(demoUser));
      return { error: null, needsEmailVerification: true };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name?.trim() || '',
          name: name?.trim() || '',
        },
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      return { error, needsEmailVerification: false };
    }

    // If session was returned immediately (email confirmation disabled or auto-confirmed)
    if (data.user && data.session) {
      setUser(data.user);
      setSession(data.session);
      await createOrEnsureProfile(data.user, name);
      return { error: null, needsEmailVerification: false };
    }

    // If confirmation is required, session is null until user verifies
    return { error: null, needsEmailVerification: true };
  };

  // Sign In
  const signIn = async (email: string, password: string) => {
    if (!supabase || !configured) {
      // Fallback demo user
      const demoUser = {
        id: 'usr_demo_' + Math.random().toString(36).substring(2, 9),
        email,
        user_metadata: { full_name: 'Indraj Gupta' },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;
      setUser(demoUser);
      setProfile({
        id: demoUser.id,
        name: 'Indraj Gupta',
        bio: 'AI/ML Developer',
      });
      localStorage.setItem('capgraph_demo_user', JSON.stringify(demoUser));
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return { error };
    }

    setUser(data.user);
    setSession(data.session);

    if (data.user) {
      await syncProfile(data.user);
    }

    return { error: null };
  };

  // Sign Out
  const signOut = async () => {
    if (!supabase || !configured) {
      setUser(null);
      setSession(null);
      setProfile(null);
      localStorage.removeItem('capgraph_demo_user');
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    return { error: error ?? null };
  };

  // Update Profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error('User not authenticated') };
    }

    const res = await updateUserProfile(user.id, updates);
    if (res.success) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    }
    return { error: new Error(res.error || 'Failed to update profile') };
  };

  // Reset Password for Email
  const resetPassword = async (email: string) => {
    if (!supabase || !configured) {
      return { error: null };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    return { error: error ?? null };
  };

  // Update Password
  const updatePassword = async (newPassword: string) => {
    if (!supabase || !configured) {
      return { error: null };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    return { error: error ?? null };
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    loading,
    isConfigured: configured,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
