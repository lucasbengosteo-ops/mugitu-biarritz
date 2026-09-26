"use client";

import { useRef } from "react";
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
  // Dernière capacité connue : décocher « Inscription requise » la vide (et le
  // SQL la met à null), la recocher la rend.
  const derniereCapacite = useRef<number>(valeur.capacite ?? 5);
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
      </label>

      {!valeur.inscription_requise && (
        <div
          style={{
            border: "1px solid rgba(0,56,80,.12)",
            borderRadius: 10,
            padding: 12,
            display: "grid",
            gap: 10,
          }}
        >
          <p style={{ margin: 0, fontSize: 12.5, color: "rgba(0,56,80,.7)" }}>
            L’inscription se fait ailleurs ? Donnez le lien : les visiteurs seront renvoyés dessus, et le
            site ne comptera aucune place. Laissez vide pour une entrée libre sans inscription.
          </p>
          <div>
            <label style={LABEL} htmlFor={`${prefixe}-resa-url`}>
              Lien d’inscription (https)
            </label>
            <input
              id={`${prefixe}-resa-url`}
              style={CHAMP}
              placeholder="https://chat.whatsapp.com/…"
              value={valeur.reservation_url ?? ""}
              onChange={(e) => set("reservation_url", e.target.value.trim() || null)}
            />
          </div>
          <div>
            <label style={LABEL} htmlFor={`${prefixe}-resa-libelle`}>
              Texte du bouton
            </label>
            <input
              id={`${prefixe}-resa-libelle`}
              style={CHAMP}
              placeholder="S’inscrire sur WhatsApp"
              value={valeur.reservation_libelle ?? ""}
              onChange={(e) => set("reservation_libelle", e.target.value || null)}
            />
          </div>
        </div>
      )}

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
            onChange={(e) => {
              const capacite = e.target.value ? Number(e.target.value) : null;
              if (capacite !== null && capacite > 0) derniereCapacite.current = capacite;
              set("capacite", capacite);
            }}
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
