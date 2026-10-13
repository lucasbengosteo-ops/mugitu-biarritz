"use client";

import { useEffect, useState } from "react";
import { dateHeure } from "@/lib/klub/format";
import type { Mail, TypeMail } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { appeler } from "./rpc";
import { Bouton, Carte } from "../ui";

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
  place_liberee: "Place libérée, à payer",
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
    <Carte
      titre={`${lignes.length}${lignes.length === LIMITE ? "+" : ""} mail${lignes.length > 1 ? "s" : ""} n’${lignes.length > 1 ? "ont" : "a"} pas pu partir`}
      style={{ borderLeft: "4px solid #EE806C" }}
    >
      {lignes.map((l) => (
        <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "10px 0", borderTop: "1px solid rgba(0,56,80,.08)" }}>
          <span style={{ fontSize: 15, lineHeight: 1.45, color: "#003850", flex: "1 1 220px", minWidth: 0 }}>
            <strong>{LIBELLE[l.type]}</strong>
            {l.klub_seances ? ` · ${l.klub_seances.titre}, ${dateHeure(l.klub_seances.debut)}` : ""}
            {l.klub_inscriptions ? ` · ${l.klub_inscriptions.prenom} ${l.klub_inscriptions.nom}` : ""}
            {l.derniere_erreur && (
              <span style={{ display: "block", fontSize: 13, color: "rgba(0,56,80,.72)", overflowWrap: "anywhere" }}>{l.derniere_erreur}</span>
            )}
          </span>
          <Bouton variante="secondaire" taille="petite" disabled={occupe} onClick={() => void relancer(l.id)}>
            Relancer
          </Bouton>
        </div>
      ))}
    </Carte>
  );
}
