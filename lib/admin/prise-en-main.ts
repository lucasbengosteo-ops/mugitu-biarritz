/**
 * Où en est quelqu'un de sa prise en main du back-office.
 *
 * Pur, sans import : lu tel quel par les tests `node --test`. Les étapes
 * déductibles se calculent depuis les données, les autres se cochent.
 *
 * Deux étapes admettent d'être cochées sans avoir été faites — « je n'ai pas
 * d'absence », « les articles, pas pour moi ». Une liste où l'on ne peut pas
 * dire « pas moi » ne se termine jamais, et une liste qui ne se termine
 * jamais se masque.
 */

export type Donnees = {
  aUnVoeu: boolean;
  aUneAbsence: boolean;
  aUnArticle: boolean;
  cochees: string[];
  masquee: boolean;
  estGerant: boolean;
};

export type Etape = {
  id: "agenda" | "absences" | "klub" | "article" | "recap";
  titre: string;
  detail: string;
  lien: string;
  faite: boolean;
  /** Peut se fermer d'une coche, sans avoir été faite pour de vrai. */
  cochable: boolean;
};

export type EtatPriseEnMain = {
  etapes: Etape[];
  terminee: boolean;
  visible: boolean;
};

export function etatPriseEnMain(d: Donnees): EtatPriseEnMain {
  const coche = (id: string) => d.cochees.includes(id);

  const etapes: Etape[] = [
    {
      id: "agenda",
      titre: "Posez vos demi-journées au cabinet",
      detail:
        "Dites dans quelles salles et quand vous souhaitez être là. C’est la seule chose qu’on attend de chacun, et sans elle personne ne peut arbitrer les salles.",
      lien: "/admin/agenda",
      faite: d.aUnVoeu,
      cochable: false,
    },
    {
      id: "absences",
      titre: "Déclarez vos absences à venir",
      detail:
        "Congés, formation, arrêt : sans ça la grille du cabinet annonce des présences fausses.",
      lien: "/admin/agenda",
      faite: d.aUneAbsence || coche("absences"),
      cochable: true,
    },
    {
      id: "klub",
      titre: "Voyez comment marche le Mugi Klub",
      detail:
        "Les séances, les inscrits, les présents le jour J. Même si vous n’animez rien, vous pouvez être celui qui répond au téléphone.",
      lien: "/admin/mugi-klub",
      faite: coche("klub"),
      cochable: true,
    },
    {
      id: "article",
      titre: "Écrivez ou relisez un article",
      detail: "Les Actualités du site. Tout le monde n’écrit pas, et ce n’est pas grave.",
      lien: "/admin/actualites",
      faite: d.aUnArticle || coche("article"),
      cochable: true,
    },
  ];

  if (d.estGerant) {
    etapes.push({
      id: "recap",
      titre: "Choisissez si vous voulez le récapitulatif quotidien",
      detail:
        "Un mail par jour sur ce qui a bougé dans l’espace. L’interrupteur est au pied du panneau de gauche.",
      lien: "/admin",
      faite: coche("recap"),
      cochable: true,
    });
  }

  const terminee = etapes.every((e) => e.faite);
  return { etapes, terminee, visible: !d.masquee };
}
