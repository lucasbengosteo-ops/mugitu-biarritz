import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // La méthode Allyane s'appelle désormais Thérapie Galmeon : l'ancienne
      // adresse, déjà indexée et partagée, renvoie vers la nouvelle.
      { source: "/methodes/allyane", destination: "/methodes/galmeon", permanent: true },
      // Liens morts de l'ancien pied de page (accueil et concours, en français
      // et en basque) : les pages légales n'existent qu'en français.
      { source: "/politique-confidentialite", destination: "/confidentialite", permanent: true },
      { source: "/eu/politique-confidentialite", destination: "/confidentialite", permanent: true },
      { source: "/eu/mentions-legales", destination: "/mentions-legales", permanent: true },
    ];
  },
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
