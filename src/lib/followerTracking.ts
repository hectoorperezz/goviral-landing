import { createClient } from '@supabase/supabase-js';

interface InstagramUserData {
  id: string;
  username: string;
  fullName: string;
  followerCount: number;
  followingCount: number;
  mediaCount: number;
  profilePicUrl: string;
  isVerified: boolean;
  isPrivate: boolean;
  biography: string;
  externalUrl: string;
}

interface FollowerHistoryRecord {
  recorded_at: string;
  follower_count: number;
  following_count: number;
  media_count: number;
}

interface GrowthStats {
  current: number;
  dailyChange: number;
  totalChange: number;
  growthRate: number;
  daysTracked: number;
}

export class FollowerTrackingService {
  private supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  /**
   * Track user - adds new user to database or updates existing user
   */
  async trackUser(userData: InstagramUserData) {
    try {
      // Upsert user data with current follower counts
      const { data: user, error } = await this.supabase
        .from('tracked_users')
        .upsert({
          username: userData.username,
          instagram_id: userData.id,
          full_name: userData.fullName,
          profile_pic_url: userData.profilePicUrl,
          is_verified: userData.isVerified,
          is_private: userData.isPrivate,
          biography: userData.biography,
          external_url: userData.externalUrl,
          current_follower_count: userData.followerCount,
          current_following_count: userData.followingCount,
          current_media_count: userData.mediaCount,
          last_updated_at: new Date().toISOString(),
          is_active: true
        }, { 
          onConflict: 'username',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (error) {
        console.error('Error upserting user:', error);
        throw error;
      }

      // Record initial follower snapshot in history
      await this.recordFollowerSnapshot(user.id, {
        followerCount: userData.followerCount,
        followingCount: userData.followingCount,
        mediaCount: userData.mediaCount
      });

      return user;
    } catch (error) {
      console.error('Error tracking user:', error);
      throw error;
    }
  }

  /**
   * Record follower snapshot in history
   */
  async recordFollowerSnapshot(userId: string, metrics: {
    followerCount: number;
    followingCount: number;
    mediaCount: number;
  }) {
    const { error } = await this.supabase
      .from('follower_history')
      .insert({
        user_id: userId,
        follower_count: metrics.followerCount,
        following_count: metrics.followingCount,
        media_count: metrics.mediaCount
      });

    if (error) {
      console.error('Error recording follower snapshot:', error);
      throw error;
    }
  }

  /**
   * Get user by username
   */
  async getUserByUsername(username: string) {
    const { data, error } = await this.supabase
      .from('tracked_users')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  }

  /**
   * Update user stats from API (for daily batch updates)
   */
  async updateUserStats(username: string, newStats: {
    followerCount: number;
    followingCount: number;
    mediaCount: number;
    profilePicUrl?: string;
    biography?: string;
  }) {
    try {
      // Update current stats in tracked_users table
      const { data: user, error: updateError } = await this.supabase
        .from('tracked_users')
        .update({
          current_follower_count: newStats.followerCount,
          current_following_count: newStats.followingCount,
          current_media_count: newStats.mediaCount,
          profile_pic_url: newStats.profilePicUrl || undefined,
          biography: newStats.biography || undefined,
          last_updated_at: new Date().toISOString()
        })
        .eq('username', username)
        .select('id')
        .single();

      if (updateError) {
        console.error(`Error updating stats for ${username}:`, updateError);
        return false;
      }

      // Record new snapshot in history
      await this.recordFollowerSnapshot(user.id, {
        followerCount: newStats.followerCount,
        followingCount: newStats.followingCount,
        mediaCount: newStats.mediaCount
      });

      console.log(`Updated stats for ${username}: ${newStats.followerCount} followers`);
      return true;
    } catch (error) {
      console.error(`Error updating user stats for ${username}:`, error);
      return false;
    }
  }

  /**
   * Get all active users for daily updates
   */
  async getActiveTrackedUsers() {
    const { data, error } = await this.supabase
      .from('tracked_users')
      .select('id, username, instagram_id')
      .eq('is_active', true)
      .order('last_updated_at', { ascending: true }); // Oldest first for fairness

    if (error) {
      console.error('Error fetching active users:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get follower history for charts
   */
  async getFollowerHistory(username: string, days: number = 30) {
    const { data, error } = await this.supabase
      .from('follower_history')
      .select(`
        recorded_at,
        follower_count,
        following_count,
        media_count,
        tracked_users!inner(username)
      `)
      .eq('tracked_users.username', username)
      .gte('recorded_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('recorded_at', { ascending: true });

    if (error) {
      console.error('Error fetching follower history:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Calculate growth statistics
   */
  async getGrowthStats(username: string) {
    try {
      const history = await this.getFollowerHistory(username, 30);
      
      if (history.length < 2) return null;
      
      const latest = history[history.length - 1];
      const previous = history[history.length - 2];
      const oldest = history[0];
      
      return {
        current: latest.follower_count,
        dailyChange: latest.follower_count - previous.follower_count,
        totalChange: latest.follower_count - oldest.follower_count,
        growthRate: oldest.follower_count > 0 
          ? ((latest.follower_count - oldest.follower_count) / oldest.follower_count) * 100 
          : 0,
        daysTracked: history.length
      };
    } catch (error) {
      console.error('Error calculating growth stats:', error);
      return null;
    }
  }

  /**
   * Daily batch update - fetch latest stats for all active users
   */
  async performDailyUpdate() {
    const activeUsers = await this.getActiveTrackedUsers();
    console.log(`Starting daily update for ${activeUsers.length} users`);
    
    let successCount = 0;
    let errorCount = 0;

    for (const user of activeUsers) {
      try {
        // Add delay between API calls to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));

        const response = await fetch(
          `https://social-api4.p.rapidapi.com/v1/info?username_or_id_or_url=${user.username}&url_embed_safe=true`,
          {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
              'X-RapidAPI-Host': 'social-api4.p.rapidapi.com',
            },
          }
        );

        if (response.ok) {
          const apiData = await response.json();
          
          if (apiData.data) {
            const data = apiData.data;
            
            await this.updateUserStats(user.username, {
              followerCount: data.follower_count || 0,
              followingCount: data.following_count || 0,
              mediaCount: data.media_count || 0,
              profilePicUrl: data.hd_profile_pic_url_info?.url || data.profile_pic_url_hd || data.profile_pic_url,
              biography: data.biography
            });
            
            successCount++;
          }
        } else {
          console.error(`Failed to update ${user.username}: API responded with ${response.status}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error updating ${user.username}:`, error);
        errorCount++;
      }
    }

    console.log(`Daily update completed: ${successCount} successful, ${errorCount} errors`);
    return { successCount, errorCount, totalUsers: activeUsers.length };
  }
} 