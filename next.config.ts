import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
        { key: "X-DNS-Prefetch-Control", value: "on" },
      ],
    },
  ],
};

export default nextConfig;
