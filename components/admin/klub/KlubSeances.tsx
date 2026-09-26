"use client";

import { useEffect, useState } from "react";
import { cleJour, dateLongue, depuisChampDateHeure, heure } from "@/lib/klub/format";
import { COULEUR_TYPE, type ChampsSeance, type Seance, type StatutInscription } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ChampsSeanceForm from "./ChampsSeanceForm";
import KlubSeanceDetail from "./KlubSeanceDetail";
import { appeler } from "./rpc";
import { bouton, CARTE, CHAMP, LABEL, TITRE_SECTION } from "./styles";

type Props = { version: number; notifier: (m: string) => void; rafraichir: () => void };

type Ligne = Seance & { klub_inscriptions: { statut: StatutInscription }[] };

const NOUVELLE: ChampsSeance = {
  type: "atelier",
  titre: "",
  description: "",
  intervenant: "",
  intervenant_email: null,
  duree_min: 90,
  capacite: 12,
  prix_libelle: "",
  inscription_requise: true,
  reservation_url: null,
  reservation_libelle: null,
  image: null,
  image_focus: "50% 50%",
};

/** `depuisChampDateHeure` lève sur une valeur vide ou mal formée : on contrôle avant de l'appeler. */
const REGEX_CHAMP_DATE_HEURE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

function remplissage(l: Ligne): string {
  if (!l.inscription_requise) return "Entrée libre";
  const c = l.klub_inscriptions.filter((i) => i.statut === "confirmee").length;
  const a = l.klub_inscriptions.filter((i) => i.statut === "attente").length;
  return `${c}/${l.capacite}${a ? ` · ${a} en attente` : ""}`;
}

export default function KlubSeances({ version, notifier, rafraichir }: Props) {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [creation, setCreation] = useState<ChampsSeance | null>(null);
  const [debut, setDebut] = useState("");
  const [occupe, setOccupe] = useState(false);

  useEffect(() => {
    // `actif` écarte une réponse arrivée après un rechargement plus récent.
    let actif = true;
    const t = window.setTimeout(async () => {
      const maintenant = Date.now();
      const { data, error } = await supabaseBrowser()
        .from("klub_seances")
        .select("*, klub_inscriptions(statut)")
        .gte("debut", new Date(maintenant - 6 * 3600_000).toISOString())
        .lt("debut", new Date(maintenant + 29 * 86400_000).toISOString())
        .order("debut");
      if (!actif) return;
      if (error) notifier(`Lecture impossible : ${error.message}`);
      setLignes((data ?? []) as Ligne[]);
    }, 0);
    return () => {
      actif = false;
      window.clearTimeout(t);
    };
  }, [notifier, version]);

  const creer = async () => {
    if (!creation) return;
    if (!REGEX_CHAMP_DATE_HEURE.test(debut)) return notifier("Indiquez la date et l’heure.");
    setOccupe(true);
    const r = await appeler<string>("klub_admin_creer_seance", { p: { ...creation, debut: depuisChampDateHeure(debut) } });
    setOccupe(false);
    if (!r.ok) return notifier(`Création refusée : ${r.message}`);
    notifier("Séance créée.");
    // Le lien d'inscription ne passe pas par klub_admin_creer_seance : il se
    // pose par sa propre fonction, juste après. Sans cet appel, un lien saisi
    // à la création disparaîtrait sans rien dire.
    if (creation.reservation_url) {
      const resa = await appeler("klub_admin_reservation", {
        p_cible: "seance",
        p_id: r.data,
        p_url: creation.reservation_url,
        p_libelle: creation.reservation_libelle,
      });
      if (!resa.ok) {
        notifier(`Séance créée, mais le lien d’inscription n’a pas été posé : ${resa.message}`);
      }
    }
    if (creation.image) {
      const img = await appeler("klub_admin_image", {
        p_cible: "seance",
        p_id: r.data,
        p_image: creation.image,
        p_focus: creation.image_focus,
      });
      if (!img.ok) {
        notifier(`Séance créée, mais l’image n’a pas été posée : ${img.message}`);
      }
    }
    setCreation(null);
    setDebut("");
    setSelection(r.data);
    rafraichir();
  };

  const parJour = new Map<string, Ligne[]>();
  for (const l of lignes) {
    const cle = cleJour(l.debut);
    parJour.set(cle, [...(parJour.get(cle) ?? []), l]);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,360px) minmax(0,1fr)", gap: 20, alignItems: "start" }}>
      <aside style={{ ...CARTE, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ ...TITRE_SECTION, margin: 0 }}>À venir</p>
          <button
            type="button"
            onClick={() => {
              setSelection(null);
              setCreation({ ...NOUVELLE });
            }}
            style={bouton("plein", true)}
          >
            Séance ponctuelle
          </button>
        </div>
        {lignes.length === 0 && (
          <p style={{ margin: 0, fontSize: 13.5, color: "rgba(51,51,52,.55)" }}>
            Aucune séance. Créez un créneau hebdomadaire ou une séance ponctuelle.
          </p>
        )}
        {[...parJour.entries()].map(([cle, duJour]) => {
          const libelle = dateLongue(`${cle}T12:00:00Z`);
          return (
            <div key={cle} style={{ marginBottom: 14 }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#003850" }}>
                {libelle.charAt(0).toUpperCase() + libelle.slice(1)}
              </p>
              {duJour.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => {
                    setCreation(null);
                    setSelection(l.id);
                  }}
                  aria-current={selection === l.id ? "true" : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    width: "100%",
                    textAlign: "left",
                    padding: "8px 10px",
                    marginBottom: 4,
                    borderRadius: 10,
                    border: "1px solid",
                    borderColor: selection === l.id ? "#04A49B" : "rgba(0,56,80,.1)",
                    background: selection === l.id ? "rgba(4,164,155,.07)" : "transparent",
                    font: "inherit",
                    cursor: "pointer",
                    opacity: l.statut === "annulee" ? 0.5 : 1,
                  }}
                >
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: COULEUR_TYPE[l.type] }} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#003850", minWidth: 48 }}>{heure(l.debut)}</span>
                  <span style={{ fontSize: 13, color: "#003850", flex: 1, textDecoration: l.statut === "annulee" ? "line-through" : "none" }}>
                    {l.titre}
                  </span>
                  <span style={{ fontSize: 11.5, color: "rgba(51,51,52,.6)", whiteSpace: "nowrap" }}>{remplissage(l)}</span>
                </button>
              ))}
            </div>
          );
        })}
      </aside>

      {selection ? (
        <KlubSeanceDetail
          key={selection}
          seanceId={selection}
          version={version}
          notifier={notifier}
          rafraichir={rafraichir}
          onFermer={() => setSelection(null)}
        />
      ) : creation ? (
        <section style={{ ...CARTE, display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#003850" }}>Nouvelle séance ponctuelle</p>
          <div style={{ maxWidth: 260 }}>
            <label style={LABEL} htmlFor="n-debut">Date et heure</label>
            <input id="n-debut" type="datetime-local" style={CHAMP} value={debut} onChange={(e) => setDebut(e.target.value)} />
          </div>
          <ChampsSeanceForm valeur={creation} prefixe="n" onChange={(maj) => setCreation((d) => (d ? maj(d) : d))} />
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" disabled={occupe} onClick={() => void creer()} style={bouton("plein")}>
              {occupe ? "Enregistrement…" : "Créer la séance"}
            </button>
            <button type="button" onClick={() => setCreation(null)} style={bouton("contour")}>
              Fermer
            </button>
          </div>
        </section>
      ) : (
        <section style={CARTE}>
          <p style={{ margin: 0, fontSize: 15, color: "rgba(51,51,52,.6)" }}>
            Choisissez une séance pour voir les inscrits, en ajouter, cocher les présents ou la modifier.
          </p>
        </section>
      )}
    </div>
  );
}
