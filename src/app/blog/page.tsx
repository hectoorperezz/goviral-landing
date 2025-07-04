import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getBlogPosts, getBlogCategories, getBlogStats } from '@/lib/blog';

interface BlogPageProps {
  searchParams?: {
    category?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams;
  const categoryFilter = resolvedSearchParams?.category;
  
  // Fetch data from Supabase
  const [{ posts: blogPosts }, categories, stats] = await Promise.all([
    getBlogPosts(1, 10, categoryFilter),
    getBlogCategories(),
    getBlogStats()
  ]);

  // Function to count posts by category
  const getPostCountByCategory = async (category: string) => {
    const { posts } = await getBlogPosts(1, 1000, category); // Get all posts for counting
    return posts.length;
  };

  // Get counts for each category
  const [
    instagramGrowthCount,
    engagementCount,
    algorithmCount,
    contentCreationCount,
    smmCount
  ] = await Promise.all([
    getPostCountByCategory('instagram-growth'),
    getPostCountByCategory('engagement'),
    getPostCountByCategory('algorithm'),
    getPostCountByCategory('content-creation'),
    getPostCountByCategory('social-media-marketing')
  ]);

  // Format published dates
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
      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white to-[#f5f5f7]">
        {/* Background Elements */}
        <div className="absolute top-20 sm:top-20 -left-20 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-40 sm:opacity-50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 sm:bottom-20 -right-20 sm:right-10 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-40 sm:opacity-50 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 transition-all duration-300 hover:scale-105">
                Blog de Marketing Digital
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-4 sm:mb-6 px-2">
                Estrategias de{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] via-[rgb(244,102,110)] to-[rgb(214,77,173)] animate-gradient-x font-extrabold">
                  Redes Sociales
                </span>
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 px-4">
              {categoryFilter ? (
                                  <>
                  Mostrando artículos de{" "}
                  <span className="text-[rgb(214,77,173)] font-semibold">
                    {categoryFilter === 'instagram-growth' ? 'Crecimiento Instagram' : 
                     categoryFilter === 'engagement' ? 'Tips de Engagement' :
                     categoryFilter === 'algorithm' ? 'Algoritmos & SEO' :
                     categoryFilter === 'content-creation' ? 'Creación de Contenido' :
                     categoryFilter === 'social-media-marketing' ? 'Estrategias SMM' : 
                     categoryFilter}
                  </span>
                  <br className="hidden sm:block"/>
                  <Link href="/blog" className="text-[rgb(214,77,173)] hover:text-[rgb(194,57,153)] underline text-base">
                    ← Ver todos los artículos
                  </Link>
                </>
              ) : (
                <>
                  Aprende las{" "}
                  <span className="text-[rgb(214,77,173)] font-semibold">
                    últimas estrategias y técnicas
                  </span>
                  {" "}para hacer crecer tu presencia en redes sociales.
                  <br className="hidden sm:block"/>
                  Guías, consejos y casos de éxito actualizados semanalmente.
                </>
              )}
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center gap-8 text-sm text-gray-600 mb-8">
              <div className="flex items-center">
                <span className="text-2xl mr-2">📚</span>
                <span><strong>{stats.totalPosts}+</strong> Artículos</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">👥</span>
                <span><strong>+10.000</strong> Lectores</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                <span><strong>Nuevos artículos</strong> todas las semanas</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Content Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Featured Post */}
                {blogPosts.length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Artículo Destacado</h2>
                    <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                      {blogPosts[0].featured_image ? (
                        <div className="aspect-video bg-gray-100 overflow-hidden">
                          <img 
                            src={blogPosts[0].featured_image} 
                            alt={blogPosts[0].title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] flex items-center justify-center">
                          <span className="text-4xl">📱</span>
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <span className="px-3 py-1 bg-[rgb(214,77,173)]/10 text-[rgb(214,77,173)] text-xs font-medium rounded-full">
                            {blogPosts[0].category || 'Blog'}
                          </span>
                          <span className="text-gray-500 text-sm">{formatDate(blogPosts[0].published_at!)}</span>
                          <span className="text-gray-500 text-sm">• 5 min</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-3 line-clamp-2">
                          <Link href={`/blog/${blogPosts[0].slug}`} className="text-[rgb(214,77,173)] hover:text-[rgb(194,57,153)] transition-colors">
                            {blogPosts[0].title}
                          </Link>
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{blogPosts[0].excerpt}</p>
                        <div className="flex items-center justify-between">
                          <Link 
                            href={`/blog/${blogPosts[0].slug}`}
                            className="inline-flex items-center text-[rgb(214,77,173)] font-medium hover:text-[rgb(194,57,153)] transition-colors"
                          >
                            Leer artículo
                            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                          <div className="flex items-center text-gray-500 text-sm">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {blogPosts[0].view_count} vistas
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Posts Grid */}
                <div className="mb-12">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Artículos Recientes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blogPosts.slice(1).map((post) => (
                      <article key={post.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                        {post.featured_image ? (
                          <div className="aspect-video bg-gray-100 overflow-hidden">
                            <img 
                              src={post.featured_image} 
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="aspect-video bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] flex items-center justify-center">
                            <span className="text-3xl">📊</span>
                          </div>
                        )}
                        <div className="p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              {post.category || 'Blog'}
                            </span>
                            <span className="text-gray-500 text-xs">5 min</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                            <Link href={`/blog/${post.slug}`} className="text-[rgb(214,77,173)] hover:text-[rgb(194,57,153)] transition-colors">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center justify-between">
                            <Link 
                              href={`/blog/${post.slug}`}
                              className="text-[rgb(214,77,173)] font-medium text-sm hover:text-[rgb(194,57,153)] transition-colors"
                            >
                              Leer más →
                            </Link>
                            <div className="flex items-center text-gray-500 text-xs">
                              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {post.view_count}
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  
                  {/* Categories */}
                  <div className="bg-gradient-to-b from-pink-50 to-pink-100 rounded-xl p-6 border border-pink-200">
                    <h3 className="text-lg font-semibold text-[rgb(214,77,173)] mb-4 flex items-center">
                      <span className="mr-2">📂</span>
                      Categorías
                    </h3>
                    <div className="space-y-3">
                      <Link 
                        href="/blog"
                        className={`flex items-center justify-between p-3 bg-white rounded-lg hover:bg-pink-50 transition-all duration-200 border border-pink-100 hover:border-pink-200 hover:scale-[1.02] ${!categoryFilter ? 'bg-pink-50 border-pink-200' : ''}`}
                      >
                        <span className="text-[rgb(214,77,173)] font-medium text-sm">📋 Todos los artículos</span>
                        <span className="text-[rgb(194,57,153)] text-xs bg-pink-100 px-2 py-1 rounded-full font-medium">
                          {!categoryFilter ? blogPosts.length : stats.totalPosts}
                        </span>
                      </Link>
                      <Link 
                        href="/blog?category=instagram-growth"
                        className={`flex items-center justify-between p-3 bg-white rounded-lg hover:bg-pink-50 transition-all duration-200 border border-pink-100 hover:border-pink-200 hover:scale-[1.02] ${categoryFilter === 'instagram-growth' ? 'bg-pink-50 border-pink-200' : ''} ${instagramGrowthCount === 0 ? 'opacity-60' : ''}`}
                      >
                        <span className="text-[rgb(214,77,173)] font-medium text-sm">📱 Crecimiento Instagram</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${instagramGrowthCount === 0 ? 'text-gray-400 bg-gray-100' : 'text-[rgb(194,57,153)] bg-pink-100'}`}>
                          {instagramGrowthCount}
                        </span>
                      </Link>
                      <Link 
                        href="/blog?category=engagement"
                        className={`flex items-center justify-between p-3 bg-white rounded-lg hover:bg-pink-50 transition-all duration-200 border border-pink-100 hover:border-pink-200 hover:scale-[1.02] ${categoryFilter === 'engagement' ? 'bg-pink-50 border-pink-200' : ''} ${engagementCount === 0 ? 'opacity-60' : ''}`}
                      >
                        <span className="text-[rgb(214,77,173)] font-medium text-sm">⚡ Tips de Engagement</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${engagementCount === 0 ? 'text-gray-400 bg-gray-100' : 'text-[rgb(194,57,153)] bg-pink-100'}`}>
                          {engagementCount}
                        </span>
                      </Link>
                      <Link 
                        href="/blog?category=algorithm"
                        className={`flex items-center justify-between p-3 bg-white rounded-lg hover:bg-pink-50 transition-all duration-200 border border-pink-100 hover:border-pink-200 hover:scale-[1.02] ${categoryFilter === 'algorithm' ? 'bg-pink-50 border-pink-200' : ''} ${algorithmCount === 0 ? 'opacity-60' : ''}`}
                      >
                        <span className="text-[rgb(214,77,173)] font-medium text-sm">🔍 Algoritmos & SEO</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${algorithmCount === 0 ? 'text-gray-400 bg-gray-100' : 'text-[rgb(194,57,153)] bg-pink-100'}`}>
                          {algorithmCount}
                        </span>
                      </Link>
                      <Link 
                        href="/blog?category=content-creation"
                        className={`flex items-center justify-between p-3 bg-white rounded-lg hover:bg-pink-50 transition-all duration-200 border border-pink-100 hover:border-pink-200 hover:scale-[1.02] ${categoryFilter === 'content-creation' ? 'bg-pink-50 border-pink-200' : ''} ${contentCreationCount === 0 ? 'opacity-60' : ''}`}
                      >
                        <span className="text-[rgb(214,77,173)] font-medium text-sm">🎨 Creación de Contenido</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${contentCreationCount === 0 ? 'text-gray-400 bg-gray-100' : 'text-[rgb(194,57,153)] bg-pink-100'}`}>
                          {contentCreationCount}
                        </span>
                      </Link>
                      <Link 
                        href="/blog?category=social-media-marketing"
                        className={`flex items-center justify-between p-3 bg-white rounded-lg hover:bg-pink-50 transition-all duration-200 border border-pink-100 hover:border-pink-200 hover:scale-[1.02] ${categoryFilter === 'social-media-marketing' ? 'bg-pink-50 border-pink-200' : ''} ${smmCount === 0 ? 'opacity-60' : ''}`}
                      >
                        <span className="text-[rgb(214,77,173)] font-medium text-sm">🚀 Estrategias SMM</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${smmCount === 0 ? 'text-gray-400 bg-gray-100' : 'text-[rgb(194,57,153)] bg-pink-100'}`}>
                          {smmCount}
                        </span>
                      </Link>
                    </div>
                  </div>



                  {/* Tools Promotion */}
                  <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                    <h3 className="text-lg font-semibold text-[rgb(214,77,173)] mb-2">🛠️ Herramientas Gratuitas</h3>
                    <p className="text-[rgb(194,57,153)] text-sm mb-4">
                      Optimiza tu estrategia con nuestras herramientas de IA
                    </p>
                    <div className="space-y-2">
                      <Link href="/tools/instagram-hashtag-analyzer" className="block">
                        <div className="p-2 bg-white rounded-lg hover:bg-pink-100 transition-colors">
                          <div className="text-sm font-medium text-[rgb(214,77,173)]">Analizador de Hashtags</div>
                          <div className="text-xs text-[rgb(194,57,153)]">IA + datos en tiempo real</div>
                        </div>
                      </Link>
                      <Link href="/tools/instagram-bio-generator" className="block">
                        <div className="p-2 bg-white rounded-lg hover:bg-pink-100 transition-colors">
                          <div className="text-sm font-medium text-[rgb(214,77,173)]">Generador de Bio</div>
                          <div className="text-xs text-[rgb(194,57,153)]">5 estilos optimizados</div>
                        </div>
                      </Link>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              ¿Necesitas ayuda para hacer crecer tus redes sociales?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Descubre nuestros servicios profesionales de marketing digital y SMM
            </p>
            <div className="flex justify-center">
              <Link
                href="https://goviral.es/collections"
                className="bg-white text-[rgb(214,77,173)] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Servicios SMM
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 