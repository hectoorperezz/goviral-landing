import { createClient } from '@supabase/supabase-js';

// TypeScript interfaces for engagement data
interface InstagramPostData {
  id: string;
  code: string; // Instagram shortcode
  url: string;
  likes_count: number;
  comments_count: number;
  taken_at: string; // ISO timestamp
  image_url?: string; // Post image/thumbnail
  caption?: string; // Post caption/text
  media_type?: number; // 1 = photo, 2 = video, 8 = carousel
}

interface EngagementProfileData {
  id: string;
  username: string;
  follower_count_at_analysis: number;
  avg_likes_last_10: number;
  avg_comments_last_10: number;
  overall_engagement_rate: number;
  last_analyzed_at: string;
  cache_expires_at: string;
}

interface EngagementAnalysisResult {
  current_stats: {
    avg_likes: number;
    avg_comments: number;
    engagement_rate: number;
    follower_count: number;
  };
  individual_posts: Array<{
    post_id: string;
    post_url: string;
    image_url?: string;
    caption?: string;
    media_type?: number;
    likes: number;
    comments: number;
    engagement_rate: number;
    post_date: string;
  }>;
  monthly_history: Array<{
    month: number;
    year: number;
    avg_likes: number;
    avg_comments: number;
    engagement_rate: number;
  }>;
  last_analyzed_at: string;
  cache_expires_at: string;
}

export class EngagementCalculatorService {
  private _supabase: any = null;
  
  private get supabase() {
    if (!this._supabase) {
      const url = process.env.SUPABASE_URL;
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (url && key) {
        this._supabase = createClient(url, key);
      }
    }
    return this._supabase;
  }

  /**
   * Main method - Get engagement analysis for username (always fresh data)
   */
  async analyzeProfile(username: string): Promise<EngagementAnalysisResult | null> {
    try {
      if (!this.supabase) {
        throw new Error('Supabase client not available. Check environment variables.');
      }

      console.log(`🔍 Analyzing ${username} - fetching fresh data from API`);
      
      // ALWAYS perform fresh analysis to build tracking history
      const result = await this.performFullAnalysis(username);
      
      if (result) {
        console.log(`✅ Fresh analysis completed for ${username}: ${result.current_stats.engagement_rate.toFixed(2)}% engagement`);
      }
      
      return result;
      
    } catch (error) {
      console.error('Error analyzing profile:', error);
      return null;
    }
  }

  /**
   * Get cached profile data if available and valid
   */
  private async getCachedProfile(username: string): Promise<EngagementProfileData | null> {
    if (!this.supabase) return null;
    
    const { data, error } = await this.supabase
      .from('engagement_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching cached profile:', error);
      return null;
    }

    return data;
  }

  /**
   * Perform full API analysis - creates new historical record
   */
  async performFullAnalysis(username: string): Promise<EngagementAnalysisResult | null> {
    try {
      console.log(`🔍 Starting fresh analysis for ${username}`);
      
      // Step 1: Get profile info including follower count
      const profileData = await this.fetchProfileInfo(username);
      if (!profileData) {
        throw new Error('Failed to fetch profile information');
      }

      // Step 2: Get last 10 posts
      const postsData = await this.fetchRecentPosts(username);
      if (!postsData || postsData.length === 0) {
        throw new Error('Failed to fetch recent posts');
      }

      // Step 3: Posts already include likes and comments - no additional API calls needed
      const enrichedPosts = postsData;

      // Step 4: Calculate averages and engagement rates
      const analysisData = this.calculateEngagementMetrics(
        enrichedPosts, 
        profileData.follower_count
      );

      // Step 5: Store all data in database (creates new historical record)
      await this.storeAnalysisResults(username, profileData, enrichedPosts, analysisData);

      // Step 6: Build and return the complete analysis result
      return await this.buildAnalysisResult(username);

    } catch (error) {
      console.error(`Full analysis failed for ${username}:`, error);
      return null;
    }
  }

  /**
   * Build complete analysis result from current data
   */
  private async buildAnalysisResult(username: string): Promise<EngagementAnalysisResult> {
    const [profileData, recentPosts, monthlyHistory] = await Promise.all([
      this.getProfileData(username),
      this.getIndividualPosts(username),
      this.getMonthlyTrends(username)
    ]);

    if (!profileData) {
      throw new Error(`No analysis data found for ${username}`);
    }

    return {
      current_stats: {
        avg_likes: profileData.avg_likes_last_10,
        avg_comments: profileData.avg_comments_last_10,
        engagement_rate: profileData.overall_engagement_rate,
        follower_count: profileData.follower_count_at_analysis
      },
      individual_posts: recentPosts.map((post: any) => ({
        post_id: post.post_id,
        post_url: post.post_url,
        image_url: post.image_url,
        caption: post.caption,
        media_type: post.media_type,
        likes: post.likes_count,
        comments: post.comments_count,
        engagement_rate: post.individual_engagement_rate,
        post_date: post.post_date
      })),
      monthly_history: monthlyHistory.map((history: any) => ({
        month: history.snapshot_month,
        year: history.snapshot_year,
        avg_likes: history.avg_likes_last_10,
        avg_comments: history.avg_comments_last_10,
        engagement_rate: history.overall_engagement_rate
      })),
      last_analyzed_at: profileData.last_analyzed_at,
      cache_expires_at: profileData.cache_expires_at
    };
  }

  /**
   * Get profile data from engagement_profiles table
   */
  async getProfileData(username: string) {
    const { data, error } = await this.supabase
      .from('engagement_profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching profile data:', error);
      return null;
    }

    return data;
  }

  /**
   * Get individual posts for a profile
   */
  async getIndividualPosts(username: string) {
    const { data, error } = await this.supabase
      .from('individual_posts')
      .select(`
        id,
        post_id,
        post_url,
        image_url,
        caption,
        media_type,
        likes_count,
        comments_count,
        individual_engagement_rate,
        post_date,
        engagement_profiles!inner(username)
      `)
      .eq('engagement_profiles.username', username)
      .order('post_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching individual posts:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get monthly trends for charts
   */
  async getMonthlyTrends(username: string) {
    const { data, error } = await this.supabase
      .from('monthly_engagement_history')
      .select(`
        *,
        engagement_profiles!inner(username)
      `)
      .eq('engagement_profiles.username', username)
      .order('snapshot_year', { ascending: true })
      .order('snapshot_month', { ascending: true });

    if (error) {
      console.error('Error fetching monthly trends:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Fetch profile info from Social API4
   */
  private async fetchProfileInfo(username: string) {
    console.log(`Fetching profile info for ${username}`);
    
    const response = await fetch(
      `https://social-api4.p.rapidapi.com/v1/info?username_or_id_or_url=${username}&url_embed_safe=true`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'social-api4.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Profile API failed: ${response.status}`);
    }

    const apiData = await response.json();
    if (!apiData.data) {
      throw new Error('Invalid profile API response');
    }

    return {
      id: apiData.data.pk || apiData.data.id,
      username: apiData.data.username,
      follower_count: apiData.data.follower_count || 0,
      following_count: apiData.data.following_count || 0,
      profile_pic_url: apiData.data.hd_profile_pic_url_info?.url || apiData.data.profile_pic_url
    };
  }

  /**
   * Fetch recent posts from Social API4
   */
  private async fetchRecentPosts(username: string): Promise<InstagramPostData[]> {
    console.log(`Fetching recent posts for ${username}`);
    
    const apiUrl = `https://social-api4.p.rapidapi.com/v1/posts?username_or_id_or_url=${username}&url_embed_safe=true`;
    console.log('Posts API URL:', apiUrl);
    
    const response = await fetch(
      apiUrl,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'social-api4.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Posts API failed: ${response.status}`);
    }

    const apiData = await response.json();
    console.log('Posts API response structure - checking root properties:', Object.keys(apiData));
    
    // Handle different response structures
    let postsArray = [];
    if (apiData.data && apiData.data.items && Array.isArray(apiData.data.items)) {
      // Social API4 format: { data: { items: [...] } }
      postsArray = apiData.data.items;
      console.log('Using data.items array (Social API4 format)');
    } else if (Array.isArray(apiData)) {
      // Direct array response
      postsArray = apiData;
      console.log('Using direct array response');
    } else if (apiData.data && Array.isArray(apiData.data)) {
      // Nested under data property
      postsArray = apiData.data;
      console.log('Using data property array');
    } else if (apiData.items && Array.isArray(apiData.items)) {
      // Nested under items property
      postsArray = apiData.items;
      console.log('Using items property array');
    } else if (apiData.user && apiData.user.posts && Array.isArray(apiData.user.posts)) {
      // Nested under user.posts
      postsArray = apiData.user.posts;
      console.log('Using user.posts array');
    } else if (apiData.user && Array.isArray(apiData.user)) {
      // User array format
      postsArray = apiData.user;
      console.log('Using user array');
    } else {
      console.error('Unexpected posts API response structure. Available keys:', Object.keys(apiData));
      console.error('API Response sample:', JSON.stringify(apiData).substring(0, 500) + '...');
      throw new Error(`Invalid posts API response format. Available keys: ${Object.keys(apiData).join(', ')}`);
    }

    // Take only the first 10 posts and extract all available data
    return postsArray.slice(0, 10).map((post: any) => {
      console.log(`Post ${post.code}: ${post.like_count || 0} likes, ${post.comment_count || 0} comments`);
      
      // Extract image URL (try different possible fields)
      let imageUrl = '';
      if (post.image_versions2?.candidates?.length > 0) {
        imageUrl = post.image_versions2.candidates[0].url;
      } else if (post.thumbnail_url) {
        imageUrl = post.thumbnail_url;
      } else if (post.display_url) {
        imageUrl = post.display_url;
      }
      
      // Extract caption
      let caption = '';
      if (post.caption?.text) {
        caption = post.caption.text;
      } else if (post.edge_media_to_caption?.edges?.length > 0) {
        caption = post.edge_media_to_caption.edges[0].node.text;
      }
      
      return {
        id: post.pk || post.id,
        code: post.code,
        url: `https://www.instagram.com/p/${post.code}/`,
        likes_count: post.like_count || 0,
        comments_count: post.comment_count || 0,
        taken_at: new Date(post.taken_at * 1000).toISOString(),
        image_url: imageUrl,
        caption: caption ? caption.substring(0, 150) + (caption.length > 150 ? '...' : '') : '',
        media_type: post.media_type || 1
      };
    });
  }

  /**
   * Enrich posts with likes and comments data (20 API calls)
   */
  private async enrichPostsWithEngagement(posts: InstagramPostData[]): Promise<InstagramPostData[]> {
    console.log(`Enriching ${posts.length} posts with engagement data`);
    
    const enrichedPosts = [];
    
    for (const post of posts) {
      try {
        // Add delay to respect rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Fetch likes and comments in parallel for efficiency
        const [likesData, commentsData] = await Promise.all([
          this.fetchPostLikes(post.code),
          this.fetchPostComments(post.code)
        ]);
        
        enrichedPosts.push({
          ...post,
          likes_count: likesData.count,
          comments_count: commentsData.count
        });
        
        console.log(`Post ${post.code}: ${likesData.count} likes, ${commentsData.count} comments`);
        
      } catch (error) {
        console.error(`Failed to enrich post ${post.code}:`, error);
        // Include post with 0 counts rather than failing completely
        enrichedPosts.push({
          ...post,
          likes_count: 0,
          comments_count: 0
        });
      }
    }
    
    return enrichedPosts;
  }

  /**
   * Fetch likes count for a specific post
   */
  private async fetchPostLikes(postCode: string) {
    const response = await fetch(
      `https://social-api4.p.rapidapi.com/v1/likes?code_or_id_or_url=${postCode}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'social-api4.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Likes API failed for ${postCode}: ${response.status}`);
    }

    const data = await response.json();
    return { count: data.data?.length || 0 };
  }

  /**
   * Fetch comments count for a specific post
   */
  private async fetchPostComments(postCode: string) {
    const response = await fetch(
      `https://social-api4.p.rapidapi.com/v1/comments?code_or_id_or_url=${postCode}`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'social-api4.p.rapidapi.com',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Comments API failed for ${postCode}: ${response.status}`);
    }

    const data = await response.json();
    return { count: data.data?.length || 0 };
  }

  /**
   * Calculate engagement metrics from posts and follower count
   */
  private calculateEngagementMetrics(posts: InstagramPostData[], followerCount: number) {
    const totalLikes = posts.reduce((sum, post) => sum + post.likes_count, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments_count, 0);
    
    const avgLikes = posts.length > 0 ? totalLikes / posts.length : 0;
    const avgComments = posts.length > 0 ? totalComments / posts.length : 0;
    const engagementRate = followerCount > 0 ? ((avgLikes + avgComments) / followerCount) * 100 : 0;

    return {
      avg_likes_last_10: avgLikes,
      avg_comments_last_10: avgComments,
      overall_engagement_rate: engagementRate
    };
  }

  /**
   * Store analysis results in database (optimized approach)
   */
  private async storeAnalysisResults(
    username: string,
    profileData: any,
    posts: InstagramPostData[],
    analysisData: any
  ): Promise<void> {
    try {
      console.log(`📊 Updating engagement data for ${username}`);
      
      // STEP 1: Upsert engagement profile (always fresh data)
      const { data: profile, error: profileError } = await this.supabase
        .from('engagement_profiles')
        .upsert({
          username,
          follower_count_at_analysis: profileData.follower_count || 0,
          avg_likes_last_10: analysisData.avg_likes_last_10,
          avg_comments_last_10: analysisData.avg_comments_last_10,
          overall_engagement_rate: analysisData.overall_engagement_rate,
          last_analyzed_at: new Date().toISOString(),
          cache_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days (unused but kept for compatibility)
        }, { 
          onConflict: 'username',
          ignoreDuplicates: false 
        })
        .select()
        .single();

      if (profileError) {
        throw profileError;
      }

      // STEP 2: Replace individual posts for this profile
      await this.supabase
        .from('individual_posts')
        .delete()
        .eq('profile_id', profile.id);

      const postsToInsert = posts.map(post => ({
        profile_id: profile.id,
        post_id: post.id,
        post_url: post.url,
        image_url: post.image_url || null,
        caption: post.caption || null,
        media_type: post.media_type || 1,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        individual_engagement_rate: profileData.follower_count > 0 
          ? ((post.likes_count + post.comments_count) / profileData.follower_count) * 100 
          : 0,
        post_date: post.taken_at,
        analyzed_at: new Date().toISOString()
      }));

      const { error: postsError } = await this.supabase
        .from('individual_posts')
        .insert(postsToInsert);

      if (postsError) {
        throw postsError;
      }

      // STEP 3: Add monthly snapshot only if >30 days since last record
      await this.addMonthlySnapshotIfNeeded(profile.id, profileData, analysisData, posts.length);

      console.log(`✅ Successfully updated engagement data for ${username} with ${posts.length} posts`);
      
    } catch (error) {
      console.error('Error storing analysis results:', error);
      throw error;
    }
  }

  /**
   * Add monthly snapshot only if more than 30 days have passed
   */
  private async addMonthlySnapshotIfNeeded(
    profileId: string, 
    profileData: any, 
    analysisData: any, 
    postsCount: number
  ) {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      // Check if there's a recent snapshot (within 30 days)
      const { data: recentSnapshot, error: checkError } = await this.supabase
        .from('monthly_engagement_history')
        .select('created_at')
        .eq('profile_id', profileId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .limit(1)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      // If no recent snapshot, create new monthly record
      if (!recentSnapshot) {
        const { error: historyError } = await this.supabase
        .from('monthly_engagement_history')
        .upsert({
            profile_id: profileId,
          snapshot_month: now.getMonth() + 1,
          snapshot_year: now.getFullYear(),
          avg_likes_last_10: analysisData.avg_likes_last_10,
          avg_comments_last_10: analysisData.avg_comments_last_10,
          overall_engagement_rate: analysisData.overall_engagement_rate,
            follower_count_at_snapshot: profileData.follower_count || 0,
            posts_analyzed_count: postsCount
        }, {
          onConflict: 'profile_id,snapshot_month,snapshot_year',
          ignoreDuplicates: false
        });

      if (historyError) {
        throw historyError;
      }

        console.log(`📈 Added monthly snapshot for profile ${profileId}`);
      } else {
        console.log(`⏭️ Skipping monthly snapshot - recent record exists for profile ${profileId}`);
      }
      
    } catch (error) {
      console.error('Error adding monthly snapshot:', error);
      // Don't throw - monthly snapshot is nice-to-have, not critical
    }
  }
} 