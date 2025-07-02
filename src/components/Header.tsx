"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { trackClick } from "@/lib/analytics";

export default function Header() {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const tools = [
    {
      name: "Instagram Follower Tracker",
      description: "Rastrea el crecimiento de seguidores en tiempo real",
      href: "/tools/instagram-follower-tracker",
      available: true
    },
    {
      name: "ReelViews Booster", 
      description: "500 visualizaciones gratuitas para tus Reels",
      href: "/tools/reelviews-booster",
      available: true
    },
    {
      name: "Calculadora de Engagement",
      description: "Analiza engagement de cualquier perfil de Instagram",
      href: "/tools/instagram-engagement-calculator", 
      available: true
    },
    {
      name: "Generador de Hashtags",
      description: "Encuentra hashtags populares",
      href: "/tools/hashtag-generator",
      available: false
    },
    {
      name: "Analizador de Contenido",
      description: "Optimiza tu contenido de Reels",
      href: "/tools/content-analyzer",
      available: false
    },
    {
      name: "Checklist de Publicación",
      description: "Verifica tu contenido antes de publicar",
      href: "/tools/publishing-checklist",
      available: false
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
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-2xl shadow-lg border border-gray-200/50 py-4 z-50">
                <div className="px-4 pb-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-sm">Herramientas de Instagram</h3>
                  <p className="text-xs text-gray-500 mt-1">Optimiza tu presencia en redes sociales</p>
                </div>
                <div className="py-2">
                  {tools.map((tool, index) => (
                    <div key={index} className="relative">
                      <Link
                        href={tool.available ? tool.href : "#"}
                        onClick={() => {
                          if (!tool.available) {
                            trackClick("click_herramienta_proximamente");
                          } else {
                            trackClick(`click_herramienta_${tool.name.toLowerCase().replace(/\s+/g, '_')}`);
                          }
                          setIsToolsDropdownOpen(false);
                        }}
                        className={`block px-4 py-3 hover:bg-gray-50 transition-colors duration-200 ${!tool.available ? 'opacity-60' : ''}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{tool.name}</div>
                            <div className="text-xs text-gray-500">{tool.description}</div>
                          </div>
                          {!tool.available && (
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                              Próximamente
                            </span>
                          )}
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="px-4 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    ¿Tienes ideas para nuevas herramientas?{' '}
                    <Link
                      href="https://goviral.es/pages/contact"
                      className="text-[rgb(214,77,173)] hover:underline"
                      onClick={() => {
                        trackClick("click_sugerir_herramienta");
                        setIsToolsDropdownOpen(false);
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
            href="/#faq"
            className="text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-sm tracking-tight transition-colors duration-200"
          >
            FAQ
          </Link>
        </nav>

        <div className="flex items-center">
          <Link
            href="https://goviral.es/collections"
            onClick={() => trackClick("click_ver_mas_header")}
            className="bg-[rgb(214,77,173)] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[rgb(194,57,153)] transition-all duration-200"
          >
            Ver más
          </Link>
        </div>
      </div>
    </header>
  );
} 