"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import InstagramReelTrial from "@/components/InstagramReelTrial";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { trackClick } from "@/lib/analytics";
import BlogSectionClient from "@/components/BlogSectionClient";

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
      <Header />

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
                Tu aliado en{" "}
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

      {/* Features Section - Apple Style with Mobile Optimization */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Subtle Background Elements - Hidden on mobile */}
        <div className="hidden md:block absolute top-40 left-10 w-60 h-60 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-1 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute bottom-40 right-10 w-72 h-72 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-1 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 transition-all duration-300 hover:scale-105">
              Por qué elegirnos
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight px-4">
              Somos el{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                mejor sitio
              </span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light px-4">
              Ofrecemos servicios de calidad con entrega inmediata y garantía.
            </p>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-6 sm:mt-8 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Feature 1 */}
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
              <div className="relative mb-6">
                <div className="w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
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
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-5 h-4 sm:h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 px-2">
                Entrega Inmediata
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm px-2">
                Todos los pedidos se procesan e inician dentro de los 60
                segundos posteriores al pago.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
              <div className="relative mb-6">
                <div className="w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
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
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-5 h-4 sm:h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 px-2">
                100% Garantizado
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm px-2">
                Todos nuestros servicios cuentan con garantía de un mes. Si
                experimenta alguna disminución, se lo compensaremos.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
              <div className="relative mb-6">
                <div className="w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
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
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-5 h-4 sm:h-5 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 px-2">
                Compra Segura
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm px-2">
                Nos comprometemos a nunca solicitar la contraseña de su cuenta.
                Su privacidad y seguridad son nuestra principal preocupación.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center text-center shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100">
              <div className="relative mb-6">
                <div className="w-12 sm:w-14 h-12 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 sm:h-6 sm:w-6"
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
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 sm:w-5 h-4 sm:h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                  <svg className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 px-2">
                Calidad superior
              </h3>
              <p className="text-gray-500 leading-relaxed text-sm px-2">
                Ofrecemos servicios de la más alta calidad, sin comprometer
                nuestros precios, que son los más competitivos del mercado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Reel Trial Section with Mobile Optimization */}
      <section id="prueba-gratis" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-[#f5f5f7] to-white relative overflow-hidden">
        {/* Instagram-inspired background elements - Hidden on mobile for better readability */}
        <div className="hidden sm:block absolute top-20 left-10 w-48 md:w-64 h-48 md:h-64 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-2 md:opacity-5 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-20 right-10 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-2 md:opacity-5 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="bg-gradient-to-r from-[#FF7A00] via-[#FF0169] to-[#D300C5] p-1 rounded-xl sm:rounded-2xl shadow-lg shadow-pink-500/20 transform hover:rotate-6 transition-transform duration-300">
              <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <Image
                  src="/instagram.svg"
                  alt="Instagram"
                  width={40}
                  height={40}
                  className="sm:w-12 sm:h-12 rounded-lg"
                />
              </div>
            </div>
          </div>
          
          <InstagramReelTrial />
        </div>
      </section>

      {/* Platforms Section - Apple Style with Mobile Optimization */}
      <section id="servicios" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#f5f5f7] relative overflow-hidden">
        {/* Background Elements - Hidden on mobile */}
        <div className="hidden md:block absolute top-40 left-0 w-64 h-64 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-1 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute bottom-40 right-0 w-80 h-80 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-1 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 transition-all duration-300 hover:scale-105">
              Servicios
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight px-4">
              Nuestras{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                Plataformas
              </span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light px-4">
              Impulsa tu presencia digital en las principales redes sociales
            </p>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-6 sm:mt-8 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Instagram */}
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center h-full border border-gray-100">
              <div className="mb-6 sm:mb-8 transform hover:scale-105 transition-transform duration-300 relative">
                <div className="bg-gradient-to-r from-[#FF7A00] via-[#FF0169] to-[#D300C5] p-1 rounded-xl sm:rounded-2xl">
                  <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <Image
                  src="/instagram.png"
                  alt="Instagram"
                      width={48}
                      height={48}
                      className="sm:w-16 sm:h-16 rounded-lg sm:rounded-xl"
                />
              </div>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 text-center px-2">
                Instagram
              </h3>
              <p className="text-gray-500 text-center mb-6 sm:mb-8 leading-relaxed text-sm px-2">
                Aumenta tus seguidores, likes y comentarios en Instagram.
              </p>
              <Link
                href="https://goviral.es/collections/instagram"
                onClick={() => trackClick("click_collections_instagram")}
                className="mt-auto text-center w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Ver Servicios
              </Link>
            </div>

            {/* TikTok */}
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center h-full border border-gray-100">
              <div className="mb-6 sm:mb-8 transform hover:scale-105 transition-transform duration-300 relative">
                <div className="bg-black p-1 rounded-xl sm:rounded-2xl">
                  <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <Image
                  src="/tiktok.png"
                  alt="TikTok"
                      width={48}
                      height={48}
                      className="sm:w-16 sm:h-16 rounded-lg sm:rounded-xl"
                />
              </div>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 text-center px-2">
                TikTok
              </h3>
              <p className="text-gray-500 text-center mb-6 sm:mb-8 leading-relaxed text-sm px-2">
                Consigue más seguidores, likes y visualizaciones en TikTok.
              </p>
              <Link
                href="https://goviral.es/collections/tiktok"
                onClick={() => trackClick("click_collections_tiktok")}
                className="mt-auto text-center w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Ver Servicios
              </Link>
            </div>

            {/* YouTube */}
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center h-full border border-gray-100">
              <div className="mb-6 sm:mb-8 transform hover:scale-105 transition-transform duration-300 relative">
                <div className="bg-red-600 p-1 rounded-xl sm:rounded-2xl">
                  <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <Image
                  src="/youtube.png"
                  alt="YouTube"
                      width={48}
                      height={48}
                      className="sm:w-16 sm:h-16 rounded-lg sm:rounded-xl"
                />
              </div>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 text-center px-2">
                YouTube
              </h3>
              <p className="text-gray-500 text-center mb-6 sm:mb-8 leading-relaxed text-sm px-2">
                Aumenta tus suscriptores, likes y visualizaciones en YouTube.
              </p>
              <Link
                href="https://goviral.es/collections/youtube"
                onClick={() => trackClick("click_collections_youtube")}
                className="mt-auto text-center w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Ver Servicios
              </Link>
            </div>

            {/* Spotify */}
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center h-full border border-gray-100">
              <div className="mb-6 sm:mb-8 transform hover:scale-105 transition-transform duration-300 relative">
                <div className="bg-green-500 p-1 rounded-xl sm:rounded-2xl">
                  <div className="bg-white p-2 sm:p-3 rounded-lg sm:rounded-xl">
                <Image
                  src="/spotify.png"
                  alt="Spotify"
                      width={48}
                      height={48}
                      className="sm:w-16 sm:h-16 rounded-lg sm:rounded-xl"
                />
              </div>
                </div>
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-3 text-gray-900 text-center px-2">
                Spotify
              </h3>
              <p className="text-gray-500 text-center mb-6 sm:mb-8 leading-relaxed text-sm px-2">
                Consigue más seguidores, reproducciones y guardados en Spotify.
              </p>
              <Link
                href="https://goviral.es/collections/spotify"
                onClick={() => trackClick("click_collections_spotify")}
                className="mt-auto text-center w-full bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full font-medium text-sm sm:text-base hover:shadow-lg transition-all duration-300 transform hover:scale-105"
              >
                Ver Servicios
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Apple Style with Mobile Optimization */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Background Elements - Hidden on mobile for better readability */}
        <div className="hidden md:block absolute top-40 left-0 w-60 h-60 bg-[rgb(214,77,173)] opacity-2 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute bottom-40 right-0 w-72 h-72 bg-[rgb(244,102,110)] opacity-2 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 shadow-sm relative transition-all duration-300 hover:scale-105">
              <span className="absolute inset-0 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] opacity-10 rounded-full"></span>
              <span className="relative">NUESTROS PLANES</span>
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight px-4">
              Elige tu{" "}
              <span className="relative inline-block">
                <span className="absolute -inset-1 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] blur-md opacity-30 rounded-lg"></span>
                <span className="relative bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">plan ideal</span>
              </span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light px-4">
              Planes diseñados para adaptarse a tus necesidades y objetivos de
              crecimiento en Instagram
            </p>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-6 sm:mt-8 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto relative">
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

      {/* Blog Promotion Section */}
      <BlogSectionClient />

      {/* FAQ Section - Apple Style with Mobile Optimization */}
      <section id="faq" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-[#f5f5f7] relative overflow-hidden">
        {/* Background Elements - Hidden on mobile */}
        <div className="hidden md:block absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-1 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-1 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <span className="inline-block px-3 sm:px-4 py-1.5 bg-white text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 transition-all duration-300 hover:scale-105">
              PREGUNTAS FRECUENTES
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight px-4">
              Preguntas y{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                Respuestas
              </span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light px-4">
              A continuación encontrará la respuesta a las preguntas más
              frecuentes que se plantean sobre nuestros servicios.
            </p>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-6 sm:mt-8 mx-auto"></div>
          </div>

          <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
            {/* Pregunta 1 */}
            <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-xl sm:rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-300">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-4">
                    ¿Cuánto tiempo se tarda en entregar mi pedido?
                  </h3>
                  <span className="ml-4 flex-shrink-0 text-[rgb(214,77,173)] p-2 rounded-full hover:bg-pink-50 transition-colors duration-300">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 transform group-open:rotate-180 transition-transform duration-300"
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
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    La entrega del pedido se realiza en pocos minutos
                    normalmente. El tiempo máximo de entrega es de 72 horas.
                  </p>
                </div>
              </details>
            </div>

            {/* Pregunta 2 */}
            <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-xl sm:rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-300">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-4">
                    ¿Corro el riesgo de ser prohibido o sancionado si compro sus
                    servicios?
                  </h3>
                  <span className="ml-4 flex-shrink-0 text-[rgb(214,77,173)] p-2 rounded-full hover:bg-pink-50 transition-colors duration-300">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 transform group-open:rotate-180 transition-transform duration-300"
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
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    No, nuestros servicios son seguros y no existe posibilidad
                    de baneo por parte de las plataformas. Sin embargo, un uso
                    abusivo puede provocar shadow bans temporales en algunas
                    redes sociales.
                  </p>
                </div>
              </details>
            </div>

            {/* Pregunta 3 */}
            <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-xl sm:rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-300">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-4">
                    ¿Necesita mis credenciales para brindar los servicios?
                  </h3>
                  <span className="ml-4 flex-shrink-0 text-[rgb(214,77,173)] p-2 rounded-full hover:bg-pink-50 transition-colors duration-300">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 transform group-open:rotate-180 transition-transform duration-300"
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
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    No, no necesitamos tus credenciales para brindar nuestros
                    servicios.
                  </p>
                </div>
              </details>
            </div>

            {/* Pregunta 4 */}
            <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-xl sm:rounded-2xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <details className="group">
                <summary className="flex items-center justify-between p-4 sm:p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-300">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 pr-4">
                    ¿Se entrega factura con los pedidos?
                  </h3>
                  <span className="ml-4 flex-shrink-0 text-[rgb(214,77,173)] p-2 rounded-full hover:bg-pink-50 transition-colors duration-300">
                    <svg
                      className="h-5 w-5 sm:h-6 sm:w-6 transform group-open:rotate-180 transition-transform duration-300"
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
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 pt-0">
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Sí, en los correos de confirmación del pedido ofrecemos la
                    posibilidad de obtener una factura del pedido.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Apple Style with Mobile Optimization */}
      <section id="herramientas" className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Background Elements - Hidden on mobile */}
        <div className="hidden md:block absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-1 rounded-full blur-3xl"></div>
        <div className="hidden md:block absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-1 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 transition-all duration-300 hover:scale-105">
              Testimonios
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight px-4">
              Lo que dicen nuestros{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                clientes
              </span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light px-4">
              Miles de personas y empresas confían en nosotros para crecer en
              redes sociales
            </p>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-6 sm:mt-8 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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

      <Footer />
    </main>
  );
}
