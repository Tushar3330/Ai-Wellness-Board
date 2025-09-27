/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds (not recommended for production)
    ignoreBuildErrors: false,
  },
  experimental: {
    typedRoutes: false,
  },
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
  },
  // Enable bundle analyzer
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzer: {
      enabled: true,
    },
  }),
}

module.exports = nextConfig