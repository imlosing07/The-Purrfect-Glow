/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir que el build continúe aunque haya errores
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Compresión gzip
  compress: true,

  // Tree-shaking de paquetes pesados
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  // Optimización de imágenes
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 2592000, // 30 días
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
