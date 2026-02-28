import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
     remotePatterns: [
      {
        protocol: 'https',
        // any host is allowed
        hostname: '**',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
