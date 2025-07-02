-- Instagram Engagement Calculator Database Schema
-- Execute this script in Supabase SQL Editor

-- Main engagement profiles table (current analysis snapshot with 6-month cache)
CREATE TABLE IF NOT EXISTS engagement_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  follower_count_at_analysis INTEGER NOT NULL DEFAULT 0,
  avg_likes_last_10 DECIMAL(10,2) NOT NULL DEFAULT 0,
  avg_comments_last_10 DECIMAL(10,2) NOT NULL DEFAULT 0,
  overall_engagement_rate DECIMAL(8,4) NOT NULL DEFAULT 0, -- percentage with 4 decimal precision (allows up to 9999.9999%)
  last_analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  cache_expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (NOW() + INTERVAL '6 months'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Individual posts from last analysis (last 10 posts per profile)
CREATE TABLE IF NOT EXISTS individual_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES engagement_profiles(id) ON DELETE CASCADE,
  post_id VARCHAR(100) NOT NULL, -- Instagram post ID
  post_url VARCHAR(500), -- Full Instagram post URL
  image_url TEXT, -- Post image/thumbnail URL (embed safe)
  caption TEXT, -- Post caption/text
  media_type INTEGER DEFAULT 1, -- 1 = photo, 2 = video, 8 = carousel
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  individual_engagement_rate DECIMAL(8,4) NOT NULL DEFAULT 0, -- allows up to 9999.9999%
  post_date TIMESTAMP WITH TIME ZONE, -- When the post was originally published
  analyzed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, post_id) -- Prevent duplicate posts for same profile
);

-- Monthly historical snapshots for evolution charts
CREATE TABLE IF NOT EXISTS monthly_engagement_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL REFERENCES engagement_profiles(id) ON DELETE CASCADE,
  snapshot_month INTEGER NOT NULL CHECK (snapshot_month BETWEEN 1 AND 12),
  snapshot_year INTEGER NOT NULL CHECK (snapshot_year >= 2020),
  avg_likes_last_10 DECIMAL(10,2) NOT NULL DEFAULT 0,
  avg_comments_last_10 DECIMAL(10,2) NOT NULL DEFAULT 0,
  overall_engagement_rate DECIMAL(8,4) NOT NULL DEFAULT 0, -- allows up to 9999.9999%
  follower_count_at_snapshot INTEGER NOT NULL DEFAULT 0,
  posts_analyzed_count INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id, snapshot_month, snapshot_year) -- One snapshot per profile per month
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_engagement_profiles_username ON engagement_profiles(username);
CREATE INDEX IF NOT EXISTS idx_engagement_profiles_cache_expires ON engagement_profiles(cache_expires_at);
CREATE INDEX IF NOT EXISTS idx_individual_posts_profile_id ON individual_posts(profile_id);
CREATE INDEX IF NOT EXISTS idx_monthly_history_profile_month ON monthly_engagement_history(profile_id, snapshot_year DESC, snapshot_month DESC);

-- Create updated_at trigger for engagement_profiles
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_engagement_profiles_updated_at 
    BEFORE UPDATE ON engagement_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE engagement_profiles IS 'Main engagement analysis data with 6-month caching';
COMMENT ON TABLE individual_posts IS 'Individual post data from last analysis (last 10 posts)';
COMMENT ON TABLE monthly_engagement_history IS 'Monthly snapshots for historical trend charts';

COMMENT ON COLUMN engagement_profiles.overall_engagement_rate IS 'Percentage: (avg_likes + avg_comments) / follower_count * 100';
COMMENT ON COLUMN engagement_profiles.cache_expires_at IS '1-month cache expiration for fresh engagement data';
COMMENT ON COLUMN individual_posts.individual_engagement_rate IS 'Percentage: (likes + comments) / follower_count * 100'; 