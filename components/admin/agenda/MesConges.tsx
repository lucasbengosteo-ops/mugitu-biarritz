"use client";

import { useState } from "react";
import { Bouton, Carte, Champ } from "@/components/admin/ui";
import type { Absence, Personne } from "@/lib/agenda/types";

/**
 * Les absences : une liste de plages, qu'on ajoute et qu'on retire.
 *
 * Aucune validation à demander : on ne demande pas la permission de prendre
 * ses congés. Les gérants sont prévenus par un mail, posé par un
 * déclencheur en base — cet écran n'a donc rien à envoyer.
 *
 * Une absence ne se modifie pas : on la retire et on la repose. C'est ce
 * que dit la base, qui n'a aucune politique d'`update`.
 */
export default function MesConges({
  absences,
  personnes,
  moi,
  estGerant,
  onAjouter,
  onRetirer,
}: {
  absences: Absence[];
  personnes: Record<string, Personne>;
  moi: string;
  estGerant: boolean;
  onAjouter: (du: string, au: string, motif: string) => Promise<boolean>;
  onRetirer: (id: string) => Promise<boolean>;
}) {
  const [du, setDu] = useState("");
  const [au, setAu] = useState("");
  const [motif, setMotif] = useState("");
  const [occupe, setOccupe] = useState(false);

  const miennes = absences.filter((a) => a.user_id === moi);
  const autres = absences.filter((a) => a.user_id !== moi);

  const ajouter = async () => {
    setOccupe(true);
    const ok = await onAjouter(du, au || du, motif);
    setOccupe(false);
    if (ok) {
      setDu("");
      setAu("");
      setMotif("");
    }
  };

  const retirer = async (id: string) => {
    setOccupe(true);
    await onRetirer(id);
    setOccupe(false);
  };

  const valide = du.length === 10 && (au.length === 0 || au >= du);

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <p className="ad-agenda-texte" style={{ margin: 0 }}>
        Déclarez vos congés, formations et arrêts. Rien à faire valider : la grille du cabinet vous affichera en congé
        sur les semaines concernées, et Lucas et Jean-Baptiste sont prévenus.
      </p>

      <Carte titre="Déclarer une absence">
        <div className="ad-agenda-formulaire">
          <Champ label="Du">
            <input type="date" value={du} onChange={(e) => setDu(e.target.value)} />
          </Champ>
          <Champ label="Au" aide="Vide : un seul jour.">
            <input type="date" value={au} min={du || undefined} onChange={(e) => setAu(e.target.value)} />
          </Champ>
          <Champ label="Motif (facultatif)">
            <input type="text" value={motif} onChange={(e) => setMotif(e.target.value)} />
          </Champ>
          <div className="ad-agenda-formulaire-action">
            <Bouton disabled={!valide} enCours={occupe} onClick={() => void ajouter()}>
              Ajouter
            </Bouton>
          </div>
        </div>
      </Carte>

      <Carte titre="Mes absences">
        {miennes.length === 0 ? (
          <p className="ad-agenda-texte" style={{ margin: 0 }}>
            Aucune absence déclarée.
          </p>
        ) : (
          <ul className="ad-agenda-liste">
            {miennes.map((a) => (
              <Ligne key={a.id} absence={a} nom={null} occupe={occupe} onRetirer={() => retirer(a.id)} />
            ))}
          </ul>
        )}
      </Carte>

      <Carte titre="Le reste de l’équipe">
        {autres.length === 0 ? (
          <p className="ad-agenda-texte" style={{ margin: 0 }}>
            Personne d’autre n’a déclaré d’absence.
          </p>
        ) : (
          <ul className="ad-agenda-liste">
            {autres.map((a) => (
              <Ligne
                key={a.id}
                absence={a}
                nom={personnes[a.user_id]?.nom ?? "—"}
                occupe={occupe}
                onRetirer={estGerant ? () => retirer(a.id) : null}
              />
            ))}
          </ul>
        )}
      </Carte>
    </div>
  );
}

function Ligne({
  absence,
  nom,
  occupe,
  onRetirer,
}: {
  absence: Absence;
  nom: string | null;
  occupe: boolean;
  onRetirer: (() => Promise<void>) | null;
}) {
  return (
    <li className="ad-agenda-ligne-liste">
      <span style={{ minWidth: 0 }}>
        {nom ? <strong style={{ marginRight: 6 }}>{nom}</strong> : null}
        {periode(absence)}
        {absence.motif ? <span className="ad-agenda-mention"> · {absence.motif}</span> : null}
      </span>
      {onRetirer ? (
        <Bouton
          variante="discret"
          taille="petite"
          disabled={occupe}
          aria-label={`Retirer l’absence ${nom ? `de ${nom} ` : ""}${periode(absence)}`}
          onClick={() => void onRetirer()}
        >
          Retirer
        </Bouton>
      ) : null}
    </li>
  );
}

function periode(a: Absence): string {
  if (a.du === a.au) return `le ${jour(a.du)}`;
  return `du ${jour(a.du)} au ${jour(a.au)}`;
}

function jour(iso: string): string {
  const [an, mois, j] = iso.split("-");
  return `${Number(j)}/${mois}/${an}`;
}
