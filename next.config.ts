import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack and use webpack to prevent fatal errors
  turbopack: {},
  // Use webpack configuration
  webpack: (config, { dev, isServer }) => {
    return config;
  },
  // Fix cross-origin issues with correct Next.js 16 syntax
  serverExternalPackages: [],
};

export default nextConfig;
