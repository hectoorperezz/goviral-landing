/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['randomuser.me', 'images.unsplash.com', 'plus.unsplash.com'],
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