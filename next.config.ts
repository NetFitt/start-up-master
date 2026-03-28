import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    // This tells Next.js to try AVIF first, then WebP, then the original format
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
