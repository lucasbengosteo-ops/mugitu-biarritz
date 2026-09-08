import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { envoyerConfirmation } from "@/lib/newsletter";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase-config";

/**
 * POST /api/newsletter
 *
 * Enregistre une adresse au statut « en_attente » et lui envoie le mail de
 * confirmation. Seul un clic sur ce mail fait passer à « confirme », et seul
 * ce statut autorise un envoi : c'est le double opt-in.
 *
 * La table n'est accessible à la clé anon qu'en écriture : impossible de
 * relire la liste depuis le navigateur. On passe malgré tout par une route
 * serveur pour valider, filtrer les robots, et parce que la clé Brevo ne doit
 * jamais quitter le serveur.
 *
 * La réponse est volontairement identique dans tous les cas de succès —
 * nouvelle adresse comme adresse déjà inscrite. Distinguer les deux
 * permettrait de tester si une adresse donnée figure dans la liste.
 */

export const dynamic = "force-dynamic";

/** Assez strict pour écarter les fautes de frappe, assez large pour les vrais domaines. */
const EMAIL = /^[^\s@,;]{1,64}@[a-z0-9-]+(\.[a-z0-9-]+)*\.[a-z]{2,}$/i;

type Corps = { email?: unknown; source?: unknown; site?: unknown };

export async function POST(request: Request) {
  let corps: Corps;
  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Requête illisible." }, { status: 400 });
  }

  // Champ piège : invisible à l'écran, rempli par les robots qui remplissent tout.
  // On répond « ok » pour ne pas leur apprendre qu'ils ont été repérés.
  if (typeof corps.site === "string" && corps.site.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const email = typeof corps.email === "string" ? corps.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL.test(email)) {
    return NextResponse.json(
      { ok: false, message: "Cette adresse ne semble pas valide." },
      { status: 422 },
    );
  }

  const source =
    typeof corps.source === "string" && corps.source.length <= 80 ? corps.source : null;

  // Le jeton est tiré ici pour être connu du serveur : la clé anon n'a pas le
  // droit de relire la ligne qu'elle vient d'écrire.
  const jeton = randomUUID();

  const res = await fetch(`${SUPABASE_URL}/rest/v1/newsletter_abonnes`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ email, source, jeton, dernier_envoi_le: new Date().toISOString() }),
  });

  if (res.ok) {
    await envoyerConfirmation(email, jeton);
    return NextResponse.json({ ok: true });
  }

  const detail = await res.text();

  // 23505 = l'adresse est déjà dans la liste. On ne renvoie pas le mail de
  // confirmation : le faire supposerait de relire le jeton de la ligne, or la
  // clé publique est la seule dont dispose cette route. Une fonction qui
  // rendrait ce jeton à qui présente une adresse permettrait à n'importe qui
  // de désinscrire quelqu'un, ou de tester si une adresse est inscrite.
  // Le renvoi reviendra avec une clé de service. En attendant, réponse
  // identique au cas nominal — sinon le formulaire devient un révélateur.
  if (detail.includes("23505")) {
    return NextResponse.json({ ok: true });
  }

  console.error("[newsletter] écriture refusée", res.status, detail);
  return NextResponse.json(
    { ok: false, message: "L’inscription n’a pas pu être enregistrée. Réessayez plus tard." },
    { status: 502 },
  );
}
