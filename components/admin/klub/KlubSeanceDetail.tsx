"use client";

import { useCallback, useEffect, useState } from "react";
import { dateHeure, depuisChampDateHeure, rang, versChampDateHeure } from "@/lib/klub/format";
import type { Inscription, ReponseInscription, Seance } from "@/lib/klub/types";
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

const AJOUT_VIDE = { prenom: "", nom: "", email: "", telephone: "", premiere: false, siComplet: "attente" as "attente" | "forcer" };

/** `depuisChampDateHeure` lève sur une valeur vide ou mal formée : on contrôle avant de l'appeler. */
const REGEX_CHAMP_DATE_HEURE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

const pluriel = (n: number, un: string, plusieurs: string) => (n > 1 ? plusieurs : un);

export default function KlubSeanceDetail({ seanceId, version, notifier, rafraichir, onFermer }: Props) {
  const [seance, setSeance] = useState<Seance | null>(null);
  const [debut, setDebut] = useState("");
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [ajout, setAjout] = useState(AJOUT_VIDE);
  const [occupe, setOccupe] = useState(false);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const [s, i] = await Promise.all([
      sb.from("klub_seances").select("*").eq("id", seanceId).single(),
      sb.from("klub_inscriptions").select("*").eq("seance_id", seanceId).order("created_at").order("id"),
    ]);
    if (s.error) return notifier(`Lecture impossible : ${s.error.message}`);
    setSeance(s.data as Seance);
    setDebut(versChampDateHeure((s.data as Seance).debut));
    setInscriptions((i.data ?? []) as Inscription[]);
  }, [seanceId, notifier]);

  useEffect(() => {
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger, version]);

  if (!seance) return <section style={CARTE}>Chargement…</section>;

  const confirmes = inscriptions.filter((i) => i.statut === "confirmee");
  const attente = inscriptions.filter((i) => i.statut === "attente");
  const complet = seance.inscription_requise && seance.capacite !== null && confirmes.length >= seance.capacite;
  const annulee = seance.statut === "annulee";

  const executer = async <T,>(nom: string, args: Record<string, unknown>, succes: (data: T) => string) => {
    setOccupe(true);
    const r = await appeler<T>(nom, args);
    setOccupe(false);
    if (!r.ok) {
      notifier(r.message);
      return false;
    }
    notifier(succes(r.data));
    rafraichir();
    return true;
  };

  const enregistrer = async () => {
    if (!REGEX_CHAMP_DATE_HEURE.test(debut)) return notifier("Indiquez la date et l’heure.");
    return executer<{ prevenus: number }>(
      "klub_admin_modifier_seance",
      { p_id: seance.id, p: { ...seance, debut: depuisChampDateHeure(debut) } },
      (d) =>
        d.prevenus > 0
          ? `Séance enregistrée. ${d.prevenus} ${pluriel(d.prevenus, "personne est prévenue", "personnes sont prévenues")} par mail.`
          : "Séance enregistrée.",
    );
  };

  const presence = async (i: Inscription, present: boolean) => {
    const r = await appeler<null>("klub_admin_presence", { p_id: i.id, p_present: present });
    if (!r.ok) return notifier(r.message);
    setInscriptions((l) => l.map((x) => (x.id === i.id ? { ...x, present } : x)));
  };

  const annulerInscription = (i: Inscription) => {
    if (!window.confirm(`Annuler l’inscription de ${i.prenom} ${i.nom} ? La personne reçoit un mail.`)) return;
    void executer("klub_admin_annuler_inscription", { p_id: i.id }, () => "Inscription annulée.");
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
        p_si_complet: ajout.siComplet,
      },
      (d) =>
        d.statut === "confirmee"
          ? "Inscription ajoutée. La personne reçoit le mail de confirmation."
          : `Ajout en liste d’attente (${rang(d.rang ?? 1)}).`,
    );
    if (ok) setAjout(AJOUT_VIDE);
  };

  const annulerSeance = () => {
    const n = confirmes.length + attente.length;
    if (!window.confirm(`Annuler la séance ? ${n} ${pluriel(n, "personne sera prévenue", "personnes seront prévenues")} par mail.`)) return;
    void executer<number>("klub_admin_annuler_seance", { p_id: seance.id }, (d) => `Séance annulée. ${d} ${pluriel(d, "mail part", "mails partent")} dans la minute.`);
  };

  const ligneInscrit = (i: Inscription, enAttente: boolean, position: number) => (
    <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "8px 0", borderTop: "1px solid rgba(0,56,80,.08)" }}>
      {enAttente ? (
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "rgba(51,51,52,.5)", minWidth: 28 }}>{rang(position)}</span>
      ) : (
        <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "rgba(51,51,52,.6)" }}>
          <input type="checkbox" checked={i.present} onChange={(e) => void presence(i, e.target.checked)} />
          présent
        </label>
      )}
      <span style={{ flex: 1, minWidth: 180, fontSize: 14, color: "#003850" }}>
        <strong>{i.prenom} {i.nom}</strong>
        {i.premiere_seance && <span style={{ marginLeft: 8, fontSize: 12, color: "#d49a40", fontWeight: 700 }}>première séance</span>}
        {i.origine === "admin" && <span style={{ marginLeft: 8, fontSize: 12, color: "rgba(51,51,52,.45)" }}>ajout manuel</span>}
        <span style={{ display: "block", fontSize: 12.5, color: "rgba(51,51,52,.55)" }}>
          <a href={`tel:${i.telephone}`} style={{ color: "#04A49B" }}>{i.telephone}</a> · {i.email}
        </span>
      </span>
      <button type="button" disabled={occupe} onClick={() => annulerInscription(i)} style={bouton("danger", true)}>
        Annuler
      </button>
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
                ["prenom", "Prénom"],
                ["nom", "Nom"],
                ["email", "E-mail"],
                ["telephone", "Téléphone"],
              ] as const
            ).map(([cle, libelle]) => (
              <div key={cle}>
                <label style={LABEL} htmlFor={`a-${cle}`}>{libelle}</label>
                <input
                  id={`a-${cle}`}
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
            <ChampsSeanceForm valeur={seance} prefixe="s" onChange={(maj) => setSeance((d) => (d ? maj(d) : d))} />
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
