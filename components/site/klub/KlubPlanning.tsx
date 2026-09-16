import { cleJour, dateLongue, type Semaine } from "@/lib/klub/format";
import type { SeancePublique } from "@/lib/klub/types";
import KlubCarte from "./KlubCarte";
import KlubSemaines from "./KlubSemaines";

/**
 * Planning des quatre semaines à venir. Rendu côté serveur ; seule la
 * navigation entre semaines tourne dans le navigateur.
 */
export default function KlubPlanning({
  seances,
  semaines,
  maintenant,
}: {
  seances: SeancePublique[];
  semaines: Semaine[];
  maintenant: string;
}) {
  const panneaux = semaines.map((semaine) => {
    const parJour = new Map<string, SeancePublique[]>();
    for (const s of seances) {
      const cle = cleJour(s.debut);
      if (cle < semaine.debut || cle > semaine.fin) continue;
      parJour.set(cle, [...(parJour.get(cle) ?? []), s]);
    }
    const jours = [...parJour.keys()].sort();

    if (jours.length === 0) {
      return (
        <p key={semaine.debut} style={{ margin: 0, padding: "28px 0", fontSize: 15, color: "rgba(51,51,52,.6)" }}>
          Aucune séance programmée cette semaine pour l’instant.
        </p>
      );
    }

    return (
      <div
        key={semaine.debut}
        style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, alignItems: "start" }}
      >
        {jours.map((cle) => {
          const libelle = dateLongue(`${cle}T12:00:00Z`);
          return (
            <div key={cle} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <p
                style={{
                  margin: 0,
                  padding: "0 4px 10px",
                  borderBottom: "2px solid rgba(0,56,80,.1)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#003850",
                }}
              >
                {libelle.charAt(0).toUpperCase() + libelle.slice(1)}
              </p>
              {parJour.get(cle)?.map((s) => <KlubCarte key={s.id} seance={s} maintenant={maintenant} />)}
            </div>
          );
        })}
      </div>
    );
  });

  return (
    <section id="planning" style={{ padding: "var(--sect-base) clamp(16px,4vw,48px)", maxWidth: 1320, margin: "0 auto" }}>
      <p style={{ margin: "0 0 10px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
        Les quatre prochaines semaines
      </p>
      <h2 style={{ margin: "0 0 12px", fontSize: "var(--h2-l)", fontWeight: 700, letterSpacing: "-.025em", color: "#003850" }}>
        Le planning
      </h2>
      <p style={{ margin: "0 0 28px", fontSize: 15, lineHeight: 1.6, color: "rgba(51,51,52,.7)" }}>
        Choisissez une séance pour vous inscrire. Le paiement se fait sur place.
      </p>
      <KlubSemaines libelles={semaines.map((s) => s.libelle)} panneaux={panneaux} />
    </section>
  );
}
