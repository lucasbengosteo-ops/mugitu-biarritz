"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * Effets d’entrée de la home :
 *  1. le loader (compteur 0→100 puis glissement vers le haut) ;
 *  2. les révélations `[data-reveal]` au scroll (IntersectionObserver) ;
 *  3. les compteurs animés `.mg-count`.
 *
 * Le markup de la page reste rendu côté serveur : ce composant ne fait
 * qu’ajouter la classe `.mg-in` et animer les chiffres. Sans JS, le
 * <noscript> ci-dessous masque le loader et affiche tout le contenu.
 */
export default function LandingEffects() {
  const [progress, setProgress] = useState(0);
  const [lifted, setLifted] = useState(false);
  const [gone, setGone] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Révèle immédiatement ce qui est déjà dans la fenêtre (le hero).
  const kickVisible = () => {
    const vh = window.innerHeight;
    document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.9) el.classList.add("mg-in");
    });
    document.querySelectorAll<HTMLElement>(".mg-count").forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.9) animateCount(el);
    });
  };

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── 0. Vidéo du hero ─────────────────────────────────────────
    // Le fichier pèse 5,6 Mo (1280×720 à 2,64 Mbit/s) pour un fond
    // décoratif affiché à 55 % d'opacité. Deux décisions :
    //   — la source n'est posée QUE sur grand écran, donc rien n'est
    //     téléchargé sur mobile, où ce poids se paie en données et en
    //     attente ;
    //   — l'élément part transparent et n'apparaît qu'une fois la lecture
    //     réellement lancée : le temps de mise en mémoire tampon cesse
    //     d'être visible, on voit le dégradé puis la vidéo s'y fond.
    const video = document.querySelector<HTMLVideoElement>("video[data-hero]");
    if (video && !reduce && window.innerWidth >= 900) {
      video.addEventListener("playing", () => { video.style.opacity = "0.55"; }, { once: true });
      video.src = video.dataset.src ?? "";
      video.load();
    }

    // ── 1. Loader ────────────────────────────────────────────────
    if (reduce) {
      // Mouvement réduit : on saute l’animation, mais hors du corps de l’effet
      // (un setState synchrone ici déclencherait un rendu en cascade).
      const t = window.setTimeout(() => {
        setProgress(100);
        setLifted(true);
        setGone(true);
        kickVisible();
      }, 0);
      return () => window.clearTimeout(t);
    } else {
      const dur = 1700;
      const t0 = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const k = Math.min((now - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - k, 2.2);
        setProgress(Math.round(eased * 100));
        if (k < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          setLifted(true);
          window.setTimeout(() => setGone(true), 950);
          kickVisible();
        }
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  // ── 2 & 3. Révélations + compteurs ─────────────────────────────
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          if (el.hasAttribute("data-reveal")) el.classList.add("mg-in");
          if (el.classList.contains("mg-count")) animateCount(el);
          obs.unobserve(el);
        });
      },
      { threshold: 0.18 },
    );
    observerRef.current = io;

    const t = window.setTimeout(() => {
      document.querySelectorAll("[data-reveal], .mg-count").forEach((el) => io.observe(el));
    }, 60);

    return () => {
      window.clearTimeout(t);
      io.disconnect();
    };
  }, []);

  return (
    <>
      <noscript
        dangerouslySetInnerHTML={{
          __html:
            "<style>#mg-loader{display:none!important}[data-reveal]{opacity:1!important;transform:none!important}</style>",
        }}
      />
      {!gone && (
        <div
          id="mg-loader"
          aria-hidden="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            background: "#003850",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 36,
            transition: "transform .9s cubic-bezier(.76,0,.24,1), opacity .6s ease",
            transform: lifted ? "translateY(-100%)" : "translateY(0)",
            opacity: lifted ? 0 : 1,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.05,
              backgroundImage: "radial-gradient(circle at 1px 1px,#fff 1px,transparent 0)",
              backgroundSize: "42px 42px",
            }}
          />
          <Image
            src="/logo-full-white.png"
            alt="Mugitu"
            width={230}
            height={86}
            priority
            style={{ width: 230, maxWidth: "60vw", height: "auto", opacity: 0.95 }}
          />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <span
              style={{
                fontSize: 11,
                letterSpacing: ".42em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,.45)",
                paddingLeft: ".42em",
              }}
            >
              Chargement
            </span>
            <div
              style={{
                width: 240,
                maxWidth: "62vw",
                height: 2,
                background: "rgba(255,255,255,.14)",
                borderRadius: 2,
                overflow: "hidden",
              }}
            >
              <div style={{ height: "100%", width: `${progress}%`, background: "#04A49B", borderRadius: 2, transition: "width .12s linear" }} />
            </div>
          </div>
          <span
            style={{
              position: "absolute",
              bottom: 36,
              right: 42,
              fontSize: "clamp(56px,11vw,128px)",
              fontWeight: 800,
              lineHeight: 0.8,
              letterSpacing: "-.04em",
              color: "rgba(255,255,255,.1)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {progress}
          </span>
        </div>
      )}
    </>
  );
}

/** Compte de 0 jusqu’à `data-count` en ~1,3 s (ease-out cubique). */
function animateCount(el: HTMLElement) {
  if (el.dataset.done) return;
  el.dataset.done = "1";
  const target = parseInt(el.dataset.count ?? "0", 10) || 0;
  const suffix = el.dataset.suffix ?? "";
  const dur = 1300;
  const t0 = performance.now();
  const step = (now: number) => {
    const k = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (k < 1) requestAnimationFrame(step);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(step);
}
