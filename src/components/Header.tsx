"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackClick } from "@/lib/analytics";

export default function Header() {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const toolsDropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Close desktop tools dropdown
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(target)) {
        setIsToolsDropdownOpen(false);
      }
      
      // Close desktop services dropdown
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(target)) {
        setIsServicesDropdownOpen(false);
      }
      
      // Close mobile menu only if clicking outside both the menu and the button
      if (isMobileMenuOpen &&
          mobileMenuRef.current && 
          !mobileMenuRef.current.contains(target) &&
          mobileButtonRef.current &&
          !mobileButtonRef.current.contains(target)) {
        console.log('Closing mobile menu via outside click');
        setIsMobileMenuOpen(false);
        setIsMobileToolsOpen(false);
        setIsMobileServicesOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Reset mobile dropdowns when mobile menu closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsMobileToolsOpen(false);
      setIsMobileServicesOpen(false);
    }
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle mobile menu, current state:', isMobileMenuOpen);
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    setIsMobileToolsOpen(false);
    setIsMobileServicesOpen(false);
    console.log('New menu state will be:', newState);
  };

  const closeMobileMenu = () => {
    console.log('Closing mobile menu via closeMobileMenu function');
    setIsMobileMenuOpen(false);
    setIsMobileToolsOpen(false);
    setIsMobileServicesOpen(false);
  };

  const tools = [
    {
      name: "Instagram Follower Tracker",
      description: "Rastrea el crecimiento de seguidores en tiempo real",
      href: "/tools/instagram-follower-tracker"
    },
    {
      name: "ReelViews Booster", 
      description: "500 visualizaciones gratuitas para tus Reels",
      href: "/tools/reelviews-booster"
    },
    {
      name: "Calculadora de Engagement",
      description: "Analiza engagement de cualquier perfil de Instagram",
      href: "/tools/instagram-engagement-calculator"
    },
    {
      name: "Analizador de Hashtags",
      description: "IA + análisis en tiempo real de Instagram",
      href: "/tools/instagram-hashtag-analyzer"
    },
    {
      name: "Generador de Bio con IA",
      description: "5 biografías optimizadas con análisis estratégico",
      href: "/tools/instagram-bio-generator"
    },
    {
      name: "Generador de Guiones para Videos",
      description: "Crea ideas virales para Reels, TikTok y YouTube",
      href: "/tools/generador-guiones-videos"
    }
  ];

  const platforms = [
    {
      name: "Instagram",
      description: "Seguidores, likes, views, comentarios, saves y mucho más.",
      href: "https://goviral.es/collections/instagram",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: "from-purple-600 via-pink-500 to-orange-400"
    },
    {
      name: "TikTok",
      description: "Seguidores, likes, views, comentarios y mucho más.",
      href: "https://goviral.es/collections/tiktok",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
          <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.946-1.182-2.158-1.182-2.158s-.12-.542-.123-1.14H13.05v14.043c0 .681-.208 1.384-.678 1.87-.47.485-1.089.753-1.735.753-.646 0-1.265-.268-1.735-.753-.47-.486-.678-1.189-.678-1.87 0-.68.208-1.383.678-1.869.47-.485 1.089-.753 1.735-.753.317 0 .631.056.928.165v-3.207a4.907 4.907 0 0 0-.928-.088c-1.311 0-2.573.52-3.507 1.446-.934.927-1.459 2.184-1.459 3.494 0 1.31.525 2.567 1.459 3.494.934.926 2.196 1.446 3.507 1.446s2.573-.52 3.507-1.446c.934-.927 1.459-2.184 1.459-3.494V8.407a7.516 7.516 0 0 0 2.565 1.469 8.516 8.516 0 0 0 2.565.314V6.983a5.226 5.226 0 0 1-1.578-.321 5.3 5.3 0 0 1-1.409-1.1z"/>
        </svg>
      ),
      color: "from-gray-900 to-black"
    },
    {
      name: "YouTube",
      description: "Suscriptores, visualizaciones y engagement",
      href: "https://goviral.es/collections/youtube",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      color: "from-red-600 to-red-500"
    },
    {
      name: "Spotify",
      description: "Streams, seguidores y promoción musical",
      href: "https://goviral.es/collections/spotify",
      icon: (
        <svg viewBox="0 0 24 24" className="w-full h-full" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      ),
      color: "from-green-500 to-green-400"
    }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/30 py-4">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="GoViral Logo"
              width={80}
              height={80}
              className="rounded-lg cursor-pointer"
            />
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-10">
          <Link
            href="/#inicio"
            className="text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-sm tracking-tight transition-colors duration-200"
          >
            Inicio
          </Link>

          {/* Services Dropdown */}
          <div className="relative" ref={servicesDropdownRef}>
            <button
              onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
              className="flex items-center text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-sm tracking-tight transition-colors duration-200"
            >
              Servicios
              <svg
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Services Dropdown Menu */}
            {isServicesDropdownOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[650px] bg-white rounded-2xl shadow-xl border border-gray-200/50 py-6 z-50">
                {/* Header */}
                <div className="px-6 pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-lg">Servicios de Marketing Digital</h3>
                  <p className="text-sm text-gray-600 mt-1">Impulsa tu presencia en todas las plataformas</p>
                </div>
                
                {/* Platforms Grid */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    {platforms.map((platform, index) => (
                      <Link
                        key={index}
                        href={platform.href}
                        onClick={() => {
                          trackClick(`click_servicio_${platform.name.toLowerCase()}`);
                          setIsServicesDropdownOpen(false);
                        }}
                        className="group block p-4 rounded-xl border border-gray-100 hover:border-[rgb(214,77,173)]/30 hover:bg-gradient-to-br hover:from-pink-50/50 hover:to-purple-50/30 transition-all duration-200"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">
                            <div className={`w-10 h-10 bg-gradient-to-br ${platform.color}/15 rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-200 group-hover:shadow-lg group-hover:bg-gradient-to-br group-hover:${platform.color}`}>
                              <div className={`w-6 h-6 text-white group-hover:text-white transition-all duration-200`}>
                                {platform.icon}
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-[rgb(214,77,173)] transition-colors duration-200">
                              {platform.name}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                              {platform.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Special Section for Monthly Plans */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <div className="bg-gradient-to-r from-[rgb(214,77,173)]/5 to-[rgb(244,102,110)]/5 rounded-xl p-4 border border-[rgb(214,77,173)]/20">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-lg flex items-center justify-center text-white text-xl">
                          👑
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-base leading-tight">
                          Planes Mensuales de Instagram
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Crecimiento constante y automático para tu perfil
                        </p>
                      </div>
                      <div className="flex-shrink-0">
                        <Link
                          href="https://goviral.es/pages/planes"
                          onClick={() => {
                            trackClick("click_planes_mensuales");
                            setIsServicesDropdownOpen(false);
                          }}
                          className="bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 text-sm"
                        >
                          Ver Planes
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-500">Todos los servicios están disponibles</span>
                    </div>
                    <Link
                      href="https://goviral.es/pages/contact"
                      className="text-xs text-[rgb(214,77,173)] hover:text-[rgb(194,57,153)] font-medium hover:underline transition-colors duration-200"
                      onClick={() => {
                        trackClick("click_contacto_servicios");
                        setIsServicesDropdownOpen(false);
                      }}
                    >
                      ¿Necesitas algo personalizado?
                    </Link>
                  </div>
                  
                  {/* Ver todos los servicios button */}
                  <Link
                    href="https://goviral.es/collections"
                    onClick={() => {
                      trackClick("click_ver_todos_servicios");
                      setIsServicesDropdownOpen(false);
                    }}
                    className="block w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white text-center py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    Ver todos los servicios →
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {/* Tools Dropdown */}
          <div className="relative" ref={toolsDropdownRef}>
            <button
              onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
              className="flex items-center text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-sm tracking-tight transition-colors duration-200"
            >
              Herramientas
              <svg
                className={`ml-1 h-4 w-4 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Tools Dropdown Menu */}
            {isToolsDropdownOpen && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[600px] bg-white rounded-2xl shadow-xl border border-gray-200/50 py-6 z-50">
                {/* Header */}
                <div className="px-6 pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900 text-lg">Herramientas de Instagram</h3>
                  <p className="text-sm text-gray-600 mt-1">Optimiza tu presencia en redes sociales con IA</p>
                </div>
                
                {/* Tools Grid */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    {tools.map((tool, index) => {
                      // Define icons for each tool
                      const icons = {
                        "Instagram Follower Tracker": "📈",
                        "ReelViews Booster": "🚀", 
                        "Calculadora de Engagement": "📊",
                        "Analizador de Hashtags": "🔍",
                        "Generador de Bio con IA": "✨",
                        "Generador de Guiones para Videos": "🎬"
                      };
                      
                      return (
                        <Link
                          key={index}
                          href={tool.href}
                          onClick={() => {
                            trackClick(`click_herramienta_${tool.name.toLowerCase().replace(/\s+/g, '_')}`);
                            setIsToolsDropdownOpen(false);
                          }}
                          className="group block p-4 rounded-xl border border-gray-100 hover:border-[rgb(214,77,173)]/30 hover:bg-gradient-to-br hover:from-pink-50/50 hover:to-purple-50/30 transition-all duration-200"
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-br from-[rgb(214,77,173)]/10 to-[rgb(244,102,110)]/10 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform duration-200">
                                {icons[tool.name as keyof typeof icons] || "🛠️"}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 text-sm leading-tight group-hover:text-[rgb(214,77,173)] transition-colors duration-200">
                                {tool.name}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                {tool.description}
                              </p>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-xs text-gray-500">Todas las herramientas están disponibles</span>
                    </div>
                    <Link
                      href="https://goviral.es/pages/contact"
                      className="text-xs text-[rgb(214,77,173)] hover:text-[rgb(194,57,153)] font-medium hover:underline transition-colors duration-200"
                      onClick={() => {
                        trackClick("click_sugerir_herramienta");
                        setIsToolsDropdownOpen(false);
                      }}
                    >
                      ¿Sugerir nueva herramienta?
                    </Link>
                  </div>
                  
                  {/* Ver todas las herramientas button */}
                  <Link
                    href="/tools"
                    onClick={() => {
                      trackClick("click_ver_todas_herramientas");
                      setIsToolsDropdownOpen(false);
                    }}
                    className="block w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white text-center py-3 px-4 rounded-xl font-medium hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
                  >
                    Ver todas las herramientas →
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href="/blog"
            className="text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-sm tracking-tight transition-colors duration-200"
          >
            Blog
          </Link>
        </nav>

        <div className="flex items-center">
          {/* Desktop CTA Button */}
          <Link
            href="https://goviral.es/collections"
            onClick={() => trackClick("click_ver_mas_header")}
            className="hidden md:block bg-[rgb(214,77,173)] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[rgb(194,57,153)] transition-all duration-200"
          >
            Ver más
          </Link>

          {/* Mobile Menu Button */}
          <button
            ref={mobileButtonRef}
            onClick={handleMobileMenuToggle}
            type="button"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            aria-label="Menú de navegación"
          >
            <svg
              className={`w-6 h-6 text-gray-700 transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-gray-200/30 shadow-lg"
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="space-y-4">
              {/* Navigation Links */}
              <Link
                href="/#inicio"
                onClick={closeMobileMenu}
                className="block text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-base py-2 transition-colors duration-200"
              >
                Inicio
              </Link>
              
              {/* Services Dropdown Mobile */}
              <div className="py-2">
                <button
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="flex items-center justify-between w-full text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-base py-2 transition-colors duration-200"
                >
                  Servicios
                  <svg
                    className={`h-5 w-5 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mobile Services Dropdown Content */}
                {isMobileServicesOpen && (
                  <div className="mt-3 pl-4 space-y-3 border-l-2 border-gray-100">
                    {/* Platforms */}
                    <div className="space-y-3">
                      {platforms.map((platform, index) => (
                        <Link
                          key={index}
                          href={platform.href}
                          onClick={() => {
                            trackClick(`click_servicio_mobile_${platform.name.toLowerCase()}`);
                            closeMobileMenu();
                          }}
                          className="group block hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              <div className={`w-8 h-8 bg-gradient-to-br ${platform.color}/20 rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-200 group-hover:shadow-md group-hover:bg-gradient-to-br group-hover:${platform.color}`}>
                                <div className={`w-5 h-5 text-white transition-all duration-200`}>
                                  {platform.icon}
                                </div>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900 text-sm">{platform.name}</div>
                              <div className="text-xs text-gray-500 mt-1">{platform.description}</div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    {/* Monthly Plans Special Section */}
                    <div className="bg-gradient-to-r from-[rgb(214,77,173)]/5 to-[rgb(244,102,110)]/5 rounded-lg p-3 border border-[rgb(214,77,173)]/20">
                      <Link
                        href="https://goviral.es/pages/planes"
                        onClick={() => {
                          trackClick("click_planes_mensuales_mobile");
                          closeMobileMenu();
                        }}
                        className="block"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-gradient-to-br from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-lg flex items-center justify-center text-white text-sm">
                              👑
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 text-sm">Planes Mensuales</div>
                            <div className="text-xs text-gray-500 mt-1">Crecimiento automático de Instagram</div>
                          </div>
                        </div>
                      </Link>
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      <Link
                        href="https://goviral.es/collections"
                        onClick={() => {
                          trackClick("click_ver_todos_servicios_mobile");
                          closeMobileMenu();
                        }}
                        className="block w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white text-center py-2.5 px-4 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200"
                      >
                        Ver todos los servicios →
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Tools Dropdown */}
              <div className="py-2">
                <button
                  onClick={() => setIsMobileToolsOpen(!isMobileToolsOpen)}
                  className="flex items-center justify-between w-full text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-base py-2 transition-colors duration-200"
                >
                  Herramientas
                  <svg
                    className={`h-5 w-5 transition-transform duration-200 ${isMobileToolsOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Mobile Tools Dropdown Content */}
                {isMobileToolsOpen && (
                  <div className="mt-3 pl-4 space-y-3 border-l-2 border-gray-100">
                    {/* Available Tools - Limited to 3 on mobile */}
                    <div className="space-y-3">
                      {tools.slice(0, 3).map((tool, index) => {
                        // Define icons for each tool
                        const icons = {
                          "Instagram Follower Tracker": "📈",
                          "ReelViews Booster": "🚀", 
                          "Calculadora de Engagement": "📊",
                          "Analizador de Hashtags": "🔍",
                          "Generador de Bio con IA": "✨"
                        };
                        
                        return (
                          <Link
                            key={index}
                            href={tool.href}
                            onClick={() => {
                              trackClick(`click_herramienta_mobile_${tool.name.toLowerCase().replace(/\s+/g, '_')}`);
                              closeMobileMenu();
                            }}
                            className="block hover:bg-gray-50 rounded-lg p-3 transition-colors duration-200"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-gradient-to-br from-[rgb(214,77,173)]/10 to-[rgb(244,102,110)]/10 rounded-lg flex items-center justify-center text-sm">
                                  {icons[tool.name as keyof typeof icons] || "🛠️"}
                                </div>
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900 text-sm">{tool.name}</div>
                                <div className="text-xs text-gray-500 mt-1">{tool.description}</div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                      
                      {/* Show remaining count if there are more tools */}
                      {tools.length > 3 && (
                        <div className="text-center py-2">
                          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            +{tools.length - 3} herramientas más
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="pt-3 border-t border-gray-100 space-y-3">
                      <Link
                        href="/tools"
                        onClick={() => {
                          trackClick("click_ver_todas_herramientas_mobile");
                          closeMobileMenu();
                        }}
                        className="block w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white text-center py-2.5 px-4 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200"
                      >
                        Ver todas las herramientas →
                      </Link>
                      
                      <p className="text-xs text-gray-400 text-center">
                        ¿Ideas para nuevas herramientas?{' '}
                        <Link
                          href="https://goviral.es/pages/contact"
                          className="text-[rgb(214,77,173)] hover:underline"
                          onClick={() => {
                            trackClick("click_sugerir_herramienta_mobile");
                            closeMobileMenu();
                          }}
                        >
                          Contáctanos
                        </Link>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/blog"
                onClick={closeMobileMenu}
                className="block text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-base py-2 transition-colors duration-200"
              >
                Blog
              </Link>

              {/* CTA Button */}
              <div className="pt-4 border-t border-gray-100">
                <Link
                  href="https://goviral.es/collections"
                  onClick={() => {
                    trackClick("click_ver_mas_mobile_header");
                    closeMobileMenu();
                  }}
                  className="block w-full bg-[rgb(214,77,173)] text-white px-6 py-3 rounded-full font-medium hover:bg-[rgb(194,57,153)] transition-all duration-200 text-center"
                >
                  Ver más
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
} 