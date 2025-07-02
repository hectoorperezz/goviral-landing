import { NextRequest } from 'next/server';
import { FollowerTrackingService } from '@/lib/followerTracking';

export async function GET(request: NextRequest) {
  try {
    // Verify this is coming from Vercel Cron (security)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      console.error('Unauthorized cron job attempt');
      return new Response('Unauthorized', { status: 401 });
    }

    console.log('Starting daily follower update job...');
    
    const followerService = new FollowerTrackingService();
    
    // Perform daily batch update
    const result = await followerService.performDailyUpdate();
    
    console.log(`Daily update completed: ${result.successCount}/${result.totalUsers} users updated successfully, ${result.errorCount} errors`);
    
    return Response.json({
      success: true,
      message: `Daily update completed: ${result.successCount} successful, ${result.errorCount} errors`,
      stats: result
    });
    
  } catch (error) {
    console.error('Daily update failed:', error);
    return Response.json({ 
      success: false, 
      error: 'Daily update failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Health check endpoint
export async function POST() {
  return Response.json({
    success: true,
    message: 'Cron update-followers endpoint is operational',
    timestamp: new Date().toISOString(),
  });
} 