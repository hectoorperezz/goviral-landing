"use client";

import React from "react";
import Image from "next/image";
import InstagramReelTrial from "@/components/InstagramReelTrial";

export default function ReelViewsBooster() {
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
                  ReelViews{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] via-[rgb(244,102,110)] to-[rgb(214,77,173)] animate-gradient-x font-extrabold">
                  Booster
                </span>
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed font-light mb-6 sm:mb-8 px-4">
              Impulsa tus Instagram Reels con{" "}
              <span className="text-[rgb(214,77,173)] font-semibold">
                500 visualizaciones gratuitas
              </span>
              . <br className="hidden sm:block"/>
              Aumenta tu alcance y engagement de forma instantánea.
            </p>
            
            {/* Elegant Call to Action */}
            <div className="flex justify-center px-4">
              <a 
                href="#prueba-gratis"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[rgb(214,77,173)] text-white font-medium text-sm sm:text-base rounded-full hover:bg-[rgb(194,57,153)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto justify-center max-w-xs"
              >
                Empezar ahora
                <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
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

      {/* How It Works Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-white relative overflow-hidden">
        {/* Subtle Background Elements - Hidden on mobile, minimal on tablets */}
        <div className="hidden sm:block absolute top-40 left-10 w-60 md:w-80 h-60 md:h-80 bg-gradient-to-r from-[#FF7A00] to-[#FF0169] opacity-1 md:opacity-2 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-40 right-10 w-72 md:w-96 h-72 md:h-96 bg-gradient-to-r from-[#FF0169] to-[#D300C5] opacity-1 md:opacity-2 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
            <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6">
              PROCESO SIMPLE
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight px-4">
              ¿Cómo{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                funciona
              </span>
              ?
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light px-4">
              Un proceso simple en 3 pasos para impulsar tu contenido de forma segura y efectiva
            </p>
            <div className="h-1 w-16 sm:w-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full mt-6 sm:mt-8 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl sm:text-2xl">1</span>
                </div>
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-5 sm:w-6 h-5 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 px-2">Ingresa tu información</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base px-2">
                Proporciona tu nombre, email y el enlace de tu Reel de Instagram de forma segura
              </p>
            </div>

            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl sm:text-2xl">2</span>
                </div>
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-5 sm:w-6 h-5 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 px-2">Verifica tu email</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base px-2">
                Recibe un código de verificación instantáneo y confirma tu solicitud fácilmente
              </p>
            </div>

            <div className="group bg-gradient-to-b from-white to-[#f8f8fa] p-6 sm:p-8 rounded-2xl sm:rounded-3xl hover:translate-y-[-4px] sm:hover:translate-y-[-8px] transition-all duration-300 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] border border-gray-100 text-center">
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)] rounded-full flex items-center justify-center mx-auto shadow-lg group-hover:scale-105 sm:group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white font-bold text-xl sm:text-2xl">3</span>
                </div>
                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-5 sm:w-6 h-5 sm:h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h3 className="font-semibold text-lg sm:text-xl text-gray-900 mb-3 sm:mb-4 px-2">¡Recibe tus views!</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base px-2">
                Disfruta de 500 visualizaciones reales y ve crecer tu engagement al instante
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 sm:mt-16 text-center px-4">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 px-3 sm:px-4 py-2 rounded-full">
              <svg className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-green-700 font-medium text-xs sm:text-sm">
                Proceso 100% automatizado y seguro
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-32 bg-gradient-to-b from-[#f5f5f7] to-white relative overflow-hidden">
        {/* Background Elements - Hidden on mobile for better readability */}
        <div className="hidden sm:block absolute top-40 left-0 w-48 md:w-64 h-48 md:h-64 bg-[rgb(214,77,173)] opacity-3 md:opacity-5 rounded-full blur-3xl"></div>
        <div className="hidden sm:block absolute bottom-40 right-0 w-64 md:w-80 h-64 md:h-80 bg-[rgb(244,102,110)] opacity-3 md:opacity-5 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-b from-white to-[#f8f8fa] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-gray-100 p-6 sm:p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 left-0 w-full h-1.5 sm:h-2 bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]"></div>
              
              <div className="relative z-10">
                <span className="inline-block px-3 sm:px-4 py-1.5 bg-[#f2f2f7] text-[rgb(214,77,173)] font-medium text-xs tracking-wide rounded-full mb-6 sm:mb-8">
                  DESCUBRE MÁS
                </span>
                
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 text-gray-900 tracking-tight px-2">
                  ¿Quieres más{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[rgb(214,77,173)] to-[rgb(244,102,110)]">
                    herramientas
                  </span>
                  ?
                </h2>
                
                <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed font-light px-4">
                  Descubre nuestros planes completos para crecer exponencialmente en Instagram y otras redes sociales
                </p>

                <div className="flex flex-col gap-3 sm:gap-4 justify-center items-center max-w-md mx-auto">
                  <a
                    href="https://goviral.es/collections"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-[rgb(214,77,173)] text-white font-medium text-sm sm:text-base rounded-full hover:bg-[rgb(194,57,153)] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full"
                  >
                    Ver Todos los Servicios
                    <svg className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                  
                  <a
                    href="/#herramientas"
                    className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-[rgb(214,77,173)] border-2 border-[rgb(214,77,173)] font-medium text-sm sm:text-base rounded-full hover:bg-[rgb(214,77,173)] hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full"
                  >
                    Más Herramientas Gratis
                  </a>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(214,77,173)] mb-1 sm:mb-2">6.000+</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Usuarios satisfechos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(214,77,173)] mb-1 sm:mb-2">4.8/5</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Valoración promedio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-[rgb(214,77,173)] mb-1 sm:mb-2">24/7</div>
                    <div className="text-gray-600 text-xs sm:text-sm">Soporte disponible</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
} 