"use client";

import { useEffect, useState } from "react";
import { dateHeure } from "@/lib/klub/format";
import { libellePrix } from "@/lib/klub/paiement";
import { supabaseBrowser } from "@/lib/supabase-browser";

type Props = { version: number; notifier: (m: string) => void };

type Ligne = {
  id: string;
  prenom: string;
  nom: string;
  montant_centimes: number | null;
  remboursement_erreur: string | null;
  klub_seances: { titre: string; debut: string } | null;
};

/** Nombre de lignes lues ; au-delà, l'en-tête affiche « 20+ ». */
const LIMITE = 20;

/**
 * Encart visible seulement quand un remboursement a échoué cinq fois
 * (migration du 13 oct. 2026, `klub_remboursement_resultat`) : la tâche
 * minute ne le retente plus, il se termine depuis le tableau de bord Stripe
 * du praticien. Même motif que `KlubMailsEnErreur`.
 */
export default function KlubRemboursementsEnErreur({ version, notifier }: Props) {
  const [lignes, setLignes] = useState<Ligne[]>([]);

  useEffect(() => {
    // `actif` écarte une réponse arrivée après un rechargement plus récent.
    let actif = true;
    const t = window.setTimeout(async () => {
      const { data, error } = await supabaseBrowser()
        .from("klub_inscriptions")
        .select("id, prenom, nom, montant_centimes, remboursement_erreur, klub_seances(titre, debut)")
        .eq("remboursement", "erreur")
        .order("updated_at", { ascending: false })
        .limit(LIMITE)
        .returns<Ligne[]>();
      if (!actif) return;
      if (error) notifier(`Lecture des remboursements en échec impossible : ${error.message}`);
      setLignes(data ?? []);
    }, 0);
    return () => {
      actif = false;
      window.clearTimeout(t);
    };
  }, [notifier, version]);

  if (lignes.length === 0) return null;

  return (
    <section style={{ background: "rgba(158,68,51,.07)", border: "1px solid rgba(158,68,51,.25)", borderRadius: 16, padding: 16 }}>
      <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#9E4433" }}>
        {lignes.length}
        {lignes.length === LIMITE ? "+" : ""} remboursement{lignes.length > 1 ? "s" : ""} en échec : à faire depuis le
        tableau de bord Stripe du praticien
      </p>
      {lignes.map((l) => (
        <div key={l.id} style={{ padding: "8px 0", borderTop: "1px solid rgba(158,68,51,.15)" }}>
          <p style={{ margin: 0, fontSize: 13.5, color: "#003850" }}>
            <strong>{l.prenom} {l.nom}</strong>
            {l.montant_centimes !== null ? ` · ${libellePrix(l.montant_centimes)}` : ""}
            {l.klub_seances ? ` · ${l.klub_seances.titre}, ${dateHeure(l.klub_seances.debut)}` : ""}
          </p>
          {l.remboursement_erreur && (
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "rgba(51,51,52,.55)" }}>{l.remboursement_erreur}</p>
          )}
        </div>
      ))}
    </section>
  );
}
