import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable experimental features for better performance
  experimental: {
    // Enable partial prerendering for faster page loads
    optimizePackageImports: ['lucide-react', '@radix-ui/react-avatar', '@radix-ui/react-select'],
    // Enable faster refresh in development
    forceSwcTransforms: true,
  },

  // Development performance optimizations
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimize development builds
      config.optimization = {
        ...config.optimization,
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
      };
    }
    return config;
  },

  // Optimize images and assets
  images: {
    formats: ['image/webp', 'image/avif'],
  },

  // Enable compression
  compress: true,

  // Better caching
  poweredByHeader: false,

  // Allow cross-origin requests from Builder.io development environment
  allowedDevOrigins: [
    '*.fly.dev',
    '*.builder.codes'
  ],

  // Allow cross-origin requests for Builder.io development environment
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'clipboard-write=*, clipboard-read=*',
          },
        ],
      },
    ];
  },

  // Production optimizations
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
  }),
};

export default nextConfig;
