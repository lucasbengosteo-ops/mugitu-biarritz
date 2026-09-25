"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { ACCES_INITIAL, type Acces } from "./droits";

/**
 * Session et droits du back-office, lus une fois et partagés par les écrans.
 *
 * Le prénom vient des métadonnées du compte, à défaut de la partie gauche de
 * l'adresse : ça suffit pour dire bonjour, et ça évite une lecture de plus.
 */
export function useAcces(): Acces & { recharger: () => void } {
  const [acces, setAcces] = useState<Acces>(ACCES_INITIAL);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const { data } = await sb.auth.getSession();
    const session = data.session;
    if (!session) {
      setAcces({ ...ACCES_INITIAL, etat: "deconnecte" });
      return;
    }
    const [{ data: equipe }, { data: patron }] = await Promise.all([
      sb.rpc("site_est_equipe"),
      sb.rpc("site_est_super_admin"),
    ]);
    const meta = session.user.user_metadata as { prenom?: string; first_name?: string } | null;
    const prenom = meta?.prenom ?? meta?.first_name ?? (session.user.email ?? "").split("@")[0];
    setAcces({
      etat: "pret",
      userId: session.user.id,
      prenom,
      estEquipe: Boolean(equipe),
      estSuperAdmin: Boolean(patron),
    });
  }, []);

  useEffect(() => {
    // Même motif que les autres écrans : on s'abonne à la session, et le
    // premier chargement passe par un timeout (lint React Compiler).
    const { data } = supabaseBrowser().auth.onAuthStateChange(() => {
      void charger();
    });
    const initial = window.setTimeout(() => void charger(), 0);
    return () => {
      data.subscription.unsubscribe();
      window.clearTimeout(initial);
    };
  }, [charger]);

  return { ...acces, recharger: () => void charger() };
}
