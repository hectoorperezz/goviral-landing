import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tu Aliado en Redes",
  description:
    "GoViral tiene la confianza de más de 6.000 usuarios y una valoración de 4.7 ★★★★★. Ofrecemos servicios de calidad y entrega inmediata.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Meta de verificación de Google */}
        <meta
          name="google-site-verification"
          content="wj6ck1acMc3rlUupdXEucQSQ6gMRotyLWkeuvSC_onA"
        />

        {/* GA4 + Google Ads (enhanced conversions + auto-linker) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-715BKDY6ZV"
        ></script>
        <script
          id="gtag-init"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}              
              gtag('js', new Date());

              // 1) Configuración GA4
              gtag('config', 'G-715BKDY6ZV');

              // 2) Configuración Google Ads
              gtag('config', 'AW-16805560957', {
                allow_enhanced_conversions: true,
                linker: { domains: ['goviral.es'] }
              });
            `,
          }}
        />

        {/* Helpers para disparar eventos GA4 y conversiones Google Ads */}
        <script
          id="ga-helpers"
          dangerouslySetInnerHTML={{
            __html: `
              window.trackGA = function(action, label) {
                if (window.gtag) {
                  window.gtag('event', action, {
                    event_category: 'outbound',
                    event_label: label,
                    value: 1
                  });
                }
              };
              window.sendGAdsConversion = function(sendTo, value) {
                if (window.gtag) {
                  window.gtag('event', 'conversion', {
                    send_to: sendTo,
                    value: value || 1.0,
                    currency: 'EUR'
                  });
                }
              };
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
