"use client";

import React, { useState } from "react";
import Image from "next/image";

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

export default function HashtagAnalyzer() {
  const [formData, setFormData] = useState({
    contentType: '',
    targetAudience: '',
    contentDescription: '',
    goal: 'engagement',
    industry: ''
  });
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<HashtagAnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [currentTip, setCurrentTip] = useState<number>(0);
  const [estimatedTime, setEstimatedTime] = useState<string>('2-3 minutos');
  const [currentHashtag, setCurrentHashtag] = useState<string>('');
  const [analyzedCount, setAnalyzedCount] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const loadingTips = [
    {
      title: "💡 Tip #1",
      content: "Los mejores resultados se obtienen combinando hashtags de diferentes niveles de dificultad. Usa 30% de hashtags populares, 50% de nivel medio y 20% de nicho específico."
    },
    {
      title: "🚀 Tip #2", 
      content: "Publica cuando tu audiencia esté más activa. Los hashtags de nicho funcionan mejor en horarios de menor competencia general."
    },
    {
      title: "📈 Tip #3",
      content: "Evita usar siempre los mismos hashtags. Instagram penaliza la repetición excesiva. Varía tu estrategia con estos hashtags analizados."
    },
    {
      title: "🎯 Tip #4",
      content: "Los hashtags con engagement rate alto (>5%) son oro. Indican una audiencia más comprometida aunque tengan menos posts totales."
    },
    {
      title: "⏰ Tip #5",
      content: "Los primeros 30 minutos después de publicar son cruciales. Los hashtags bien elegidos te darán visibilidad inmediata en ese período."
    }
  ];

  const contentTypes = [
    { value: 'business', label: 'Negocio/Producto', icon: '🏢', description: 'Promoción de productos o servicios' },
    { value: 'educational', label: 'Educativo/Tutorial', icon: '📚', description: 'Contenido que enseña o informa' },
    { value: 'entertainment', label: 'Entretenimiento', icon: '🎭', description: 'Humor, memes, contenido divertido' },
    { value: 'lifestyle', label: 'Estilo de vida', icon: '✨', description: 'Rutinas diarias, inspiración personal' },
    { value: 'fitness', label: 'Fitness/Salud', icon: '💪', description: 'Ejercicio, nutrición, bienestar' },
    { value: 'food', label: 'Comida/Recetas', icon: '🍳', description: 'Recetas, restaurantes, gastronomía' },
    { value: 'travel', label: 'Viajes', icon: '✈️', description: 'Destinos, aventuras, turismo' },
    { value: 'fashion', label: 'Moda/Belleza', icon: '👗', description: 'Outfits, makeup, tendencias' },
    { value: 'technology', label: 'Tecnología', icon: '💻', description: 'Gadgets, apps, innovación' },
    { value: 'art', label: 'Arte/Creatividad', icon: '🎨', description: 'Diseño, arte visual, creatividad' }
  ];

  const goals = [
    { value: 'engagement', label: 'Más engagement', icon: '❤️', description: 'Aumentar likes, comentarios y shares' },
    { value: 'awareness', label: 'Mayor visibilidad', icon: '👁️', description: 'Llegar a más personas nuevas' },
    { value: 'sales', label: 'Ventas/Conversiones', icon: '💰', description: 'Generar ventas y leads' },
    { value: 'community', label: 'Construir comunidad', icon: '🤝', description: 'Crear una audiencia fiel' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsAnalyzing(true);
    setProgress(0);
    setLoadingStep('Iniciando análisis...');

    let tipInterval: NodeJS.Timeout | null = null;

    try {
      // Inicializar rotación de tips
      setCurrentTip(0);
      tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % loadingTips.length);
      }, 8000); // Cambiar tip cada 8 segundos

      // Create EventSource for real-time updates
      const response = await fetch('/api/hashtag-analyzer/analyze-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al iniciar el análisis');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No se pudo establecer conexión en tiempo real');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'progress') {
                setLoadingStep(data.step);
                setProgress(data.progress);
                setEstimatedTime(data.estimatedTime);
                
                // Update hashtag-specific data if available
                if (data.currentHashtag) setCurrentHashtag(data.currentHashtag);
                if (data.analyzedCount !== undefined) setAnalyzedCount(data.analyzedCount);
                if (data.totalCount !== undefined) setTotalCount(data.totalCount);
              } else if (data.type === 'complete') {
                setAnalysisResult(data.data);
                
                // Scroll to results
                setTimeout(() => {
                  document.getElementById('results')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }, 100);
                
                break;
              } else if (data.type === 'error') {
                throw new Error(data.details || data.error || 'Error en el análisis');
              }
            } catch (parseError) {
              console.error('Error parsing SSE data:', parseError);
            }
          }
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      // Limpiar intervalos
      if (tipInterval) clearInterval(tipInterval);
      setTimeout(() => {
        setIsAnalyzing(false);
        setLoadingStep('');
        setProgress(0);
        setCurrentTip(0);
        setEstimatedTime('2-3 minutos');
        setCurrentHashtag('');
        setAnalyzedCount(0);
        setTotalCount(0);
      }, 1000);
    }
  };

  const getDifficultyColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    if (score >= 20) return 'text-blue-600';
    return 'text-green-600';
  };

  const getDifficultyText = (score: number) => {
    if (score >= 80) return 'Muy Difícil';
    if (score >= 60) return 'Difícil';
    if (score >= 40) return 'Medio';
    if (score >= 20) return 'Fácil';
    return 'Muy Fácil';
  };

  const copyHashtags = (hashtags: string[]) => {
    const hashtagText = hashtags.map(h => `#${h}`).join(' ');
    navigator.clipboard.writeText(hashtagText);
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white to-[#f5f5f7]">
        {/* Background Elements */}
        <div className="absolute top-20 sm:top-20 -left-20 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-1 sm:opacity-3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 sm:bottom-20 -right-20 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-1 sm:opacity-3 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 transition-all duration-300 hover:scale-105">
                Herramienta Gratuita con IA
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-4 sm:mb-6 px-2">
                Analizador de{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] via-[rgb(244,102,110)] to-[rgb(214,77,173)] animate-gradient-x font-extrabold">
                  Hashtags
                </span>
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 px-4">
              Genera hashtags personalizados con{" "}
              <span className="text-[rgb(214,77,173)] font-semibold">
                IA + análisis en tiempo real
              </span>
              . <br className="hidden sm:block"/>
              Optimiza tu alcance con datos reales de Instagram.
            </p>
            
            {/* Call to Action */}
            <div className="flex justify-center px-4">
              <a 
                href="#analizador"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[rgb(214,77,173)] text-white font-medium text-sm sm:text-base rounded-full hover:bg-[rgb(194,57,153)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto justify-center max-w-xs"
              >
                Analizar mis hashtags
                <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Hashtag Analyzer Form */}
      <section id="analizador" className="py-24 md:py-32 bg-gradient-to-b from-[#f5f5f7] to-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-[#FF7A00] via-[#FF0169] to-[#D300C5] p-1 rounded-2xl shadow-lg shadow-pink-500/20 transform hover:rotate-6 transition-transform duration-300">
              <div className="bg-white p-3 rounded-xl">
                <Image
                  src="/instagram.svg"
                  alt="Instagram"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 sm:p-8 md:p-12 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-gray-900 tracking-tight">
                    Describe tu contenido
                  </h2>
                  <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light">
                    Cuéntanos sobre tu contenido para generar hashtags personalizados
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Content Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Tipo de contenido *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                      {contentTypes.map(type => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({...formData, contentType: type.value})}
                          className={`p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                            formData.contentType === type.value
                              ? 'border-[rgb(214,77,173)] bg-[rgb(214,77,173)]/5 text-[rgb(214,77,173)]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="text-lg mb-1">{type.icon}</div>
                          <div className="text-xs font-medium leading-tight">{type.label}</div>
                          <div className="text-xs text-gray-500 mt-1 leading-tight">{type.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Audiencia objetivo *
                    </label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                      placeholder="Ej: Mujeres 25-35 interesadas en fitness y bienestar"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  {/* Content Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción del contenido *
                    </label>
                    <textarea
                      value={formData.contentDescription}
                      onChange={(e) => setFormData({...formData, contentDescription: e.target.value})}
                      placeholder="Describe específicamente tu contenido, producto o mensaje principal..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 resize-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.contentDescription.length}/500 caracteres
                    </p>
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Objetivo principal
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {goals.map(goal => (
                        <button
                          key={goal.value}
                          type="button"
                          onClick={() => setFormData({...formData, goal: goal.value})}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            formData.goal === goal.value
                              ? 'border-[rgb(214,77,173)] bg-[rgb(214,77,173)]/5 text-[rgb(214,77,173)]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="text-xl mb-2">{goal.icon}</div>
                          <div className="text-sm font-medium mb-1">{goal.label}</div>
                          <div className="text-xs text-gray-500 leading-tight">{goal.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Fields Section */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Campos adicionales (opcional)
                    </h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industria/Nicho
                      </label>
                      <input
                        type="text"
                        value={formData.industry}
                        onChange={(e) => setFormData({...formData, industry: e.target.value})}
                        placeholder="Ej: ecommerce, coaching, restaurante..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 bg-white"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ayuda a generar hashtags más específicos para tu sector
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isAnalyzing || !formData.contentType || !formData.targetAudience || !formData.contentDescription}
                    className="w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white py-4 px-6 rounded-xl font-medium hover:from-[rgb(194,57,153)] hover:to-[rgb(224,82,90)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:from-gray-400 disabled:to-gray-400"
                  >
                    {isAnalyzing ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {loadingStep || 'Analizando hashtags...'}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        Generar hashtags con IA
                      </div>
                    )}
                  </button>
                </form>

                {/* Loading Progress Interface */}
                {isAnalyzing && (
                  <div className="mt-8 max-w-2xl mx-auto">
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Analizando tus hashtags
                        </h3>
                        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Tiempo estimado: <strong>{estimatedTime}</strong></span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Progreso</span>
                          <span>{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] h-3 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Current Step */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <svg className="animate-spin h-5 w-5 text-[rgb(214,77,173)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {loadingStep}
                            </p>
                            
                            {/* Show detailed hashtag progress when analyzing */}
                            {currentHashtag && totalCount > 0 && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Analizando: #{currentHashtag}</span>
                                  <span>{analyzedCount}/{totalCount} completados</span>
                                </div>
                                <div className="w-full bg-blue-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-[rgb(214,77,173)] h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${totalCount > 0 ? (analyzedCount / totalCount) * 100 : 0}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Process Steps */}
                      <div className="mt-6 space-y-3">
                        <div className={`flex items-center text-sm ${progress >= 20 ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${progress >= 20 ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {progress >= 20 ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          🤖 Generando hashtags personalizados con IA
                        </div>
                        
                        <div className={`flex items-center text-sm ${progress >= 60 ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${progress >= 60 ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {progress >= 60 ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          📊 Analizando datos de Instagram en tiempo real
                        </div>

                        <div className={`flex items-center text-sm ${progress >= 90 ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${progress >= 90 ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {progress >= 90 ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          ⚡ Calculando métricas y recomendaciones
                        </div>

                        <div className={`flex items-center text-sm ${progress >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${progress >= 100 ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {progress >= 100 ? (
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            )}
                          </div>
                          ✅ Análisis completado
                        </div>
                      </div>

                      {/* Tips dinámicos mientras carga */}
                      <div className="mt-6 bg-yellow-50 rounded-xl p-4 border border-yellow-200 transition-all duration-500">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-yellow-800">
                              {loadingTips[currentTip].title}
                            </h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              {loadingTips[currentTip].content}
                            </p>
                          </div>
                        </div>
                        
                        {/* Indicador de tip */}
                        <div className="flex justify-center mt-3 space-x-1">
                          {loadingTips.map((_, index) => (
                            <div 
                              key={index}
                              className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                                index === currentTip ? 'bg-yellow-600' : 'bg-yellow-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {analysisResult && (
        <section id="results" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6">
                ANÁLISIS COMPLETADO
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight">
                Tus{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                  hashtags optimizados
                </span>
              </h2>
              <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mx-auto"></div>
            </div>

            {/* How to Read Analytics */}
            <div className="max-w-4xl mx-auto mb-8">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Cómo Interpretar las Métricas
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-orange-500 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Nivel de Dificultad:</strong> Qué tan difícil es destacar con este hashtag. Se calcula basado en la cantidad total de posts y el nivel de engagement promedio.
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Puntuación de Oportunidad:</strong> Qué tan efectivo es el hashtag para conseguir engagement. Compara el engagement vs la competencia.
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Estrategia Recomendada:</strong> Combina hashtags de diferentes dificultades para maximizar alcance y engagement.
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-3 h-3 bg-pink-500 rounded-full mt-1 mr-3 flex-shrink-0"></div>
                      <div>
                        <strong>Tasa de Engagement:</strong> Porcentaje de comentarios vs likes. Indica qué tan interactiva es la audiencia del hashtag.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center border border-green-200">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(analysisResult.strategicRecommendations.successProbability)}%
                </div>
                <div className="text-green-700 font-medium">Probabilidad de éxito</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center border border-blue-200">
                <div className="text-3xl font-bold text-blue-600 mb-2 break-words">
                  {analysisResult.strategicRecommendations.expectedReachMin.toLocaleString('es-ES')}-{analysisResult.strategicRecommendations.expectedReachMax.toLocaleString('es-ES')}
                </div>
                <div className="text-blue-700 font-medium">Alcance estimado</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {analysisResult.analyzedHashtags.length}
                </div>
                <div className="text-purple-700 font-medium">Hashtags analizados</div>
              </div>
            </div>

            {/* Recommended Mix */}
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Broad Reach */}
              {analysisResult.recommendedMix.broad.length > 0 && (
                <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl p-6 border border-gray-100 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      📢 Alto Alcance ({analysisResult.recommendedMix.broad.length})
                    </h3>
                    <button
                      onClick={() => copyHashtags(analysisResult.recommendedMix.broad)}
                      className="px-4 py-2 bg-[rgb(214,77,173)] text-white rounded-lg text-sm hover:bg-[rgb(194,57,153)] transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendedMix.broad.map((hashtag, index) => (
                      <span key={index} className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mt-3">
                    Hashtags populares con gran alcance pero alta competencia
                  </p>
                </div>
              )}

              {/* Medium Reach */}
              {analysisResult.recommendedMix.medium.length > 0 && (
                <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl p-6 border border-gray-100 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      🎯 Alcance Medio ({analysisResult.recommendedMix.medium.length})
                    </h3>
                    <button
                      onClick={() => copyHashtags(analysisResult.recommendedMix.medium)}
                      className="px-4 py-2 bg-[rgb(214,77,173)] text-white rounded-lg text-sm hover:bg-[rgb(194,57,153)] transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendedMix.medium.map((hashtag, index) => (
                      <span key={index} className="inline-block px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mt-3">
                    Hashtags específicos con buen equilibrio alcance/competencia
                  </p>
                </div>
              )}

              {/* Niche */}
              {analysisResult.recommendedMix.niche.length > 0 && (
                <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl p-6 border border-gray-100 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      🔍 Nicho Específico ({analysisResult.recommendedMix.niche.length})
                    </h3>
                    <button
                      onClick={() => copyHashtags(analysisResult.recommendedMix.niche)}
                      className="px-4 py-2 bg-[rgb(214,77,173)] text-white rounded-lg text-sm hover:bg-[rgb(194,57,153)] transition-colors"
                    >
                      Copiar
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysisResult.recommendedMix.niche.map((hashtag, index) => (
                      <span key={index} className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        #{hashtag}
                      </span>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mt-3">
                    Hashtags de nicho con menor competencia y audiencia específica
                  </p>
                </div>
              )}

              {/* Copy All Button */}
              <div className="text-center">
                <button
                  onClick={() => copyHashtags([
                    ...analysisResult.recommendedMix.broad,
                    ...analysisResult.recommendedMix.medium,
                    ...analysisResult.recommendedMix.niche
                  ])}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white font-medium rounded-full hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copiar todos los hashtags
                </button>
              </div>

              {/* Individual Hashtag Analytics */}
              <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl p-6 border border-gray-100 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    📊 Análisis Detallado de Hashtags
                  </h3>
                  <span className="text-sm text-gray-500">
                    {analysisResult.analyzedHashtags.length} hashtags analizados
                  </span>
                </div>
                
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {analysisResult.analyzedHashtags.map((hashtag, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          {/* Hashtag Header */}
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-lg font-semibold text-gray-900">
                              #{hashtag.hashtag}
                            </span>
                            <div className="flex items-center gap-2">
                              {hashtag.isTrending && (
                                <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                  🔥 Trending
                                </span>
                              )}
                              <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                                hashtag.performanceTier === 'high' ? 'bg-red-100 text-red-700' :
                                hashtag.performanceTier === 'medium' ? 'bg-orange-100 text-orange-700' :
                                hashtag.performanceTier === 'low' ? 'bg-blue-100 text-blue-700' :
                                'bg-green-100 text-green-700'
                              }`}>
                                {hashtag.performanceTier === 'high' ? 'Alto Alcance' :
                                 hashtag.performanceTier === 'medium' ? 'Alcance Medio' :
                                 hashtag.performanceTier === 'low' ? 'Alcance Bajo' : 'Nicho'}
                              </span>
                            </div>
                          </div>

                          {/* Analytics Grid */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                            {/* Total Posts */}
                            <div>
                              <div className="text-2xl font-bold text-gray-900 break-words">
                                {hashtag.formattedCount}
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">
                                Posts Totales
                              </div>
                            </div>

                            {/* Average Likes */}
                            <div>
                              <div className="text-2xl font-bold text-pink-600 break-words">
                                {hashtag.avgLikes.toLocaleString('es-ES')}
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">
                                Likes Promedio
                              </div>
                            </div>

                            {/* Average Comments */}
                            <div>
                              <div className="text-2xl font-bold text-blue-600 break-words">
                                {hashtag.avgComments.toLocaleString('es-ES')}
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">
                                Comentarios Promedio
                              </div>
                            </div>

                            {/* Difficulty Score */}
                            <div>
                              <div className={`text-2xl font-bold break-words ${getDifficultyColor(hashtag.difficultyScore)}`}>
                                {hashtag.difficultyScore}/100
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide">
                                Dificultad
                              </div>
                            </div>
                          </div>

                          {/* Progress Bars */}
                          <div className="mt-4 space-y-3">
                                                         {/* Difficulty Bar */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-medium text-gray-700">
                                    Nivel de Dificultad
                                  </span>
                                  <div className="group relative">
                                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                      <strong>Dificultad = Competencia + Popularidad</strong><br/>
                                      • Muy Fácil (0-20): Pocos posts, fácil destacar<br/>
                                      • Fácil (20-40): Competencia moderada<br/>
                                      • Medio (40-60): Equilibrio competencia/alcance<br/>
                                      • Difícil (60-80): Mucha competencia<br/>
                                      • Muy Difícil (80-100): Millones de posts, muy difícil destacar
                                    </div>
                                  </div>
                                </div>
                                <span className={`text-sm font-semibold ${getDifficultyColor(hashtag.difficultyScore)}`}>
                                  {getDifficultyText(hashtag.difficultyScore)}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    hashtag.difficultyScore >= 80 ? 'bg-red-500' :
                                    hashtag.difficultyScore >= 60 ? 'bg-orange-500' :
                                    hashtag.difficultyScore >= 40 ? 'bg-yellow-500' :
                                    hashtag.difficultyScore >= 20 ? 'bg-blue-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${hashtag.difficultyScore}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {hashtag.difficultyScore >= 80 ? 'Necesitas contenido excepcional para destacar' :
                                 hashtag.difficultyScore >= 60 ? 'Competencia alta, requiere buena calidad' :
                                 hashtag.difficultyScore >= 40 ? 'Competencia moderada, buena oportunidad' :
                                 hashtag.difficultyScore >= 20 ? 'Poca competencia, fácil posicionarse' :
                                 'Muy poca competencia, excelente para crecer'}
                              </div>
                            </div>

                                                         {/* Opportunity Score Bar */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-medium text-gray-700">
                                    Puntuación de Oportunidad
                                  </span>
                                  <div className="group relative">
                                    <svg className="w-4 h-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                      <strong>Oportunidad = Engagement ÷ Competencia</strong><br/>
                                      • 0-20: Baja oportunidad, poco engagement<br/>
                                      • 20-40: Oportunidad moderada<br/>
                                      • 40-60: Buena oportunidad de crecimiento<br/>
                                      • 60-80: Excelente oportunidad<br/>
                                      • 80-100: Oportunidad excepcional, hashtag muy efectivo
                                    </div>
                                  </div>
                                </div>
                                <span className="text-sm font-semibold text-purple-600">
                                  {Math.round(hashtag.opportunityScore)}/100
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                                  style={{ width: `${hashtag.opportunityScore}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {hashtag.opportunityScore >= 80 ? 'Hashtag muy efectivo, alto engagement vs competencia' :
                                 hashtag.opportunityScore >= 60 ? 'Excelente oportunidad de alcance y engagement' :
                                 hashtag.opportunityScore >= 40 ? 'Buena oportunidad, relación favorable' :
                                 hashtag.opportunityScore >= 20 ? 'Oportunidad moderada, considerar otros hashtags' :
                                 'Baja oportunidad, poco engagement relativo'}
                              </div>
                            </div>
                          </div>

                          {/* Engagement Rate */}
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1">
                                <span className="text-sm font-medium text-gray-700">
                                  Tasa de Engagement Promedio
                                </span>
                                <div className="group relative">
                                  <svg className="w-3 h-3 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                    <strong>Engagement = Comentarios ÷ Likes</strong><br/>
                                    Indica qué tan activa es la audiencia.<br/>
                                                                         • {'>'}5%: Muy interactiva<br/>
                                     • 2-5%: Buena interacción<br/>
                                     • {'<'}2%: Baja interacción
                                  </div>
                                </div>
                              </div>
                              <span className={`text-sm font-semibold ${
                                hashtag.avgLikes > 0 ? 
                                  (((hashtag.avgComments / hashtag.avgLikes) * 100) >= 5 ? 'text-green-600' :
                                   ((hashtag.avgComments / hashtag.avgLikes) * 100) >= 2 ? 'text-blue-600' :
                                   'text-orange-600') : 'text-gray-500'
                              }`}>
                                {hashtag.avgLikes > 0 ? 
                                  ((hashtag.avgComments / hashtag.avgLikes) * 100).toFixed(1) + '%' : 
                                  '0%'
                                }
                              </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {hashtag.avgLikes > 0 ? 
                                (((hashtag.avgComments / hashtag.avgLikes) * 100) >= 5 ? 
                                  'Audiencia muy interactiva, excelente para engagement' :
                                 ((hashtag.avgComments / hashtag.avgLikes) * 100) >= 2 ? 
                                  'Buena interacción, audiencia moderadamente activa' :
                                  'Baja interacción, enfócate más en likes que comentarios') :
                                'Basado en estimación de Instagram'
                              }
                            </div>
                          </div>
                        </div>

                        {/* Copy Individual Hashtag */}
                        <button
                          onClick={() => copyHashtags([hashtag.hashtag])}
                          className="ml-4 p-2 text-gray-400 hover:text-[rgb(214,77,173)] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Copiar hashtag"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Analytics Summary */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm text-gray-500">Posts Promedio</div>
                      <div className="text-lg font-bold text-gray-900 break-words">
                        {(() => {
                          const avgPosts = analysisResult.analyzedHashtags.reduce((sum, h) => sum + h.totalPosts, 0) / analysisResult.analyzedHashtags.length;
                          if (avgPosts >= 1000000) {
                            return (avgPosts / 1000000).toFixed(1) + 'M';
                          } else if (avgPosts >= 1000) {
                            return (avgPosts / 1000).toFixed(1) + 'K';
                          } else {
                            return Math.round(avgPosts).toString();
                          }
                        })()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Likes Promedio</div>
                      <div className="text-lg font-bold text-pink-600 break-words">
                        {(() => {
                          const avgLikes = Math.round(analysisResult.analyzedHashtags.reduce((sum, h) => sum + h.avgLikes, 0) / analysisResult.analyzedHashtags.length);
                          return avgLikes.toLocaleString('es-ES');
                        })()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Comentarios Promedio</div>
                      <div className="text-lg font-bold text-blue-600 break-words">
                        {(() => {
                          const avgComments = Math.round(analysisResult.analyzedHashtags.reduce((sum, h) => sum + h.avgComments, 0) / analysisResult.analyzedHashtags.length);
                          return avgComments.toLocaleString('es-ES');
                        })()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Dificultad Promedio</div>
                      <div className="text-lg font-bold text-orange-600 break-words">
                        {Math.round(analysisResult.analyzedHashtags.reduce((sum, h) => sum + h.difficultyScore, 0) / analysisResult.analyzedHashtags.length)}/100
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Posting Tips */}
              <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl p-6 border border-gray-100 shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  💡 Consejos para maximizar resultados
                </h3>
                <ul className="space-y-2">
                  {analysisResult.strategicRecommendations.postingTips.map((tip, index) => (
                    <li key={index} className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-[#f5f5f7] to-white relative overflow-hidden">
        <div className="hidden sm:block absolute top-40 left-10 w-60 md:w-80 h-60 md:h-80 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-1 md:opacity-2 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-40 right-10 w-72 md:w-96 h-72 md:h-96 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-1 md:opacity-2 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6">
              TECNOLOGÍA AVANZADA
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight px-4">
              ¿Cómo{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                funciona
              </span>
              ?
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light px-4">
              Combinamos inteligencia artificial con datos reales de Instagram para crear hashtags estratégicos
            </p>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-6 sm:mt-8 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 sm:w-10 h-8 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 px-2">IA Personalizada</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base px-2">
                Generamos hashtags únicos basados en tu contenido específico y audiencia objetivo
              </p>
            </div>

            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 sm:w-10 h-8 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 px-2">Análisis en Tiempo Real</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base px-2">
                Analizamos cada hashtag con datos actuales de Instagram: competencia, engagement y tendencias
              </p>
            </div>

            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 sm:w-10 h-8 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 px-2">Estrategia Optimizada</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base px-2">
                Recibe una mezcla estratégica de hashtags y consejos específicos para maximizar tu alcance
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 text-center px-4">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 sm:px-4 py-2 rounded-full">
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700 font-medium text-xs sm:text-sm">
                Datos en tiempo real de Instagram + IA avanzada
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 