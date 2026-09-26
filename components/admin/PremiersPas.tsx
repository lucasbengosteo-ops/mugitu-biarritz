"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { etatPriseEnMain, type Donnees } from "@/lib/admin/prise-en-main";
import { supabaseBrowser } from "@/lib/supabase-browser";

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
      <div style={CARTE}>
        <p style={{ margin: "0 0 8px", fontSize: 15, fontWeight: 700, color: "#003850" }}>
          Vous avez tout vu
        </p>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "rgba(51,51,52,.7)" }}>
          Cette carte ne réapparaîtra plus. Le guide reste là si vous en avez besoin.
        </p>
        <button type="button" onClick={() => void ecrire({ masquee: true })} style={BOUTON_PLAT}>
          Fermer
        </button>
      </div>
    );
  }

  const restantes = etat.etapes.filter((e) => !e.faite).length;

  return (
    <div style={CARTE}>
      <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700, color: "#003850" }}>Premiers pas</p>
      <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "rgba(51,51,52,.65)" }}>
        {restantes === 1 ? "Il reste une chose à faire" : `Il reste ${restantes} choses à faire`}, et ça prend
        dix minutes. <a href={GUIDE} target="_blank" rel="noopener noreferrer" style={{ color: "#04A49B" }}>
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
              gap: 10,
              alignItems: "flex-start",
              padding: "9px 0",
              borderTop: "1px solid rgba(0,56,80,.08)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                flexShrink: 0,
                marginTop: 2,
                background: e.faite ? "#04A49B" : "transparent",
                border: e.faite ? "none" : "1px solid rgba(0,56,80,.25)",
              }}
            />
            <span style={{ flex: 1, fontSize: 13, color: e.faite ? "rgba(51,51,52,.5)" : "#1d2d33" }}>
              <span style={{ fontWeight: 600, textDecoration: e.faite ? "line-through" : "none" }}>
                {e.titre}
              </span>
              {e.faite ? null : (
                <>
                  <span style={{ display: "block", fontSize: 12.5, color: "rgba(51,51,52,.65)", margin: "2px 0 6px" }}>
                    {e.detail}
                  </span>
                  <Link href={e.lien} style={{ fontSize: 12.5, color: "#04A49B", fontWeight: 600 }}>
                    Y aller →
                  </Link>
                  {e.cochable ? (
                    <button
                      type="button"
                      onClick={() => void ecrire({ cochees: [...donnees.cochees, e.id] })}
                      style={{ ...BOUTON_PLAT, marginLeft: 14 }}
                    >
                      {e.id === "absences" ? "Je n’en ai pas" : e.id === "klub" ? "C’est vu" : "Pas pour moi"}
                    </button>
                  ) : null}
                </>
              )}
            </span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => void ecrire({ masquee: true })}
        style={{ ...BOUTON_PLAT, marginTop: 12 }}
      >
        Masquer définitivement
      </button>
    </div>
  );
}

const CARTE: React.CSSProperties = {
  background: "#fff",
  border: "1px solid rgba(4,164,155,.35)",
  borderRadius: 12,
  padding: 16,
  marginBottom: 18,
  boxShadow: "0 2px 10px rgba(60,40,30,.06)",
};

const BOUTON_PLAT: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  font: "inherit",
  fontSize: 12.5,
  color: "rgba(51,51,52,.6)",
  cursor: "pointer",
  textDecoration: "underline",
};
