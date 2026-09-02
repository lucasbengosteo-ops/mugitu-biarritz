import { Languages, MapPin } from "lucide-react";

/**
 * Rend une icône Lucide à partir du nom utilisé dans les maquettes
 * (`data-lucide="map-pin"`). Volontairement restreint aux icônes réellement
 * employées : ajouter l’entrée ici quand une nouvelle apparaît, plutôt que
 * d’importer toute la librairie dynamiquement.
 */
const ICONS = {
  "map-pin": MapPin,
  languages: Languages,
} as const;

export default function LucideIcon({
  name,
  style,
}: {
  name: string;
  style?: React.CSSProperties;
}) {
  const Icon = ICONS[name as keyof typeof ICONS];
  if (!Icon) return null;
  return <Icon style={style} aria-hidden="true" />;
}
