import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Enable partial prerendering for faster page loads
    optimizePackageImports: ['lucide-react'],
  },

  // Optimize images and assets
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  // Enable compression
  compress: true,

  // Optimize bundle
  swcMinify: true,

  // Better caching
  poweredByHeader: false,

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
  }),
};

export default nextConfig;
