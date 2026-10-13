# Mugi Klub : paiement en ligne au praticien — plan d'implémentation

> **Pour les exécutants agentiques :** SOUS-COMPÉTENCE REQUISE — `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans`. Les étapes se suivent en cochant les cases (`- [ ]`).

**But :** une inscription à une séance payante du Klub se paie en ligne. L'argent arrive sur le compte Stripe du praticien, et le remboursement suit l'annulation.

**Architecture :**
- La base porte toute la règle : places, réservation de 30 minutes, liste d'attente, file de remboursements, droits.
- Le serveur Next ne fait que parler à Stripe, à trois endroits : la création de la session de paiement, les notifications, la tâche minute qui expire les réservations et exécute les remboursements.
- Paiement « direct » sur un compte Stripe Connect Standard : la session est créée avec l'en-tête `Stripe-Account` du praticien.

**Pile :** Next.js 16 App Router, React 19, Supabase (projet `nuehdfyscqnkckudkqhe`), SDK `stripe` (npm), `node --test`.

**Spec :** `docs/superpowers/specs/2026-10-13-klub-paiement-design.md`. **Lis-la avant ta tâche.**

---

## Règles pour l'exécutant

1. **Lire `AGENTS.md`.** Cette version de Next.js a des ruptures d'API : lis `node_modules/next/dist/docs/` avant d'utiliser une API de route ou de page.
2. **Base de production, en service.** Le projet `nuehdfyscqnkckudkqhe` sert le site mugitu-biarritz.fr. Règles :
   - migrations avec `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration`, lectures avec `..._execute_sql`, toujours avec `project_id` explicite ;
   - **jamais les outils `mcp__supabase__*`**, qui pointent sur un autre projet ;
   - **jamais de pause ni de suppression du projet** ;
   - tout essai destructif dans `begin; … rollback;`.
3. **Fonctions existantes : partir de la version en base, pas des fichiers.** Plusieurs migrations ont redéfini `klub__inscrire`, `klub__remplir`, `klub__annuler`, etc. Avant d'en réécrire une, lis sa définition en production (`select pg_get_functiondef('public.klub__inscrire(uuid,text,text,text,text,boolean,text,text)'::regprocedure)`), recopie-la **telle quelle**, puis applique uniquement les changements décrits. Mets en tête de chaque fonction redéfinie un commentaire « Corps repris de la production le <date>, changements : … ».
4. **Le code de ce plan n'a jamais été compilé ni exécuté.** Si une signature du dépôt, de la base ou du SDK Stripe diffère, suis le réel et dis précisément ce qui différait. Pour Stripe, lis les types dans `node_modules/stripe/types/` après l'installation.
5. **Aucune clé.** Tu ne lis, n'écris ni n'affiches aucune clé Stripe ou Supabase, et tu ne lis pas `.env*`. Le code lit `process.env.STRIPE_SECRET_KEY` et `process.env.STRIPE_WEBHOOK_SECRET`, que Lucas posera. Sans ces variables, le code doit échouer proprement (500 journalisé), sans planter le build.
6. **Lint React Compiler** : pas de `setState` dans le corps d'un effet (motif du dépôt : `window.setTimeout(() => void charger(), 0)`), pas de mutation pendant le rendu. `npm run lint` sans aucun avertissement.
7. **Modules purs** testés par `node --test` : imports entre fichiers voisins avec l'extension `.ts`, jamais l'alias `@/`.
8. **Commits** : `git add <chemins explicites>`, jamais `-a`. Messages en français, terminés par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Ne pousse rien.
9. **Écriture** : libellés français sobres, sans tournure ampoulée ; libellés non genrés (« Le remboursement est en cours », pas « vous serez remboursé »).
10. **`profiles.id` n'est jamais `profiles.user_id`** : tout ce qui référence un compte se joint sur `user_id`.

## Carte des fichiers

| Fichier | Rôle |
|---|---|
| `lib/klub/paiement.ts` (+ test) | Règles pures : libellé de prix, 24 h, délais de réservation |
| `supabase/migrations/20261013100000_klub_encaissement.sql` | Praticien et prix des séances, comptes Stripe, droits |
| `supabase/migrations/20261013100100_klub_inscription_payante.sql` | Statut `paiement`, places, liste d'attente, expiration |
| `supabase/migrations/20261013100200_klub_remboursements.sql` | Annulations remboursées, file de remboursements, RPC de service |
| `supabase/tests/klub_paiement.sql` | Scénarios |
| `lib/stripe.ts` | Client Stripe serveur et les quatre appels utilisés |
| `lib/admin/session-serveur.ts` | Identifier le praticien qui appelle une route |
| `app/api/stripe/compte/route.ts` | Relier son compte, synchroniser son état |
| `app/api/stripe/webhook/route.ts` | Notifications Stripe |
| `app/api/klub/inscription/route.ts` | Chemin payant |
| `app/api/klub/payer/route.ts` | Lien de paiement envoyé par mail (liste d'attente) |
| `app/mugi-klub/paiement/page.tsx` | Retour de Stripe : reçu ou abandonné |
| `app/api/klub/tache/route.ts` | Expirations et remboursements |
| `lib/klub/types.ts`, `lib/klub/mails.ts`, `lib/klub/envoi.ts` | Nouveaux champs et mails |
| `components/site/klub/KlubFormulaire.tsx`, page séance, page annulation | Parcours visiteur |
| `components/admin/klub/*`, `components/admin/KlubAdmin.tsx` | Praticien, prix, compte Stripe, remboursement |

---

### Task 0: Espace de travail

- [ ] `cd /Users/lucas/Desktop/mugitu-biarritz-admin && git status --short && git branch --show-current` — arbre propre, branche `feature/klub-paiement`.
- [ ] `npm test` — 107 tests passent. Note le nombre exact, les tâches suivantes s'y réfèrent.
- [ ] Vérifie que l'outil `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__execute_sql` répond : `select count(*) from public.klub_seances` avec `project_id: "nuehdfyscqnkckudkqhe"`. S'il est indisponible, **arrête-toi et dis-le** : les tâches 2 à 4 en dépendent.

---

### Task 1: Les règles pures

**Files:** Create `lib/klub/paiement.ts`, `lib/klub/paiement.test.ts`.

- [ ] **Step 1: Le test**

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { DELAI_RESERVATION_MIN, finGardeAttente, libellePrix, prixAffiche, remboursable } from "./paiement.ts";

test("le prix s'affiche en euros, sans centimes inutiles", () => {
  assert.equal(libellePrix(1500), "15 €");
  assert.equal(libellePrix(1250), "12,50 €");
  assert.equal(libellePrix(0), "Gratuit");
});

test("le prix saisi l'emporte sur le libellé libre", () => {
  assert.equal(prixAffiche({ prix_centimes: 1500, prix_libelle: "15 € la séance" }), "15 €");
  assert.equal(prixAffiche({ prix_centimes: null, prix_libelle: "Prix libre" }), "Prix libre");
  assert.equal(prixAffiche({ prix_centimes: null, prix_libelle: "" }), "");
});

test("remboursable jusqu'à 24 h avant, pas après", () => {
  const debut = "2026-10-20T18:00:00Z";
  assert.equal(remboursable(debut, new Date("2026-10-19T17:59:00Z")), true);
  assert.equal(remboursable(debut, new Date("2026-10-19T18:00:00Z")), false);
  assert.equal(remboursable(debut, new Date("2026-10-20T12:00:00Z")), false);
});

test("la place libérée est gardée 6 h, jamais au-delà du début", () => {
  const maintenant = new Date("2026-10-20T08:00:00Z");
  assert.equal(finGardeAttente(maintenant, "2026-10-21T08:00:00Z").toISOString(), "2026-10-20T14:00:00.000Z");
  assert.equal(finGardeAttente(maintenant, "2026-10-20T11:00:00Z").toISOString(), "2026-10-20T11:00:00.000Z");
});

test("la réservation pendant le paiement dure plus que la session Stripe", () => {
  assert.ok(DELAI_RESERVATION_MIN > 31);
});
```

- [ ] **Step 2** : `node --test lib/klub/paiement.test.ts` — échec, module absent.

- [ ] **Step 3: Le module**

```ts
/**
 * Règles du paiement en ligne du Klub, partagées par le site, l'admin et
 * les mails. La base applique les mêmes chiffres (voir les migrations du
 * 13 oct. 2026) : les changer ici exige de les changer là-bas.
 *
 * Aucun import : lu tel quel par `node --test`.
 */

/** Durée pendant laquelle une place est réservée à qui est en train de payer. */
export const DELAI_RESERVATION_MIN = 35;

/** Durée de la session de paiement Stripe : le minimum accepté par Stripe est 30 min. */
export const DUREE_SESSION_MIN = 31;

/** Durée de garde d'une place proposée à la liste d'attente. */
export const GARDE_ATTENTE_H = 6;

/** Délai sous lequel une annulation par le client n'est plus remboursée. */
export const DELAI_REMBOURSEMENT_H = 24;

export function libellePrix(centimes: number): string {
  if (centimes === 0) return "Gratuit";
  const euros = centimes / 100;
  const texte = Number.isInteger(euros)
    ? String(euros)
    : euros.toFixed(2).replace(".", ",");
  return `${texte} €`;
}

export function prixAffiche(s: { prix_centimes: number | null; prix_libelle: string }): string {
  return s.prix_centimes === null ? s.prix_libelle : libellePrix(s.prix_centimes);
}

export function remboursable(debut: string | Date, maintenant: Date): boolean {
  return new Date(debut).getTime() - maintenant.getTime() > DELAI_REMBOURSEMENT_H * 3_600_000;
}

export function finGardeAttente(maintenant: Date, debut: string | Date): Date {
  const garde = maintenant.getTime() + GARDE_ATTENTE_H * 3_600_000;
  return new Date(Math.min(garde, new Date(debut).getTime()));
}
```

- [ ] **Step 4** : `npm test` — nombre de la tâche 0 + 5, tous verts. `npx tsc --noEmit && npm run lint` sans sortie.

- [ ] **Step 5: Commit** — `git add lib/klub/paiement.ts lib/klub/paiement.test.ts`, message « klub : règles du paiement en ligne (prix, 24 h, délais) ».

---

### Task 2: Le socle en base — praticien, prix, comptes Stripe

**Files:** Create `supabase/migrations/20261013100000_klub_encaissement.sql`. Create `supabase/tests/klub_paiement.sql` (section A).

**Avant d'écrire**, lis en production la définition de `klub__seance_publique(public.klub_seances)` et la liste des fonctions qui l'appellent. Vérifie aussi qu'aucune colonne `praticien_id` / `prix_centimes` n'existe déjà.

- [ ] **Step 1: La migration**

```sql
-- Mugi Klub : chaque séance connaît le praticien qui l'encaisse et son prix.
-- Spec : docs/superpowers/specs/2026-10-13-klub-paiement-design.md, § 1 et 2.
--
-- Écriture par une fonction dédiée, comme l'image et la méthode de
-- réservation : on ne retranscrit pas les fonctions d'admin en production.
-- Les tables du Klub n'ont aucune politique d'écriture : tout passe par des
-- fonctions security definer, c'est là que se tiennent les droits.

alter table public.klub_creneaux
  add column praticien_id uuid references auth.users (id) on delete set null,
  add column prix_centimes integer check (prix_centimes is null or prix_centimes between 0 and 100000);

alter table public.klub_seances
  add column praticien_id uuid references auth.users (id) on delete set null,
  add column prix_centimes integer check (prix_centimes is null or prix_centimes between 0 and 100000);

-- Héritage depuis le créneau, comme l'image : klub_tache() liste ses
-- colonnes une par une.
create or replace function public.klub__heriter_encaissement()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  c record;
begin
  if new.creneau_id is null or new.praticien_id is not null or new.prix_centimes is not null then return new; end if;
  select praticien_id, prix_centimes into c from public.klub_creneaux where id = new.creneau_id;
  new.praticien_id := c.praticien_id;
  new.prix_centimes := c.prix_centimes;
  return new;
end;
$$;
revoke all on function public.klub__heriter_encaissement() from public, anon, authenticated;

create trigger klub_seances_heriter_encaissement
  before insert on public.klub_seances
  for each row execute function public.klub__heriter_encaissement();

-- Le compte Stripe de chaque praticien. Écrit par le serveur seul.
create table public.site_comptes_stripe (
  user_id uuid primary key references auth.users (id) on delete cascade,
  compte text not null unique check (compte like 'acct_%'),
  etat text not null default 'verification' check (etat in ('verification', 'pret')),
  updated_at timestamptz not null default now()
);
alter table public.site_comptes_stripe enable row level security;
create policy site_comptes_stripe_lecture on public.site_comptes_stripe
  for select to authenticated
  using (user_id = auth.uid() or public.site_est_super_admin());
revoke all on public.site_comptes_stripe from anon;
revoke insert, update, delete on public.site_comptes_stripe from authenticated;

-- Une séance se paie en ligne quand ces conditions sont réunies.
create or replace function public.klub__paiement_en_ligne(s public.klub_seances)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select s.inscription_requise
     and s.reservation_url is null
     and coalesce(s.prix_centimes, 0) > 0
     and s.praticien_id is not null
     and exists (select 1 from public.site_comptes_stripe c where c.user_id = s.praticien_id and c.etat = 'pret');
$$;
revoke all on function public.klub__paiement_en_ligne(public.klub_seances) from public, anon, authenticated;

-- Poser le praticien et le prix d'une séance ou d'un créneau.
-- Codes : KLUB_DROITS, KLUB_CIBLE, KLUB_ENCAISSEMENT, KLUB_PRIX.
--  - changer le praticien : gérant seulement ;
--  - changer le prix : gérant, ou le praticien déjà rattaché.
create or replace function public.klub_admin_encaissement(
  p_cible text, p_id uuid, p_praticien uuid, p_prix_centimes integer)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_praticien uuid;
  v_prix integer;
  v_gerant boolean := coalesce(public.site_est_super_admin(), false);
begin
  perform public.klub__verifier_droits();
  if p_cible not in ('seance', 'creneau') then raise exception 'KLUB_CIBLE'; end if;
  if p_prix_centimes is not null and (p_prix_centimes < 0 or p_prix_centimes > 100000) then
    raise exception 'KLUB_PRIX';
  end if;

  if p_cible = 'seance' then
    select praticien_id, prix_centimes into v_praticien, v_prix from public.klub_seances where id = p_id for update;
  else
    select praticien_id, prix_centimes into v_praticien, v_prix from public.klub_creneaux where id = p_id for update;
  end if;
  if not found then raise exception 'KLUB_CIBLE'; end if;

  if p_praticien is distinct from v_praticien and not v_gerant then raise exception 'KLUB_ENCAISSEMENT'; end if;
  if p_prix_centimes is distinct from v_prix and not v_gerant and v_praticien is distinct from auth.uid() then
    raise exception 'KLUB_ENCAISSEMENT';
  end if;

  if p_cible = 'seance' then
    update public.klub_seances set praticien_id = p_praticien, prix_centimes = p_prix_centimes where id = p_id;
  else
    update public.klub_creneaux set praticien_id = p_praticien, prix_centimes = p_prix_centimes where id = p_id;
  end if;
end;
$$;
revoke all on function public.klub_admin_encaissement(text, uuid, uuid, integer) from public, anon;
grant execute on function public.klub_admin_encaissement(text, uuid, uuid, integer) to authenticated;
```

Puis **redéfinis `klub__seance_publique`** à partir de la version en production : ajoute `'prix_centimes', s.prix_centimes` et `'paiement_en_ligne', public.klub__paiement_en_ligne(s)`, rien d'autre. Elle n'expose jamais `praticien_id` : le JSON est public.

- [ ] **Step 2: Appliquer** — `apply_migration`, `name` = `klub_encaissement`.

- [ ] **Step 3: Scénarios, section A** — crée `supabase/tests/klub_paiement.sql`, avec la même structure que `supabase/tests/articles_statut.sql` : `begin;`, un ou plusieurs blocs `do $$ … $$;`, `rollback;`, puis `select 'klub paiement : scénarios OK'`. Identités : Lucas (`lucas.bengosteo@gmail.com`, gérant) et Hugo (`hugo.daminato@gmail.com`, retiré de `site_super_admins` en début de bloc). Pour chaque identité : `set_config('request.jwt.claims', …, true)` puis `set local role authenticated`, et `reset role` ensuite. Scénarios :
  - A1 : en Lucas, créer une séance avec `klub_admin_creer_seance` (lis sa signature en base), puis `klub_admin_encaissement('seance', id, hugo, 1500)` ; vérifier les deux colonnes.
  - A2 : en Hugo, changer le prix de cette séance, qui est la sienne, à 2000 : passe.
  - A3 : en Hugo, `klub_admin_encaissement` avec `p_praticien = lucas` : lève `KLUB_ENCAISSEMENT`.
  - A4 : en Lucas, rattacher la séance à Lucas ; puis en Hugo, changer son prix : lève `KLUB_ENCAISSEMENT`.
  - A5 : `klub__paiement_en_ligne` vaut faux tant qu'aucun compte n'existe. Insérer, sans session, `site_comptes_stripe (lucas, 'acct_test', 'pret')` : vrai. Repasser `etat` à `verification` : faux.
  - A6 : une séance générée depuis un créneau qui porte praticien et prix les hérite. Insère directement une séance avec `creneau_id`, sans session.
  - A7 : en `anon`, `select * from site_comptes_stripe` ne renvoie rien ; en Hugo, il ne voit pas la ligne de Lucas.

  Lance-le. Le dernier `select` doit afficher le message. Une erreur remonte bien : un `assert false` dans un `do` fait échouer l'appel.

- [ ] **Step 4: Les scénarios existants** — relance en entier `supabase/tests/klub.sql`, `klub_images.sql`, `klub_reservation.sql`. S'ils échouent, établis qui a tort avant toute modification.

- [ ] **Step 5: Commit** — `git add supabase/migrations/20261013100000_klub_encaissement.sql supabase/tests/klub_paiement.sql`, message « klub : chaque séance connaît son praticien et son prix ».

---

### Task 3: L'inscription payante en base

**Files:** Create `supabase/migrations/20261013100100_klub_inscription_payante.sql`. Modify `supabase/tests/klub_paiement.sql` (section B).

**Avant d'écrire**, liste en production toutes les fonctions qui comptent les places avec `statut = 'confirmee'` :

```sql
select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname like 'klub%' and pg_get_functiondef(p.oid) ~ 'statut\s*=\s*''confirmee''';
```

Une place réservée en cours de paiement **compte comme prise**. Chacune de ces fonctions est à examiner : là où le compte sert à calculer des places, il doit inclure `paiement`. Là où il sert à autre chose (rappels, liste envoyée à l'intervenant, présence), il reste à `confirmee`. Dresse la liste et ta décision pour chacune dans ton rapport.

- [ ] **Step 1: La migration**

```sql
-- Mugi Klub : l'inscription payante. Spec § 3 et 5.
--
-- Nouveau statut `paiement` : une place tenue pendant qu'on paie. Elle compte
-- dans les places prises. Elle devient `confirmee` quand Stripe notifie le
-- paiement, `annulee` à l'expiration.

alter table public.klub_inscriptions drop constraint klub_inscriptions_statut_check;
alter table public.klub_inscriptions add constraint klub_inscriptions_statut_check
  check (statut in ('confirmee', 'attente', 'annulee', 'paiement'));

alter table public.klub_inscriptions
  add column paiement_expire_at timestamptz,
  add column montant_centimes integer check (montant_centimes is null or montant_centimes >= 0),
  add column stripe_compte text,
  add column stripe_session text unique,
  add column stripe_session_url text,
  add column stripe_paiement text unique,
  add column paye_at timestamptz,
  check (statut <> 'paiement' or paiement_expire_at is not null);

create index klub_inscriptions_paiement on public.klub_inscriptions (paiement_expire_at) where statut = 'paiement';

alter table public.klub_mails drop constraint klub_mails_type_check;
alter table public.klub_mails add constraint klub_mails_type_check
  check (type in ('confirmation', 'attente', 'promotion', 'annulation', 'rappel',
                  'seance_modifiee', 'seance_annulee', 'liste_intervenant', 'place_liberee'));

-- Places prises : confirmées et en cours de paiement.
create or replace function public.klub__places_prises(p_seance uuid)
returns integer
language sql
stable
set search_path = ''
as $$
  select count(*)::integer from public.klub_inscriptions
  where seance_id = p_seance and statut in ('confirmee', 'paiement');
$$;
revoke all on function public.klub__places_prises(uuid) from public, anon, authenticated;
```

**Vérifie le nom réel** des deux contraintes `check` (`\d`-équivalent : `select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.klub_inscriptions'::regclass`) avant de les supprimer.

Puis, dans la même migration, **redéfinis à partir de la production** :

1. **Chaque fonction de ta liste qui compte des places** : remplace le compte par `public.klub__places_prises(<id de séance>)`. Cela inclut au moins `klub__inscrire`, `klub__remplir` et `klub__seance_publique` (`places_restantes`).

2. **`klub__inscrire`**, chemin payant. Là où le statut d'une **nouvelle** inscription vaut `'confirmee'`, si `p_origine = 'site'` et `public.klub__paiement_en_ligne(s)` :
   - `v_statut := 'paiement'` ;
   - insérer avec `paiement_expire_at = now() + interval '35 minutes'` et `montant_centimes = s.prix_centimes` ;
   - **ne pas** mettre de mail `confirmation` en file (`v_mail` reste null).

   Si une inscription active existe déjà pour cette adresse avec `statut = 'paiement'` : repousser `paiement_expire_at` à `now() + interval '35 minutes'`, ne mettre aucun mail en file, et renvoyer `paiement`.

   Le JSON renvoyé gagne la clé `'inscription_id', v_id` dans tous les cas. Une inscription depuis l'admin (`p_origine = 'admin'`) reste confirmée d'office : paiement sur place.

3. **`klub__remplir`**, promotion payante. Pour une séance où `public.klub__paiement_en_ligne(s)` est vrai, la personne promue passe :
   - en `statut = 'paiement'`, avec `paiement_expire_at = least(now() + interval '6 hours', s.debut)` et `montant_centimes = s.prix_centimes` ;
   - avec un mail de type `place_liberee` au lieu de `promotion`.

   Sinon, rien ne change.

4. **Nouvelle fonction d'expiration**, appelée par la tâche minute. On ne modifie pas `klub_tache` :

```sql
-- Les places tenues dont le paiement n'est pas arrivé à temps se libèrent.
create or replace function public.klub_paiements_expirer()
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_seance uuid;
  v_n integer := 0;
begin
  for v_seance in
    select distinct seance_id from public.klub_inscriptions
    where statut = 'paiement' and paiement_expire_at <= now()
  loop
    -- Même ordre de verrouillage que l'inscription : la séance d'abord.
    perform 1 from public.klub_seances where id = v_seance for no key update;
    update public.klub_inscriptions set statut = 'annulee'
    where seance_id = v_seance and statut = 'paiement' and paiement_expire_at <= now();
    v_n := v_n + 1;
    perform public.klub__remplir(v_seance);
  end loop;
  return v_n;
end;
$$;
revoke all on function public.klub_paiements_expirer() from public, anon, authenticated;
grant execute on function public.klub_paiements_expirer() to service_role;
```

5. **Enregistrer la session créée**, et **confirmer un paiement**. Toutes deux idempotentes :

```sql
create or replace function public.klub_paiement_session(
  p_inscription uuid, p_compte text, p_session text, p_url text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.klub_inscriptions
  set stripe_compte = p_compte, stripe_session = p_session, stripe_session_url = p_url
  where id = p_inscription and statut = 'paiement';
$$;

-- Appelée par la notification `checkout.session.completed`.
-- Renvoie 'confirmee', 'deja' ou 'tardif' (payé après expiration : à rembourser).
create or replace function public.klub_paiement_confirme(
  p_session text, p_paiement text, p_montant integer)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  i public.klub_inscriptions;
begin
  select * into i from public.klub_inscriptions where stripe_session = p_session;
  if not found then return 'inconnu'; end if;
  perform 1 from public.klub_seances where id = i.seance_id for no key update;
  select * into i from public.klub_inscriptions where id = i.id for no key update;

  if i.stripe_paiement is not null then return 'deja'; end if;

  update public.klub_inscriptions
  set stripe_paiement = p_paiement, montant_centimes = p_montant, paye_at = now()
  where id = i.id;

  if i.statut = 'paiement' then
    update public.klub_inscriptions set statut = 'confirmee', paiement_expire_at = null where id = i.id;
    insert into public.klub_mails (type, inscription_id, seance_id) values ('confirmation', i.id, i.seance_id);
    return 'confirmee';
  end if;
  return 'tardif';
end;
$$;

revoke all on function public.klub_paiement_session(uuid, text, text, text) from public, anon, authenticated;
revoke all on function public.klub_paiement_confirme(text, text, integer) from public, anon, authenticated;
grant execute on function public.klub_paiement_session(uuid, text, text, text) to service_role;
grant execute on function public.klub_paiement_confirme(text, text, integer) to service_role;
```

Le cas `tardif` sera mis en file de remboursement par la tâche 4, qui redéfinit cette fonction.

6. **Ce qu'il faut pour créer une session** : depuis l'inscription (route d'inscription) ou depuis le jeton du mail (liste d'attente). Fonction de service :

```sql
-- Renvoie de quoi créer une session de paiement, ou null si l'inscription
-- n'attend pas (ou plus) de paiement.
create or replace function public.klub_paiement_infos(p_inscription uuid, p_jeton text)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'inscription_id', i.id, 'email', i.email, 'jeton', i.jeton,
    'montant_centimes', i.montant_centimes, 'expire_at', i.paiement_expire_at,
    'session_url', i.stripe_session_url,
    'seance_id', s.id, 'titre', s.titre, 'debut', s.debut,
    'compte', c.compte)
  from public.klub_inscriptions i
  join public.klub_seances s on s.id = i.seance_id
  join public.site_comptes_stripe c on c.user_id = s.praticien_id and c.etat = 'pret'
  where (i.id = p_inscription or i.jeton = p_jeton)
    and i.statut = 'paiement' and i.paiement_expire_at > now();
$$;
revoke all on function public.klub_paiement_infos(uuid, text) from public, anon, authenticated;
grant execute on function public.klub_paiement_infos(uuid, text) to service_role;
```

- [ ] **Step 2: Appliquer** — `name` = `klub_inscription_payante`.

- [ ] **Step 3: Scénarios, section B** — dans `klub_paiement.sql`. Prépare une séance en Lucas, à capacité 2 et prix 1500, rattachée à Lucas, et un compte `acct_test` à l'état `pret` :
  - B1 : `klub_inscrire` (fonction publique, sans session) d'une adresse renvoie `statut = 'paiement'` et un `inscription_id` ; aucun mail `confirmation` en file ; `places_restantes` passe à 1.
  - B2 : une 2e adresse → `paiement` ; une 3e → `attente`.
  - B3 : `klub_paiement_session` puis `klub_paiement_confirme(session, 'pi_1', 1500)` → `confirmee`, un mail `confirmation` en file. Un second appel → `deja`, toujours un seul mail.
  - B4 : forcer `paiement_expire_at` de la 2e inscription dans le passé, puis appeler `klub_paiements_expirer()` : elle passe `annulee` ; la 3e passe en `paiement`, avec un mail `place_liberee` et un `paiement_expire_at` d'environ 6 h (à ±1 min).
  - B5 : `klub_paiement_infos(null, jeton de la 3e)` renvoie le compte et le montant ; pour une inscription confirmée, il renvoie null.
  - B6 : une séance identique **sans** compte prêt reste au fonctionnement actuel : la 1re inscription est `confirmee`, avec un mail `confirmation`.
  - B7 : une inscription depuis l'admin (`klub_admin_ajouter`, lis sa signature) sur la séance payante est `confirmee` d'office.

- [ ] **Step 4** : relance `klub.sql`, `klub_images.sql`, `klub_reservation.sql`, `notifications.sql`, en entier.

- [ ] **Step 5: Commit** — migration et scénarios, message « klub : une place réservée pendant le paiement, et la liste d'attente qui paie ».

---

### Task 4: Annulations et remboursements en base

**Files:** Create `supabase/migrations/20261013100200_klub_remboursements.sql`. Modify `supabase/tests/klub_paiement.sql` (section C).

Les remboursements passent tous par **une file**, vidée par la tâche minute : l'admin annule depuis le navigateur, qui ne peut pas appeler Stripe, et une file se rejoue sans risque.

- [ ] **Step 1: La migration**

```sql
-- Mugi Klub : annulations remboursées. Spec § 4.
alter table public.klub_inscriptions
  add column remboursement text check (remboursement in ('a_faire', 'fait', 'erreur')),
  add column remboursement_tentatives smallint not null default 0,
  add column remboursement_erreur text,
  add column stripe_remboursement text,
  add column rembourse_at timestamptz;

create index klub_inscriptions_a_rembourser on public.klub_inscriptions (updated_at) where remboursement = 'a_faire';

-- Met une inscription payée en file de remboursement, une fois.
create or replace function public.klub__a_rembourser(p_inscription uuid)
returns void
language sql
set search_path = ''
as $$
  update public.klub_inscriptions set remboursement = 'a_faire'
  where id = p_inscription and stripe_paiement is not null and remboursement is null;
$$;
revoke all on function public.klub__a_rembourser(uuid) from public, anon, authenticated;
```

Puis **redéfinis à partir de la production** :

1. **`klub__annuler(p_inscription uuid, p_admin boolean)`** : après le passage en `annulee`, si `not p_admin` et `s.debut - now() > interval '24 hours'`, appeler `perform public.klub__a_rembourser(i.id)`. Le JSON renvoyé gagne `'rembourse', <booléen>`. Le remboursement d'une annulation par l'admin se décide dans la fonction suivante, pas ici.

2. **`klub_admin_annuler_inscription`** : ajoute un paramètre `p_rembourser boolean default false`. Le changement de signature crée une nouvelle fonction : `drop function` l'ancienne signature, après avoir vérifié en base que rien d'autre ne l'appelle. Si `p_rembourser`, appeler `klub__a_rembourser`. Re-donne les mêmes `grant` que l'ancienne.

3. **`klub_admin_annuler_seance`** : chaque inscription payée de la séance est mise en file (`klub__a_rembourser`), en plus de ce qu'elle fait déjà.

4. **`klub_paiement_confirme`** (tâche 3) : dans le cas `tardif`, appeler `klub__a_rembourser(i.id)` avant de renvoyer.

5. **`klub_annulation_infos`** : ajoute `'paye', i.stripe_paiement is not null` et `'rembourse_si_annule', i.stripe_paiement is not null and s.debut - now() > interval '24 hours'`.

Puis les fonctions de service de la file :

```sql
create or replace function public.klub_remboursements_a_faire(p_limite integer)
returns table (inscription_id uuid, compte text, paiement text)
language sql
security definer
set search_path = ''
as $$
  select id, stripe_compte, stripe_paiement from public.klub_inscriptions
  where remboursement = 'a_faire'
  order by updated_at
  limit greatest(least(coalesce(p_limite, 10), 50), 1);
$$;

-- Résultat d'une tentative : un identifiant Stripe, ou une erreur.
-- Après 5 échecs, l'inscription passe en 'erreur' et n'est plus retentée.
create or replace function public.klub_remboursement_resultat(
  p_inscription uuid, p_remboursement text, p_erreur text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_remboursement is not null then
    update public.klub_inscriptions
    set remboursement = 'fait', stripe_remboursement = p_remboursement, rembourse_at = now(), remboursement_erreur = null
    where id = p_inscription and remboursement = 'a_faire';
  else
    update public.klub_inscriptions
    set remboursement_tentatives = remboursement_tentatives + 1,
        remboursement_erreur = left(p_erreur, 500),
        remboursement = case when remboursement_tentatives + 1 >= 5 then 'erreur' else 'a_faire' end
    where id = p_inscription and remboursement = 'a_faire';
  end if;
end;
$$;

-- Notification `charge.refunded` : un remboursement fait depuis le tableau
-- de bord Stripe du praticien est aussi constaté.
create or replace function public.klub_paiement_rembourse(p_paiement text, p_remboursement text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.klub_inscriptions
  set remboursement = 'fait', stripe_remboursement = coalesce(stripe_remboursement, p_remboursement),
      rembourse_at = coalesce(rembourse_at, now())
  where stripe_paiement = p_paiement and remboursement is distinct from 'fait';
$$;

revoke all on function public.klub_remboursements_a_faire(integer) from public, anon, authenticated;
revoke all on function public.klub_remboursement_resultat(uuid, text, text) from public, anon, authenticated;
revoke all on function public.klub_paiement_rembourse(text, text) from public, anon, authenticated;
grant execute on function public.klub_remboursements_a_faire(integer) to service_role;
grant execute on function public.klub_remboursement_resultat(uuid, text, text) to service_role;
grant execute on function public.klub_paiement_rembourse(text, text) to service_role;

-- Comptes Stripe : création et état, par le serveur.
create or replace function public.site_compte_stripe_enregistrer(p_user uuid, p_compte text, p_etat text)
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.site_comptes_stripe (user_id, compte, etat) values (p_user, p_compte, p_etat)
  on conflict (user_id) do update set compte = excluded.compte, etat = excluded.etat, updated_at = now();
$$;

create or replace function public.site_compte_stripe_etat(p_compte text, p_etat text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.site_comptes_stripe set etat = p_etat, updated_at = now() where compte = p_compte;
$$;
revoke all on function public.site_compte_stripe_enregistrer(uuid, text, text) from public, anon, authenticated;
revoke all on function public.site_compte_stripe_etat(text, text) from public, anon, authenticated;
grant execute on function public.site_compte_stripe_enregistrer(uuid, text, text) to service_role;
grant execute on function public.site_compte_stripe_etat(text, text) to service_role;
```

- [ ] **Step 2: Appliquer** — `name` = `klub_remboursements`.

- [ ] **Step 3: Scénarios, section C** :
  - C1 : une inscription payée (passée par `klub_paiement_confirme`) sur une séance à 3 jours, annulée par `klub_annuler(jeton)` → `remboursement = 'a_faire'`, et le JSON dit `rembourse = true`.
  - C2 : la même chose sur une séance à 10 h → pas de remboursement, `rembourse = false`.
  - C3 : `klub_admin_annuler_seance` en Lucas → toutes les inscriptions payées en `a_faire`, les non payées intactes.
  - C4 : `klub_admin_annuler_inscription(…, p_rembourser => false)` → rien en file ; avec `true` → en file.
  - C5 : `klub_remboursement_resultat(id, 're_1', null)` → `fait` ; une seconde fois ne change rien. Avec une erreur, cinq fois → `erreur`.
  - C6 : paiement tardif. Expirer une inscription en `paiement` avec `klub_paiements_expirer`, puis appeler `klub_paiement_confirme` → `tardif`, et elle est en `a_faire`.
  - C7 : `klub_paiement_rembourse('pi_x', 're_x')` deux fois → `fait`, avec `re_x`.
  - C8 : `klub_annulation_infos` donne `rembourse_si_annule` juste, de part et d'autre des 24 h.

- [ ] **Step 4** : relance tous les fichiers de scénarios du Klub, et `notifications.sql`.

- [ ] **Step 5: Commit** — « klub : annulations remboursées, par une file que la tâche minute vide ».

---

### Task 5: Stripe côté serveur — client, notifications

**Files:** Create `lib/stripe.ts`, `app/api/stripe/webhook/route.ts`. Modify `package.json` (dépendance).

- [ ] **Step 1** : `npm install stripe`. Lis `node_modules/stripe/package.json` (version) et les types de `checkout.sessions.create`, `accounts.create`, `accountLinks.create`, `refunds.create`, `webhooks.constructEvent`. N'ajoute pas d'`apiVersion` différente de celle du SDK.

- [ ] **Step 2: `lib/stripe.ts`**

```ts
import Stripe from "stripe";

/**
 * Stripe, côté serveur seulement. Les paiements sont « directs » : la session
 * est créée sur le compte Stripe du praticien (en-tête Stripe-Account), qui
 * est le vendeur. Mugitu ne prend aucune part.
 *
 * La clé vit dans STRIPE_SECRET_KEY, posée par Lucas dans Vercel. Sans elle,
 * chaque appel lève une erreur claire ; le build n'en dépend pas.
 */

let client: Stripe | null = null;

export function stripe(): Stripe {
  if (typeof window !== "undefined") throw new Error("[stripe] appelé depuis le navigateur");
  const cle = process.env.STRIPE_SECRET_KEY?.trim();
  if (!cle) throw new Error("[stripe] STRIPE_SECRET_KEY absente");
  client ??= new Stripe(cle);
  return client;
}

export function etatCompte(c: Stripe.Account): "pret" | "verification" {
  return c.charges_enabled && c.details_submitted ? "pret" : "verification";
}

export async function creerSessionPaiement(p: {
  compte: string;
  inscriptionId: string;
  email: string;
  titre: string;
  montantCentimes: number;
  origine: string;
  jeton: string;
  expireAt: Date;
}): Promise<{ id: string; url: string }> {
  const session = await stripe().checkout.sessions.create(
    {
      mode: "payment",
      customer_email: p.email,
      line_items: [
        {
          quantity: 1,
          price_data: { currency: "eur", unit_amount: p.montantCentimes, product_data: { name: p.titre } },
        },
      ],
      metadata: { inscription_id: p.inscriptionId },
      payment_intent_data: { metadata: { inscription_id: p.inscriptionId } },
      expires_at: Math.floor(p.expireAt.getTime() / 1000),
      success_url: `${p.origine}/mugi-klub/paiement?etat=recu&jeton=${p.jeton}`,
      cancel_url: `${p.origine}/mugi-klub/paiement?etat=abandon&jeton=${p.jeton}`,
    },
    { stripeAccount: p.compte, idempotencyKey: `session-${p.inscriptionId}-${p.expireAt.getTime()}` },
  );
  if (!session.url) throw new Error("[stripe] session sans adresse");
  return { id: session.id, url: session.url };
}

export async function rembourser(p: { compte: string; paiement: string; inscriptionId: string }): Promise<string> {
  const r = await stripe().refunds.create(
    { payment_intent: p.paiement },
    { stripeAccount: p.compte, idempotencyKey: `remboursement-${p.inscriptionId}` },
  );
  return r.id;
}
```

Le jeton d'annulation dans l'URL de retour sert à afficher la séance sur la page de retour. Il est déjà envoyé en clair dans les mails : ce n'est pas une nouvelle exposition. **Vérifie** que la durée accordée à `expires_at` est bien dans la plage acceptée par le SDK (30 min à 24 h).

- [ ] **Step 3: La route des notifications** — `app/api/stripe/webhook/route.ts`. Lis d'abord la doc des route handlers de cette version de Next.js (lecture du corps brut).

```ts
import { revalidatePath } from "next/cache";
import { after, NextResponse } from "next/server";
import type Stripe from "stripe";
import { envoyerFile } from "@/lib/klub/envoi";
import { ROUTES } from "@/lib/routes";
import { etatCompte, stripe } from "@/lib/stripe";
import { rpcService } from "@/lib/supabase-service";

/**
 * POST /api/stripe/webhook — les notifications des comptes reliés (Connect).
 * La signature est vérifiée avant toute lecture. Chaque traitement est
 * idempotent en base : Stripe peut renvoyer un événement.
 */

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[stripe] STRIPE_WEBHOOK_SECRET absente");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  const signature = request.headers.get("stripe-signature");
  const corps = await request.text();
  let evt: Stripe.Event;
  try {
    evt = stripe().webhooks.constructEvent(corps, signature ?? "", secret);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  try {
    switch (evt.type) {
      case "checkout.session.completed": {
        const s = evt.data.object;
        if (s.payment_status !== "paid" || typeof s.payment_intent !== "string") break;
        const r = await rpcService<string>("klub_paiement_confirme", {
          p_session: s.id,
          p_paiement: s.payment_intent,
          p_montant: s.amount_total ?? 0,
        });
        if (!r.ok) throw new Error(`klub_paiement_confirme ${r.status}`);
        revalidatePath(ROUTES.klub);
        after(() => envoyerFile(10));
        break;
      }
      case "checkout.session.expired": {
        const r = await rpcService<number>("klub_paiements_expirer", {});
        if (!r.ok) throw new Error(`klub_paiements_expirer ${r.status}`);
        break;
      }
      case "account.updated": {
        const c = evt.data.object;
        const r = await rpcService<null>("site_compte_stripe_etat", { p_compte: c.id, p_etat: etatCompte(c) });
        if (!r.ok) throw new Error(`site_compte_stripe_etat ${r.status}`);
        break;
      }
      case "charge.refunded": {
        const ch = evt.data.object;
        const remb = ch.refunds?.data?.[0]?.id ?? null;
        if (typeof ch.payment_intent === "string" && ch.refunded) {
          const r = await rpcService<null>("klub_paiement_rembourse", { p_paiement: ch.payment_intent, p_remboursement: remb });
          if (!r.ok) throw new Error(`klub_paiement_rembourse ${r.status}`);
        }
        break;
      }
    }
  } catch (e) {
    // 500 : Stripe renverra l'événement plus tard.
    console.error("[stripe] traitement en échec", evt.type, e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
```

**Vérifie** que `revalidatePath` et `after` s'emploient ainsi dans ce dépôt : copie leur usage dans `app/api/klub/inscription/route.ts`.

- [ ] **Step 4** : `npx tsc --noEmit && npm run lint && npm run build` — tout passe, sans variable Stripe définie.

- [ ] **Step 5: Commit** — `package.json`, `package-lock.json`, `lib/stripe.ts`, la route. Message « klub : Stripe côté serveur et ses notifications ».

---

### Task 6: Relier son compte Stripe depuis le back-office

**Files:** Create `lib/admin/session-serveur.ts`, `app/api/stripe/compte/route.ts`, `components/admin/klub/CompteStripe.tsx`. Modify `components/admin/KlubAdmin.tsx`.

- [ ] **Step 1: `lib/admin/session-serveur.ts`** — identifier l'appelant d'une route. Le navigateur envoie `Authorization: Bearer <access_token>` de sa session Supabase. Le serveur interroge Supabase Auth, puis vérifie l'appartenance à l'équipe **avec le jeton de l'appelant** :

```ts
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/supabase-config";

export type Appelant = { userId: string; email: string; jeton: string };

/** L'utilisateur connecté qui appelle la route, s'il fait partie de l'équipe ; sinon null. */
export async function appelantEquipe(request: Request): Promise<Appelant | null> {
  const auth = request.headers.get("authorization") ?? "";
  const jeton = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!jeton) return null;
  const entetes = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${jeton}`, "Content-Type": "application/json" };

  const u = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: entetes, cache: "no-store" });
  if (!u.ok) return null;
  const user = (await u.json()) as { id?: string; email?: string };
  if (!user.id) return null;

  const e = await fetch(`${SUPABASE_URL}/rest/v1/rpc/site_est_equipe`, { method: "POST", headers: entetes, body: "{}", cache: "no-store" });
  if (!e.ok || (await e.json()) !== true) return null;
  return { userId: user.id, email: user.email ?? "", jeton };
}
```

Vérifie le nom des exports de `lib/supabase-config.ts`, et que `site_est_equipe` est bien exécutable par `authenticated`.

- [ ] **Step 2: `app/api/stripe/compte/route.ts`**
  - `POST` : relier le compte. Identifier l'appelant (401 sinon). Lire sa ligne (`restService("site_comptes_stripe?user_id=eq.<id>&select=compte,etat")`). Sans ligne : `stripe().accounts.create({ type: "standard", email })`, puis `rpcService("site_compte_stripe_enregistrer", { p_user, p_compte, p_etat: "verification" })`. Ensuite `stripe().accountLinks.create({ account, type: "account_onboarding", refresh_url: \`${origine}/admin/mugi-klub?stripe=relancer\`, return_url: \`${origine}/admin/mugi-klub?stripe=retour\` })`, où `origine = new URL(request.url).origin`. Répondre `{ ok: true, url }`.
  - `GET` : synchroniser l'état, au retour de Stripe. Identifier l'appelant, lire sa ligne. S'il y a un compte : `stripe().accounts.retrieve(compte)` puis `site_compte_stripe_etat`. Répondre `{ ok: true, etat }`, où `etat` vaut `"a_relier"`, `"verification"` ou `"pret"`.
  - Toute erreur Stripe : journaliser, répondre 502 avec un message sobre.

- [ ] **Step 3: `components/admin/klub/CompteStripe.tsx`** — la carte « Encaisser en ligne », en tête de `KlubAdmin` :
  - le jeton de session vient de `supabaseBrowser().auth.getSession()` ;
  - au montage, `GET /api/stripe/compte` ; chargement par le motif `window.setTimeout(() => void charger(), 0)` ;
  - selon l'état :
    - « À relier » : bouton « Relier mon compte Stripe », qui fait `POST` puis `window.location.href = url` ;
    - « En vérification » : « Stripe vérifie votre compte. » et un bouton « Reprendre la vérification » (même `POST`) ;
    - « Prêt à encaisser » : « Les inscriptions à vos séances payantes se paient en ligne. » ;
  - une phrase sous le titre : « L'argent des inscriptions arrive sur votre compte Stripe. Mugitu ne prend aucune part. » ;
  - mêmes styles que les autres cartes du Klub (`components/admin/klub/styles.ts`).

- [ ] **Step 4** : tsc, lint, build. Commit « klub : relier son compte Stripe depuis le back-office ».

---

### Task 7: Le parcours visiteur payant

**Files:** Modify `app/api/klub/inscription/route.ts`, `lib/klub/types.ts`, `components/site/klub/KlubFormulaire.tsx`, `app/mugi-klub/seance/[id]/page.tsx` et les composants qui affichent le prix (`KlubCarte`, `KlubALaUne`). Create `app/api/klub/payer/route.ts`, `app/mugi-klub/paiement/page.tsx`.

- [ ] **Step 1: Types** — `ChampsSeance` gagne `prix_centimes: number | null`. `SeancePublique` gagne `paiement_en_ligne: boolean`. `ReponseInscription.statut` accepte `"paiement"`, et gagne `inscription_id: string`. Partout où un prix est affiché, utilise `prixAffiche()` de `lib/klub/paiement.ts`.

- [ ] **Step 2: Route d'inscription** — après `klub_inscrire`, si `r.data.statut === "paiement"` :
  1. `rpcService("klub_paiement_infos", { p_inscription: r.data.inscription_id, p_jeton: null })` ;
  2. si `session_url` existe déjà et que la session n'est pas expirée, la réutiliser ;
  3. sinon, `creerSessionPaiement` avec `expireAt = now + DUREE_SESSION_MIN` (et jamais au-delà de `expire_at` de l'inscription s'il est plus proche, en respectant le minimum de Stripe) et `origine = new URL(request.url).origin`. Puis `klub_paiement_session` ;
  4. répondre `{ ok: true, statut: "paiement", url }`.

  En cas d'échec Stripe : journaliser et répondre 502, « Le paiement en ligne est indisponible pour le moment. Réessayez dans quelques minutes. ». La place se libérera à l'expiration.

- [ ] **Step 3: `app/api/klub/payer/route.ts`** — `GET ?jeton=…`, le lien du mail `place_liberee` :
  - `klub_paiement_infos(null, jeton)` ;
  - si null : rediriger vers `/mugi-klub/paiement?etat=expire` ;
  - sinon : session réutilisée ou créée comme au step 2, puis redirection 303 vers Stripe.

- [ ] **Step 4: `app/mugi-klub/paiement/page.tsx`** — page de retour, `robots: { index: false }` :
  - `etat=recu` : « Paiement reçu. La confirmation arrive par e-mail. » ;
  - `etat=abandon` : « Paiement non effectué. Votre place reste réservée quelques minutes : vous pouvez reprendre depuis la page de la séance. » ;
  - `etat=expire` : « Ce lien a expiré : la place a été proposée à quelqu'un d'autre. ».

  Un lien vers `/mugi-klub` dans tous les cas. Ne fais **aucune** confirmation depuis cette page : seule la notification de Stripe confirme.

- [ ] **Step 5: `KlubFormulaire`** — sur `statut === "paiement"` avec une `url`, `window.location.assign(url)`. Le bouton d'envoi dit « Payer et réserver · 15 € » quand `seance.paiement_en_ligne` (montant via `prixAffiche`), sinon son libellé actuel. Sous le bouton, quand c'est payant : « Paiement sécurisé par Stripe. Annulation remboursée jusqu'à 24 h avant. »

- [ ] **Step 6: Page de séance** — sous le prix : « Paiement en ligne » si `paiement_en_ligne`, sinon « Paiement sur place » quand un prix est affiché.

- [ ] **Step 7** : tsc, lint, build, `npm test`. Commit « klub : payer sa séance en ligne ».

---

### Task 8: Mails, annulation, tâche minute

**Files:** Modify `lib/klub/mails.ts` (+ son test), `lib/klub/envoi.ts`, `app/mugi-klub/annulation/page.tsx` (et son composant), `app/api/klub/tache/route.ts`.

- [ ] **Step 1: Contexte des mails** — lis comment `envoi.ts` construit le `Contexte` de `composer()`. Ajoute à la lecture de l'inscription : `montant_centimes`, `stripe_paiement`, `remboursement`, `jeton`. Ajoute au `Contexte` : `paye: boolean`, `rembourse: boolean` (remboursement `a_faire` ou `fait`), `montant: number | null`, `lienPaiement: string | null` (`${SITE_URL}/api/klub/payer?jeton=…`), `expireAt: string | null`.

- [ ] **Step 2: Les textes** — avec un test par cas dans `lib/klub/mails.test.ts` :
  - `confirmation` payée : ajoute « Paiement reçu : 15 €. Le reçu de Stripe arrive dans un mail séparé. » ;
  - nouveau `place_liberee` : sujet « Une place s'est libérée : {titre} » ; corps : la séance, « Elle vous est gardée jusqu'à {heure, date}. », bouton « Payer et réserver » vers `lienPaiement`, « Sans paiement d'ici là, elle sera proposée à la personne suivante. » ;
  - `annulation` payée : « Le remboursement de 15 € est en cours. Il apparaît sous 5 à 10 jours sur le moyen de paiement utilisé. » si remboursé, sinon « L'annulation intervient moins de 24 h avant la séance : elle reste due. » ;
  - `seance_annulee` payée : « Le remboursement de 15 € est en cours. »

- [ ] **Step 3: Page d'annulation** — avant la confirmation, si `paye` :
  - « Annulation remboursée : 15 € » si `rembourse_si_annule` ;
  - sinon « Annulation à moins de 24 h : la séance reste due. ».

- [ ] **Step 4: Tâche minute** — dans `app/api/klub/tache/route.ts`, après `klub_tache` et avant l'envoi des mails :
  1. `rpcService("klub_paiements_expirer", {})` ;
  2. `rpcService("klub_remboursements_a_faire", { p_limite: 10 })`. Pour chaque ligne : `rembourser(...)`, puis `klub_remboursement_resultat` avec l'identifiant, ou avec l'erreur (message de l'exception, sans données de carte). Une erreur Stripe sur une ligne n'arrête pas les autres. Si `STRIPE_SECRET_KEY` est absente, on saute les remboursements et on journalise une fois.

  Ajoute au bilan renvoyé : `expirees`, `rembourses`, `echecs_remboursement`.

- [ ] **Step 5** : `npm test`, tsc, lint, build. Commit « klub : mails, annulation et tâche minute du paiement ».

---

### Task 9: Le back-office — praticien, prix, remboursement

**Files:** Modify `components/admin/klub/ChampsSeanceForm.tsx`, `KlubCreneaux.tsx`, `KlubSeances.tsx`, `KlubSeanceDetail.tsx`, `rpc.ts`.

- [ ] **Step 1: Messages** — `ERREURS_ADMIN` de `rpc.ts` :
  - `KLUB_ENCAISSEMENT` : « Seuls Lucas et Jean-Baptiste choisissent le praticien qui encaisse une séance. Le prix se change sur ses propres séances. » ;
  - `KLUB_PRIX` : « Le prix doit être compris entre 0 et 1 000 €. ».

- [ ] **Step 2: Le formulaire** — sous le prix actuel, un bloc « Encaissement » :
  - **Prix** : un champ en euros (« 15 » ou « 12,50 ») converti en centimes, vide = pas de prix. Le libellé libre reste, avec l'aide « Affiché seulement si aucun prix n'est saisi (ex. Gratuit, Prix libre). » ;
  - **Praticien qui encaisse** : un menu des comptes de l'équipe. Les charger comme `ArticleAdmin` : `profiles` sur `user_id`, nom = prénom + nom. Le menu n'est modifiable que par un gérant (`useAccesCourant()` de `lib/admin/acces`) ; sinon il s'affiche en lecture seule ;
  - une ligne d'état : « Paiement en ligne » si le praticien choisi a un compte prêt ; sinon « Paiement sur place : <praticien> n'a pas relié de compte Stripe ». La lecture de `site_comptes_stripe` est permise au gérant, et au praticien pour lui-même. Pour un autre praticien, un non-gérant ne voit rien : affiche alors seulement « Paiement sur place si le praticien n'a pas relié de compte Stripe ».

  À l'enregistrement d'un créneau ou d'une séance, après l'appel existant, appeler `klub_admin_encaissement(cible, id, praticien, prix)` **seulement si l'un des deux a changé**, pour qu'un non-gérant qui ne touche pas au praticien ne lève pas d'erreur.

- [ ] **Step 3: La liste des inscrits** (`KlubSeanceDetail`) :
  - l'état de paiement de chaque inscription : « Payé 15 € », « Paiement en cours (jusqu'à HH:MM) », « Remboursement en cours », « Remboursé », « Remboursement en échec : <erreur> ». Ajoute les colonnes au `select` ;
  - l'annulation d'une inscription payée demande « Rembourser 15 € ? », avec deux boutons « Annuler et rembourser » et « Annuler sans rembourser ». Ensuite `klub_admin_annuler_inscription` avec `p_rembourser` ;
  - à l'annulation de la séance, le texte de confirmation dit « Les N personnes qui ont payé seront remboursées. » quand N > 0.

- [ ] **Step 4** : tsc, lint, build. Commit « klub : praticien, prix et remboursement dans le back-office ».

---

### Task 10: Vérification d'ensemble (session principale)

- [ ] `npm test`, `npx tsc --noEmit`, `npm run lint`, `npm run build`.
- [ ] Les scénarios SQL : `klub_paiement.sql`, `klub.sql`, `klub_images.sql`, `klub_reservation.sql`, `notifications.sql`, `admin.sql`, chacun en entier.
- [ ] Relecture visuelle du formulaire public et du back-office (page d'essai temporaire non commitée si la connexion manque).
- [ ] **Mode test Stripe** : bloqué tant que Lucas n'a pas créé le compte plateforme et posé les clés de test. Le parcours de la spec § 8.3 se déroule alors avec les cartes de test de Stripe.
- [ ] Pousser, ouvrir la PR vers `main`. **Ne pas fusionner** sans l'accord de Lucas et sans le parcours en mode test.
