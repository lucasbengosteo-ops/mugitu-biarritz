"use client";

import { useEffect, useState } from "react";

interface ApiResponse {
  count: number | null;
  source: "instagram" | "manual" | "unavailable";
  fetched_at: string;
}

export default function ParticipantsCounter() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/avirun-participants", { cache: "no-store" });
        const json: ApiResponse = await res.json();
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) {
          setData({ count: null, source: "unavailable", fetched_at: new Date().toISOString() });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    // Refresh every 2 minutes — Instagram values move slowly and we don't want
    // to hammer their endpoint.
    const id = setInterval(load, 120_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const display =
    loading ? "…" :
    data?.count !== null && data?.count !== undefined ? data.count.toString() : "—";

  const note =
    data?.source === "instagram"
      ? "Compté en direct sur Instagram"
      : data?.source === "manual"
      ? "Compteur mis à jour manuellement"
      : "Compteur temporairement indisponible";

  return (
    <div className="inline-flex flex-col items-center gap-1 rounded-2xl bg-white/95 px-6 py-4 shadow-md border border-[#04A49B]/20">
      <div className="text-4xl sm:text-5xl font-bold text-[#003850] tabular-nums">
        {display}
      </div>
      <div className="text-xs sm:text-sm text-[#333334] font-medium">
        Participations comptabilisées
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[#333334]/50 mt-0.5">
        {note}
      </div>
    </div>
  );
}
