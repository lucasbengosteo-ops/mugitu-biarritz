"use client";

import { Hourglass, Plus, Repeat, TriangleAlert } from "lucide-react";
import { MOMENTS, SALLES, nomSalle } from "@/lib/agenda/salles";
import { dateDuJour, personnesAbsentes } from "@/lib/agenda/semaine";
import type { Absence, Exception, Personne, Voeu } from "@/lib/agenda/types";
import { casesLibres, numeroJour } from "@/lib/agenda/vues";
import { dateLongue, etatALaDate, nomDe, prenom, teinteDe, type Couleur } from "./cases";
import Grille, { type DecrireCase } from "./Grille";
import Legende from "./Legende";
import NavSemaine from "./NavSemaine";
import Pastille from "./Pastille";
import SemaineJour from "./SemaineJour";

/**
 * « Semaine » : le cabinet pour une semaine datée.
 *
 * Ordinateur (≥ 1024 px) : un tableau, salles × jours. Téléphone et
 * tablette : jour par jour. Les deux sont rendus, le CSS tranche
 * (`.ad-masque-tel`, `.ad-masque-ordi`).
 *
 * Toucher une case tenue ouvre son détail ; avec « Créneaux libres »
 * actif, toucher une case libre ouvre la demande (`onDemanderLibre`).
 */

export type ReglagesSemaine = {
  lundi: string;
  lundiCourant: string;
  onLundi: (lundi: string) => void;
  /** Le jour choisi sur téléphone, `null` = celui par défaut. */
  jourChoisi: number | null;
  onJour: (jour: number) => void;
  selection: string | null;
  onSelection: (id: string | null) => void;
  libres: boolean;
  onLibres: (actif: boolean) => void;
};

export default function Semaine({
  aujourdhui,
  voeux,
  exceptions,
  absences,
  personnes,
  teintes,
  reglages,
  onOuvrir,
  onDemanderLibre,
}: {
  aujourdhui: string;
  voeux: Voeu[];
  exceptions: Exception[];
  absences: Absence[];
  personnes: Record<string, Personne>;
  teintes: Record<string, Couleur>;
  reglages: ReglagesSemaine;
  onOuvrir: (salle: string, jour: number, moment: string) => void;
  onDemanderLibre: (salle: string, jour: number, moment: string) => void;
}) {
  const { lundi, lundiCourant, selection, libres } = reglages;
  const dates = [1, 2, 3, 4, 5, 6, 7].map((j) => dateDuJour(lundi, j));
  const jourCourant = lundi === lundiCourant ? numeroJour(aujourdhui) : null;
  const jour = reglages.jourChoisi ?? jourCourant ?? 1;

  // Les états de la semaine, calculés une fois pour le tableau, la vue jour et la légende.
  const etats = new Map<string, ReturnType<typeof etatALaDate>>();
  const presents = new Set<string>();
  for (let j = 1; j <= 7; j++) {
    for (const s of SALLES) {
      for (const m of MOMENTS) {
        const e = etatALaDate(voeux, exceptions, absences, s.id, j, m.id, lundi);
        etats.set(`${s.id}|${j}|${m.id}`, e);
        if (e.userId) presents.add(e.userId);
      }
    }
  }
  const personnesLegende = [...presents]
    .map((id) => ({ id, nom: nomDe(personnes, id) }))
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" }));
  const nbLibres = casesLibres(voeux, exceptions, absences, lundi).length;
  const enConge = personnesAbsentes(absences, lundi);

  const decrire: DecrireCase = (salle, j, moment, format) => {
    const e =
      etats.get(`${salle}|${j}|${moment}`) ?? etatALaDate(voeux, exceptions, absences, salle, j, moment, lundi);
    const libre = e.userId === null;
    const nom = libre ? null : nomDe(personnes, e.userId);
    const offerte = libre && libres;
    const leMoment = moment === "matin" ? "matin" : "après-midi";

    const details = [
      e.absent ? "en congé" : null,
      e.origine === "exception" ? "échange ponctuel" : null,
      e.demandes > 0 ? `${e.demandes} ${e.demandes > 1 ? "demandes" : "demande"} en attente` : null,
      e.enConflit ? "conflit" : null,
    ].filter(Boolean);
    const label = `${nomSalle(salle)}, ${dateLongue(e.date)} ${leMoment} : ${nom ?? "libre"}${
      details.length ? `, ${details.join(", ")}` : ""
    }${offerte ? ". Demander ce créneau" : ""}`;

    const classes = [
      libre ? "ad-agenda-case--libre" : "ad-agenda-case--tenue",
      offerte ? "ad-agenda-case--offerte" : "",
      e.enConflit ? "ad-agenda-case--conflit" : "",
      e.absent ? "ad-agenda-case--conge" : "",
      // Une case libre offerte reste nette : l'interrupteur la met en avant, même avec un nom surligné.
      selection !== null && e.userId !== selection && !offerte ? "ad-agenda-case--estompee" : "",
      selection !== null && e.userId === selection ? "ad-agenda-case--choisie" : "",
    ]
      .filter(Boolean)
      .join(" ");

    const contenu = (
      <>
        {nom ? (
          <span className="ad-agenda-case-qui">
            <Pastille nom={nom} teinte={teinteDe(teintes, e.userId)} taille="petite" muette />
            <span className="ad-agenda-case-nom">{format === "etroit" ? prenom(nom) : nom}</span>
          </span>
        ) : offerte ? (
          <span className="ad-agenda-signe ad-agenda-signe--libre">
            <Plus aria-hidden="true" size={14} />
            {format === "etroit" ? "libre" : "Libre — demander"}
          </span>
        ) : (
          <span className="ad-agenda-case-vide">libre</span>
        )}
        {e.origine === "exception" || e.absent || e.demandes > 0 || e.enConflit ? (
          <span className="ad-agenda-signes">
            {e.origine === "exception" ? (
              <span className="ad-agenda-signe">
                <Repeat aria-hidden="true" size={14} />
                échange
              </span>
            ) : null}
            {e.absent ? <span className="ad-agenda-signe ad-agenda-signe--conge">en congé</span> : null}
            {e.enConflit ? (
              <span className="ad-agenda-signe ad-agenda-signe--conflit">
                <TriangleAlert aria-hidden="true" size={14} />
                conflit
              </span>
            ) : null}
            {e.demandes > 0 ? (
              <span className="ad-agenda-signe ad-agenda-signe--attente">
                <Hourglass aria-hidden="true" size={14} />
                {e.demandes} en attente
              </span>
            ) : null}
          </span>
        ) : null}
      </>
    );

    return {
      label,
      contenu,
      classes,
      onClick: () => (offerte ? onDemanderLibre(salle, j, moment) : onOuvrir(salle, j, moment)),
    };
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="ad-agenda-barre-outils">
        <NavSemaine lundi={lundi} lundiCourant={lundiCourant} onLundi={reglages.onLundi} />
        <div className="ad-agenda-libres">
          <button
            type="button"
            role="switch"
            aria-checked={libres}
            className="ad-agenda-interrupteur"
            onClick={() => reglages.onLibres(!libres)}
          >
            <span className="ad-agenda-interrupteur-piste" aria-hidden="true">
              <span className="ad-agenda-interrupteur-rond" />
            </span>
            Créneaux libres
          </button>
          <span className="ad-agenda-mention">
            {nbLibres === 0 ? "Aucun cette semaine" : `${nbLibres} cette semaine`}
          </span>
        </div>
      </div>

      {libres ? (
        <p className="ad-agenda-texte" style={{ margin: 0 }}>
          Touchez une case libre pour la demander dans votre semaine type.
        </p>
      ) : null}

      <Legende
        personnes={personnesLegende}
        teintes={teintes}
        selection={selection}
        onSelection={reglages.onSelection}
      />

      {enConge.length > 0 ? (
        <p className="ad-agenda-texte" style={{ margin: 0 }}>
          <strong>En congé cette semaine : </strong>
          {enConge.map((id) => nomDe(personnes, id)).join(", ")}
        </p>
      ) : null}

      <div className="ad-masque-tel">
        <Grille titre="Le cabinet, salle par salle et jour par jour" cellule={decrire} dates={dates} jourCourant={jourCourant} />
      </div>
      <div className="ad-masque-ordi">
        <SemaineJour cellule={decrire} jour={jour} onJour={reglages.onJour} dates={dates} jourCourant={jourCourant} />
      </div>
    </div>
  );
}
