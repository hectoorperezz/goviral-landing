"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import InstagramReelTrial from "@/components/InstagramReelTrial";

// Helper para disparar eventos gtag
const trackClick = (action: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    const eventValues: { [key: string]: number } = {
      click_ver_mas_header: 1,
      click_ver_planes_hero: 2,
      click_contactar_hero: 1,
      click_collections_instagram: 2,
      click_collections_tiktok: 2,
      click_collections_youtube: 1,
      click_collections_spotify: 1,
      click_collections_instagram_footer: 2,
      click_collections_tiktok_footer: 2,
      click_collections_youtube_footer: 1,
      click_plan_starter_instagram: 3,
      click_plan_influencer_instagram: 4,
      click_plan_enterprise_instagram: 5,
      click_comenzar_ahora: 2,
      click_contacto_footer: 1,
      click_collections_spotify_footer: 1
    };

    window.gtag("event", action, {
      event_category: "outbound",
      event_label: action,
      value: eventValues[action] || 1,
    });
  }
};

export default function Home() {

  useEffect(() => {
      // 1) Leer el gclid de la URL
      const params = new URLSearchParams(window.location.search);
      const gclid = params.get('gclid');
      if (!gclid) return;
  
      // 2) Opcional: guardar en cookie 90 días
      document.cookie = `gclid=${gclid}; path=/; max-age=${90*24*60*60}; domain=goviral.es`;
  
      // 3) Propagar a todos los enlaces a goviral.es
      document
        .querySelectorAll<HTMLAnchorElement>('a[href*="goviral.es"]')
        .forEach(a => {
          try {
            const url = new URL(a.href);
            url.searchParams.set('gclid', gclid);
            a.href = url.toString();
          } catch (e) {
           // enlaces no válidos se ignoran
         }
        });
    }, []);
  
  return (
    <main className="min-h-screen flex flex-col bg-[#fbfbfd]">
      {/* Header - Apple Style */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/30 py-4">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="GoViral Logo"
              width={80}
              height={80}
              className="rounded-lg"
            />
          </div>
          <nav className="hidden md:flex items-center space-x-10">
            <Link
              href="#inicio"
              className="text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-sm tracking-tight transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link
              href="#servicios"
              className="text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-sm tracking-tight transition-colors duration-200"
            >
              Servicios
            </Link>
            <Link
              href="#testimonios"
              className="text-gray-800 hover:text-[rgb(214,77,173)] font-medium text-sm tracking-tight transition-colors duration-200"
            >
              Testimonios
            </Link>
            <Link
              href="#faq"
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

      {/* Hero Section - Apple Style */}
      <section
        id="inicio"
        className="relative py-20 md:py-28 lg:py-36 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white to-[#f5f5f7] -z-10"></div>
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center gap-16 md:gap-20">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <div>
              <span className="inline-block px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6">
                Impulsa tu presencia online
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-gray-900">
                Crece en{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                  Redes Sociales
                </span>
              </h1>
            </div>
            <p className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed font-light">
              Descubre cómo nuestras estrategias personalizadas pueden ayudarte
              a crecer en todas las plataformas de redes sociales de manera
              eficaz.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center md:justify-start">
              <Link
                href="https://goviral.es/pages/planes"
                onClick={() => trackClick("click_ver_planes_hero")}
                className="bg-[rgb(214,77,173)] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[rgb(194,57,153)] transition-all duration-300 text-center"
              >
                Ver Planes
              </Link>
              <Link
                href="#prueba-gratis"
                onClick={() => trackClick("click_prueba_gratis_hero")}
                className="bg-gradient-to-r from-[#FF7A00] via-[#FF0169] to-[#D300C5] text-white px-8 py-3.5 rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                Prueba Gratis
              </Link>
            </div>
          </div>
          <div className="flex-1 relative mt-12 md:mt-0 flex justify-center">
            <div className="relative w-4/5 md:w-3/5 lg:w-2/5 aspect-[9/16] rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)]">
              <div className="absolute inset-0 bg-gradient-to-tr from-[rgba(214,77,173,0.05)] to-transparent z-10"></div>
              <video
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="/videolanding.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Apple Style */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6">
              Por qué elegirnos
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900 tracking-tight">
              Somos el mejor sitio
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-light">
              Ofrecemos servicios de calidad con entrega inmediata y garantía
              total
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[rgb(214,77,173)] text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Entrega Inmediata
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Todos los pedidos se procesan e inician dentro de los 60
                segundos posteriores al pago.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[rgb(214,77,173)] text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                100% Garantizado
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Todos nuestros servicios cuentan con garantía de un mes. Si
                experimenta alguna disminución, se lo compensaremos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[rgb(214,77,173)] text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Compra Segura
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Nos comprometemos a nunca solicitar la contraseña de su cuenta.
                Su privacidad y seguridad son nuestra principal preocupación.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)]">
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[rgb(214,77,173)] text-white mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Calidad superior
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                Ofrecemos servicios de la más alta calidad, sin comprometer
                nuestros precios, que son los más competitivos del mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Reel Trial Section */}
      <section id="prueba-gratis" className="py-24 md:py-32 bg-gradient-to-b from-[#f5f5f7] to-white relative overflow-hidden">
        {/* Instagram-inspired background elements */}
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
          
          <InstagramReelTrial />
        </div>
      </section>

      {/* Platforms Section - Apple Style */}
      <section id="servicios" className="py-24 md:py-32 bg-[#f5f5f7]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6">
              Servicios
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900 tracking-tight">
              Nuestras Plataformas
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-light">
              Impulsa tu presencia digital en las principales redes sociales
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Instagram */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center h-full">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="/instagram.png"
                  alt="Instagram"
                  width={64}
                  height={64}
                  className="rounded-2xl"
                />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Instagram
              </h3>
              <p className="text-gray-500 text-center mb-8 leading-relaxed text-sm">
                Aumenta tus seguidores, likes y comentarios en Instagram.
              </p>
              <Link
                href="https://goviral.es/collections/instagram"
                onClick={() => trackClick("click_collections_instagram")}
                className="mt-auto text-center w-full bg-[rgb(214,77,173)] text-white px-5 py-3 rounded-full font-medium hover:bg-[rgb(194,57,153)] transition-all duration-300"
              >
                Ver Servicios
              </Link>
            </div>

            {/* TikTok */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center h-full">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="/tiktok.png"
                  alt="TikTok"
                  width={64}
                  height={64}
                  className="rounded-2xl"
                />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                TikTok
              </h3>
              <p className="text-gray-500 text-center mb-8 leading-relaxed text-sm">
                Consigue más seguidores, likes y visualizaciones en TikTok.
              </p>
              <Link
                href="https://goviral.es/collections/tiktok"
                onClick={() => trackClick("click_collections_tiktok")}
                className="mt-auto text-center w-full bg-[rgb(214,77,173)] text-white px-5 py-3 rounded-full font-medium hover:bg-[rgb(194,57,153)] transition-all duration-300"
              >
                Ver Servicios
              </Link>
            </div>

            {/* YouTube */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center h-full">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="/youtube.png"
                  alt="YouTube"
                  width={64}
                  height={64}
                  className="rounded-2xl"
                />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                YouTube
              </h3>
              <p className="text-gray-500 text-center mb-8 leading-relaxed text-sm">
                Aumenta tus suscriptores, likes y visualizaciones en YouTube.
              </p>
              <Link
                href="https://goviral.es/collections/youtube"
                onClick={() => trackClick("click_collections_youtube")}
                className="mt-auto text-center w-full bg-[rgb(214,77,173)] text-white px-5 py-3 rounded-full font-medium hover:bg-[rgb(194,57,153)] transition-all duration-300"
              >
                Ver Servicios
              </Link>
            </div>

            {/* Spotify */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center h-full">
              <div className="mb-8 transform hover:scale-105 transition-transform duration-300">
                <Image
                  src="/spotify.png"
                  alt="Spotify"
                  width={64}
                  height={64}
                  className="rounded-2xl"
                />
              </div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900">
                Spotify
              </h3>
              <p className="text-gray-500 text-center mb-8 leading-relaxed text-sm">
                Consigue más seguidores, reproducciones y guardados en Spotify.
              </p>
              <Link
                href="https://goviral.es/collections/spotify"
                onClick={() => trackClick("click_collections_spotify")}
                className="mt-auto text-center w-full bg-[rgb(214,77,173)] text-white px-5 py-3 rounded-full font-medium hover:bg-[rgb(194,57,153)] transition-all duration-300"
              >
                Ver Servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Apple Style */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-40 left-0 w-64 h-64 bg-[rgb(214,77,173)] opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 right-0 w-80 h-80 bg-[rgb(244,102,110)] opacity-5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 shadow-sm relative">
              <span className="absolute inset-0 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] opacity-10 rounded-full"></span>
              <span className="relative">NUESTROS PLANES</span>
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900 tracking-tight">
              Elige tu{" "}
              <span className="relative inline-block">
                <span className="absolute -inset-1 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] blur-md opacity-30 rounded-lg"></span>
                <span className="relative">plan ideal</span>
              </span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-light">
              Planes diseñados para adaptarse a tus necesidades y objetivos de
              crecimiento en Instagram
            </p>
            <div className="h-1 w-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-8 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
            {/* Plan Starter */}
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col h-full shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
              {/* No background decoration */}

              <div className="mb-8 text-center relative">
                <div className="flex justify-center mb-5">
                  <div className="bg-white p-3 rounded-2xl shadow-sm">
                    <Image
                      src="/instagram.png"
                      alt="Instagram"
                      width={48}
                      height={48}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Plan Starter
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    59,99€
                  </span>
                  <span className="text-gray-500 text-sm ml-2">/mes</span>
                </div>
                <div className="h-px w-16 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-4 mx-auto opacity-50"></div>
              </div>

              <ul className="space-y-4 mb-8 relative">
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    50 seguidores al día
                  </span>
                </li>
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Hasta 4000 visitas por reel
                  </span>
                </li>
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Hasta 1000 likes por publicación
                  </span>
                </li>
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Hasta 1000 impresiones por publicación
                  </span>
                </li>
              </ul>

              <Link
                href="https://goviral.es/products/plan-starter-instagram"
                onClick={() => trackClick("click_plan_starter_instagram")}
                className="mt-auto text-center w-full relative overflow-hidden group-hover:shadow-lg bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white px-5 py-3.5 rounded-full font-medium hover:from-[rgb(194,57,153)] hover:to-[rgb(224,82,90)] transition-all duration-300 flex items-center justify-center"
              >
                <span>Ver más</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>

            {/* Plan Influencer - Popular */}
            <div className="group bg-white p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col h-full shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] relative z-10 scale-105 border-2 border-[rgb(214,77,173)]">
              {/* Highlight Badge */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div>
                  <span className="bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white text-xs font-medium px-6 py-2 rounded-full shadow-lg flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Más popular
                  </span>
                </div>
              </div>

              {/* No background decoration */}

              <div className="mb-8 text-center relative">
                <div className="flex justify-center mb-5">
                  <div className="bg-gradient-to-r from-[rgba(214,77,173,0.1)] to-[rgba(244,102,110,0.1)] p-4 rounded-2xl shadow-sm">
                    <Image
                      src="/instagram.png"
                      alt="Instagram"
                      width={48}
                      height={48}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Plan Influencer
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                    119,99€
                  </span>
                  <span className="text-gray-500 text-sm ml-2">/mes</span>
                </div>
                <div className="h-1 w-24 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-4 mx-auto"></div>
              </div>

              <ul className="space-y-4 mb-8 relative">
                <li className="flex items-start bg-gradient-to-r from-[rgba(214,77,173,0.05)] to-[rgba(244,102,110,0.05)] p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    150 seguidores al día
                  </span>
                </li>
                <li className="flex items-start bg-gradient-to-r from-[rgba(214,77,173,0.05)] to-[rgba(244,102,110,0.05)] p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Hasta 10000 visitas por reel
                  </span>
                </li>
                <li className="flex items-start bg-gradient-to-r from-[rgba(214,77,173,0.05)] to-[rgba(244,102,110,0.05)] p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Hasta 3000 likes por publicación
                  </span>
                </li>
                <li className="flex items-start bg-gradient-to-r from-[rgba(214,77,173,0.05)] to-[rgba(244,102,110,0.05)] p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Hasta 8000 impresiones por publicación
                  </span>
                </li>
                <li className="flex items-start bg-gradient-to-r from-[rgba(214,77,173,0.05)] to-[rgba(244,102,110,0.05)] p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Soporte por correo preferente
                  </span>
                </li>
              </ul>

              <Link
                href="https://goviral.es/products/plan-influencer-instagram"
                onClick={() => trackClick('click_plan_influencer_instagram')}
                className="mt-auto text-center w-full relative overflow-hidden group-hover:shadow-lg bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white px-5 py-3.5 rounded-full font-medium hover:from-[rgb(194,57,153)] hover:to-[rgb(224,82,90)] transition-all duration-300 flex items-center justify-center"
              >
                <span>Ver más</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>

            {/* Plan Enterprise */}
            <div className="group bg-gradient-to-b from-[#f8f8fa] to-white p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col h-full shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden">
              {/* Premium Badge */}
              <div className="absolute top-3 right-3">
                <div className="bg-gradient-to-r from-[#f5f5f7] to-white px-3 py-1 rounded-full shadow-sm border border-gray-200 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-700 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-700">
                    Premium
                  </span>
                </div>
              </div>

              {/* No background decoration */}

              <div className="mb-8 text-center relative">
                <div className="flex justify-center mb-5">
                  <div className="bg-gradient-to-r from-[#f5f5f7] to-white p-4 rounded-2xl shadow-sm border border-gray-100">
                    <Image
                      src="/instagram.png"
                      alt="Instagram"
                      width={48}
                      height={48}
                      className="rounded-xl"
                    />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  Plan Enterprise
                </h3>
                <div className="flex items-baseline justify-center">
                  <span className="text-4xl font-bold text-gray-900">
                    199,99€
                  </span>
                  <span className="text-gray-500 text-sm ml-2">/mes</span>
                </div>
                <div className="h-px w-16 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-4 mx-auto opacity-50"></div>
              </div>

              <ul className="space-y-4 mb-8 relative">
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-gray-50">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    450 seguidores al día
                  </span>
                </li>
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-gray-50">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Hasta 20000 visitas por reel
                  </span>
                </li>
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-gray-50">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Hasta 7000 likes por publicación
                  </span>
                </li>
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-gray-50">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Hasta 16000 impresiones por publicación
                  </span>
                </li>
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-gray-50">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Soporte por correo preferente
                  </span>
                </li>
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-gray-50">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Soporte por Instagram preferente
                  </span>
                </li>
                <li className="flex items-start bg-white p-3 rounded-xl shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-gray-50">
                  <div className="mr-3 text-white bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full p-1 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-700 text-sm font-medium">
                    Optimización con Inteligencia Artificial
                  </span>
                </li>
              </ul>

              <Link
                href="https://goviral.es/products/plan-enterprise-instagram"
                onClick={() => trackClick('click_plan_enterprise_instagram')}
                className="mt-auto text-center w-full relative overflow-hidden group-hover:shadow-lg bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white px-5 py-3.5 rounded-full font-medium hover:from-[rgb(194,57,153)] hover:to-[rgb(224,82,90)] transition-all duration-300 flex items-center justify-center"
              >
                <span>Ver más</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Apple Style */}
      <section id="faq" className="py-24 md:py-32 bg-[#f5f5f7]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block px-4 py-1.5 bg-white text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6">
              PREGUNTAS FRECUENTES
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900 tracking-tight">
              Preguntas y Respuestas
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-light">
              A continuación encontrará la respuesta a las preguntas más
              frecuentes que se plantean sobre nuestros servicios.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {/* Pregunta 1 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-gray-900">
                    ¿Cuánto tiempo se tarda en entregar mi pedido?
                  </h3>
                  <span className="ml-6 flex-shrink-0 text-[rgb(214,77,173)]">
                    <svg
                      className="h-6 w-6 transform group-open:rotate-180 transition-transform duration-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600">
                    La entrega del pedido se realiza en pocos minutos
                    normalmente. El tiempo máximo de entrega es de 72 horas.
                  </p>
                </div>
              </details>
            </div>

            {/* Pregunta 2 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-gray-900">
                    ¿Corro el riesgo de ser prohibido o sancionado si compro sus
                    servicios?
                  </h3>
                  <span className="ml-6 flex-shrink-0 text-[rgb(214,77,173)]">
                    <svg
                      className="h-6 w-6 transform group-open:rotate-180 transition-transform duration-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600">
                    No, nuestros servicios son seguros y no existe posibilidad
                    de baneo por parte de las plataformas. Sin embargo, un uso
                    abusivo puede provocar shadow bans temporales en algunas
                    redes sociales.
                  </p>
                </div>
              </details>
            </div>

            {/* Pregunta 3 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-gray-900">
                    ¿Necesita mis credenciales para brindar los servicios?
                  </h3>
                  <span className="ml-6 flex-shrink-0 text-[rgb(214,77,173)]">
                    <svg
                      className="h-6 w-6 transform group-open:rotate-180 transition-transform duration-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600">
                    No, no necesitamos tus credenciales para brindar nuestros
                    servicios.
                  </p>
                </div>
              </details>
            </div>

            {/* Pregunta 4 */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <details className="group">
                <summary className="flex items-center justify-between p-6 cursor-pointer">
                  <h3 className="text-lg font-medium text-gray-900">
                    ¿Se entrega factura con los pedidos?
                  </h3>
                  <span className="ml-6 flex-shrink-0 text-[rgb(214,77,173)]">
                    <svg
                      className="h-6 w-6 transform group-open:rotate-180 transition-transform duration-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-gray-600">
                    Sí, en los correos de confirmación del pedido ofrecemos la
                    posibilidad de obtener una factura del pedido.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Apple Style */}
      <section id="testimonios" className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6">
              Testimonios
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-gray-900 tracking-tight">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed font-light">
              Miles de personas y empresas confían en nosotros para crecer en
              redes sociales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-[#f5f5f7] p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&auto=format&fit=crop&crop=face"
                    alt="Cliente"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Laura Martínez
                  </h4>
                  <p className="text-gray-500 text-sm">Influencer de Moda</p>
                </div>
              </div>
              <div className="mb-4 text-yellow-400 flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4 text-sm leading-relaxed">
                "Desde que empecé a trabajar con GoViral, mi cuenta de Instagram
                ha crecido exponencialmente. El servicio es rápido y los
                resultados son increíbles. Totalmente recomendado."
              </p>
              <p className="text-xs text-gray-400 mt-auto">
                Cliente desde 2023
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-[#f5f5f7] p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop&crop=face"
                    alt="Cliente"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Juan López</h4>
                  <p className="text-gray-500 text-sm">Empresario</p>
                </div>
              </div>
              <div className="mb-4 text-yellow-400 flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4 text-sm leading-relaxed">
                "La mejor inversión que he hecho para mi negocio. El crecimiento
                en redes sociales ha sido increíble."
              </p>
              <p className="text-xs text-gray-400 mt-auto">
                Cliente desde 2022
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-[#f5f5f7] p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=150&h=150&auto=format&fit=crop&crop=face"
                    alt="Cliente"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Ana García</h4>
                  <p className="text-gray-500 text-sm">
                    Especialista en Marketing
                  </p>
                </div>
              </div>
              <div className="mb-4 text-yellow-400 flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4 text-sm leading-relaxed">
                "Un servicio excepcional y resultados rápidos. ¡Lo recomiendo a
                todos mis amigos!"
              </p>
              <p className="text-xs text-gray-400 mt-auto">
                Cliente desde 2021
              </p>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-[#f5f5f7] p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&h=150&auto=format&fit=crop&crop=face"
                    alt="Cliente"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Carlos Sánchez
                  </h4>
                  <p className="text-gray-500 text-sm">Empresario</p>
                </div>
              </div>
              <div className="mb-4 text-yellow-400 flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4 text-sm leading-relaxed">
                "¡Increíble! Mis seguidores han aumentado exponencialmente desde
                que comencé a usar este servicio."
              </p>
              <p className="text-xs text-gray-400 mt-auto">
                Cliente desde 2023
              </p>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-[#f5f5f7] p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&h=150&auto=format&fit=crop&crop=face"
                    alt="Cliente"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Laura Martín</h4>
                  <p className="text-gray-500 text-sm">
                    Especialista en Marketing
                  </p>
                </div>
              </div>
              <div className="mb-4 text-yellow-400 flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4 text-sm leading-relaxed">
                "Estoy muy satisfecha con los resultados. ¡Vale cada céntimo!"
              </p>
              <p className="text-xs text-gray-400 mt-auto">
                Cliente desde 2022
              </p>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-[#f5f5f7] p-8 rounded-3xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col h-full">
              <div className="flex items-center mb-6">
                <div className="mr-4">
                  <Image
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150&h=150&auto=format&fit=crop&crop=face"
                    alt="Cliente"
                    width={56}
                    height={56}
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Miguel Torres</h4>
                  <p className="text-gray-500 text-sm">Influencer</p>
                </div>
              </div>
              <div className="mb-4 text-yellow-400 flex">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 italic mb-4 text-sm leading-relaxed">
                "Un servicio muy profesional y eficaz. ¡Muy recomendable!"
              </p>
              <p className="text-xs text-gray-400 mt-auto">
                Cliente desde 2023
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Apple Style */}
      <section className="py-24 md:py-32 bg-[#f5f5f7]">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-3xl p-12 md:p-20 text-white text-center relative overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25)]">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white font-semibold mb-8 leading-tight tracking-tight">
                ¿Listo para crecer en redes sociales?
              </h2>
              <p className="text-lg md:text-xl mb-12 mx-auto font-light leading-relaxed">
                Únete a los más de 6.000 usuarios que confían en GoViral para
                impulsar su presencia digital.
              </p>
              <Link
                href="https://goviral.es/"
                onClick={() => trackClick('click_comenzar_ahora')}
                className="bg-white text-[rgb(214,77,173)] px-10 py-4 rounded-full font-medium hover:bg-gray-50 transition-all duration-300 inline-block"
              >
                Comenzar Ahora
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Apple Style */}
      <footer id="contacto" className="bg-[#f5f5f7] text-gray-600 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Image
                    src="/logo.png"
                    alt="GoViral Logo"
                    width={36}
                    height={36}
                    className="rounded-lg"
                  />
                </div>
                <span className="font-semibold text-xl tracking-tight text-gray-900">
                  GoViral
                </span>
              </div>
              <p className="text-gray-500 leading-relaxed text-sm">
                Servicios de marketing digital para redes sociales. Impulsa tu
                presencia online con nosotros.
              </p>
              <div className="flex space-x-5 pt-4">
                <a
                  href="https://www.tiktok.com/@goviral_oficial"
                  className="text-gray-400 hover:text-[rgb(214,77,173)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/goviral_oficial/"
                  className="text-gray-400 hover:text-[rgb(214,77,173)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  href="https://x.com/goviral_oficial"
                  className="text-gray-400 hover:text-[rgb(214,77,173)] transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="mt-10 md:mt-0">
              <h3 className="font-semibold text-base mb-6 text-gray-900">
                Enlaces Rápidos
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#inicio"
                    className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                  >
                    Inicio
                  </Link>
                </li>
                <li>
                  <Link
                    href="#servicios"
                    className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                  >
                    Servicios
                  </Link>
                </li>
                <li>
                  <Link
                    href="#testimonios"
                    className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                  >
                    Testimonios
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://goviral.es/pages/contact"
                    onClick={() => trackClick('click_contacto_footer')}
                    className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                  >
                    Contacto
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-10 md:mt-0">
              <h3 className="font-semibold text-base mb-6 text-gray-900">
                Servicios
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="https://goviral.es/collections/instagram"
                    onClick={() =>
                      trackClick("click_collections_instagram_footer")
                    }
                    className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                  >
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://goviral.es/collections/tiktok"
                    onClick={() =>
                      trackClick("click_collections_tiktok_footer")
                    }
                    className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                  >
                    TikTok
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://goviral.es/collections/youtube"
                    onClick={() =>
                      trackClick("click_collections_youtube_footer")
                    }
                    className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                  >
                    YouTube
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://goviral.es/collections/spotify"
                    onClick={() =>
                      trackClick("click_collections_spotify_footer")
                    }
                    className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                  >
                    Spotify
                  </Link>
                </li>
              </ul>
            </div>

            <div className="mt-10 md:mt-0">
              <h3 className="font-semibold text-base mb-6 text-gray-900">
                Contacto
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="p-2 bg-[#f2f2f7] rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-[rgb(214,77,173)]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-gray-500 text-sm">
                    soporte@goviral.es
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-16 pt-8 text-center text-gray-400">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} GoViral. Todos los derechos
              reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}