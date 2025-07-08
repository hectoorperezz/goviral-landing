'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// ===============================================
// TYPES
// ===============================================

interface GeneratedScript {
  id: string;
  title: string;
  scriptType: 'gancho_fuerte' | 'storytelling' | 'educativo_rapido' | 'trending_viral' | 'cta_directo';
  hook: string;
  development: string;
  cta: string;
  visualCues: string[];
  audioNotes: string[];
  hashtags: string[];
  reasoning: string;
}

interface VideoScriptGenerationResult {
  generatedScripts: GeneratedScript[];
  contextAnalysis: {
    nicheInsights: string;
    audienceRecommendations: string;
    platformTips: string;
    trendingOpportunities: string[];
  };
  bestPractices: {
    hookStrategy: string;
    contentStructure: string;
    visualTips: string;
    hashtagStrategy: string;
  };
  generatedAt: string;
}

export default function VideoScriptGenerator() {
  const [formData, setFormData] = useState({
    topic: '',
    description: '',
    platform: '',
    duration: '',
    contentType: '',
    targetAudience: '',
    niche: '',
    goal: '',
    tone: ''
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<VideoScriptGenerationResult | null>(null);
  const [error, setError] = useState<string>('');

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: '📸', description: 'Reels y Stories' },
    { value: 'tiktok', label: 'TikTok', icon: '🎵', description: 'Videos cortos virales' },
    { value: 'youtube', label: 'YouTube', icon: '🎬', description: 'Shorts y contenido' },
    { value: 'general', label: 'General', icon: '📱', description: 'Múltiples plataformas' }
  ];

  const durations = [
    { value: '15s', label: '15 segundos', icon: '⚡', description: 'Contenido ultra rápido' },
    { value: '30s', label: '30 segundos', icon: '🚀', description: 'Formato más popular' },
    { value: '60s', label: '60 segundos', icon: '⏱️', description: 'Contenido detallado' }
  ];

  const contentTypes = [
    { value: 'educativo', label: 'Educativo', icon: '🎓', description: 'Tips y tutoriales' },
    { value: 'entretenimiento', label: 'Entretenimiento', icon: '🎭', description: 'Divertido y viral' },
    { value: 'viral', label: 'Viral', icon: '🔥', description: 'Máximo alcance' },
    { value: 'promocional', label: 'Promocional', icon: '💼', description: 'Venta y conversión' },
    { value: 'storytelling', label: 'Storytelling', icon: '📚', description: 'Narrativa personal' }
  ];

  const goals = [
    { value: 'engagement', label: 'Más Engagement', icon: '❤️', description: 'Likes, comentarios, shares' },
    { value: 'ventas', label: 'Generar Ventas', icon: '💰', description: 'Convertir audiencia' },
    { value: 'awareness', label: 'Awareness', icon: '📢', description: 'Posicionamiento de marca' },
    { value: 'educacion', label: 'Educar', icon: '💡', description: 'Compartir conocimiento' },
    { value: 'viral', label: 'Viralidad', icon: '🌟', description: 'Máximo alcance orgánico' }
  ];

  const tones = [
    { value: 'profesional', label: 'Profesional', icon: '👔', description: 'Serio y experto' },
    { value: 'casual', label: 'Casual', icon: '😊', description: 'Relajado y amigable' },
    { value: 'divertido', label: 'Divertido', icon: '😄', description: 'Humor y entretenimiento' },
    { value: 'inspiracional', label: 'Inspiracional', icon: '✨', description: 'Motivacional y positivo' },
    { value: 'provocativo', label: 'Provocativo', icon: '🔥', description: 'Controversial y único' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/video-script-generator/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Error en la generación');
      }

      setGenerationResult(data.data);
      
      setTimeout(() => {
        document.getElementById('results')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyScript = (script: GeneratedScript) => {
    const visualSection = script.visualCues.map((cue, index) => `${index + 1}. ${cue}`).join('\n');
    const audioSection = script.audioNotes.map((note, index) => `${index + 1}. ${note}`).join('\n');
    
    const fullScript = `📝 ${script.title}
    
🎯 HOOK (Primeros segundos):
${script.hook}

📝 DESARROLLO:
${script.development}

💫 CALL TO ACTION:
${script.cta}

🎬 SUGERENCIAS VISUALES:
${visualSection}

🎵 NOTAS DE AUDIO:
${audioSection}

#️⃣ HASHTAGS:
${script.hashtags.join(' ')}

💡 REASONING:
${script.reasoning}`;
    
    navigator.clipboard.writeText(fullScript);
  };

  const getScriptTypeLabel = (scriptType: string) => {
    const labels = {
      gancho_fuerte: 'Gancho Fuerte',
      storytelling: 'Storytelling',
      educativo_rapido: 'Educativo Rápido',
      trending_viral: 'Trending Viral',
      cta_directo: 'CTA Directo'
    };
    return labels[scriptType as keyof typeof labels] || scriptType;
  };

  const getScriptTypeIcon = (scriptType: string) => {
    const icons = {
      gancho_fuerte: '🎯',
      storytelling: '📖',
      educativo_rapido: '⚡',
      trending_viral: '🔥',
      cta_directo: '💫'
    };
    return icons[scriptType as keyof typeof icons] || '📝';
  };



  return (
    <>
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white to-[#f5f5f7]">
        {/* Background Elements */}
        <div className="absolute top-20 sm:top-20 -left-20 sm:left-10 w-40 sm:w-72 h-40 sm:h-72 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-40 sm:opacity-50 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 sm:bottom-20 -right-20 sm:right-10 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-40 sm:opacity-50 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 transition-all duration-300 hover:scale-105">
                Herramienta Gratuita con IA
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-4 sm:mb-6 px-2">
                Generador de{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] via-[rgb(244,102,110)] to-[rgb(214,77,173)] animate-gradient-x font-extrabold">
                  Guiones de Videos
                </span>
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 px-4">
              Crea guiones virales con{" "}
              <span className="text-[rgb(214,77,173)] font-semibold">
                IA + estrategia de contenido
              </span>
              . <br className="hidden sm:block"/>
              5 estilos optimizados para maximizar tu engagement y conversión.
            </p>
            
            {/* Call to Action */}
            <div className="flex justify-center px-4">
              <a 
                href="#generador"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[rgb(214,77,173)] text-white font-medium text-sm sm:text-base rounded-full hover:bg-[rgb(194,57,153)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto justify-center max-w-xs"
              >
                Generar mis guiones
                <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Script Generator Form */}
      <section id="generador" className="py-24 md:py-32 bg-gradient-to-b from-[#f5f5f7] to-white relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex justify-center mb-8">
            <div className="bg-gradient-to-r from-[#FF7A00] via-[#FF0169] to-[#D300C5] p-1 rounded-2xl shadow-lg shadow-pink-500/20 transform hover:rotate-6 transition-transform duration-300">
              <div className="bg-white p-3 rounded-xl">
                <span className="text-4xl">🎬</span>
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
                    Personaliza tu contenido
                  </h2>
                  <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light">
                    Cuéntanos sobre tu video para generar guiones optimizados
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Topic and Niche in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Topic */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <span className="flex items-center">
                          <span className="text-lg mr-2">🎯</span>
                          Tema del video *
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.topic}
                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        placeholder="Ej: Cómo aumentar seguidores en Instagram, Tips de cocina..."
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 text-base"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Título o tema principal del video</p>
                    </div>

                    {/* Niche */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <span className="flex items-center">
                          <span className="text-lg mr-2">🏷️</span>
                          Nicho/Industria *
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.niche}
                        onChange={(e) => setFormData({...formData, niche: e.target.value})}
                        placeholder="Ej: Fitness, Comida, Marketing, Tecnología..."
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 text-base"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Tu área de especialización</p>
                    </div>
                  </div>

                  {/* Detailed Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <span className="flex items-center">
                        <span className="text-lg mr-2">📝</span>
                        Descripción detallada del video *
                      </span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe exactamente lo que quieres que incluya tu video. Por ejemplo: 'Quiero mostrar 5 ejercicios específicos para quemar grasa abdominal que se puedan hacer en casa sin equipo, dirigido a principiantes que tienen poco tiempo. Quiero incluir demostraciones paso a paso y errores comunes a evitar...'"
                      rows={4}
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 text-base resize-none"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Sé muy específico: ¿Qué quieres mostrar? ¿Qué puntos quieres cubrir? ¿Qué problemas resuelves? Cuanto más detalle, mejores guiones obtendrás.
                    </p>
                  </div>

                  {/* Platform */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Plataforma objetivo *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {platforms.map((platform) => (
                        <button
                          key={platform.value}
                          type="button"
                          onClick={() => setFormData({...formData, platform: platform.value})}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-[rgb(214,77,173)] hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
                            formData.platform === platform.value
                              ? 'border-[rgb(214,77,173)] bg-gradient-to-r from-pink-50 to-purple-50 shadow-md'
                              : 'border-gray-200 bg-white hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{platform.icon}</span>
                            <span className="font-medium text-gray-900">{platform.label}</span>
                          </div>
                          <div className="text-xs text-gray-600">{platform.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Duración del video *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {durations.map((duration) => (
                        <button
                          key={duration.value}
                          type="button"
                          onClick={() => setFormData({...formData, duration: duration.value})}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-[rgb(214,77,173)] hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
                            formData.duration === duration.value
                              ? 'border-[rgb(214,77,173)] bg-gradient-to-r from-pink-50 to-purple-50 shadow-md'
                              : 'border-gray-200 bg-white hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{duration.icon}</span>
                            <span className="font-medium text-gray-900">{duration.label}</span>
                          </div>
                          <div className="text-xs text-gray-600">{duration.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Tipo de contenido *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {contentTypes.map((contentType) => (
                        <button
                          key={contentType.value}
                          type="button"
                          onClick={() => setFormData({...formData, contentType: contentType.value})}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-[rgb(214,77,173)] hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
                            formData.contentType === contentType.value
                              ? 'border-[rgb(214,77,173)] bg-gradient-to-r from-pink-50 to-purple-50 shadow-md'
                              : 'border-gray-200 bg-white hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{contentType.icon}</span>
                            <span className="font-medium text-gray-900">{contentType.label}</span>
                          </div>
                          <div className="text-xs text-gray-600">{contentType.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <span className="flex items-center">
                        <span className="text-lg mr-2">👥</span>
                        Audiencia objetivo *
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.targetAudience}
                      onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                      placeholder="Ej: Mujeres 25-40 años interesadas en fitness y nutrición..."
                      className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 text-base"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Describe detalladamente a tu audiencia ideal</p>
                  </div>

                  {/* Goal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Objetivo principal *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {goals.map((goal) => (
                        <button
                          key={goal.value}
                          type="button"
                          onClick={() => setFormData({...formData, goal: goal.value})}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-[rgb(214,77,173)] hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
                            formData.goal === goal.value
                              ? 'border-[rgb(214,77,173)] bg-gradient-to-r from-pink-50 to-purple-50 shadow-md'
                              : 'border-gray-200 bg-white hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{goal.icon}</span>
                            <span className="font-medium text-gray-900">{goal.label}</span>
                          </div>
                          <div className="text-xs text-gray-600">{goal.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Tono de comunicación *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {tones.map((tone) => (
                        <button
                          key={tone.value}
                          type="button"
                          onClick={() => setFormData({...formData, tone: tone.value})}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-[rgb(214,77,173)] hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
                            formData.tone === tone.value
                              ? 'border-[rgb(214,77,173)] bg-gradient-to-r from-pink-50 to-purple-50 shadow-md'
                              : 'border-gray-200 bg-white hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{tone.icon}</span>
                            <span className="font-medium text-gray-900">{tone.label}</span>
                          </div>
                          <div className="text-xs text-gray-600">{tone.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isGenerating || !formData.topic || !formData.description || !formData.platform || !formData.duration || !formData.contentType || !formData.targetAudience || !formData.niche || !formData.goal || !formData.tone}
                      className="w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white py-5 px-8 rounded-xl font-semibold text-lg hover:from-[rgb(194,57,153)] hover:to-[rgb(224,82,90)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-lg">Creando tus guiones perfectos...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span className="text-2xl mr-3">🎬</span>
                          <span>Generar guiones con IA</span>
                          <svg className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      )}
                    </button>
                    {(!formData.topic || !formData.description || !formData.platform || !formData.duration || !formData.contentType || !formData.targetAudience || !formData.niche || !formData.goal || !formData.tone) && (
                      <p className="text-center text-sm text-gray-500 mt-3">
                        Por favor completa todos los campos requeridos (*) para continuar
                      </p>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      {generationResult && (
        <section id="results" className="py-24 md:py-32 bg-white relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6">
                GUIONES GENERADOS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-gray-900 tracking-tight">
                Tus{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                  guiones optimizados
                </span>
              </h2>
            </div>

            {/* Generated Scripts Grid */}
            <div className="max-w-6xl mx-auto space-y-8">
              {generationResult.generatedScripts.map((script) => (
                <div key={script.id} className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl p-6 border border-gray-100 shadow-lg">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Script Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getScriptTypeIcon(script.scriptType)}</span>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {getScriptTypeLabel(script.scriptType)}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-[rgb(214,77,173)]/10 to-[rgb(244,102,110)]/10 rounded-xl p-4 mb-4 border-l-4 border-[rgb(214,77,173)]">
                        <h4 className="font-bold text-gray-900 mb-2">{script.title}</h4>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                            <span className="text-lg mr-2">🎯</span>
                            Hook (Primeros segundos)
                          </h5>
                          <div className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-400">
                            <p className="text-gray-900 font-medium">{script.hook}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                            <span className="text-lg mr-2">📝</span>
                            Desarrollo
                          </h5>
                          <div className="bg-blue-50 rounded-lg p-3 border-l-4 border-blue-400">
                            <p className="text-gray-900">{script.development}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                            <span className="text-lg mr-2">💫</span>
                            Call to Action
                          </h5>
                          <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
                            <p className="text-gray-900 font-medium">{script.cta}</p>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-4 italic">
                        💡 {script.reasoning}
                      </p>
                    </div>

                    {/* Script Details */}
                    <div className="lg:w-80">
                      <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-4">
                        
                        {/* Visual Cues - Más prominente */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                          <h5 className="font-semibold text-blue-900 mb-3 text-sm flex items-center">
                            <span className="text-lg mr-2">🎬</span>
                            Ideas de Contenido Visual
                          </h5>
                          <div className="space-y-2">
                            {script.visualCues.map((cue, index) => (
                              <div key={index} className="text-xs text-blue-800 bg-white/70 p-3 rounded-lg border-l-4 border-blue-400">
                                <span className="font-bold text-blue-600">#{index + 1}</span> {cue}
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-xs text-blue-600 italic bg-white/50 p-2 rounded">
                            💡 Sugerencias específicas para la producción visual del video
                          </div>
                        </div>
                        
                        {/* Audio Notes */}
                        <div className="pt-3 border-t border-gray-200">
                          <h5 className="font-semibold text-gray-700 mb-2 text-sm flex items-center">
                            <span className="text-base mr-1">🎵</span>
                            Notas de Audio
                          </h5>
                          <div className="space-y-1">
                            {script.audioNotes.map((note, index) => (
                              <div key={index} className="text-xs text-gray-600 bg-green-50 p-2 rounded border-l-2 border-green-400">
                                • {note}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Hashtags */}
                        <div className="pt-3 border-t border-gray-200">
                          <h5 className="font-semibold text-gray-700 mb-2 text-sm flex items-center">
                            <span className="text-base mr-1">#️⃣</span>
                            Hashtags Sugeridos
                          </h5>
                          <div className="flex flex-wrap gap-1">
                            {script.hashtags.map((hashtag, index) => (
                              <span key={index} className="px-2 py-1 bg-[rgb(214,77,173)]/10 text-[rgb(214,77,173)] text-xs rounded-full border border-[rgb(214,77,173)]/20">
                                {hashtag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => copyScript(script)}
                          className="w-full mt-4 bg-[rgb(214,77,173)] text-white py-3 px-4 rounded-lg text-sm hover:bg-[rgb(194,57,153)] transition-colors font-medium flex items-center justify-center"
                        >
                          <span className="mr-2">📋</span>
                          Copiar Guión Completo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Context Analysis */}
            <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  💡 Insights del Nicho
                </h3>
                <p className="text-blue-800 text-sm">
                  {generationResult.contextAnalysis.nicheInsights}
                </p>
              </div>
              
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-3">
                  🎯 Recomendaciones de Audiencia
                </h3>
                <p className="text-green-800 text-sm">
                  {generationResult.contextAnalysis.audienceRecommendations}
                </p>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-3">
                  📱 Tips de Plataforma
                </h3>
                <p className="text-purple-800 text-sm">
                  {generationResult.contextAnalysis.platformTips}
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">
                  🔥 Oportunidades Trending
                </h3>
                <div className="space-y-1">
                  {generationResult.contextAnalysis.trendingOpportunities.map((opportunity, index) => (
                    <div key={index} className="text-sm text-orange-800">
                      • {opportunity}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🎯 Estrategia de Hook
                </h3>
                <p className="text-gray-700 text-sm">
                  {generationResult.bestPractices.hookStrategy}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  📝 Estructura de Contenido
                </h3>
                <p className="text-gray-700 text-sm">
                  {generationResult.bestPractices.contentStructure}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  🎬 Tips Visuales
                </h3>
                <p className="text-gray-700 text-sm">
                  {generationResult.bestPractices.visualTips}
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  #️⃣ Estrategia de Hashtags
                </h3>
                <p className="text-gray-700 text-sm">
                  {generationResult.bestPractices.hashtagStrategy}
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="max-w-3xl mx-auto mt-16 text-center bg-gradient-to-r from-[rgb(214,77,173)]/10 to-[rgb(244,102,110)]/10 rounded-2xl p-8 border border-[rgb(214,77,173)]/20">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ¿Necesitas ayuda implementando estos guiones?
              </h3>
              <p className="text-gray-600 mb-6">
                Nuestro equipo de expertos en SMM puede ayudarte a crear contenido que realmente convierte.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/tools" 
                  className="px-6 py-3 bg-white text-[rgb(214,77,173)] border border-[rgb(214,77,173)] rounded-lg hover:bg-[rgb(214,77,173)] hover:text-white transition-all duration-300"
                >
                  Ver más herramientas
                </a>
                <a 
                  href="#" 
                  className="px-6 py-3 bg-[rgb(214,77,173)] text-white rounded-lg hover:bg-[rgb(194,57,153)] transition-all duration-300"
                >
                  Contactar expertos
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
} 