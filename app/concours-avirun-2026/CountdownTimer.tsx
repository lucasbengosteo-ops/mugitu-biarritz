"use client";

import { useEffect, useState } from "react";
import type { Dict } from "@/lib/i18n";

interface CountdownTimerProps {
  /** ISO date string in Europe/Paris timezone */
  deadline: string;
  dict: Dict;
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

export default function CountdownTimer({ deadline, dict }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const c = dict.concoursPage;

  useEffect(() => {
    const tick = () => setTimeLeft(computeTimeLeft(deadline));
    const initial = setTimeout(tick, 0);
    const interval = setInterval(tick, 1000);
    return () => {
      clearTimeout(initial);
      clearInterval(interval);
    };
  }, [deadline]);

  if (!timeLeft) {
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
        {c.countdownEnded}
      </div>
    );
  }

  const blocks = [
    { value: timeLeft.days, label: c.countdownDaysLabel },
    { value: timeLeft.hours, label: c.countdownHoursLabel },
    { value: timeLeft.minutes, label: c.countdownMinutesLabel },
    { value: timeLeft.seconds, label: c.countdownSecondsLabel },
  ];

  return (
    <div
      className="flex justify-center gap-3 sm:gap-5"
      role="timer"
      aria-label={c.countdownAriaLabel}
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
