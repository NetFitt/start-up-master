import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/f/**",
      },
      {
        protocol: 'https',
        hostname: 'ngazytggec.ufs.sh', // 🚀 ADD THIS EXACT DOMAIN
        port: '',
        pathname: '/f/**',
      },
    ],
  },
};

export default nextConfig;