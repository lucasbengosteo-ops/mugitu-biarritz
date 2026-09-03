"use client";

import { useId, useRef, useState } from "react";
import Image from "next/image";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * Dépôt d'image par glisser-déposer, avec repli sur un sélecteur de fichier
 * et sur la saisie d'un chemin.
 *
 * Le champ texte est conservé volontairement : les articles existants
 * pointent vers des fichiers locaux (`/athlete-trail.jpg`) et doivent rester
 * modifiables. Le dépôt écrit dans le bucket public `site-medias`, dont la
 * RLS n'autorise l'écriture qu'aux praticiens — ce contrôle-ci est cosmétique.
 */

const BUCKET = "site-medias";
const TAILLE_MAX = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

/** `Photo de l'été.JPG` → `photo-de-l-ete.jpg`, préfixé pour rester unique. */
function nomSur(fichier: File): string {
  const ext = (fichier.name.split(".").pop() || "jpg").toLowerCase();
  const base = fichier.name
    .replace(/\.[^.]+$/, "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) || "image";
  return `${base}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
}

export default function ImageDrop({
  valeur,
  onChange,
  dossier = "articles",
}: {
  valeur: string;
  onChange: (url: string) => void;
  /** Sous-dossier du bucket, pour ne pas tout mélanger. */
  dossier?: string;
}) {
  const [survol, setSurvol] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const id = useId();

  const televerser = async (fichier: File) => {
    setErreur(null);
    if (!TYPES.includes(fichier.type)) {
      setErreur("Format non accepté : JPEG, PNG, WebP, AVIF ou GIF.");
      return;
    }
    if (fichier.size > TAILLE_MAX) {
      setErreur(`Image trop lourde (${(fichier.size / 1048576).toFixed(1)} Mo) — 8 Mo maximum.`);
      return;
    }
    setEnvoi(true);
    const chemin = `${dossier}/${nomSur(fichier)}`;
    const sb = supabaseBrowser();
    const { error } = await sb.storage.from(BUCKET).upload(chemin, fichier, {
      cacheControl: "31536000",
      upsert: false,
    });
    setEnvoi(false);
    if (error) {
      setErreur(`Dépôt refusé : ${error.message}`);
      return;
    }
    const { data } = sb.storage.from(BUCKET).getPublicUrl(chemin);
    onChange(data.publicUrl);
  };

  const surDepot = (e: React.DragEvent) => {
    e.preventDefault();
    setSurvol(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void televerser(f);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setSurvol(true);
        }}
        onDragLeave={() => setSurvol(false)}
        onDrop={surDepot}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: 14,
          borderRadius: 12,
          border: `2px dashed ${survol ? "#04A49B" : "rgba(0,56,80,.22)"}`,
          background: survol ? "rgba(4,164,155,.06)" : "rgba(0,56,80,.02)",
          transition: "border-color .15s, background .15s",
        }}
      >
        {valeur ? (
          <span style={{ position: "relative", flex: "0 0 auto", width: 92, height: 66, borderRadius: 8, overflow: "hidden", background: "rgba(0,56,80,.06)" }}>
            {/* `unoptimized` : une vignette de back-office ne mérite pas une
                transformation facturée, et la source peut être un chemin local
                comme une URL de stockage. */}
            <Image src={valeur} alt="" fill sizes="92px" unoptimized style={{ objectFit: "cover" }} />
          </span>
        ) : (
          <span
            aria-hidden="true"
            style={{
              flex: "0 0 auto",
              width: 92,
              height: 66,
              borderRadius: 8,
              border: "1px solid rgba(0,56,80,.12)",
              display: "grid",
              placeItems: "center",
              color: "rgba(0,56,80,.3)",
              fontSize: 22,
            }}
          >
            ⃞
          </span>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: "0 0 6px", fontSize: 13.5, color: "rgba(51,51,52,.7)" }}>
            {envoi ? "Dépôt en cours…" : "Glissez une image ici"}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              disabled={envoi}
              onClick={() => input.current?.click()}
              style={{
                padding: "7px 14px",
                borderRadius: 999,
                border: "1px solid rgba(0,56,80,.2)",
                background: "#fff",
                font: "inherit",
                fontSize: 13,
                fontWeight: 600,
                color: "#003850",
                cursor: envoi ? "wait" : "pointer",
              }}
            >
              Choisir un fichier
            </button>
            {valeur && (
              <button
                type="button"
                onClick={() => onChange("")}
                style={{
                  padding: "7px 14px",
                  borderRadius: 999,
                  border: "1px solid rgba(194,65,12,.3)",
                  background: "transparent",
                  font: "inherit",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#C2410C",
                  cursor: "pointer",
                }}
              >
                Retirer
              </button>
            )}
          </div>
        </div>

        <input
          ref={input}
          id={id}
          type="file"
          accept={TYPES.join(",")}
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void televerser(f);
            e.target.value = "";
          }}
        />
      </div>

      {erreur && (
        <p role="alert" style={{ margin: "8px 0 0", fontSize: 13, fontWeight: 600, color: "#C2410C" }}>
          {erreur}
        </p>
      )}

      {/* Chemin modifiable : les articles historiques pointent vers /public. */}
      <input
        aria-label="Chemin ou adresse de l’image"
        style={{
          width: "100%",
          marginTop: 8,
          padding: "9px 12px",
          borderRadius: 10,
          border: "1px solid rgba(0,56,80,.18)",
          font: "inherit",
          fontSize: 13,
          color: "rgba(51,51,52,.75)",
          background: "#fff",
        }}
        placeholder="/athlete-trail.jpg"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
