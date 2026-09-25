"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { dateHeure } from "@/lib/klub/format";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * Page d'arrivée du back-office : ce qui demande une action, et rien d'autre.
 * Un bloc sans contenu disparaît ; quand tout est à jour, l'écran le dit.
 */

type Seance = {
  id: string;
  debut: string;
  titre: string;
  capacite: number | null;
  inscription_requise: boolean;
  klub_inscriptions: { statut: string }[];
};

type MailErreur = { id: string; type: string };

type ArticleCourt = { slug: string; title: string; status: string; publish_at: string | null; auteur_id: string | null };

/** « 2 oct. », heure de Paris. */
const jourCourt = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", day: "numeric", month: "short" }).format(new Date(iso));

const CARTE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 14,
  boxShadow: "0 2px 10px rgba(60,40,30,.06)",
};

const LIGNE: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 10,
  alignItems: "center",
  fontSize: 12.5,
  padding: "7px 0",
  borderTop: "1px solid rgba(0,56,80,.08)",
  color: "#003850",
  textDecoration: "none",
};

const ETAT = (fond: string, texte: string): React.CSSProperties => ({
  fontSize: 10.5,
  fontWeight: 700,
  padding: "3px 8px",
  borderRadius: 999,
  whiteSpace: "nowrap",
  background: fond,
  color: texte,
  fontVariantNumeric: "tabular-nums",
});

export default function TableauDeBord() {
  const acces = useAccesCourant();
  const [seances, setSeances] = useState<Seance[]>([]);
  const [mails, setMails] = useState<MailErreur[]>([]);
  const [articles, setArticles] = useState<ArticleCourt[]>([]);
  const [soucis, setSoucis] = useState<string[]>([]);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const maintenant = Date.now();
    const [s, m, a] = await Promise.all([
      sb
        .from("klub_seances")
        .select("id, debut, titre, capacite, inscription_requise, klub_inscriptions(statut)")
        .eq("statut", "publiee")
        .gte("debut", new Date(maintenant).toISOString())
        .lt("debut", new Date(maintenant + 7 * 86400_000).toISOString())
        .order("debut"),
      sb.from("klub_mails").select("id, type").eq("statut", "erreur").limit(20),
      sb.from("articles").select("slug, title, status, publish_at, auteur_id").neq("status", "publie").order("date", { ascending: false }),
    ]);
    const erreurs: string[] = [];
    if (s.error) erreurs.push("séances du Klub");
    if (m.error) erreurs.push("mails du Klub");
    if (a.error) erreurs.push("articles");
    setSoucis(erreurs);
    setSeances((s.data ?? []) as Seance[]);
    setMails((m.data ?? []) as MailErreur[]);
    setArticles(((a.data ?? []) as ArticleCourt[]).filter((x) => acces.estSuperAdmin || x.auteur_id === acces.userId));
  }, [acces.estSuperAdmin, acces.userId]);

  useEffect(() => {
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const compte = (s: Seance, statut: string) => s.klub_inscriptions.filter((i) => i.statut === statut).length;
  const completes = seances.filter((s) => s.inscription_requise && s.capacite !== null && compte(s, "confirmee") >= s.capacite);
  const aRelire = articles.filter((a) => a.status === "relecture");
  const aTraiter = mails.length + aRelire.length + completes.length;
  const riens = seances.length === 0 && aTraiter === 0 && articles.length === 0;

  const aujourdhui = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <div style={{ padding: "clamp(14px,3vw,26px)" }}>
      <h1 style={{ margin: "0 0 2px", fontSize: 21, fontWeight: 700, color: "#003850" }}>Bonjour {acces.prenom}</h1>
      <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "rgba(51,51,52,.6)" }}>
        {aujourdhui.charAt(0).toUpperCase() + aujourdhui.slice(1)}
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <Link href="/admin/actualites" style={{ padding: "8px 16px", borderRadius: 999, background: "#04A49B", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Nouvel article
        </Link>
        <Link href="/admin/mugi-klub" style={{ padding: "8px 16px", borderRadius: 999, background: "#003850", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          Nouvelle séance
        </Link>
      </div>

      {soucis.length > 0 && (
        <p role="alert" style={{ ...CARTE, marginBottom: 12, color: "#9E4433", fontSize: 13 }}>
          Impossible de charger : {soucis.join(", ")}. Rechargez la page.
        </p>
      )}

      {riens && soucis.length === 0 && (
        <p style={{ ...CARTE, fontSize: 14, color: "rgba(51,51,52,.7)" }}>Rien ne demande votre attention.</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(255px,1fr))", gap: 12 }}>
        {seances.length > 0 && (
          <section style={CARTE}>
            <h2 style={{ margin: "0 0 10px", fontSize: 13, color: "#003850" }}>Mugi Klub, 7 prochains jours</h2>
            {seances.map((s) => {
              const c = compte(s, "confirmee");
              const att = compte(s, "attente");
              const plein = s.capacite !== null && c >= s.capacite;
              return (
                <Link key={s.id} href="/admin/mugi-klub" style={LIGNE}>
                  <span>
                    {dateHeure(s.debut)} · {s.titre}
                  </span>
                  <span style={plein ? ETAT("rgba(243,190,121,.3)", "#8a5a10") : ETAT("rgba(4,164,155,.16)", "#04A49B")}>
                    {s.inscription_requise ? `${c} / ${s.capacite}` : "Entrée libre"}
                    {att > 0 ? ` · ${att} en attente` : ""}
                  </span>
                </Link>
              );
            })}
          </section>
        )}

        {aTraiter > 0 && (
          <section style={{ ...CARTE, borderLeft: "3px solid #EE806C" }}>
            <h2 style={{ margin: "0 0 10px", fontSize: 13, color: "#003850" }}>À traiter · {aTraiter}</h2>
            {mails.length > 0 && (
              <Link href="/admin/mugi-klub" style={LIGNE}>
                <span>
                  {mails.length} mail{mails.length > 1 ? "s" : ""} du Klub en erreur
                </span>
                <span style={ETAT("rgba(238,128,108,.22)", "#9E4433")}>Relancer</span>
              </Link>
            )}
            {aRelire.map((a) => (
              <Link key={a.slug} href="/admin/actualites" style={LIGNE}>
                <span>« {a.title} » attend une relecture</span>
                <span style={ETAT("rgba(243,190,121,.3)", "#8a5a10")}>Relecture</span>
              </Link>
            ))}
            {completes.map((s) => (
              <Link key={s.id} href="/admin/mugi-klub" style={LIGNE}>
                <span>
                  {dateHeure(s.debut)} · {s.titre} est complète
                </span>
                <span style={ETAT("rgba(243,190,121,.3)", "#8a5a10")}>{compte(s, "attente")} en attente</span>
              </Link>
            ))}
          </section>
        )}

        {articles.length > 0 && (
          <section style={CARTE}>
            <h2 style={{ margin: "0 0 10px", fontSize: 13, color: "#003850" }}>
              {acces.estSuperAdmin ? "Articles en cours" : "Mes articles"}
            </h2>
            {articles.slice(0, 6).map((a) => (
              <Link key={a.slug} href="/admin/actualites" style={LIGNE}>
                <span>{a.title || a.slug}</span>
                <span style={ETAT("rgba(51,51,52,.08)", "rgba(51,51,52,.6)")}>
                  {a.status === "programme" && a.publish_at ? `Programmé ${jourCourt(a.publish_at)}` : a.status === "relecture" ? "Relecture" : "Brouillon"}
                </span>
              </Link>
            ))}
          </section>
        )}

        <section style={CARTE}>
          <h2 style={{ margin: "0 0 10px", fontSize: 13, color: "#003850" }}>Aujourd’hui au cabinet</h2>
          <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.6, color: "rgba(51,51,52,.6)" }}>
            L’agenda partagé arrive bientôt : chacun y posera ses créneaux au cabinet, et cet écran dira qui occupe quelle salle.
          </p>
        </section>
      </div>
    </div>
  );
}
