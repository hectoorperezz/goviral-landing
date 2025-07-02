"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { trackClick } from "@/lib/analytics";

export default function Footer() {
  return (
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
                  href="/#inicio"
                  className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/#servicios"
                  className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                >
                  Servicios
                </Link>
              </li>
                              <li>
                  <Link
                    href="/#herramientas"
                    className="text-gray-500 hover:text-[rgb(214,77,173)] transition-colors duration-200 text-sm"
                  >
                    Herramientas
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
  );
} 