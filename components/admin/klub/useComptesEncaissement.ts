"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { Compte } from "./encaissement";

type LigneProfil = { user_id: string; first_name: string | null; last_name: string | null };
type LigneCompteStripe = { user_id: string; etat: string };

/**
 * Les comptes de l'équipe (`profiles`, qui ne contient que des praticiens —
 * vérifié en base le 13 oct. 2026) et l'identifiant de ceux dont le compte
 * Stripe est prêt. La RLS de `site_comptes_stripe` filtre déjà la seconde
 * lecture : un non-gérant n'y voit que sa propre ligne, ce qu'`etatEncaissement`
 * prend en compte pour afficher le bon message.
 */
export function useComptesEncaissement(version: number, notifier: (m: string) => void) {
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [comptesPrets, setComptesPrets] = useState<Set<string>>(new Set());

  useEffect(() => {
    // `actif` écarte une réponse arrivée après un rechargement plus récent.
    let actif = true;
    const t = window.setTimeout(async () => {
      const sb = supabaseBrowser();
      const [p, c] = await Promise.all([
        sb.from("profiles").select("user_id, first_name, last_name"),
        sb.from("site_comptes_stripe").select("user_id, etat"),
      ]);
      if (!actif) return;
      if (p.error) notifier(`Lecture des comptes de l’équipe impossible : ${p.error.message}`);
      setComptes(
        ((p.data ?? []) as LigneProfil[]).map((x) => ({
          user_id: x.user_id,
          nom: [x.first_name, x.last_name].filter(Boolean).join(" ") || x.user_id.slice(0, 8),
        })),
      );
      if (!c.error) {
        setComptesPrets(
          new Set(((c.data ?? []) as LigneCompteStripe[]).filter((x) => x.etat === "pret").map((x) => x.user_id)),
        );
      }
    }, 0);
    return () => {
      actif = false;
      window.clearTimeout(t);
    };
  }, [notifier, version]);

  return { comptes, comptesPrets };
}
