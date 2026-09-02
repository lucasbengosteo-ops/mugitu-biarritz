"use client";

import { useEffect, useRef } from "react";

/**
 * Planning du Mugi Klub : navigation par semaine, filtres par type de
 * séance, onglets de jour en mobile et modale de détail.
 *
 * Portage de la logique de la maquette, **moins son tunnel de paiement** :
 * celui-ci collectait de vraies coordonnées bancaires dans un formulaire qui
 * n'encaissait rien (`// simulate Stripe PaymentIntent`). Les boutons
 * d'adhésion pointent désormais vers /contact.
 */

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const DAYS_SHORT = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const TYPE_LABEL: Record<string, string> = { small: "Small group", atelier: "Atelier", conf: "Conférence", soiree: "Soirée" };
const TYPE_COLOR: Record<string, string> = { small: "#04A49B", atelier: "#d49a40", conf: "#003850", soiree: "#EE806C" };
const TYPE_LEVEL: Record<string, string> = { small: "Tous niveaux", atelier: "Ouvert à tous", conf: "Tout public", soiree: "Membres & invités" };

const DESCS: Record<string, string> = {
  "Run Club Mugi": "Sortie running encadrée en groupe, allure adaptée à chacun. Échauffement, travail technique et retour au calme.",
  "Renfo & Mobilité": "Renforcement musculaire global et travail de mobilité articulaire pour préparer le corps à l'effort.",
  "Prévention des blessures": "Atelier pratique : dépistage des fragilités, exercices correctifs et routines de prévention à reproduire chez soi.",
  "Prépa physique collective": "Préparation physique en petit groupe : force, explosivité et endurance, encadrée par un kiné du sport.",
  "Nutrition du sportif": "Conférence : alimentation, hydratation et récupération pour soutenir l'effort et la performance.",
  "Mobilité matinale": "Réveil articulaire en douceur pour bien démarrer la journée et prévenir les raideurs.",
  Renforcement: "Travail de force fonctionnelle ciblé, progressif et adapté à votre niveau.",
  "Récup & Sauna": "Soirée récupération : étirements, mobilité et sauna pour relâcher les tensions après la semaine.",
  "Core & Gainage": "Travail profond du gainage et de la sangle abdominale, clé de la prévention des blessures.",
  "Analyse de foulée": "Atelier course à pied : analyse vidéo de la foulée et conseils personnalisés de progression.",
  "Afterwork Mugi Klub": "Moment convivial de la communauté Mugitu autour du sport-santé et du mouvement.",
  "Taping & Récupération": "Atelier pratique : techniques de taping et stratégies de récupération à intégrer à votre routine.",
  "Sommeil & Performance": "Conférence : le rôle du sommeil dans la performance, la récupération et la prévention des blessures.",
};

const MOBILE_BP = 760;

export default function MugiKlubPlanning({ html }: { html: string }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const $ = <T extends HTMLElement>(id: string) => el.querySelector<T>(id);
    const days = Array.from(el.querySelectorAll<HTMLElement>(".mk-day"));
    const sessions = Array.from(el.querySelectorAll<HTMLElement>(".mk-sess"));
    const filters = Array.from(el.querySelectorAll<HTMLElement>(".mk-filter"));
    const empty = $("#mk-empty");
    const grid = $("#mk-grid");
    const tabs = $("#mk-daytabs");

    const state = { weekOffset: 0, activeType: "all", activeDay: 0, mobile: window.innerWidth < MOBILE_BP };
    let weekDates: Date[] = [];
    const cleanups: (() => void)[] = [];

    const mondayOf = (offset: number) => {
      const t = new Date();
      const dow = t.getDay(); // 0 = dimanche
      const diff = (dow === 0 ? -6 : 1 - dow) + offset * 7;
      return new Date(t.getFullYear(), t.getMonth(), t.getDate() + diff);
    };
    const fmtDay = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });

    // ── En-têtes de jour + intitulé de la semaine ────────────────
    const renderWeek = () => {
      const monday = mondayOf(state.weekOffset);
      const todayKey = new Date().toDateString();
      weekDates = [];
      days.forEach((dayEl, i) => {
        const d = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
        weekDates[i] = d;
        const isToday = d.toDateString() === todayKey;
        const head = dayEl.firstElementChild as HTMLElement | null;
        if (!head) return;
        head.innerHTML =
          `<span style="font-size:16px;font-weight:700;color:${isToday ? "#04A49B" : "#003850"};">${DAYS[i]}</span>` +
          `<span style="font-size:12px;color:rgba(51,51,52,.45);">${fmtDay(d)}</span>` +
          (isToday
            ? `<span style="margin-left:auto;font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#04A49B;">Aujourd’hui</span>`
            : "");
        head.style.display = "flex";
        head.style.alignItems = "baseline";
        head.style.gap = "8px";
      });
      const range = $("#mk-range");
      if (range) {
        const last = weekDates[5];
        range.textContent = `Semaine du ${monday.getDate()} au ${last.getDate()} ${last.toLocaleDateString("fr-FR", { month: "long" })}`;
      }
      const todayBtn = $("#mk-today");
      if (todayBtn) todayBtn.style.display = state.weekOffset === 0 ? "none" : "inline-flex";
    };

    // ── Compteurs sur les filtres ────────────────────────────────
    const buildCounts = () => {
      filters.forEach((btn) => {
        const type = btn.dataset.type;
        const n = type === "all" ? sessions.length : sessions.filter((s) => s.dataset.type === type).length;
        let badge = btn.querySelector<HTMLElement>(".mk-count");
        if (!badge) {
          badge = document.createElement("span");
          badge.className = "mk-count";
          badge.style.cssText = "margin-left:7px;font-size:11px;opacity:.7;font-weight:700;";
          btn.appendChild(badge);
        }
        badge.textContent = String(n);
      });
    };

    // ── Affichage courant (filtre + jour actif en mobile) ────────
    const refresh = () => {
      if (tabs) tabs.style.display = state.mobile ? "flex" : "none";
      if (state.mobile && tabs) {
        Array.from(tabs.children).forEach((b, i) => {
          const on = i === state.activeDay;
          const btn = b as HTMLElement;
          btn.style.background = on ? "#04A49B" : "transparent";
          btn.style.color = on ? "#fff" : "#003850";
          btn.style.borderColor = on ? "#04A49B" : "rgba(0,56,80,.18)";
        });
      }
      sessions.forEach((s) => {
        s.dataset.hide = state.activeType === "all" || s.dataset.type === state.activeType ? "0" : "1";
      });
      let total = 0;
      days.forEach((d, i) => {
        const vis = d.querySelectorAll('.mk-sess:not([data-hide="1"])').length;
        const dayOk = !state.mobile || i === state.activeDay;
        d.style.display = vis && dayOk ? "flex" : "none";
        if (vis && dayOk) total += vis;
      });
      if (grid) grid.style.gridTemplateColumns = state.mobile ? "1fr" : "repeat(auto-fit,minmax(190px,1fr))";
      if (empty) empty.style.display = total ? "none" : "block";
    };

    // ── Onglets de jour (mobile) ─────────────────────────────────
    const buildDayTabs = () => {
      if (!tabs) return;
      tabs.innerHTML = "";
      DAYS_SHORT.forEach((name, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.style.cssText =
          "flex:0 0 auto;padding:8px 14px;border-radius:999px;border:1px solid rgba(0,56,80,.18);background:transparent;color:#003850;font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;transition:all .18s;";
        b.textContent = `${name} ${weekDates[i].getDate()}`;
        b.addEventListener("click", () => {
          state.activeDay = i;
          refresh();
        });
        tabs.appendChild(b);
      });
    };

    // ── Filtres ──────────────────────────────────────────────────
    filters.forEach((btn) => {
      const onClick = () => {
        state.activeType = btn.dataset.type ?? "all";
        filters.forEach((b) => {
          b.style.background = "transparent";
          b.style.color = "#003850";
          b.style.borderColor = "rgba(0,56,80,.18)";
          b.setAttribute("aria-pressed", "false");
        });
        btn.style.background = "#04A49B";
        btn.style.color = "#fff";
        btn.style.borderColor = "#04A49B";
        btn.setAttribute("aria-pressed", "true");
        refresh();
      };
      btn.addEventListener("click", onClick);
      cleanups.push(() => btn.removeEventListener("click", onClick));
    });

    // ── Navigation de semaine ────────────────────────────────────
    const step = (delta: number | "today") => () => {
      state.weekOffset = delta === "today" ? 0 : state.weekOffset + delta;
      renderWeek();
      buildDayTabs();
      refresh();
    };
    ([["#mk-prev", -1], ["#mk-next", 1], ["#mk-today", "today"]] as const).forEach(([id, delta]) => {
      const b = $(id);
      if (!b) return;
      const fn = step(delta as number | "today");
      b.addEventListener("click", fn);
      cleanups.push(() => b.removeEventListener("click", fn));
    });

    // ── Modale de détail d'une séance ────────────────────────────
    const modal = $("#mk-modal");
    const card = $("#mk-modal-card");
    const bg = $("#mk-modal-bg");
    const closeBtn = $("#mk-modal-close");

    const close = () => {
      if (!modal || !card || !bg) return;
      bg.style.opacity = "0";
      card.style.opacity = "0";
      card.style.transform = "translateY(14px) scale(.98)";
      window.setTimeout(() => {
        modal.style.display = "none";
      }, 300);
      document.body.style.overflow = "";
    };

    const openSession = (sess: HTMLElement, dayIndex: number) => {
      if (!modal || !card || !bg) return;
      const type = sess.dataset.type ?? "";
      const time = sess.querySelector("div span")?.textContent?.trim() ?? "";
      const title = sess.querySelector("h3")?.textContent?.trim() ?? "";
      const meta = sess.querySelector("p")?.textContent?.trim() ?? "";
      const [coach, dur = ""] = meta.split("·").map((x) => x.trim());
      const divs = sess.querySelectorAll("div");
      const spots = divs[divs.length - 1]?.querySelector("span")?.textContent?.trim() ?? "";

      const set = (id: string, text: string) => {
        const node = $(id);
        if (node) node.textContent = text;
      };
      const head = $("#mk-modal-head");
      if (head) head.style.background = TYPE_COLOR[type] || "#04A49B";
      set("#mk-modal-type", TYPE_LABEL[type] ?? "");
      set("#mk-modal-title", title);
      set("#mk-modal-day", `${DAYS[dayIndex]} ${fmtDay(weekDates[dayIndex])}`);
      set("#mk-modal-time", time + (dur ? ` · ${dur}` : ""));
      set("#mk-modal-coach", coach ?? "");
      set("#mk-modal-level", TYPE_LEVEL[type] ?? "");
      set("#mk-modal-desc", DESCS[title] ?? "Session encadrée par la Mugi Team.");
      const sp = $("#mk-modal-spots");
      if (sp) {
        sp.textContent = spots;
        sp.style.color = /1 place|2 place/.test(spots)
          ? "#C2410C"
          : /Accès|Ouvert|inscri/i.test(spots)
            ? "#003850"
            : "#1F8A5B";
      }
      modal.setAttribute("role", "dialog");
      modal.setAttribute("aria-modal", "true");
      modal.setAttribute("aria-label", title);
      modal.style.display = "flex";
      requestAnimationFrame(() => {
        bg.style.opacity = "1";
        card.style.opacity = "1";
        card.style.transform = "translateY(0) scale(1)";
      });
      document.body.style.overflow = "hidden";
    };

    if (modal) {
      if (closeBtn) {
        closeBtn.addEventListener("click", close);
        cleanups.push(() => closeBtn.removeEventListener("click", close));
      }
      if (bg) {
        bg.addEventListener("click", close);
        cleanups.push(() => bg.removeEventListener("click", close));
      }
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" && modal.style.display === "flex") close();
      };
      document.addEventListener("keydown", onKey);
      cleanups.push(() => document.removeEventListener("keydown", onKey));
    }

    days.forEach((dayEl, di) => {
      dayEl.querySelectorAll<HTMLElement>(".mk-sess").forEach((sess) => {
        sess.style.cursor = "pointer";
        sess.style.transition = "transform .18s,box-shadow .18s";

        // Les séances sont des <article> rendus cliquables : sans ces
        // attributs elles resteraient inatteignables au clavier et muettes
        // pour un lecteur d'écran.
        sess.setAttribute("role", "button");
        sess.setAttribute("tabindex", "0");
        const titre = sess.querySelector("h3")?.textContent?.trim();
        if (titre) sess.setAttribute("aria-label", `Détail de la séance : ${titre}`);

        const enter = () => {
          sess.style.transform = "translateY(-2px)";
          sess.style.boxShadow = "0 8px 26px rgba(60,40,30,.12)";
        };
        const leave = () => {
          sess.style.transform = "translateY(0)";
          sess.style.boxShadow = "";
        };
        const onClick = () => openSession(sess, di);
        const onKey = (e: KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openSession(sess, di);
          }
        };
        sess.addEventListener("mouseenter", enter);
        sess.addEventListener("mouseleave", leave);
        sess.addEventListener("focus", enter);
        sess.addEventListener("blur", leave);
        sess.addEventListener("click", onClick);
        sess.addEventListener("keydown", onKey);
        cleanups.push(() => {
          sess.removeEventListener("mouseenter", enter);
          sess.removeEventListener("mouseleave", leave);
          sess.removeEventListener("focus", enter);
          sess.removeEventListener("blur", leave);
          sess.removeEventListener("click", onClick);
          sess.removeEventListener("keydown", onKey);
        });
      });
    });

    const onResize = () => {
      const m = window.innerWidth < MOBILE_BP;
      if (m !== state.mobile) {
        state.mobile = m;
        refresh();
      }
    };
    window.addEventListener("resize", onResize);
    cleanups.push(() => window.removeEventListener("resize", onResize));

    renderWeek();
    buildCounts();
    buildDayTabs();
    refresh();

    return () => cleanups.forEach((fn) => fn());
  }, [html]);

  return <div ref={root} dangerouslySetInnerHTML={{ __html: html }} />;
}
