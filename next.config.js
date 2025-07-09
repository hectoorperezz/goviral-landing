/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'randomuser.me',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'xe6fxjefa8akrjj8.public.blob.vercel-storage.com',
      },
    ],
  },
  devIndicators: false,
  eslint: {
    // Ignorar errores de ESLint durante la compilación
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignorar errores de TypeScript durante la compilación
    ignoreBuildErrors: true,
  }
};

module.exports = nextConfig;