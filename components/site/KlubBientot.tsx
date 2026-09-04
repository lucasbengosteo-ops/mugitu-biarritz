import Link from "next/link";
import { ROUTES } from "@/lib/routes";
import { KLUB_TYPES } from "@/lib/klub-events";

/**
 * Voile « bientôt » posé sur le Mugi Klub : le programme existe déjà en base
 * et se laisse deviner en arrière-plan, mais rien n'y est encore réservable.
 *
 * Deux précautions plutôt qu'un simple flou décoratif :
 * — le contenu masqué est marqué `inert`, sinon on tabule dans des liens
 *   invisibles et le lecteur d'écran annonce un planning qui n'existe pas ;
 * — le voile est en `sticky` et non en `fixed`, pour que l'en-tête et le pied
 *   de page restent atteignables : on annonce une ouverture, on n'enferme pas
 *   le visiteur.
 */

const ATTENDU: Record<string, string> = {
  small: "Des séances en petit groupe, encadrées par un praticien du cabinet : renforcement, mobilité, run club.",
  atelier: "Des ateliers pratiques pour repartir avec quelque chose à appliquer : prévention, taping, analyse de foulée.",
  conf: "Des conférences ouvertes sur le sport-santé — nutrition, sommeil, récupération.",
  soiree: "Des rendez-vous plus informels : afterworks, sauna, moments de communauté.",
};

const COULEUR: Record<string, string> = {
  small: "#04A49B",
  atelier: "#d49a40",
  conf: "#003850",
  soiree: "#EE806C",
};

export default function KlubBientot({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "relative" }}>
      {/* `inert` retire tout l'arrière-plan du parcours clavier et de
          l'arbre d'accessibilité — le flou seul ne fait que le cacher. */}
      <div inert style={{ filter: "blur(7px)", userSelect: "none" }} aria-hidden="true">
        {children}
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg,rgba(253,248,244,.86),rgba(253,248,244,.94))",
          padding: "0 clamp(16px,5vw,40px)",
        }}
      >
        {/* Le voile occupe toute la hauteur visible et centre l'encart dedans :
            l'annonce reste au milieu de l'écran pendant qu'on parcourt le
            planning flouté, au lieu d'être accrochée sous le hero. */}
        <div
          style={{
            position: "sticky",
            // Décalé de la hauteur de l'en-tête fixe, sinon l'encart passe
            // par-dessus le logo. `svh` et non `vh` : sur mobile, `vh` ignore
            // la barre d'adresse et déborde toujours du bas.
            top: 84,
            minHeight: "calc(100svh - 84px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
        <div
          style={{
            maxWidth: 620,
            background: "#fff",
            borderRadius: "var(--r-xl)",
            boxShadow: "0 18px 60px rgba(0,56,80,.16)",
            border: "1px solid rgba(0,56,80,.08)",
            padding: "clamp(20px,4vw,40px)",
          }}
        >
          <p
            style={{
              margin: "0 0 14px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: "var(--r-pill)",
              background: "rgba(4,164,155,.1)",
              color: "#04A49B",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "var(--ls-label)",
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#04A49B" }} />
            Ouverture prochaine
          </p>

          <h2
            style={{
              margin: "0 0 14px",
              fontSize: "var(--h2-m)",
              fontWeight: 700,
              letterSpacing: "-.025em",
              lineHeight: 1.1,
              color: "#003850",
              textWrap: "balance",
            }}
          >
            Le Mugi Klub arrive bientôt
          </h2>

          <p style={{ margin: "0 0 18px", fontSize: 15, lineHeight: 1.6, color: "rgba(51,51,52,.72)" }}>
            Le programme que vous devinez derrière ce voile est en préparation.{" "}
            <strong style={{ color: "#003850", fontWeight: 600 }}>
              Les séances ne sont pas encore réservables
            </strong>{" "}
            : les créneaux affichés sont une projection de ce que sera une semaine type.
          </p>

          <p
            style={{
              margin: "0 0 12px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "var(--ls-label)",
              textTransform: "uppercase",
              color: "rgba(51,51,52,.45)",
            }}
          >
            Ce qu’on y trouvera
          </p>

          <ul style={{ margin: "0 0 20px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 9 }}>
            {KLUB_TYPES.map((t) => (
              <li key={t.value} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span
                  aria-hidden="true"
                  style={{
                    flex: "0 0 auto",
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: COULEUR[t.value],
                    marginTop: 7,
                  }}
                />
                <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "rgba(51,51,52,.72)" }}>
                  <strong style={{ color: "#003850", fontWeight: 600 }}>{t.label}</strong> — {ATTENDU[t.value]}
                </span>
              </li>
            ))}
          </ul>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            <Link
              href={ROUTES.contact}
              className="mg-cta-teal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                borderRadius: "var(--r-pill)",
                background: "#04A49B",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Être prévenu de l’ouverture <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href={ROUTES.team}
              className="mg-cta-ghost"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "13px 22px",
                borderRadius: "var(--r-pill)",
                border: "1px solid rgba(0,56,80,.18)",
                color: "#003850",
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
