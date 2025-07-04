'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'
import Image from 'next/image'
import { debounce } from 'lodash'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Search, TrendingUp, Users, Eye, Calendar, Target, BarChart3, Zap, ExternalLink } from 'lucide-react'

interface InstagramUser {
  id: string
  username: string
  fullName: string
  followerCount: number
  followingCount: number
  mediaCount: number
  profilePicUrl: string
  isVerified: boolean
  isPrivate: boolean
  biography: string
  externalUrl: string
  growthStats?: {
    current: number
    dailyChange: number
    totalChange: number
    growthRate: number
    daysTracked: number
  }
  isNewUser: boolean
}

interface HistoryData {
  date: string
  followers: number
  following: number
  posts: number
  timestamp: string
}

export default function InstagramFollowerTracker() {
  const [searchTerm, setSearchTerm] = useState('')
  const [userData, setUserData] = useState<InstagramUser | null>(null)
  const [historyData, setHistoryData] = useState<HistoryData[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [error, setError] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  const fetchUserHistory = async (username: string) => {
    if (!username) return

    setLoadingHistory(true)
    try {
      const response = await fetch('/api/instagram/user-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, days: 30 })
      })

      const result = await response.json()
      if (result.success && result.data.history.length > 0) {
        setHistoryData(result.data.history)
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setLoadingHistory(false)
    }
  }

  const searchUser = async (username: string) => {
    if (!username.trim()) {
      setError('Por favor ingresa un nombre de usuario')
      return
    }

    setLoading(true)
    setError('')
    setUserData(null)
    setHistoryData([])

    try {
      const response = await fetch('/api/instagram/user-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      })

      const result = await response.json()

      if (result.success) {
        setUserData(result.data)
        // Fetch history data for existing users
        if (!result.data.isNewUser) {
          await fetchUserHistory(result.data.username)
        }
      } else {
        setError(result.error || 'Usuario no encontrado')
      }
    } catch (err) {
      setError('Error al buscar el usuario')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    searchUser(searchTerm)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    // Clear error when user starts typing
    if (error) setError('')
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

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
                Instagram{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] via-[rgb(244,102,110)] to-[rgb(214,77,173)] animate-gradient-x font-extrabold">
                  Follower Tracker
                </span>
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 px-4">
              Rastrea el crecimiento de cualquier perfil de Instagram con{" "}
              <span className="text-[rgb(214,77,173)] font-semibold">
                analytics en tiempo real
              </span>
              . <br className="hidden sm:block"/>
              Descubre tendencias, engagement y oportunidades de crecimiento.
            </p>
            
            {/* Search Input */}
            <div className="flex justify-center px-4">
              <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
                <div className="flex h-14">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={handleInputChange}
                      placeholder="Buscar usuario (ej: mrbeast)"
                      className="block w-full h-full pl-10 pr-3 border border-gray-300 rounded-l-full leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-[rgb(214,77,173)] focus:border-[rgb(214,77,173)] text-lg shadow-lg"
                      disabled={loading}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !searchTerm.trim()}
                    className="px-6 h-full bg-[rgb(214,77,173)] text-white font-medium rounded-r-full hover:bg-[rgb(194,57,153)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      'Buscar'
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
      {userData && (
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

            {/* Profile Card */}
            <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 sm:p-8 md:p-12 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]"></div>
              
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 relative z-10">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={userData.profilePicUrl}
                      alt={userData.fullName}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[rgb(214,77,173)]/20"
                    />
                    {userData.isVerified && (
                      <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {userData.fullName}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">@{userData.username}</p>
                  {userData.biography && (
                    <p className="text-gray-600 mb-4 max-w-md">{userData.biography}</p>
                  )}
                  {userData.externalUrl && (
                    <a
                      href={userData.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-[rgb(214,77,173)] hover:text-[rgb(194,57,153)] transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      {userData.externalUrl}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
              <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full flex items-center justify-center">
                    <Users className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                  {userData.growthStats && userData.growthStats.dailyChange !== 0 && (
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      userData.growthStats.dailyChange > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      <TrendingUp className={`w-3 h-3 mr-1 ${
                        userData.growthStats.dailyChange < 0 ? 'transform rotate-180' : ''
                      }`} />
                      {userData.growthStats.dailyChange > 0 ? '+' : ''}{formatNumber(userData.growthStats.dailyChange)}
                    </div>
                  )}
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {formatNumber(userData.followerCount)}
                </h4>
                <p className="text-gray-600 font-medium">Seguidores</p>
              </div>

              <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Eye className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {formatNumber(userData.followingCount)}
                </h4>
                <p className="text-gray-600 font-medium">Siguiendo</p>
              </div>

              <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <BarChart3 className="w-6 sm:w-8 h-6 sm:h-8 text-white" />
                  </div>
                </div>
                <h4 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {formatNumber(userData.mediaCount)}
                </h4>
                <p className="text-gray-600 font-medium">Publicaciones</p>
              </div>
            </div>

            {/* Growth Analytics Chart */}
            {historyData.length > 1 && !userData.isNewUser && (
              <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 sm:p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-4">
                      ANÁLISIS DE CRECIMIENTO
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Evolución de Seguidores
                    </h3>
                    <p className="text-gray-600">Últimos 30 días de actividad</p>
                  </div>

                  <div className="h-64 sm:h-80 w-full">
                    {loadingHistory ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(214,77,173)]"></div>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#666"
                            fontSize={12}
                          />
                          <YAxis 
                            stroke="#666"
                            fontSize={12}
                            tickFormatter={formatNumber}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e5e5',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            formatter={(value: number) => [formatNumber(value), 'Seguidores']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="followers" 
                            stroke="url(#gradient)" 
                            strokeWidth={3}
                            dot={{ fill: 'rgb(214,77,173)', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, fill: 'rgb(214,77,173)' }}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="rgb(214,77,173)" />
                              <stop offset="100%" stopColor="rgb(244,102,110)" />
                            </linearGradient>
                          </defs>
                        </LineChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Growth Stats */}
                  {userData.growthStats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                          {userData.growthStats.dailyChange > 0 ? '+' : ''}{formatNumber(userData.growthStats.dailyChange)}
                        </div>
                        <div className="text-gray-600 text-xs sm:text-sm">Cambio Diario</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                          {userData.growthStats.totalChange > 0 ? '+' : ''}{formatNumber(userData.growthStats.totalChange)}
                        </div>
                        <div className="text-gray-600 text-xs sm:text-sm">Cambio Total</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                          {userData.growthStats.growthRate > 0 ? '+' : ''}{userData.growthStats.growthRate.toFixed(1)}%
                        </div>
                        <div className="text-gray-600 text-xs sm:text-sm">Tasa de Crecimiento</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                          {userData.growthStats.daysTracked}
                        </div>
                        <div className="text-gray-600 text-xs sm:text-sm">Días Rastreados</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* New User Message */}
            {userData.isNewUser && (
              <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 sm:p-8 mb-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]"></div>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mb-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                    ¡Rastreando @{userData.username}!
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Hemos añadido este perfil a nuestro sistema. Vuelve mañana para ver analytics de crecimiento y datos históricos.
                  </p>
                  <div className="inline-flex items-center px-4 py-2 bg-green-50 text-green-700 rounded-full border border-green-200">
                    <Zap className="w-4 h-4 mr-2" />
                    Seguimiento activado
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-[#f5f5f7] to-white relative overflow-hidden">
        <div className="hidden sm:block absolute top-40 left-0 w-48 md:w-64 h-48 md:h-64 bg-[rgb(214,77,173)] opacity-3 md:opacity-5 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-40 right-0 w-64 md:w-80 h-64 md:h-80 bg-[rgb(244,102,110)] opacity-3 md:opacity-5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 sm:p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]"></div>
              
              <div className="relative z-10">
                <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 sm:mb-8">
                  CRECE TU CUENTA
                </span>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight px-2">
                  ¿Quieres hacer crecer{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                    tu Instagram
                  </span>
                  ?
                </h2>
                
                <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed font-light px-4">
                  Consigue seguidores reales, engagement auténtico y crecimiento exponencial con nuestras estrategias probadas
                </p>

                <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
                  <a
                    href="/plan-configurator"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[rgb(214,77,173)] text-white font-medium text-sm sm:text-base rounded-full hover:bg-[rgb(194,57,153)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full"
                  >
                    Empezar a Crecer Ahora
                    <TrendingUp className="ml-2 w-4 h-4" />
                  </a>
                  
                  <a
                    href="/tools/reelviews-booster"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-[rgb(214,77,173)] border-2 border-[rgb(214,77,173)] font-medium text-sm sm:text-base rounded-full hover:bg-[rgb(214,77,173)] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full"
                  >
                    500 Views Gratis para Reels
                  </a>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(214,77,173)] mb-1 sm:mb-2">6.000+</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Cuentas analizadas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(214,77,173)] mb-1 sm:mb-2">24/7</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Seguimiento automático</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(214,77,173)] mb-1 sm:mb-2">100%</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Datos en tiempo real</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
} 