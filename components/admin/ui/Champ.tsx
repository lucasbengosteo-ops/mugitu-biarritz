import { cloneElement, isValidElement, useId } from "react";
import { CircleAlert } from "lucide-react";

/**
 * Un champ de formulaire : libellé visible relié à l'entrée, aide dessous,
 * erreur sous le champ. L'entrée reçoit `id`, `aria-describedby` (aide puis
 * erreur) et `aria-invalid` ; elle prend toute la largeur, 44 px de haut
 * (classe `.ad-champ`).
 *
 * Props
 * - `label`    : le libellé, toujours visible.
 * - `aide?`    : une phrase d'aide sous le champ.
 * - `erreur?`  : le message d'erreur ; rend le champ `aria-invalid`.
 * - `id?`      : impose l'`id` de l'entrée (sinon généré).
 * - `children` : soit un seul élément (`<input />`, `<select>`, `<textarea>`)
 *   auquel les attributs sont ajoutés, soit une fonction qui les reçoit :
 *   `{(attrs) => <MonEntree {...attrs} />}`.
 */
export type AttributsChamp = {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
};

export default function Champ({
  label,
  aide,
  erreur,
  id,
  children,
}: {
  label: React.ReactNode;
  aide?: React.ReactNode;
  erreur?: React.ReactNode;
  id?: string;
  children: React.ReactElement<Partial<AttributsChamp>> | ((attrs: AttributsChamp) => React.ReactNode);
}) {
  const genere = useId();
  const idEntree = id ?? `champ-${genere}`;
  const idAide = aide ? `${idEntree}-aide` : undefined;
  const idErreur = erreur ? `${idEntree}-erreur` : undefined;
  const decrit = [idAide, idErreur].filter(Boolean).join(" ") || undefined;

  const attrs: AttributsChamp = {
    id: idEntree,
    "aria-describedby": decrit,
    "aria-invalid": erreur ? true : undefined,
  };

  const entree =
    typeof children === "function" ? children(attrs) : isValidElement(children) ? cloneElement(children, attrs) : children;

  return (
    <div className="ad-champ" style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <label htmlFor={idEntree} style={{ fontSize: 14, fontWeight: 600, color: "#003850" }}>
        {label}
      </label>
      {entree}
      {aide ? (
        <p id={idAide} style={{ margin: 0, fontSize: 13, lineHeight: 1.45, color: "rgba(0,56,80,.78)" }}>
          {aide}
        </p>
      ) : null}
      {erreur ? (
        <p id={idErreur} style={{ margin: 0, display: "flex", alignItems: "flex-start", gap: 6, fontSize: 14, fontWeight: 600, lineHeight: 1.45, color: "#003850" }}>
          <CircleAlert aria-hidden="true" size={16} color="#EE806C" style={{ flex: "none", marginTop: 2 }} />
          {erreur}
        </p>
      ) : null}
    </div>
  );
}
