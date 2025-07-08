import Link from "next/link";
import Footer from "@/components/Footer";

export default function ToolsPage() {
  const tools = [
    {
      name: "Instagram Follower Tracker",
      description: "Rastrea el crecimiento de seguidores en tiempo real",
      detailedDescription: "Monitoriza el crecimiento de cualquier cuenta de Instagram con métricas detalladas, análisis de tendencias y reportes automatizados. Ideal para influencers, marcas y agencias.",
      href: "/tools/instagram-follower-tracker",
      icon: "📈",
      category: "Analytics",
      features: [
        "Seguimiento en tiempo real",
        "Histórico de crecimiento",
        "Comparación con competidores",
        "Reportes automatizados"
      ]
    },
    {
      name: "ReelViews Booster",
      description: "500 visualizaciones gratuitas para tus Reels",
      detailedDescription: "Impulsa tus Reels de Instagram con visualizaciones reales y orgánicas. Mejora tu alcance y aumenta las posibilidades de aparecer en la página de exploración.",
      href: "/tools/reelviews-booster",
      icon: "🚀",
      category: "Growth",
      features: [
        "500 views gratuitas",
        "Entrega en 24-48h",
        "100% seguro y orgánico",
        "Sin contraseñas requeridas"
      ]
    },
    {
      name: "Calculadora de Engagement",
      description: "Analiza engagement de cualquier perfil de Instagram",
      detailedDescription: "Calcula métricas de engagement precisas de cualquier cuenta pública de Instagram. Analiza la calidad de la audiencia y el rendimiento del contenido.",
      href: "/tools/instagram-engagement-calculator",
      icon: "📊",
      category: "Analytics",
      features: [
        "Cálculo de engagement rate",
        "Análisis de posts recientes",
        "Métricas detalladas",
        "Comparación con promedios"
      ]
    },
    {
      name: "Analizador de Hashtags",
      description: "IA + análisis en tiempo real de Instagram",
      detailedDescription: "Encuentra los mejores hashtags para tu contenido usando inteligencia artificial y datos en tiempo real. Optimiza tu alcance y descubribilidad.",
      href: "/tools/instagram-hashtag-analyzer",
      icon: "🔍",
      category: "Optimization",
      features: [
        "Análisis con IA",
        "Hashtags trending",
        "Métricas de rendimiento",
        "Sugerencias personalizadas"
      ]
    },
    {
      name: "Generador de Bio con IA",
      description: "5 biografías optimizadas con análisis estratégico",
      detailedDescription: "Crea biografías de Instagram irresistibles usando inteligencia artificial. Recibe múltiples opciones optimizadas para conversión y engagement.",
      href: "/tools/instagram-bio-generator",
      icon: "✨",
      category: "Content",
      features: [
        "5 biografías únicas",
        "Optimización con IA",
        "Análisis estratégico",
        "Call-to-actions efectivos"
      ]
    },
    {
      name: "Generador de Guiones para Videos",
      description: "Crea ideas virales para Reels, TikTok y YouTube",
      detailedDescription: "Genera ideas y guiones completos para videos virales usando IA avanzada. Optimizado para Instagram Reels, TikTok y YouTube Shorts con elementos trending.",
      href: "/tools/generador-guiones-videos",
      icon: "🎬",
      category: "Content",
      features: [
        "5 guiones únicos por generación",
        "Hooks optimizados para cada plataforma",
        "Sugerencias visuales y de audio",
        "Predicción de potencial viral"
      ]
    }
  ];



  return (
    <main className="min-h-screen flex flex-col bg-[#fbfbfd]">
      
      {/* Hero Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-gradient-to-b from-white to-[#f5f5f7]">
        {/* Background Elements */}
        <div className="absolute top-20 sm:top-20 -left-20 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-40 sm:opacity-50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 sm:bottom-20 -right-20 sm:right-10 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-40 sm:opacity-50 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 transition-all duration-300 hover:scale-105">
                Herramientas Profesionales
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-4 sm:mb-6 px-2">
                Herramientas de{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] via-[rgb(244,102,110)] to-[rgb(214,77,173)] animate-gradient-x font-extrabold">
                  Instagram
                </span>
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 px-4">
              Optimiza tu presencia en Instagram con nuestras herramientas potenciadas por{" "}
              <span className="text-[rgb(214,77,173)] font-semibold">inteligencia artificial</span>.
              <br className="hidden sm:block"/>
              Desde análisis avanzados hasta generación de contenido, todo en un solo lugar.
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center gap-8 text-sm text-gray-600 mb-8">
              <div className="flex items-center">
                <span className="text-2xl mr-2">🛠️</span>
                <span><strong>{tools.length}</strong> Herramientas</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">⚡</span>
                <span><strong>100%</strong> Gratuitas</span>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-2">🤖</span>
                <span><strong>Potenciadas</strong> por IA</span>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Tools Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Todas las Herramientas</h2>
              <p className="text-lg text-gray-600">Herramientas profesionales para hacer crecer tu Instagram</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {tools.map((tool, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="p-8">
                    {/* Header */}
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-[rgb(214,77,173)]/10 to-[rgb(244,102,110)]/10 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
                          {tool.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="inline-block px-2 py-1 bg-[rgb(214,77,173)]/10 text-[rgb(214,77,173)] text-xs font-medium rounded-full">
                            {tool.category}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[rgb(214,77,173)] transition-colors duration-200">
                          {tool.name}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {tool.detailedDescription}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 text-sm mb-3">Características principales:</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {tool.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-[rgb(214,77,173)] rounded-full mr-2 flex-shrink-0"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={tool.href}
                      className="block w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white text-center py-3 px-6 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                    >
                      Usar {tool.name} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-white">
              ¿Necesitas servicios de crecimiento personalizados?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Descubre nuestros servicios profesionales de SMM para un crecimiento acelerado
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="https://goviral.es/collections"
                className="bg-white text-[rgb(214,77,173)] px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Ver Servicios SMM
              </Link>
              <Link
                href="https://goviral.es/pages/contact"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[rgb(214,77,173)] transition-colors"
              >
                Contactar Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
} 