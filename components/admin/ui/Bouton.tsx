import { LoaderCircle, type LucideIcon } from "lucide-react";

/**
 * Bouton du back-office. 44 px de haut (40 px en « petite » à partir de
 * 700 px seulement : sur téléphone, la cible tactile reste à 44 px).
 *
 * Props
 * - `variante?` : "principal" (bleu nuit, par défaut) | "secondaire" (blanc
 *   bordé) | "discret" (sans fond) | "danger" (corail, texte bleu nuit).
 * - `taille?`   : "normale" (par défaut) | "petite".
 * - `enCours?`  : action en cours — le bouton est désactivé, porte
 *   `aria-busy`, garde son libellé et remplace l'icône par un indicateur.
 * - `icone?`    : une icône lucide (le composant, pas l'élément), décorative.
 * - tout attribut de `<button>` (`onClick`, `type`, `disabled`,
 *   `aria-label`…). `type` vaut "button" par défaut.
 *
 * Bouton sans texte : passer `aria-label`.
 */
export type VarianteBouton = "principal" | "secondaire" | "discret" | "danger";

export type BoutonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variante?: VarianteBouton;
  taille?: "normale" | "petite";
  enCours?: boolean;
  icone?: LucideIcon;
  children?: React.ReactNode;
};

export default function Bouton({
  variante = "principal",
  taille = "normale",
  enCours = false,
  icone: Icone,
  className,
  type = "button",
  disabled,
  children,
  ...props
}: BoutonProps) {
  const classes = ["ad-bouton", `ad-bouton--${variante}`, taille === "petite" ? "ad-bouton--petite" : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  const tailleIcone = taille === "petite" ? 16 : 18;

  return (
    <button {...props} type={type} className={classes} disabled={disabled || enCours} aria-busy={enCours || undefined}>
      {enCours ? (
        <LoaderCircle aria-hidden="true" size={tailleIcone} className="ad-tourne" />
      ) : Icone ? (
        <Icone aria-hidden="true" size={tailleIcone} />
      ) : null}
      {children}
    </button>
  );
}
