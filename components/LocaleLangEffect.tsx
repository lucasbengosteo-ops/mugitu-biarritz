"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { detectLocale } from "@/lib/i18n";

/**
 * Synchronise `document.documentElement.lang` avec la locale détectée
 * dans l'URL. Le SSR initial sert `lang="fr"` (par défaut dans
 * RootLayout) ; ce composant met à jour côté client si l'utilisateur
 * est sur une route /eu.
 *
 * Idéalement on ferait ça côté serveur via headers()/middleware, mais
 * pour rester simple on accepte un léger flash SSR sur les pages EU.
 */
export default function LocaleLangEffect() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = detectLocale(pathname || "/");
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
    }
  }, [pathname]);

  return null;
}
