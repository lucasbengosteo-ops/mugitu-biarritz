"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { etatPriseEnMain, type Donnees } from "@/lib/admin/prise-en-main";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Bouton, Carte } from "./ui";

/**
 * « Premiers pas » : ce qu'on attend d'un nouveau venu, adossé à l'état réel
 * de ses données.
 *
 * Pas une visite guidée : l'admin a changé six fois en dix jours, et une
 * visite figée sur des positions d'écran serait fausse la semaine prochaine.
 * Une liste qui coche ce qui est déjà fait ne dépend d'aucune position.
 *
 * Quand tout est fait, la carte le dit une fois et se masque d'elle-même :
 * au chargement suivant elle a disparu, sans colonne supplémentaire pour
 * s'en souvenir.
 */

const GUIDE = "https://claude.ai/artifact/9rgJ3dL2wZt7PHoqbRCPkP";

export default function PremiersPas() {
  const acces = useAccesCourant();
  const [donnees, setDonnees] = useState<Donnees | null>(null);

  const charger = useCallback(async () => {
    if (!acces.userId) return;
    const sb = supabaseBrowser();
    const [voeux, absences, articles, ligne] = await Promise.all([
      sb.from("agenda_voeux").select("id").eq("user_id", acces.userId).limit(1),
      sb.from("agenda_absences").select("id").eq("user_id", acces.userId).limit(1),
      sb.from("articles").select("slug").eq("auteur_id", acces.userId).limit(1),
      sb.from("site_prise_en_main").select("cochees, masquee").eq("user_id", acces.userId).maybeSingle(),
    ]);
    setDonnees({
      aUnVoeu: (voeux.data ?? []).length > 0,
      aUneAbsence: (absences.data ?? []).length > 0,
      aUnArticle: (articles.data ?? []).length > 0,
      cochees: ligne.data?.cochees ?? [],
      masquee: ligne.data?.masquee ?? false,
      estGerant: acces.estSuperAdmin,
    });
  }, [acces.userId, acces.estSuperAdmin]);

  useEffect(() => {
    // Motif du dépôt : pas de setState synchrone dans le corps d'un effet.
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const ecrire = useCallback(
    async (champs: { cochees?: string[]; masquee?: boolean }) => {
      if (!acces.userId || !donnees) return;
      const suivant = {
        cochees: champs.cochees ?? donnees.cochees,
        masquee: champs.masquee ?? donnees.masquee,
      };
      setDonnees({ ...donnees, ...suivant });
      const { error } = await supabaseBrowser()
        .from("site_prise_en_main")
        .upsert({ user_id: acces.userId, ...suivant, updated_at: new Date().toISOString() });
      if (error) setDonnees(donnees);
    },
    [acces.userId, donnees],
  );

  if (!donnees) return null;
  const etat = etatPriseEnMain(donnees);
  if (!etat.visible) return null;

  if (etat.terminee) {
    return (
      <Carte titre="Vous avez tout vu" style={BORD}>
        <p style={{ margin: "0 0 8px", fontSize: 15, lineHeight: 1.5, color: "rgba(0,56,80,.78)" }}>
          Cette carte ne réapparaîtra plus. Le guide reste là si vous en avez besoin.
        </p>
        <Bouton variante="secondaire" taille="petite" onClick={() => void ecrire({ masquee: true })}>
          Fermer
        </Bouton>
      </Carte>
    );
  }

  const restantes = etat.etapes.filter((e) => !e.faite).length;

  return (
    <Carte titre="Premiers pas" style={BORD}>
      <p style={{ margin: "-4px 0 8px", fontSize: 15, lineHeight: 1.5, color: "rgba(0,56,80,.78)" }}>
        {restantes === 1 ? "Il reste une chose à faire" : `Il reste ${restantes} choses à faire`}, et ça prend
        dix minutes.{" "}
        <a href={GUIDE} target="_blank" rel="noopener noreferrer" className="ad-lien">
          Le guide complet
        </a>
        .
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {etat.etapes.map((e) => (
          <li
            key={e.id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "flex-start",
              padding: "12px 0",
              borderTop: "1px solid rgba(0,56,80,.08)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 20,
                height: 20,
                borderRadius: 5,
                flexShrink: 0,
                marginTop: 1,
                display: "grid",
                placeItems: "center",
                background: e.faite ? "#04A49B" : "transparent",
                border: e.faite ? "none" : "1.5px solid rgba(0,56,80,.45)",
                color: "#fff",
              }}
            >
              {e.faite ? <Check size={14} strokeWidth={3} /> : null}
            </span>
            <span style={{ flex: 1, minWidth: 0, fontSize: 15, lineHeight: 1.45, color: e.faite ? "rgba(0,56,80,.72)" : "#003850" }}>
              <span style={{ fontWeight: 600, textDecoration: e.faite ? "line-through" : "none" }}>{e.titre}</span>
              {e.faite ? <span className="sr-only"> (fait)</span> : null}
              {e.faite ? null : (
                <>
                  <span style={{ display: "block", fontSize: 14, lineHeight: 1.5, color: "rgba(0,56,80,.78)", margin: "4px 0 8px" }}>
                    {e.detail}
                  </span>
                  <span className="ad-rangee">
                    <Link href={e.lien} className="ad-bouton ad-bouton--secondaire ad-bouton--petite">
                      Y aller
                      <ArrowRight aria-hidden="true" size={16} />
                    </Link>
                    {e.cochable ? (
                      <Bouton
                        variante="discret"
                        taille="petite"
                        onClick={() => void ecrire({ cochees: [...donnees.cochees, e.id] })}
                      >
                        {e.id === "absences" ? "Je n’en ai pas" : e.id === "klub" ? "C’est vu" : "Pas pour moi"}
                      </Bouton>
                    ) : null}
                  </span>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 8 }}>
        <Bouton variante="discret" taille="petite" onClick={() => void ecrire({ masquee: true })}>
          Masquer définitivement
        </Bouton>
      </div>
    </Carte>
  );
}

/** La carte d'accueil se distingue des autres par un bord sarcelle. */
const BORD: React.CSSProperties = { border: "1px solid rgba(4,164,155,.45)" };
