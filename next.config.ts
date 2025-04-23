import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Désactive LightningCSS pour éviter l’erreur de binaire manquante
    optimizeCss: false,
  },
};

export default nextConfig;
