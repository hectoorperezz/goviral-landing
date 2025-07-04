'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [articleType, setArticleType] = useState<'single' | 'batch' | 'smm'>('single');
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [category, setCategory] = useState('social-media-marketing');
  const [focusArea, setFocusArea] = useState<'instagram' | 'tiktok' | 'engagement' | 'growth' | 'algorithm'>('instagram');
  const [promotionIntensity, setPromotionIntensity] = useState<'informativo' | 'moderado' | 'promocional'>('moderado');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        setError('');
      } else {
        setError('Contraseña incorrecta');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleCreateArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      let requestBody: any = {
        type: articleType,
        category,
        promotionIntensity,
        customPrompt: customPrompt.trim() || undefined
      };

      if (articleType === 'single') {
        requestBody.topic = topic;
      } else if (articleType === 'batch') {
        requestBody.topics = topics.split('\n').filter(t => t.trim());
      } else if (articleType === 'smm') {
        requestBody.focusArea = focusArea;
      }

      const response = await fetch('/api/blog-automation/create-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.result);
      } else {
        setError(data.error || 'Error creando artículo');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex flex-col bg-[#fbfbfd]">
        <Header />
        
        <div className="flex-1 flex items-center justify-center py-20">
          <div className="max-w-md w-full mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
              <p className="text-gray-600">Acceso restringido a empleados</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña de acceso
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent"
                  placeholder="Introduce la contraseña"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white py-3 px-6 rounded-lg font-medium hover:scale-[1.02] transition-transform"
              >
                Acceder
              </button>
            </form>
          </div>
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-[#fbfbfd]">
      <Header />
      
      <div className="flex-1 py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Panel de Administración</h1>
            <p className="text-lg text-gray-600">Crea artículos para el blog de GoViral</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <form onSubmit={handleCreateArticle} className="space-y-6">
              
              {/* Tipo de artículo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de artículo
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="articleType"
                      value="single"
                      checked={articleType === 'single'}
                      onChange={(e) => setArticleType(e.target.value as any)}
                      className="mr-3 text-[rgb(214,77,173)]"
                    />
                    <div>
                      <div className="font-medium">Artículo único</div>
                      <div className="text-sm text-gray-500">Un tema específico</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="articleType"
                      value="batch"
                      checked={articleType === 'batch'}
                      onChange={(e) => setArticleType(e.target.value as any)}
                      className="mr-3 text-[rgb(214,77,173)]"
                    />
                    <div>
                      <div className="font-medium">Batch múltiple</div>
                      <div className="text-sm text-gray-500">Varios temas</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="articleType"
                      value="smm"
                      checked={articleType === 'smm'}
                      onChange={(e) => setArticleType(e.target.value as any)}
                      className="mr-3 text-[rgb(214,77,173)]"
                    />
                    <div>
                      <div className="font-medium">SMM predefinido</div>
                      <div className="text-sm text-gray-500">Plantillas SMM</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Categoría */}
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent"
                >
                  <option value="social-media-marketing">Estrategias SMM</option>
                  <option value="instagram-growth">Crecimiento Instagram</option>
                  <option value="engagement">Tips de Engagement</option>
                  <option value="algorithm">Algoritmos & SEO</option>
                  <option value="content-creation">Creación de Contenido</option>
                </select>
              </div>

              {/* Intensidad promocional */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Intensidad promocional de GoViral
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="promotionIntensity"
                      value="informativo"
                      checked={promotionIntensity === 'informativo'}
                      onChange={(e) => setPromotionIntensity(e.target.value as any)}
                      className="mr-3 text-[rgb(214,77,173)]"
                    />
                    <div>
                      <div className="font-medium">Informativo</div>
                      <div className="text-sm text-gray-500">Solo educación, sin menciones de GoViral</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="promotionIntensity"
                      value="moderado"
                      checked={promotionIntensity === 'moderado'}
                      onChange={(e) => setPromotionIntensity(e.target.value as any)}
                      className="mr-3 text-[rgb(214,77,173)]"
                    />
                    <div>
                      <div className="font-medium">Moderado</div>
                      <div className="text-sm text-gray-500">Menciones sutiles cuando sea relevante</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="promotionIntensity"
                      value="promocional"
                      checked={promotionIntensity === 'promocional'}
                      onChange={(e) => setPromotionIntensity(e.target.value as any)}
                      className="mr-3 text-[rgb(214,77,173)]"
                    />
                    <div>
                      <div className="font-medium">Promocional</div>
                      <div className="text-sm text-gray-500">CTAs directos y menciones claras</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Prompt personalizado */}
              <div>
                <label htmlFor="customPrompt" className="block text-sm font-medium text-gray-700 mb-2">
                  Prompt personalizado (opcional)
                </label>
                <textarea
                  id="customPrompt"
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent"
                  placeholder="Ej: Enfócate en principiantes, incluye ejemplos prácticos, menciona las últimas tendencias 2024, usa un tono conversacional..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Especifica el enfoque, público objetivo, tono, estructura o cualquier detalle específico que quieras para el artículo
                </p>
              </div>

              {/* Campos condicionales */}
              {articleType === 'single' && (
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-2">
                    Tema del artículo
                  </label>
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent"
                    placeholder="Ej: Cómo aumentar seguidores en Instagram 2024"
                    required
                  />
                </div>
              )}

              {articleType === 'batch' && (
                <div>
                  <label htmlFor="topics" className="block text-sm font-medium text-gray-700 mb-2">
                    Temas (uno por línea)
                  </label>
                  <textarea
                    id="topics"
                    value={topics}
                    onChange={(e) => setTopics(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent"
                    placeholder="Tema 1: Cómo aumentar engagement&#10;Tema 2: Mejores hashtags para Instagram&#10;Tema 3: Estrategias de growth hacking"
                    required
                  />
                </div>
              )}

              {articleType === 'smm' && (
                <div>
                  <label htmlFor="focusArea" className="block text-sm font-medium text-gray-700 mb-2">
                    Área de enfoque
                  </label>
                  <select
                    id="focusArea"
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent"
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="engagement">Engagement</option>
                    <option value="growth">Growth Hacking</option>
                    <option value="algorithm">Algoritmos</option>
                  </select>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white py-4 px-6 rounded-lg font-medium hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Generando artículo...' : 'Crear artículo'}
              </button>
            </form>

            {/* Resultado */}
            {result && (
              <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-lg font-semibold text-green-900 mb-4">¡Artículo creado exitosamente!</h3>
                
                {result.success && result.article && (
                  <div className="space-y-3">
                    <div>
                      <span className="font-medium text-green-800">Título:</span>
                      <span className="ml-2 text-green-700">{result.article.title}</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-800">Slug:</span>
                      <span className="ml-2 text-green-700">{result.article.slug}</span>
                    </div>
                    <div>
                      <span className="font-medium text-green-800">ID:</span>
                      <span className="ml-2 text-green-700">{result.articleId}</span>
                    </div>
                    <div className="pt-3">
                      <a
                        href={`/blog/${result.article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Ver artículo
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                )}

                {result.success === false && (
                  <div className="text-red-700">
                    Error: {result.error}
                  </div>
                )}

                {Array.isArray(result) && (
                  <div className="space-y-2">
                    {result.map((item: any, index: number) => (
                      <div key={index} className={`p-3 rounded ${item.success ? 'bg-green-100' : 'bg-red-100'}`}>
                        <span className="font-medium">{item.topic}:</span>
                        <span className={`ml-2 ${item.success ? 'text-green-700' : 'text-red-700'}`}>
                          {item.success ? `✅ Creado (ID: ${item.articleId})` : `❌ ${item.error}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
} 