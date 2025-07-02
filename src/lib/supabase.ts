import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with service role for admin operations
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

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