import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { codeErreur, ERREURS } from "@/lib/jeux";
import { envoyerConfirmation } from "@/lib/newsletter";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase-config";

/**
 * POST /api/jeux/inscription
 *
 * Inscrit un visiteur aux jeux du stand et renvoie son numéro de dossard.
 * La validation de fond vit dans la fonction Postgres `jeux_inscrire` ; cette
 * route ajoute le champ piège et, si la case a été cochée, l'inscription à la
 * newsletter — qui exige la clé Brevo, donc le serveur.
 *
 * La newsletter est un consentement distinct : la case est décochée par
 * défaut, et participer aux jeux n'y inscrit personne d'office.
 */

export const dynamic = "force-dynamic";

type Corps = {
  prenom?: unknown;
  nom?: unknown;
  email?: unknown;
  instagram?: unknown;
  suitInstagram?: unknown;
  categorie?: unknown;
  jeux?: unknown;
  reglement?: unknown;
  newsletter?: unknown;
  site?: unknown;
};

const texte = (v: unknown) => (typeof v === "string" ? v : "");

const entetes = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  "Content-Type": "application/json",
};

export async function POST(request: Request) {
  let c: Corps;
  try {
    c = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requête illisible." }, { status: 400 });
  }

  // Un robot qui remplit tout n'obtient qu'un faux numéro, et rien n'est écrit.
  if (texte(c.site).trim() !== "") {
    return NextResponse.json({ ok: true, numero: 0 });
  }

  const email = texte(c.email).trim().toLowerCase();
  const jeux = Array.isArray(c.jeux) ? c.jeux.filter((j): j is string => typeof j === "string") : [];

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/jeux_inscrire`, {
    method: "POST",
    headers: entetes,
    body: JSON.stringify({
      p_prenom: texte(c.prenom),
      p_nom: texte(c.nom),
      p_email: email,
      p_instagram: texte(c.instagram).replace(/^@+/, "").trim() || null,
      p_suit_instagram: c.suitInstagram === true,
      p_categorie: c.categorie === "F" || c.categorie === "H" ? c.categorie : null,
      p_jeux: jeux,
      p_reglement: c.reglement === true,
    }),
    cache: "no-store",
  });

  const corps = await res.json().catch(() => null);

  if (!res.ok) {
    const code = codeErreur(corps);
    if (code && ERREURS[code]) {
      return NextResponse.json({ ok: false, message: ERREURS[code] }, { status: 422 });
    }
    console.error("[jeux] inscription refusée", res.status, corps);
    return NextResponse.json(
      { ok: false, message: "L’inscription n’a pas pu être enregistrée. Montrez cet écran au stand." },
      { status: 502 },
    );
  }

  const numero = typeof corps === "number" ? corps : Number(corps);

  // Newsletter : uniquement si la case a été cochée. Un échec ici ne doit
  // jamais faire perdre l'inscription aux jeux, qui est déjà enregistrée.
  if (c.newsletter === true) {
    try {
      const jeton = randomUUID();
      const r = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_abonnes`, {
        method: "POST",
        headers: { ...entetes, Prefer: "return=minimal" },
        body: JSON.stringify({
          email,
          source: "jeux:alba-2026",
          jeton,
          dernier_envoi_le: new Date().toISOString(),
        }),
      });
      if (r.ok) await envoyerConfirmation(email, jeton);
    } catch (e) {
      console.error("[jeux] inscription newsletter en échec", e);
    }
  }

  return NextResponse.json({ ok: true, numero });
}
