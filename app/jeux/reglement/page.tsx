import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { JEUX } from "@/lib/jeux";
import { EXTERNAL, ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Règlement des jeux du Mugitu Hub",
  robots: { index: false, follow: true },
};

const H2: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: "var(--h2-s)",
  fontWeight: 700,
  letterSpacing: "-.015em",
  color: "#003850",
};

const P: React.CSSProperties = {
  margin: "0 0 14px",
  fontSize: 16,
  lineHeight: 1.75,
  color: "rgba(51,51,52,.8)",
  textWrap: "pretty",
};

function Article({ n, titre, children }: { n: number; titre: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "clamp(30px,4vw,40px)" }}>
      <h2 style={H2}>
        Article {n} — {titre}
      </h2>
      {children}
    </section>
  );
}

/**
 * Règlement des jeux. Les épreuves et leur mode de classement viennent de
 * `lib/jeux.ts`, la même source que le formulaire et l'outil du stand : ce qui
 * est écrit ici est ce qui est calculé.
 */
export default function ReglementJeuxPage() {
  return (
    <>
      <SiteHeader />
      <main className="mg-main" style={{ background: "#FDF8F4" }}>
        <PageHero
          trail={[
            { label: "Accueil", href: "/" },
            { label: "Les jeux du stand", href: ROUTES.jeux },
          ]}
          crumb="Règlement"
          eyebrow="Alba Deep Fitness Race · 12 et 13 septembre 2026"
          title="Règlement des jeux du Mugitu Hub"
          lead=""
          cta={ROUTES.jeux}
          ctaLabel="S’inscrire aux jeux"
          size="m"
        />

        <div style={{ maxWidth: 760, margin: "0 auto", padding: "var(--sect-base) clamp(20px,5vw,40px) var(--sect-ample)" }}>
          <Article n={1} titre="Organisateur">
            <p style={P}>
              Les jeux sont organisés par la SCM Mugitu Biarritz, société civile de moyens au capital variable de 1&nbsp;000&nbsp;€,
              exerçant sous le nom commercial Mugitu — la maison du mouvement, dont le siège est situé 3 avenue Kléber, 64200
              Biarritz, immatriculée au Registre national des entreprises sous le numéro SIREN 105&nbsp;281&nbsp;638.
            </p>
            <p style={P}>Ils se tiennent sur son stand de la Recovery Area de l’Alba Deep Fitness Race.</p>
          </Article>

          <Article n={2} titre="Dates et lieu">
            <p style={P}>
              Les jeux se déroulent le samedi 12 septembre 2026 de 9 h 30 à 18 h 30 et le dimanche 13 septembre 2026 de 10 h à
              14 h 45 environ, au Mugitu Hub, à l’étage intermédiaire de la Halle d’Iraty, parc d’exposition de Biarritz.
            </p>
          </Article>

          <Article n={3} titre="Participation">
            <p style={P}>
              La participation est gratuite, sans obligation d’achat, et ouverte à tous les visiteurs de l’événement, athlètes ou
              non. Les mineurs participent avec l’accord de leur représentant légal.
            </p>
            <p style={P}>
              L’inscription se fait sur la page des jeux, en indiquant son prénom, son nom et une adresse e-mail valide. Chaque
              participant reçoit un numéro personnel, à présenter au stand avant chaque épreuve. Une seule inscription par
              personne : une réinscription avec la même adresse conserve le même numéro.
            </p>
            <p style={P}>
              La participation suppose de suivre le compte Instagram @mugitu_biarritz. Cette condition est déclarée par le
              participant lors de l’inscription.
            </p>
          </Article>

          <Article n={4} titre="Les épreuves et le classement">
            {JEUX.map((j) => (
              <p key={j.id} style={P}>
                <strong style={{ color: "#003850" }}>
                  {j.nom} ({j.outil})
                </strong>{" "}
                — {j.regle}
              </p>
            ))}
            <p style={P}>
              Chaque participant peut tenter plusieurs essais par épreuve. Seul son meilleur essai est retenu. En cas d’égalité,
              le participant qui a réalisé le score le premier est classé devant.
            </p>
            <p style={P}>Les mesures sont réalisées et saisies par l’équipe Mugitu présente sur le stand.</p>
          </Article>

          <Article n={5} titre="Sécurité">
            <p style={P}>
              Les épreuves demandent un effort maximal ou rapide. Toute personne présentant une blessure, une douleur ou une
              contre-indication à l’effort doit le signaler à l’équipe avant l’épreuve ; l’équipe peut refuser une participation
              pour raison de sécurité.
            </p>
            <p style={P}>
              Les mesures réalisées dans le cadre des jeux ne constituent ni un bilan ni un avis médical.
            </p>
          </Article>

          <Article n={6} titre="Lots et gagnants">
            <p style={P}>
              Des goodies Mugitu sont distribués pendant les deux jours. Les meilleurs de chaque classement remportent un lot, dont
              la liste est affichée sur le stand : une heure de massage récupération, une séance d’ostéopathie ou un bilan
              nutrition, entre autres.
            </p>
            <p style={P}>
              Une partie des lots est attribuée par <strong>tirage au sort</strong> parmi les participants inscrits, réalisé sur le
              stand pendant les deux jours. Sauf mention contraire au moment du tirage, seuls les participants ayant réalisé au
              moins une épreuve y sont éligibles, et un même participant ne peut gagner qu’un seul lot tiré au sort. Le tirage est
              effectué de façon aléatoire par l’outil de l’organisateur, et chaque tirage est enregistré.
            </p>
            <p style={P}>
              Les classements sont arrêtés le dimanche 13 septembre en début d’après-midi. Les gagnants sont prévenus sur place ou
              par e-mail. Un lot non réclamé dans les quinze jours suivant l’événement est attribué au participant suivant du
              classement. Les lots ne sont ni échangeables ni convertibles en argent.
            </p>
          </Article>

          <Article n={7} titre="Données personnelles">
            <p style={P}>
              Les informations collectées — prénom, nom, adresse e-mail, pseudo Instagram s’il est indiqué, jeux choisis et
              scores — servent uniquement à organiser les jeux et à contacter les gagnants. Elles sont supprimées au plus tard un
              mois après l’événement.
            </p>
            <p style={P}>
              Les classements affichés au stand ne montrent que le prénom et l’initiale du nom. L’adresse e-mail n’est pas visible
              de l’équipe du stand.
            </p>
            <p style={P}>
              La participation aux jeux n’inscrit à aucune liste de diffusion. L’inscription à la lettre Mugitu est une case
              distincte, facultative, décochée par défaut.
            </p>
            <p style={P}>
              Vous pouvez accéder à vos données, les faire rectifier ou supprimer en écrivant à{" "}
              <a href={`mailto:${EXTERNAL.email}`} style={{ color: "#04A49B", fontWeight: 600 }}>
                {EXTERNAL.email}
              </a>
              .
            </p>
          </Article>

          <Article n={8} titre="Acceptation">
            <p style={P}>La participation aux jeux vaut acceptation du présent règlement.</p>
          </Article>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
