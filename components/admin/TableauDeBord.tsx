"use client";

import Link from "next/link";
import { PenLine, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { dateHeure } from "@/lib/klub/format";
import { supabaseBrowser } from "@/lib/supabase-browser";
import CarteCabinet from "./agenda/CarteCabinet";
import PremiersPas from "./PremiersPas";
import { Badge, Carte, Message, Page } from "./ui";

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
    <Page
      titre={`Bonjour ${acces.prenom}`}
      intro={aujourdhui.charAt(0).toUpperCase() + aujourdhui.slice(1)}
      actions={
        <>
          <Link href="/admin/actualites" className="ad-bouton ad-bouton--principal">
            <PenLine aria-hidden="true" size={18} />
            Nouvel article
          </Link>
          <Link href="/admin/mugi-klub" className="ad-bouton ad-bouton--secondaire">
            <Plus aria-hidden="true" size={18} />
            Nouvelle séance
          </Link>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <PremiersPas />

        {soucis.length > 0 && <Message ton="erreur">Impossible de charger : {soucis.join(", ")}. Rechargez la page.</Message>}

        {riens && soucis.length === 0 && (
          <Carte>
            <p style={{ margin: 0, fontSize: 15, color: "#003850" }}>Rien ne demande votre attention.</p>
          </Carte>
        )}

        <div className="ad-grille-2">
          {seances.length > 0 && (
            <Carte titre="Mugi Klub, 7 prochains jours">
              {seances.map((s) => {
                const c = compte(s, "confirmee");
                const att = compte(s, "attente");
                const plein = s.capacite !== null && c >= s.capacite;
                return (
                  <Link key={s.id} href="/admin/mugi-klub" className="ad-ligne-lien">
                    <span>
                      {dateHeure(s.debut)} · {s.titre}
                    </span>
                    <Badge ton={plein ? "attente" : "succes"}>
                      {s.inscription_requise ? `${c} / ${s.capacite}` : "Entrée libre"}
                      {att > 0 ? ` · ${att} en attente` : ""}
                    </Badge>
                  </Link>
                );
              })}
            </Carte>
          )}

          {aTraiter > 0 && (
            <Carte titre={`À traiter · ${aTraiter}`} style={{ borderLeft: "4px solid #EE806C" }}>
              {mails.length > 0 && (
                <Link href="/admin/mugi-klub" className="ad-ligne-lien">
                  <span>
                    {mails.length} mail{mails.length > 1 ? "s" : ""} du Klub en erreur
                  </span>
                  <Badge ton="alerte">Relancer</Badge>
                </Link>
              )}
              {aRelire.map((a) => (
                <Link key={a.slug} href="/admin/actualites" className="ad-ligne-lien">
                  <span>« {a.title} » attend une relecture</span>
                  <Badge ton="attente">Relecture</Badge>
                </Link>
              ))}
              {completes.map((s) => (
                <Link key={s.id} href="/admin/mugi-klub" className="ad-ligne-lien">
                  <span>
                    {dateHeure(s.debut)} · {s.titre} est complète
                  </span>
                  <Badge ton="attente">{compte(s, "attente")} en attente</Badge>
                </Link>
              ))}
            </Carte>
          )}

          {articles.length > 0 && (
            <Carte titre={acces.estSuperAdmin ? "Articles en cours" : "Mes articles"}>
              {articles.slice(0, 6).map((a) => (
                <Link key={a.slug} href="/admin/actualites" className="ad-ligne-lien">
                  <span>{a.title || a.slug}</span>
                  <Badge ton={a.status === "programme" ? "info" : a.status === "relecture" ? "attente" : "neutre"}>
                    {a.status === "programme" && a.publish_at ? `Programmé ${jourCourt(a.publish_at)}` : a.status === "relecture" ? "Relecture" : "Brouillon"}
                  </Badge>
                </Link>
              ))}
            </Carte>
          )}

          <CarteCabinet />
        </div>
      </div>
    </Page>
  );
}
