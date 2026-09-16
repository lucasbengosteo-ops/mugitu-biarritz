"use client";

import { KLUB_TYPES, type ChampsSeance, type KlubType } from "@/lib/klub/types";
import { CHAMP, LABEL } from "./styles";

/** Champs communs au créneau et à la séance. */
export default function ChampsSeanceForm<T extends ChampsSeance>({
  valeur,
  onChange,
  prefixe,
}: {
  valeur: T;
  onChange: (maj: (v: T) => T) => void;
  prefixe: string;
}) {
  const set = <K extends keyof ChampsSeance>(k: K, v: ChampsSeance[K]) => onChange((d) => ({ ...d, [k]: v }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-type`}>Type</label>
          <select id={`${prefixe}-type`} style={CHAMP} value={valeur.type} onChange={(e) => set("type", e.target.value as KlubType)}>
            {KLUB_TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-duree`}>Durée (min)</label>
          <input
            id={`${prefixe}-duree`}
            type="number"
            min={5}
            step={5}
            style={CHAMP}
            value={valeur.duree_min}
            onChange={(e) => set("duree_min", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <label style={LABEL} htmlFor={`${prefixe}-titre`}>Titre</label>
        <input id={`${prefixe}-titre`} style={CHAMP} value={valeur.titre} onChange={(e) => set("titre", e.target.value)} />
      </div>

      <div>
        <label style={LABEL} htmlFor={`${prefixe}-desc`}>Description</label>
        <textarea
          id={`${prefixe}-desc`}
          rows={3}
          style={{ ...CHAMP, resize: "vertical" }}
          value={valeur.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-inter`}>Intervenant</label>
          <input id={`${prefixe}-inter`} style={CHAMP} value={valeur.intervenant} onChange={(e) => set("intervenant", e.target.value)} />
        </div>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-inter-mail`}>E-mail de l’intervenant</label>
          <input
            id={`${prefixe}-inter-mail`}
            type="email"
            style={CHAMP}
            value={valeur.intervenant_email ?? ""}
            onChange={(e) => set("intervenant_email", e.target.value.trim() || null)}
          />
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(51,51,52,.5)" }}>Reçoit la liste des inscrits 2 h avant.</p>
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#003850" }}>
        <input
          type="checkbox"
          checked={valeur.inscription_requise}
          onChange={(e) =>
            onChange((d) => ({ ...d, inscription_requise: e.target.checked, capacite: e.target.checked ? (d.capacite ?? 5) : null }))
          }
        />
        Inscription requise (places comptées)
      </label>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14 }}>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-cap`}>Places</label>
          <input
            id={`${prefixe}-cap`}
            type="number"
            min={1}
            style={{ ...CHAMP, opacity: valeur.inscription_requise ? 1 : 0.5 }}
            disabled={!valeur.inscription_requise}
            value={valeur.capacite ?? ""}
            onChange={(e) => set("capacite", e.target.value ? Number(e.target.value) : null)}
          />
        </div>
        <div>
          <label style={LABEL} htmlFor={`${prefixe}-prix`}>Prix affiché</label>
          <input
            id={`${prefixe}-prix`}
            style={CHAMP}
            value={valeur.prix_libelle}
            placeholder="15 € la séance"
            onChange={(e) => set("prix_libelle", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
