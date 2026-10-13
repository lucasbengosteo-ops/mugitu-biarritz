import { finSessionPaiement } from "@/lib/klub/paiement";
import { creerSessionPaiement, etatSession } from "@/lib/stripe";
import { rpcService } from "@/lib/supabase-service";

/**
 * Où envoyer une personne qui doit payer sa place : la route d'inscription et
 * le lien du mail « Une place s'est libérée » passent par ici.
 *
 * Une session Stripe dure 31 min, une place gardée depuis la liste d'attente
 * 6 h : la session déjà créée n'est réutilisée que si Stripe la dit encore
 * ouverte. Si elle est payée, on n'en crée surtout pas une seconde, qui
 * pourrait être payée aussi : on renvoie vers la page « Paiement reçu ».
 */

type InfosPaiement = {
  inscription_id: string;
  email: string;
  jeton: string;
  montant_centimes: number;
  expire_at: string;
  session_url: string | null;
  session_id: string | null;
  session_compte: string | null;
  titre: string;
  compte: string;
};

/** L'adresse vers laquelle rediriger, ou null si aucun paiement n'est attendu. */
export async function adresseDePaiement(
  cle: { inscription: string } | { jeton: string },
  origine: string,
): Promise<string | null> {
  const r = await rpcService<InfosPaiement | null>("klub_paiement_infos", {
    p_inscription: "inscription" in cle ? cle.inscription : null,
    p_jeton: "jeton" in cle ? cle.jeton : null,
  });
  if (!r.ok) throw new Error(`klub_paiement_infos ${r.status}`);
  const infos = r.data;
  if (!infos) return null;

  if (infos.session_id && infos.session_compte) {
    const etat = await etatSession(infos.session_compte, infos.session_id);
    if (etat === "payee") return `${origine}/mugi-klub/paiement?etat=recu&jeton=${infos.jeton}`;
    if (etat) return etat.url;
  }

  const session = await creerSessionPaiement({
    compte: infos.compte,
    inscriptionId: infos.inscription_id,
    email: infos.email,
    titre: infos.titre,
    montantCentimes: infos.montant_centimes,
    origine,
    jeton: infos.jeton,
    expireAt: finSessionPaiement(new Date(), infos.expire_at),
  });
  const s = await rpcService<null>("klub_paiement_session", {
    p_inscription: infos.inscription_id,
    p_compte: infos.compte,
    p_session: session.id,
    p_url: session.url,
  });
  if (!s.ok) throw new Error(`klub_paiement_session ${s.status}`);
  return session.url;
}
