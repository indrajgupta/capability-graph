// src/services/profileService.ts
// Secure profile management for CapabilityGraph using Supabase Auth ID.
// Always queries and inserts using auth.users.id (user.id).
// Never uses email as primary or foreign key.

import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string; // matches auth.users.id
  name: string;
  bio?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * Fetches the user profile from public.profiles using auth user.id.
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabase || !userId) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn('[ProfileService] Fetch profile error:', error.message);
      return null;
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name || data.full_name || 'Indraj Gupta',
      bio: data.bio || '',
      avatar_url: data.avatar_url || '',
      created_at: data.created_at,
      updated_at: data.updated_at,
    };
  } catch (err) {
    console.error('[ProfileService] Unexpected fetch error:', err);
    return null;
  }
}

/**
 * Creates or initializes the user profile in public.profiles.
 * Strictly uses profiles.id = user.id.
 * Gracefully accommodates either 'name' or 'full_name' column name.
 */
export async function createOrEnsureProfile(user: User, preferredName?: string): Promise<UserProfile | null> {
  if (!supabase || !user) return null;

  const resolvedName =
    preferredName?.trim() ||
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    'Indraj Gupta';

  try {
    // 1. Check if profile already exists
    const existing = await fetchUserProfile(user.id);
    if (existing) {
      return existing;
    }

    // 2. Insert new profile row using auth.users.id
    const basePayload = {
      id: user.id,
      bio: user.user_metadata?.bio || 'Building connected capability graphs',
      avatar_url: user.user_metadata?.avatar_url || '',
    };

    // Try with 'name' column first
    let insertResult = await supabase
      .from('profiles')
      .upsert({
        ...basePayload,
        name: resolvedName,
      })
      .select()
      .maybeSingle();

    // If 'name' column does not exist, try with 'full_name'
    if (insertResult.error && insertResult.error.message.includes('name')) {
      insertResult = await supabase
        .from('profiles')
        .upsert({
          ...basePayload,
          full_name: resolvedName,
        })
        .select()
        .maybeSingle();
    }

    if (insertResult.error) {
      console.warn('[ProfileService] Profile creation error:', insertResult.error.message);
      // Return local fallback object
      return {
        id: user.id,
        name: resolvedName,
        bio: basePayload.bio,
        avatar_url: basePayload.avatar_url,
      };
    }

    const data = insertResult.data;
    return {
      id: user.id,
      name: data?.name || data?.full_name || resolvedName,
      bio: data?.bio || basePayload.bio,
      avatar_url: data?.avatar_url || basePayload.avatar_url,
    };
  } catch (err) {
    console.error('[ProfileService] Unexpected profile creation error:', err);
    return {
      id: user.id,
      name: resolvedName,
      bio: '',
      avatar_url: '',
    };
  }
}

/**
 * Updates an authenticated user's profile in public.profiles.
 * Protected by RLS (only user where id = auth.uid() can update).
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !userId) {
    return { success: false, error: 'Database client not connected.' };
  }

  try {
    const payload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.bio !== undefined) payload.bio = updates.bio;
    if (updates.avatar_url !== undefined) payload.avatar_url = updates.avatar_url;

    if (updates.name !== undefined) {
      payload.name = updates.name;
    }

    let { error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', userId);

    if (error && error.message.includes('name')) {
      // Retry with full_name
      delete payload.name;
      payload.full_name = updates.name;
      const retry = await supabase.from('profiles').update(payload).eq('id', userId);
      error = retry.error;
    }

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update profile.' };
  }
}
