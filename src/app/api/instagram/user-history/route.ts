import { NextRequest } from 'next/server';
import { FollowerTrackingService } from '@/lib/followerTracking';

export async function POST(request: NextRequest) {
  try {
    const { username, days = 30 } = await request.json();

    if (!username) {
      return Response.json(
        { success: false, error: 'Username is required' },
        { status: 400 }
      );
    }

    const followerService = new FollowerTrackingService();
    const history = await followerService.getFollowerHistory(username, days);

    // Format data for chart
    const chartData = history.map(record => ({
      date: new Date(record.recorded_at).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric'
      }),
      followers: record.follower_count,
      following: record.following_count,
      posts: record.media_count,
      timestamp: record.recorded_at
    }));

    return Response.json({
      success: true,
      data: {
        username,
        history: chartData,
        totalRecords: history.length
      }
    });

  } catch (error) {
    console.error('Failed to fetch user history:', error);
    return Response.json(
      { success: false, error: 'Failed to fetch user history' },
      { status: 500 }
    );
  }
} 