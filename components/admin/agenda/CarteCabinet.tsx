"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Carte } from "@/components/admin/ui";
import { MOMENTS, SALLES } from "@/lib/agenda/salles";
import type { Absence, Exception, Personne, Voeu } from "@/lib/agenda/types";
import { presenceDuJour, type PresenceDuJour } from "@/lib/agenda/vues";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { aujourdhuiParis, nomDe, teinteDe, teintesDeLAgenda, type Couleur } from "./cases";
import Pastille from "./Pastille";

/**
 * La carte « Aujourd'hui au cabinet » du tableau de bord : qui tient quelle
 * salle ce matin et cet après-midi, qui est en congé. Un toucher ouvre
 * l'agenda sur l'onglet « Aujourd'hui ».
 *
 * Mêmes tables et même calcul (`presenceDuJour`) que l'agenda, limités au
 * jour : vœux, échanges datés et congés qui couvrent la date.
 */

type Donnees = {
  presence: PresenceDuJour;
  personnes: Record<string, Personne>;
  teintes: Record<string, Couleur>;
};

const LIEN = "/admin/agenda?vue=aujourdhui";

export default function CarteCabinet() {
  const [donnees, setDonnees] = useState<Donnees | null>(null);
  const [erreur, setErreur] = useState(false);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const date = aujourdhuiParis();
    const [v, p, ab, xc] = await Promise.all([
      sb.from("agenda_voeux").select("*"),
      // `profiles.user_id` référence auth.users, comme `agenda_voeux.user_id`.
      sb.from("profiles").select("user_id, first_name, last_name"),
      sb.from("agenda_absences").select("*").lte("du", date).gte("au", date),
      sb.from("agenda_exceptions").select("*").eq("jour", date),
    ]);
    if (v.error || ab.error || xc.error) {
      setErreur(true);
      return;
    }
    const voeux = (v.data ?? []) as Voeu[];
    const exceptions = (xc.data ?? []) as Exception[];
    const personnes: Record<string, Personne> = {};
    for (const l of (p.data ?? []) as { user_id: string; first_name: string | null; last_name: string | null }[]) {
      personnes[l.user_id] = { id: l.user_id, nom: [l.first_name, l.last_name].filter(Boolean).join(" ") || "Sans nom" };
    }
    setErreur(false);
    setDonnees({
      presence: presenceDuJour(voeux, exceptions, (ab.data ?? []) as Absence[], date),
      personnes,
      teintes: teintesDeLAgenda(voeux, exceptions, personnes),
    });
  }, []);

  useEffect(() => {
    // Motif du dépôt : pas de setState synchrone dans le corps d'un effet.
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  return (
    <Carte
      titre="Aujourd’hui au cabinet"
      action={
        <Link href={LIEN} className="ad-agenda-lien">
          Ouvrir l’agenda
        </Link>
      }
    >
      {erreur ? (
        <p className="ad-agenda-texte" style={{ margin: 0 }}>
          Impossible de charger l’agenda. Rechargez la page.
        </p>
      ) : !donnees ? (
        <p className="ad-agenda-mention" style={{ margin: 0 }}>
          Chargement…
        </p>
      ) : (
        <Contenu {...donnees} />
      )}
    </Carte>
  );
}

function Contenu({ presence, personnes, teintes }: Donnees) {
  const absents = presence.absents.map((id) => nomDe(personnes, id));
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {MOMENTS.map((m) => {
        const tenues = SALLES.flatMap((salle) => {
          const c = presence.cases.find((x) => x.salle === salle.id && x.moment === m.id);
          return c && c.userId !== null && !c.absent ? [{ salle, userId: c.userId }] : [];
        });
        return (
          <div key={m.id}>
            <h3 className="ad-agenda-moment-titre">{m.label}</h3>
            {tenues.length === 0 ? (
              <p className="ad-agenda-mention" style={{ margin: 0 }}>
                Personne au cabinet.
              </p>
            ) : (
              <ul className="ad-agenda-liste">
                {tenues.map(({ salle, userId }) => {
                  const nom = nomDe(personnes, userId);
                  return (
                    <li key={salle.id}>
                      <Link href={LIEN} className="ad-agenda-presence ad-agenda-presence--tenue" style={{ textDecoration: "none" }}>
                        <span className="ad-agenda-presence-salle">{salle.nom}</span>
                        <span className="ad-agenda-presence-qui">
                          <Pastille nom={nom} teinte={teinteDe(teintes, userId)} taille="petite" muette />
                          <span>{nom}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
      {absents.length > 0 && (
        <p className="ad-agenda-mention" style={{ margin: 0 }}>
          En congé : {absents.join(", ")}
        </p>
      )}
    </div>
  );
}
