"use client";

import { Repeat } from "lucide-react";
import { Badge, Carte } from "@/components/admin/ui";
import { MOMENTS, SALLES, nomSalle } from "@/lib/agenda/salles";
import type { Absence, Exception, Personne, Voeu } from "@/lib/agenda/types";
import { numeroJour, presenceDuJour } from "@/lib/agenda/vues";
import { dateLongue, lendemain, nomDe, teinteDe, type Couleur } from "./cases";
import Pastille from "./Pastille";

/**
 * « Aujourd'hui » : qui est au cabinet aujourd'hui puis demain, matin et
 * après-midi, salle par salle ; puis qui est en congé. L'onglet d'ouverture.
 *
 * Une salle tenue s'ouvre sur son détail (fil, échange, retrait), comme
 * dans la semaine.
 */
export default function Aujourdhui({
  aujourdhui,
  voeux,
  exceptions,
  absences,
  personnes,
  teintes,
  onOuvrir,
}: {
  /** La date du jour à Paris, `AAAA-MM-JJ`. */
  aujourdhui: string;
  voeux: Voeu[];
  exceptions: Exception[];
  absences: Absence[];
  personnes: Record<string, Personne>;
  teintes: Record<string, Couleur>;
  onOuvrir: (salle: string, jour: number, moment: string) => void;
}) {
  const demain = lendemain(aujourdhui);
  const jours = [
    { date: aujourdhui, titre: `Aujourd’hui · ${dateLongue(aujourdhui)}` },
    { date: demain, titre: `Demain · ${dateLongue(demain)}` },
  ].map((j) => ({ ...j, presence: presenceDuJour(voeux, exceptions, absences, j.date) }));

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div className="ad-grille-2">
        {jours.map(({ date, titre, presence }) => (
          <Carte key={date} titre={titre}>
            {MOMENTS.map((m) => (
              <div key={m.id} className="ad-agenda-moment">
                <h3 className="ad-agenda-moment-titre">{m.label}</h3>
                <ul className="ad-agenda-liste">
                  {SALLES.map((salle) => {
                    const c = presence.cases.find((x) => x.salle === salle.id && x.moment === m.id);
                    if (!c || c.userId === null) {
                      return (
                        <li key={salle.id} className="ad-agenda-presence">
                          <span className="ad-agenda-presence-salle">{salle.nom}</span>
                          <span className="ad-agenda-mention">libre</span>
                        </li>
                      );
                    }
                    const nom = nomDe(personnes, c.userId);
                    const details = [
                      c.absent ? "en congé" : null,
                      c.origine === "exception" ? "échange ponctuel" : null,
                    ].filter(Boolean);
                    return (
                      <li key={salle.id}>
                        <button
                          type="button"
                          className="ad-agenda-presence ad-agenda-presence--tenue"
                          aria-label={`${nomSalle(salle.id)}, ${m.label.toLowerCase()} : ${nom}${
                            details.length ? `, ${details.join(", ")}` : ""
                          }. Ouvrir le détail`}
                          onClick={() => onOuvrir(salle.id, numeroJour(date), m.id)}
                        >
                          <span className="ad-agenda-presence-salle">{salle.nom}</span>
                          <span className="ad-agenda-presence-qui">
                            <Pastille nom={nom} teinte={teinteDe(teintes, c.userId)} taille="petite" muette />
                            <span className={c.absent ? "ad-agenda-barre-nom" : undefined}>{nom}</span>
                            {c.origine === "exception" ? (
                              <span className="ad-agenda-signe">
                                <Repeat aria-hidden="true" size={14} />
                                échange
                              </span>
                            ) : null}
                            {c.absent ? <Badge ton="attente">en congé</Badge> : null}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </Carte>
        ))}
      </div>

      <Carte titre="En congé">
        {jours.every((j) => j.presence.absents.length === 0) ? (
          <p className="ad-agenda-texte" style={{ margin: 0 }}>
            Personne n’est en congé aujourd’hui ni demain.
          </p>
        ) : (
          <dl className="ad-agenda-conges">
            {jours.map(({ date, presence }, i) => (
              <div key={date}>
                <dt>{i === 0 ? "Aujourd’hui" : "Demain"}</dt>
                <dd>
                  {presence.absents.length === 0 ? (
                    <span className="ad-agenda-mention">personne</span>
                  ) : (
                    presence.absents.map((id) => (
                      <span key={id} className="ad-agenda-presence-qui">
                        <Pastille nom={nomDe(personnes, id)} teinte={teinteDe(teintes, id)} taille="petite" muette />
                        {nomDe(personnes, id)}
                      </span>
                    ))
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Carte>
    </div>
  );
}
