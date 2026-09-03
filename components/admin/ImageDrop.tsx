"use client";

import { useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";

/**
 * Dépôt d'image par glisser-déposer + réglage du point focal.
 *
 * Le point focal existe parce que la même couverture est recadrée à trois
 * formats différents (4/3 dans l'article, ~1,7 en carte, ~2 en article lié) :
 * `object-fit: cover` coupe au centre, ce qui décapite un sujet placé haut.
 * On stocke « x% y% » et on l'applique en `object-position` partout.
 *
 * Le champ texte est conservé : les articles existants pointent vers des
 * fichiers locaux (`/athlete-trail.jpg`) et doivent rester modifiables.
 */

const BUCKET = "site-medias";
const TAILLE_MAX = 8 * 1024 * 1024;
const TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

/** Les recadrages réels du site, pour juger sur pièce et non au jugé. */
const APERCUS = [
  { label: "Dans l’article", ratio: 4 / 3, largeur: 104 },
  { label: "En carte", ratio: 300 / 172, largeur: 104 },
  { label: "Article lié", ratio: 220 / 110, largeur: 104 },
];

/** `Photo de l'été.JPG` → `photo-de-l-ete-a1b2c3d4.jpg`. */
function nomSur(fichier: File): string {
  const ext = (fichier.name.split(".").pop() || "jpg").toLowerCase();
  const base =
    fichier.name
      .replace(/\.[^.]+$/, "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60) || "image";
  return `${base}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
}

function lireFocus(v: string): { x: number; y: number } {
  const m = /^(\d{1,3})% (\d{1,3})%$/.exec(v.trim());
  return m ? { x: Number(m[1]), y: Number(m[2]) } : { x: 50, y: 50 };
}

export default function ImageDrop({
  valeur,
  onChange,
  focus,
  onFocusChange,
  dossier = "articles",
}: {
  valeur: string;
  onChange: (url: string) => void;
  /** Point focal « x% y% ». */
  focus: string;
  onFocusChange: (focus: string) => void;
  dossier?: string;
}) {
  const [survol, setSurvol] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const cadre = useRef<HTMLDivElement>(null);

  const pt = lireFocus(focus);

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
    const { error } = await sb.storage.from(BUCKET).upload(chemin, fichier, { cacheControl: "31536000", upsert: false });
    setEnvoi(false);
    if (error) {
      setErreur(`Dépôt refusé : ${error.message}`);
      return;
    }
    onChange(sb.storage.from(BUCKET).getPublicUrl(chemin).data.publicUrl);
    onFocusChange("50% 50%");
  };

  /** Place le point focal là où on clique, ou là où on fait glisser. */
  const pointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.type === "pointermove" && e.buttons !== 1) return;
    const r = cadre.current?.getBoundingClientRect();
    if (!r) return;
    const x = Math.round(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
    const y = Math.round(Math.min(100, Math.max(0, ((e.clientY - r.top) / r.height) * 100)));
    onFocusChange(`${x}% ${y}%`);
  };

  /** Déplacement au clavier : le pointeur n'est pas le seul moyen. */
  const clavier = (e: React.KeyboardEvent) => {
    const pas = e.shiftKey ? 10 : 2;
    const d: Record<string, [number, number]> = {
      ArrowLeft: [-pas, 0], ArrowRight: [pas, 0], ArrowUp: [0, -pas], ArrowDown: [0, pas],
    };
    const v = d[e.key];
    if (!v) return;
    e.preventDefault();
    onFocusChange(`${Math.min(100, Math.max(0, pt.x + v[0]))}% ${Math.min(100, Math.max(0, pt.y + v[1]))}%`);
  };

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setSurvol(true); }}
        onDragLeave={() => setSurvol(false)}
        onDrop={(e) => {
          e.preventDefault();
          setSurvol(false);
          const f = e.dataTransfer.files?.[0];
          if (f) void televerser(f);
        }}
        style={{
          padding: 14,
          borderRadius: 12,
          border: `2px dashed ${survol ? "#04A49B" : "rgba(0,56,80,.22)"}`,
          background: survol ? "rgba(4,164,155,.06)" : "rgba(0,56,80,.02)",
          transition: "border-color .15s, background .15s",
        }}
      >
        {!valeur ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              aria-hidden="true"
              style={{ flex: "0 0 auto", width: 92, height: 66, borderRadius: 8, border: "1px solid rgba(0,56,80,.12)", display: "grid", placeItems: "center", color: "rgba(0,56,80,.28)", fontSize: 20 }}
            >
              ▦
            </span>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 13.5, color: "rgba(51,51,52,.7)" }}>
                {envoi ? "Dépôt en cours…" : "Glissez une image ici"}
              </p>
              <button
                type="button"
                disabled={envoi}
                onClick={() => input.current?.click()}
                style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid rgba(0,56,80,.2)", background: "#fff", font: "inherit", fontSize: 13, fontWeight: 600, color: "#003850", cursor: envoi ? "wait" : "pointer" }}
              >
                Choisir un fichier
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-start" }}>
            {/* ── Réglage du point focal ── */}
            <div style={{ flex: "1 1 260px", minWidth: 220 }}>
              <div
                ref={cadre}
                role="slider"
                tabIndex={0}
                aria-label="Point focal de l’image"
                aria-valuetext={`${pt.x} % horizontalement, ${pt.y} % verticalement`}
                aria-valuenow={pt.y}
                aria-valuemin={0}
                aria-valuemax={100}
                onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); pointer(e); }}
                onPointerMove={pointer}
                onKeyDown={clavier}
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "3 / 2",
                  borderRadius: 10,
                  overflow: "hidden",
                  cursor: "crosshair",
                  touchAction: "none",
                  background: "rgba(0,56,80,.06)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- aperçu de back-office : on veut l'image entière, sans transformation ni recadrage */}
                <img src={valeur} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", pointerEvents: "none" }} />
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: `${pt.x}%`,
                    top: `${pt.y}%`,
                    width: 22,
                    height: 22,
                    marginLeft: -11,
                    marginTop: -11,
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    boxShadow: "0 0 0 2px #04A49B, 0 2px 8px rgba(0,0,0,.4)",
                    background: "rgba(4,164,155,.35)",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 12.5, color: "rgba(51,51,52,.6)" }}>
                Cliquez sur le sujet à garder au centre du cadrage — flèches du
                clavier pour affiner. <strong style={{ color: "#003850" }}>{focus}</strong>
              </p>
            </div>

            {/* ── Les trois recadrages réels ── */}
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {APERCUS.map((a) => (
                <div key={a.label}>
                  <div
                    style={{
                      width: a.largeur,
                      height: Math.round(a.largeur / a.ratio),
                      borderRadius: 8,
                      overflow: "hidden",
                      background: "#012A3A",
                      border: "1px solid rgba(0,56,80,.12)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- aperçu de recadrage, identique au rendu public */}
                    <img src={valeur} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, display: "block" }} />
                  </div>
                  <p style={{ margin: "5px 0 0", fontSize: 11, fontWeight: 600, color: "rgba(51,51,52,.55)", textAlign: "center" }}>
                    {a.label}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", width: "100%" }}>
              <button
                type="button"
                disabled={envoi}
                onClick={() => input.current?.click()}
                style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid rgba(0,56,80,.2)", background: "#fff", font: "inherit", fontSize: 13, fontWeight: 600, color: "#003850", cursor: envoi ? "wait" : "pointer" }}
              >
                {envoi ? "Dépôt…" : "Remplacer"}
              </button>
              <button
                type="button"
                onClick={() => onFocusChange("50% 50%")}
                style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid rgba(0,56,80,.2)", background: "transparent", font: "inherit", fontSize: 13, fontWeight: 600, color: "#003850", cursor: "pointer" }}
              >
                Recentrer
              </button>
              <button
                type="button"
                onClick={() => { onChange(""); onFocusChange("50% 50%"); }}
                style={{ padding: "7px 14px", borderRadius: 999, border: "1px solid rgba(194,65,12,.3)", background: "transparent", font: "inherit", fontSize: 13, fontWeight: 600, color: "#C2410C", cursor: "pointer" }}
              >
                Retirer
              </button>
            </div>
          </div>
        )}

        <input
          ref={input}
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

      <input
        aria-label="Chemin ou adresse de l’image"
        style={{ width: "100%", marginTop: 8, padding: "9px 12px", borderRadius: 10, border: "1px solid rgba(0,56,80,.18)", font: "inherit", fontSize: 13, color: "rgba(51,51,52,.75)", background: "#fff" }}
        placeholder="/athlete-trail.jpg"
        value={valeur}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
