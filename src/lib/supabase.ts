import { createClient } from '@supabase/supabase-js'

// Safe environment variable access for build time
const getEnvVar = (key: string): string => {
  if (typeof process === 'undefined') return '';
  return process.env[key] || '';
}

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

// Client-side Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Server-side Supabase client with service role for admin operations
export const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return Boolean(supabaseUrl && (supabaseAnonKey || supabaseServiceKey));
}

// Types for our database tables
export interface TrackedUser {
  id: string;
  username: string;
  instagram_user_id?: string;
  full_name?: string;
  profile_pic_url?: string;
  is_verified: boolean;
  is_private: boolean;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface FollowerHistory {
  id: string;
  username: string;
  follower_count: number;
  following_count?: number;
  post_count?: number;
  engagement_rate?: number;
  created_at: string;
}

export interface UserTrackingPreference {
  id: string;
  user_id: string;
  tracked_username: string;
  notification_threshold?: number;
  created_at: string;
}

export interface AnalyticsCache {
  id: string;
  username: string;
  metric_type: string;
  metric_value: any;
  expires_at: string;
  created_at: string;
} 