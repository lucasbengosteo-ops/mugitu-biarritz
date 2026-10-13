"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useAccesCourant } from "@/lib/admin/acces";
import { dateHeure, depuisChampDateHeure, heure, rang, versChampDateHeure } from "@/lib/klub/format";
import { libellePrix } from "@/lib/klub/paiement";
import type { ChampsSeance, Inscription, ReponseInscription, Seance, StatutInscription } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ChampsSeanceForm from "./ChampsSeanceForm";
import type { ChampsEncaissement, Compte } from "./encaissement";
import { appeler } from "./rpc";
import { Badge, Bouton, Carte, Champ } from "../ui";

type Props = {
  seanceId: string;
  version: number;
  notifier: (m: string) => void;
  rafraichir: () => void;
  onFermer: () => void;
  comptes: Compte[];
  comptesPrets: Set<string>;
};

/** `praticien_id` : colonne de la migration du 13 oct. 2026, voir `./encaissement`. */
type SeanceAvecEncaissement = Seance & ChampsEncaissement;

/**
 * Le jeton d'annulation n'est jamais lu par l'admin. Le statut gagne
 * `paiement` (migration du 13 oct. 2026 : une place tenue pendant le
 * paiement, pas encore dans `StatutInscription`), et les colonnes de
 * paiement et de remboursement de la même migration.
 */
type LigneInscription = Omit<Inscription, "jeton" | "statut"> & {
  statut: StatutInscription | "paiement";
  montant_centimes: number | null;
  paiement_expire_at: string | null;
  stripe_paiement: string | null;
  remboursement: "a_faire" | "fait" | "erreur" | null;
  remboursement_erreur: string | null;
  /** Colonnes de la migration du 13 oct. 2026 (réservation à deux). */
  nb_personnes: number;
  accompagnant: string | null;
};

const COLONNES_INSCRIPTION =
  "id, seance_id, prenom, nom, email, telephone, premiere_seance, statut, present, origine, created_at, " +
  "montant_centimes, paiement_expire_at, stripe_paiement, remboursement, remboursement_erreur, nb_personnes, accompagnant";

const AJOUT_VIDE = { prenom: "", nom: "", email: "", telephone: "", premiere: false, siComplet: "attente" as "attente" | "forcer" };

/** `depuisChampDateHeure` lève sur une valeur vide ou mal formée : on contrôle avant de l'appeler. */
const REGEX_CHAMP_DATE_HEURE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

const MESSAGE_ANNULATION: Record<string, string> = {
  annulee: "Inscription annulée. La personne reçoit un mail.",
  deja: "Cette inscription était déjà annulée.",
  passee: "La séance est terminée : l’inscription n’a pas été annulée.",
  seance_annulee: "La séance est annulée : rien à faire.",
  inconnu: "Inscription introuvable.",
};

/** Le JSON de `klub_admin_annuler_inscription` gagne `rembourse` (migration du 13 oct. 2026). */
function messageAnnulation(d: { resultat: string; rembourse?: boolean }, i: LigneInscription): string {
  if (d.resultat === "annulee" && d.rembourse) {
    return `Inscription annulée. Le remboursement${i.montant_centimes !== null ? ` de ${libellePrix(i.montant_centimes)}` : ""} est en cours.`;
  }
  return MESSAGE_ANNULATION[d.resultat] ?? MESSAGE_ANNULATION.inconnu;
}

/**
 * L'état de paiement affiché sous une inscription. `null` pour une
 * inscription sans montant (séance gratuite ou payée sur place) : rien à
 * dire de plus que ce qu'affiche déjà la liste.
 */
function libelleEtatPaiement(i: LigneInscription): string | null {
  if (i.montant_centimes === null) return null;
  if (i.statut === "paiement") {
    return i.paiement_expire_at ? `Paiement en cours (jusqu’à ${heure(i.paiement_expire_at)})` : "Paiement en cours";
  }
  if (!i.stripe_paiement) return null;
  if (i.remboursement === "erreur") {
    return `Remboursement en échec : ${i.remboursement_erreur ?? "raison inconnue"} — à faire depuis votre tableau de bord Stripe`;
  }
  if (i.remboursement === "a_faire") return "Remboursement en cours";
  if (i.remboursement === "fait") return "Remboursé";
  return `Payé ${libellePrix(i.montant_centimes)}`;
}

const pluriel = (n: number, un: string, plusieurs: string) => (n > 1 ? plusieurs : un);

function champsDe(s: SeanceAvecEncaissement): ChampsSeance & ChampsEncaissement {
  return {
    type: s.type,
    titre: s.titre,
    description: s.description,
    intervenant: s.intervenant,
    intervenant_email: s.intervenant_email,
    duree_min: s.duree_min,
    capacite: s.capacite,
    prix_libelle: s.prix_libelle,
    prix_centimes: s.prix_centimes,
    prix_duo_centimes: s.prix_duo_centimes,
    inscription_requise: s.inscription_requise,
    reservation_url: s.reservation_url,
    reservation_libelle: s.reservation_libelle,
    image: s.image,
    image_focus: s.image_focus,
    praticien_id: s.praticien_id,
  };
}

export default function KlubSeanceDetail({ seanceId, version, notifier, rafraichir, onFermer, comptes, comptesPrets }: Props) {
  const acces = useAccesCourant();
  // `seance` et `inscriptions` suivent la base à chaque rechargement ; `form` et
  // `debut` sont la saisie en cours, remplis au premier chargement et après un
  // enregistrement réussi seulement, pour qu'un rechargement ne l'efface pas.
  const [seance, setSeance] = useState<SeanceAvecEncaissement | null>(null);
  const [introuvable, setIntrouvable] = useState(false);
  const [inscriptions, setInscriptions] = useState<LigneInscription[]>([]);
  const [form, setForm] = useState<(ChampsSeance & ChampsEncaissement) | null>(null);
  const [debut, setDebut] = useState("");
  const [ajout, setAjout] = useState(AJOUT_VIDE);
  const [occupe, setOccupe] = useState(false);
  // L'inscription payée pour laquelle on demande « Rembourser X € ? » avant
  // d'annuler : remplacée par les deux boutons de choix sur sa ligne.
  const [aConfirmer, setAConfirmer] = useState<LigneInscription | null>(null);
  const formAJour = useRef(false);

  useEffect(() => {
    // `actif` écarte une réponse arrivée après un rechargement plus récent.
    let actif = true;
    const t = window.setTimeout(async () => {
      const sb = supabaseBrowser();
      const [s, i] = await Promise.all([
        sb.from("klub_seances").select("*").eq("id", seanceId).maybeSingle(),
        sb
          .from("klub_inscriptions")
          .select(COLONNES_INSCRIPTION)
          .eq("seance_id", seanceId)
          .order("created_at")
          .order("id")
          .returns<LigneInscription[]>(),
      ]);
      if (!actif) return;
      if (s.error || !s.data) {
        setIntrouvable(true);
        return;
      }
      const lue = s.data as SeanceAvecEncaissement;
      setIntrouvable(false);
      setSeance(lue);
      if (i.error) notifier(`Lecture des inscriptions impossible : ${i.error.message}`);
      else setInscriptions(i.data ?? []);
      if (!formAJour.current) {
        formAJour.current = true;
        setForm(champsDe(lue));
        setDebut(versChampDateHeure(lue.debut));
      }
    }, 0);
    return () => {
      actif = false;
      window.clearTimeout(t);
    };
  }, [seanceId, notifier, version]);

  if (introuvable) {
    return (
      <Carte>
        <div className="ad-rangee" style={{ justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontSize: 15, color: "rgba(0,56,80,.78)" }}>Cette séance n’existe plus.</p>
          <Bouton variante="secondaire" taille="petite" icone={X} onClick={onFermer}>
            Fermer
          </Bouton>
        </div>
      </Carte>
    );
  }
  if (!seance || !form) {
    return (
      <Carte>
        <p style={{ margin: 0, fontSize: 15, color: "rgba(0,56,80,.78)" }}>Chargement…</p>
      </Carte>
    );
  }

  // Une place « en paiement » compte comme prise (voir klub__places_prises) :
  // elle reste listée parmi les inscrits, sans case « présent » tant qu'elle
  // n'est pas confirmée.
  const prises = inscriptions.filter((i) => i.statut === "confirmee" || i.statut === "paiement");
  const attente = inscriptions.filter((i) => i.statut === "attente");
  const complet = seance.inscription_requise && seance.capacite !== null && prises.length >= seance.capacite;
  const annulee = seance.statut === "annulee";

  /**
   * Appelle une fonction admin et affiche le message de retour. `recharger`
   * dit si la réponse a changé quelque chose à relire (par défaut : oui).
   */
  const executer = async <T,>(
    nom: string,
    args: Record<string, unknown>,
    succes: (data: T) => string,
    recharger: (data: T) => boolean = () => true,
  ) => {
    setOccupe(true);
    const r = await appeler<T>(nom, args);
    setOccupe(false);
    if (!r.ok) {
      notifier(r.message);
      return false;
    }
    notifier(succes(r.data));
    if (recharger(r.data)) rafraichir();
    return true;
  };

  const enregistrer = async () => {
    if (!REGEX_CHAMP_DATE_HEURE.test(debut)) return notifier("Indiquez la date et l’heure.");
    const ok = await executer<{ prevenus: number }>(
      "klub_admin_modifier_seance",
      { p_id: seance.id, p: { ...form, debut: depuisChampDateHeure(debut) } },
      (d) =>
        d.prevenus > 0
          ? `Séance enregistrée. ${d.prevenus} ${pluriel(d.prevenus, "personne est prévenue", "personnes sont prévenues")} par mail.`
          : "Séance enregistrée.",
      () => false,
    );
    if (!ok) return;
    formAJour.current = false;
    const resa = await appeler("klub_admin_reservation", {
      p_cible: "seance",
      p_id: seance.id,
      p_url: form.reservation_url,
      p_libelle: form.reservation_libelle,
    });
    if (!resa.ok) {
      notifier(`Enregistré, mais le lien d’inscription n’a pas été posé : ${resa.message}`);
    }
    const img = await appeler("klub_admin_image", {
      p_cible: "seance",
      p_id: seance.id,
      p_image: form.image,
      p_focus: form.image_focus,
    });
    if (!img.ok) {
      notifier(`Enregistré, mais l’image n’a pas été posée : ${img.message}`);
    }
    // Même règle que le créneau et la création de séance (KlubCreneaux.tsx,
    // KlubSeances.tsx) : `klub_admin_modifier_seance` n'écrit ni le praticien
    // ni le prix, à part et seulement si l'un des deux a changé, pour qu'un
    // non-gérant qui ne touche pas au praticien ne lève pas KLUB_ENCAISSEMENT.
    if (form.praticien_id !== seance.praticien_id || form.prix_centimes !== seance.prix_centimes) {
      const enc = await appeler("klub_admin_encaissement", {
        p_cible: "seance",
        p_id: seance.id,
        p_praticien: form.praticien_id,
        p_prix_centimes: form.prix_centimes,
      });
      if (!enc.ok) {
        notifier(`Enregistré, mais l’encaissement n’a pas été posé : ${enc.message}`);
      }
    }
    // Le prix à deux s'écrit par sa propre fonction, après l'encaissement : le
    // praticien doit être rattaché avant de pouvoir poser le prix duo.
    if (form.prix_duo_centimes !== seance.prix_duo_centimes) {
      const duo = await appeler("klub_admin_prix_duo", {
        p_cible: "seance",
        p_id: seance.id,
        p_prix_duo_centimes: form.prix_duo_centimes,
      });
      if (!duo.ok) {
        notifier(`Enregistré, mais le prix à deux n’a pas été posé : ${duo.message}`);
      }
    }
    // Le rechargement reprendra la séance telle que la base l'a enregistrée, lien compris.
    rafraichir();
  };

  const presence = async (i: LigneInscription, present: boolean) => {
    const r = await appeler<null>("klub_admin_presence", { p_id: i.id, p_present: present });
    if (!r.ok) return notifier(r.message);
    setInscriptions((l) => l.map((x) => (x.id === i.id ? { ...x, present } : x)));
  };

  /** Appelle réellement l'annulation, avec ou sans remboursement. */
  const lancerAnnulation = (i: LigneInscription, rembourser: boolean) => {
    setAConfirmer(null);
    void executer<{ resultat: string; rembourse?: boolean }>(
      "klub_admin_annuler_inscription",
      { p_id: i.id, p_rembourser: rembourser },
      (d) => messageAnnulation(d, i),
      (d) => d.resultat === "annulee",
    );
  };

  const annulerInscription = (i: LigneInscription) => {
    // Payée et pas déjà en file ou remboursée : on demande le choix plutôt
    // que d'annuler directement (spec § 4, « l'admin choisit de rembourser
    // ou non »).
    if (i.stripe_paiement !== null && i.remboursement === null) {
      setAConfirmer(i);
      return;
    }
    if (!window.confirm(`Annuler l’inscription de ${i.prenom} ${i.nom} ? La personne reçoit un mail.`)) return;
    lancerAnnulation(i, false);
  };

  const ajouter = async () => {
    const ok = await executer<ReponseInscription>(
      "klub_admin_ajouter",
      {
        p_seance: seance.id,
        p_prenom: ajout.prenom,
        p_nom: ajout.nom,
        p_email: ajout.email,
        p_telephone: ajout.telephone,
        p_premiere: ajout.premiere,
        p_si_complet: complet ? ajout.siComplet : "attente",
      },
      (d) =>
        d.statut === "confirmee"
          ? "Inscription ajoutée. La personne reçoit un mail de confirmation."
          : `Ajout en liste d’attente, en ${rang(d.rang ?? 1)} position. La personne reçoit un mail.`,
    );
    if (ok) setAjout(AJOUT_VIDE);
  };

  const annulerSeance = () => {
    const n = prises.length + attente.length;
    // Toute inscription payée et pas déjà remboursée part en file, quel que
    // soit son statut (même une déjà annulée par le client) : même règle que
    // `klub_admin_annuler_seance`.
    const payes = inscriptions.filter((i) => i.stripe_paiement !== null && i.remboursement === null).length;
    let question =
      n === 0
        ? "Annuler la séance ? Personne n’est inscrit."
        : `Annuler la séance ? ${n} ${pluriel(n, "personne sera prévenue", "personnes seront prévenues")} par mail.`;
    if (payes > 0) {
      question += ` ${payes === 1 ? "La" : "Les"} ${payes} ${pluriel(payes, "personne qui a payé sera remboursée", "personnes qui ont payé seront remboursées")}.`;
    }
    if (!window.confirm(question)) return;
    void executer<number>("klub_admin_annuler_seance", { p_id: seance.id }, (d) =>
      d === 0 ? "Séance annulée." : `Séance annulée. ${d} ${pluriel(d, "mail part", "mails partent")} dans la minute.`,
    );
  };

  const mention: React.CSSProperties = { fontSize: 13, color: "rgba(0,56,80,.72)" };

  const ligneInscrit = (i: LigneInscription, enAttente: boolean, position: number) => {
    const etatPaiement = libelleEtatPaiement(i);
    const estDuo = i.nb_personnes === 2 && i.accompagnant;
    return (
      <div key={i.id} style={{ display: "flex", alignItems: "center", gap: "4px 12px", flexWrap: "wrap", padding: "10px 0", borderTop: "1px solid rgba(0,56,80,.08)" }}>
        <span style={{ flex: "1 1 200px", minWidth: 0, fontSize: 15, lineHeight: 1.45, color: "#003850" }}>
          <span className="ad-rangee" style={{ gap: "4px 8px" }}>
            {enAttente && (
              <span style={{ fontSize: 14, fontWeight: 700, color: "rgba(0,56,80,.72)", minWidth: 28 }}>{rang(position)}</span>
            )}
            <strong>
              {i.prenom} {i.nom}
              {estDuo && ` + ${i.accompagnant}`}
            </strong>
            {estDuo && (
              <span style={mention}>
                (à deux{i.montant_centimes !== null ? ` · ${libellePrix(i.montant_centimes)}` : ""})
              </span>
            )}
            {i.premiere_seance && <Badge ton="attente">première séance</Badge>}
            {i.origine === "admin" && <Badge ton="neutre">ajout manuel</Badge>}
          </span>
          <span style={{ display: "block", marginTop: 2, fontSize: 14, color: "rgba(0,56,80,.78)", overflowWrap: "anywhere" }}>
            <a href={`tel:${i.telephone}`} className="ad-lien">{i.telephone}</a> · {i.email}
          </span>
          {etatPaiement && (
            <span
              style={{
                display: "block",
                fontSize: 13,
                marginTop: 2,
                fontWeight: i.remboursement === "erreur" ? 600 : 400,
                color: i.remboursement === "erreur" ? "#9E4433" : "rgba(0,56,80,.72)",
              }}
            >
              {etatPaiement}
            </span>
          )}
        </span>
        {!enAttente && !annulee && i.statut === "confirmee" && (
          <label className="ad-case" style={{ fontSize: 14 }}>
            <input
              type="checkbox"
              checked={i.present}
              aria-label={`Présent : ${i.prenom} ${i.nom}`}
              onChange={(e) => void presence(i, e.target.checked)}
            />
            présent
          </label>
        )}
        {!annulee &&
          (aConfirmer?.id === i.id ? (
            <div style={{ flex: "1 1 100%", display: "flex", flexDirection: "column", gap: 8, padding: 12, borderRadius: 10, background: "rgba(238,128,108,.1)" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: "#003850" }}>
                Rembourser {i.montant_centimes !== null ? libellePrix(i.montant_centimes) : "le paiement"} ?
              </span>
              <div className="ad-rangee">
                <Bouton variante="danger" taille="petite" disabled={occupe} onClick={() => lancerAnnulation(i, true)}>
                  Annuler et rembourser
                </Bouton>
                <Bouton variante="secondaire" taille="petite" disabled={occupe} onClick={() => lancerAnnulation(i, false)}>
                  Annuler sans rembourser
                </Bouton>
                <Bouton variante="discret" taille="petite" onClick={() => setAConfirmer(null)}>
                  Garder l’inscription
                </Bouton>
              </div>
            </div>
          ) : (
            <Bouton
              variante="secondaire"
              taille="petite"
              disabled={occupe}
              onClick={() => annulerInscription(i)}
              aria-label={`Annuler l’inscription de ${i.prenom} ${i.nom}`}
            >
              Annuler
            </Bouton>
          ))}
      </div>
    );
  };

  return (
    <Carte>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 20, lineHeight: 1.3, fontWeight: 700, color: "#003850" }}>{seance.titre}</h2>
            <p className="ad-rangee" style={{ margin: "4px 0 0", gap: "4px 8px", fontSize: 15, color: "rgba(0,56,80,.78)" }}>
              <span>
                {dateHeure(seance.debut)}
                {seance.creneau_id && !seance.modifiee && " · suit son créneau"}
              </span>
              {annulee && <Badge ton="alerte">Annulée</Badge>}
            </p>
          </div>
          <Bouton variante="secondaire" taille="petite" icone={X} onClick={onFermer} style={{ flex: "none" }}>
            Fermer
          </Bouton>
        </div>

        <div>
          <h3 className="ad-sur-titre">
            Inscrits · {prises.length}
            {seance.capacite !== null ? ` / ${seance.capacite}` : ""}
          </h3>
          {prises.length === 0 && <p style={{ margin: 0, fontSize: 15, color: "rgba(0,56,80,.78)" }}>Personne pour l’instant.</p>}
          {prises.map((i, n) => ligneInscrit(i, false, n + 1))}
        </div>

        {attente.length > 0 && (
          <div>
            <h3 className="ad-sur-titre">Liste d’attente · {attente.length}</h3>
            {attente.map((i, n) => ligneInscrit(i, true, n + 1))}
          </div>
        )}

        {seance.statut === "publiee" && seance.inscription_requise && (
          <div>
            <h3 className="ad-sur-titre">Ajouter quelqu’un</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              {(
                [
                  ["prenom", "Prénom", "text"],
                  ["nom", "Nom", "text"],
                  ["email", "E-mail", "email"],
                  ["telephone", "Téléphone", "tel"],
                ] as const
              ).map(([cle, libelle, type]) => (
                <Champ key={cle} id={`a-${cle}`} label={libelle}>
                  <input
                    type={type}
                    autoComplete="off"
                    value={ajout[cle]}
                    onChange={(e) => {
                      const v = e.target.value;
                      setAjout((a) => ({ ...a, [cle]: v }));
                    }}
                  />
                </Champ>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, marginTop: 10 }}>
              <label className="ad-case">
                <input
                  type="checkbox"
                  checked={ajout.premiere}
                  onChange={(e) => {
                    const premiere = e.target.checked;
                    setAjout((a) => ({ ...a, premiere }));
                  }}
                />
                Première séance
              </label>
              {complet && (
                <div style={{ width: "100%", maxWidth: 320 }}>
                  <Champ id="a-si-complet" label="Séance complète :">
                    <select
                      value={ajout.siComplet}
                      onChange={(e) => {
                        const siComplet = e.target.value as "attente" | "forcer";
                        setAjout((a) => ({ ...a, siComplet }));
                      }}
                    >
                      <option value="attente">mettre en liste d’attente</option>
                      <option value="forcer">dépasser la capacité</option>
                    </select>
                  </Champ>
                </div>
              )}
              <Bouton disabled={occupe} onClick={() => void ajouter()}>
                Ajouter
              </Bouton>
            </div>
          </div>
        )}

        {!annulee && (
          <div>
            <h3 className="ad-sur-titre">Modifier la séance</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ maxWidth: 280 }}>
                <Champ id="s-debut" label="Date et heure">
                  <input type="datetime-local" value={debut} onChange={(e) => setDebut(e.target.value)} />
                </Champ>
              </div>
              <ChampsSeanceForm
                valeur={form}
                prefixe="s"
                noteEncaissement={
                  seance.creneau_id && !seance.modifiee
                    ? "Cette séance suit son créneau : si le prix du créneau change, il remplacera celui-ci."
                    : undefined
                }
                onChange={(maj) => setForm((d) => (d ? maj(d) : d))}
                encaissement={{
                  praticienId: form.praticien_id,
                  onPraticienChange: (id) => setForm((d) => (d ? { ...d, praticien_id: id } : d)),
                  comptes,
                  comptesPrets,
                  estGerant: acces.estSuperAdmin,
                  userId: acces.userId,
                }}
              />
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "rgba(0,56,80,.78)" }}>
                Changer la date, l’heure, la durée ou l’intervenant prévient les inscrits par mail. Une fois modifiée ici, la
                séance ne suit plus son créneau.
              </p>
              <div className="ad-rangee">
                <Bouton disabled={occupe} onClick={() => void enregistrer()}>
                  Enregistrer la séance
                </Bouton>
                {seance.statut === "publiee" && (
                  <Bouton variante="danger" className="ad-pousse-droite" disabled={occupe} onClick={annulerSeance}>
                    Annuler la séance
                  </Bouton>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Carte>
  );
}
