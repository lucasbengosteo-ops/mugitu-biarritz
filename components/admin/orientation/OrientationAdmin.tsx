"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Badge, Carte, Message, Onglets, Page, ongletId, type Onglet, type TonBadge } from "@/components/admin/ui";
import { useAccesCourant } from "@/lib/admin/acces";
import { questionsParSemaine, sourcesFrequentes, type LigneQuestion } from "@/lib/aide/statistiques";
import { METIERS } from "@/lib/orientation/metiers";
import { frequences, parSemaine, type LigneParcours } from "@/lib/orientation/statistiques";
import { MOTIFS, SPORTS_CHOIX, ZONES } from "@/lib/orientation/types";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * « Par où commencer » : ce que les visiteurs demandent à l'accueil, et où
 * ils sont orientés. Réservé aux super-admins (`orientation_parcours` et
 * `orientation_textes` ne se lisent pas autrement, par la RLS).
 *
 * `OrientationAdmin` charge les mesures des douze dernières semaines ;
 * `OrientationEcran` les affiche, sans accès réseau. L'onglet actif est
 * dans l'adresse (`?vue=`), comme `components/admin/agenda/AgendaAdmin.tsx`.
 */

type Texte = { parcours_id: string; texte: string; cree_le: string };
type TexteAide = { question_id: string; question: string; reponse: string; cree_le: string };

const DOUZE_SEMAINES_MS = 12 * 7 * 24 * 60 * 60 * 1000;

export default function OrientationAdmin() {
  const acces = useAccesCourant();
  const [lignes, setLignes] = useState<LigneParcours[]>([]);
  const [textes, setTextes] = useState<Texte[]>([]);
  const [aideLignes, setAideLignes] = useState<LigneQuestion[]>([]);
  const [aideTextes, setAideTextes] = useState<TexteAide[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const depuis = new Date(Date.now() - DOUZE_SEMAINES_MS).toISOString();
    const [p, t, aq, at] = await Promise.all([
      sb.from("orientation_parcours").select("*").gte("cree_le", depuis).order("cree_le", { ascending: false }).limit(5000),
      sb.from("orientation_textes").select("parcours_id, texte, cree_le").order("cree_le", { ascending: false }).limit(200),
      sb.from("aide_questions").select("*").gte("cree_le", depuis).order("cree_le", { ascending: false }).limit(5000),
      sb.from("aide_textes").select("question_id, question, reponse, cree_le").order("cree_le", { ascending: false }).limit(200),
    ]);
    if (p.error) {
      setErreur("Impossible de charger les parcours.");
      setChargement(false);
      return;
    }
    if (aq.error) {
      setErreur("Impossible de charger les questions.");
      setChargement(false);
      return;
    }
    setLignes((p.data ?? []) as LigneParcours[]);
    setTextes((t.data ?? []) as Texte[]);
    setAideLignes((aq.data ?? []) as LigneQuestion[]);
    setAideTextes((at.data ?? []) as TexteAide[]);
    setErreur(t.error || at.error ? "Les textes conservés n’ont pas pu être chargés." : null);
    setChargement(false);
  }, []);

  useEffect(() => {
    if (acces.etat !== "pret" || !acces.estSuperAdmin) return;
    // Motif du dépôt : pas de setState synchrone dans le corps d'un effet.
    const timer = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(timer);
  }, [acces.etat, acces.estSuperAdmin, charger]);

  if (acces.etat !== "pret") {
    return (
      <Page titre="Par où commencer">
        <p role="status">Chargement…</p>
      </Page>
    );
  }

  if (!acces.estSuperAdmin) {
    return (
      <Page titre="Par où commencer">
        <Message ton="info">Cette page est réservée aux super-admins.</Message>
      </Page>
    );
  }

  if (chargement) {
    return (
      <Page titre="Par où commencer" intro="Ce que les visiteurs demandent à l’accueil, et où ils sont orientés.">
        <p role="status">Chargement…</p>
      </Page>
    );
  }

  return (
    <OrientationEcran
      lignes={lignes}
      textes={textes}
      aideLignes={aideLignes}
      aideTextes={aideTextes}
      erreur={erreur}
    />
  );
}

/* ── L'écran, sans accès réseau ───────────────────────────────── */

const VUES = ["semaines", "revient", "textes", "questions"] as const;
type Vue = (typeof VUES)[number];

function lireVue(valeur: string | null): Vue {
  return VUES.find((v) => v === valeur) ?? "semaines";
}

const PANNEAU = "orientation-panneau";

export function OrientationEcran({
  lignes,
  textes,
  aideLignes,
  aideTextes,
  erreur,
}: {
  lignes: LigneParcours[];
  textes: Texte[];
  aideLignes: LigneQuestion[];
  aideTextes: TexteAide[];
  erreur: string | null;
}) {
  // L'onglet vient de l'adresse et y retourne sans recharger la page, comme
  // dans `AgendaAdmin` (doc Next, « Native History API »).
  const parametres = useSearchParams();
  const vue = lireVue(parametres.get("vue"));
  const changerVue = (v: Vue) => {
    const p = new URLSearchParams(parametres.toString());
    p.set("vue", v);
    window.history.replaceState(null, "", `?${p.toString()}`);
  };

  const onglets: Onglet<Vue>[] = [
    { id: "semaines", label: "Semaines" },
    { id: "revient", label: "Ce qui revient" },
    { id: "textes", label: "Textes" },
    { id: "questions", label: "Questions" },
  ];

  return (
    <Page titre="Par où commencer" intro="Ce que les visiteurs demandent à l’accueil, et où ils sont orientés.">
      <Onglets onglets={onglets} actif={vue} onChange={changerVue} label="Vues de « Par où commencer »" panneauId={PANNEAU} />

      {erreur ? (
        <div style={{ marginBottom: 16 }}>
          <Message ton="erreur">{erreur}</Message>
        </div>
      ) : null}

      <div id={PANNEAU} role="tabpanel" aria-labelledby={ongletId(PANNEAU, vue)}>
        {vue === "semaines" ? (
          <VueSemaines lignes={lignes} />
        ) : vue === "revient" ? (
          <VueRevient lignes={lignes} />
        ) : vue === "textes" ? (
          <VueTextes lignes={lignes} textes={textes} />
        ) : (
          <VueQuestions lignes={aideLignes} textes={aideTextes} />
        )}
      </div>
    </Page>
  );
}

/* ── Semaine par semaine ───────────────────────────────────────── */

function VueSemaines({ lignes }: { lignes: LigneParcours[] }) {
  const semaines = parSemaine(lignes);

  if (semaines.length === 0) {
    return <Message ton="info">Aucun parcours sur les douze dernières semaines.</Message>;
  }

  return (
    <>
      <div className="ad-masque-tel" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <caption style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
            Les parcours d’orientation, semaine par semaine
          </caption>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(0,56,80,.14)" }}>
              <Entete>Semaine du</Entete>
              <Entete>Parcours</Entete>
              <Entete>Réservations</Entete>
              <Entete>Alertes</Entete>
              <Entete>Sans IA</Entete>
            </tr>
          </thead>
          <tbody>
            {semaines.map((s) => (
              <tr key={s.semaine} style={{ borderBottom: "1px solid rgba(0,56,80,.08)" }}>
                <Cellule>{dateLongueSemaine(s.semaine)}</Cellule>
                <Cellule>{s.total}</Cellule>
                <Cellule>
                  {s.reservation} <span style={{ color: "rgba(0,56,80,.6)" }}>({pourcent(s.reservation, s.total)})</span>
                </Cellule>
                <Cellule>{s.alerte}</Cellule>
                <Cellule>{s.sansIA}</Cellule>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ad-masque-ordi" style={{ display: "grid", gap: 12 }}>
        {semaines.map((s) => (
          <Carte key={s.semaine} titre={`Semaine du ${dateLongueSemaine(s.semaine)}`} niveau={3}>
            <dl style={{ margin: 0, display: "grid", gap: 6, fontSize: 14 }}>
              <LigneDl titre="Parcours" valeur={String(s.total)} />
              <LigneDl titre="Réservations" valeur={`${s.reservation} (${pourcent(s.reservation, s.total)})`} />
              <LigneDl titre="Alertes" valeur={String(s.alerte)} />
              <LigneDl titre="Sans IA" valeur={String(s.sansIA)} />
            </dl>
          </Carte>
        ))}
      </div>
    </>
  );
}

function Entete({ children }: { children: React.ReactNode }) {
  return (
    <th scope="col" style={{ padding: "8px 12px", fontWeight: 700, color: "#003850" }}>
      {children}
    </th>
  );
}

function Cellule({ children }: { children: React.ReactNode }) {
  return <td style={{ padding: "8px 12px", color: "#003850" }}>{children}</td>;
}

function LigneDl({ titre, valeur }: { titre: string; valeur: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
      <dt style={{ color: "rgba(0,56,80,.78)" }}>{titre}</dt>
      <dd style={{ margin: 0, fontWeight: 700 }}>{valeur}</dd>
    </div>
  );
}

function pourcent(partie: number, total: number): string {
  if (total === 0) return "0 %";
  return `${Math.round((partie / total) * 100)} %`;
}

/** Le lundi d'une semaine (`AAAA-MM-JJ`) en date longue, à Paris. */
function dateLongueSemaine(semaine: string): string {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${semaine}T12:00:00Z`),
  );
}

/* ── Ce qui revient ────────────────────────────────────────────── */

const LABEL_MOTIF = Object.fromEntries(MOTIFS.map((m) => [m.id, m.label])) as Record<string, string>;
const LABEL_ZONE = Object.fromEntries(ZONES.map((z) => [z.id, z.label])) as Record<string, string>;
const LABEL_SPORT = Object.fromEntries(SPORTS_CHOIX.map((s) => [s.id, s.label])) as Record<string, string>;
const LABEL_METIER = Object.fromEntries(Object.entries(METIERS).map(([id, m]) => [id, m.titre])) as Record<string, string>;

function etiquette(dict: Record<string, string>, valeur: string): string {
  return dict[valeur] ?? valeur;
}

function VueRevient({ lignes }: { lignes: LigneParcours[] }) {
  if (lignes.length === 0) {
    return <Message ton="info">Aucun parcours sur les douze dernières semaines.</Message>;
  }

  const motifs = frequences(lignes, (l) => l.motif);
  const zones = frequences(lignes, (l) => l.zone);
  const sports = frequences(lignes, (l) => l.sport);
  const metiers = frequences(lignes, (l) => l.suggestions[0]?.metier ?? null);

  return (
    <div className="ad-grille-2">
      <Frequence titre="Motifs" lignes={motifs} libelle={(v) => etiquette(LABEL_MOTIF, v)} />
      <Frequence titre="Zones" lignes={zones} libelle={(v) => etiquette(LABEL_ZONE, v)} />
      <Frequence titre="Sports" lignes={sports} libelle={(v) => etiquette(LABEL_SPORT, v)} />
      <Frequence titre="Métiers proposés" lignes={metiers} libelle={(v) => etiquette(LABEL_METIER, v)} />
    </div>
  );
}

function Frequence({
  titre,
  lignes,
  libelle,
}: {
  titre: string;
  lignes: { valeur: string; nombre: number }[];
  libelle: (valeur: string) => string;
}) {
  return (
    <Carte titre={titre}>
      {lignes.length === 0 ? (
        <p style={{ margin: 0, fontSize: 14, color: "rgba(0,56,80,.78)" }}>Rien à montrer.</p>
      ) : (
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "grid", gap: 8 }}>
          {lignes.map((l) => (
            <li key={l.valeur} style={{ display: "flex", justifyContent: "space-between", gap: 12, fontSize: 14 }}>
              <span>{libelle(l.valeur)}</span>
              <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{l.nombre}</span>
            </li>
          ))}
        </ul>
      )}
    </Carte>
  );
}

/* ── Textes ────────────────────────────────────────────────────── */

function VueTextes({ lignes, textes }: { lignes: LigneParcours[]; textes: Texte[] }) {
  const parParcours = new Map(lignes.map((l) => [l.id, l]));

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <Message ton="info">Gardés avec l’accord des visiteurs, effacés après 90 jours.</Message>

      {textes.length === 0 ? (
        <Message ton="info">Aucun texte conservé.</Message>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {textes.map((t) => {
            const parcours = parParcours.get(t.parcours_id);
            const reservation = parcours?.clic_type === "reservation";
            return (
              <Carte key={t.parcours_id} titre={dateHeureLongue(t.cree_le)} niveau={3}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  {parcours ? (
                    <span style={{ fontSize: 14, color: "rgba(0,56,80,.78)" }}>
                      {etiquette(LABEL_MOTIF, parcours.motif)}
                      {parcours.zone ? ` · ${etiquette(LABEL_ZONE, parcours.zone)}` : ""}
                      {parcours.sport ? ` · ${etiquette(LABEL_SPORT, parcours.sport)}` : ""}
                      {parcours.suggestions.length > 0
                        ? ` · proposé : ${parcours.suggestions.map((s) => etiquette(LABEL_METIER, s.metier)).join(", ")}`
                        : ""}
                    </span>
                  ) : null}
                  {reservation ? <Badge ton="succes">Rendez-vous</Badge> : null}
                </div>
                <blockquote
                  style={{
                    margin: 0,
                    padding: "10px 14px",
                    borderLeft: "3px solid rgba(0,56,80,.18)",
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "#003850",
                    wordBreak: "break-word",
                  }}
                >
                  {t.texte}
                </blockquote>
              </Carte>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Questions (widget d'aide) ────────────────────────────────── */

const LABEL_TYPE: Record<string, string> = {
  reponse: "Réponse",
  inconnu: "Sans réponse",
  medical: "Médical",
  orientation: "Orientation",
  alerte: "Alerte",
  detresse: "Détresse",
};

const TON_TYPE: Record<string, TonBadge> = {
  reponse: "succes",
  inconnu: "attente",
  medical: "info",
  orientation: "neutre",
  alerte: "alerte",
  detresse: "alerte",
};

function VueQuestions({ lignes, textes }: { lignes: LigneQuestion[]; textes: TexteAide[] }) {
  if (lignes.length === 0) {
    return <Message ton="info">Aucune question sur les douze dernières semaines.</Message>;
  }

  const semaines = questionsParSemaine(lignes);
  const sources = sourcesFrequentes(lignes);
  const parQuestion = new Map(lignes.map((l) => [l.id, l]));

  return (
    <div style={{ display: "grid", gap: 24 }}>
      <div>
        <div className="ad-masque-tel" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <caption style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
              Les questions du widget d’aide, semaine par semaine
            </caption>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(0,56,80,.14)" }}>
                <Entete>Semaine du</Entete>
                <Entete>Questions</Entete>
                <Entete>Sans réponse</Entete>
                <Entete>Utiles</Entete>
              </tr>
            </thead>
            <tbody>
              {semaines.map((s) => (
                <tr key={s.semaine} style={{ borderBottom: "1px solid rgba(0,56,80,.08)" }}>
                  <Cellule>{dateLongueSemaine(s.semaine)}</Cellule>
                  <Cellule>{s.total}</Cellule>
                  <Cellule>
                    {s.sansReponse} <span style={{ color: "rgba(0,56,80,.6)" }}>({pourcent(s.sansReponse, s.total)})</span>
                  </Cellule>
                  <Cellule>
                    {s.votes === 0 ? "—" : `${s.utiles} / ${s.votes}`}
                  </Cellule>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="ad-masque-ordi" style={{ display: "grid", gap: 12 }}>
          {semaines.map((s) => (
            <Carte key={s.semaine} titre={`Semaine du ${dateLongueSemaine(s.semaine)}`} niveau={3}>
              <dl style={{ margin: 0, display: "grid", gap: 6, fontSize: 14 }}>
                <LigneDl titre="Questions" valeur={String(s.total)} />
                <LigneDl titre="Sans réponse" valeur={`${s.sansReponse} (${pourcent(s.sansReponse, s.total)})`} />
                <LigneDl titre="Utiles" valeur={s.votes === 0 ? "—" : `${s.utiles} / ${s.votes}`} />
              </dl>
            </Carte>
          ))}
        </div>
      </div>

      <Frequence titre="Les pages citées" lignes={sources} libelle={(v) => v} />

      <div style={{ display: "grid", gap: 16 }}>
        <Message ton="info">Gardées avec l’accord des visiteurs, effacées après 90 jours.</Message>

        {textes.length === 0 ? (
          <Message ton="info">Aucune question conservée.</Message>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {textes.map((t) => {
              const question = parQuestion.get(t.question_id);
              return (
                <Carte key={t.question_id} titre={dateHeureLongue(t.cree_le)} niveau={3}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    {question ? <Badge ton={TON_TYPE[question.type] ?? "neutre"}>{LABEL_TYPE[question.type] ?? question.type}</Badge> : null}
                    {question?.utile === true ? <Badge ton="succes">Utile</Badge> : null}
                    {question?.utile === false ? <Badge ton="alerte">Pas utile</Badge> : null}
                  </div>
                  <blockquote
                    style={{
                      margin: "0 0 10px",
                      padding: "10px 14px",
                      borderLeft: "3px solid rgba(0,56,80,.18)",
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: "#003850",
                      wordBreak: "break-word",
                    }}
                  >
                    {t.question}
                  </blockquote>
                  <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "rgba(0,56,80,.86)", wordBreak: "break-word" }}>{t.reponse}</p>
                </Carte>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function dateHeureLongue(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}
