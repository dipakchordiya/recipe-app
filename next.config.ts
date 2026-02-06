import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.contentstack.io",
      },
      {
        protocol: "https",
        hostname: "assets.contentstack.io",
      },
      {
        protocol: "https",
        hostname: "eu-images.contentstack.com",
      },
      {
        protocol: "https",
        hostname: "eu-assets.contentstack.com",
      },
    ],
  },
};

export default nextConfig;
