import { revalidatePath } from "next/cache";
import { after, NextResponse } from "next/server";
import { envoyerMail } from "@/lib/klub/envoi";
import { codeErreur, ERREURS } from "@/lib/klub/erreurs";
import type { ReponseInscription } from "@/lib/klub/types";
import { normaliserTelephone, UUID, verifierCoordonnees } from "@/lib/klub/validation";
import { klubSeancePath, ROUTES } from "@/lib/routes";
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
 */

export const dynamic = "force-dynamic";

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

  const { statut, rang, mail_id } = r.data;
  if (mail_id) {
    after(async () => {
      await envoyerMail(mail_id);
    });
  }
  revalidatePath(ROUTES.klub);
  revalidatePath(klubSeancePath(seance));

  return NextResponse.json({ ok: true, statut, rang });
}
