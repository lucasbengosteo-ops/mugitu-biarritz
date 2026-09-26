"use client";

import { useEffect, useState } from "react";
import { COULEUR_TYPE, KLUB_JOURS, type Creneau } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ChampsSeanceForm from "./ChampsSeanceForm";
import { appeler } from "./rpc";
import { bouton, CARTE, CHAMP, LABEL, TITRE_SECTION } from "./styles";

type Props = { version: number; notifier: (m: string) => void; rafraichir: () => void };

function nouveauCreneau(): Creneau {
  return {
    id: "",
    jour: 1,
    heure: "12:30:00",
    actif: true,
    type: "small",
    titre: "",
    description: "",
    intervenant: "",
    intervenant_email: null,
    duree_min: 45,
    capacite: 5,
    prix_libelle: "15 € la séance",
    inscription_requise: true,
    reservation_url: null,
    reservation_libelle: null,
    image: null,
    image_focus: "50% 50%",
  };
}

function messageEnregistrement(conservees: number): string {
  if (conservees === 0) return "Créneau enregistré. Les séances à venir sont à jour.";
  if (conservees === 1)
    return "Créneau enregistré. Une séance à venir garde ses anciens réglages, parce qu’elle a des inscrits ou a été modifiée à part : voyez l’onglet Séances.";
  return `Créneau enregistré. ${conservees} séances à venir gardent leurs anciens réglages, parce qu’elles ont des inscrits ou ont été modifiées à part : voyez l’onglet Séances.`;
}

export default function KlubCreneaux({ version, notifier, rafraichir }: Props) {
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [draft, setDraft] = useState<Creneau | null>(null);
  const [occupe, setOccupe] = useState(false);

  useEffect(() => {
    // `actif` écarte une réponse arrivée après un rechargement plus récent.
    let actif = true;
    const t = window.setTimeout(async () => {
      const { data, error } = await supabaseBrowser().from("klub_creneaux").select("*").order("jour").order("heure");
      if (!actif) return;
      if (error) notifier(`Lecture impossible : ${error.message}`);
      setCreneaux((data ?? []) as Creneau[]);
    }, 0);
    return () => {
      actif = false;
      window.clearTimeout(t);
    };
  }, [notifier, version]);

  const enregistrer = async () => {
    if (!draft) return;
    if (!draft.titre.trim()) return notifier("Le titre est obligatoire.");
    setOccupe(true);
    const r = await appeler<{ id: string; conservees: number }>("klub_admin_sauver_creneau", {
      p: { ...draft, id: draft.id || null },
    });
    setOccupe(false);
    if (!r.ok) return notifier(`Enregistrement refusé : ${r.message}`);
    notifier(messageEnregistrement(r.data.conservees));
    const resa = await appeler("klub_admin_reservation", {
      p_cible: "creneau",
      p_id: r.data.id,
      p_url: draft.reservation_url,
      p_libelle: draft.reservation_libelle,
    });
    if (!resa.ok) {
      notifier(`Enregistré, mais le lien d’inscription n’a pas été posé : ${resa.message}`);
    }
    setDraft(null);
    rafraichir();
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,340px) minmax(0,1fr)", gap: 20, alignItems: "start" }}>
      <aside style={{ ...CARTE, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ ...TITRE_SECTION, margin: 0 }}>
            {creneaux.length} créneau{creneaux.length > 1 ? "x" : ""}
          </p>
          <button type="button" onClick={() => setDraft(nouveauCreneau())} style={bouton("plein", true)}>
            Nouveau créneau
          </button>
        </div>
        {KLUB_JOURS.map((nom, i) => {
          const duJour = creneaux.filter((c) => c.jour === i + 1);
          if (duJour.length === 0) return null;
          return (
            <div key={nom} style={{ marginBottom: 14 }}>
              <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 700, color: "#003850" }}>{nom}</p>
              {duJour.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setDraft(c)}
                  aria-current={draft?.id === c.id ? "true" : undefined}
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
                    borderColor: draft?.id === c.id ? "#04A49B" : "rgba(0,56,80,.1)",
                    background: draft?.id === c.id ? "rgba(4,164,155,.07)" : "transparent",
                    font: "inherit",
                    cursor: "pointer",
                    opacity: c.actif ? 1 : 0.5,
                  }}
                >
                  <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: "50%", background: COULEUR_TYPE[c.type] }} />
                  <span style={{ fontSize: 12.5, fontWeight: 700, color: "#003850", minWidth: 42 }}>{c.heure.slice(0, 5)}</span>
                  <span style={{ fontSize: 13, color: "#003850", flex: 1 }}>{c.titre}</span>
                  {!c.actif && <span style={{ fontSize: 11, color: "rgba(51,51,52,.5)" }}>en pause</span>}
                </button>
              ))}
            </div>
          );
        })}
        {creneaux.length === 0 && (
          <p style={{ margin: 0, fontSize: 13.5, color: "rgba(51,51,52,.55)" }}>
            Aucun créneau. Un créneau génère ses séances sur les quatre semaines à venir.
          </p>
        )}
      </aside>

      <section style={CARTE}>
        {!draft ? (
          <p style={{ margin: 0, fontSize: 15, color: "rgba(51,51,52,.6)" }}>
            Choisissez un créneau à gauche, ou créez-en un. Les séances des quatre semaines à venir sont créées ou mises à jour à
            l’enregistrement.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
              <div>
                <label style={LABEL} htmlFor="c-jour">Jour</label>
                <select
                  id="c-jour"
                  style={CHAMP}
                  value={draft.jour}
                  onChange={(e) => {
                    const jour = Number(e.target.value);
                    setDraft((d) => (d ? { ...d, jour } : d));
                  }}
                >
                  {KLUB_JOURS.map((n, i) => (
                    <option key={n} value={i + 1}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={LABEL} htmlFor="c-heure">Heure</label>
                <input
                  id="c-heure"
                  type="time"
                  style={CHAMP}
                  value={draft.heure.slice(0, 5)}
                  onChange={(e) => {
                    const heure = `${e.target.value}:00`;
                    setDraft((d) => (d ? { ...d, heure } : d));
                  }}
                />
              </div>
            </div>

            <ChampsSeanceForm key={draft.id || "nouveau"} valeur={draft} prefixe="c" onChange={(maj) => setDraft((d) => (d ? maj(d) : d))} />

            <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#003850" }}>
              <input
                type="checkbox"
                checked={draft.actif}
                onChange={(e) => {
                  const actif = e.target.checked;
                  setDraft((d) => (d ? { ...d, actif } : d));
                }}
              />
              Proposé chaque semaine (décocher pour mettre en pause)
            </label>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" disabled={occupe} onClick={() => void enregistrer()} style={bouton("plein")}>
                {occupe ? "Enregistrement…" : "Enregistrer"}
              </button>
              <button type="button" onClick={() => setDraft(null)} style={bouton("contour")}>
                Fermer
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
