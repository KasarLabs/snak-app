const isProd = process.env.NODE_ENV === 'production';

const internalHost = process.env.TAURI_DEV_HOST || 'localhost';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This will skip type checking during builds
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'kasar.io',
      },
      {
        protocol: 'https',
        hostname: 'github.com',
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
      },
    ],
    unoptimized: true,
  },
  experimental: {},

  assetPrefix: isProd ? undefined : `http://${internalHost}:3000`,
};

module.exports = nextConfig;
