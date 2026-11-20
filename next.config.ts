import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  cacheMaxMemorySize: 0, // Matikan in-memory cache bawaan Next.js (~50MB) demi hemat RAM STB
  compress: false,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // Payment proof photos are capped at 5MB in the action; leave room for multipart overhead.
      bodySizeLimit: '6mb',
    },
  },
  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== 'production',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.vieguard.web.id',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'vieguard.web.id',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    // Allow unoptimized local SVG fallbacks
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
