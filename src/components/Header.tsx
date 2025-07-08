"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackClick } from "@/lib/analytics";

export default function Header() {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileToolsOpen, setIsMobileToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      
      // Close desktop tools dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsToolsDropdownOpen(false);
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
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Reset mobile tools dropdown when mobile menu closes
  useEffect(() => {
    if (!isMobileMenuOpen) {
      setIsMobileToolsOpen(false);
    }
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle mobile menu, current state:', isMobileMenuOpen);
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    setIsMobileToolsOpen(false);
    console.log('New menu state will be:', newState);
  };

  const closeMobileMenu = () => {
    console.log('Closing mobile menu via closeMobileMenu function');
    setIsMobileMenuOpen(false);
    setIsMobileToolsOpen(false);
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
          <Link
            href="/#servicios"
            className="text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-sm tracking-tight transition-colors duration-200"
          >
            Servicios
          </Link>
          
          {/* Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
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

            {/* Dropdown Menu */}
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
              
              <Link
                href="/#servicios"
                onClick={closeMobileMenu}
                className="block text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-base py-2 transition-colors duration-200"
              >
                Servicios
              </Link>

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