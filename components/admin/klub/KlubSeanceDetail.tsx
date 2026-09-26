"use client";

import { useEffect, useRef, useState } from "react";
import { dateHeure, depuisChampDateHeure, rang, versChampDateHeure } from "@/lib/klub/format";
import type { ChampsSeance, Inscription, ReponseInscription, Seance } from "@/lib/klub/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ChampsSeanceForm from "./ChampsSeanceForm";
import { appeler } from "./rpc";
import { bouton, CARTE, CHAMP, LABEL, TITRE_SECTION } from "./styles";

type Props = {
  seanceId: string;
  version: number;
  notifier: (m: string) => void;
  rafraichir: () => void;
  onFermer: () => void;
};

/** Le jeton d'annulation n'est jamais lu par l'admin. */
type LigneInscription = Omit<Inscription, "jeton">;

const COLONNES_INSCRIPTION = "id, seance_id, prenom, nom, email, telephone, premiere_seance, statut, present, origine, created_at";

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

const pluriel = (n: number, un: string, plusieurs: string) => (n > 1 ? plusieurs : un);

function champsDe(s: Seance): ChampsSeance {
  return {
    type: s.type,
    titre: s.titre,
    description: s.description,
    intervenant: s.intervenant,
    intervenant_email: s.intervenant_email,
    duree_min: s.duree_min,
    capacite: s.capacite,
    prix_libelle: s.prix_libelle,
    inscription_requise: s.inscription_requise,
    reservation_url: s.reservation_url,
    reservation_libelle: s.reservation_libelle,
  };
}

export default function KlubSeanceDetail({ seanceId, version, notifier, rafraichir, onFermer }: Props) {
  // `seance` et `inscriptions` suivent la base à chaque rechargement ; `form` et
  // `debut` sont la saisie en cours, remplis au premier chargement et après un
  // enregistrement réussi seulement, pour qu'un rechargement ne l'efface pas.
  const [seance, setSeance] = useState<Seance | null>(null);
  const [introuvable, setIntrouvable] = useState(false);
  const [inscriptions, setInscriptions] = useState<LigneInscription[]>([]);
  const [form, setForm] = useState<ChampsSeance | null>(null);
  const [debut, setDebut] = useState("");
  const [ajout, setAjout] = useState(AJOUT_VIDE);
  const [occupe, setOccupe] = useState(false);
  const formAJour = useRef(false);

  useEffect(() => {
    // `actif` écarte une réponse arrivée après un rechargement plus récent.
    let actif = true;
    const t = window.setTimeout(async () => {
      const sb = supabaseBrowser();
      const [s, i] = await Promise.all([
        sb.from("klub_seances").select("*").eq("id", seanceId).maybeSingle(),
        sb.from("klub_inscriptions").select(COLONNES_INSCRIPTION).eq("seance_id", seanceId).order("created_at").order("id"),
      ]);
      if (!actif) return;
      if (s.error || !s.data) {
        setIntrouvable(true);
        return;
      }
      const lue = s.data as Seance;
      setIntrouvable(false);
      setSeance(lue);
      if (i.error) notifier(`Lecture des inscriptions impossible : ${i.error.message}`);
      else setInscriptions((i.data ?? []) as LigneInscription[]);
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
      <section style={{ ...CARTE, display: "flex", alignItems: "center", gap: 12 }}>
        <p style={{ margin: 0, flex: 1, fontSize: 15, color: "rgba(51,51,52,.6)" }}>Cette séance n’existe plus.</p>
        <button type="button" onClick={onFermer} style={bouton("contour", true)}>
          Fermer
        </button>
      </section>
    );
  }
  if (!seance || !form) return <section style={CARTE}>Chargement…</section>;

  const confirmes = inscriptions.filter((i) => i.statut === "confirmee");
  const attente = inscriptions.filter((i) => i.statut === "attente");
  const complet = seance.inscription_requise && seance.capacite !== null && confirmes.length >= seance.capacite;
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
    // Le rechargement reprendra la séance telle que la base l'a enregistrée, lien compris.
    rafraichir();
  };

  const presence = async (i: LigneInscription, present: boolean) => {
    const r = await appeler<null>("klub_admin_presence", { p_id: i.id, p_present: present });
    if (!r.ok) return notifier(r.message);
    setInscriptions((l) => l.map((x) => (x.id === i.id ? { ...x, present } : x)));
  };

  const annulerInscription = (i: LigneInscription) => {
    if (!window.confirm(`Annuler l’inscription de ${i.prenom} ${i.nom} ? La personne reçoit un mail.`)) return;
    void executer<{ resultat: string }>(
      "klub_admin_annuler_inscription",
      { p_id: i.id },
      (d) => MESSAGE_ANNULATION[d.resultat] ?? MESSAGE_ANNULATION.inconnu,
      (d) => d.resultat === "annulee",
    );
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
    const n = confirmes.length + attente.length;
    const question =
      n === 0
        ? "Annuler la séance ? Personne n’est inscrit."
        : `Annuler la séance ? ${n} ${pluriel(n, "personne sera prévenue", "personnes seront prévenues")} par mail.`;
    if (!window.confirm(question)) return;
    void executer<number>("klub_admin_annuler_seance", { p_id: seance.id }, (d) =>
      d === 0 ? "Séance annulée." : `Séance annulée. ${d} ${pluriel(d, "mail part", "mails partent")} dans la minute.`,
    );
  };

  const ligneInscrit = (i: LigneInscription, enAttente: boolean, position: number) => (
    <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "8px 0", borderTop: "1px solid rgba(0,56,80,.08)" }}>
      {enAttente ? (
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(51,51,52,.5)", minWidth: 28 }}>{rang(position)}</span>
      ) : (
        !annulee && (
          <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "rgba(51,51,52,.6)" }}>
            <input
              type="checkbox"
              checked={i.present}
              aria-label={`Présent : ${i.prenom} ${i.nom}`}
              onChange={(e) => void presence(i, e.target.checked)}
            />
            présent
          </label>
        )
      )}
      <span style={{ flex: 1, minWidth: 180, fontSize: 14, color: "#003850" }}>
        <strong>{i.prenom} {i.nom}</strong>
        {i.premiere_seance && <span style={{ marginLeft: 8, fontSize: 12, color: "#d49a40", fontWeight: 700 }}>première séance</span>}
        {i.origine === "admin" && <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(51,51,52,.45)" }}>ajout manuel</span>}
        <span style={{ display: "block", fontSize: 12.5, color: "rgba(51,51,52,.55)" }}>
          <a href={`tel:${i.telephone}`} style={{ color: "#04A49B" }}>{i.telephone}</a> · {i.email}
        </span>
      </span>
      {!annulee && (
        <button
          type="button"
          disabled={occupe}
          onClick={() => annulerInscription(i)}
          aria-label={`Annuler l’inscription de ${i.prenom} ${i.nom}`}
          style={bouton("danger", true)}
        >
          Annuler
        </button>
      )}
    </div>
  );

  return (
    <section style={{ ...CARTE, display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#003850" }}>{seance.titre}</p>
          <p style={{ margin: "2px 0 0", fontSize: 13.5, color: "rgba(51,51,52,.6)" }}>
            {dateHeure(seance.debut)}
            {annulee && <strong style={{ marginLeft: 8, color: "#9E4433" }}>Annulée</strong>}
            {seance.creneau_id && !seance.modifiee && " · suit son créneau"}
          </p>
        </div>
        <button type="button" onClick={onFermer} style={bouton("contour", true)}>
          Fermer
        </button>
      </div>

      <div>
        <p style={TITRE_SECTION}>
          Inscrits · {confirmes.length}
          {seance.capacite !== null ? ` / ${seance.capacite}` : ""}
        </p>
        {confirmes.length === 0 && <p style={{ margin: 0, fontSize: 13.5, color: "rgba(51,51,52,.55)" }}>Personne pour l’instant.</p>}
        {confirmes.map((i, n) => ligneInscrit(i, false, n + 1))}
      </div>

      {attente.length > 0 && (
        <div>
          <p style={TITRE_SECTION}>Liste d’attente · {attente.length}</p>
          {attente.map((i, n) => ligneInscrit(i, true, n + 1))}
        </div>
      )}

      {seance.statut === "publiee" && seance.inscription_requise && (
        <div>
          <p style={TITRE_SECTION}>Ajouter quelqu’un</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
            {(
              [
                ["prenom", "Prénom", "text"],
                ["nom", "Nom", "text"],
                ["email", "E-mail", "email"],
                ["telephone", "Téléphone", "tel"],
              ] as const
            ).map(([cle, libelle, type]) => (
              <div key={cle}>
                <label style={LABEL} htmlFor={`a-${cle}`}>{libelle}</label>
                <input
                  id={`a-${cle}`}
                  type={type}
                  autoComplete="off"
                  style={CHAMP}
                  value={ajout[cle]}
                  onChange={(e) => {
                    const v = e.target.value;
                    setAjout((a) => ({ ...a, [cle]: v }));
                  }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", marginTop: 10 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#003850" }}>
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
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "#003850" }}>
                Séance complète :
                <select
                  style={{ ...CHAMP, width: "auto" }}
                  value={ajout.siComplet}
                  onChange={(e) => {
                    const siComplet = e.target.value as "attente" | "forcer";
                    setAjout((a) => ({ ...a, siComplet }));
                  }}
                >
                  <option value="attente">mettre en liste d’attente</option>
                  <option value="forcer">dépasser la capacité</option>
                </select>
              </label>
            )}
            <button type="button" disabled={occupe} onClick={() => void ajouter()} style={bouton("plein", true)}>
              Ajouter
            </button>
          </div>
        </div>
      )}

      {!annulee && (
        <div>
          <p style={TITRE_SECTION}>Modifier la séance</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ maxWidth: 260 }}>
              <label style={LABEL} htmlFor="s-debut">Date et heure</label>
              <input id="s-debut" type="datetime-local" style={CHAMP} value={debut} onChange={(e) => setDebut(e.target.value)} />
            </div>
            <ChampsSeanceForm valeur={form} prefixe="s" onChange={(maj) => setForm((d) => (d ? maj(d) : d))} />
            <p style={{ margin: 0, fontSize: 12.5, color: "rgba(51,51,52,.55)" }}>
              Changer la date, l’heure, la durée ou l’intervenant prévient les inscrits par mail. Une fois modifiée ici, la
              séance ne suit plus son créneau.
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button type="button" disabled={occupe} onClick={() => void enregistrer()} style={bouton("plein")}>
                Enregistrer la séance
              </button>
              {seance.statut === "publiee" && (
                <button type="button" disabled={occupe} onClick={annulerSeance} style={{ ...bouton("danger"), marginLeft: "auto" }}>
                  Annuler la séance
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
