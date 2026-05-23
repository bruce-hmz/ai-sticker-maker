import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.pollinations.ai" },
    ],
  },
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
