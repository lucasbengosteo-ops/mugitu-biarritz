"use client";

import { useEffect, useState } from "react";

interface CountdownTimerProps {
  /** ISO date string in Europe/Paris timezone */
  deadline: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

function computeTimeLeft(deadline: string): TimeLeft {
  const target = new Date(deadline).getTime();
  const now = Date.now();
  const totalMs = Math.max(0, target - now);
  const seconds = Math.floor((totalMs / 1000) % 60);
  const minutes = Math.floor((totalMs / 1000 / 60) % 60);
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, totalMs };
}

export default function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(computeTimeLeft(deadline));
    // Première mise à jour différée d'un tick pour éviter un setState
    // synchrone dans le corps de l'effet (cf. règle react-hooks/set-state-in-effect).
    const initial = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [deadline]);

  if (!timeLeft) {
    // Avoid hydration mismatch: render a placeholder until client mounts
    return (
      <div className="flex justify-center gap-3 sm:gap-5" aria-hidden>
        {["00", "00", "00", "00"].map((v, i) => (
          <div
            key={i}
            className="w-20 sm:w-24 rounded-2xl bg-white/10 backdrop-blur border border-white/20 px-3 py-4 text-center"
          >
            <div className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
              {v}
            </div>
            <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/60 mt-1">
              —
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (timeLeft.totalMs === 0) {
    return (
      <div className="rounded-2xl bg-[#EE806C] text-white px-6 py-4 text-center font-semibold">
        Le concours est terminé. Merci à toutes et tous pour votre participation&nbsp;!
      </div>
    );
  }

  const blocks = [
    { value: timeLeft.days, label: "Jours" },
    { value: timeLeft.hours, label: "Heures" },
    { value: timeLeft.minutes, label: "Minutes" },
    { value: timeLeft.seconds, label: "Secondes" },
  ];

  return (
    <div
      className="flex justify-center gap-3 sm:gap-5"
      role="timer"
      aria-label="Temps restant avant la fin du concours"
    >
      {blocks.map(({ value, label }) => (
        <div
          key={label}
          className="w-20 sm:w-24 rounded-2xl bg-white/10 backdrop-blur border border-white/20 px-3 py-4 text-center shadow-lg"
        >
          <div className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
            {value.toString().padStart(2, "0")}
          </div>
          <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/60 mt-1">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
