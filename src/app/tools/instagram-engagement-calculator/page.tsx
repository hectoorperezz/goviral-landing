'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, TrendingUp, Heart, MessageCircle, BarChart3, Calendar, Users, ExternalLink } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EngagementStats {
  avg_likes: number;
  avg_comments: number;
  engagement_rate: number;
  follower_count: number;
}

interface IndividualPost {
  post_id: string;
  post_url: string;
  likes: number;
  comments: number;
  engagement_rate: number;
  post_date: string;
  image_url?: string;
  caption?: string;
  media_type?: number;
}

interface MonthlyHistory {
  month: number;
  year: number;
  avg_likes: number;
  avg_comments: number;
  engagement_rate: number;
}

interface EngagementData {
  current_stats: EngagementStats;
  individual_posts: IndividualPost[];
  monthly_history: MonthlyHistory[];
  last_analyzed_at: string;
  cache_expires_at: string;
}

export default function InstagramEngagementCalculator() {
  const [username, setUsername] = useState('');
  const [engagementData, setEngagementData] = useState<EngagementData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!username.trim()) {
      setError('Por favor, ingresa un nombre de usuario de Instagram');
      return;
    }

    setIsLoading(true);
    setError('');
    setEngagementData(null);

    try {
      const cleanUsername = username.replace(/^@/, '').toLowerCase().trim();
      const response = await fetch(`/api/instagram/engagement-analysis?username=${encodeURIComponent(cleanUsername)}`);
      const result = await response.json();

      if (result.success) {
        setEngagementData(result.data);
      } else {
        setError(result.message || 'No se pudo analizar el engagement del perfil');
      }
    } catch (err) {
      setError('Error al conectar con el servidor. Por favor, inténtalo de nuevo.');
      console.error('Engagement analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Hero Section - Tool Focused */}
      <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden bg-gradient-to-b from-white to-[#f5f5f7]">
        {/* Subtle Background Elements - Reduced opacity and repositioned for mobile */}
        <div className="absolute top-20 sm:top-20 -left-20 sm:left-10 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-1 sm:opacity-3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 sm:bottom-20 -right-20 sm:right-10 w-48 sm:w-96 h-48 sm:h-96 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-1 sm:opacity-3 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6 sm:mb-8">
              <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 transition-all duration-300 hover:scale-105">
                Herramienta Gratuita
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900 mb-4 sm:mb-6 px-2">
                <span className="transition-all duration-300 hover:scale-105 inline-block">
                  Instagram{" "}
                </span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] via-[rgb(244,102,110)] to-[rgb(214,77,173)] animate-gradient-x font-extrabold">
                  Engagement Calculator
                </span>
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 px-4">
              Analiza el engagement real de cualquier perfil de Instagram con{" "}
              <span className="text-[rgb(214,77,173)] font-semibold">
                estadísticas detalladas
              </span>
              . <br className="hidden sm:block"/>
              Descubre likes, comentarios y evolución histórica de los últimos 10 posts.
            </p>
            
            {/* Search Input */}
            <div className="flex justify-center px-4">
              <form onSubmit={handleSearch} className="relative max-w-md w-full">
                <div className="flex h-14">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Buscar usuario (ej: mrbeast)"
                      className="block w-full h-full pl-10 pr-3 border border-gray-300 rounded-l-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-[rgb(214,77,173)] text-lg shadow-lg"
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !username.trim()}
                    className="px-6 h-full bg-[rgb(214,77,173)] text-white font-medium rounded-r-full hover:bg-[rgb(194,57,153)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Analizar'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {error && (
              <div className="text-center mt-6">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-red-50 text-red-700">
                  {error}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results Section */}
      {engagementData && (
        <section className="py-24 md:py-32 bg-gradient-to-b from-[#f5f5f7] to-white relative overflow-hidden">
          {/* Instagram-inspired background elements */}
          <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-5 rounded-full blur-3xl"></div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            {/* Instagram Icon */}
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-8">
              <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full flex items-center justify-center">
                    <Heart className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {formatNumber(engagementData.current_stats.avg_likes)}
                </h4>
                <p className="text-gray-600 font-medium">Promedio Likes</p>
              </div>

              <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {formatNumber(engagementData.current_stats.avg_comments)}
                </h4>
                <p className="text-gray-600 font-medium">Promedio Comentarios</p>
              </div>

              <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {engagementData.current_stats.engagement_rate.toFixed(2)}%
                </h4>
                <p className="text-gray-600 font-medium">Engagement Rate</p>
              </div>

              <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {formatNumber(engagementData.current_stats.follower_count)}
                </h4>
                <p className="text-gray-600 font-medium">Seguidores</p>
              </div>
            </div>

            {/* Individual Posts Section */}
            <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 sm:p-8 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]"></div>
              
              <div className="relative z-10">
                <div className="text-center mb-6">
                  <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-4">
                    ANÁLISIS INDIVIDUAL
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    Engagement por Post
                  </h3>
                  <p className="text-gray-600">Últimos 10 posts analizados</p>
                </div>
            
            {/* Posts Bar Chart */}
            <div className="h-80 mb-8 bg-white rounded-xl border border-gray-100 p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={engagementData.individual_posts.slice(0, 10).map((post, idx) => ({
                    ...post,
                    postNumber: `#${idx + 1}`
                  }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <defs>
                    <linearGradient id="likesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgb(214,77,173)" />
                      <stop offset="100%" stopColor="rgb(244,102,110)" />
                    </linearGradient>
                    <linearGradient id="commentsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="postNumber"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px -10px rgba(0,0,0,0.1)',
                      fontSize: '14px'
                    }}
                    formatter={(value, name) => [
                      formatNumber(Number(value)), 
                      name === 'likes' ? '❤️ Likes' : '💬 Comentarios'
                    ]}
                    labelFormatter={(label) => `Post ${label}`}
                  />
                  <Bar 
                    dataKey="likes" 
                    fill="url(#likesGradient)" 
                    name="likes"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                  <Bar 
                    dataKey="comments" 
                    fill="url(#commentsGradient)" 
                    name="comments"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Modern Posts Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {engagementData.individual_posts.slice(0, 10).map((post, index) => (
                <div 
                  key={post.post_id} 
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Post Image/Thumbnail */}
                  <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {post.image_url ? (
                      <img 
                        src={post.image_url} 
                        alt={`Post ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/instagram.png';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full flex items-center justify-center">
                          <ExternalLink className="w-8 h-8 text-white" />
                        </div>
                      </div>
                    )}
                    
                    {/* Media Type Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 text-white text-xs font-medium">
                        {post.media_type === 2 ? '🎥 Video' : post.media_type === 8 ? '📸 Carousel' : '📷 Foto'}
                      </div>
                    </div>
                    
                    {/* Engagement Rate Overlay */}
                    <div className="absolute bottom-3 left-3">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-bold text-gray-900">
                        {post.engagement_rate.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        Post #{index + 1}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(post.post_date).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'short' 
                        })}
                      </span>
                    </div>
                    
                    {/* Caption Preview */}
                    {post.caption && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>
                    )}
                    
                    {/* Engagement Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatNumber(post.likes)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {formatNumber(post.comments)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Engagement Bar */}
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min(100, Math.max(5, post.engagement_rate * 20))}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* View Post Button */}
                    <a 
                      href={post.post_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white text-sm font-medium py-2.5 px-4 rounded-xl hover:shadow-lg hover:shadow-pink-500/25 transition-all duration-300 flex items-center justify-center gap-2 group"
                    >
                      <span>Ver en Instagram</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
              </div>
            </div>

            {/* Monthly Evolution Chart */}
            {engagementData.monthly_history.length > 0 && (
              <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 sm:p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-4">
                      EVOLUCIÓN HISTÓRICA
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Engagement Mensual
                    </h3>
                    <p className="text-gray-600">Tendencias de engagement en el tiempo</p>
                  </div>
              
                <div className="h-64 sm:h-80 w-full bg-white rounded-xl border border-gray-100 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={engagementData.monthly_history} 
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <defs>
                        <linearGradient id="likesLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="rgb(214,77,173)" />
                          <stop offset="100%" stopColor="rgb(244,102,110)" />
                        </linearGradient>
                        <linearGradient id="commentsLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#60a5fa" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="engagementLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#34d399" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis 
                        dataKey={(item) => `${item.month}/${item.year}`}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={{ stroke: '#e2e8f0' }}
                      />
                      <YAxis 
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        axisLine={{ stroke: '#e2e8f0' }}
                        tickLine={{ stroke: '#e2e8f0' }}
                        tickFormatter={formatNumber}
                      />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
                          fontSize: '14px'
                        }}
                        formatter={(value, name) => {
                          if (name === 'engagement_rate') return [Number(value).toFixed(2) + '%', '📈 Engagement Rate'];
                          return [formatNumber(Number(value)), name === 'avg_likes' ? '❤️ Promedio Likes' : '💬 Promedio Comentarios'];
                        }}
                        labelFormatter={(label) => `📅 ${label}`}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avg_likes" 
                        stroke="url(#likesLineGradient)" 
                        strokeWidth={4}
                        dot={{ 
                          fill: 'white', 
                          stroke: 'rgb(214,77,173)', 
                          strokeWidth: 3, 
                          r: 5,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}
                        activeDot={{ 
                          r: 8, 
                          fill: 'rgb(214,77,173)', 
                          stroke: 'white',
                          strokeWidth: 3,
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                        }}
                        name="avg_likes"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="avg_comments" 
                        stroke="url(#commentsLineGradient)" 
                        strokeWidth={4}
                        dot={{ 
                          fill: 'white', 
                          stroke: '#3b82f6', 
                          strokeWidth: 3, 
                          r: 5,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}
                        activeDot={{ 
                          r: 8, 
                          fill: '#3b82f6', 
                          stroke: 'white',
                          strokeWidth: 3,
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                        }}
                        name="avg_comments"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="engagement_rate" 
                        stroke="url(#engagementLineGradient)" 
                        strokeWidth={4}
                        dot={{ 
                          fill: 'white', 
                          stroke: '#10b981', 
                          strokeWidth: 3, 
                          r: 5,
                          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                        }}
                        activeDot={{ 
                          r: 8, 
                          fill: '#10b981', 
                          stroke: 'white',
                          strokeWidth: 3,
                          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                        }}
                        name="engagement_rate"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                </div>
              </div>
            )}

            {/* Cache Info */}
            <div className="mt-6 text-center text-sm text-gray-500">
              <p>
                Datos actualizados: {formatDate(engagementData.last_analyzed_at)} | 
                Próxima actualización: {formatDate(engagementData.cache_expires_at)}
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  );
} 