import Link from 'next/link';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBlogPostBySlug, getRelatedPosts, parseMarkdownContent } from '@/lib/blog';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Get related posts
  const relatedPosts = await getRelatedPosts(post.id, post.category, 3);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#fbfbfd]">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden bg-gradient-to-b from-white to-[#f5f5f7]">
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <ol className="flex items-center space-x-2 text-sm text-gray-500">
                <li><Link href="/" className="hover:text-[rgb(214,77,173)]">Inicio</Link></li>
                <li>/</li>
                <li><Link href="/blog" className="hover:text-[rgb(214,77,173)]">Blog</Link></li>
                <li>/</li>
                <li className="text-gray-900">{post.category || 'Artículo'}</li>
              </ol>
            </nav>

            {/* Post Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className="px-3 py-1 bg-[rgb(214,77,173)]/10 text-[rgb(214,77,173)] text-sm font-medium rounded-full">
                  {post.category || 'Blog'}
                </span>
                <span className="text-gray-500 text-sm">{formatDate(post.published_at || post.created_at)}</span>
                <span className="text-gray-500 text-sm">• 5 min</span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 mb-6">
                {post.title}
              </h1>
              
              <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                {post.excerpt}
              </p>

              {/* Post Stats */}
              <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {post.view_count} vistas
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  5 min de lectura
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featured_image ? (
              <div className="aspect-video bg-gray-100 rounded-2xl overflow-hidden mb-12">
                <img 
                  src={post.featured_image} 
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="aspect-video bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-2xl flex items-center justify-center mb-12">
                <span className="text-6xl">📱</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
              
              {/* Main Content */}
              <div className="lg:col-span-3">
                <article className="prose prose-lg max-w-none">
                  <div 
                    className="content text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: parseMarkdownContent(post.content) }}
                  />
                </article>

                {/* Tags */}
                {post.keywords && post.keywords.length > 0 && (
                  <div className="mt-12 pt-8 border-t border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Palabras clave</h4>
                    <div className="flex flex-wrap gap-2">
                      {post.keywords.map((keyword: string) => (
                        <span 
                          key={keyword}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-6">
                  
                  {/* Tools Promotion */}
                  <div className="bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-xl p-6 text-white">
                    <h3 className="text-lg font-semibold mb-2 text-white">🛠️ Herramientas Útiles</h3>
                    <p className="text-sm opacity-90 mb-4 text-white">
                      Herramientas mencionadas en este artículo
                    </p>
                    <div className="space-y-3">
                      <Link href="/tools/instagram-hashtag-analyzer" className="block bg-white/20 rounded-lg p-3 hover:bg-white/30 transition-colors">
                        <div className="text-sm font-medium text-white">Analizador de Hashtags</div>
                        <div className="text-xs opacity-80 text-white">IA + datos en tiempo real</div>
                      </Link>
                      <Link href="/tools/instagram-bio-generator" className="block bg-white/20 rounded-lg p-3 hover:bg-white/30 transition-colors">
                        <div className="text-sm font-medium text-white">Generador de Bio</div>
                        <div className="text-xs opacity-80 text-white">5 estilos optimizados</div>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Artículos Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    {relatedPost.featured_image ? (
                      <div className="aspect-video bg-gray-100 overflow-hidden">
                        <img 
                          src={relatedPost.featured_image} 
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] flex items-center justify-center">
                        <span className="text-2xl">📊</span>
                      </div>
                    )}
                    <div className="p-4">
                                              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                          <Link href={`/blog/${relatedPost.slug}`} className="text-[rgb(214,77,173)] hover:text-[rgb(194,57,153)] transition-colors">
                            {relatedPost.title}
                          </Link>
                        </h3>
                      <Link 
                        href={`/blog/${relatedPost.slug}`}
                        className="text-[rgb(214,77,173)] font-medium text-sm hover:text-[rgb(194,57,153)] transition-colors"
                      >
                        Leer artículo →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getBlogPostBySlug(resolvedParams.slug);
  
  if (!post) {
    return {
      title: 'Artículo no encontrado',
      description: 'El artículo que buscas no existe.'
    };
  }

  return {
    title: post.seo_title || post.title,
    description: post.meta_description || post.excerpt,
    keywords: post.keywords?.join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt || '',
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      tags: post.keywords || []
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || ''
    }
  };
} 