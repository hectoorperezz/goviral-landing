import { NextRequest, NextResponse } from 'next/server';
import { getFeaturedBlogPosts } from '@/lib/blog';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3', 10);
    
    const posts = await getFeaturedBlogPosts(limit, 'recent');
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching latest blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
} 