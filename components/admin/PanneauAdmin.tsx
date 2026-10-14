"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  CalendarClock,
  CalendarDays,
  Compass,
  Dumbbell,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Users,
  type LucideIcon,
} from "lucide-react";
import { rubriquesVisibles, type Acces, type Rubrique } from "@/lib/admin/droits";
import { supabaseBrowser } from "@/lib/supabase-browser";

/** Une icône par rubrique ; une rubrique inconnue n'en a pas. */
const ICONES: Record<string, LucideIcon> = {
  "/admin": LayoutDashboard,
  "/admin/actualites": Newspaper,
  "/admin/mugi-klub": Dumbbell,
  "/admin/agenda": CalendarDays,
  "/admin/evenements": CalendarClock,
  "/admin/praticiens": Users,
  "/admin/orientation": Compass,
};

/** La rubrique est-elle celle de la page affichée (ou d'une de ses sous-pages) ? */
export function estRubriqueActive(href: string, chemin: string): boolean {
  return chemin === href || (href !== "/admin" && chemin.startsWith(`${href}/`));
}

/** La rubrique de la page affichée, pour le titre de la barre du téléphone. */
export function rubriqueCourante(acces: Acces, chemin: string): Rubrique | undefined {
  return rubriquesVisibles(acces).find((r) => estRubriqueActive(r.href, chemin));
}

/** Petite ligne du pied du panneau (voir le site, se déconnecter). */
const PIED: React.CSSProperties = { fontSize: 14, minHeight: 44, color: "rgba(0,56,80,.78)" };

/**
 * Panneau latéral du back-office. Blanc et sobre : c'est un outil de
 * travail, pas une vitrine. La rubrique active porte un fond, une barre à
 * gauche, une graisse et `aria-current` (classe `.ad-nav-lien`) ; une
 * rubrique « bientôt » est annoncée mais pas cliquable.
 */
export default function PanneauAdmin({
  acces,
  chemin,
  onNaviguer,
  onDeconnexion,
}: {
  acces: Acces;
  chemin: string;
  onNaviguer: () => void;
  onDeconnexion: () => void;
}) {
  const rubriques = rubriquesVisibles(acces);

  return (
    <nav aria-label="Sections du back-office" style={{ display: "flex", flexDirection: "column", minHeight: "100%", padding: "14px 10px 12px" }}>
      <p style={{ margin: "0 0 10px", padding: "0 12px", minHeight: 44, display: "flex", alignItems: "center", gap: 6, fontSize: 18, fontWeight: 800, color: "#003850" }}>
        mugitu
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "#0A556B" }}>admin</span>
      </p>

      {rubriques.map((r, i) => {
        const actif = estRubriqueActive(r.href, chemin);
        const groupePrecedent = i > 0 ? rubriques[i - 1].groupe : "";
        const Icone = ICONES[r.href];
        const icone = Icone ? <Icone aria-hidden="true" size={20} strokeWidth={1.75} color={actif ? "#04A49B" : "currentColor"} style={{ flex: "none" }} /> : null;
        const entete =
          r.groupe && r.groupe !== groupePrecedent ? (
            <p style={{ margin: "16px 12px 6px", fontSize: 12, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(0,56,80,.72)" }}>
              {r.groupe}
            </p>
          ) : null;

        return (
          <div key={r.href} style={{ marginBottom: 2 }}>
            {entete}
            {r.bientot ? (
              <span className="ad-nav-lien" aria-disabled="true">
                {icone}
                {r.label}
                <span style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700 }}>bientôt</span>
              </span>
            ) : (
              <Link href={r.href} onClick={onNaviguer} aria-current={actif ? "page" : undefined} className="ad-nav-lien">
                {icone}
                {r.label}
              </Link>
            )}
          </div>
        );
      })}

      <div style={{ marginTop: "auto", paddingTop: 12, borderTop: "1px solid rgba(0,56,80,.1)" }}>
        <p style={{ margin: "0 0 4px", padding: "0 12px", fontSize: 14, color: "#003850", fontWeight: 700 }}>{acces.prenom}</p>
        {acces.estSuperAdmin ? <ReglageRecap /> : null}
        <a href="/" target="_blank" rel="noopener noreferrer" className="ad-nav-lien" style={PIED}>
          <ExternalLink aria-hidden="true" size={18} strokeWidth={1.75} style={{ flex: "none" }} />
          Voir le site
          <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>
            (nouvel onglet)
          </span>
        </a>
        <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid rgba(0,56,80,.1)" }}>
          <button type="button" onClick={onDeconnexion} className="ad-nav-lien" style={PIED}>
            <LogOut aria-hidden="true" size={18} strokeWidth={1.75} style={{ flex: "none" }} />
            Se déconnecter
          </button>
        </div>
      </div>
    </nav>
  );
}

/**
 * Recevoir ou non le récapitulatif quotidien. Un seul interrupteur ne
 * mérite pas une rubrique de réglages ; il vit donc au pied du panneau,
 * là où l'on trouve déjà ce qui concerne son propre compte.
 *
 * L'absence de ligne en base vaut « oui » : on n'en crée une qu'au premier
 * changement.
 */
function ReglageRecap() {
  const [actif, setActif] = useState<boolean | null>(null);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const { data: session } = await sb.auth.getUser();
    const id = session.user?.id;
    if (!id) return;
    const { data } = await sb.from("site_reglages_mail").select("recap").eq("user_id", id).maybeSingle();
    setActif(data?.recap ?? true);
  }, []);

  useEffect(() => {
    // Motif du dépôt : pas de setState synchrone dans le corps d'un effet.
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const basculer = async (valeur: boolean) => {
    const sb = supabaseBrowser();
    const { data: session } = await sb.auth.getUser();
    const id = session.user?.id;
    if (!id) return;
    setActif(valeur);
    const { error } = await sb
      .from("site_reglages_mail")
      .upsert({ user_id: id, recap: valeur, updated_at: new Date().toISOString() });
    if (error) setActif(!valeur);
  };

  if (actif === null) return null;

  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        minHeight: 44,
        padding: "0 12px",
        fontSize: 14,
        color: "rgba(0,56,80,.78)",
        cursor: "pointer",
      }}
    >
      <input type="checkbox" checked={actif} onChange={(e) => void basculer(e.target.checked)} style={{ width: 18, height: 18, margin: 0, accentColor: "#04A49B" }} />
      Récapitulatif quotidien
    </label>
  );
}
