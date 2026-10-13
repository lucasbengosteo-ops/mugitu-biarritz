import { revalidatePath } from "next/cache";
import { after, NextResponse } from "next/server";
import { envoyerMail } from "@/lib/klub/envoi";
import { codeErreur, ERREURS } from "@/lib/klub/erreurs";
import { finSessionPaiement } from "@/lib/klub/paiement";
import type { ReponseInscription } from "@/lib/klub/types";
import { normaliserTelephone, UUID, verifierCoordonnees } from "@/lib/klub/validation";
import { klubSeancePath, ROUTES } from "@/lib/routes";
import { creerSessionPaiement } from "@/lib/stripe";
import { rpcService } from "@/lib/supabase-service";

/**
 * POST /api/klub/inscription
 *
 * La règle (places, liste d'attente, doublons) vit dans `klub_inscrire`,
 * exécutable par la seule clé de service. Cette route filtre les robots,
 * relaie la réponse et envoie le mail une fois la réponse partie.
 *
 * Une adresse déjà inscrite reçoit la même réponse qu'une nouvelle : la
 * distinguer permettrait de tester qui est inscrit.
 *
 * Chemin payant (statut `paiement`) : on va chercher de quoi payer
 * (`klub_paiement_infos`), on réutilise la session Stripe déjà créée si elle
 * existe, sinon on en crée une. Rien n'est confirmé ici : seule la
 * notification de Stripe confirme (`/api/stripe/webhook`).
 */

export const dynamic = "force-dynamic";

type InfosPaiement = {
  inscription_id: string;
  email: string;
  jeton: string;
  montant_centimes: number;
  expire_at: string;
  session_url: string | null;
  seance_id: string;
  titre: string;
  debut: string;
  compte: string;
};

const MESSAGE_PAIEMENT_INDISPONIBLE = "Le paiement en ligne est indisponible pour le moment. Réessayez dans quelques minutes.";

/** De quoi payer une inscription en `paiement` : la session existante, ou une neuve. */
async function urlDePaiement(inscriptionId: string, origine: string): Promise<string> {
  const infosR = await rpcService<InfosPaiement | null>("klub_paiement_infos", {
    p_inscription: inscriptionId,
    p_jeton: null,
  });
  if (!infosR.ok) throw new Error(`klub_paiement_infos ${infosR.status}`);
  const infos = infosR.data;
  if (!infos) throw new Error("klub_paiement_infos introuvable");
  if (infos.session_url) return infos.session_url;

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
  const sessionR = await rpcService<null>("klub_paiement_session", {
    p_inscription: infos.inscription_id,
    p_compte: infos.compte,
    p_session: session.id,
    p_url: session.url,
  });
  if (!sessionR.ok) throw new Error(`klub_paiement_session ${sessionR.status}`);
  return session.url;
}

type Corps = {
  seance?: unknown;
  prenom?: unknown;
  nom?: unknown;
  email?: unknown;
  telephone?: unknown;
  premiere?: unknown;
  site?: unknown;
};

const texte = (v: unknown) => (typeof v === "string" ? v : "");

const refus = (message: string, status = 422) => NextResponse.json({ ok: false, message }, { status });

export async function POST(request: Request) {
  let c: Corps;
  try {
    c = await request.json();
  } catch {
    return refus("Requête illisible.", 400);
  }

  // Champ piège rempli : on fait croire à un succès, rien n'est écrit.
  if (texte(c.site).trim() !== "") return NextResponse.json({ ok: true, statut: "confirmee", rang: null });

  const seance = texte(c.seance);
  if (!UUID.test(seance)) return refus(ERREURS.KLUB_SEANCE);

  const coordonnees = { prenom: texte(c.prenom), nom: texte(c.nom), email: texte(c.email), telephone: texte(c.telephone) };
  const probleme = verifierCoordonnees(coordonnees);
  if (probleme) return refus(ERREURS[probleme]);

  let r;
  try {
    r = await rpcService<ReponseInscription>("klub_inscrire", {
      p_seance: seance,
      p_prenom: coordonnees.prenom,
      p_nom: coordonnees.nom,
      p_email: coordonnees.email.trim().toLowerCase(),
      p_telephone: normaliserTelephone(coordonnees.telephone),
      p_premiere: c.premiere === true,
    });
  } catch (e) {
    console.error("[klub] inscription : base injoignable", e);
    return refus("L’inscription n’a pas pu être enregistrée. Réessayez dans un instant.", 502);
  }

  if (!r.ok) {
    const code = codeErreur(r.corps);
    if (code && ERREURS[code]) return refus(ERREURS[code]);
    console.error("[klub] inscription refusée", r.status, r.corps);
    return refus("L’inscription n’a pas pu être enregistrée. Réessayez dans un instant.", 502);
  }

  const { statut, rang, mail_id, inscription_id } = r.data;

  if (statut === "paiement") {
    if (!inscription_id) {
      console.error("[klub] inscription payante sans identifiant", r.data);
      return refus(MESSAGE_PAIEMENT_INDISPONIBLE, 502);
    }
    let url: string;
    try {
      url = await urlDePaiement(inscription_id, new URL(request.url).origin);
    } catch (e) {
      console.error("[klub] session de paiement indisponible", e);
      return refus(MESSAGE_PAIEMENT_INDISPONIBLE, 502);
    }
    revalidatePath(ROUTES.klub);
    revalidatePath(klubSeancePath(seance));
    return NextResponse.json({ ok: true, statut: "paiement", url });
  }

  if (mail_id) {
    after(async () => {
      await envoyerMail(mail_id);
    });
  }
  revalidatePath(ROUTES.klub);
  revalidatePath(klubSeancePath(seance));

  return NextResponse.json({ ok: true, statut, rang });
}
