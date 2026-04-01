import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.doctolib.com",
        pathname: "/image/upload/**",
      },
    ],
  },
};

export default nextConfig;
