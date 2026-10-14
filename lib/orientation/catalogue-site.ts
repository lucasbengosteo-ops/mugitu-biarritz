import { equipeAvecOverrides, getOverrides } from "@/lib/practitioners";
import { METHODE_CARDS } from "@/lib/methodes";
import { PATHOLOGIES } from "@/lib/pathologies";
import { SPORTS } from "@/lib/sports";
import { construireCatalogue, type Catalogue } from "./catalogue";

/**
 * Le catalogue réel : l'équipe avec les retouches du back-office (noms,
 * photos, liens de réservation à jour). Serveur seulement.
 *
 * Le paquet `server-only` n'est pas installé dans ce dépôt : pas de garde
 * d'import ici. Ce module importe `@/lib/practitioners`, qui lit Supabase
 * via des clés serveur ; ne jamais l'importer depuis un composant client.
 */
export async function catalogueDuSite(): Promise<Catalogue> {
  const equipe = equipeAvecOverrides(await getOverrides());
  return construireCatalogue({ equipe, methodes: METHODE_CARDS, pathologies: PATHOLOGIES, sports: SPORTS });
}
