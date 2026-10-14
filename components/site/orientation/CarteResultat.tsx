"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarCheck } from "lucide-react";
import type { Carte } from "@/lib/orientation/types";
import { noterClic } from "./envoi";

/**
 * Une carte du résultat : le métier, pourquoi, ses praticiens avec leur
 * lien de réservation, puis ce qui peut être proposé après examen et les
 * pages utiles. Chaque lien note un clic sans retarder la navigation.
 */
export default function CarteResultat({ carte, parcours }: { carte: Carte; parcours: string | null }) {
  const page = (lien: string) => () => noterClic(parcours, "page", lien);
  const autres = [...carte.pages, ...carte.klub];
  return (
    <article className="po-carte">
      <h4 className="po-carte-titre">
        <Link href={carte.lien} onClick={page(carte.lien)}>
          {carte.titre}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </h4>
      <p className="po-carte-pourquoi">{carte.pourquoi}</p>

      <ul className="po-praticiens">
        {carte.praticiens.map((p) => (
          <li key={p.slug} className="po-praticien">
            <Image
              src={p.photo}
              alt=""
              width={56}
              height={56}
              sizes="56px"
              className="po-photo"
              style={{ objectPosition: p.objectPosition }}
            />
            <div className="po-praticien-texte">
              <Link href={p.fiche} className="po-praticien-nom" onClick={page(p.fiche)}>
                {p.nom}
              </Link>
              <span className="po-praticien-role">{p.role}</span>
            </div>
            <a
              href={p.reservation}
              target="_blank"
              rel="noopener noreferrer"
              className="po-rdv"
              onClick={() => noterClic(parcours, "reservation", p.slug)}
            >
              <CalendarCheck aria-hidden="true" size={18} />
              Prendre rendez-vous<span className="po-sr"> avec {p.nom} (nouvel onglet)</span>
            </a>
          </li>
        ))}
      </ul>

      {carte.methodes.length > 0 && (
        <div className="po-bloc">
          <h5 className="po-bloc-titre">Ce qui peut vous être proposé après examen</h5>
          <ul className="po-liens">
            {carte.methodes.map((m) => (
              <li key={m.slug}>
                <Link href={m.lien} onClick={page(m.lien)}>
                  {m.titre}
                </Link>
                {m.acteMedical ? <span className="po-mention"> · à décider avec le médecin du sport</span> : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {autres.length > 0 && (
        <div className="po-bloc">
          <h5 className="po-bloc-titre">Pour en savoir plus</h5>
          <ul className="po-liens">
            {autres.map((l) => (
              <li key={l.lien}>
                <Link href={l.lien} onClick={page(l.lien)}>
                  {l.titre}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
