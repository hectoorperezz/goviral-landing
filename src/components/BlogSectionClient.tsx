"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { trackClick } from '@/lib/analytics';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featured_image: string | null;
  category: string | null;
  view_count: number;
}

export default function BlogSectionClient() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blog/latest?limit=3');
        if (response.ok) {
          const posts = await response.json();
          setBlogPosts(posts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Helper function to get category display info
  const getCategoryInfo = (category: string | null) => {
    switch(category) {
      case 'instagram-growth':
        return { name: 'Instagram Growth', bgColor: 'bg-purple-100', textColor: 'text-purple-700' };
      case 'engagement':
      case 'engagement-tips':
        return { name: 'Engagement', bgColor: 'bg-pink-100', textColor: 'text-pink-700' };
      case 'content-creation':
        return { name: 'Content Creation', bgColor: 'bg-orange-100', textColor: 'text-orange-700' };
      case 'social-media-marketing':
        return { name: 'SMM Strategies', bgColor: 'bg-green-100', textColor: 'text-green-700' };
      case 'algorithm':
        return { name: 'Algoritmos & SEO', bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
      default:
        return { name: 'Blog', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
    }
  };

  if (loading) {
    return (
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-white to-[#f5f5f7] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[rgb(214,77,173)] mx-auto"></div>
            <p className="mt-4 text-gray-500">Cargando artículos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-white to-[#f5f5f7] relative overflow-hidden">
      {/* Background Elements */}
      <div className="hidden md:block absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-30 rounded-full blur-3xl"></div>
      <div className="hidden md:block absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 transition-all duration-300 hover:scale-105">
            🚀 APRENDE ESTRATEGIAS AVANZADAS
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight px-4">
            Descubre nuestro{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
              Blog
            </span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light px-4">
            Estrategias probadas, consejos de expertos y las últimas tendencias en redes sociales.
            Todo lo que necesitas para hacer crecer tu presencia digital.
          </p>
          <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-6 sm:mt-8 mx-auto"></div>
        </div>

        {/* Featured Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-12">
          {blogPosts.map((post, index) => {
            const categoryInfo = getCategoryInfo(post.category);

            return (
              <div key={post.id} className="group bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] hover:translate-y-[-4px] transition-all duration-300">
                <div className="aspect-video bg-gray-100 overflow-hidden relative">
                  {post.featured_image ? (
                    <Image
                      src={post.featured_image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[rgb(214,77,173)] to-[rgb(244,102,110)] flex items-center justify-center">
                      <span className="text-4xl">📱</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 ${categoryInfo.bgColor} ${categoryInfo.textColor} text-xs font-medium rounded-full`}>
                      {categoryInfo.name}
                    </span>
                    <span className="text-gray-500 text-xs">5 min</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-[rgb(214,77,173)] transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt || 'Descubre las últimas estrategias y consejos para hacer crecer tu presencia en redes sociales.'}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/blog/${post.slug}`}
                      onClick={() => trackClick(`click_blog_article_${post.slug}`)}
                      className="text-[rgb(214,77,173)] font-medium text-sm hover:text-[rgb(194,57,153)] transition-colors flex items-center"
                    >
                      Leer artículo
                      <svg className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                    <div className="flex items-center text-gray-500 text-xs">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {post.view_count} vistas
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Simple CTA */}
        <div className="text-center">
          <Link
            href="/blog"
            onClick={() => trackClick("click_blog_cta_main")}
            className="inline-flex items-center bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white px-8 py-3.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Ver más artículos
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
} 