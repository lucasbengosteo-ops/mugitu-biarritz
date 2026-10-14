import { presenceEnIcs } from "@/lib/agenda/calendrier";
import { dateDuJour, decalerSemaine, lundiDe } from "@/lib/agenda/semaine";
import type { Absence, Exception, Voeu } from "@/lib/agenda/types";
import { restService } from "@/lib/supabase-service";

/**
 * GET /api/agenda/calendrier/<jeton>.ics
 *
 * Le fichier calendrier de la présence d'une personne au cabinet, pour
 * l'abonnement de son agenda (spec admin UI § 2). Appelée sans session par
 * Google Agenda, l'iPhone ou Outlook : le jeton secret tient lieu de
 * connexion. On lit donc avec la clé de service, et on ne renvoie que la
 * présence de la personne du jeton — ni noms, ni cases des autres.
 *
 * Un jeton mal formé ou inconnu reçoit le même 404 nu : rien ne distingue
 * un jeton révoqué d'un jeton qui n'a jamais existé.
 */

export const dynamic = "force-dynamic";

const SEMAINES = 8;
const JETON = /^[0-9a-f]{64}$/;

const introuvable = () => new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
const indisponible = () => new Response(null, { status: 503, headers: { "Cache-Control": "no-store" } });

/** La date du jour à Paris, `AAAA-MM-JJ` : le serveur tourne en UTC. */
function aujourdhuiAParis(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

export async function GET(_request: Request, { params }: { params: Promise<{ jeton: string }> }) {
  const { jeton: brut } = await params;
  const jeton = brut.replace(/\.ics$/, "");
  if (!JETON.test(jeton)) return introuvable();

  try {
    const proprietaire = await restService<{ user_id: string }[]>(
      `agenda_calendrier_jetons?select=user_id&jeton=eq.${jeton}&limit=1`,
    );
    if (!proprietaire.ok) {
      console.error("[agenda] calendrier : lecture du jeton refusée", proprietaire.status);
      return indisponible();
    }
    const userId = proprietaire.data[0]?.user_id;
    if (!userId) return introuvable();

    const depuis = aujourdhuiAParis();
    const debut = lundiDe(depuis);
    const fin = dateDuJour(decalerSemaine(debut, SEMAINES - 1), 7);
    const moi = encodeURIComponent(userId);

    // Ses vœux qui tiennent une case ; les exceptions de la période, toutes
    // personnes confondues, parce qu'une case qu'on lui a prise ce jour-là
    // porte le nom d'un autre ; ses seules absences.
    const [voeux, exceptions, absences] = await Promise.all([
      restService<Voeu[]>(
        `agenda_voeux?select=id,user_id,salle,jour,moment,statut&user_id=eq.${moi}&statut=in.(valide,retrait_demande)`,
      ),
      restService<Exception[]>(
        `agenda_exceptions?select=id,jour,salle,moment,user_id&jour=gte.${debut}&jour=lte.${fin}`,
      ),
      restService<Absence[]>(
        `agenda_absences?select=id,user_id,du,au&user_id=eq.${moi}&du=lte.${fin}&au=gte.${debut}`,
      ),
    ]);
    if (!voeux.ok || !exceptions.ok || !absences.ok) {
      console.error("[agenda] calendrier : lecture de l'agenda refusée");
      return indisponible();
    }

    const texte = presenceEnIcs({
      userId,
      voeux: voeux.data,
      exceptions: exceptions.data,
      absences: absences.data,
      depuis,
      semaines: SEMAINES,
    });
    return new Response(texte, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Cache-Control": "private, max-age=900",
        "Content-Disposition": 'inline; filename="mugitu.ics"',
      },
    });
  } catch (e) {
    console.error("[agenda] calendrier : base injoignable", e instanceof Error ? e.message : e);
    return indisponible();
  }
}
