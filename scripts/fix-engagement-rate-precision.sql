-- Fix engagement rate precision issue
-- Execute this script in Supabase SQL Editor to fix existing database

-- Update engagement_profiles table
ALTER TABLE engagement_profiles 
ALTER COLUMN overall_engagement_rate TYPE DECIMAL(8,4);

-- Update individual_posts table  
ALTER TABLE individual_posts 
ALTER COLUMN individual_engagement_rate TYPE DECIMAL(8,4);

-- Update monthly_engagement_history table
ALTER TABLE monthly_engagement_history 
ALTER COLUMN overall_engagement_rate TYPE DECIMAL(8,4);

-- Update comments for documentation
COMMENT ON COLUMN engagement_profiles.overall_engagement_rate IS 'Percentage: (avg_likes + avg_comments) / follower_count * 100 (allows up to 9999.9999%)';
COMMENT ON COLUMN individual_posts.individual_engagement_rate IS 'Percentage: (likes + comments) / follower_count * 100 (allows up to 9999.9999%)'; 