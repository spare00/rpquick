import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "rimh2.domainstatic.com.au", pathname: "/**" },
      { protocol: "https", hostname: "images.domain.com.au", pathname: "/**" },
    ],
  },
};

export default nextConfig;
