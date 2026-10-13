import assert from "node:assert/strict";
import { test } from "node:test";
import { composer, type InscriptionDuo } from "./mails.ts";
import type { Inscription, Seance, TypeMail } from "./types.ts";

const site = "https://mugitu-biarritz.fr";
const seance: Seance = {
  id: "s1", creneau_id: null, debut: "2026-09-22T10:30:00Z", statut: "publiee", modifiee: false,
  type: "small", titre: "Renfo <b>", description: "", intervenant: "Hugo", intervenant_email: "hugo@example.com",
  duree_min: 45, capacite: 5, prix_libelle: "15 €", prix_centimes: null, inscription_requise: true,
  reservation_url: null, reservation_libelle: null, image: null, image_focus: "50% 50%",
};
const ana: Inscription = {
  id: "i1", seance_id: "s1", prenom: "Ana", nom: "Test", email: "ana@example.com", telephone: "0612345678",
  premiere_seance: true, statut: "confirmee", present: false, origine: "site", jeton: "a".repeat(64),
  created_at: "2026-09-15T08:00:00Z",
  montant_centimes: null, stripe_paiement: null, remboursement: null, paiement_expire_at: null,
};

test("confirmation", () => {
  const m = composer({ type: "confirmation", site, seance, inscription: ana });
  assert.equal(m.destinataire.email, "ana@example.com");
  assert.ok(m.sujet.includes("mardi 22 septembre à 12 h 30"), m.sujet);
  assert.ok(m.html.includes(`/mugi-klub/annulation?jeton=${"a".repeat(64)}`));
  assert.ok(m.html.includes("Renfo &lt;b&gt;"));
  assert.ok(!m.html.includes("Renfo <b>"));
  assert.ok(m.texte.startsWith("Bonjour Ana,"));
  assert.equal(m.ics, true);
});

test("attente avec le rang", () => {
  const m = composer({ type: "attente", site, seance, inscription: { ...ana, statut: "attente" }, rang: 2 });
  assert.ok(m.texte.includes("2ᵉ sur la liste d’attente"), m.texte);
  assert.equal(m.ics, false);
});

test("liste intervenant", () => {
  const m = composer({
    type: "liste_intervenant", site, seance,
    confirmes: [{ ...ana, nb_personnes: 1, accompagnant: null }], attente: [],
  });
  assert.equal(m.destinataire.email, "hugo@example.com");
  assert.ok(m.html.includes("0612345678"));
  assert.ok(m.texte.includes("première séance"));
});

test("séance modifiée pour une personne en liste d’attente", () => {
  const m = composer({ type: "seance_modifiee", site, seance, inscription: { ...ana, statut: "attente" } });
  assert.equal(m.ics, false);
  assert.ok(m.html.includes("Quitter la liste d’attente"), m.html);
});

test("confirmation payée : le reçu Stripe remplace le paiement sur place", () => {
  const m = composer({ type: "confirmation", site, seance, inscription: ana, paye: true, montant: 1500 });
  assert.ok(m.texte.includes("Paiement reçu : 15 €. Le reçu de Stripe arrive dans un mail séparé."), m.texte);
  assert.ok(!m.texte.includes("Le paiement se fait sur place"), m.texte);
});

test("confirmation non payée : le paiement se fait sur place, comme avant", () => {
  const m = composer({ type: "confirmation", site, seance, inscription: ana });
  assert.ok(m.texte.includes("Le paiement se fait sur place"), m.texte);
  assert.ok(!m.texte.includes("Paiement reçu"), m.texte);
});

test("place libérée : lien de paiement et heure limite", () => {
  const m = composer({
    type: "place_liberee",
    site,
    seance,
    inscription: ana,
    lienPaiement: `${site}/api/klub/payer?jeton=${"a".repeat(64)}`,
    expireAt: "2026-09-22T09:00:00Z",
  });
  assert.ok(m.sujet.includes("Une place s’est libérée"), m.sujet);
  assert.ok(m.sujet.includes("Renfo"), m.sujet);
  assert.ok(m.html.includes(`${site}/api/klub/payer?jeton=${"a".repeat(64)}`));
  assert.ok(m.texte.includes("Payer et réserver"), m.texte);
  assert.ok(m.texte.includes("gardée jusqu’au mardi 22 septembre à 11 h 00"), m.texte);
  assert.ok(m.texte.includes("proposée à la personne suivante"), m.texte);
});

test("place libérée sans lien de paiement : refusé", () => {
  assert.throws(() => composer({ type: "place_liberee", site, seance, inscription: ana }));
});

test("confirmation d'un duo : mention de l'accompagnant", () => {
  const m = composer({ type: "confirmation", site, seance, inscription: ana, nbPersonnes: 2, accompagnant: "Léa Martin" });
  assert.ok(m.texte.includes("Séance à deux, avec Léa Martin."), m.texte);
});

test("confirmation seule : pas de mention de duo", () => {
  const m = composer({ type: "confirmation", site, seance, inscription: ana });
  assert.ok(!m.texte.includes("Séance à deux"), m.texte);
});

test("confirmation d'un bilan : remplace le texte de paiement", () => {
  const m = composer({ type: "confirmation", site, seance, inscription: ana, typeSeance: "bilan" });
  assert.ok(m.texte.includes(`Bilan offert de 30 minutes avec ${seance.intervenant}. Venez en tenue de sport.`), m.texte);
  assert.ok(!m.texte.includes("Le paiement se fait sur place"), m.texte);
  assert.ok(!m.texte.includes("Rendez-vous au"), m.texte);
});

test("confirmation payée, duo : le montant est celui des deux places", () => {
  const m = composer({
    type: "confirmation", site, seance, inscription: ana,
    paye: true, montant: 6000, nbPersonnes: 2, accompagnant: "Léa Martin",
  });
  assert.ok(m.texte.includes("Paiement reçu : 60 €."), m.texte);
  assert.ok(m.texte.includes("Séance à deux, avec Léa Martin."), m.texte);
});

test("liste intervenant : un duo affiche l'accompagnant", () => {
  const duo: InscriptionDuo = { ...ana, nb_personnes: 2, accompagnant: "Léa Martin" };
  const m = composer({ type: "liste_intervenant", site, seance, confirmes: [duo], attente: [] });
  assert.ok(m.html.includes("Ana Test + Léa Martin"), m.html);
  assert.ok(m.texte.includes("Ana Test + Léa Martin"), m.texte);
});

test("liste intervenant : une place seule n'affiche pas de '+'", () => {
  const seul: InscriptionDuo = { ...ana, nb_personnes: 1, accompagnant: null };
  const m = composer({ type: "liste_intervenant", site, seance, confirmes: [seul], attente: [] });
  assert.ok(!m.texte.includes("+"), m.texte);
});

test("annulation payée, remboursée", () => {
  const m = composer({ type: "annulation", site, seance, inscription: ana, paye: true, rembourse: true, montant: 1500 });
  assert.ok(m.texte.includes("Le remboursement de 15 € est en cours."), m.texte);
  assert.ok(m.texte.includes("5 à 10 jours"), m.texte);
});

test("annulation payée, moins de 24 h : la séance reste due", () => {
  const m = composer({ type: "annulation", site, seance, inscription: ana, paye: true, rembourse: false, montant: 1500 });
  assert.ok(m.texte.includes("L’annulation intervient moins de 24 h avant la séance : elle reste due."), m.texte);
  assert.ok(!m.texte.includes("remboursement"), m.texte);
});

test("séance annulée par le praticien, inscription payée : remboursement annoncé", () => {
  const m = composer({ type: "seance_annulee", site, seance, inscription: ana, paye: true, montant: 1500 });
  assert.ok(m.texte.includes("Le remboursement de 15 € est en cours."), m.texte);
});

test("séance annulée, inscription non payée : rien sur un remboursement", () => {
  const m = composer({ type: "seance_annulee", site, seance, inscription: ana });
  assert.ok(!m.texte.includes("remboursement"), m.texte);
});

test("chaque type a un sujet et un texte", () => {
  const types: TypeMail[] = [
    "confirmation",
    "attente",
    "promotion",
    "annulation",
    "rappel",
    "seance_modifiee",
    "seance_annulee",
    "place_liberee",
  ];
  for (const type of types) {
    const m = composer({
      type,
      site,
      seance,
      inscription: ana,
      rang: 1,
      lienPaiement: `${site}/api/klub/payer?jeton=${"a".repeat(64)}`,
    });
    assert.ok(m.sujet.length > 10 && m.texte.length > 40, type);
  }
});
