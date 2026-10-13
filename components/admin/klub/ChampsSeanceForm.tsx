"use client";

import { useRef, useState } from "react";
import { TYPES_INDIVIDUELS } from "@/lib/klub/individuel";
import { KLUB_TYPES, type ChampsSeance, type KlubType } from "@/lib/klub/types";
import ImageDrop from "../ImageDrop";
import { centimesDepuisTexte, etatEncaissement, ligneEtatEncaissement, nomCompte, texteDepuisCentimes, type Compte } from "./encaissement";
import { Champ } from "../ui";

/** Ce qu'il faut pour afficher et modifier le bloc « Encaissement ». */
export type EncaissementProps = {
  praticienId: string | null;
  onPraticienChange: (id: string | null) => void;
  comptes: Compte[];
  comptesPrets: Set<string>;
  /** Changer le praticien : gérant seulement (`klub_admin_encaissement`, code KLUB_ENCAISSEMENT). */
  estGerant: boolean;
  userId: string | null;
};

/** Champs communs au créneau et à la séance. */
export default function ChampsSeanceForm<T extends ChampsSeance>({
  valeur,
  onChange,
  prefixe,
  encaissement,
  // Vrai pour un créneau ou une séance pas encore enregistré : sert à
  // présélectionner le praticien connecté quand un non-gérant choisit
  // « Séance individuelle » ou « Bilan offert » (spec partie 3, § 5).
  nouveau = false,
  // Ce que deviennent ces valeurs ailleurs : un créneau les fait descendre sur
  // ses séances à venir, une séance qui suit son créneau peut être écrasée.
  noteEncaissement,
}: {
  valeur: T;
  onChange: (maj: (v: T) => T) => void;
  prefixe: string;
  encaissement: EncaissementProps;
  nouveau?: boolean;
  noteEncaissement?: string;
}) {
  // Dernière capacité connue : décocher « Inscription requise », ou choisir
  // « Séance individuelle »/« Bilan offert » (capacité imposée à 1), la vide ;
  // revenir en arrière la rend.
  const derniereCapacite = useRef<number>(valeur.capacite ?? 5);
  // Texte brut du champ « Prix (€) », distinct de `prix_centimes` : reformater
  // à chaque frappe empêcherait de taper la virgule décimale (« 12, » serait
  // aussitôt ramené à « 12 »). Resynchronisé seulement au montage (voir la clé
  // posée par les écrans appelants sur les nouveaux brouillons).
  const [prixTexte, setPrixTexte] = useState(() => texteDepuisCentimes(valeur.prix_centimes));
  const prixIllisible = prixTexte.trim() !== "" && centimesDepuisTexte(prixTexte) === null;
  // Même principe pour le prix à deux, par personne (séance individuelle
  // seulement). 0 est refusé en base (`klub_admin_prix_duo`, `KLUB_PRIX`) :
  // une saisie à 0 est traitée comme illisible, le prix précédent est gardé.
  const [duoTexte, setDuoTexte] = useState(() => texteDepuisCentimes(valeur.prix_duo_centimes));
  const duoCentimesSaisis = centimesDepuisTexte(duoTexte);
  const duoIllisible = duoTexte.trim() !== "" && (duoCentimesSaisis === null || duoCentimesSaisis === 0);
  const set = <K extends keyof ChampsSeance>(k: K, v: ChampsSeance[K]) => onChange((d) => ({ ...d, [k]: v }));
  const estIndividuelOuBilan = TYPES_INDIVIDUELS.has(valeur.type as "individuel" | "bilan");
  const estBilan = valeur.type === "bilan";

  /**
   * Changement de type : applique les règles des séances individuelles et
   * des bilans (capacité 1, inscription imposée, pas de réservation externe,
   * bilan gratuit, prix à deux réservé à l'individuel), et présélectionne le
   * praticien connecté pour un non-gérant qui crée l'un de ces deux types.
   */
  const changerType = (next: KlubType) => {
    const entre = TYPES_INDIVIDUELS.has(next as "individuel" | "bilan");
    const etaitIndivOuBilan = estIndividuelOuBilan;
    const quitteIndividuel = valeur.type === "individuel" && next !== "individuel";

    onChange((d) => {
      let maj: T = { ...d, type: next };
      if (entre) {
        maj = { ...maj, capacite: 1, inscription_requise: true, reservation_url: null, reservation_libelle: null };
      } else if (etaitIndivOuBilan) {
        maj = { ...maj, capacite: derniereCapacite.current };
      }
      if (next === "bilan") {
        maj = { ...maj, prix_centimes: null, prix_duo_centimes: null };
      } else if (quitteIndividuel) {
        maj = { ...maj, prix_duo_centimes: null };
      }
      return maj;
    });

    if (entre && valeur.capacite !== null) derniereCapacite.current = valeur.capacite;
    if (next === "bilan") {
      setPrixTexte("");
      setDuoTexte("");
    } else if (quitteIndividuel) {
      setDuoTexte("");
    }

    if (entre && nouveau && !encaissement.estGerant && encaissement.praticienId === null && encaissement.userId) {
      encaissement.onPraticienChange(encaissement.userId);
    }
  };

  const etatEnc = ligneEtatEncaissement(
    etatEncaissement({
      praticienId: encaissement.praticienId,
      estGerant: encaissement.estGerant,
      userId: encaissement.userId,
      comptesPrets: encaissement.comptesPrets,
    }),
    nomCompte(encaissement.comptes, encaissement.praticienId),
  );
  const aidePraticien = encaissement.estGerant
    ? undefined
    : estIndividuelOuBilan
      ? "Vous encaissez cette séance."
      : "Seuls Lucas et Jean-Baptiste choisissent le praticien qui encaisse une séance.";
  const encadre: React.CSSProperties = {
    border: "1px solid rgba(0,56,80,.14)",
    borderRadius: 12,
    padding: 14,
    display: "grid",
    gap: 12,
    minWidth: 0,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <p style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 600, color: "#003850" }}>Image</p>
        <ImageDrop
          valeur={valeur.image ?? ""}
          onChange={(url) => set("image", url || null)}
          focus={valeur.image_focus}
          onFocusChange={(f) => set("image_focus", f)}
          dossier="klub"
          apercus={[
            { label: "À la une", ratio: 16 / 10, largeur: 120 },
            { label: "Dans la liste", ratio: 1, largeur: 76 },
          ]}
        />
        <p style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.5, color: "rgba(0,56,80,.78)" }}>
          Facultative. Sans image, la séance s’affiche sur un fond à la couleur de son type.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
        <Champ id={`${prefixe}-type`} label="Type">
          <select value={valeur.type} onChange={(e) => changerType(e.target.value as KlubType)}>
            {KLUB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </Champ>
        <Champ id={`${prefixe}-duree`} label="Durée (min)">
          <input
            type="number"
            min={5}
            step={5}
            value={valeur.duree_min}
            onChange={(e) => set("duree_min", Number(e.target.value))}
          />
        </Champ>
      </div>

      <Champ id={`${prefixe}-titre`} label="Titre">
        <input value={valeur.titre} onChange={(e) => set("titre", e.target.value)} />
      </Champ>

      <Champ id={`${prefixe}-desc`} label="Description">
        <textarea rows={3} style={{ resize: "vertical" }} value={valeur.description} onChange={(e) => set("description", e.target.value)} />
      </Champ>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <Champ id={`${prefixe}-inter`} label="Intervenant">
          <input value={valeur.intervenant} onChange={(e) => set("intervenant", e.target.value)} />
        </Champ>
        <Champ id={`${prefixe}-inter-mail`} label="E-mail de l’intervenant" aide="Reçoit la liste des inscrits 2 h avant.">
          <input
            type="email"
            value={valeur.intervenant_email ?? ""}
            onChange={(e) => set("intervenant_email", e.target.value.trim() || null)}
          />
        </Champ>
      </div>

      <div>
        <label className="ad-case" style={{ flexWrap: "wrap", columnGap: 10, rowGap: 0 }}>
          <input
            type="checkbox"
            checked={valeur.inscription_requise}
            disabled={estIndividuelOuBilan}
            aria-readonly={estIndividuelOuBilan}
            onChange={(e) => {
              const requise = e.target.checked;
              if (!requise && valeur.capacite !== null) derniereCapacite.current = valeur.capacite;
              const capacite = requise ? (valeur.capacite ?? derniereCapacite.current) : null;
              onChange((d) => ({
                ...d,
                inscription_requise: requise,
                capacite,
                // Un lien et un formulaire ne coexistent pas : la base le refuse.
                reservation_url: requise ? null : d.reservation_url,
                reservation_libelle: requise ? null : d.reservation_libelle,
              }));
            }}
          />
          Inscription requise (places comptées)
          {estIndividuelOuBilan && (
            <span style={{ fontSize: 14, color: "rgba(0,56,80,.72)" }}>— toujours imposée pour ce type</span>
          )}
        </label>
      </div>

      {!valeur.inscription_requise && !estIndividuelOuBilan && (
        <div style={encadre}>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "rgba(0,56,80,.78)" }}>
            L’inscription se fait ailleurs ? Donnez le lien : les visiteurs seront renvoyés dessus, et le
            site ne comptera aucune place. Laissez vide pour une entrée libre sans inscription.
          </p>
          <Champ id={`${prefixe}-resa-url`} label="Lien d’inscription (https)">
            <input
              placeholder="https://chat.whatsapp.com/…"
              value={valeur.reservation_url ?? ""}
              onChange={(e) => set("reservation_url", e.target.value.trim() || null)}
            />
          </Champ>
          <Champ id={`${prefixe}-resa-libelle`} label="Texte du bouton">
            <input
              placeholder="S’inscrire sur WhatsApp"
              value={valeur.reservation_libelle ?? ""}
              onChange={(e) => set("reservation_libelle", e.target.value || null)}
            />
          </Champ>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
        <Champ
          id={`${prefixe}-cap`}
          label="Places"
          aide={estIndividuelOuBilan ? "Une réservation par créneau, seul ou à deux" : undefined}
        >
          <input
            type="number"
            min={1}
            style={{ opacity: valeur.inscription_requise && !estIndividuelOuBilan ? 1 : 0.6 }}
            disabled={!valeur.inscription_requise || estIndividuelOuBilan}
            value={estIndividuelOuBilan ? 1 : (valeur.capacite ?? "")}
            onChange={(e) => {
              const capacite = e.target.value ? Number(e.target.value) : null;
              if (capacite !== null && capacite > 0) derniereCapacite.current = capacite;
              set("capacite", capacite);
            }}
          />
        </Champ>
        {!estBilan && (
          <Champ
            id={`${prefixe}-prix-euros`}
            label="Prix (€)"
            erreur={prixIllisible ? "Indiquez un montant en euros, par exemple 15 ou 12,50." : undefined}
          >
            <input
              inputMode="decimal"
              placeholder="15"
              value={prixTexte}
              onChange={(e) => {
                const texte = e.target.value;
                setPrixTexte(texte);
                // Une saisie illisible ne doit pas effacer le prix : on garde le
                // précédent et on le signale sous le champ.
                const centimes = centimesDepuisTexte(texte);
                if (centimes !== null || texte.trim() === "") set("prix_centimes", centimes);
              }}
            />
          </Champ>
        )}
        {valeur.type === "individuel" && (
          <Champ
            id={`${prefixe}-duo-euros`}
            label="Prix à deux, par personne (€)"
            aide={duoIllisible ? undefined : "Laissez vide : la séance à deux n’est pas proposée."}
            erreur={
              duoIllisible
                ? duoCentimesSaisis === 0
                  ? "Un prix à deux doit être supérieur à 0 €, ou laissez vide."
                  : "Indiquez un montant en euros, par exemple 15 ou 12,50."
                : undefined
            }
          >
            <input
              inputMode="decimal"
              placeholder="30"
              value={duoTexte}
              onChange={(e) => {
                const texte = e.target.value;
                setDuoTexte(texte);
                if (texte.trim() === "") {
                  set("prix_duo_centimes", null);
                  return;
                }
                // Une saisie illisible, ou à 0, ne doit pas effacer le prix à
                // deux : on garde le précédent et on le signale sous le champ.
                const centimes = centimesDepuisTexte(texte);
                if (centimes !== null && centimes > 0) set("prix_duo_centimes", centimes);
              }}
            />
          </Champ>
        )}
      </div>

      {!estBilan && (
        <Champ
          id={`${prefixe}-prix`}
          label="Prix affiché"
          aide="Affiché seulement si aucun prix n’est saisi ci-dessus (ex. Gratuit, Prix libre)."
        >
          <input
            value={valeur.prix_libelle}
            placeholder="15 € la séance"
            onChange={(e) => set("prix_libelle", e.target.value)}
          />
        </Champ>
      )}

      <fieldset style={{ ...encadre, margin: 0 }}>
        <legend style={{ padding: "0 6px", fontSize: 14, fontWeight: 700, color: "#003850" }}>Encaissement</legend>
        <Champ id={`${prefixe}-praticien`} label="Praticien qui encaisse" aide={aidePraticien}>
          <select
            style={{ opacity: encaissement.estGerant ? 1 : 0.75 }}
            disabled={!encaissement.estGerant}
            aria-readonly={!encaissement.estGerant}
            value={encaissement.praticienId ?? ""}
            onChange={(e) => encaissement.onPraticienChange(e.target.value || null)}
          >
            <option value="">Aucun</option>
            {encaissement.comptes.map((c) => (
              <option key={c.user_id} value={c.user_id}>{c.nom}</option>
            ))}
          </select>
        </Champ>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "#003850" }}>{etatEnc}</p>
        {noteEncaissement && (
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "rgba(0,56,80,.78)" }}>{noteEncaissement}</p>
        )}
      </fieldset>
    </div>
  );
}
