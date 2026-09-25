# Agenda du cabinet, socle (C1a) — plan d'implémentation

> **Pour les exécutants agentiques :** SOUS-COMPÉTENCE REQUISE — utiliser `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans` pour exécuter ce plan tâche par tâche. Les étapes se suivent en cochant les cases (`- [ ]`).

**But :** chacun déclare ses demi-journées souhaitées dans les cinq salles, les gérants arbitrent, refusent avec un mot ou accordent, et un vœu accordé ne se retire que sur demande tranchée.

**Architecture :** deux tables (`agenda_voeux`, `agenda_commentaires`) fermées à `anon`, dont les transitions d'état passent toutes par des fonctions `security definer` — une politique RLS ne sait pas dire « cette colonne-ci, pas celle-là ». Une file de mails `agenda_mails` dénormalisée, vidée par sa propre route de cron. Les écrans réutilisent la coque d'admin du chantier A.

**Pile :** Next.js 16 App Router, React 19, Supabase (projet `nuehdfyscqnkckudkqhe`), Brevo pour les mails, `node --test` pour les tests unitaires.

**Spec :** `docs/superpowers/specs/2026-09-25-agenda-cabinet-design.md`. Ce plan couvre la livraison **C1a** de la section 4 bis. C1b (congés, exceptions, sélecteur de semaine) et C1c (échanges) auront leurs propres plans.

---

## Règles pour l'exécutant

1. **Lire `AGENTS.md` à la racine.** Cette version de Next.js a des ruptures d'API. Avant d'utiliser une API Next que tu n'as pas déjà vue employée dans ce dépôt, lis le guide correspondant dans `node_modules/next/dist/docs/`.
2. **Base de production.** Le projet `nuehdfyscqnkckudkqhe` contient les vraies données du cabinet. Les migrations s'appliquent avec `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration` en passant `project_id` explicitement. Ne jamais utiliser les outils `mcp__supabase__*`, qui pointent sur un autre projet.
3. **Ne créer que les objets de ce plan.** Ne pas toucher `user_roles`, `is_practitioner()`, `profiles`, `articles`, ni aucune table `klub_*`. Tout essai destructif se fait dans `begin; … rollback;`.
4. **Lint React Compiler.** Pas de `setState` dans le corps d'un effet, pas de mutation pendant le rendu. Le motif du dépôt pour charger des données est `window.setTimeout(() => void charger(), 0)` dans l'effet.
5. **Commits.** `git add <chemins explicites>`, jamais `-a` ni `-am`. Messages en français, au style des commits existants. Terminer chaque message par `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
6. Ne rien pousser et n'ouvrir aucune PR avant la tâche 8.

## Carte des fichiers

| Fichier | Responsabilité |
|---|---|
| `supabase/migrations/20260926100000_agenda_socle.sql` | Les deux tables, leurs contraintes, leur RLS, le déclencheur de retour en `propose` |
| `supabase/migrations/20260926100100_agenda_fonctions.sql` | Les quatre fonctions de transition, et la file de mails avec sa fonction de réservation |
| `supabase/tests/agenda.sql` | Scénarios de droits, en transaction annulée |
| `lib/agenda/salles.ts` | Les cinq salles, en dur |
| `lib/agenda/types.ts` | Les types partagés entre la base et les écrans |
| `lib/agenda/grille.ts` | Calculs purs : occupation d'une case, conflits, compteurs |
| `lib/agenda/grille.test.ts` | Tests unitaires de `grille.ts` |
| `lib/agenda/mails.ts` | Composition des textes de mail |
| `lib/agenda/envoi.ts` | Vidage de la file `agenda_mails` |
| `app/api/agenda/tache/route.ts` | La route de cron |
| `vercel.json` | L'entrée de cron |
| `app/admin/agenda/page.tsx` | La route de la rubrique |
| `components/admin/agenda/AgendaAdmin.tsx` | La coque des deux vues, le chargement |
| `components/admin/agenda/Grille.tsx` | La grille, rendue deux fois |
| `components/admin/agenda/CaseDetail.tsx` | Le panneau d'une case : vœux, décisions, fil |
| `components/admin/agenda/rpc.ts` | Appel des fonctions et traduction des codes d'erreur |
| `lib/admin/droits.ts` | Retirer `bientot` de la rubrique Agenda |

---

### Task 0: Espace de travail

- [ ] **Step 1: Vérifier l'état de départ**

```bash
cd /Users/lucas/Desktop/mugitu-biarritz-admin
git status --short
git log --oneline -3
```

Attendu : arbre propre, branche `feature/agenda-cabinet`, dernier commit `03d7cdf agenda : congés, exceptions datées et échanges de créneau`.

Si la branche n'existe pas : `git fetch origin && git checkout -B feature/agenda-cabinet origin/main`.

- [ ] **Step 2: Vérifier que les dépendances sont installées**

Run: `npm test`
Attendu : 30 tests passent.

---

### Task 1: Les deux tables

**Files:**
- Create: `supabase/migrations/20260926100000_agenda_socle.sql`

- [ ] **Step 1: Écrire la migration**

```sql
-- Agenda du cabinet : la semaine type et son fil de discussion.
--
-- Une semaine type, sans dates : un vœu dit « telle salle, tel jour de la
-- semaine, matin ou après-midi ». Les dates réelles arrivent au chantier
-- C1b (absences et exceptions) et ne modifient jamais ces lignes.
--
-- anon n'a aucun droit sur ces tables. authenticated ne garde que la
-- lecture et l'écriture de ses propres vœux : tout changement d'état passe
-- par les fonctions security definer de la migration suivante, parce
-- qu'une politique RLS ne sait pas restreindre l'écriture à certaines
-- colonnes.

create table public.agenda_voeux (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  salle text not null check (salle in ('lurra', 'airea', 'etera', 'sua', 'ura')),
  jour smallint not null check (jour between 1 and 5),
  moment text not null check (moment in ('matin', 'aprem')),
  statut text not null default 'propose'
    check (statut in ('propose', 'valide', 'refuse', 'retrait_demande')),
  decide_par uuid references auth.users (id) on delete set null,
  decide_le timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- Une personne ne demande pas deux fois la même case.
  unique (user_id, salle, jour, moment)
);

create index agenda_voeux_case on public.agenda_voeux (salle, jour, moment, statut);
create index agenda_voeux_personne on public.agenda_voeux (user_id, statut);

create table public.agenda_commentaires (
  id uuid primary key default gen_random_uuid(),
  voeu_id uuid not null references public.agenda_voeux (id) on delete cascade,
  auteur_id uuid not null references auth.users (id) on delete cascade,
  texte text not null check (length(btrim(texte)) > 0),
  created_at timestamptz not null default now()
);

create index agenda_commentaires_voeu on public.agenda_commentaires (voeu_id, created_at);

-- Deux règles, un seul déclencheur.
--
-- 1. Personne ne change `statut`, `decide_par` ni `decide_le` par un UPDATE
--    direct. Sans ça, la politique de modification ci-dessous laisserait
--    n'importe qui poser un vœu en « proposé » puis se l'accorder lui-même.
--    Les fonctions security definer posent le drapeau de session
--    `agenda.transition` avant d'écrire : c'est leur laissez-passer.
-- 2. Déplacer un vœu accordé le ramène en « proposé ». Tenu ici et non par
--    l'interface : la règle doit valoir aussi pour une écriture directe.
create or replace function public.agenda__garde_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  v_autorise boolean := coalesce(current_setting('agenda.transition', true), '') = '1';
begin
  if not v_autorise then
    if new.statut is distinct from old.statut
       or new.decide_par is distinct from old.decide_par
       or new.decide_le is distinct from old.decide_le then
      raise exception 'AGENDA_STATUT';
    end if;

    if (new.salle, new.jour, new.moment) is distinct from (old.salle, old.jour, old.moment)
       and old.statut <> 'propose' then
      new.statut := 'propose';
      new.decide_par := null;
      new.decide_le := null;
    end if;
  end if;

  new.updated_at := now();
  return new;
end;
$$;

create trigger agenda_voeux_garde_transition
  before update on public.agenda_voeux
  for each row execute function public.agenda__garde_transition();

alter table public.agenda_voeux enable row level security;
alter table public.agenda_commentaires enable row level security;

-- Lecture : toute l'équipe voit tout. La vision d'ensemble est le but de
-- l'outil, et la base doit dire la même chose que l'écran.
create policy agenda_voeux_lecture on public.agenda_voeux
  for select to authenticated using (public.site_est_equipe());

create policy agenda_commentaires_lecture on public.agenda_commentaires
  for select to authenticated using (public.site_est_equipe());

-- Création : chacun pose ses propres vœux, et seulement en « proposé ».
create policy agenda_voeux_creation on public.agenda_voeux
  for insert to authenticated
  with check (public.site_est_equipe() and user_id = auth.uid() and statut = 'propose');

-- Modification : chacun déplace ses propres vœux. Le déclencheur ci-dessus
-- interdit de toucher `statut`, `decide_par` et `decide_le` par cette voie,
-- et ramène en « proposé » ce qui était accordé.
create policy agenda_voeux_modification on public.agenda_voeux
  for update to authenticated
  using (public.site_est_equipe() and user_id = auth.uid())
  with check (user_id = auth.uid());

-- Suppression : chacun retire les siens tant qu'ils ne sont ni accordés ni
-- en cours de retrait. Une case accordée engage le cabinet : elle se rend
-- par agenda_trancher_retrait, jamais unilatéralement.
create policy agenda_voeux_suppression on public.agenda_voeux
  for delete to authenticated
  using (
    public.site_est_equipe()
    and (
      (user_id = auth.uid() and statut in ('propose', 'refuse'))
      or public.site_est_super_admin()
    )
  );

-- Les commentaires ne s'écrivent que par agenda_commenter, qui décide qui a
-- le droit de parler sur quel vœu. Aucune politique d'écriture ici : un
-- commentaire posté ne se modifie ni ne se supprime.

revoke all on public.agenda_voeux from anon;
revoke all on public.agenda_commentaires from anon;
grant select, insert, update, delete on public.agenda_voeux to authenticated;
grant select on public.agenda_commentaires to authenticated;
```

- [ ] **Step 2: Appliquer la migration**

Outil : `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration`, `project_id` = `nuehdfyscqnkckudkqhe`, `name` = `agenda_socle`, `query` = le contenu ci-dessus.

- [ ] **Step 3: Vérifier que les objets existent**

Outil `execute_sql`, même `project_id` :

```sql
select
  (select count(*) from information_schema.tables
    where table_schema='public' and table_name in ('agenda_voeux','agenda_commentaires')) as tables,
  (select count(*) from pg_policies where schemaname='public' and tablename like 'agenda_%') as politiques,
  (select count(*) from information_schema.role_table_grants
    where table_schema='public' and table_name like 'agenda_%' and grantee='anon') as droits_anon;
```

Attendu : `{"tables":2,"politiques":5,"droits_anon":0}`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260926100000_agenda_socle.sql
git commit -m "$(cat <<'EOF'
agenda : les vœux de la semaine type et leur fil de discussion

Deux tables fermées à anon. Le retour en « proposé » quand on déplace un
vœu accordé est tenu par un déclencheur, pour valoir aussi sur une
écriture directe en base. Les commentaires n'ont aucune politique
d'écriture : ils passeront tous par agenda_commenter.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Les fonctions de transition et la file de mails

**Files:**
- Create: `supabase/migrations/20260926100100_agenda_fonctions.sql`

- [ ] **Step 1: Écrire la migration**

```sql
-- Agenda : la file de mails, et les quatre transitions d'état.
--
-- La file est dénormalisée — destinataire, sujet et corps figés à la mise
-- en file — parce qu'un retrait accordé supprime le vœu : le mail qui
-- l'annonce doit survivre à la ligne qui l'a déclenché.

create table public.agenda_mails (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in
    ('voeu_valide', 'voeu_refuse', 'retrait_demande', 'retrait_tranche', 'commentaire')),
  destinataire_email text not null,
  sujet text not null,
  corps text not null,
  envoyer_apres timestamptz not null default now(),
  statut text not null default 'a_envoyer'
    check (statut in ('a_envoyer', 'en_cours', 'envoye', 'erreur', 'abandonne')),
  tentatives smallint not null default 0,
  reserve_at timestamptz,
  derniere_erreur text,
  created_at timestamptz not null default now(),
  envoye_at timestamptz
);

create index agenda_mails_file on public.agenda_mails (statut, envoyer_apres);

alter table public.agenda_mails enable row level security;
revoke all on public.agenda_mails from anon, authenticated;
-- Personne ne lit cette table depuis le navigateur : seule la clé de
-- service y touche, depuis lib/agenda/envoi.ts.

-- Le libellé d'une case, pour les mails et les fils.
create or replace function public.agenda__libelle_case(p_salle text, p_jour smallint, p_moment text)
returns text
language sql
immutable
set search_path = ''
as $$
  select initcap(p_salle) || ', '
      || (array['lundi','mardi','mercredi','jeudi','vendredi'])[p_jour] || ' '
      || case p_moment when 'matin' then 'matin' else 'après-midi' end;
$$;

-- Met un mail en file. Interne : jamais appelée depuis le navigateur.
create or replace function public.agenda__mettre_en_file(
  p_type text, p_destinataire uuid, p_sujet text, p_corps text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text;
begin
  select u.email into v_email from auth.users u where u.id = p_destinataire;
  if v_email is null then return; end if;
  insert into public.agenda_mails (type, destinataire_email, sujet, corps)
  values (p_type, v_email, p_sujet, p_corps);
end;
$$;

revoke all on function public.agenda__mettre_en_file(text, uuid, text, text) from public, anon, authenticated;

-- Réserve des mails à envoyer. `for update skip locked` empêche deux
-- exécutions du cron d'envoyer le même mail deux fois.
create or replace function public.agenda_reserver_mails(p_max int default 20)
returns setof public.agenda_mails
language plpgsql
security definer
set search_path = ''
as $$
begin
  return query
  with pris as (
    select m.id from public.agenda_mails m
    where m.statut in ('a_envoyer', 'erreur')
      and m.envoyer_apres <= now()
      and m.tentatives < 5
    order by m.envoyer_apres
    limit p_max
    for update skip locked
  )
  update public.agenda_mails m
     set statut = 'en_cours', reserve_at = now(), tentatives = m.tentatives + 1
    from pris
   where m.id = pris.id
  returning m.*;
end;
$$;

revoke all on function public.agenda_reserver_mails(int) from public, anon, authenticated;

-- Garde commune : l'appelant fait-il partie de l'équipe ?
create or replace function public.agenda__verifier_equipe()
returns void
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if not coalesce(public.site_est_equipe(), false) then raise exception 'AGENDA_DROITS'; end if;
end;
$$;

revoke all on function public.agenda__verifier_equipe() from public, anon;
grant execute on function public.agenda__verifier_equipe() to authenticated;

-- 1. Un gérant accorde ou refuse un vœu.
create or replace function public.agenda_decider(
  p_voeu uuid, p_statut text, p_commentaire text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v record;
  v_libelle text;
begin
  if not coalesce(public.site_est_super_admin(), false) then raise exception 'AGENDA_DROITS'; end if;
  if p_statut not in ('valide', 'refuse') then raise exception 'AGENDA_STATUT'; end if;

  select * into v from public.agenda_voeux where id = p_voeu for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if v.statut not in ('propose', 'refuse') then raise exception 'AGENDA_STATUT'; end if;

  -- Une case ne porte qu'un seul vœu accordé.
  if p_statut = 'valide' and exists (
    select 1 from public.agenda_voeux a
    where a.salle = v.salle and a.jour = v.jour and a.moment = v.moment
      and a.id <> v.id and a.statut in ('valide', 'retrait_demande')
  ) then
    raise exception 'AGENDA_CASE_PRISE';
  end if;

  perform set_config('agenda.transition', '1', true);
  update public.agenda_voeux
     set statut = p_statut, decide_par = auth.uid(), decide_le = now()
   where id = p_voeu;
  perform set_config('agenda.transition', '', true);

  if p_commentaire is not null and length(btrim(p_commentaire)) > 0 then
    insert into public.agenda_commentaires (voeu_id, auteur_id, texte)
    values (p_voeu, auth.uid(), btrim(p_commentaire));
  end if;

  v_libelle := public.agenda__libelle_case(v.salle, v.jour, v.moment);
  perform public.agenda__mettre_en_file(
    case when p_statut = 'valide' then 'voeu_valide' else 'voeu_refuse' end,
    v.user_id,
    case when p_statut = 'valide'
      then 'Votre créneau est accordé : ' || v_libelle
      else 'Votre demande de créneau est refusée : ' || v_libelle end,
    coalesce(btrim(p_commentaire), ''));
end;
$$;

revoke all on function public.agenda_decider(uuid, text, text) from public, anon;
grant execute on function public.agenda_decider(uuid, text, text) to authenticated;

-- 2. L'auteur d'un vœu accordé demande à le rendre.
create or replace function public.agenda_demander_retrait(p_voeu uuid, p_motif text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v record;
  v_libelle text;
  v_gerant record;
  v_nom text;
begin
  perform public.agenda__verifier_equipe();
  if p_motif is null or length(btrim(p_motif)) = 0 then raise exception 'AGENDA_MOTIF'; end if;

  select * into v from public.agenda_voeux where id = p_voeu for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if v.user_id <> auth.uid() then raise exception 'AGENDA_DROITS'; end if;
  if v.statut <> 'valide' then raise exception 'AGENDA_STATUT'; end if;

  perform set_config('agenda.transition', '1', true);
  update public.agenda_voeux set statut = 'retrait_demande' where id = p_voeu;
  perform set_config('agenda.transition', '', true);
  insert into public.agenda_commentaires (voeu_id, auteur_id, texte)
  values (p_voeu, auth.uid(), btrim(p_motif));

  v_libelle := public.agenda__libelle_case(v.salle, v.jour, v.moment);
  select coalesce(p.first_name || ' ' || p.last_name, u.email) into v_nom
    from auth.users u left join public.profiles p on p.id = u.id where u.id = v.user_id;

  for v_gerant in select user_id from public.site_super_admins loop
    perform public.agenda__mettre_en_file('retrait_demande', v_gerant.user_id,
      'Demande de retrait : ' || v_libelle,
      v_nom || ' demande à rendre ce créneau.' || chr(10) || chr(10) || btrim(p_motif));
  end loop;
end;
$$;

revoke all on function public.agenda_demander_retrait(uuid, text) from public, anon;
grant execute on function public.agenda_demander_retrait(uuid, text) to authenticated;

-- 3. Un gérant tranche la demande de retrait.
create or replace function public.agenda_trancher_retrait(
  p_voeu uuid, p_accorde boolean, p_commentaire text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v record;
  v_libelle text;
begin
  if not coalesce(public.site_est_super_admin(), false) then raise exception 'AGENDA_DROITS'; end if;

  select * into v from public.agenda_voeux where id = p_voeu for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if v.statut <> 'retrait_demande' then raise exception 'AGENDA_STATUT'; end if;

  v_libelle := public.agenda__libelle_case(v.salle, v.jour, v.moment);

  perform public.agenda__mettre_en_file('retrait_tranche', v.user_id,
    case when p_accorde
      then 'Retrait accordé : ' || v_libelle
      else 'Retrait refusé : ' || v_libelle end,
    coalesce(btrim(p_commentaire), ''));

  perform set_config('agenda.transition', '1', true);
  if p_accorde then
    -- Le mail est déjà en file : il survit à la suppression du vœu.
    delete from public.agenda_voeux where id = p_voeu;
  else
    update public.agenda_voeux
       set statut = 'valide', decide_par = auth.uid(), decide_le = now()
     where id = p_voeu;
    if p_commentaire is not null and length(btrim(p_commentaire)) > 0 then
      insert into public.agenda_commentaires (voeu_id, auteur_id, texte)
      values (p_voeu, auth.uid(), btrim(p_commentaire));
    end if;
  end if;
  perform set_config('agenda.transition', '', true);
end;
$$;

revoke all on function public.agenda_trancher_retrait(uuid, boolean, text) from public, anon;
grant execute on function public.agenda_trancher_retrait(uuid, boolean, text) to authenticated;

-- 4. Poster un commentaire dans le fil d'un vœu.
create or replace function public.agenda_commenter(p_voeu uuid, p_texte text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v record;
  v_libelle text;
  v_gerant record;
begin
  perform public.agenda__verifier_equipe();
  if p_texte is null or length(btrim(p_texte)) = 0 then raise exception 'AGENDA_TEXTE'; end if;

  select * into v from public.agenda_voeux where id = p_voeu;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if v.user_id <> auth.uid() and not coalesce(public.site_est_super_admin(), false) then
    raise exception 'AGENDA_DROITS';
  end if;

  insert into public.agenda_commentaires (voeu_id, auteur_id, texte)
  values (p_voeu, auth.uid(), btrim(p_texte));

  v_libelle := public.agenda__libelle_case(v.salle, v.jour, v.moment);

  if v.user_id = auth.uid() then
    -- L'auteur parle : ce sont les gérants qui doivent lire.
    for v_gerant in select user_id from public.site_super_admins loop
      perform public.agenda__mettre_en_file('commentaire', v_gerant.user_id,
        'Nouveau message : ' || v_libelle, btrim(p_texte));
    end loop;
  else
    perform public.agenda__mettre_en_file('commentaire', v.user_id,
      'Nouveau message : ' || v_libelle, btrim(p_texte));
  end if;
end;
$$;

revoke all on function public.agenda_commenter(uuid, text) from public, anon;
grant execute on function public.agenda_commenter(uuid, text) to authenticated;
```

- [ ] **Step 2: Appliquer la migration**

Outil `apply_migration`, `project_id` = `nuehdfyscqnkckudkqhe`, `name` = `agenda_fonctions`.

- [ ] **Step 3: Vérifier les droits d'exécution**

```sql
select p.proname,
       has_function_privilege('anon', p.oid, 'execute') as anon,
       has_function_privilege('authenticated', p.oid, 'execute') as authentifie
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname like 'agenda%'
order by p.proname;
```

Attendu : `anon` faux partout ; `authentifie` vrai pour `agenda_commenter`, `agenda_decider`, `agenda_demander_retrait`, `agenda_trancher_retrait`, `agenda__verifier_equipe` ; faux pour `agenda__mettre_en_file` et `agenda_reserver_mails`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260926100100_agenda_fonctions.sql
git commit -m "$(cat <<'EOF'
agenda : file de mails et les quatre transitions d'état

La file est dénormalisée parce qu'un retrait accordé supprime le vœu :
le mail qui l'annonce doit survivre à la ligne qui l'a déclenché, et il
est donc mis en file avant la suppression.

agenda_decider refuse d'accorder une case déjà tenue : sans cette
contrainte, « accordé » ne garantirait plus une salle à personne.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Les scénarios de droits

**Files:**
- Create: `supabase/tests/agenda.sql`

- [ ] **Step 1: Écrire le fichier**

```sql
-- Droits de l'agenda du cabinet. Tout se passe dans une transaction
-- annulée : rien n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « agenda : scénarios OK ».

begin;

-- BLOC VŒUX
do $$
declare
  v_lucas uuid;
  v_hugo uuid;
  v_kine uuid;
  v_voeu uuid;
  v_autre uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_hugo is not null and v_kine is not null, 'V0 comptes absents';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);

  -- V1. Un praticien pose un vœu à son nom.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.agenda_voeux (user_id, salle, jour, moment)
  values (v_hugo, 'sua', 2, 'matin') returning id into v_voeu;
  assert v_voeu is not null, 'V1';

  -- V2. Il ne pose pas de vœu au nom d'un autre.
  begin
    insert into public.agenda_voeux (user_id, salle, jour, moment) values (v_kine, 'sua', 3, 'matin');
    assert false, 'V2 un praticien pose un vœu au nom d''un autre';
  exception when insufficient_privilege then null;
  end;

  -- V3. Il ne pose pas un vœu déjà accordé.
  begin
    insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
    values (v_hugo, 'ura', 4, 'aprem', 'valide');
    assert false, 'V3 un praticien s''auto-accorde une case';
  exception when insufficient_privilege then null;
  end;

  -- V3b. Il ne s'accorde pas une case par un UPDATE direct. C'est le trou
  -- que la politique de modification laisserait sans le déclencheur.
  begin
    update public.agenda_voeux set statut = 'valide' where id = v_voeu;
    assert false, 'V3b un praticien s''accorde une case par UPDATE';
  exception when raise_exception then assert sqlerrm = 'AGENDA_STATUT', 'V3b ' || sqlerrm;
  end;

  -- V4. Il ne décide pas lui-même.
  reset role;
  begin
    perform public.agenda_decider(v_voeu, 'valide', null);
    assert false, 'V4 un praticien accorde son propre vœu';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'V4 ' || sqlerrm;
  end;

  -- V5. Un gérant accorde.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_decider(v_voeu, 'valide', 'D''accord pour le mardi matin.');
  assert (select statut from public.agenda_voeux where id = v_voeu) = 'valide', 'V5a';
  assert exists (select 1 from public.agenda_commentaires where voeu_id = v_voeu), 'V5b';
  assert exists (select 1 from public.agenda_mails where type = 'voeu_valide'), 'V5c';

  -- V6. La case est prise : un second vœu ne peut plus être accordé.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.agenda_voeux (user_id, salle, jour, moment)
  values (v_kine, 'sua', 2, 'matin') returning id into v_autre;
  reset role;
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_decider(v_autre, 'valide', null);
    assert false, 'V6 deux vœux accordés sur la même case';
  exception when raise_exception then assert sqlerrm = 'AGENDA_CASE_PRISE', 'V6 ' || sqlerrm;
  end;

  -- V7. L'auteur ne supprime pas un vœu accordé.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  delete from public.agenda_voeux where id = v_voeu;
  assert exists (select 1 from public.agenda_voeux where id = v_voeu), 'V7 un vœu accordé a été supprimé';

  -- V8. Déplacer un vœu accordé le ramène en « proposé ».
  update public.agenda_voeux set jour = 3 where id = v_voeu;
  assert (select statut from public.agenda_voeux where id = v_voeu) = 'propose', 'V8a';
  assert (select decide_par from public.agenda_voeux where id = v_voeu) is null, 'V8b';
  update public.agenda_voeux set jour = 2 where id = v_voeu;
  reset role;

  -- V9. Le retrait : demandé par l'auteur, tranché par le gérant.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_decider(v_voeu, 'valide', null);
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_demander_retrait(v_voeu, 'Je le prends.');
    assert false, 'V9a un tiers demande le retrait';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'V9a ' || sqlerrm;
  end;
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  perform public.agenda_demander_retrait(v_voeu, 'Je change de jour à la rentrée.');
  assert (select statut from public.agenda_voeux where id = v_voeu) = 'retrait_demande', 'V9b';

  -- V10. Une case en retrait demandé reste tenue.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_decider(v_autre, 'valide', null);
    assert false, 'V10 une case en retrait demandé a été réattribuée';
  exception when raise_exception then assert sqlerrm = 'AGENDA_CASE_PRISE', 'V10 ' || sqlerrm;
  end;

  -- V11. Retrait accordé : le vœu disparaît, le mail reste.
  perform public.agenda_trancher_retrait(v_voeu, true, 'Entendu.');
  assert not exists (select 1 from public.agenda_voeux where id = v_voeu), 'V11a';
  assert exists (select 1 from public.agenda_mails where type = 'retrait_tranche'), 'V11b';

  -- V12. La case est libre : le second vœu peut être accordé.
  perform public.agenda_decider(v_autre, 'valide', null);
  assert (select statut from public.agenda_voeux where id = v_autre) = 'valide', 'V12';

  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC VŒUX

-- BLOC COMMENTAIRES
do $$
declare
  v_lucas uuid;
  v_hugo uuid;
  v_kine uuid;
  v_voeu uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;
  insert into public.agenda_voeux (user_id, salle, jour, moment)
  values (v_hugo, 'etera', 5, 'aprem') returning id into v_voeu;

  -- C1. On n'écrit pas dans la table des commentaires directement.
  begin
    insert into public.agenda_commentaires (voeu_id, auteur_id, texte) values (v_voeu, v_hugo, 'Direct');
    assert false, 'C1 écriture directe dans agenda_commentaires';
  exception when insufficient_privilege then null;
  end;
  reset role;

  -- C2. L'auteur commente le sien.
  perform public.agenda_commenter(v_voeu, 'Je peux décaler si besoin.');
  assert (select count(*) from public.agenda_commentaires where voeu_id = v_voeu) = 1, 'C2';

  -- C3. Un tiers ne commente pas.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_commenter(v_voeu, 'Moi aussi je la veux.');
    assert false, 'C3 un tiers commente le vœu d''un autre';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'C3 ' || sqlerrm;
  end;

  -- C4. Un gérant commente n'importe lequel.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_commenter(v_voeu, 'On en parle vendredi.');
  assert (select count(*) from public.agenda_commentaires where voeu_id = v_voeu) = 2, 'C4';

  perform set_config('request.jwt.claims', '', true);
end $$;
-- FIN BLOC COMMENTAIRES

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  begin
    assert (select count(*) from public.agenda_voeux) = 0, 'P1 anon lit les vœux';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.agenda_decider(gen_random_uuid(), 'valide', null);
    assert false, 'P2 anon appelle agenda_decider';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.agenda_reserver_mails(1);
    assert false, 'P3 anon appelle agenda_reserver_mails';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;
-- FIN BLOC DROITS ANON

rollback;
select 'agenda : scénarios OK' as resultat;
```

- [ ] **Step 2: Lancer les scénarios**

Outil `execute_sql`, `project_id` = `nuehdfyscqnkckudkqhe`, `query` = le contenu du fichier.

Attendu : `[{"resultat":"agenda : scénarios OK"}]`.

Si un `assert` échoue, le message nomme le scénario (`V6`, `C3`…) : corriger la migration de la tâche 1 ou 2, la ré-appliquer, relancer.

- [ ] **Step 3: Vérifier que rien n'a persisté**

```sql
select
  (select count(*) from public.agenda_voeux) as voeux,
  (select count(*) from public.agenda_commentaires) as commentaires,
  (select count(*) from public.agenda_mails) as mails;
```

Attendu : `{"voeux":0,"commentaires":0,"mails":0}`.

- [ ] **Step 4: Commit**

```bash
git add supabase/tests/agenda.sql
git commit -m "$(cat <<'EOF'
agenda : scénarios de droits sur les vœux et les commentaires

Treize scénarios sur les vœux, quatre sur les commentaires, trois sur
anon. Les trois qui comptent : personne ne s'accorde une case par un UPDATE
direct, une case accordée ne se réattribue pas tant qu'un retrait n'a pas
été tranché, et déplacer un vœu accordé le ramène en « proposé » même par
une écriture directe en base.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Les salles, les types et le calcul de la grille

**Files:**
- Create: `lib/agenda/salles.ts`, `lib/agenda/types.ts`, `lib/agenda/grille.ts`
- Test: `lib/agenda/grille.test.ts`
- Modify: `package.json` (étendre le script `test`)

- [ ] **Step 1: Écrire le test qui échoue**

`lib/agenda/grille.test.ts` :

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { compteurParPersonne, etatCase, type Voeu } from "./grille.ts";

const v = (id: string, user: string, statut: Voeu["statut"]): Voeu => ({
  id,
  user_id: user,
  salle: "sua",
  jour: 2,
  moment: "matin",
  statut,
  decide_par: null,
  decide_le: null,
});

test("une case vide n’a ni occupant ni conflit", () => {
  const e = etatCase([], "sua", 2, "matin");
  assert.equal(e.occupant, null);
  assert.equal(e.enConflit, false);
  assert.deepEqual(e.demandes, []);
});

test("un vœu accordé occupe la case", () => {
  const e = etatCase([v("1", "u1", "valide")], "sua", 2, "matin");
  assert.equal(e.occupant?.user_id, "u1");
  assert.equal(e.enConflit, false);
});

test("un retrait demandé tient encore la case", () => {
  const e = etatCase([v("1", "u1", "retrait_demande")], "sua", 2, "matin");
  assert.equal(e.occupant?.user_id, "u1");
});

test("deux vœux vivants font un conflit", () => {
  const e = etatCase([v("1", "u1", "valide"), v("2", "u2", "propose")], "sua", 2, "matin");
  assert.equal(e.enConflit, true);
  assert.equal(e.demandes.length, 1);
  assert.equal(e.demandes[0].user_id, "u2");
});

test("un vœu refusé ne fait pas de conflit", () => {
  const e = etatCase([v("1", "u1", "valide"), v("2", "u2", "refuse")], "sua", 2, "matin");
  assert.equal(e.enConflit, false);
  assert.deepEqual(e.demandes, []);
});

test("une case d’une autre salle est ignorée", () => {
  const ailleurs = { ...v("1", "u1", "valide"), salle: "ura" as const };
  const e = etatCase([ailleurs], "sua", 2, "matin");
  assert.equal(e.occupant, null);
});

test("le compteur ne retient que les vœux vivants", () => {
  const voeux = [
    v("1", "u1", "valide"),
    { ...v("2", "u1", "propose"), jour: 3 as const },
    { ...v("3", "u1", "refuse"), jour: 4 as const },
    { ...v("4", "u2", "valide"), jour: 5 as const },
  ];
  assert.deepEqual(compteurParPersonne(voeux), { u1: 2, u2: 1 });
});
```

- [ ] **Step 2: Lancer le test pour le voir échouer**

Run: `node --test lib/agenda/grille.test.ts`
Attendu : ÉCHEC, `ERR_MODULE_NOT_FOUND` pour `./grille.ts`.

- [ ] **Step 3: Écrire `lib/agenda/salles.ts`**

```ts
/**
 * Les cinq salles du cabinet.
 *
 * Écrites à la main, sur le motif de `lib/evenements.ts` : une liste qui
 * change une fois par an ne mérite pas d'écran de gestion. Les noms et les
 * vocations viennent du simulateur `public/mugicoloc.html`, recopiés et non
 * importés — les deux outils n'ont pas à dépendre l'un de l'autre.
 *
 * La vocation n'interdit rien. Dans le modèle de Mugicoloc le podologue
 * n'est admis dans aucune salle, alors qu'il fait partie de l'équipe : le
 * gérant arbitre, un blocage serait redondant.
 */

export const SALLES = [
  { id: "lurra", nom: "Lurra", vocation: "Thérapie manuelle" },
  { id: "airea", nom: "Airea", vocation: "Thérapie manuelle" },
  { id: "etera", nom: "Etera", vocation: "Lab, psy, diététique" },
  { id: "sua", nom: "Sua", vocation: "Médecine du sport, préparation" },
  { id: "ura", nom: "Ura", vocation: "Récupération, massage" },
] as const;

export type SalleId = (typeof SALLES)[number]["id"];

export const JOURS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi"] as const;
export const MOMENTS = [
  { id: "matin", label: "Matin" },
  { id: "aprem", label: "Après-midi" },
] as const;

export type MomentId = (typeof MOMENTS)[number]["id"];

export function nomSalle(id: string): string {
  return SALLES.find((s) => s.id === id)?.nom ?? id;
}

/** « Sua, mardi matin » — le même libellé que côté base. */
export function libelleCase(salle: string, jour: number, moment: string): string {
  return `${nomSalle(salle)}, ${JOURS[jour - 1]?.toLowerCase() ?? "?"} ${
    moment === "matin" ? "matin" : "après-midi"
  }`;
}
```

- [ ] **Step 4: Écrire `lib/agenda/types.ts`**

```ts
import type { MomentId, SalleId } from "./salles.ts";

export type StatutVoeu = "propose" | "valide" | "refuse" | "retrait_demande";

export type Voeu = {
  id: string;
  user_id: string;
  salle: SalleId | string;
  jour: number;
  moment: MomentId | string;
  statut: StatutVoeu;
  decide_par: string | null;
  decide_le: string | null;
};

export type Commentaire = {
  id: string;
  voeu_id: string;
  auteur_id: string;
  texte: string;
  created_at: string;
};

/** Prénom et nom d'un compte, pour nommer les cases. */
export type Personne = { id: string; nom: string };
```

- [ ] **Step 5: Écrire `lib/agenda/grille.ts`**

```ts
import type { StatutVoeu, Voeu } from "./types.ts";

export type { Voeu } from "./types.ts";

/**
 * Calculs purs de la grille. Aucun accès réseau : ce fichier est lu tel
 * quel par les tests `node --test`.
 *
 * Deux statuts tiennent une case : « valide » et « retrait_demande ». Le
 * second parce qu'une demande de retrait ne libère rien tant qu'elle n'est
 * pas tranchée — sinon la case partirait avant l'arbitrage.
 */

const TIENNENT: StatutVoeu[] = ["valide", "retrait_demande"];
const VIVANTS: StatutVoeu[] = ["propose", "valide", "retrait_demande"];

export type EtatCase = {
  /** Le vœu qui tient la case, s'il y en a un. */
  occupant: Voeu | null;
  /** Les vœux en attente sur cette case. */
  demandes: Voeu[];
  /** Vrai dès que plus d'un vœu vivant vise la case. */
  enConflit: boolean;
};

export function etatCase(voeux: Voeu[], salle: string, jour: number, moment: string): EtatCase {
  const surLaCase = voeux.filter(
    (v) => v.salle === salle && v.jour === jour && v.moment === moment && VIVANTS.includes(v.statut),
  );
  const occupant = surLaCase.find((v) => TIENNENT.includes(v.statut)) ?? null;
  const demandes = surLaCase.filter((v) => v.id !== occupant?.id);
  return { occupant, demandes, enConflit: surLaCase.length > 1 };
}

/** Combien de demi-journées vivantes chacun demande ou tient. */
export function compteurParPersonne(voeux: Voeu[]): Record<string, number> {
  const compte: Record<string, number> = {};
  for (const v of voeux) {
    if (!VIVANTS.includes(v.statut)) continue;
    compte[v.user_id] = (compte[v.user_id] ?? 0) + 1;
  }
  return compte;
}

/** Le vœu de cette personne sur cette case, s'il existe. */
export function voeuDe(voeux: Voeu[], userId: string, salle: string, jour: number, moment: string): Voeu | null {
  return (
    voeux.find(
      (v) => v.user_id === userId && v.salle === salle && v.jour === jour && v.moment === moment,
    ) ?? null
  );
}
```

- [ ] **Step 6: Étendre le script de test**

Dans `package.json`, remplacer la ligne du script `test` par :

```json
    "test": "node --test lib/klub/*.test.ts lib/admin/*.test.ts lib/agenda/*.test.ts",
```

- [ ] **Step 7: Lancer les tests**

Run: `npm test`
Attendu : 37 tests passent (30 existants + 7 nouveaux).

- [ ] **Step 8: Vérifier types et lint**

Run: `npx tsc --noEmit && npm run lint`
Attendu : aucune sortie, aucune erreur.

- [ ] **Step 9: Commit**

```bash
git add lib/agenda/salles.ts lib/agenda/types.ts lib/agenda/grille.ts lib/agenda/grille.test.ts package.json
git commit -m "$(cat <<'EOF'
agenda : les cinq salles et le calcul de la grille

Les salles sont écrites à la main, comme l'annuaire des événements. Les
noms viennent de Mugicoloc, recopiés : les deux outils n'ont pas à
dépendre l'un de l'autre.

grille.ts est pur et sans import réseau, donc testable tel quel. La règle
qu'il porte : « valide » et « retrait_demande » tiennent tous deux la
case, un vœu refusé ne compte plus dans le conflit.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: L'envoi des mails

**Files:**
- Create: `lib/agenda/mails.ts`, `lib/agenda/envoi.ts`, `app/api/agenda/tache/route.ts`
- Modify: `vercel.json`

**Note d'écart avec la spec.** La spec dit « la route de cron du Klub ». Ce plan crée une route séparée, `/api/agenda/tache`, pour la même raison qui a fait choisir une table séparée : ne pas toucher à un chemin de production éprouvé. Le cron tourne toutes les cinq minutes, pas chaque minute — une décision sur un vœu ne se compte pas en secondes.

- [ ] **Step 1: Écrire `lib/agenda/mails.ts`**

```ts
import { SITE } from "@/lib/brevo";

/**
 * Les textes des mails de l'agenda.
 *
 * Le sujet et le corps sont figés en base au moment de la mise en file
 * (voir `agenda__mettre_en_file`) : ce fichier ne fait que les habiller.
 * Un retrait accordé supprime le vœu, donc rien ici ne peut relire la
 * ligne d'origine.
 */

export function habiller(sujet: string, corps: string): { html: string; texte: string } {
  const lien = `${SITE}/admin/agenda`;
  const paragraphes = corps
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const texte = [sujet, "", ...paragraphes, "", `L’agenda du cabinet : ${lien}`].join("\n");

  const html = [
    `<p style="font-size:16px;font-weight:600;color:#003850;margin:0 0 12px">${echapper(sujet)}</p>`,
    ...paragraphes.map(
      (p) => `<p style="font-size:15px;line-height:1.6;color:#1d2d33;margin:0 0 10px">${echapper(p)}</p>`,
    ),
    `<p style="font-size:14px;margin:18px 0 0"><a href="${lien}" style="color:#04A49B">Ouvrir l’agenda du cabinet</a></p>`,
  ].join("");

  return { html, texte };
}

function echapper(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
```

- [ ] **Step 2: Écrire `lib/agenda/envoi.ts`**

```ts
import { envoyerBrevo } from "@/lib/brevo";
import { restService, rpcService } from "@/lib/supabase-service";
import { habiller } from "./mails";

/**
 * Vide la file `agenda_mails`. Chaque mail est d'abord réservé en base
 * (`agenda_reserver_mails`, qui pose `statut = 'en_cours'` sous
 * `for update skip locked`), ce qui empêche deux exécutions du cron
 * d'envoyer le même mail deux fois.
 */

export type BilanAgenda = { envoyes: number; abandonnes: number; echecs: number };

type MailEnFile = {
  id: string;
  type: string;
  destinataire_email: string;
  sujet: string;
  corps: string;
  tentatives: number;
};

const attendre = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Met à jour un mail, en retentant : un envoyé qui reste « en_cours » repartirait. */
async function marquer(id: string, champs: Record<string, unknown>): Promise<boolean> {
  for (let tentative = 1; tentative <= 3; tentative++) {
    try {
      const r = await restService(`agenda_mails?id=eq.${id}`, { method: "PATCH", corps: champs });
      if (r.ok) return true;
      console.error("[agenda] mise à jour du mail impossible", id, r.status, r.corps);
    } catch (e) {
      console.error("[agenda] mise à jour du mail impossible", id, e);
    }
    if (tentative < 3) await attendre(300);
  }
  return false;
}

export async function envoyerFileAgenda(max = 20): Promise<BilanAgenda> {
  const bilan: BilanAgenda = { envoyes: 0, abandonnes: 0, echecs: 0 };

  const reserve = await rpcService<MailEnFile[]>("agenda_reserver_mails", { p_max: max });
  if (!reserve.ok) {
    console.error("[agenda] réservation impossible", reserve.status, reserve.corps);
    return bilan;
  }

  for (const m of reserve.data ?? []) {
    const { html, texte } = habiller(m.sujet, m.corps);
    try {
      await envoyerBrevo({
        to: [{ email: m.destinataire_email }],
        subject: m.sujet,
        htmlContent: html,
        textContent: texte,
      });
      await marquer(m.id, { statut: "envoye", envoye_at: new Date().toISOString(), reserve_at: null });
      bilan.envoyes++;
    } catch (e) {
      const erreur = e instanceof Error ? e.message : String(e);
      console.error("[agenda] envoi en échec", m.id, m.type, erreur);
      if (m.tentatives >= 5) {
        await marquer(m.id, { statut: "abandonne", derniere_erreur: erreur, reserve_at: null });
        bilan.abandonnes++;
      } else {
        await marquer(m.id, {
          statut: "erreur",
          derniere_erreur: erreur,
          reserve_at: null,
          envoyer_apres: new Date(Date.now() + 5 * 60_000).toISOString(),
        });
        bilan.echecs++;
      }
    }
  }

  return bilan;
}
```

**Avant d'écrire ce fichier**, ouvrir `lib/brevo.ts` et `lib/supabase-service.ts` pour vérifier les signatures exactes de `envoyerBrevo`, `restService` et `rpcService`. Si elles diffèrent de ce qui est écrit ici, **suivre les signatures du dépôt** et le signaler dans le rapport : le code ci-dessus est calqué sur `lib/klub/envoi.ts` mais n'a pas été compilé.

- [ ] **Step 3: Écrire la route de cron**

`app/api/agenda/tache/route.ts` :

```ts
import { NextResponse } from "next/server";
import { envoyerFileAgenda } from "@/lib/agenda/envoi";

/**
 * GET /api/agenda/tache, appelée toutes les cinq minutes par le cron Vercel
 * (vercel.json). Vercel envoie `Authorization: Bearer <CRON_SECRET>`.
 *
 * Route séparée de celle du Klub à dessein : le Klub tourne en production
 * et sa route n'a pas à changer pour l'agenda.
 */

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    console.error("[agenda] CRON_SECRET absente");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const mails = await envoyerFileAgenda(20);
  return NextResponse.json({ ok: true, mails });
}
```

- [ ] **Step 4: Ajouter l'entrée de cron**

Ouvrir `vercel.json`, repérer le tableau `crons`, et y ajouter, à la suite de l'entrée du Klub :

```json
    { "path": "/api/agenda/tache", "schedule": "*/5 * * * *" }
```

Ne pas toucher à l'entrée existante `/api/klub/tache`.

- [ ] **Step 5: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 37 tests, aucune erreur, et `/api/agenda/tache` dans la liste des routes du build.

- [ ] **Step 6: Commit**

```bash
git add lib/agenda/mails.ts lib/agenda/envoi.ts app/api/agenda/tache/route.ts vercel.json
git commit -m "$(cat <<'EOF'
agenda : vidage de la file de mails par son propre cron

Route séparée de celle du Klub, et cron toutes les cinq minutes : une
décision sur un vœu ne se compte pas en secondes, et la route du Klub
tourne en production sans avoir à changer pour l'agenda.

Les textes sont figés en base à la mise en file, donc l'envoi ne relit
jamais le vœu d'origine — qu'un retrait accordé a pu supprimer.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: La rubrique et la vue « Ma semaine »

**Files:**
- Create: `app/admin/agenda/page.tsx`, `components/admin/agenda/rpc.ts`, `components/admin/agenda/Grille.tsx`, `components/admin/agenda/AgendaAdmin.tsx`
- Modify: `lib/admin/droits.ts`

- [ ] **Step 1: Ouvrir la rubrique dans le panneau**

Dans `lib/admin/droits.ts`, remplacer la ligne :

```ts
  { href: "/admin/agenda", label: "Agenda", groupe: "Cabinet", bientot: true },
```

par :

```ts
  { href: "/admin/agenda", label: "Agenda", groupe: "Cabinet" },
```

Puis, dans `lib/admin/droits.test.ts`, remplacer le test « l'agenda est annoncé mais pas encore ouvert » par :

```ts
test("l’agenda est ouvert", () => {
  const agenda = rubriquesVisibles(equipe).find((r) => r.href === "/admin/agenda");
  assert.equal(agenda?.bientot, undefined);
});
```

- [ ] **Step 2: Écrire `components/admin/agenda/rpc.ts`**

```ts
import { supabaseBrowser } from "@/lib/supabase-browser";

export type Retour<T> = { ok: true; data: T } | { ok: false; message: string };

/** Les codes levés par les fonctions `agenda_*`, en français. */
const ERREURS: Record<string, string> = {
  AGENDA_DROITS: "Vous n’avez pas le droit de faire ça.",
  AGENDA_VOEU: "Cette demande n’existe plus.",
  AGENDA_STATUT: "L’état de cette demande a changé : rechargez la page.",
  AGENDA_CASE_PRISE: "Ce créneau est déjà accordé à quelqu’un d’autre.",
  AGENDA_MOTIF: "Expliquez pourquoi vous souhaitez rendre ce créneau.",
  AGENDA_TEXTE: "Écrivez un message.",
};

function codeErreur(e: { message?: string } | null): string | undefined {
  const m = e?.message ?? "";
  const trouve = Object.keys(ERREURS).find((code) => m.includes(code));
  return trouve;
}

export async function appeler<T>(nom: string, args: Record<string, unknown>): Promise<Retour<T>> {
  const { data, error } = await supabaseBrowser().rpc(nom, args);
  if (error) {
    const code = codeErreur(error);
    return { ok: false, message: code ? ERREURS[code] : error.message };
  }
  return { ok: true, data: data as T };
}
```

- [ ] **Step 3: Écrire `components/admin/agenda/Grille.tsx`**

```tsx
"use client";

import { etatCase, type Voeu } from "@/lib/agenda/grille";
import { JOURS, MOMENTS, SALLES } from "@/lib/agenda/salles";
import type { Personne } from "@/lib/agenda/types";

/**
 * La grille des cinq salles sur la semaine, rendue deux fois : une fois
 * pour ses propres vœux (`mode="mien"`, on coche), une fois pour tout le
 * cabinet (`mode="cabinet"`, on consulte et on ouvre le détail).
 *
 * Sur écran étroit, la grille se lit salle par salle : dix colonnes ne
 * tiennent pas sur un téléphone.
 */

const CASE_BASE: React.CSSProperties = {
  border: "1px solid rgba(0,56,80,.1)",
  borderRadius: 8,
  padding: "6px 8px",
  fontSize: 11.5,
  minHeight: 38,
  textAlign: "left",
  width: "100%",
  cursor: "pointer",
  background: "#fff",
  color: "#003850",
};

const TEINTE: Record<string, React.CSSProperties> = {
  vide: {},
  mien: { background: "rgba(4,164,155,.12)", borderColor: "#04A49B", fontWeight: 700 },
  propose: { background: "rgba(243,190,121,.22)", borderColor: "rgba(243,190,121,.6)" },
  occupe: { background: "rgba(0,56,80,.06)" },
  conflit: { background: "rgba(238,128,108,.16)", borderColor: "#EE806C" },
};

export default function Grille({
  voeux,
  personnes,
  moi,
  mode,
  onCase,
}: {
  voeux: Voeu[];
  personnes: Record<string, Personne>;
  moi: string;
  mode: "mien" | "cabinet";
  onCase: (salle: string, jour: number, moment: string) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 18 }}>
      {SALLES.map((salle) => (
        <section key={salle.id}>
          <h3 style={{ margin: "0 0 2px", fontSize: 14, color: "#003850" }}>{salle.nom}</h3>
          <p style={{ margin: "0 0 8px", fontSize: 11.5, color: "rgba(0,56,80,.55)" }}>{salle.vocation}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, minmax(0, 1fr))", gap: 6 }}>
            {JOURS.map((jourLabel, i) => (
              <div key={jourLabel} style={{ display: "grid", gap: 4 }}>
                <div style={{ fontSize: 11, color: "rgba(0,56,80,.55)", textAlign: "center" }}>{jourLabel}</div>
                {MOMENTS.map((m) => {
                  const e = etatCase(voeux, salle.id, i + 1, m.id);
                  const mien = [e.occupant, ...e.demandes].find((v) => v?.user_id === moi) ?? null;
                  const teinte = e.enConflit
                    ? TEINTE.conflit
                    : mien
                      ? mien.statut === "propose"
                        ? TEINTE.propose
                        : TEINTE.mien
                      : e.occupant
                        ? TEINTE.occupe
                        : TEINTE.vide;
                  const nomOccupant = e.occupant ? (personnes[e.occupant.user_id]?.nom ?? "—") : "";
                  return (
                    <button
                      key={m.id}
                      type="button"
                      style={{ ...CASE_BASE, ...teinte }}
                      onClick={() => onCase(salle.id, i + 1, m.id)}
                      aria-label={`${salle.nom}, ${jourLabel} ${m.label}`}
                    >
                      <span style={{ display: "block", fontSize: 10, opacity: 0.6 }}>{m.label}</span>
                      {mode === "cabinet" && nomOccupant ? <span>{nomOccupant}</span> : null}
                      {mode === "mien" && mien ? <span>{libelleStatut(mien.statut)}</span> : null}
                      {e.demandes.length > 0 ? (
                        <span style={{ display: "block", fontSize: 10, opacity: 0.7 }}>
                          {e.demandes.length} en attente
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function libelleStatut(s: Voeu["statut"]): string {
  if (s === "valide") return "Accordé";
  if (s === "propose") return "Demandé";
  if (s === "refuse") return "Refusé";
  return "Retrait demandé";
}
```

- [ ] **Step 4: Écrire `components/admin/agenda/AgendaAdmin.tsx`**

```tsx
"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccesCourant } from "@/lib/admin/acces";
import { compteurParPersonne, voeuDe } from "@/lib/agenda/grille";
import { libelleCase } from "@/lib/agenda/salles";
import type { Commentaire, Personne, Voeu } from "@/lib/agenda/types";
import { supabaseBrowser } from "@/lib/supabase-browser";
import CaseDetail from "./CaseDetail";
import Grille from "./Grille";
import { appeler } from "./rpc";

/**
 * L'agenda du cabinet : la semaine type, ses vœux et leur arbitrage.
 *
 * Deux vues sur la même grille. « Ma semaine » coche et décoche ; « Le
 * cabinet » consulte et ouvre le détail d'une case.
 */

type Onglet = "mienne" | "cabinet";
type CaseOuverte = { salle: string; jour: number; moment: string };

export default function AgendaAdmin() {
  const acces = useAccesCourant();
  const [onglet, setOnglet] = useState<Onglet>("mienne");
  const [voeux, setVoeux] = useState<Voeu[]>([]);
  const [personnes, setPersonnes] = useState<Record<string, Personne>>({});
  const [commentaires, setCommentaires] = useState<Commentaire[]>([]);
  const [ouverte, setOuverte] = useState<CaseOuverte | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(true);

  const charger = useCallback(async () => {
    const sb = supabaseBrowser();
    const [v, p, c] = await Promise.all([
      sb.from("agenda_voeux").select("*"),
      sb.from("profiles").select("id, first_name, last_name"),
      sb.from("agenda_commentaires").select("*").order("created_at"),
    ]);
    if (v.error) {
      setErreur("Impossible de charger l’agenda.");
      setChargement(false);
      return;
    }
    setVoeux((v.data ?? []) as Voeu[]);
    const annuaire: Record<string, Personne> = {};
    for (const ligne of (p.data ?? []) as { id: string; first_name: string | null; last_name: string | null }[]) {
      annuaire[ligne.id] = {
        id: ligne.id,
        nom: [ligne.first_name, ligne.last_name].filter(Boolean).join(" ") || "Sans nom",
      };
    }
    setPersonnes(annuaire);
    setCommentaires((c.data ?? []) as Commentaire[]);
    setErreur(null);
    setChargement(false);
  }, []);

  useEffect(() => {
    // Motif du dépôt : pas de setState synchrone dans le corps d'un effet.
    const t = window.setTimeout(() => void charger(), 0);
    return () => window.clearTimeout(t);
  }, [charger]);

  const basculer = useCallback(
    async (salle: string, jour: number, moment: string) => {
      if (!acces.userId) return;
      const existant = voeuDe(voeux, acces.userId, salle, jour, moment);
      const sb = supabaseBrowser();
      if (!existant) {
        const { error } = await sb
          .from("agenda_voeux")
          .insert({ user_id: acces.userId, salle, jour, moment });
        if (error) setErreur("Impossible d’ajouter ce créneau.");
      } else if (existant.statut === "propose" || existant.statut === "refuse") {
        const { error } = await sb.from("agenda_voeux").delete().eq("id", existant.id);
        if (error) setErreur("Impossible de retirer ce créneau.");
      } else {
        setErreur(
          `Ce créneau vous est accordé : passez par « demander à le rendre » dans le détail de ${libelleCase(salle, jour, moment)}.`,
        );
        setOuverte({ salle, jour, moment });
        return;
      }
      await charger();
    },
    [acces.userId, voeux, charger],
  );

  const agir = useCallback(
    async (nom: string, args: Record<string, unknown>) => {
      const r = await appeler(nom, args);
      if (!r.ok) {
        setErreur(r.message);
        return false;
      }
      setErreur(null);
      await charger();
      return true;
    },
    [charger],
  );

  if (chargement) return <p style={{ fontSize: 13 }}>Chargement…</p>;

  return (
    <div>
      <h1 style={{ margin: "0 0 4px", fontSize: 22, color: "#003850" }}>Agenda du cabinet</h1>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: "rgba(0,56,80,.65)" }}>
        Votre semaine type : les demi-journées que vous souhaitez, dans quelle salle. Lucas et Jean-Baptiste
        accordent ou refusent, et vous répondent dans le fil de chaque créneau.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {(
          [
            ["mienne", "Ma semaine"],
            ["cabinet", "Le cabinet"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setOnglet(id)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              border: "1px solid rgba(0,56,80,.15)",
              background: onglet === id ? "#04A49B" : "#fff",
              color: onglet === id ? "#fff" : "#003850",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {erreur ? (
        <p
          role="status"
          style={{
            background: "rgba(238,128,108,.14)",
            color: "#9E4433",
            borderRadius: 10,
            padding: "10px 12px",
            fontSize: 13,
            margin: "0 0 14px",
          }}
        >
          {erreur}
        </p>
      ) : null}

      {onglet === "cabinet" ? (
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "rgba(0,56,80,.6)" }}>
          {Object.entries(compteurParPersonne(voeux))
            .sort((a, b) => b[1] - a[1])
            .map(([id, n]) => `${personnes[id]?.nom ?? "—"} ${n}`)
            .join(" · ") || "Aucune demande pour l’instant."}
        </p>
      ) : null}

      <Grille
        voeux={voeux}
        personnes={personnes}
        moi={acces.userId ?? ""}
        mode={onglet === "mienne" ? "mien" : "cabinet"}
        onCase={(salle, jour, moment) =>
          onglet === "mienne" ? void basculer(salle, jour, moment) : setOuverte({ salle, jour, moment })
        }
      />

      {ouverte ? (
        <CaseDetail
          {...ouverte}
          voeux={voeux}
          commentaires={commentaires}
          personnes={personnes}
          moi={acces.userId ?? ""}
          estGerant={acces.estSuperAdmin}
          onFermer={() => setOuverte(null)}
          onAgir={agir}
        />
      ) : null}
    </div>
  );
}
```

- [ ] **Step 5: Écrire `app/admin/agenda/page.tsx`**

```tsx
import type { Metadata } from "next";
import AgendaAdmin from "@/components/admin/agenda/AgendaAdmin";

export const metadata: Metadata = {
  title: "Back-office — Agenda du cabinet",
  // Un back-office n’a rien à faire dans les moteurs de recherche.
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminAgendaPage() {
  return <AgendaAdmin />;
}
```

- [ ] **Step 6: Vérifier**

`CaseDetail` n'existe pas encore : cette étape échouera à la compilation. C'est attendu — la tâche 7 l'écrit. Ne pas commiter avant.

---

### Task 7: Le détail d'une case

**Files:**
- Create: `components/admin/agenda/CaseDetail.tsx`

- [ ] **Step 1: Écrire le composant**

```tsx
"use client";

import { useState } from "react";
import { etatCase } from "@/lib/agenda/grille";
import { libelleCase } from "@/lib/agenda/salles";
import type { Commentaire, Personne, Voeu } from "@/lib/agenda/types";

/**
 * Le panneau d'une case : qui la tient, qui la demande, le fil de
 * discussion, et les gestes possibles selon qui regarde.
 *
 * Toutes les décisions passent par `onAgir`, qui appelle une fonction
 * `agenda_*` en base : l'écran ne décide de rien, il propose.
 */

type Props = {
  salle: string;
  jour: number;
  moment: string;
  voeux: Voeu[];
  commentaires: Commentaire[];
  personnes: Record<string, Personne>;
  moi: string;
  estGerant: boolean;
  onFermer: () => void;
  onAgir: (nom: string, args: Record<string, unknown>) => Promise<boolean>;
};

const VOILE: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,32,45,.35)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  zIndex: 50,
};

const PANNEAU: React.CSSProperties = {
  background: "#fff",
  borderRadius: "16px 16px 0 0",
  padding: 20,
  width: "min(560px, 100%)",
  maxHeight: "85vh",
  overflowY: "auto",
};

const CHAMP: React.CSSProperties = {
  width: "100%",
  padding: "9px 11px",
  borderRadius: 8,
  border: "1px solid rgba(0,56,80,.16)",
  fontSize: 13.5,
  fontFamily: "inherit",
};

export default function CaseDetail({
  salle,
  jour,
  moment,
  voeux,
  commentaires,
  personnes,
  moi,
  estGerant,
  onFermer,
  onAgir,
}: Props) {
  const [texte, setTexte] = useState("");
  const [occupe, setOccupe] = useState(false);
  const e = etatCase(voeux, salle, jour, moment);
  const tous = [e.occupant, ...e.demandes].filter((v): v is Voeu => v !== null);

  const agir = async (nom: string, args: Record<string, unknown>) => {
    setOccupe(true);
    const ok = await onAgir(nom, args);
    setOccupe(false);
    if (ok) {
      setTexte("");
      onFermer();
    }
  };

  return (
    <div style={VOILE} onClick={onFermer} role="presentation">
      <div style={PANNEAU} onClick={(ev) => ev.stopPropagation()} role="dialog" aria-modal="true">
        <p style={{ margin: "0 0 2px", fontSize: 17, fontWeight: 700, color: "#003850" }}>
          {libelleCase(salle, jour, moment)}
        </p>
        <p style={{ margin: "0 0 16px", fontSize: 12.5, color: "rgba(0,56,80,.6)" }}>
          {e.occupant
            ? `Tenu par ${personnes[e.occupant.user_id]?.nom ?? "—"}`
            : "Personne ne tient ce créneau."}
          {e.enConflit ? " · plusieurs demandes en attente" : ""}
        </p>

        {tous.length === 0 ? <p style={{ fontSize: 13 }}>Aucune demande sur ce créneau.</p> : null}

        {tous.map((v) => {
          const fil = commentaires.filter((c) => c.voeu_id === v.id);
          const estMien = v.user_id === moi;
          return (
            <div
              key={v.id}
              style={{
                border: "1px solid rgba(0,56,80,.1)",
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <p style={{ margin: "0 0 8px", fontSize: 13.5, fontWeight: 600, color: "#003850" }}>
                {personnes[v.user_id]?.nom ?? "—"} · {libelleStatut(v.statut)}
              </p>

              {fil.map((c) => (
                <p key={c.id} style={{ margin: "0 0 6px", fontSize: 12.5, lineHeight: 1.55 }}>
                  <span style={{ fontWeight: 600 }}>{personnes[c.auteur_id]?.nom ?? "—"} : </span>
                  {c.texte}
                </p>
              ))}

              {estGerant && (v.statut === "propose" || v.statut === "refuse") ? (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Bouton
                    ton="ok"
                    disabled={occupe}
                    onClick={() => void agir("agenda_decider", { p_voeu: v.id, p_statut: "valide", p_commentaire: texte })}
                  >
                    Accorder
                  </Bouton>
                  <Bouton
                    ton="non"
                    disabled={occupe}
                    onClick={() => void agir("agenda_decider", { p_voeu: v.id, p_statut: "refuse", p_commentaire: texte })}
                  >
                    Refuser
                  </Bouton>
                </div>
              ) : null}

              {estGerant && v.statut === "retrait_demande" ? (
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <Bouton
                    ton="ok"
                    disabled={occupe}
                    onClick={() => void agir("agenda_trancher_retrait", { p_voeu: v.id, p_accorde: true, p_commentaire: texte })}
                  >
                    Accorder le retrait
                  </Bouton>
                  <Bouton
                    ton="non"
                    disabled={occupe}
                    onClick={() => void agir("agenda_trancher_retrait", { p_voeu: v.id, p_accorde: false, p_commentaire: texte })}
                  >
                    Refuser le retrait
                  </Bouton>
                </div>
              ) : null}

              {estMien && v.statut === "valide" ? (
                <Bouton
                  ton="non"
                  disabled={occupe || texte.trim().length === 0}
                  onClick={() => void agir("agenda_demander_retrait", { p_voeu: v.id, p_motif: texte })}
                >
                  Demander à le rendre
                </Bouton>
              ) : null}

              {estMien || estGerant ? (
                <Bouton
                  ton="neutre"
                  disabled={occupe || texte.trim().length === 0}
                  onClick={() => void agir("agenda_commenter", { p_voeu: v.id, p_texte: texte })}
                >
                  Envoyer le message
                </Bouton>
              ) : null}
            </div>
          );
        })}

        {tous.some((v) => v.user_id === moi) || estGerant ? (
          <label style={{ display: "block", marginTop: 4 }}>
            <span style={{ display: "block", fontSize: 12, marginBottom: 4, color: "rgba(0,56,80,.6)" }}>
              Votre message — joint à la décision ou envoyé seul
            </span>
            <textarea rows={3} style={CHAMP} value={texte} onChange={(ev) => setTexte(ev.target.value)} />
          </label>
        ) : null}

        <button
          type="button"
          onClick={onFermer}
          style={{
            marginTop: 14,
            background: "none",
            border: "none",
            color: "rgba(0,56,80,.6)",
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
          }}
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

function Bouton({
  ton,
  children,
  ...reste
}: { ton: "ok" | "non" | "neutre" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const fond = ton === "ok" ? "#04A49B" : ton === "non" ? "#EE806C" : "rgba(0,56,80,.08)";
  const texte = ton === "neutre" ? "#003850" : "#fff";
  return (
    <button
      type="button"
      {...reste}
      style={{
        padding: "7px 13px",
        borderRadius: 999,
        border: "none",
        background: fond,
        color: texte,
        fontSize: 12.5,
        fontWeight: 600,
        cursor: reste.disabled ? "not-allowed" : "pointer",
        opacity: reste.disabled ? 0.55 : 1,
        marginRight: 8,
        marginTop: 8,
      }}
    >
      {children}
    </button>
  );
}

function libelleStatut(s: Voeu["statut"]): string {
  if (s === "valide") return "accordé";
  if (s === "propose") return "en attente";
  if (s === "refuse") return "refusé";
  return "retrait demandé";
}
```

- [ ] **Step 2: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 37 tests, aucune erreur, `/admin/agenda` dans la liste des routes.

Si le lint refuse quelque chose dans `Grille.tsx` ou `CaseDetail.tsx` — mutation pendant le rendu, dépendance manquante — corriger au minimum et le signaler.

- [ ] **Step 3: Commit**

```bash
git add app/admin/agenda components/admin/agenda lib/admin/droits.ts lib/admin/droits.test.ts
git commit -m "$(cat <<'EOF'
agenda : la rubrique, la grille et le détail d'une case

La rubrique Agenda n'est plus grisée dans le panneau. Une seule grille
rendue deux fois : « Ma semaine » coche, « Le cabinet » consulte.

L'écran ne décide de rien : chaque geste appelle une fonction agenda_* en
base, qui refait tous les contrôles. Cocher une case accordée renvoie
vers « demander à le rendre » plutôt que d'échouer en silence.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 8: Vérification d'ensemble et mise en ligne

- [ ] **Step 1: Tout vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 37 tests, aucune erreur, aucun avertissement de lint, et les routes `/admin/agenda` et `/api/agenda/tache` dans le build.

Relancer `supabase/tests/agenda.sql` avec `execute_sql` : `[{"resultat":"agenda : scénarios OK"}]`.

- [ ] **Step 2: Contrôle des droits effectifs**

Outil `get_advisors`, `project_id` = `nuehdfyscqnkckudkqhe`, `type` = `security`.
Attendu : aucune nouvelle alerte hors « authenticated can execute security definer » pour les fonctions `agenda_*`, qui vérifient les droits dans leur corps.

- [ ] **Step 3: Parcours en local**

**Piège connu :** le fichier de configuration des serveurs lu par l'outil de prévisualisation est `/Users/lucas/Desktop/.claude/launch.json`, pas celui du dépôt, et ses commandes ne démarrent pas dans ce worktree. Une entrée qui lance `npx next` finit par télécharger Next depuis le registre au lieu d'utiliser celui du dépôt, et une entrée existante peut servir l'autre checkout, sur `main`.

Ajouter donc à ce fichier une entrée dont la commande force le répertoire :

```json
{ "name": "agenda", "runtimeExecutable": "sh",
  "runtimeArgs": ["-c", "cd /Users/lucas/Desktop/mugitu-biarritz-admin && ./node_modules/.bin/next dev -p 3010"],
  "port": 3010 }
```

Vérifier au navigateur que `/admin/agenda` rend l'écran de connexion de la coque, avec le titre « Back-office — Agenda du cabinet », sans erreur en console ni côté serveur. Puis arrêter le serveur et **retirer l'entrée ajoutée** : ce fichier appartient à Lucas. Le parcours connecté se fait en prévisualisation, à l'étape 5.

- [ ] **Step 4: Pousser et ouvrir la PR**

```bash
git push -u origin feature/agenda-cabinet
gh pr create --base main --title "Agenda du cabinet : la semaine type et sa validation" --body "$(cat <<'EOF'
Première des trois livraisons de l'agenda (C1a). Chacun déclare ses demi-journées dans les cinq salles, les gérants arbitrent.

**Le modèle**
- Une semaine type sans dates : salle, jour de 1 à 5, matin ou après-midi
- Quatre états : proposé, accordé, refusé, retrait demandé
- Une case ne porte qu'un seul vœu accordé ; `valide` et `retrait_demande` la tiennent l'un comme l'autre
- Un vœu accordé ne se rend que sur demande motivée, tranchée par un gérant
- Déplacer un vœu accordé le ramène en « proposé », par déclencheur, donc aussi depuis la base

**Les écrans**
- Rubrique `/admin/agenda`, qui n'est plus grisée dans le panneau
- Une grille rendue deux fois : « Ma semaine » pour cocher, « Le cabinet » pour consulter et arbitrer
- Le détail d'une case : les vœux, leur fil de discussion, les décisions

**Les mails** — cinq messages, tous adressés à quelqu'un, dans une file `agenda_mails` dénormalisée vidée par `/api/agenda/tache` toutes les cinq minutes. Table et route séparées de celles du Klub, qui tourne en production et n'a pas à changer pour l'agenda.

**Ce qui n'est pas là** : les congés et la projection sur des dates réelles (C1b), les échanges de créneau (C1c).

Spec : `docs/superpowers/specs/2026-09-25-agenda-cabinet-design.md`
Plan : `docs/superpowers/plans/2026-09-26-agenda-cabinet-socle.md`

Vérifications : `npm test`, scénarios `supabase/tests/agenda.sql` en transaction annulée.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Demander la fusion**

Ne pas fusionner sans l'accord de Lucas. Lui signaler ce qu'il doit essayer lui-même sur la prévisualisation :

- poser un vœu depuis un compte praticien, l'accorder depuis le sien, vérifier que le praticien reçoit le mail ;
- demander le retrait de ce vœu depuis le compte praticien, vérifier que JB et lui reçoivent la demande ;
- tenter d'accorder la même case à deux personnes, et voir le message d'erreur.

---

## Ce que ce plan ne fait pas

- Les congés et les exceptions datées : livraison C1b.
- Les échanges de créneau : livraison C1c.
- Le sélecteur de semaine : il n'a de sens qu'avec les dates, donc C1b.
- La publication des présences sur le site : hors périmètre de la spec.
- Le récapitulatif quotidien et les notifications sur les articles et le Klub : chantier C2.
