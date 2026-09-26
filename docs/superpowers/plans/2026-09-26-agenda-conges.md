# Agenda du cabinet, congés et semaine réelle (C1b) — plan d'implémentation

> **Pour les exécutants agentiques :** SOUS-COMPÉTENCE REQUISE — utiliser `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans` pour exécuter ce plan tâche par tâche. Les étapes se suivent en cochant les cases (`- [ ]`).

**But :** chacun déclare ses absences, et la grille du cabinet se lit semaine par semaine sur le calendrier réel — qui tient quelle salle, et qui n'est pas là.

**Architecture :** une table `agenda_absences`, purement déclarative, dont un déclencheur `security definer` prévient les gérants. Un module de dates pur, `lib/agenda/semaine.ts`, testable sans réseau, qui projette la semaine type sur des dates réelles. La grille existante gagne deux entrées facultatives — le lundi affiché et les absences — et reste utilisable sans elles.

**Pile :** Next.js 16 App Router, React 19, Supabase (projet `nuehdfyscqnkckudkqhe`), `node --test`.

**Spec :** `docs/superpowers/specs/2026-09-25-agenda-cabinet-design.md`, section 2 bis. Ce plan couvre la livraison **C1b** de la section 4 bis. `agenda_exceptions` n'en fait pas partie : elle part avec C1c, son unique producteur.

**Ce qui est déjà en production**, livré par C1a (PR #30, `c8dd4e8`) : `agenda_voeux`, `agenda_commentaires`, `agenda_mails`, les fonctions `agenda_decider`, `agenda_demander_retrait`, `agenda_trancher_retrait`, `agenda_commenter`, le déclencheur `agenda__garde_transition`, `lib/agenda/{salles,types,grille}.ts`, `components/admin/agenda/{AgendaAdmin,Grille,CaseDetail,rpc}.tsx`, et la route de cron `/api/agenda/tache`.

---

## Règles pour l'exécutant

1. **Lire `AGENTS.md` à la racine.** Cette version de Next.js a des ruptures d'API. Avant d'utiliser une API Next que tu n'as pas déjà vue employée dans ce dépôt, lis le guide correspondant dans `node_modules/next/dist/docs/`.
2. **Base de production.** Le projet `nuehdfyscqnkckudkqhe` contient les vraies données du cabinet. Migrations avec `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration`, lectures avec `..._execute_sql`, `project_id` passé explicitement. **Ne jamais utiliser les outils `mcp__supabase__*`**, qui pointent sur un autre projet.
3. **Ne créer que les objets de ce plan.** Ne pas toucher `user_roles`, `is_practitioner()`, `profiles`, `articles`, ni aucune table `klub_*` ou `site_*`. **Une seule exception, explicitement prévue par la tâche 1** : remplacer la contrainte `agenda_mails_type_check` pour y ajouter le type `absence`. Aucun autre `alter`, aucun `drop`.
4. **Tout essai destructif dans `begin; … rollback;`.**
5. **`profiles.id` n'est pas `profiles.user_id`.** La première est la clé propre de la table, la seconde référence `auth.users`. Elles ne coïncident sur aucune ligne. Tout ce qui se joint à `auth.users` passe par `user_id`. Ce piège a cassé deux écrans en une journée sans lever d'erreur.
6. **Lint React Compiler** : pas de `setState` dans le corps d'un effet, pas de mutation pendant le rendu. Le motif du dépôt est `window.setTimeout(() => void charger(), 0)`. `npm run lint` doit finir **sans aucun avertissement** ; s'il en apparaît un, il vient de toi.
7. **Le code de ce plan n'a jamais été compilé.** Si une signature du dépôt diffère de ce qu'il écrit, **suis le dépôt** et dis précisément ce qui différait. Ce n'est pas une faute.
8. **Commits.** `git add <chemins explicites>`, jamais `-a` ni `-am`. Messages en français, au style des commits existants.
9. Ne rien pousser et n'ouvrir aucune PR avant la tâche 6.

## Carte des fichiers

| Fichier | Responsabilité |
|---|---|
| `supabase/migrations/20260926110000_agenda_absences.sql` | La table, sa RLS, le type de mail et le déclencheur qui prévient les gérants |
| `supabase/tests/agenda_absences.sql` | Scénarios de droits, en transaction annulée |
| `lib/agenda/semaine.ts` | Calculs de dates purs : lundi d'une semaine, projection, absence à une date |
| `lib/agenda/semaine.test.ts` | Tests unitaires de `semaine.ts` |
| `lib/agenda/types.ts` | Ajouter le type `Absence` |
| `components/admin/agenda/MesConges.tsx` | La liste des plages, l'ajout, le retrait |
| `components/admin/agenda/Grille.tsx` | Accepter le lundi affiché et les absences, griser les absents |
| `components/admin/agenda/AgendaAdmin.tsx` | Le troisième onglet, le sélecteur de semaine, le chargement des absences |

---

### Task 0: Espace de travail

- [ ] **Step 1: Vérifier l'état de départ**

```bash
cd /Users/lucas/Desktop/mugitu-biarritz-admin
git status --short
git log --oneline -2
```

Attendu : arbre propre, branche `feature/agenda-conges`, dernier commit `01de239 agenda : les exceptions datées passent de C1b à C1c`.

- [ ] **Step 2: Vérifier les tests existants**

Run: `npm test`
Attendu : 37 tests passent.

---

### Task 1: La table des absences

**Files:**
- Create: `supabase/migrations/20260926110000_agenda_absences.sql`

- [ ] **Step 1: Écrire la migration**

```sql
-- Agenda du cabinet : les absences.
--
-- Purement déclaratif : on ne demande pas la permission de prendre ses
-- congés. Chacun pose et retire les siennes, les gérants peuvent en retirer
-- une pour faire le ménage, toute l'équipe les lit. Les gérants reçoivent un
-- mail : c'est une information dont ils ont besoin pour tenir le cabinet,
-- pas une décision à prendre.
--
-- Une absence ne libère pas la case. Elle la marque absente sur les semaines
-- concernées. Qui veut en profiter passera par une demande d'échange
-- ponctuelle (chantier C1c) : l'arbitrage reste au même endroit.

create table public.agenda_absences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  du date not null,
  au date not null,
  motif text,
  created_at timestamptz not null default now(),
  constraint agenda_absences_ordre check (au >= du)
);

-- Les plages qui se chevauchent sont permises : ce qui compte est « telle
-- personne est-elle absente tel jour », et l'union de deux plages répond
-- aussi bien qu'une seule.
create index agenda_absences_personne on public.agenda_absences (user_id, du, au);
create index agenda_absences_periode on public.agenda_absences (du, au);

alter table public.agenda_absences enable row level security;

create policy agenda_absences_lecture on public.agenda_absences
  for select to authenticated using (public.site_est_equipe());

create policy agenda_absences_creation on public.agenda_absences
  for insert to authenticated
  with check (public.site_est_equipe() and user_id = auth.uid());

create policy agenda_absences_suppression on public.agenda_absences
  for delete to authenticated
  using (public.site_est_equipe() and (user_id = auth.uid() or public.site_est_super_admin()));

-- Pas de politique de modification : une plage se retire et se repose. Une
-- absence modifiable demanderait de reprévenir les gérants à chaque retouche.

revoke all on public.agenda_absences from anon;
grant select, insert, delete on public.agenda_absences to authenticated;

-- Le type de mail « absence » rejoint la file. Remplacer la contrainte est
-- la seule modification d'un objet existant que ce chantier s'autorise.
alter table public.agenda_mails drop constraint agenda_mails_type_check;
alter table public.agenda_mails add constraint agenda_mails_type_check
  check (type in ('voeu_valide', 'voeu_refuse', 'retrait_demande', 'retrait_tranche',
                  'commentaire', 'absence'));

-- Prévenir les gérants, à la pose comme au retrait. `security definer`
-- parce que `agenda__mettre_en_file` leur est fermée, et que la fonction
-- lit `auth.users` et `profiles`.
create or replace function public.agenda__absence_signaler()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_ligne record := coalesce(new, old);
  v_pose boolean := new is not null;
  v_nom text;
  v_gerant record;
  v_periode text;
begin
  select coalesce(p.first_name || ' ' || p.last_name, u.email) into v_nom
    from auth.users u
    left join public.profiles p on p.user_id = u.id
   where u.id = v_ligne.user_id;

  v_periode := case
    when v_ligne.du = v_ligne.au then 'le ' || to_char(v_ligne.du, 'DD/MM/YYYY')
    else 'du ' || to_char(v_ligne.du, 'DD/MM/YYYY') || ' au ' || to_char(v_ligne.au, 'DD/MM/YYYY')
  end;

  for v_gerant in select user_id from public.site_super_admins loop
    perform public.agenda__mettre_en_file('absence', v_gerant.user_id,
      case when v_pose
        then 'Absence déclarée : ' || coalesce(v_nom, '?') || ', ' || v_periode
        else 'Absence retirée : ' || coalesce(v_nom, '?') || ', ' || v_periode end,
      coalesce(nullif(btrim(coalesce(v_ligne.motif, '')), ''), 'Sans motif précisé.'));
  end loop;

  return v_ligne;
end;
$$;

revoke all on function public.agenda__absence_signaler() from public, anon, authenticated;

create trigger agenda_absences_signaler
  after insert or delete on public.agenda_absences
  for each row execute function public.agenda__absence_signaler();
```

- [ ] **Step 2: Appliquer la migration**

Outil `apply_migration`, `project_id` = `nuehdfyscqnkckudkqhe`, `name` = `agenda_absences`.

- [ ] **Step 3: Vérifier les objets et les droits**

```sql
select
  (select count(*) from information_schema.tables
    where table_schema='public' and table_name='agenda_absences') as table_creee,
  (select count(*) from pg_policies where schemaname='public' and tablename='agenda_absences') as politiques,
  (select count(*) from information_schema.role_table_grants
    where table_schema='public' and table_name='agenda_absences' and grantee='anon') as droits_anon,
  (select pg_get_constraintdef(con.oid) from pg_constraint con
     join pg_class c on c.oid = con.conrelid
    where c.relname='agenda_mails' and con.conname='agenda_mails_type_check') as type_mail,
  has_function_privilege('anon', 'public.agenda__absence_signaler()', 'execute') as signaler_anon;
```

Attendu : `table_creee` 1, `politiques` 3, `droits_anon` 0, `type_mail` contenant `absence`, `signaler_anon` faux.

- [ ] **Step 4: Éprouver le déclencheur en transaction annulée**

```sql
begin;
do $$
declare
  v_hugo uuid; v_id uuid; v_avant int; v_apres int;
begin
  select id into v_hugo from auth.users where email = 'hugo.daminato@gmail.com';
  select count(*) into v_avant from public.agenda_mails where type = 'absence';

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.agenda_absences (user_id, du, au, motif)
  values (v_hugo, '2026-07-13', '2026-07-26', 'Congés') returning id into v_id;
  reset role;

  select count(*) into v_apres from public.agenda_mails where type = 'absence';
  assert v_apres > v_avant, 'le déclencheur n''a pas mis de mail en file à la pose';

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  delete from public.agenda_absences where id = v_id;
  reset role;

  assert (select count(*) from public.agenda_mails where type = 'absence') > v_apres,
         'le déclencheur n''a pas mis de mail en file au retrait';
end $$;
rollback;
select 'déclencheur d''absence : OK' as resultat,
       (select count(*) from public.agenda_absences) as absences,
       (select count(*) from public.agenda_mails) as mails;
```

Attendu : `déclencheur d'absence : OK`, `absences` 0, `mails` 0.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260926110000_agenda_absences.sql
git commit -m "$(cat <<'EOF'
agenda : les absences, déclaratives et signalées aux gérants

On ne demande pas la permission de prendre ses congés : chacun pose et
retire les siennes, aucune validation. Les gérants sont prévenus par un
mail, parce que c'est une information dont ils ont besoin pour tenir le
cabinet.

Pas de politique de modification : une plage se retire et se repose. Une
absence modifiable demanderait de reprévenir à chaque retouche.

Les plages qui se chevauchent sont permises : ce qui compte est « telle
personne est-elle absente tel jour ».
EOF
)"
```

---

### Task 2: Les scénarios de droits

**Files:**
- Create: `supabase/tests/agenda_absences.sql`

- [ ] **Step 1: Écrire le fichier**

```sql
-- Droits des absences de l'agenda. Tout se passe dans une transaction
-- annulée : rien n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « absences : scénarios OK ».

begin;

do $$
declare
  v_lucas uuid;
  v_hugo uuid;
  v_kine uuid;
  v_id uuid;
  v_sien uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_hugo is not null and v_kine is not null, 'A0 comptes absents';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);

  -- A1. Un praticien déclare son absence.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.agenda_absences (user_id, du, au, motif)
  values (v_hugo, '2026-08-03', '2026-08-16', 'Congés') returning id into v_sien;
  assert v_sien is not null, 'A1';

  -- A2. Il ne déclare pas l'absence d'un autre.
  begin
    insert into public.agenda_absences (user_id, du, au) values (v_kine, '2026-08-03', '2026-08-16');
    assert false, 'A2 un praticien déclare l''absence d''un autre';
  exception when insufficient_privilege then null;
  end;

  -- A3. Une plage à l'envers est refusée.
  begin
    insert into public.agenda_absences (user_id, du, au) values (v_hugo, '2026-08-16', '2026-08-03');
    assert false, 'A3 une plage à l''envers est acceptée';
  exception when check_violation then null;
  end;

  -- A4. Une plage d'un seul jour est permise.
  insert into public.agenda_absences (user_id, du, au) values (v_hugo, '2026-09-01', '2026-09-01');
  assert exists (select 1 from public.agenda_absences where user_id = v_hugo and du = '2026-09-01'), 'A4';

  -- A5. Les plages qui se chevauchent sont permises.
  insert into public.agenda_absences (user_id, du, au) values (v_hugo, '2026-08-10', '2026-08-20');
  assert (select count(*) from public.agenda_absences where user_id = v_hugo) = 3, 'A5';

  -- A6. Il retire la sienne.
  delete from public.agenda_absences where du = '2026-09-01' and user_id = v_hugo;
  assert not exists (select 1 from public.agenda_absences where du = '2026-09-01' and user_id = v_hugo), 'A6';
  reset role;

  -- A7. Un tiers ne retire pas celle d'un autre.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  set local role authenticated;
  delete from public.agenda_absences where id = v_sien;
  assert exists (select 1 from public.agenda_absences where id = v_sien), 'A7 un tiers a retiré une absence';

  -- A8. Mais il la lit : la vision d'ensemble est le but.
  assert (select count(*) from public.agenda_absences where user_id = v_hugo) = 2, 'A8';

  -- A9. On ne modifie pas une absence, on la retire et on la repose.
  update public.agenda_absences set au = '2026-12-31' where id = v_sien;
  assert (select au from public.agenda_absences where id = v_sien) = date '2026-08-16', 'A9 une absence a été modifiée';
  reset role;

  -- A10. Un gérant retire n'importe laquelle, pour faire le ménage.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  set local role authenticated;
  delete from public.agenda_absences where id = v_sien;
  assert not exists (select 1 from public.agenda_absences where id = v_sien), 'A10';
  reset role;

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  begin
    assert (select count(*) from public.agenda_absences) = 0, 'P1 anon lit les absences';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'absences : scénarios OK' as resultat;
```

- [ ] **Step 2: Lancer les scénarios**

Outil `execute_sql`, `project_id` = `nuehdfyscqnkckudkqhe`, `query` = le contenu du fichier.
Attendu : `[{"resultat":"absences : scénarios OK"}]`.

Si un `assert` échoue, deux lectures : le scénario est mal écrit, ou la migration de la tâche 1 a un vrai défaut. **Ne pas modifier le scénario pour le faire passer sans avoir établi laquelle des deux.**

- [ ] **Step 3: Vérifier que rien n'a persisté**

```sql
select
  (select count(*) from public.agenda_absences) as absences,
  (select count(*) from public.agenda_mails) as mails,
  (select count(*) from public.site_super_admins) as super_admins;
```

Attendu : `{"absences":0,"mails":0,"super_admins":2}`.

- [ ] **Step 4: Commit**

```bash
git add supabase/tests/agenda_absences.sql
git commit -m "$(cat <<'EOF'
agenda : scénarios de droits sur les absences

Onze scénarios. Les deux qui comptent : personne ne déclare ni ne retire
l'absence d'un autre, et une absence ne se modifie pas — il n'y a aucune
politique d'update, donc l'UPDATE passe sans erreur mais ne change rien,
ce que A9 vérifie explicitement.
EOF
)"
```

---

### Task 3: Les calculs de dates

**Files:**
- Create: `lib/agenda/semaine.ts`
- Test: `lib/agenda/semaine.test.ts`
- Modify: `lib/agenda/types.ts`

- [ ] **Step 1: Écrire le test qui échoue**

`lib/agenda/semaine.test.ts` :

```ts
import assert from "node:assert/strict";
import test from "node:test";
import {
  absentLe,
  dateDuJour,
  decalerSemaine,
  libelleSemaine,
  lundiDe,
  personnesAbsentes,
} from "./semaine.ts";

const abs = (user: string, du: string, au: string) => ({ id: `${user}-${du}`, user_id: user, du, au, motif: null });

test("lundiDe ramène au lundi de la semaine", () => {
  // 2026-09-26 est un samedi ; son lundi est le 21.
  assert.equal(lundiDe("2026-09-26"), "2026-09-21");
  assert.equal(lundiDe("2026-09-21"), "2026-09-21");
  // Un dimanche appartient à la semaine qui commence la veille.
  assert.equal(lundiDe("2026-09-27"), "2026-09-21");
});

test("dateDuJour projette un jour de 1 à 5 sur une date", () => {
  assert.equal(dateDuJour("2026-09-21", 1), "2026-09-21");
  assert.equal(dateDuJour("2026-09-21", 5), "2026-09-25");
});

test("dateDuJour franchit un changement de mois", () => {
  assert.equal(dateDuJour("2026-09-28", 5), "2026-10-02");
});

test("absentLe couvre les bornes de la plage", () => {
  const a = [abs("u1", "2026-07-13", "2026-07-26")];
  assert.equal(absentLe(a, "u1", "2026-07-13"), true);
  assert.equal(absentLe(a, "u1", "2026-07-26"), true);
  assert.equal(absentLe(a, "u1", "2026-07-20"), true);
  assert.equal(absentLe(a, "u1", "2026-07-12"), false);
  assert.equal(absentLe(a, "u1", "2026-07-27"), false);
});

test("absentLe ne confond pas deux personnes", () => {
  const a = [abs("u1", "2026-07-13", "2026-07-26")];
  assert.equal(absentLe(a, "u2", "2026-07-20"), false);
});

test("des plages qui se chevauchent ne cassent rien", () => {
  const a = [abs("u1", "2026-08-03", "2026-08-16"), abs("u1", "2026-08-10", "2026-08-20")];
  assert.equal(absentLe(a, "u1", "2026-08-18"), true);
  assert.equal(absentLe(a, "u1", "2026-08-21"), false);
});

test("personnesAbsentes liste qui manque dans la semaine", () => {
  const a = [abs("u1", "2026-09-23", "2026-09-23"), abs("u2", "2026-10-05", "2026-10-09")];
  assert.deepEqual(personnesAbsentes(a, "2026-09-21"), ["u1"]);
  assert.deepEqual(personnesAbsentes(a, "2026-10-05"), ["u2"]);
  assert.deepEqual(personnesAbsentes(a, "2026-11-02"), []);
});

test("decalerSemaine avance et recule d’un multiple de sept jours", () => {
  assert.equal(decalerSemaine("2026-09-21", 1), "2026-09-28");
  assert.equal(decalerSemaine("2026-09-21", -1), "2026-09-14");
  assert.equal(decalerSemaine("2026-09-21", 0), "2026-09-21");
  // Franchir un changement de mois et une heure d’été.
  assert.equal(decalerSemaine("2026-10-26", 1), "2026-11-02");
});

test("libelleSemaine nomme la semaine sans ambiguïté", () => {
  assert.equal(libelleSemaine("2026-09-21"), "21 – 25 septembre 2026");
  assert.equal(libelleSemaine("2026-09-28"), "28 septembre – 2 octobre 2026");
});
```

- [ ] **Step 2: Lancer le test pour le voir échouer**

Run: `node --test lib/agenda/semaine.test.ts`
Attendu : ÉCHEC, `ERR_MODULE_NOT_FOUND` pour `./semaine.ts`.

- [ ] **Step 3: Écrire `lib/agenda/semaine.ts`**

```ts
import type { Absence } from "./types.ts";

/**
 * Calculs de dates de l'agenda. Purs, sans accès réseau : ce fichier est lu
 * tel quel par les tests `node --test`.
 *
 * Toutes les dates circulent en `AAAA-MM-JJ`, la forme que renvoie et
 * qu'attend Postgres pour un `date`. On compare donc des chaînes, ce qui
 * évite tout décalage de fuseau : construire un `Date` à partir d'une date
 * seule la place à minuit UTC, et l'afficher en heure de Paris la ramène
 * parfois au jour précédent.
 */

const MOIS = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** La date, en UTC, pour ne dépendre d'aucun fuseau local. */
function versDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

function versIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Le lundi de la semaine qui contient cette date. Dimanche appartient à la semaine commencée la veille. */
export function lundiDe(iso: string): string {
  const d = versDate(iso);
  const jour = d.getUTCDay(); // 0 = dimanche
  const recul = jour === 0 ? 6 : jour - 1;
  d.setUTCDate(d.getUTCDate() - recul);
  return versIso(d);
}

/** La date du jour `jour` (1 = lundi … 5 = vendredi) de la semaine commençant au `lundi` donné. */
export function dateDuJour(lundi: string, jour: number): string {
  const d = versDate(lundi);
  d.setUTCDate(d.getUTCDate() + (jour - 1));
  return versIso(d);
}

/** Décale une semaine de `n` semaines, en avant si `n` est positif. */
export function decalerSemaine(lundi: string, n: number): string {
  const d = versDate(lundi);
  d.setUTCDate(d.getUTCDate() + n * 7);
  return versIso(d);
}

/** Cette personne est-elle absente ce jour-là ? Les bornes de la plage sont incluses. */
export function absentLe(absences: Absence[], userId: string, iso: string): boolean {
  return absences.some((a) => a.user_id === userId && a.du <= iso && iso <= a.au);
}

/** Qui manque au moins un jour de la semaine ouvrée commençant à ce lundi. */
export function personnesAbsentes(absences: Absence[], lundi: string): string[] {
  const vendredi = dateDuJour(lundi, 5);
  const vus = new Set<string>();
  for (const a of absences) {
    // Deux plages se croisent si chacune commence avant que l'autre finisse.
    if (a.du <= vendredi && lundi <= a.au) vus.add(a.user_id);
  }
  return [...vus];
}

/** « 21 – 25 septembre 2026 », ou « 28 septembre – 2 octobre 2026 » à cheval sur deux mois. */
export function libelleSemaine(lundi: string): string {
  const d1 = versDate(lundi);
  const d2 = versDate(dateDuJour(lundi, 5));
  const m1 = MOIS[d1.getUTCMonth()];
  const m2 = MOIS[d2.getUTCMonth()];
  const an = d2.getUTCFullYear();
  if (m1 === m2 && d1.getUTCFullYear() === an) {
    return `${d1.getUTCDate()} – ${d2.getUTCDate()} ${m2} ${an}`;
  }
  return `${d1.getUTCDate()} ${m1} – ${d2.getUTCDate()} ${m2} ${an}`;
}
```

- [ ] **Step 4: Ajouter le type `Absence`**

À la fin de `lib/agenda/types.ts`, ajouter :

```ts
export type Absence = {
  id: string;
  user_id: string;
  /** `AAAA-MM-JJ`, comme le renvoie Postgres pour un `date`. */
  du: string;
  au: string;
  motif: string | null;
};
```

- [ ] **Step 5: Lancer les tests**

Run: `npm test`
Attendu : 46 tests passent (37 existants + 9 nouveaux).

Le script `test` de `package.json` couvre déjà `lib/agenda/*.test.ts` : rien à modifier.

- [ ] **Step 6: Vérifier types et lint**

Run: `npx tsc --noEmit && npm run lint`
Attendu : aucune sortie, aucune erreur, aucun avertissement.

- [ ] **Step 7: Commit**

```bash
git add lib/agenda/semaine.ts lib/agenda/semaine.test.ts lib/agenda/types.ts
git commit -m "$(cat <<'EOF'
agenda : les calculs de dates de la semaine réelle

Les dates circulent en chaînes « AAAA-MM-JJ » et se comparent comme
telles. Construire un Date à partir d'une date seule la place à minuit
UTC, et l'afficher en heure de Paris la ramène parfois au jour
précédent : la comparaison de chaînes évite tout ce piège.

Un dimanche appartient à la semaine commencée la veille, et les bornes
d'une plage d'absence sont incluses — les deux sont testés.
EOF
)"
```

---

### Task 4: L'écran des congés

**Files:**
- Create: `components/admin/agenda/MesConges.tsx`

- [ ] **Step 1: Écrire le composant**

```tsx
"use client";

import { useState } from "react";
import type { Absence, Personne } from "@/lib/agenda/types";

/**
 * Les absences : une liste de plages, qu'on ajoute et qu'on retire.
 *
 * Aucune validation à demander : on ne demande pas la permission de prendre
 * ses congés. Les gérants sont prévenus par un mail, posé par un
 * déclencheur en base — cet écran n'a donc rien à envoyer.
 *
 * Une absence ne se modifie pas : on la retire et on la repose. C'est ce
 * que dit la base, qui n'a aucune politique d'`update`.
 */

const CHAMP: React.CSSProperties = {
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid rgba(0,56,80,.16)",
  fontSize: 13.5,
  fontFamily: "inherit",
};

export default function MesConges({
  absences,
  personnes,
  moi,
  estGerant,
  onAjouter,
  onRetirer,
}: {
  absences: Absence[];
  personnes: Record<string, Personne>;
  moi: string;
  estGerant: boolean;
  onAjouter: (du: string, au: string, motif: string) => Promise<boolean>;
  onRetirer: (id: string) => Promise<boolean>;
}) {
  const [du, setDu] = useState("");
  const [au, setAu] = useState("");
  const [motif, setMotif] = useState("");
  const [occupe, setOccupe] = useState(false);

  const miennes = absences.filter((a) => a.user_id === moi);
  const autres = absences.filter((a) => a.user_id !== moi);

  const ajouter = async () => {
    setOccupe(true);
    const ok = await onAjouter(du, au || du, motif);
    setOccupe(false);
    if (ok) {
      setDu("");
      setAu("");
      setMotif("");
    }
  };

  const valide = du.length === 10 && (au.length === 0 || au >= du);

  return (
    <div>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(0,56,80,.65)" }}>
        Déclarez vos congés, formations et arrêts. Rien à faire valider : la grille du cabinet vous
        affichera absent sur les semaines concernées, et Lucas et Jean-Baptiste sont prévenus.
      </p>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          alignItems: "flex-end",
          background: "#fff",
          borderRadius: 12,
          padding: 14,
          marginBottom: 18,
          boxShadow: "0 2px 10px rgba(60,40,30,.06)",
        }}
      >
        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>Du</span>
          <input type="date" style={CHAMP} value={du} onChange={(e) => setDu(e.target.value)} />
        </label>
        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>Au (vide = un seul jour)</span>
          <input type="date" style={CHAMP} value={au} min={du || undefined} onChange={(e) => setAu(e.target.value)} />
        </label>
        <label style={{ display: "grid", gap: 4, flex: 1, minWidth: 160 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>Motif (facultatif)</span>
          <input type="text" style={CHAMP} value={motif} onChange={(e) => setMotif(e.target.value)} />
        </label>
        <button
          type="button"
          disabled={occupe || !valide}
          onClick={() => void ajouter()}
          style={{
            padding: "9px 16px",
            borderRadius: 999,
            border: "none",
            background: "#04A49B",
            color: "#fff",
            fontSize: 12.5,
            fontWeight: 600,
            cursor: occupe || !valide ? "not-allowed" : "pointer",
            opacity: occupe || !valide ? 0.55 : 1,
          }}
        >
          Ajouter
        </button>
      </div>

      <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#003850" }}>Mes absences</h3>
      {miennes.length === 0 ? (
        <p style={{ fontSize: 13, color: "rgba(0,56,80,.6)" }}>Aucune absence déclarée.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 22px" }}>
          {miennes.map((a) => (
            <Ligne
              key={a.id}
              absence={a}
              nom={null}
              occupe={occupe}
              onRetirer={async () => {
                setOccupe(true);
                await onRetirer(a.id);
                setOccupe(false);
              }}
            />
          ))}
        </ul>
      )}

      <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#003850" }}>Le reste de l’équipe</h3>
      {autres.length === 0 ? (
        <p style={{ fontSize: 13, color: "rgba(0,56,80,.6)" }}>Personne d’autre n’a déclaré d’absence.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {autres.map((a) => (
            <Ligne
              key={a.id}
              absence={a}
              nom={personnes[a.user_id]?.nom ?? "—"}
              occupe={occupe}
              onRetirer={
                estGerant
                  ? async () => {
                      setOccupe(true);
                      await onRetirer(a.id);
                      setOccupe(false);
                    }
                  : null
              }
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function Ligne({
  absence,
  nom,
  occupe,
  onRetirer,
}: {
  absence: Absence;
  nom: string | null;
  occupe: boolean;
  onRetirer: (() => Promise<void>) | null;
}) {
  return (
    <li
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 10,
        padding: "9px 0",
        borderTop: "1px solid rgba(0,56,80,.08)",
        fontSize: 13,
      }}
    >
      <span>
        {nom ? <strong style={{ marginRight: 6 }}>{nom}</strong> : null}
        {periode(absence)}
        {absence.motif ? <span style={{ opacity: 0.6 }}> · {absence.motif}</span> : null}
      </span>
      {onRetirer ? (
        <button
          type="button"
          disabled={occupe}
          onClick={() => void onRetirer()}
          style={{
            background: "none",
            border: "none",
            color: "#9E4433",
            fontSize: 12.5,
            cursor: occupe ? "not-allowed" : "pointer",
            padding: 0,
          }}
        >
          Retirer
        </button>
      ) : null}
    </li>
  );
}

function periode(a: Absence): string {
  if (a.du === a.au) return `le ${jour(a.du)}`;
  return `du ${jour(a.du)} au ${jour(a.au)}`;
}

function jour(iso: string): string {
  const [an, mois, j] = iso.split("-");
  return `${Number(j)}/${mois}/${an}`;
}
```

- [ ] **Step 2: Vérifier**

Run: `npx tsc --noEmit && npm run lint`
Attendu : aucune erreur. Le composant n'est pas encore branché : c'est la tâche 5.

Ne pas commiter : le commit est celui de la tâche 5.

---

### Task 5: Le sélecteur de semaine et la projection

**Files:**
- Modify: `components/admin/agenda/Grille.tsx`, `components/admin/agenda/AgendaAdmin.tsx`

- [ ] **Step 1: Griser les absents dans la grille**

Dans `components/admin/agenda/Grille.tsx` :

Ajouter aux imports :

```tsx
import { absentLe, dateDuJour } from "@/lib/agenda/semaine";
import type { Absence } from "@/lib/agenda/types";
```

Ajouter deux entrées facultatives aux props du composant, après `mode` :

```tsx
  /** Le lundi de la semaine affichée, en « AAAA-MM-JJ ». Absent en vue « Ma semaine ». */
  lundi?: string;
  absences?: Absence[];
```

Et dans le corps du `MOMENTS.map`, juste après le calcul de `nomOccupant`, ajouter :

```tsx
                  // Un occupant absent ce jour-là garde sa case, mais l'écran
                  // le dit : la semaine type ne bouge pas, seule sa lecture
                  // sur le calendrier réel change.
                  const absent =
                    lundi != null &&
                    absences != null &&
                    e.occupant != null &&
                    absentLe(absences, e.occupant.user_id, dateDuJour(lundi, i + 1));
```

Puis, dans le rendu du bouton, remplacer :

```tsx
                      {mode === "cabinet" && nomOccupant ? <span>{nomOccupant}</span> : null}
```

par :

```tsx
                      {mode === "cabinet" && nomOccupant ? (
                        <span style={absent ? { textDecoration: "line-through", opacity: 0.5 } : undefined}>
                          {nomOccupant}
                          {absent ? " · absent" : ""}
                        </span>
                      ) : null}
```

- [ ] **Step 2: Brancher le troisième onglet et le sélecteur**

Dans `components/admin/agenda/AgendaAdmin.tsx` :

Ajouter aux imports :

```tsx
import { decalerSemaine, libelleSemaine, lundiDe, personnesAbsentes } from "@/lib/agenda/semaine";
import type { Absence } from "@/lib/agenda/types";
import MesConges from "./MesConges";
```

Remplacer la déclaration du type `Onglet` par :

```tsx
type Onglet = "mienne" | "cabinet" | "conges";
```

Ajouter deux états, à la suite des existants :

```tsx
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [lundi, setLundi] = useState(() => lundiDe(new Date().toISOString().slice(0, 10)));
```

Dans `charger`, ajouter la lecture des absences au `Promise.all` — la requête devient :

```tsx
    const [v, p, c, ab] = await Promise.all([
      sb.from("agenda_voeux").select("*"),
      sb.from("profiles").select("user_id, first_name, last_name"),
      sb.from("agenda_commentaires").select("*").order("created_at"),
      sb.from("agenda_absences").select("*").order("du"),
    ]);
```

et, juste avant `setErreur(null)` :

```tsx
    setAbsences((ab.data ?? []) as Absence[]);
```

Ajouter deux actions, après `agir` :

```tsx
  const ajouterAbsence = useCallback(
    async (du: string, au: string, motif: string) => {
      if (!acces.userId) return false;
      const { error } = await supabaseBrowser()
        .from("agenda_absences")
        .insert({ user_id: acces.userId, du, au, motif: motif.trim() || null });
      if (error) {
        setErreur("Impossible d’enregistrer cette absence.");
        return false;
      }
      setErreur(null);
      await charger();
      return true;
    },
    [acces.userId, charger],
  );

  const retirerAbsence = useCallback(
    async (id: string) => {
      const { error } = await supabaseBrowser().from("agenda_absences").delete().eq("id", id);
      if (error) {
        setErreur("Impossible de retirer cette absence.");
        return false;
      }
      setErreur(null);
      await charger();
      return true;
    },
    [charger],
  );
```

Dans la liste des onglets, ajouter la troisième entrée :

```tsx
            ["mienne", "Ma semaine"],
            ["cabinet", "Le cabinet"],
            ["conges", "Mes congés"],
```

Juste avant le compteur par personne, ajouter le sélecteur de semaine :

```tsx
      {onglet === "cabinet" ? (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <button type="button" onClick={() => setLundi(decalerSemaine(lundi, -1))} style={FLECHE}>
            ‹
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#003850", minWidth: 200, textAlign: "center" }}>
            {libelleSemaine(lundi)}
          </span>
          <button type="button" onClick={() => setLundi(decalerSemaine(lundi, 1))} style={FLECHE}>
            ›
          </button>
          <button
            type="button"
            onClick={() => setLundi(lundiDe(new Date().toISOString().slice(0, 10)))}
            style={{ ...FLECHE, width: "auto", padding: "0 12px", fontSize: 12 }}
          >
            Cette semaine
          </button>
          {(() => {
            const manquants = personnesAbsentes(absences, lundi);
            if (manquants.length === 0) return null;
            return (
              <span style={{ fontSize: 12, color: "rgba(0,56,80,.6)" }}>
                Absents cette semaine : {manquants.map((id) => personnes[id]?.nom ?? "—").join(", ")}
              </span>
            );
          })()}
        </div>
      ) : null}
```

Et définir `FLECHE` près des autres constantes de style, avant le composant :

```tsx
const FLECHE: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 999,
  border: "1px solid rgba(0,56,80,.15)",
  background: "#fff",
  color: "#003850",
  fontSize: 16,
  lineHeight: 1,
  cursor: "pointer",
};
```

Enfin, remplacer le rendu de la grille par un aiguillage sur les trois onglets :

```tsx
      {onglet === "conges" ? (
        <MesConges
          absences={absences}
          personnes={personnes}
          moi={acces.userId ?? ""}
          estGerant={acces.estSuperAdmin}
          onAjouter={ajouterAbsence}
          onRetirer={retirerAbsence}
        />
      ) : (
        <Grille
          voeux={voeux}
          personnes={personnes}
          moi={acces.userId ?? ""}
          mode={onglet === "mienne" ? "mien" : "cabinet"}
          lundi={onglet === "cabinet" ? lundi : undefined}
          absences={onglet === "cabinet" ? absences : undefined}
          onCase={(salle, jour, moment) =>
            onglet === "mienne" ? void basculer(salle, jour, moment) : setOuverte({ salle, jour, moment })
          }
        />
      )}
```

Le compteur par personne, déjà conditionné à `onglet === "cabinet"`, ne change pas.

- [ ] **Step 3: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 46 tests, aucune erreur, aucun avertissement, `/admin/agenda` dans les routes.

Si le lint refuse quelque chose — dépendance manquante d'un `useCallback`, mutation pendant le rendu — corriger au minimum et le signaler.

- [ ] **Step 4: Commit**

```bash
git add components/admin/agenda/MesConges.tsx components/admin/agenda/Grille.tsx components/admin/agenda/AgendaAdmin.tsx
git commit -m "$(cat <<'EOF'
agenda : les congés et la lecture semaine par semaine

Un troisième onglet pour poser ses absences, et un sélecteur de semaine
sur la vue du cabinet : la grille se lit désormais sur le calendrier
réel, en barrant les occupants absents ce jour-là.

La semaine type ne bouge pas pour autant. Une absence ne libère pas la
case, elle la marque : profiter du créneau de quelqu'un passera par une
demande d'échange, au chantier suivant.

`Grille` reçoit le lundi et les absences en entrées facultatives, donc la
vue « Ma semaine » l'utilise inchangée.
EOF
)"
```

---

### Task 6: Vérification d'ensemble et mise en ligne

- [ ] **Step 1: Tout vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 46 tests, aucune erreur, aucun avertissement, `/admin/agenda` et `/api/agenda/tache` dans les routes.

Relancer les deux fichiers de scénarios avec `execute_sql` :
- `supabase/tests/agenda.sql` → `[{"resultat":"agenda : scénarios OK"}]`
- `supabase/tests/agenda_absences.sql` → `[{"resultat":"absences : scénarios OK"}]`

- [ ] **Step 2: Contrôle des droits effectifs**

Outil `get_advisors`, `project_id` = `nuehdfyscqnkckudkqhe`, `type` = `security`.
Attendu : aucune nouvelle alerte. `agenda_absences` ne doit **pas** apparaître sous « RLS enabled, no policy » : elle en a trois.

- [ ] **Step 3: Vérifier que la production est intacte**

```sql
select
  (select count(*) from public.site_super_admins) as super_admins,
  (select count(*) from public.user_roles) as roles,
  (select count(*) from public.articles) as articles,
  (select count(*) from public.agenda_absences) as absences,
  (select count(*) from public.klub_seances) as seances_klub;
```

Attendu : `super_admins` 2, `roles` 13, `articles` 23, `seances_klub` inchangé. `absences` vaut le nombre de vraies absences déclarées depuis la mise en ligne de C1b, donc 0 si personne n'a encore rien posé.

- [ ] **Step 4: Pousser et ouvrir la PR**

```bash
git push -u origin feature/agenda-conges
gh pr create --base main --title "Agenda du cabinet : congés et lecture semaine par semaine" --body "$(cat <<'EOF'
Deuxième des trois livraisons de l'agenda (C1b).

**Les congés**
- `agenda_absences` : une plage de dates, un motif facultatif, aucune validation à demander
- Chacun pose et retire les siennes ; les gérants peuvent en retirer une pour faire le ménage ; toute l'équipe les lit
- Un déclencheur prévient les gérants à la pose comme au retrait, par la file `agenda_mails`
- Aucune politique de modification : une plage se retire et se repose, plutôt que de reprévenir à chaque retouche
- Les plages qui se chevauchent sont permises : ce qui compte est « telle personne est-elle absente tel jour »

**La semaine réelle**
- Un sélecteur de semaine sur la vue du cabinet, qui part de la semaine en cours
- Les occupants absents ce jour-là apparaissent barrés, et la semaine annonce qui manque
- `lib/agenda/semaine.ts` est pur et testé : les dates circulent en chaînes `AAAA-MM-JJ` et se comparent comme telles, ce qui évite le décalage de fuseau d'un `Date` construit sur une date seule

**Une absence ne libère pas la case.** Elle la marque. Profiter du créneau de quelqu'un passera par une demande d'échange, au chantier suivant : l'arbitrage reste au même endroit.

**Écart avec la spec, assumé** : `agenda_exceptions` était rangée dans C1b. Rien ne l'écrit à la main — elle ne naît que d'un échange ponctuel accordé — donc la livrer ici aurait créé une table que rien ne remplit. Elle part avec son producteur, en C1c. La spec a été corrigée en conséquence.

**Ce qui n'est pas là** : les échanges de créneau (C1c), les notifications sur les articles et le Klub (C2), le parcours de prise en main dans l'admin (C3).

Spec : `docs/superpowers/specs/2026-09-25-agenda-cabinet-design.md`
Plan : `docs/superpowers/plans/2026-09-26-agenda-conges.md`

Vérifications : 46 tests, `tsc`, lint sans avertissement, build, et les deux fichiers de scénarios sur la base de production en transaction annulée. La migration est déjà appliquée.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Demander la fusion**

Ne pas fusionner sans l'accord de Lucas. Lui signaler ce qu'il doit essayer lui-même sur la prévisualisation :

- déclarer une absence depuis un compte praticien, et vérifier que JB et lui reçoivent le mail ;
- se placer sur la semaine de cette absence dans la vue du cabinet, et voir la personne barrée sur ses cases ;
- avancer d'une semaine, et vérifier qu'elle ne l'est plus.

---

## Ce que ce plan ne fait pas

- Les exceptions datées et les échanges de créneau : livraison C1c.
- Les notifications sur les articles et le Klub, et le récapitulatif quotidien : chantier C2.
- Le parcours de prise en main dans l'admin : chantier C3.
- La publication des présences sur le site : hors périmètre de la spec.
