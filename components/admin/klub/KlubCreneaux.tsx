"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAccesCourant } from "@/lib/admin/acces";
import { COULEUR_TYPE, KLUB_JOURS, type Creneau } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ChampsSeanceForm from "./ChampsSeanceForm";
import type { ChampsEncaissement } from "./encaissement";
import { appeler } from "./rpc";
import { montrerFiche } from "../montrerFiche";
import { Badge, Bouton, Carte, Champ } from "../ui";
import { useComptesEncaissement } from "./useComptesEncaissement";

type Props = { version: number; notifier: (m: string) => void; rafraichir: () => void };

/** `praticien_id` : colonne de la migration du 13 oct. 2026, voir `./encaissement`. */
type CreneauDraft = Creneau & ChampsEncaissement;

function nouveauCreneau(): CreneauDraft {
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
    prix_centimes: null,
    prix_duo_centimes: null,
    inscription_requise: true,
    reservation_url: null,
    reservation_libelle: null,
    image: null,
    image_focus: "50% 50%",
    praticien_id: null,
  };
}

function messageEnregistrement(conservees: number): string {
  if (conservees === 0) return "Créneau enregistré. Les séances à venir sont à jour.";
  if (conservees === 1)
    return "Créneau enregistré. Une séance à venir garde ses anciens réglages, parce qu’elle a des inscrits ou a été modifiée à part : voyez l’onglet Séances.";
  return `Créneau enregistré. ${conservees} séances à venir gardent leurs anciens réglages, parce qu’elles ont des inscrits ou ont été modifiées à part : voyez l’onglet Séances.`;
}

export default function KlubCreneaux({ version, notifier, rafraichir }: Props) {
  const acces = useAccesCourant();
  const { comptes, comptesPrets } = useComptesEncaissement(version, notifier);
  const [creneaux, setCreneaux] = useState<CreneauDraft[]>([]);
  const [draft, setDraft] = useState<CreneauDraft | null>(null);
  // Un nouveau brouillon démarre praticien et prix à null : sans ce compteur
  // dans la clé posée sur `ChampsSeanceForm`, cliquer deux fois sur « Nouveau
  // créneau » sans fermer le premier réutiliserait le même composant monté,
  // et son champ « Prix (€) » garderait le texte tapé pour le brouillon
  // précédent.
  const [nouveauNonce, setNouveauNonce] = useState(0);
  const [occupe, setOccupe] = useState(false);

  useEffect(() => {
    // `actif` écarte une réponse arrivée après un rechargement plus récent.
    let actif = true;
    const t = window.setTimeout(async () => {
      const { data, error } = await supabaseBrowser().from("klub_creneaux").select("*").order("jour").order("heure");
      if (!actif) return;
      if (error) notifier(`Lecture impossible : ${error.message}`);
      setCreneaux((data ?? []) as CreneauDraft[]);
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
    const img = await appeler("klub_admin_image", {
      p_cible: "creneau",
      p_id: r.data.id,
      p_image: draft.image,
      p_focus: draft.image_focus,
    });
    if (!img.ok) {
      notifier(`Enregistré, mais l’image n’a pas été posée : ${img.message}`);
    }
    // `klub_admin_sauver_creneau` n'écrit ni le praticien ni le prix (comme
    // l'image et le lien d'inscription) : à part, et seulement si l'un des
    // deux a changé, pour qu'un non-gérant qui ne touche pas au praticien ne
    // lève pas KLUB_ENCAISSEMENT en renvoyant la même valeur.
    const original = creneaux.find((c) => c.id === draft.id);
    const praticienAvant = original?.praticien_id ?? null;
    const prixAvant = original?.prix_centimes ?? null;
    const duoAvant = original?.prix_duo_centimes ?? null;
    if (draft.praticien_id !== praticienAvant || draft.prix_centimes !== prixAvant) {
      const enc = await appeler("klub_admin_encaissement", {
        p_cible: "creneau",
        p_id: r.data.id,
        p_praticien: draft.praticien_id,
        p_prix_centimes: draft.prix_centimes,
      });
      if (!enc.ok) {
        notifier(`Enregistré, mais l’encaissement n’a pas été posé : ${enc.message}`);
      }
    }
    // Le prix à deux s'écrit par sa propre fonction, après l'encaissement : le
    // praticien doit être rattaché avant de pouvoir poser le prix duo.
    if (draft.prix_duo_centimes !== duoAvant) {
      const duo = await appeler("klub_admin_prix_duo", {
        p_cible: "creneau",
        p_id: r.data.id,
        p_prix_duo_centimes: draft.prix_duo_centimes,
      });
      if (!duo.ok) {
        notifier(`Enregistré, mais le prix à deux n’a pas été posé : ${duo.message}`);
      }
    }
    setDraft(null);
    rafraichir();
  };

  return (
    <div id="klub-creneaux" className="ad-md" data-detail={draft ? "oui" : "non"} style={{ "--ad-md-liste": "340px" } as React.CSSProperties}>
      <Carte
        className="ad-md-liste"
        titre={`${creneaux.length} créneau${creneaux.length > 1 ? "x" : ""}`}
        action={
          <Bouton
            taille="petite"
            icone={Plus}
            onClick={() => {
              setDraft(nouveauCreneau());
              setNouveauNonce((n) => n + 1);
              montrerFiche("klub-creneaux");
            }}
          >
            Nouveau créneau
          </Bouton>
        }
      >
        {KLUB_JOURS.map((nom, i) => {
          const duJour = creneaux.filter((c) => c.jour === i + 1);
          if (duJour.length === 0) return null;
          return (
            <div key={nom} style={{ marginBottom: 12 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#003850" }}>{nom}</h3>
              {duJour.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="ad-choix"
                  onClick={() => {
                    setDraft(c);
                    montrerFiche("klub-creneaux");
                  }}
                  aria-current={draft?.id === c.id ? "true" : undefined}
                  style={{ marginBottom: 4, borderColor: draft?.id === c.id ? undefined : "rgba(0,56,80,.1)", flexWrap: "wrap", columnGap: 10, rowGap: 4 }}
                >
                  <span aria-hidden="true" style={{ flex: "none", width: 8, height: 8, borderRadius: "50%", background: COULEUR_TYPE[c.type] }} />
                  <span style={{ fontWeight: 700, minWidth: 44, fontVariantNumeric: "tabular-nums" }}>{c.heure.slice(0, 5)}</span>
                  <span style={{ flex: "1 1 120px", minWidth: 0, color: c.actif ? "#003850" : "rgba(0,56,80,.72)" }}>{c.titre}</span>
                  {!c.actif && <Badge ton="neutre">en pause</Badge>}
                </button>
              ))}
            </div>
          );
        })}
        {creneaux.length === 0 && (
          <p style={{ margin: 0, fontSize: 15, color: "rgba(0,56,80,.78)" }}>
            Aucun créneau. Un créneau génère ses séances sur les quatre semaines à venir.
          </p>
        )}
      </Carte>

      {!draft ? (
        <Carte className="ad-md-vide">
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "rgba(0,56,80,.78)" }}>
            Choisissez un créneau dans la liste, ou créez-en un. Les séances des quatre semaines à venir sont créées ou mises à
            jour à l’enregistrement.
          </p>
        </Carte>
      ) : (
        <Carte titre={draft.id ? "Modifier le créneau" : "Nouveau créneau"}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
              <Champ id="c-jour" label="Jour">
                <select
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
              </Champ>
              <Champ id="c-heure" label="Heure">
                <input
                  type="time"
                  value={draft.heure.slice(0, 5)}
                  onChange={(e) => {
                    const heure = `${e.target.value}:00`;
                    setDraft((d) => (d ? { ...d, heure } : d));
                  }}
                />
              </Champ>
            </div>

            <ChampsSeanceForm
              key={draft.id || `nouveau-${nouveauNonce}`}
              valeur={draft}
              prefixe="c"
              nouveau={!draft.id}
              noteEncaissement="Les séances à venir de ce créneau prennent ces valeurs, sauf celles modifiées à la main."
              onChange={(maj) => setDraft((d) => (d ? maj(d) : d))}
              encaissement={{
                praticienId: draft.praticien_id,
                onPraticienChange: (id) => setDraft((d) => (d ? { ...d, praticien_id: id } : d)),
                comptes,
                comptesPrets,
                estGerant: acces.estSuperAdmin,
                userId: acces.userId,
              }}
            />

            <label className="ad-case">
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

            <div className="ad-rangee">
              <Bouton enCours={occupe} onClick={() => void enregistrer()}>
                Enregistrer
              </Bouton>
              <Bouton variante="secondaire" onClick={() => setDraft(null)}>
                Fermer
              </Bouton>
            </div>
          </div>
        </Carte>
      )}
    </div>
  );
}
