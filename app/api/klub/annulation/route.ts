import { revalidatePath } from "next/cache";
import { after, NextResponse } from "next/server";
import { envoyerFile, envoyerMail } from "@/lib/klub/envoi";
import { JETON } from "@/lib/klub/validation";
import { klubSeancePath, ROUTES } from "@/lib/routes";
import { rpcService } from "@/lib/supabase-service";

/**
 * POST /api/klub/annulation
 *
 * Appelée par le bouton de la page d'annulation, jamais à l'ouverture du
 * lien : les messageries qui visitent les liens des mails n'annulent rien.
 */

export const dynamic = "force-dynamic";

type ReponseAnnulation = {
  resultat: "annulee" | "deja" | "passee" | "inconnu" | "seance_annulee";
  seance_id?: string;
  mail_id?: string;
};

export async function POST(request: Request) {
  let jeton = "";
  try {
    const corps = (await request.json()) as { jeton?: unknown };
    jeton = typeof corps.jeton === "string" ? corps.jeton : "";
  } catch {
    return NextResponse.json({ ok: false, message: "Requête illisible." }, { status: 400 });
  }
  if (!JETON.test(jeton)) return NextResponse.json({ ok: true, resultat: "inconnu" });

  let r;
  try {
    r = await rpcService<ReponseAnnulation>("klub_annuler", { p_jeton: jeton });
  } catch (e) {
    console.error("[klub] annulation : base injoignable", e);
    return NextResponse.json({ ok: false, message: "L’annulation n’a pas pu être enregistrée." }, { status: 502 });
  }
  if (!r.ok) {
    console.error("[klub] annulation refusée", r.status, r.corps);
    return NextResponse.json({ ok: false, message: "L’annulation n’a pas pu être enregistrée." }, { status: 502 });
  }

  const { resultat, seance_id, mail_id } = r.data;
  if (resultat === "annulee") {
    after(async () => {
      if (mail_id) await envoyerMail(mail_id);
      // Une place libérée a peut-être promu quelqu'un : son mail part tout de suite.
      await envoyerFile(20);
    });
    revalidatePath(ROUTES.klub);
    if (seance_id) revalidatePath(klubSeancePath(seance_id));
  }
  return NextResponse.json({ ok: true, resultat });
}
