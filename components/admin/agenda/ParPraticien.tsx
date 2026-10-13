"use client";

import { Repeat } from "lucide-react";
import { Badge, Carte } from "@/components/admin/ui";
import { compteurParPersonne } from "@/lib/agenda/grille";
import { JOURS, MOMENTS, nomSalle } from "@/lib/agenda/salles";
import { dateDuJour } from "@/lib/agenda/semaine";
import type { Absence, Exception, Personne, Voeu } from "@/lib/agenda/types";
import { numeroJour, semaineDePersonne, type JourPersonne } from "@/lib/agenda/vues";
import { dateCourte, dateLongue, nomDe, teinteDe, type Couleur } from "./cases";
import NavSemaine from "./NavSemaine";
import Pastille from "./Pastille";

/**
 * « Par praticien » : la semaine de chacun.
 *
 * Ordinateur : un tableau, une personne par ligne (matin au-dessus,
 * après-midi dessous), les sept jours en colonnes, la salle dans chaque
 * case. Téléphone : une carte par personne, la liste des jours où elle
 * vient. La semaine est la même que dans l'onglet « Semaine ».
 */

type Ligne = { id: string; nom: string; jours: JourPersonne[]; voeux: number };

export default function ParPraticien({
  aujourdhui,
  lundi,
  lundiCourant,
  onLundi,
  voeux,
  exceptions,
  absences,
  personnes,
  teintes,
}: {
  aujourdhui: string;
  lundi: string;
  lundiCourant: string;
  onLundi: (lundi: string) => void;
  voeux: Voeu[];
  exceptions: Exception[];
  absences: Absence[];
  personnes: Record<string, Personne>;
  teintes: Record<string, Couleur>;
}) {
  const jourCourant = lundi === lundiCourant ? numeroJour(aujourdhui) : null;
  const compte = compteurParPersonne(voeux);
  const toutes: Ligne[] = Object.keys(teintes)
    .map((id) => ({
      id,
      nom: nomDe(personnes, id),
      jours: semaineDePersonne(id, voeux, exceptions, absences, lundi),
      voeux: compte[id] ?? 0,
    }))
    .sort((a, b) => a.nom.localeCompare(b.nom, "fr", { sensitivity: "base" }));
  const vient = (l: Ligne) => l.jours.some((j) => j.matin || j.aprem);
  const lignes = toutes.filter(vient);
  const sans = toutes.filter((l) => !vient(l));

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <NavSemaine lundi={lundi} lundiCourant={lundiCourant} onLundi={onLundi} />

      {lignes.length === 0 ? (
        <p className="ad-agenda-texte" style={{ margin: 0 }}>
          Personne n’a de créneau cette semaine.
        </p>
      ) : (
        <>
          <div className="ad-masque-tel">
            <div className="ad-agenda-tableau-cadre">
              <table className="ad-agenda-tableau ad-agenda-tableau--praticiens">
                <caption className="ad-agenda-sr">La semaine de chaque personne, jour par jour</caption>
                <colgroup>
                  <col className="ad-agenda-col-salle" />
                  <col className="ad-agenda-col-moment" />
                  {JOURS.map((j) => (
                    <col key={j} />
                  ))}
                </colgroup>
                <thead>
                  <tr>
                    <td colSpan={2} />
                    {JOURS.map((j, i) => {
                      const date = dateDuJour(lundi, i + 1);
                      const courant = jourCourant === i + 1;
                      return (
                        <th
                          key={j}
                          scope="col"
                          className={courant ? "ad-agenda-jour-courant" : undefined}
                          aria-label={`${dateLongue(date)}${courant ? ", aujourd’hui" : ""}`}
                        >
                          <span className="ad-agenda-entete-jour">{j}</span>
                          <span className="ad-agenda-entete-date">{courant ? "Aujourd’hui" : dateCourte(date)}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                {lignes.map((l) => (
                  <tbody key={l.id}>
                    {MOMENTS.map((m, im) => (
                      <tr key={m.id} className={im === 0 ? "ad-agenda-ligne-matin" : "ad-agenda-ligne-aprem"}>
                        {im === 0 ? (
                          <th scope="rowgroup" rowSpan={MOMENTS.length} className="ad-agenda-th-salle">
                            <span className="ad-agenda-case-qui">
                              <Pastille nom={l.nom} teinte={teinteDe(teintes, l.id)} taille="petite" muette />
                              <span className="ad-agenda-salle-nom">{l.nom}</span>
                            </span>
                          </th>
                        ) : null}
                        <th scope="row" className="ad-agenda-th-moment">
                          {m.label}
                        </th>
                        {l.jours.map((j) => {
                          const tenu = m.id === "matin" ? j.matin : j.aprem;
                          return (
                            <td key={j.jour} className={jourCourant === j.jour ? "ad-agenda-jour-courant" : undefined}>
                              <div className={`ad-agenda-cellule${tenu && j.absent ? " ad-agenda-case--conge" : ""}`}>
                                {tenu ? (
                                  <>
                                    <span className="ad-agenda-case-nom">{nomSalle(tenu.salle)}</span>
                                    {tenu.origine === "exception" || j.absent ? (
                                      <span className="ad-agenda-signes">
                                        {tenu.origine === "exception" ? (
                                          <span className="ad-agenda-signe">
                                            <Repeat aria-hidden="true" size={14} />
                                            échange
                                          </span>
                                        ) : null}
                                        {j.absent ? (
                                          <span className="ad-agenda-signe ad-agenda-signe--conge">en congé</span>
                                        ) : null}
                                      </span>
                                    ) : null}
                                  </>
                                ) : (
                                  <span className="ad-agenda-case-vide">
                                    <span aria-hidden="true">—</span>
                                    <span className="ad-agenda-sr">pas au cabinet</span>
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                ))}
              </table>
            </div>
          </div>

          <div className="ad-masque-ordi" style={{ display: "grid", gap: 12 }}>
            {lignes.map((l) => (
              <Carte
                key={l.id}
                titre={
                  <span className="ad-agenda-case-qui">
                    <Pastille nom={l.nom} teinte={teinteDe(teintes, l.id)} taille="grande" muette />
                    {l.nom}
                  </span>
                }
              >
                <ul className="ad-agenda-liste">
                  {l.jours
                    .filter((j) => j.matin || j.aprem)
                    .map((j) => (
                      <li key={j.jour} className="ad-agenda-jour-personne">
                        <span className="ad-agenda-jour-personne-date">
                          {dateLongue(j.date).replace(/^./, (c) => c.toUpperCase())}
                          {jourCourant === j.jour ? <span className="ad-agenda-mention"> · aujourd’hui</span> : null}
                        </span>
                        <span className="ad-agenda-jour-personne-moments">
                          <span>
                            Matin : <strong>{j.matin ? nomSalle(j.matin.salle) : "—"}</strong>
                            {j.matin?.origine === "exception" ? <Echange /> : null}
                          </span>
                          <span>
                            Après-midi : <strong>{j.aprem ? nomSalle(j.aprem.salle) : "—"}</strong>
                            {j.aprem?.origine === "exception" ? <Echange /> : null}
                          </span>
                          {j.absent ? <Badge ton="attente">en congé</Badge> : null}
                        </span>
                      </li>
                    ))}
                </ul>
                <p className="ad-agenda-mention" style={{ margin: "8px 0 0" }}>
                  {l.voeux} {l.voeux > 1 ? "demi-journées demandées ou tenues" : "demi-journée demandée ou tenue"} dans la
                  semaine type
                </p>
              </Carte>
            ))}
          </div>
        </>
      )}

      {sans.length > 0 ? (
        <p className="ad-agenda-texte" style={{ margin: 0 }}>
          <strong>Sans créneau cette semaine : </strong>
          {sans.map((l) => l.nom).join(", ")}
        </p>
      ) : null}
    </div>
  );
}

function Echange() {
  return (
    <span className="ad-agenda-signe" style={{ marginLeft: 6 }}>
      <Repeat aria-hidden="true" size={14} />
      échange
    </span>
  );
}
