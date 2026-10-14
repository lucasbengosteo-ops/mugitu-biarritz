"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useAccesCourant } from "@/lib/admin/acces";
import { cleJour, dateLongue, depuisChampDateHeure, heure } from "@/lib/klub/format";
import { COULEUR_TYPE, type ChampsSeance, type Seance, type StatutInscription } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ChampsSeanceForm from "./ChampsSeanceForm";
import type { ChampsEncaissement } from "./encaissement";
import { montrerFiche } from "../montrerFiche";
import KlubSeanceDetail from "./KlubSeanceDetail";
import { appeler } from "./rpc";
import { Badge, Bouton, Carte, Champ } from "../ui";
import { useComptesEncaissement } from "./useComptesEncaissement";

type Props = { version: number; notifier: (m: string) => void; rafraichir: () => void };

type Ligne = Seance & { klub_inscriptions: { statut: StatutInscription }[] };

/** `praticien_id` : colonne de la migration du 13 oct. 2026, voir `./encaissement`. */
type NouvelleSeance = ChampsSeance & ChampsEncaissement;

const NOUVELLE: NouvelleSeance = {
  type: "atelier",
  titre: "",
  description: "",
  intervenant: "",
  intervenant_email: null,
  duree_min: 90,
  capacite: 12,
  prix_libelle: "",
  prix_centimes: null,
  prix_duo_centimes: null,
  inscription_requise: true,
  reservation_url: null,
  reservation_libelle: null,
  image: null,
  image_focus: "50% 50%",
  praticien_id: null,
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
  const acces = useAccesCourant();
  const { comptes, comptesPrets } = useComptesEncaissement(version, notifier);
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [selection, setSelection] = useState<string | null>(null);
  const [creation, setCreation] = useState<NouvelleSeance | null>(null);
  // Voir le commentaire équivalent dans KlubCreneaux.tsx : sans ce compteur
  // dans la clé de `ChampsSeanceForm`, démarrer une nouvelle création sans
  // avoir fermé la précédente garderait le texte tapé dans « Prix (€) ».
  const [creationNonce, setCreationNonce] = useState(0);
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
    // Même règle que le créneau : `klub_admin_creer_seance` n'écrit jamais le
    // praticien ni le prix, la séance créée les a donc à null. On ne pose
    // l'encaissement que si la saisie en donne un, pour qu'un non-gérant qui
    // laisse le praticien vide ne lève pas KLUB_ENCAISSEMENT.
    if (creation.praticien_id !== null || creation.prix_centimes !== null) {
      const enc = await appeler("klub_admin_encaissement", {
        p_cible: "seance",
        p_id: r.data,
        p_praticien: creation.praticien_id,
        p_prix_centimes: creation.prix_centimes,
      });
      if (!enc.ok) {
        notifier(`Séance créée, mais l’encaissement n’a pas été posé : ${enc.message}`);
      }
    }
    // Le prix à deux s'écrit par sa propre fonction, après l'encaissement : le
    // praticien doit être rattaché avant de pouvoir poser le prix duo.
    if (creation.prix_duo_centimes !== null) {
      const duo = await appeler("klub_admin_prix_duo", {
        p_cible: "seance",
        p_id: r.data,
        p_prix_duo_centimes: creation.prix_duo_centimes,
      });
      if (!duo.ok) {
        notifier(`Séance créée, mais le prix à deux n’a pas été posé : ${duo.message}`);
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
    <div id="klub-seances" className="ad-md" data-detail={selection || creation ? "oui" : "non"} style={{ "--ad-md-liste": "360px" } as React.CSSProperties}>
      <Carte
        className="ad-md-liste"
        titre="À venir"
        action={
          <Bouton
            taille="petite"
            icone={Plus}
            onClick={() => {
              setSelection(null);
              setCreation({ ...NOUVELLE });
              setCreationNonce((n) => n + 1);
              montrerFiche("klub-seances");
            }}
          >
            Séance ponctuelle
          </Bouton>
        }
      >
        {lignes.length === 0 && (
          <p style={{ margin: 0, fontSize: 15, color: "rgba(0,56,80,.78)" }}>
            Aucune séance. Créez un créneau hebdomadaire ou une séance ponctuelle.
          </p>
        )}
        {[...parJour.entries()].map(([cle, duJour]) => {
          const libelle = dateLongue(`${cle}T12:00:00Z`);
          return (
            <div key={cle} style={{ marginBottom: 12 }}>
              <h3 style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 700, color: "#003850" }}>
                {libelle.charAt(0).toUpperCase() + libelle.slice(1)}
              </h3>
              {duJour.map((l) => (
                <button
                  key={l.id}
                  type="button"
                  className="ad-choix"
                  onClick={() => {
                    setCreation(null);
                    setSelection(l.id);
                    montrerFiche("klub-seances");
                  }}
                  aria-current={selection === l.id ? "true" : undefined}
                  style={{ marginBottom: 4, borderColor: selection === l.id ? undefined : "rgba(0,56,80,.1)", flexWrap: "wrap", columnGap: 10, rowGap: 4 }}
                >
                  <span aria-hidden="true" style={{ flex: "none", width: 8, height: 8, borderRadius: "50%", background: COULEUR_TYPE[l.type] }} />
                  <span style={{ fontWeight: 700, minWidth: 48, fontVariantNumeric: "tabular-nums" }}>{heure(l.debut)}</span>
                  <span style={{ flex: "1 1 120px", minWidth: 0, textDecoration: l.statut === "annulee" ? "line-through" : "none" }}>
                    {l.titre}
                  </span>
                  {l.statut === "annulee" ? (
                    <Badge ton="alerte">Annulée</Badge>
                  ) : (
                    <span style={{ fontSize: 13, color: "rgba(0,56,80,.72)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>{remplissage(l)}</span>
                  )}
                </button>
              ))}
            </div>
          );
        })}
      </Carte>

      {selection ? (
        <KlubSeanceDetail
          key={selection}
          seanceId={selection}
          version={version}
          notifier={notifier}
          rafraichir={rafraichir}
          onFermer={() => setSelection(null)}
          comptes={comptes}
          comptesPrets={comptesPrets}
        />
      ) : creation ? (
        <Carte titre="Nouvelle séance ponctuelle">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ maxWidth: 280 }}>
              <Champ id="n-debut" label="Date et heure">
                <input type="datetime-local" value={debut} onChange={(e) => setDebut(e.target.value)} />
              </Champ>
            </div>
            <ChampsSeanceForm
              key={`creation-${creationNonce}`}
              valeur={creation}
              prefixe="n"
              nouveau
              onChange={(maj) => setCreation((d) => (d ? maj(d) : d))}
              encaissement={{
                praticienId: creation.praticien_id,
                onPraticienChange: (id) => setCreation((d) => (d ? { ...d, praticien_id: id } : d)),
                comptes,
                comptesPrets,
                estGerant: acces.estSuperAdmin,
                userId: acces.userId,
              }}
            />
            <div className="ad-rangee">
              <Bouton enCours={occupe} onClick={() => void creer()}>
                Créer la séance
              </Bouton>
              <Bouton variante="secondaire" onClick={() => setCreation(null)}>
                Fermer
              </Bouton>
            </div>
          </div>
        </Carte>
      ) : (
        <Carte className="ad-md-vide">
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: "rgba(0,56,80,.78)" }}>
            Choisissez une séance pour voir les inscrits, en ajouter, cocher les présents ou la modifier.
          </p>
        </Carte>
      )}
    </div>
  );
}
