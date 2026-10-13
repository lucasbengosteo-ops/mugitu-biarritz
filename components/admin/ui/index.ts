/**
 * Le socle commun du back-office (spec admin UI § 1). Chaque composant
 * documente ses props en tête de son fichier.
 */
export { default as Page } from "./Page";
export { default as Bouton, type BoutonProps, type VarianteBouton } from "./Bouton";
export { default as Carte } from "./Carte";
export { default as Onglets, ongletId, type Onglet } from "./Onglets";
export { default as Badge, type TonBadge } from "./Badge";
export { default as Message, type TonMessage } from "./Message";
export { default as Champ, type AttributsChamp } from "./Champ";
