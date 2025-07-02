import { NextRequest } from 'next/server';
import { FollowerTrackingService } from '@/lib/followerTracking';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return Response.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    // Clean username (remove @ symbol if present)
    const cleanUsername = username.replace('@', '').trim();

    if (!cleanUsername) {
      return Response.json(
        { success: false, error: 'Valid username is required' },
        { status: 400 }
      );
    }

    const followerService = new FollowerTrackingService();

    // STEP 1: Check if user exists in database first
    const existingUser = await followerService.getUserByUsername(cleanUsername);
    
    if (existingUser) {
      console.log(`User ${cleanUsername} found in database, returning cached data`);
      
      // Get growth stats for existing user
      const growthStats = await followerService.getGrowthStats(cleanUsername);
      
      // Return existing data from database
      return Response.json({
        success: true,
        data: {
          id: existingUser.instagram_id,
          username: existingUser.username,
          fullName: existingUser.full_name || '',
          followerCount: existingUser.current_follower_count || 0,
          followingCount: existingUser.current_following_count || 0,
          mediaCount: existingUser.current_media_count || 0,
          profilePicUrl: existingUser.profile_pic_url || '',
          isVerified: existingUser.is_verified || false,
          isPrivate: existingUser.is_private || false,
          biography: existingUser.biography || '',
          externalUrl: existingUser.external_url || '',
          growthStats,
          isNewUser: false
        }
      });
    }

    // STEP 2: User not in database, fetch from API
    console.log(`User ${cleanUsername} not in database, fetching from API`);

    const response = await fetch(
      `https://social-api4.p.rapidapi.com/v1/info?username_or_id_or_url=${cleanUsername}&url_embed_safe=true`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'social-api4.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`);
      return Response.json(
        { success: false, error: 'User not found or API error' },
        { status: 404 }
      );
    }

    const apiData = await response.json();

    if (!apiData.data) {
      return Response.json(
        { success: false, error: 'User not found or profile is private' },
        { status: 404 }
      );
    }

    const data = apiData.data;

    // Transform API data to our format
    const userData = {
      id: data.id || data.instagram_pk || '',
      username: data.username || '',
      fullName: data.full_name || '',
      followerCount: data.follower_count || 0,
      followingCount: data.following_count || 0,
      mediaCount: data.media_count || 0,
      profilePicUrl: data.hd_profile_pic_url_info?.url || data.profile_pic_url_hd || data.profile_pic_url || '',
      isVerified: data.is_verified || false,
      isPrivate: data.is_private || false,
      biography: data.biography || '',
      externalUrl: data.external_url || '',
    };

    console.log(`Fetched new user data for ${userData.username}: ${userData.followerCount} followers`);

    // STEP 3: Store new user in database
    try {
      await followerService.trackUser(userData);
      
      return Response.json({
        success: true,
        data: {
          ...userData,
          growthStats: null, // No growth stats for new users
          isNewUser: true
        }
      });

    } catch (dbError) {
      console.error('Database error:', dbError);
      // Return user data even if database fails
      return Response.json({
        success: true,
        data: {
          ...userData,
          growthStats: null,
          isNewUser: true
        }
      });
    }

  } catch (error) {
    console.error('Instagram API error:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return Response.json({
    success: true,
    message: 'Instagram user-info API is operational',
    timestamp: new Date().toISOString(),
  });
} 