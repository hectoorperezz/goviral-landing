// GoViral Hashtag Analyzer - Simplified Version (No Database)
// Pure AI + Instagram API integration

import OpenAI from 'openai';

// ===============================================
// TYPES & INTERFACES
// ===============================================

interface ContentContext {
  contentType: string;
  targetAudience: string;
  contentDescription: string;
  goal?: 'engagement' | 'sales' | 'awareness' | 'community';
  industry?: string;
}

interface HashtagData {
  hashtag: string;
  totalPosts: number;
  formattedCount: string;
  isTrending: boolean;
  avgLikes: number;
  avgComments: number;
  difficultyScore: number;
  opportunityScore: number;
  performanceTier: 'high' | 'medium' | 'low' | 'niche';
}

interface HashtagAnalysisResult {
  generatedHashtags: string[];
  analyzedHashtags: HashtagData[];
  recommendedMix: {
    broad: string[];
    medium: string[];
    niche: string[];
  };
  strategicRecommendations: {
    mixStrategy: string;
    successProbability: number;
    expectedReachMin: number;
    expectedReachMax: number;
    postingTips: string[];
    difficultyBreakdown: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
  lastAnalyzedAt: string;
}

interface InstagramPostData {
  like_count: number;
  comment_count: number;
  taken_at: number;
  code?: string;
}

// ===============================================
// SIMPLIFIED HASHTAG ANALYZER SERVICE
// ===============================================

export class SimpleHashtagAnalyzerService {
  private _openai: OpenAI | null = null;
  
  private get openai(): OpenAI {
    if (!this._openai) {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is required');
      }
      this._openai = new OpenAI({ apiKey });
    }
    return this._openai;
  }

  /**
   * Main entry point: Generate and analyze hashtags for content
   */
  async analyzeContentHashtags(context: ContentContext): Promise<HashtagAnalysisResult | null> {
    try {
      console.log(`🚀 Starting hashtag analysis for content: ${context.contentDescription}`);
      
      // Step 1: Generate hashtags with OpenAI
      const generatedHashtags = await this.generateHashtagsWithAI(context);
      
      if (!generatedHashtags || generatedHashtags.length === 0) {
        throw new Error('Failed to generate hashtags with AI');
      }

      // Step 2: Analyze each hashtag with Instagram data
      const analyzedHashtags = await this.analyzeHashtags(generatedHashtags);
      
      // Step 3: Create strategic recommendations
      const recommendations = this.generateStrategicRecommendations(analyzedHashtags, context);
      
      // Step 4: Return results
      const result: HashtagAnalysisResult = {
        generatedHashtags,
        analyzedHashtags,
        recommendedMix: recommendations.recommendedMix,
        strategicRecommendations: recommendations.strategicRecommendations,
        lastAnalyzedAt: new Date().toISOString()
      };
      
      console.log('✅ Hashtag analysis complete');
      return result;

    } catch (error) {
      console.error('❌ Error in hashtag analysis:', error);
      return null;
    }
  }

  /**
   * Generate hashtags using OpenAI based on content context
   */
  async generateHashtagsWithAI(context: ContentContext): Promise<string[]> {
    console.log('🤖 Generating hashtags with OpenAI...');
    
    const prompt = this.buildOpenAIPrompt(context);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en marketing de Instagram y generación de hashtags. Generas hashtags estratégicos y efectivos en español e inglés.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }

      // Parse hashtags from response
      const hashtags = this.parseHashtagsFromResponse(content);
      
      console.log(`📝 Generated ${hashtags.length} hashtags:`, hashtags);
      return hashtags;

    } catch (error) {
      console.error('❌ OpenAI API error:', error);
      throw error;
    }
  }

  /**
   * Analyze multiple hashtags with Instagram data
   */
  private async analyzeHashtags(hashtags: string[]): Promise<HashtagData[]> {
    console.log(`📊 Analyzing ${hashtags.length} hashtags with Instagram data...`);
    
    const results: HashtagData[] = [];
    
    for (const hashtag of hashtags) {
      try {
        console.log(`🔍 Fetching data for #${hashtag}`);
        const instagramData = await this.fetchHashtagFromInstagram(hashtag);
        
        if (instagramData) {
          results.push(instagramData);
        }

        // Rate limiting delay (1 second between calls)
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`❌ Error analyzing hashtag #${hashtag}:`, error);
        // Continue with other hashtags
      }
    }
    
    console.log(`✅ Successfully analyzed ${results.length}/${hashtags.length} hashtags`);
    return results;
  }

  /**
   * Analyze multiple hashtags with Instagram data and progress callback
   */
  async analyzeHashtagsWithProgress(
    hashtags: string[], 
    progressCallback: (current: number, total: number, currentHashtag: string) => void
  ): Promise<HashtagData[]> {
    console.log(`📊 Analyzing ${hashtags.length} hashtags with Instagram data and progress updates...`);
    
    const results: HashtagData[] = [];
    
    for (let i = 0; i < hashtags.length; i++) {
      const hashtag = hashtags[i];
      
      try {
        console.log(`🔍 Fetching data for #${hashtag} (${i + 1}/${hashtags.length})`);
        
        // Call progress callback before fetching
        progressCallback(i, hashtags.length, hashtag);
        
        const instagramData = await this.fetchHashtagFromInstagram(hashtag);
        
        if (instagramData) {
          results.push(instagramData);
        }

        // Call progress callback after fetching
        progressCallback(i + 1, hashtags.length, hashtag);

        // Rate limiting delay (1 second between calls) - except for last item
        if (i < hashtags.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (error) {
        console.error(`❌ Error analyzing hashtag #${hashtag}:`, error);
        // Continue with other hashtags
        progressCallback(i + 1, hashtags.length, hashtag);
      }
    }
    
    console.log(`✅ Successfully analyzed ${results.length}/${hashtags.length} hashtags with progress`);
    return results;
  }

  /**
   * Fetch hashtag data from Instagram API
   */
  private async fetchHashtagFromInstagram(hashtag: string): Promise<HashtagData | null> {
    try {
      const response = await fetch(
        `https://social-api4.p.rapidapi.com/v1/hashtag?hashtag=${hashtag}&feed_type=top&url_embed_safe=true`,
        {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
            'X-RapidAPI-Host': 'social-api4.p.rapidapi.com',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Instagram API failed: ${response.status}`);
      }

      const data = await response.json();
      
      // Extract metadata
      const additional_data = data.data?.additional_data || {};
      const items: InstagramPostData[] = data.data?.items || [];
      
      // Calculate engagement metrics
      const { avgLikes, avgComments } = this.calculateEngagementMetrics(items);
      
      // Calculate difficulty and opportunity scores
      const difficultyScore = this.calculateDifficultyScore(additional_data.media_count, avgLikes);
      const opportunityScore = this.calculateOpportunityScore(avgLikes, avgComments, additional_data.media_count);
      const performanceTier = this.determinePerformanceTier(additional_data.media_count, avgLikes);

      const hashtagData: HashtagData = {
        hashtag,
        totalPosts: additional_data.media_count || 0,
        formattedCount: additional_data.formatted_media_count || '0',
        isTrending: additional_data.is_trending || false,
        avgLikes,
        avgComments,
        difficultyScore,
        opportunityScore,
        performanceTier
      };

      return hashtagData;

    } catch (error) {
      console.error(`❌ Error fetching hashtag data for #${hashtag}:`, error);
      return null;
    }
  }

  /**
   * Generate strategic recommendations based on analyzed hashtags
   */
  generateStrategicRecommendations(
    hashtags: HashtagData[], 
    context: ContentContext
  ) {
    // Sort hashtags by difficulty and performance
    const sortedByDifficulty = [...hashtags].sort((a, b) => a.difficultyScore - b.difficultyScore);
    
    // Create strategic mix
    const recommendedMix = {
      broad: sortedByDifficulty.filter(h => h.performanceTier === 'high').slice(0, 3).map(h => h.hashtag),
      medium: sortedByDifficulty.filter(h => h.performanceTier === 'medium').slice(0, 5).map(h => h.hashtag),
      niche: sortedByDifficulty.filter(h => h.performanceTier === 'low' || h.performanceTier === 'niche').slice(0, 7).map(h => h.hashtag)
    };

    // Calculate average difficulty
    const avgDifficulty = hashtags.reduce((sum, h) => sum + h.difficultyScore, 0) / hashtags.length;
    
    // Calculate success probability
    const successProbability = this.calculateSuccessProbability(avgDifficulty, hashtags.length, 3);
    
    // Estimate reach
    const { reachMin, reachMax } = this.estimateReach(hashtags);
    
    // Generate posting tips
    const postingTips = this.generatePostingTips(hashtags, context);
    
    // Calculate difficulty breakdown
    const difficultyBreakdown = this.calculateDifficultyBreakdown(hashtags);

    return {
      recommendedMix,
      strategicRecommendations: {
        mixStrategy: this.determineMixStrategy(context.goal),
        successProbability,
        expectedReachMin: reachMin,
        expectedReachMax: reachMax,
        postingTips,
        difficultyBreakdown
      }
    };
  }

  // ===============================================
  // CALCULATION METHODS
  // ===============================================

  private calculateEngagementMetrics(posts: InstagramPostData[]) {
    if (posts.length === 0) {
      return { avgLikes: 0, avgComments: 0 };
    }

    const totalLikes = posts.reduce((sum, post) => sum + (post.like_count || 0), 0);
    const totalComments = posts.reduce((sum, post) => sum + (post.comment_count || 0), 0);
    
    return {
      avgLikes: Math.round(totalLikes / posts.length),
      avgComments: Math.round(totalComments / posts.length)
    };
  }

  private calculateDifficultyScore(totalPosts: number, avgLikes: number): number {
    if (!totalPosts || !avgLikes) return 50;
    
    let difficulty = 0;
    
    // Post count factor (0-50 points)
    if (totalPosts > 100000000) difficulty += 50; // 100M+ posts = very hard
    else if (totalPosts > 10000000) difficulty += 40; // 10M+ posts = hard
    else if (totalPosts > 1000000) difficulty += 30; // 1M+ posts = medium-hard
    else if (totalPosts > 100000) difficulty += 20; // 100K+ posts = medium
    else difficulty += 10; // <100K posts = easier
    
    // Engagement factor (0-50 points, inverted - high engagement = easier)
    if (avgLikes < 1000) difficulty += 40; // Low engagement = harder to compete
    else if (avgLikes < 10000) difficulty += 30;
    else if (avgLikes < 100000) difficulty += 20;
    else if (avgLikes < 1000000) difficulty += 10;
    else difficulty += 5; // Very high engagement = easier to get noticed
    
    return Math.min(difficulty, 100);
  }

  private calculateOpportunityScore(avgLikes: number, avgComments: number, totalPosts: number): number {
    const engagement = avgLikes + avgComments;
    const competition = Math.log10(totalPosts + 1);
    return Math.max(0, Math.min(100, (engagement / competition) * 10));
  }

  private determinePerformanceTier(totalPosts: number, avgLikes: number): 'high' | 'medium' | 'low' | 'niche' {
    if (totalPosts > 50000000) return 'high'; // Broad reach
    if (totalPosts > 1000000) return 'medium'; // Medium reach
    if (totalPosts > 100000) return 'low'; // Focused reach
    return 'niche'; // Niche community
  }

  private calculateSuccessProbability(avgDifficulty: number, hashtagCount: number, contentQuality: number = 3): number {
    const baseProbability = 50;
    const difficultyPenalty = avgDifficulty * 0.5;
    const countBonus = Math.min(hashtagCount * 1.5, 45);
    const qualityBonus = (contentQuality - 3) * 10;
    
    return Math.max(5, Math.min(95, baseProbability - difficultyPenalty + countBonus + qualityBonus));
  }

  private estimateReach(hashtags: HashtagData[]) {
    const totalReach = hashtags.reduce((sum, h) => sum + h.avgLikes, 0);
    const reachMin = Math.round(totalReach * 0.1); // Conservative estimate
    const reachMax = Math.round(totalReach * 0.3); // Optimistic estimate
    
    return { reachMin, reachMax };
  }

  private generatePostingTips(hashtags: HashtagData[], context: ContentContext): string[] {
    const tips: string[] = [];
    
    const avgDifficulty = hashtags.reduce((sum, h) => sum + h.difficultyScore, 0) / hashtags.length;
    
    if (avgDifficulty > 70) {
      tips.push('Usa contenido de alta calidad para competir con hashtags populares');
      tips.push('Considera publicar cuando la competencia sea menor (madrugada)');
    }
    
    if (hashtags.some(h => h.isTrending)) {
      tips.push('Aprovecha los hashtags trending para máxima visibilidad');
    }
    
    tips.push('Publica entre 6-8 PM para mejor engagement');
    tips.push('Interactúa con otros posts usando estos hashtags');
    
    return tips;
  }

  private calculateDifficultyBreakdown(hashtags: HashtagData[]) {
    const total = hashtags.length;
    const easy = hashtags.filter(h => h.difficultyScore < 40).length;
    const medium = hashtags.filter(h => h.difficultyScore >= 40 && h.difficultyScore < 70).length;
    const hard = hashtags.filter(h => h.difficultyScore >= 70).length;
    
    return {
      easy: Math.round((easy / total) * 100),
      medium: Math.round((medium / total) * 100),
      hard: Math.round((hard / total) * 100)
    };
  }

  private determineMixStrategy(goal?: string): string {
    switch (goal) {
      case 'sales': return 'conversion-focused';
      case 'awareness': return 'viral-potential';
      case 'community': return 'community-building';
      case 'engagement': return 'engagement-optimized';
      default: return 'balanced';
    }
  }

  // ===============================================
  // HELPER METHODS
  // ===============================================

  private buildOpenAIPrompt(context: ContentContext): string {
    return `
Genera 15 hashtags estratégicos para el siguiente contenido de Instagram:

CONTEXTO:
- Tipo de contenido: ${context.contentType}
- Audiencia objetivo: ${context.targetAudience}
- Descripción del contenido: ${context.contentDescription}
- Objetivo: ${context.goal || 'engagement'}
- Industria: ${context.industry || 'general'}

ESTRUCTURA REQUERIDA:
- 3 hashtags de alto alcance (broad appeal, populares)
- 6 hashtags de alcance medio (niche relevante, específicos)
- 6 hashtags de bajo alcance (comunidad específica, long-tail)

REGLAS:
1. Incluye hashtags en español e inglés según sea relevante
2. Asegúrate de que sean específicos y relevantes al contenido
3. Evita hashtags demasiado genéricos o spam
4. Incluye variaciones y sinónimos
5. Considera hashtags de ubicación si es relevante

FORMATO DE RESPUESTA:
Devuelve solo los hashtags, uno por línea, con el símbolo #
Ejemplo:
#fitness
#workout
#health

HASHTAGS:
`;
  }

  private parseHashtagsFromResponse(content: string): string[] {
    const lines = content.split('\n');
    const hashtags: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('#')) {
        const hashtag = trimmed.substring(1).toLowerCase();
        if (hashtag && !hashtags.includes(hashtag)) {
          hashtags.push(hashtag);
        }
      }
    }
    
    return hashtags.slice(0, 15); // Limit to 15 hashtags
  }
} 