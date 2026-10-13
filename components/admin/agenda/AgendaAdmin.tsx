"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Message, Onglets, Page, ongletId, type Onglet } from "@/components/admin/ui";
import { useAccesCourant } from "@/lib/admin/acces";
import { voeuDe } from "@/lib/agenda/grille";
import { libelleCase } from "@/lib/agenda/salles";
import { lundiDe } from "@/lib/agenda/semaine";
import type { Absence, Commentaire, Echange, Exception, Personne, Voeu } from "@/lib/agenda/types";
import { numeroJour } from "@/lib/agenda/vues";
import { supabaseBrowser } from "@/lib/supabase-browser";
import Aujourdhui from "./Aujourdhui";
import { aujourdhuiParis, teintesDeLAgenda } from "./cases";
import CaseDetail from "./CaseDetail";
import DemanderLibre from "./DemanderLibre";
import Echanges from "./Echanges";
import MesConges from "./MesConges";
import MesDemandes from "./MesDemandes";
import ParPraticien from "./ParPraticien";
import { appeler } from "./rpc";
import Semaine from "./Semaine";

/**
 * L'agenda du cabinet : qui est où, la semaine type, ses vœux et leur
 * arbitrage.
 *
 * `AgendaAdmin` charge les données et porte les gestes (mêmes tables, mêmes
 * fonctions `agenda_*` qu'avant la refonte) ; `AgendaEcran` les affiche,
 * sans accès réseau. L'onglet actif est dans l'adresse (`?vue=semaine`),
 * pour qu'un lien ouvre la bonne vue.
 */

type CaseOuverte = { salle: string; jour: number; moment: string };

export type ArgsEchange = {
  cible: string;
  offert: string | null;
  portee: "ponctuel" | "definitif";
  semaine: string | null;
  motif: string;
};

export default function AgendaAdmin() {
  const acces = useAccesCourant();
  const [voeux, setVoeux] = useState<Voeu[]>([]);
  const [personnes, setPersonnes] = useState<Record<string, Personne>>({});
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [echanges, setEchanges] = useState<Echange[]>([]);
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [occupeEchange, setOccupeEchange] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const [v, p, c, ab, ex, xc] = await Promise.all([
      sb.from("agenda_voeux").select("*"),
      // `profiles.id` est la clé propre de la table, distincte de
      // `profiles.user_id` (qui référence auth.users). agenda_voeux.user_id
      // pointe sur auth.users : l'annuaire doit donc être indexé par
      // `user_id`, pas par `id`.
      sb.from("profiles").select("user_id, first_name, last_name"),
      sb.from("agenda_commentaires").select("*").order("created_at"),
      sb.from("agenda_absences").select("*").order("du"),
      sb.from("agenda_echanges").select("*").order("created_at", { ascending: false }),
      sb.from("agenda_exceptions").select("*").order("jour"),
    ]);
    if (v.error) {
      setErreur("Impossible de charger l’agenda.");
      setChargement(false);
      return;
    }
    setVoeux((v.data ?? []) as Voeu[]);
    const annuaire: Record<string, Personne> = {};
    for (const ligne of (p.data ?? []) as { user_id: string; first_name: string | null; last_name: string | null }[]) {
      annuaire[ligne.user_id] = {
        id: ligne.user_id,
        nom: [ligne.first_name, ligne.last_name].filter(Boolean).join(" ") || "Sans nom",
      };
    }
    setPersonnes(annuaire);
    setCommentaires((c.data ?? []) as Commentaire[]);
    setAbsences((ab.data ?? []) as Absence[]);
    setEchanges((ex.data ?? []) as Echange[]);
    setExceptions((xc.data ?? []) as Exception[]);
    setErreur(null);
    setChargement(false);
  }, []);

  useEffect(() => {
    // Motif du dépôt : pas de setState synchrone dans le corps d'un effet.
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  /** Cocher ou décocher une case de sa semaine type ; une case accordée s'ouvre sur son détail. */
  const basculer = useCallback(
    async (salle: string, jour: number, moment: string, ouvrir: () => void) => {
      if (!acces.userId) return;
      setSucces(null);
      const existant = voeuDe(voeux, acces.userId, salle, jour, moment);
      const sb = supabaseBrowser();
      if (!existant) {
        const { error } = await sb
          .from("agenda_voeux")
          .insert({ user_id: acces.userId, salle, jour, moment });
        if (error) setErreur("Impossible d’ajouter ce créneau.");
      } else if (existant.statut === "propose" || existant.statut === "refuse") {
        const { error } = await sb.from("agenda_voeux").delete().eq("id", existant.id);
        if (error) setErreur("Impossible de retirer ce créneau.");
      } else {
        setErreur(
          `Ce créneau vous est accordé : passez par « demander à le rendre » dans le détail de ${libelleCase(salle, jour, moment)}.`,
        );
        ouvrir();
        return;
      }
      await charger();
    },
    [acces.userId, voeux, charger],
  );

  /** Demander une case libre : la même insertion que `basculer` pour une case sans vœu. */
  const demanderLibre = useCallback(
    async (salle: string, jour: number, moment: string) => {
      if (!acces.userId) return false;
      setSucces(null);
      const { error } = await supabaseBrowser()
        .from("agenda_voeux")
        .insert({ user_id: acces.userId, salle, jour, moment });
      if (error) {
        setErreur("Impossible d’ajouter ce créneau.");
        return false;
      }
      setErreur(null);
      setSucces(`Demande envoyée : ${libelleCase(salle, jour, moment)}. Elle attend l’accord de Lucas ou de Jean-Baptiste.`);
      await charger();
      return true;
    },
    [acces.userId, charger],
  );

  const agir = useCallback(
    async (nom: string, args: Record<string, unknown>) => {
      setSucces(null);
      const r = await appeler(nom, args);
      if (!r.ok) {
        setErreur(r.message);
        return false;
      }
      setErreur(null);
      await charger();
      return true;
    },
    [charger],
  );

  const ajouterAbsence = useCallback(
    async (du: string, au: string, motif: string) => {
      if (!acces.userId) return false;
      setSucces(null);
      const { error } = await supabaseBrowser()
        .from("agenda_absences")
        .insert({ user_id: acces.userId, du, au, motif: motif.trim() || null });
      if (error) {
        setErreur("Impossible d’enregistrer cette absence.");
        return false;
      }
      setErreur(null);
      await charger();
      return true;
    },
    [acces.userId, charger],
  );

  const retirerAbsence = useCallback(
    async (id: string) => {
      setSucces(null);
      const { error } = await supabaseBrowser().from("agenda_absences").delete().eq("id", id);
      if (error) {
        setErreur("Impossible de retirer cette absence.");
        return false;
      }
      setErreur(null);
      await charger();
      return true;
    },
    [charger],
  );

  const agirEchange = useCallback(
    async (nom: string, args: Record<string, unknown>) => {
      setSucces(null);
      setOccupeEchange(true);
      const r = await appeler(nom, args);
      setOccupeEchange(false);
      if (!r.ok) {
        setErreur(r.message);
        return false;
      }
      setErreur(null);
      await charger();
      return true;
    },
    [charger],
  );

  const proposerEchange = useCallback(
    (args: ArgsEchange) =>
      agirEchange("agenda_proposer_echange", {
        p_cible: args.cible,
        p_offert: args.offert,
        p_portee: args.portee,
        p_semaine: args.semaine,
        p_motif: args.motif,
      }),
    [agirEchange],
  );

  if (chargement) {
    return (
      <Page titre="Agenda du cabinet">
        <p className="ad-agenda-texte" role="status">
          Chargement…
        </p>
      </Page>
    );
  }

  return (
    <AgendaEcran
      voeux={voeux}
      personnes={personnes}
      commentaires={commentaires}
      absences={absences}
      echanges={echanges}
      exceptions={exceptions}
      moi={acces.userId ?? ""}
      estGerant={acces.estSuperAdmin}
      erreur={erreur}
      succes={succes}
      occupeEchange={occupeEchange}
      onBasculer={basculer}
      onDemanderLibre={demanderLibre}
      onAgir={agir}
      onProposerEchange={proposerEchange}
      onAjouterAbsence={ajouterAbsence}
      onRetirerAbsence={retirerAbsence}
      onRepondreEchange={(id, accepte) => agirEchange("agenda_repondre_echange", { p_echange: id, p_accepte: accepte })}
      onTrancherEchange={(id, accorde) =>
        agirEchange("agenda_trancher_echange", { p_echange: id, p_accorde: accorde, p_commentaire: null })
      }
      onAnnulerEchange={(id) => agirEchange("agenda_annuler_echange", { p_echange: id })}
      onEffacerMessages={() => {
        setErreur(null);
        setSucces(null);
      }}
    />
  );
}

/* ── L'écran, sans accès réseau ───────────────────────────────── */

const VUES = ["aujourdhui", "semaine", "praticien", "demandes", "conges", "echanges"] as const;
type Vue = (typeof VUES)[number];

function lireVue(valeur: string | null): Vue {
  return VUES.find((v) => v === valeur) ?? "aujourdhui";
}

const PANNEAU = "agenda-panneau";

export type PropsEcran = {
  voeux: Voeu[];
  personnes: Record<string, Personne>;
  commentaires: Commentaire[];
  absences: Absence[];
  echanges: Echange[];
  exceptions: Exception[];
  moi: string;
  estGerant: boolean;
  erreur: string | null;
  succes: string | null;
  occupeEchange: boolean;
  onBasculer: (salle: string, jour: number, moment: string, ouvrir: () => void) => Promise<void>;
  onDemanderLibre: (salle: string, jour: number, moment: string) => Promise<boolean>;
  onAgir: (nom: string, args: Record<string, unknown>) => Promise<boolean>;
  onProposerEchange: (args: ArgsEchange) => Promise<boolean>;
  onAjouterAbsence: (du: string, au: string, motif: string) => Promise<boolean>;
  onRetirerAbsence: (id: string) => Promise<boolean>;
  onRepondreEchange: (id: string, accepte: boolean) => Promise<boolean>;
  onTrancherEchange: (id: string, accorde: boolean) => Promise<boolean>;
  onAnnulerEchange: (id: string) => Promise<boolean>;
  /** Efface l'erreur et le succès affichés (changement d'onglet, ouverture d'une case). */
  onEffacerMessages: () => void;
};

export function AgendaEcran(props: PropsEcran) {
  const { voeux, personnes, commentaires, absences, echanges, exceptions, moi, estGerant } = props;

  // L'onglet vient de l'adresse et y retourne sans recharger la page :
  // `replaceState` est suivi par `useSearchParams` (doc Next, « Native History API »).
  const parametres = useSearchParams();
  const vue = lireVue(parametres.get("vue"));
  const changerVue = (v: Vue) => {
    const p = new URLSearchParams(parametres.toString());
    p.set("vue", v);
    window.history.replaceState(null, "", `?${p.toString()}`);
    props.onEffacerMessages();
  };

  // Ouvert par un lien sur « Échanges », l'onglet actif peut être hors de la
  // rangée qui défile sur téléphone : on l'y ramène.
  useEffect(() => {
    document.getElementById(ongletId(PANNEAU, vue))?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [vue]);

  // La date du jour à Paris, lue une fois à l'ouverture de l'écran.
  const [aujourdhui] = useState(() => aujourdhuiParis());
  const lundiCourant = lundiDe(aujourdhui);
  const [lundi, setLundi] = useState(lundiCourant);
  const [jourChoisi, setJourChoisi] = useState<number | null>(null);
  const [jourMien, setJourMien] = useState(() => numeroJour(aujourdhui));
  const [selection, setSelection] = useState<string | null>(null);
  const [libres, setLibres] = useState(false);
  const [ouverte, setOuverte] = useState<CaseOuverte | null>(null);
  const [libre, setLibre] = useState<CaseOuverte | null>(null);

  const teintes = teintesDeLAgenda(voeux, exceptions, personnes);

  const changerLundi = (l: string) => {
    setLundi(l);
    // Autre semaine : le jour affiché sur téléphone revient au jour par défaut.
    setJourChoisi(null);
  };

  const ouvrir = (salle: string, jour: number, moment: string) => setOuverte({ salle, jour, moment });
  /** Une case touchée dans une vue : un message d'un geste précédent n'a plus rien à y faire. */
  const ouvrirCase = (salle: string, jour: number, moment: string) => {
    props.onEffacerMessages();
    ouvrir(salle, jour, moment);
  };

  const demanderCaseLibre = (salle: string, jour: number, moment: string) => {
    props.onEffacerMessages();
    // Une demande de ma part existe déjà sur cette case : son détail, pas une deuxième demande.
    if (voeuDe(voeux, moi, salle, jour, moment)) ouvrir(salle, jour, moment);
    else setLibre({ salle, jour, moment });
  };

  const titulaire = (e: Echange) => voeux.find((v) => v.id === e.voeu_cible_id)?.user_id ?? null;
  const enAttenteEchanges =
    echanges.filter((e) => e.statut === "propose" && titulaire(e) === moi).length +
    (estGerant ? echanges.filter((e) => e.statut === "accepte_pair").length : 0);

  const onglets: Onglet<Vue>[] = [
    { id: "aujourdhui", label: "Aujourd’hui" },
    { id: "semaine", label: "Semaine" },
    { id: "praticien", label: "Par praticien" },
    { id: "demandes", label: "Mes demandes" },
    { id: "conges", label: "Congés" },
    { id: "echanges", label: "Échanges", compte: enAttenteEchanges > 0 ? enAttenteEchanges : undefined },
  ];

  return (
    <Page
      titre="Agenda du cabinet"
      intro="Qui est au cabinet, dans quelle salle, et vos demandes de créneaux. Lucas et Jean-Baptiste accordent ou refusent, et répondent dans le fil de chaque créneau."
    >
      <Onglets onglets={onglets} actif={vue} onChange={changerVue} label="Vues de l’agenda" panneauId={PANNEAU} />

      {props.erreur || props.succes ? (
        <div style={{ marginBottom: 16 }}>
          {props.erreur ? <Message ton="erreur">{props.erreur}</Message> : null}
          {!props.erreur && props.succes ? <Message ton="succes">{props.succes}</Message> : null}
        </div>
      ) : null}

      <div id={PANNEAU} role="tabpanel" aria-labelledby={ongletId(PANNEAU, vue)}>
        {vue === "aujourdhui" ? (
          <Aujourdhui
            aujourdhui={aujourdhui}
            voeux={voeux}
            exceptions={exceptions}
            absences={absences}
            personnes={personnes}
            teintes={teintes}
            onOuvrir={ouvrirCase}
          />
        ) : vue === "semaine" ? (
          <Semaine
            aujourdhui={aujourdhui}
            voeux={voeux}
            exceptions={exceptions}
            absences={absences}
            personnes={personnes}
            teintes={teintes}
            reglages={{
              lundi,
              lundiCourant,
              onLundi: changerLundi,
              jourChoisi,
              onJour: setJourChoisi,
              selection,
              onSelection: setSelection,
              libres,
              onLibres: setLibres,
            }}
            onOuvrir={ouvrirCase}
            onDemanderLibre={demanderCaseLibre}
          />
        ) : vue === "praticien" ? (
          <ParPraticien
            aujourdhui={aujourdhui}
            lundi={lundi}
            lundiCourant={lundiCourant}
            onLundi={changerLundi}
            voeux={voeux}
            exceptions={exceptions}
            absences={absences}
            personnes={personnes}
            teintes={teintes}
          />
        ) : vue === "demandes" ? (
          <MesDemandes
            voeux={voeux}
            personnes={personnes}
            teintes={teintes}
            moi={moi}
            jourDuJour={numeroJour(aujourdhui)}
            jour={jourMien}
            onJour={setJourMien}
            onCase={(salle, jour, moment) => void props.onBasculer(salle, jour, moment, () => ouvrir(salle, jour, moment))}
          />
        ) : vue === "conges" ? (
          <MesConges
            absences={absences}
            personnes={personnes}
            moi={moi}
            estGerant={estGerant}
            onAjouter={props.onAjouterAbsence}
            onRetirer={props.onRetirerAbsence}
          />
        ) : (
          <Echanges
            echanges={echanges}
            voeux={voeux}
            personnes={personnes}
            moi={moi}
            estGerant={estGerant}
            occupe={props.occupeEchange}
            onRepondre={props.onRepondreEchange}
            onTrancher={props.onTrancherEchange}
            onAnnuler={props.onAnnulerEchange}
          />
        )}
      </div>

      {ouverte ? (
        <CaseDetail
          {...ouverte}
          voeux={voeux}
          commentaires={commentaires}
          personnes={personnes}
          moi={moi}
          estGerant={estGerant}
          mesVoeuxAccordes={voeux.filter((v) => v.user_id === moi && v.statut === "valide")}
          onProposerEchange={props.onProposerEchange}
          onFermer={() => setOuverte(null)}
          onAgir={props.onAgir}
          erreur={props.erreur}
        />
      ) : null}

      {libre ? (
        <DemanderLibre
          {...libre}
          onDemander={() => props.onDemanderLibre(libre.salle, libre.jour, libre.moment)}
          onFermer={() => setLibre(null)}
        />
      ) : null}
    </Page>
  );
}
