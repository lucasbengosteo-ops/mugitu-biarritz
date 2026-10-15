import type { Echange, ReponseAide } from "@/lib/aide/types";
import {
  demandeSignes,
  demandeZone,
  type AncienneteId,
  type MotifId,
  type ReponseOrientation,
  type SportChoixId,
  type ZoneId,
} from "@/lib/orientation/types";

/**
 * L'état de la discussion du widget. Il vit dans `WidgetAide`, monté dans la
 * mise en page racine : il survit aux navigations, pas au rechargement.
 */

/** Les questions de « Par où commencer ? », dans l'ordre du parcours. */
export type EtapeOrientation = "motif" | "zone" | "anciennete" | "sport" | "signes" | "texte";

export type EtatOrientation = {
  etape: EtapeOrientation;
  motif: MotifId | null;
  zone: ZoneId | null;
  anciennete: AncienneteId | null;
  sport: SportChoixId | null;
};

export type Message =
  | { id: number; de: "visiteur"; texte: string }
  | { id: number; de: "cabinet"; genre: "aide"; question: string; reponse: ReponseAide; vote: boolean | null }
  | { id: number; de: "cabinet"; genre: "panne" | "trop" }
  | { id: number; de: "cabinet"; genre: "orientation-question"; etape: EtapeOrientation }
  | { id: number; de: "cabinet"; genre: "orientation-alerte" }
  | { id: number; de: "cabinet"; genre: "orientation-panne" | "orientation-trop" }
  | { id: number; de: "cabinet"; genre: "orientation-resultat"; resultat: ReponseOrientation };

export type Conversation = {
  messages: Message[];
  /** Le parcours d'orientation en cours, ou null. */
  orientation: EtatOrientation | null;
  /** Une réponse est attendue du serveur. */
  attente: boolean;
};

export const CONVERSATION_VIDE: Conversation = { messages: [], orientation: null, attente: false };

let compteur = 0;
/** Un identifiant de message, unique pour la page. */
export function nouvelId(): number {
  compteur += 1;
  return compteur;
}

export const ORIENTATION_DEPART: EtatOrientation = {
  etape: "motif",
  motif: null,
  zone: null,
  anciennete: null,
  sport: null,
};

/** L'étape qui suit une question : le même enchaînement que « Par où commencer ? ». */
export function etapeSuivante(etape: EtapeOrientation, motif: MotifId): EtapeOrientation {
  switch (etape) {
    case "motif":
      return demandeZone(motif) ? "zone" : "sport";
    case "zone":
      return "anciennete";
    case "anciennete":
      return "sport";
    case "sport":
      return demandeSignes(motif) ? "signes" : "texte";
    default:
      return "texte";
  }
}

/** Les deux derniers échanges utiles, renvoyés pour une question de suivi. */
export function historique(messages: Message[]): Echange[] {
  const echanges: Echange[] = [];
  for (const m of messages) {
    if (m.de === "cabinet" && m.genre === "aide" && m.reponse.type === "reponse") {
      echanges.push({ question: m.question, reponse: m.reponse.texte });
    }
  }
  return echanges.slice(-2);
}
