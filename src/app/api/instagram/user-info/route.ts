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

    console.log(`🔍 Fetching fresh data for ${cleanUsername} from API`);

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

    console.log(`✅ Fetched fresh data for ${userData.username}: ${userData.followerCount} followers`);

    // ALWAYS create new tracking record and calculate growth stats
    try {
      // Add new snapshot to tracking history
      await followerService.addFollowerSnapshot(userData);
      
      // Get growth stats (works for both new and existing users)
      const growthStats = await followerService.getGrowthStats(cleanUsername);
      const isNewUser = !growthStats || growthStats.daysTracked <= 1;
      
      return Response.json({
        success: true,
        data: {
          ...userData,
          growthStats,
          isNewUser
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