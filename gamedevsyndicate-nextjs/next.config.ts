import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Disable CSS optimization that might tree-shake dynamic styles
    optimizeCss: false,
  },
  // Ensure CSS variables and inline styles are preserved
  compiler: {
    // Remove console logs in production but keep styles
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
};

export default nextConfig;
