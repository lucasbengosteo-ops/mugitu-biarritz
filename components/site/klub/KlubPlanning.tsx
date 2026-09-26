import { preparerPlanning } from "@/lib/klub/planning";
import type { SeancePublique } from "@/lib/klub/types";
import KlubALaUne from "./KlubALaUne";
import KlubListe from "./KlubListe";

/**
 * Le planning des quatre semaines à venir : une séance à la une, puis la
 * liste groupée par jour. Préparé côté serveur ; seuls les filtres tournent
 * dans le navigateur.
 */
export default function KlubPlanning({ seances, maintenant }: { seances: SeancePublique[]; maintenant: string }) {
  const p = preparerPlanning(seances, maintenant);

  return (
    <section id="planning" style={{ padding: "var(--sect-base) clamp(16px,4vw,48px)", maxWidth: 1080, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 clamp(24px,4vw,40px)", fontSize: "var(--h2-l)", fontWeight: 700, letterSpacing: "-.025em", color: "#003850" }}>
        Le planning
      </h2>

      {p.aLaUne === null ? (
        <p style={{ margin: 0, fontSize: 15.5, color: "rgba(51,51,52,.65)" }}>
          Aucune séance programmée pour l’instant. Revenez bientôt.
        </p>
      ) : (
        <>
          <KlubALaUne seance={p.aLaUne} maintenant={maintenant} />
          <KlubListe jours={p.jours} types={p.types} afficherFiltres={p.afficherFiltres} maintenant={maintenant} />
        </>
      )}
    </section>
  );
}
