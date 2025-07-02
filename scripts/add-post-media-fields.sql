-- Add media fields to individual_posts table
-- Execute this script in Supabase SQL Editor

-- Add image_url field for embed-safe image URLs
ALTER TABLE individual_posts 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add caption field for post text
ALTER TABLE individual_posts 
ADD COLUMN IF NOT EXISTS caption TEXT;

-- Add media_type field (1 = photo, 2 = video, 8 = carousel)
ALTER TABLE individual_posts 
ADD COLUMN IF NOT EXISTS media_type INTEGER DEFAULT 1;

-- Update comments for documentation
COMMENT ON COLUMN individual_posts.image_url IS 'Post image/thumbnail URL (embed safe with url_embed_safe=true)';
COMMENT ON COLUMN individual_posts.caption IS 'Post caption/text (truncated to 150 chars)';
COMMENT ON COLUMN individual_posts.media_type IS '1 = photo, 2 = video, 8 = carousel'; 