'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// ===============================================
// TYPES
// ===============================================

interface GeneratedBio {
  id: string;
  bioText: string;
  bioType: 'minimalist' | 'emoji_rich' | 'list_format' | 'storytelling' | 'cta_focused';
  characterCount: number;
  emojiCount: number;
  hasCallToAction: boolean;
  keywords: string[];
  reasoning: string;
}

interface BioGenerationResult {
  generatedBios: GeneratedBio[];
  contextAnalysis: {
    nicheInsights: string;
    audienceRecommendations: string;
    competitorTips: string;
    optimizationSuggestions: string[];
  };
  bestPractices: {
    characterLimit: string;
    emojiUsage: string;
    ctaPlacement: string;
    keywordStrategy: string;
  };
  generatedAt: string;
}

export default function InstagramBioGenerator() {
  const [formData, setFormData] = useState({
    accountType: '',
    niche: '',
    targetAudience: '',
    primaryGoal: '',
    personalityTone: '',
    servicesProducts: '',
    website: '',
    location: '',
    languagePreference: 'spanish'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationResult, setGenerationResult] = useState<BioGenerationResult | null>(null);
  const [error, setError] = useState<string>('');

  const accountTypes = [
    { value: 'personal', label: 'Personal', icon: '👤', description: 'Cuenta personal' },
    { value: 'business', label: 'Negocio', icon: '🏢', description: 'Empresa o marca' },
    { value: 'influencer', label: 'Influencer', icon: '⭐', description: 'Creador con audiencia' },
    { value: 'artist', label: 'Artista', icon: '🎨', description: 'Músico, actor, artista' },
    { value: 'creator', label: 'Creador', icon: '📱', description: 'Contenido digital' }
  ];

  const goals = [
    { value: 'followers', label: 'Conseguir Seguidores', icon: '👥', description: 'Hacer crecer mi audiencia' },
    { value: 'sales', label: 'Generar Ventas', icon: '💰', description: 'Vender productos/servicios' },
    { value: 'branding', label: 'Construir Marca', icon: '🏆', description: 'Posicionamiento y reconocimiento' },
    { value: 'community', label: 'Crear Comunidad', icon: '🤝', description: 'Engagement y conexión' },
    { value: 'awareness', label: 'Aumentar Conciencia', icon: '📢', description: 'Visibilidad y alcance' }
  ];

  const tones = [
    { value: 'professional', label: 'Profesional', icon: '👔', description: 'Serio y experto' },
    { value: 'casual', label: 'Casual', icon: '😊', description: 'Relajado y amigable' },
    { value: 'funny', label: 'Divertido', icon: '😄', description: 'Humor y entretenimiento' },
    { value: 'inspirational', label: 'Inspiracional', icon: '✨', description: 'Motivacional y positivo' },
    { value: 'edgy', label: 'Atrevido', icon: '🔥', description: 'Único y disruptivo' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsGenerating(true);

    try {
      const response = await fetch('/api/bio-generator/generate', {
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

  const copyBio = (bioText: string) => {
    navigator.clipboard.writeText(bioText);
  };

  const getBioTypeLabel = (bioType: string) => {
    const labels = {
      minimalist: 'Minimalista',
      emoji_rich: 'Rica en Emojis',
      list_format: 'Formato Lista',
      storytelling: 'Narrativa',
      cta_focused: 'Enfocada en CTA'
    };
    return labels[bioType as keyof typeof labels] || bioType;
  };

  const getBioTypeIcon = (bioType: string) => {
    const icons = {
      minimalist: '🎯',
      emoji_rich: '🎨',
      list_format: '📋',
      storytelling: '📖',
      cta_focused: '🚀'
    };
    return icons[bioType as keyof typeof icons] || '📝';
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
                  Bio de Instagram
                </span>
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 px-4">
              Crea la biografía perfecta con{" "}
              <span className="text-[rgb(214,77,173)] font-semibold">
                IA + análisis estratégico
              </span>
              . <br className="hidden sm:block"/>
              5 estilos optimizados para maximizar tu conversión.
            </p>
            
            {/* Call to Action */}
            <div className="flex justify-center px-4">
              <a 
                href="#generador"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[rgb(214,77,173)] text-white font-medium text-sm sm:text-base rounded-full hover:bg-[rgb(194,57,153)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto justify-center max-w-xs"
              >
                Generar mi bio
                <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Generator Form */}
      <section id="generador" className="py-24 md:py-32 bg-gradient-to-b from-[#f5f5f7] to-white relative overflow-hidden">
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
                    Personaliza tu biografía
                  </h2>
                  <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light">
                    Cuéntanos sobre tu cuenta para generar biografías optimizadas
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Account Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Tipo de cuenta *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {accountTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData({...formData, accountType: type.value})}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-[rgb(214,77,173)] hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
                            formData.accountType === type.value
                              ? 'border-[rgb(214,77,173)] bg-gradient-to-r from-pink-50 to-purple-50 shadow-md'
                              : 'border-gray-200 bg-white hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-3">{type.icon}</span>
                            <span className="font-medium text-gray-900">{type.label}</span>
                          </div>
                          <div className="text-xs text-gray-600">{type.description}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Niche and Target Audience in Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Niche */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        <span className="flex items-center">
                          <span className="text-lg mr-2">🎯</span>
                          Nicho/Industria *
                        </span>
                      </label>
                      <input
                        type="text"
                        value={formData.niche}
                        onChange={(e) => setFormData({...formData, niche: e.target.value})}
                        placeholder="Ej: Fitness, Comida, Moda, Marketing..."
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 text-base"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Tu área de especialización o industria</p>
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
                        placeholder="Ej: Mujeres 25-40 años interesadas en fitness..."
                        className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 text-base"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">Describe a quién quieres llegar</p>
                    </div>
                  </div>

                  {/* Primary Goal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Objetivo principal *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {goals.map((goal) => (
                        <button
                          key={goal.value}
                          type="button"
                          onClick={() => setFormData({...formData, primaryGoal: goal.value})}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-[rgb(214,77,173)] hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
                            formData.primaryGoal === goal.value
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

                  {/* Personality Tone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Tono de personalidad *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {tones.map((tone) => (
                        <button
                          key={tone.value}
                          type="button"
                          onClick={() => setFormData({...formData, personalityTone: tone.value})}
                          className={`p-4 rounded-xl border-2 text-left transition-all duration-200 hover:border-[rgb(214,77,173)] hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 ${
                            formData.personalityTone === tone.value
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

                  {/* Optional Fields Section */}
                  <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center">
                      <span className="text-lg mr-2">⚙️</span>
                      Información adicional (opcional)
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Estos campos nos ayudan a personalizar mejor tu biografía</p>
                    
                    <div className="space-y-4">
                      {/* Services/Products */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <span className="flex items-center">
                            <span className="text-base mr-2">💼</span>
                            Servicios/Productos
                          </span>
                        </label>
                        <textarea
                          value={formData.servicesProducts}
                          onChange={(e) => setFormData({...formData, servicesProducts: e.target.value})}
                          placeholder="Ej: Programas de fitness online, consultoría nutricional..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 resize-none bg-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Website */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="flex items-center">
                              <span className="text-base mr-2">🌐</span>
                              Website/Link
                            </span>
                          </label>
                          <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData({...formData, website: e.target.value})}
                            placeholder="https://mi-sitio-web.com"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 bg-white"
                          />
                        </div>

                        {/* Location */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <span className="flex items-center">
                              <span className="text-base mr-2">📍</span>
                              Ubicación
                            </span>
                          </label>
                          <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="Ej: Madrid, España"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-transparent transition-all duration-200 bg-white"
                          />
                        </div>
                      </div>
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
                      disabled={isGenerating || !formData.accountType || !formData.niche || !formData.targetAudience || !formData.primaryGoal || !formData.personalityTone}
                      className="w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white py-5 px-8 rounded-xl font-semibold text-lg hover:from-[rgb(194,57,153)] hover:to-[rgb(224,82,90)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:from-gray-400 disabled:to-gray-500 disabled:shadow-none"
                    >
                      {isGenerating ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-lg">Creando tu biografía perfecta...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          <span className="text-2xl mr-3">✨</span>
                          <span>Generar biografías con IA</span>
                          <svg className="ml-3 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </div>
                      )}
                    </button>
                    {(!formData.accountType || !formData.niche || !formData.targetAudience || !formData.primaryGoal || !formData.personalityTone) && (
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
                BIOGRAFÍAS GENERADAS
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 text-gray-900 tracking-tight">
                Tus{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                  biografías optimizadas
                </span>
              </h2>
            </div>

            {/* Generated Bios Grid */}
            <div className="max-w-6xl mx-auto space-y-8">
              {generationResult.generatedBios.map((bio) => (
                <div key={bio.id} className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl p-6 border border-gray-100 shadow-lg">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    {/* Bio Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{getBioTypeIcon(bio.bioType)}</span>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {getBioTypeLabel(bio.bioType)}
                          </h3>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-4 mb-4 border-l-4 border-[rgb(214,77,173)]">
                        <p className="text-gray-900 font-medium leading-relaxed whitespace-pre-line">
                          {bio.bioText}
                        </p>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-4">
                        {bio.reasoning}
                      </p>
                    </div>

                    {/* Bio Stats */}
                    <div className="lg:w-80">
                      <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <h4 className="font-semibold text-gray-900 mb-3">Estadísticas</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Caracteres:</span>
                            <span className="font-medium text-gray-900">{bio.characterCount}/150</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Emojis:</span>
                            <span className="font-medium text-gray-900">{bio.emojiCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Call to Action:</span>
                            <span className={`font-medium ${bio.hasCallToAction ? 'text-green-600' : 'text-red-600'}`}>
                              {bio.hasCallToAction ? 'Sí' : 'No'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Keywords:</span>
                            <span className="font-medium text-gray-900">{bio.keywords.length}</span>
                          </div>
                        </div>
                        
                        {bio.keywords.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex flex-wrap gap-1">
                              {bio.keywords.map((keyword, index) => (
                                <span key={index} className="px-2 py-1 bg-[rgb(214,77,173)]/10 text-[rgb(214,77,173)] text-xs rounded-full">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        <button
                          onClick={() => copyBio(bio.bioText)}
                          className="w-full mt-4 bg-[rgb(214,77,173)] text-white py-2 px-4 rounded-lg text-sm hover:bg-[rgb(194,57,153)] transition-colors"
                        >
                          Copiar Bio
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
                  🏆 Tips de Competencia
                </h3>
                <p className="text-purple-800 text-sm">
                  {generationResult.contextAnalysis.competitorTips}
                </p>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-900 mb-3">
                  📋 Mejores Prácticas
                </h3>
                <div className="space-y-2 text-sm text-orange-800">
                  <p><strong>Límite de caracteres:</strong> {generationResult.bestPractices.characterLimit}</p>
                  <p><strong>Uso de emojis:</strong> {generationResult.bestPractices.emojiUsage}</p>
                  <p><strong>Estrategia de keywords:</strong> {generationResult.bestPractices.keywordStrategy}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
} 