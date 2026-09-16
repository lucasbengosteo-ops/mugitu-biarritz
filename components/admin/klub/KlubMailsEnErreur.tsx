"use client";

import { useEffect, useState } from "react";
import { dateHeure } from "@/lib/klub/format";
import type { Mail, TypeMail } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { appeler } from "./rpc";
import { bouton } from "./styles";

type Props = { version: number; notifier: (m: string) => void; rafraichir: () => void };

type Ligne = Mail & {
  klub_seances: { titre: string; debut: string } | null;
  klub_inscriptions: { prenom: string; nom: string } | null;
};

/** Nombre de mails en erreur lus ; au-delà, l'en-tête affiche « 20+ ». */
const LIMITE = 20;

const LIBELLE: Record<TypeMail, string> = {
  confirmation: "Confirmation",
  attente: "Liste d’attente",
  promotion: "Place libérée",
  annulation: "Annulation",
  rappel: "Rappel",
  seance_modifiee: "Séance modifiée",
  seance_annulee: "Séance annulée",
  liste_intervenant: "Liste intervenant",
};

/** Encart visible seulement quand des mails n'ont pas pu partir après trois relances. */
export default function KlubMailsEnErreur({ version, notifier, rafraichir }: Props) {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [occupe, setOccupe] = useState(false);

  useEffect(() => {
    // `actif` écarte une réponse arrivée après un rechargement plus récent.
    let actif = true;
    const t = window.setTimeout(async () => {
      const { data, error } = await supabaseBrowser()
        .from("klub_mails")
        .select("*, klub_seances(titre, debut), klub_inscriptions(prenom, nom)")
        .eq("statut", "erreur")
        .order("created_at", { ascending: false })
        .limit(LIMITE);
      if (!actif) return;
      if (error) notifier(`Lecture des mails impossible : ${error.message}`);
      setLignes((data ?? []) as Ligne[]);
    }, 0);
    return () => {
      actif = false;
      window.clearTimeout(t);
    };
  }, [notifier, version]);

  if (lignes.length === 0) return null;

  const relancer = async (id: string) => {
    setOccupe(true);
    const r = await appeler<null>("klub_admin_relancer_mail", { p_id: id });
    setOccupe(false);
    if (!r.ok) return notifier(`Relance refusée : ${r.message}`);
    notifier("Mail remis en file : il part dans la minute.");
    rafraichir();
  };

  return (
    <section style={{ background: "rgba(158,68,51,.07)", border: "1px solid rgba(158,68,51,.25)", borderRadius: 16, padding: 16 }}>
      <p style={{ margin: "0 0 10px", fontSize: 14, fontWeight: 700, color: "#9E4433" }}>
        {lignes.length}
        {lignes.length === LIMITE ? "+" : ""} mail{lignes.length > 1 ? "s" : ""} n’{lignes.length > 1 ? "ont" : "a"} pas pu partir
      </p>
      {lignes.map((l) => (
        <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "8px 0", borderTop: "1px solid rgba(158,68,51,.15)" }}>
          <span style={{ fontSize: 13.5, color: "#003850", flex: 1, minWidth: 240 }}>
            <strong>{LIBELLE[l.type]}</strong>
            {l.klub_seances ? ` · ${l.klub_seances.titre}, ${dateHeure(l.klub_seances.debut)}` : ""}
            {l.klub_inscriptions ? ` · ${l.klub_inscriptions.prenom} ${l.klub_inscriptions.nom}` : ""}
            {l.derniere_erreur && (
              <span style={{ display: "block", fontSize: 12, color: "rgba(51,51,52,.55)" }}>{l.derniere_erreur}</span>
            )}
          </span>
          <button type="button" disabled={occupe} onClick={() => void relancer(l.id)} style={bouton("contour", true)}>
            Relancer
          </button>
        </div>
      ))}
    </section>
  );
}
