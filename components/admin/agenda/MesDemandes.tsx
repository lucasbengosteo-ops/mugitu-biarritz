"use client";

import { Check, Hourglass, Plus, TriangleAlert, X } from "lucide-react";
import { etatCase, voeuDe } from "@/lib/agenda/grille";
import { libelleCase } from "@/lib/agenda/salles";
import type { Personne, Voeu } from "@/lib/agenda/types";
import AbonnementCalendrier from "./AbonnementCalendrier";
import { nomDe, prenom, teinteDe, type Couleur } from "./cases";
import Grille, { type DecrireCase } from "./Grille";
import Pastille from "./Pastille";
import SemaineJour from "./SemaineJour";

/**
 * « Mes demandes » : sa semaine type. Toucher une demi-journée la demande,
 * la retoucher retire la demande ; une case accordée se rend par le détail
 * (« demander à le rendre »). Tout passe par `onCase`, la fonction
 * `basculer` de l'écran, inchangée.
 *
 * En tête, l'abonnement calendrier. Puis le tableau sur ordinateur, et la
 * semaine type jour par jour sur téléphone.
 */

const ETATS: Record<Voeu["statut"], { mot: string; classe: string; icone: React.ReactNode }> = {
  valide: { mot: "Accordé", classe: "ad-agenda-case--mien", icone: <Check aria-hidden="true" size={16} /> },
  propose: { mot: "Demandé", classe: "ad-agenda-case--demande", icone: <Hourglass aria-hidden="true" size={16} /> },
  retrait_demande: {
    mot: "Retrait demandé",
    classe: "ad-agenda-case--demande",
    icone: <Hourglass aria-hidden="true" size={16} />,
  },
  refuse: { mot: "Refusé", classe: "ad-agenda-case--refuse", icone: <X aria-hidden="true" size={16} /> },
};

export default function MesDemandes({
  voeux,
  personnes,
  teintes,
  moi,
  jourDuJour,
  jour,
  onJour,
  onCase,
}: {
  voeux: Voeu[];
  personnes: Record<string, Personne>;
  teintes: Record<string, Couleur>;
  moi: string;
  /** Aujourd'hui, 1 = lundi : mis en avant dans la rangée des jours. */
  jourDuJour: number;
  /** Le jour affiché sur téléphone. */
  jour: number;
  onJour: (jour: number) => void;
  onCase: (salle: string, jour: number, moment: string) => void;
}) {
  const decrire: DecrireCase = (salle, j, moment, format) => {
    const e = etatCase(voeux, salle, j, moment);
    const mien = voeuDe(voeux, moi, salle, j, moment);
    const autre = e.occupant && e.occupant.user_id !== moi ? e.occupant.user_id : null;
    const etat = mien ? ETATS[mien.statut] : null;
    const autresDemandes = e.demandes.filter((v) => v.user_id !== moi).length;

    const action = !mien
      ? "toucher pour la demander"
      : mien.statut === "propose" || mien.statut === "refuse"
        ? "toucher pour retirer la demande"
        : "accordé : toucher pour ouvrir le détail";
    const label = `${libelleCase(salle, j, moment)} : ${
      etat ? etat.mot.toLowerCase() : autre ? `tenu par ${nomDe(personnes, autre)}` : "libre"
    }${autresDemandes > 0 ? `, ${autresDemandes} autre${autresDemandes > 1 ? "s" : ""} en attente` : ""}${
      e.enConflit ? ", conflit" : ""
    }. ${action.charAt(0).toUpperCase()}${action.slice(1)}`;

    const classes = [
      etat ? etat.classe : autre ? "ad-agenda-case--tenue" : "ad-agenda-case--libre",
      e.enConflit ? "ad-agenda-case--conflit" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const contenu = (
      <>
        {etat ? (
          <span className="ad-agenda-signe ad-agenda-signe--fort">
            {etat.icone}
            {etat.mot}
          </span>
        ) : autre ? (
          <span className="ad-agenda-case-qui">
            <Pastille nom={nomDe(personnes, autre)} teinte={teinteDe(teintes, autre)} taille="petite" muette />
            <span className="ad-agenda-case-nom">
              {format === "etroit" ? prenom(nomDe(personnes, autre)) : nomDe(personnes, autre)}
            </span>
          </span>
        ) : (
          <span className="ad-agenda-case-vide">
            <Plus aria-hidden="true" size={14} />
            libre
          </span>
        )}
        {e.enConflit || autresDemandes > 0 ? (
          <span className="ad-agenda-signes">
            {e.enConflit ? (
              <span className="ad-agenda-signe ad-agenda-signe--conflit">
                <TriangleAlert aria-hidden="true" size={14} />
                conflit
              </span>
            ) : null}
            {autresDemandes > 0 ? (
              <span className="ad-agenda-signe ad-agenda-signe--attente">
                <Hourglass aria-hidden="true" size={14} />
                {autresDemandes} autre{autresDemandes > 1 ? "s" : ""}
              </span>
            ) : null}
          </span>
        ) : null}
      </>
    );

    return { label, contenu, classes, onClick: () => onCase(salle, j, moment) };
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <AbonnementCalendrier />

      <p className="ad-agenda-texte" style={{ margin: 0 }}>
        Votre semaine type : touchez une demi-journée pour la demander, retouchez-la pour retirer la demande. Lucas et
        Jean-Baptiste accordent ou refusent, et vous répondent dans le fil de chaque créneau.
      </p>

      <div className="ad-masque-tel">
        <Grille titre="Ma semaine type, salle par salle" cellule={decrire} jourCourant={jourDuJour} />
      </div>
      <div className="ad-masque-ordi">
        <SemaineJour cellule={decrire} jour={jour} onJour={onJour} jourCourant={jourDuJour} />
      </div>
    </div>
  );
}
