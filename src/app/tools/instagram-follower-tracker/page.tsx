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

// Add interpolation function to smooth chart data
const interpolateData = (data: HistoryData[], targetPoints: number = 15): HistoryData[] => {
  if (!data || data.length <= 2) return data;
  
  // For small datasets, use fewer interpolation points
  if (data.length <= 5) {
    targetPoints = Math.min(targetPoints, data.length + 2);
  }
  
  // Never interpolate to more points than makes sense
  targetPoints = Math.min(targetPoints, data.length * 3);

  try {
    // Sort by timestamp to ensure chronological order
    const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    const firstDate = new Date(sortedData[0].timestamp);
    const lastDate = new Date(sortedData[sortedData.length - 1].timestamp);
    
    // Validate dates
    if (isNaN(firstDate.getTime()) || isNaN(lastDate.getTime())) {
      console.warn('Invalid dates in interpolation data');
      return sortedData;
    }
    
    const totalDuration = lastDate.getTime() - firstDate.getTime();
    
    if (totalDuration <= 0) return sortedData;

    const interpolatedData: HistoryData[] = [];
    const interval = totalDuration / (targetPoints - 1);

    for (let i = 0; i < targetPoints; i++) {
      const targetTime = firstDate.getTime() + (interval * i);
      const targetDate = new Date(targetTime);

      // Find the two closest data points
      let beforeIndex = -1;
      let afterIndex = -1;

      for (let j = 0; j < sortedData.length - 1; j++) {
        const currentTime = new Date(sortedData[j].timestamp).getTime();
        const nextTime = new Date(sortedData[j + 1].timestamp).getTime();

        if (targetTime >= currentTime && targetTime <= nextTime) {
          beforeIndex = j;
          afterIndex = j + 1;
          break;
        }
      }

      // If we're before the first point, use the first point
      if (beforeIndex === -1) {
        beforeIndex = 0;
        afterIndex = 0;
      }
      // If we're after the last point, use the last point
      else if (afterIndex === -1) {
        beforeIndex = sortedData.length - 1;
        afterIndex = sortedData.length - 1;
      }

      const beforeData = sortedData[beforeIndex];
      const afterData = sortedData[afterIndex];

      if (beforeIndex === afterIndex) {
        // Exact match or boundary case
        interpolatedData.push({
          date: targetDate.toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric'
          }),
          followers: beforeData.followers,
          following: beforeData.following,
          posts: beforeData.posts,
          timestamp: targetDate.toISOString()
        });
      } else {
        // Interpolate between two points
        const beforeTime = new Date(beforeData.timestamp).getTime();
        const afterTime = new Date(afterData.timestamp).getTime();
        const ratio = (targetTime - beforeTime) / (afterTime - beforeTime);

        interpolatedData.push({
          date: targetDate.toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric'
          }),
          followers: Math.round(beforeData.followers + (afterData.followers - beforeData.followers) * ratio),
          following: Math.round(beforeData.following + (afterData.following - beforeData.following) * ratio),
          posts: Math.round(beforeData.posts + (afterData.posts - beforeData.posts) * ratio),
          timestamp: targetDate.toISOString()
        });
      }
    }

    return interpolatedData;
  } catch (error) {
    console.error('Error in interpolation:', error);
    return data;
  }
};

type TimePeriod = 'daily' | 'weekly' | 'monthly'

export default function InstagramFollowerTracker() {
  const [searchTerm, setSearchTerm] = useState('')
  const [userData, setUserData] = useState<InstagramUser | null>(null)
  const [historyData, setHistoryData] = useState<HistoryData[]>([])
  const [rawHistoryData, setRawHistoryData] = useState<HistoryData[]>([])
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('daily')
  const [loading, setLoading] = useState(false)
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [error, setError] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Function to process data based on selected time period
  const processDataByTimePeriod = (data: HistoryData[], period: TimePeriod): HistoryData[] => {
    if (data.length === 0) return data;
    
    // For very small datasets, always use daily processing regardless of selected period
    if (data.length <= 2) {
      return data.map(item => ({
        ...item,
        date: new Date(item.timestamp).toLocaleDateString('es-ES', {
          month: 'short',
          day: 'numeric'
        })
      })).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    // Sort by timestamp
    const sortedData = [...data].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    switch (period) {
      case 'daily':
        // Group by day and keep only one record per day (latest of the day)
        const dailyMap = new Map<string, HistoryData>();
        sortedData.forEach(item => {
          const dateKey = new Date(item.timestamp).toDateString();
          const existingItem = dailyMap.get(dateKey);
          if (!existingItem || new Date(item.timestamp) > new Date(existingItem.timestamp)) {
            dailyMap.set(dateKey, {
              ...item,
              date: new Date(item.timestamp).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric'
              })
            });
          }
        });
        return Array.from(dailyMap.values()).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      case 'weekly':
        // For datasets smaller than a week, fallback to daily
        if (sortedData.length < 3) {
          return processDataByTimePeriod(data, 'daily');
        }
        
        // Group by week and average the values
        const weeklyMap = new Map<string, {data: HistoryData[], totalFollowers: number, totalFollowing: number, totalPosts: number}>();
        sortedData.forEach(item => {
          try {
            const date = new Date(item.timestamp);
            if (isNaN(date.getTime())) {
              console.warn('Invalid timestamp:', item.timestamp);
              return;
            }
            
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            weekStart.setHours(0, 0, 0, 0);
            const weekKey = weekStart.toDateString();
            
            if (!weeklyMap.has(weekKey)) {
              weeklyMap.set(weekKey, {data: [], totalFollowers: 0, totalFollowing: 0, totalPosts: 0});
            }
            
            const weekData = weeklyMap.get(weekKey)!;
            weekData.data.push(item);
            weekData.totalFollowers += item.followers;
            weekData.totalFollowing += item.following;
            weekData.totalPosts += item.posts;
          } catch (error) {
            console.warn('Error processing weekly data for item:', item, error);
          }
        });

        const weeklyResult = Array.from(weeklyMap.entries())
          .filter(([_, weekData]) => weekData.data.length > 0)
          .map(([weekKey, weekData]) => {
            const count = weekData.data.length;
            return {
              date: new Date(weekKey).toLocaleDateString('es-ES', {
                month: 'short',
                day: 'numeric'
              }),
              followers: Math.round(weekData.totalFollowers / count),
              following: Math.round(weekData.totalFollowing / count),
              posts: Math.round(weekData.totalPosts / count),
              timestamp: weekKey
            };
          })
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          
        // Fallback to daily if weekly processing failed
        return weeklyResult.length > 0 ? weeklyResult : processDataByTimePeriod(data, 'daily');

      case 'monthly':
        // For datasets smaller than a month, fallback to daily
        if (sortedData.length < 5) {
          return processDataByTimePeriod(data, 'daily');
        }
        
        // Group by month and average the values
        const monthlyMap = new Map<string, {data: HistoryData[], totalFollowers: number, totalFollowing: number, totalPosts: number}>();
        sortedData.forEach(item => {
          try {
            const date = new Date(item.timestamp);
            if (isNaN(date.getTime())) {
              console.warn('Invalid timestamp:', item.timestamp);
              return;
            }
            
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            
            if (!monthlyMap.has(monthKey)) {
              monthlyMap.set(monthKey, {data: [], totalFollowers: 0, totalFollowing: 0, totalPosts: 0});
            }
            
            const monthData = monthlyMap.get(monthKey)!;
            monthData.data.push(item);
            monthData.totalFollowers += item.followers;
            monthData.totalFollowing += item.following;
            monthData.totalPosts += item.posts;
          } catch (error) {
            console.warn('Error processing monthly data for item:', item, error);
          }
        });

        const monthlyResult = Array.from(monthlyMap.entries())
          .filter(([_, monthData]) => monthData.data.length > 0)
          .map(([monthKey, monthData]) => {
            const count = monthData.data.length;
            const [year, month] = monthKey.split('-').map(Number);
            const date = new Date(year, month, 1);
            return {
              date: date.toLocaleDateString('es-ES', {
                month: 'short',
                year: 'numeric'
              }),
              followers: Math.round(monthData.totalFollowers / count),
              following: Math.round(monthData.totalFollowing / count),
              posts: Math.round(monthData.totalPosts / count),
              timestamp: date.toISOString()
            };
          })
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
          
        // Fallback to daily if monthly processing failed
        return monthlyResult.length > 0 ? monthlyResult : processDataByTimePeriod(data, 'daily');

      default:
        return sortedData;
    }
  };

  // Function to update chart data when time period changes
  const updateChartData = (period: TimePeriod, rawData?: HistoryData[]) => {
    const dataToProcess = rawData || rawHistoryData;
    if (dataToProcess.length === 0) return;
    
    try {
      const processedData = processDataByTimePeriod(dataToProcess, period);
      
      // Safety check: ensure we have valid processed data
      if (!processedData || processedData.length === 0) {
        console.warn('No processed data available for period:', period);
        return;
      }
      
      if (period === 'daily' || processedData.length <= 2) {
        // For daily view or very small datasets, don't interpolate
        setHistoryData(processedData);
      } else {
        // For weekly/monthly with sufficient data, apply interpolation
        const targetPoints = Math.min(
          processedData.length + 2, // Never exceed data length + buffer
          period === 'weekly' ? 8 : 6
        );
        const interpolated = interpolateData(processedData, targetPoints);
        setHistoryData(interpolated);
      }
    } catch (error) {
      console.error('Error updating chart data:', error);
      // Fallback: use raw data for daily view
      const fallbackData = processDataByTimePeriod(dataToProcess, 'daily');
      setHistoryData(fallbackData);
    }
  };

  // Handle time period change
  const handleTimePeriodChange = (period: TimePeriod) => {
    setTimePeriod(period);
    updateChartData(period);
  };

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
        // Store raw data
        setRawHistoryData(result.data.history);
        // Process data according to current time period
        updateChartData(timePeriod, result.data.history);
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
    setRawHistoryData([])

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
                      className="inline-flex items-center text-[rgb(214,77,173)] hover:text-[rgb(194,57,153)] transition-colors mb-4"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      {userData.externalUrl}
                    </a>
                  )}
                  
                  {/* View Instagram Profile Button */}
                  <div className="mt-4">
                    <a
                      href={`https://instagram.com/${userData.username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-[#FF7A00] via-[#FF0169] to-[#D300C5] text-white font-medium text-sm rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Ver Perfil en Instagram
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </div>
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
            {historyData && historyData.length > 0 && !userData.isNewUser && (
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
                    <p className="text-gray-600 mb-4">
                      Últimos 30 días de actividad
                      {historyData.length > 2 && timePeriod !== 'daily' && (
                        <span className="block text-xs text-gray-500 mt-1">
                          Datos suavizados para mejor visualización temporal
                        </span>
                      )}
                    </p>
                    
                    {/* Time Period Selector */}
                    <div className="flex justify-center mb-4">
                      <div className="bg-gray-100 rounded-full p-1 inline-flex">
                        <button
                          onClick={() => handleTimePeriodChange('daily')}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            timePeriod === 'daily'
                              ? 'bg-[rgb(214,77,173)] text-white shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Diario
                        </button>
                        <button
                          onClick={() => handleTimePeriodChange('weekly')}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            timePeriod === 'weekly'
                              ? 'bg-[rgb(214,77,173)] text-white shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Semanal
                        </button>
                        <button
                          onClick={() => handleTimePeriodChange('monthly')}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            timePeriod === 'monthly'
                              ? 'bg-[rgb(214,77,173)] text-white shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Mensual
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="h-64 sm:h-80 w-full">
                    {loadingHistory ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(214,77,173)]"></div>
                      </div>
                    ) : historyData && historyData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis 
                            dataKey="date" 
                            stroke="#666"
                            fontSize={12}
                            interval="preserveStartEnd"
                            tick={{ fontSize: 11 }}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                          />
                          <YAxis 
                            stroke="#666"
                            fontSize={12}
                            tickFormatter={formatNumber}
                            axisLine={{ stroke: '#e0e0e0' }}
                            tickLine={{ stroke: '#e0e0e0' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'white',
                              border: '1px solid #e5e5e5',
                              borderRadius: '8px',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            formatter={(value: number) => [formatNumber(value), 'Seguidores']}
                            labelFormatter={(label) => `Fecha: ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="followers" 
                            stroke="url(#gradient)" 
                            strokeWidth={3}
                            dot={{ fill: 'rgb(214,77,173)', strokeWidth: 2, r: 3 }}
                            activeDot={{ r: 6, fill: 'rgb(214,77,173)' }}
                            connectNulls={true}
                          />
                          <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="rgb(214,77,173)" />
                              <stop offset="100%" stopColor="rgb(244,102,110)" />
                            </linearGradient>
                          </defs>
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-center">
                          No hay suficientes datos para mostrar el gráfico<br/>
                          <span className="text-sm">Vuelve después de más búsquedas</span>
                        </p>
                      </div>
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