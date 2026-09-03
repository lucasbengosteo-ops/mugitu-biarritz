import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.doctolib.com",
        pathname: "/image/upload/**",
      },
      {
        // Images déposées depuis le back-office (bucket public `site-medias`).
        protocol: "https",
        hostname: "nuehdfyscqnkckudkqhe.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
