import { initiales } from "@/lib/agenda/couleurs";
import type { Couleur } from "./cases";

/**
 * Une personne en un rond : ses initiales sur sa couleur. Le nom complet
 * est dans `title` et dans le libellé accessible : la couleur n'est jamais
 * le seul repère.
 *
 * Props
 * - `nom`     : le nom complet.
 * - `teinte`  : `{ fond, texte }`, de `teintesDeLAgenda`.
 * - `taille?` : "petite" (24 px), "normale" (28 px, par défaut), "grande" (36 px).
 * - `muette?` : le nom est déjà écrit à côté — la pastille est alors
 *   décorative (`aria-hidden`), pour ne pas le faire lire deux fois.
 */
const TAILLES = { petite: 24, normale: 28, grande: 36 } as const;

export default function Pastille({
  nom,
  teinte,
  taille = "normale",
  muette = false,
}: {
  nom: string;
  teinte: Couleur;
  taille?: keyof typeof TAILLES;
  muette?: boolean;
}) {
  const cote = TAILLES[taille];
  return (
    <span
      className="ad-agenda-pastille"
      title={nom}
      role={muette ? undefined : "img"}
      aria-label={muette ? undefined : nom}
      aria-hidden={muette || undefined}
      style={{
        // Ronde pour deux initiales, s'allonge en pilule pour trois : jamais de lettre rognée.
        minWidth: cote,
        height: cote,
        background: teinte.fond,
        color: teinte.texte,
        fontSize: taille === "grande" ? 14 : 12,
      }}
    >
      {initiales(nom)}
    </span>
  );
}
