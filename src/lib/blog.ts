import { supabase } from './supabase';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  seo_title: string | null;
  meta_description: string | null;
  keywords: string[] | null;
  category: string | null;
  published_at: string | null;
  view_count: number;
  created_at: string;
  category_info?: BlogCategory;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface BlogPostsResponse {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
}

// Get all published blog posts with pagination
export async function getBlogPosts(
  page: number = 1,
  limit: number = 10,
  categorySlug?: string
): Promise<BlogPostsResponse> {
  try {
    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .not('published_at', 'is', null)
      .order('published_at', { ascending: false });

    // Filter by category if provided - use flexible matching
    if (categorySlug) {
      if (categorySlug === 'engagement') {
        // Include both 'engagement' and 'engagement-tips'
        query = query.or('category.eq.engagement,category.eq.engagement-tips');
      } else {
        query = query.eq('category', categorySlug);
      }
    }

    // Get paginated results
    const { data: posts, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }

    return {
      posts: posts || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error) {
    console.error('Error in getBlogPosts:', error);
    throw error;
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data: post, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .not('published_at', 'is', null)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Post not found
        return null;
      }
      console.error('Error fetching blog post:', error);
      throw error;
    }

    // Increment view count
    await incrementViewCount(post.id);

    return post;
  } catch (error) {
    console.error('Error in getBlogPostBySlug:', error);
    throw error;
  }
}

// Get featured/latest blog posts for homepage
export async function getFeaturedBlogPosts(limit: number = 3, sortBy: 'views' | 'recent' = 'recent'): Promise<BlogPost[]> {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .not('published_at', 'is', null);

    // Apply sorting based on preference
    if (sortBy === 'views') {
      query = query
        .order('view_count', { ascending: false })
        .order('published_at', { ascending: false });
    } else {
      // Sort by most recent first
      query = query.order('published_at', { ascending: false });
    }

    const { data: posts, error } = await query.limit(limit);

    if (error) {
      console.error('Error fetching featured blog posts:', error);
      throw error;
    }

    return posts || [];
  } catch (error) {
    console.error('Error in getFeaturedBlogPosts:', error);
    throw error;
  }
}

// Get all blog categories
export async function getBlogCategories(): Promise<BlogCategory[]> {
  try {
    const { data: categories, error } = await supabase
      .from('blog_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }

    return categories || [];
  } catch (error) {
    console.error('Error in getBlogCategories:', error);
    throw error;
  }
}

// Get related posts based on category
export async function getRelatedPosts(
  currentPostId: string,
  category: string | null,
  limit: number = 3
): Promise<BlogPost[]> {
  try {
    let query = supabase
      .from('blog_posts')
      .select('*')
      .not('published_at', 'is', null)
      .neq('id', currentPostId)
      .limit(limit);

    // Prefer posts from the same category
    if (category) {
      query = query.eq('category', category);
    }

    const { data: posts, error } = await query
      .order('published_at', { ascending: false });

    if (error) {
      console.error('Error fetching related posts:', error);
      throw error;
    }

    return posts || [];
  } catch (error) {
    console.error('Error in getRelatedPosts:', error);
    throw error;
  }
}

// Search blog posts
export async function searchBlogPosts(
  searchQuery: string,
  page: number = 1,
  limit: number = 10
): Promise<BlogPostsResponse> {
  try {
    const offset = (page - 1) * limit;
    
    const { data: posts, error, count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .not('published_at', 'is', null)
      .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error searching blog posts:', error);
      throw error;
    }

    return {
      posts: posts || [],
      total: count || 0,
      page,
      totalPages: Math.ceil((count || 0) / limit)
    };
  } catch (error) {
    console.error('Error in searchBlogPosts:', error);
    throw error;
  }
}

// Increment view count for a blog post
export async function incrementViewCount(postId: string): Promise<void> {
  try {
    // Get current view count first
    const { data: currentPost, error: fetchError } = await supabase
      .from('blog_posts')
      .select('view_count')
      .eq('id', postId)
      .single();

    if (fetchError || !currentPost) {
      console.error('Error fetching current view count:', fetchError);
      return;
    }

    // Update with incremented view count
    const { error } = await supabase
      .from('blog_posts')
      .update({ view_count: (currentPost.view_count || 0) + 1 })
      .eq('id', postId);

    if (error) {
      console.error('Error incrementing view count:', error);
      // Don't throw error for view count, it's not critical
    }
  } catch (error) {
    console.error('Error in incrementViewCount:', error);
    // Don't throw error for view count, it's not critical
  }
}

// Get blog statistics for dashboard/homepage
export async function getBlogStats(): Promise<{
  totalPosts: number;
  totalViews: number;
  totalCategories: number;
}> {
  try {
    const { data: stats, error } = await supabase
      .from('blog_posts')
      .select('view_count')
      .not('published_at', 'is', null);

    const { data: categories, error: categoriesError } = await supabase
      .from('blog_categories')
      .select('id');

    if (error || categoriesError) {
      console.error('Error fetching blog stats:', error || categoriesError);
      throw error || categoriesError;
    }

    const totalPosts = stats?.length || 0;
    const totalViews = stats?.reduce((sum, post) => sum + (post.view_count || 0), 0) || 0;
    const totalCategories = categories?.length || 0;

    return {
      totalPosts,
      totalViews,
      totalCategories
    };
  } catch (error) {
    console.error('Error in getBlogStats:', error);
    throw error;
  }
}

// Simple markdown parser for content rendering
export function parseMarkdownContent(content: string): string {
  return content
    // Headers
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-semibold text-gray-900 mb-3 mt-6">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold text-gray-900 mb-4 mt-8">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold text-gray-900 mb-6 mt-8">$1</h1>')
    
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
    
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[rgb(214,77,173)] hover:text-[rgb(194,57,153)] underline font-medium">$1</a>')
    
    // Lists
    .replace(/^- (.*$)/gm, '<li class="mb-2">$1</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="mb-2 ml-4">$2</li>')
    .replace(/^- \[ \] (.*$)/gm, '<li class="flex items-center mb-2"><input type="checkbox" class="mr-2 text-[rgb(214,77,173)]" disabled> $1</li>')
    .replace(/^- \[x\] (.*$)/gm, '<li class="flex items-center mb-2"><input type="checkbox" class="mr-2 text-[rgb(214,77,173)]" checked disabled> $1</li>')
    
    // Blockquotes
    .replace(/^> \*\*(.*?)\*\*(.*$)/gm, '<div class="bg-blue-50 border-l-4 border-blue-400 p-4 my-4"><p class="text-blue-800"><strong>$1</strong>$2</p></div>')
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-600">$1</blockquote>')
    
    // Paragraphs
    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
    .replace(/^(?!<[h|l|d|b])(.*$)/gm, '<p class="mb-4 text-gray-700 leading-relaxed">$1</p>');
} 