// Dix inscriptions simultanées sur une séance à une place : une seule doit passer.
// Usage : node --env-file=.env.local scripts/klub-concurrence.mjs

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://nuehdfyscqnkckudkqhe.supabase.co";
const CLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!CLE) {
  console.error("SUPABASE_SERVICE_ROLE_KEY absente de .env.local");
  process.exit(1);
}
const entetes = { apikey: CLE, Authorization: `Bearer ${CLE}`, "Content-Type": "application/json" };

async function rest(chemin, init = {}) {
  const r = await fetch(`${URL}/rest/v1/${chemin}`, { ...init, headers: { ...entetes, ...init.headers } });
  const t = await r.text();
  if (!r.ok) throw new Error(`${chemin} ${r.status} ${t}`);
  return t ? JSON.parse(t) : null;
}

// À 60 jours : hors de la fenêtre de 28 jours affichée sur le site.
const [seance] = await rest("klub_seances", {
  method: "POST",
  headers: { Prefer: "return=representation" },
  body: JSON.stringify({
    debut: new Date(Date.now() + 60 * 86400_000).toISOString(),
    duree_min: 45,
    type: "small",
    titre: "Test concurrence",
    capacite: 1,
    prix_libelle: "",
    inscription_requise: true,
  }),
});

try {
  const resultats = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      fetch(`${URL}/rest/v1/rpc/klub_inscrire`, {
        method: "POST",
        headers: entetes,
        body: JSON.stringify({
          p_seance: seance.id,
          p_prenom: "Test",
          p_nom: `N${i}`,
          p_email: `concurrence${i}@example.com`,
          p_telephone: "0612345678",
          p_premiere: false,
        }),
      }).then((r) => r.json()),
    ),
  );
  const confirmees = resultats.filter((r) => r.statut === "confirmee").length;
  const rangs = resultats.filter((r) => r.statut === "attente").map((r) => r.rang).sort((a, b) => a - b);
  console.log({ confirmees, rangs });
  if (confirmees !== 1 || rangs.join() !== "1,2,3,4,5,6,7,8,9") {
    console.error("ÉCHEC", resultats);
    process.exitCode = 1;
  } else {
    console.log("OK : une place, une confirmation, neuf rangs distincts.");
  }
} finally {
  await rest(`klub_seances?id=eq.${seance.id}`, { method: "DELETE" });
}
