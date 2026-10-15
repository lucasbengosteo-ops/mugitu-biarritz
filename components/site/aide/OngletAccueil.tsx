"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, ChevronRight, Compass, MapPin, Phone } from "lucide-react";
import type { ArticleAide } from "@/lib/aide/types";
import { ROUTES } from "@/lib/routes";
import { TEAM } from "@/lib/team";

/** Quelques visages de l'équipe, pour dire qui répond. */
const VISAGES = TEAM.slice(0, 3);

export default function OngletAccueil({
  articles,
  onOrienter,
  onOuvrirFaq,
  onVoirArticles,
}: {
  /** Les articles chargés, null pendant le chargement, « erreur » si le service ne répond pas. */
  articles: ArticleAide[] | null | "erreur";
  onOrienter: () => void;
  onOuvrirFaq: (a: ArticleAide) => void;
  onVoirArticles: () => void;
}) {
  const faq = Array.isArray(articles) ? articles.filter((a) => a.rubrique === "faq").slice(0, 3) : [];

  return (
    <div className="wa-accueil">
      <div className="wa-accueil-haut">
        <div className="wa-visages" aria-hidden="true">
          {VISAGES.map((p) => (
            <Image
              key={p.slug}
              src={p.photo}
              alt=""
              width={36}
              height={36}
              sizes="36px"
              className="wa-visage"
              style={{ objectPosition: p.objectPosition }}
            />
          ))}
        </div>
        <p className="wa-accueil-titre">Bonjour, comment pouvons-nous vous aider&nbsp;?</p>
        <p className="wa-accueil-sous-titre">L’équipe Mugitu, 3 avenue Kléber, Biarritz</p>
      </div>

      <div className="wa-accueil-corps">
        <ul className="wa-raccourcis">
          <li>
            <button type="button" className="wa-raccourci" onClick={onOrienter}>
              <span className="wa-raccourci-icone" aria-hidden="true">
                <Compass size={20} strokeWidth={1.75} />
              </span>
              <span className="wa-raccourci-texte">
                Trouver qui consulter
                <span className="wa-raccourci-detail">Quelques questions, et le bon praticien</span>
              </span>
              <ChevronRight className="wa-chevron" aria-hidden="true" size={18} />
            </button>
          </li>
          <li>
            <Link href={ROUTES.team} className="wa-raccourci">
              <span className="wa-raccourci-icone" aria-hidden="true">
                <CalendarCheck size={20} strokeWidth={1.75} />
              </span>
              <span className="wa-raccourci-texte">
                Prendre rendez-vous
                <span className="wa-raccourci-detail">Chaque praticien et son lien de réservation</span>
              </span>
              <ChevronRight className="wa-chevron" aria-hidden="true" size={18} />
            </Link>
          </li>
          <li>
            <Link href={ROUTES.zone} className="wa-raccourci">
              <span className="wa-raccourci-icone" aria-hidden="true">
                <MapPin size={20} strokeWidth={1.75} />
              </span>
              <span className="wa-raccourci-texte">
                Venir au cabinet
                <span className="wa-raccourci-detail">3 avenue Kléber, Biarritz</span>
              </span>
              <ChevronRight className="wa-chevron" aria-hidden="true" size={18} />
            </Link>
          </li>
        </ul>

        <section className="wa-bloc" aria-labelledby="wa-faq-titre">
          <h3 id="wa-faq-titre" className="wa-bloc-titre">
            Questions fréquentes
          </h3>
          {articles === null && <p className="wa-discret">Chargement…</p>}
          {articles === "erreur" && <p className="wa-discret">Les questions ne sont pas disponibles pour le moment.</p>}
          {faq.length > 0 && (
            <ul className="wa-rangs">
              {faq.map((a) => (
                <li key={a.lien + a.titre}>
                  <button type="button" className="wa-rang" onClick={() => onOuvrirFaq(a)}>
                    <span>{a.titre}</span>
                    <ChevronRight className="wa-chevron" aria-hidden="true" size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          {Array.isArray(articles) && (
            <button type="button" className="wa-lien-bouton" onClick={onVoirArticles}>
              Toutes les réponses
            </button>
          )}
        </section>

        <p className="wa-urgence">
          <Phone aria-hidden="true" size={15} />
          <span>
            Une urgence&nbsp;? Appelez le <a href="tel:15">15</a> ou le <a href="tel:112">112</a>.
          </span>
        </p>
      </div>
    </div>
  );
}
