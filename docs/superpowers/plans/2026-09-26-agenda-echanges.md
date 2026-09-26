# Agenda du cabinet, échanges de créneau (C1c) — plan d'implémentation

> **Pour les exécutants agentiques :** SOUS-COMPÉTENCE REQUISE — utiliser `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans` pour exécuter ce plan tâche par tâche. Les étapes se suivent en cochant les cases (`- [ ]`).

**But :** se dépanner entre praticiens sans passer par WhatsApp. Quelqu'un demande une case tenue par un autre, pour une semaine ou pour de bon, en offrant ou non une des siennes ; le titulaire accepte ; un gérant tranche.

**Architecture :** deux tables, `agenda_echanges` pour la demande et `agenda_exceptions` pour l'occupation datée qu'un accord produit. Aucune écriture directe : les quatre transitions passent par des fonctions `security definer`, parce qu'un accord modifie des lignes qui n'appartiennent pas à celui qui le déclenche — ce qu'aucune politique RLS ne sait exprimer. La grille du cabinet gagne une troisième couche de lecture, l'exception, par-dessus le vœu et l'absence.

**Pile :** Next.js 16 App Router, React 19, Supabase (projet `nuehdfyscqnkckudkqhe`), `node --test`.

**Spec :** `docs/superpowers/specs/2026-09-25-agenda-cabinet-design.md`, sections 2 bis et 2 ter. Ce plan couvre la livraison **C1c**, la dernière des trois.

**Ce qui est déjà en production**, livré par C1a (PR #30) et C1b (PR #31) :
- `agenda_voeux` (`jour` de 1 à 7 depuis l'ouverture au week-end), `agenda_commentaires`, `agenda_absences`, `agenda_mails`
- les fonctions `agenda_decider`, `agenda_demander_retrait`, `agenda_trancher_retrait`, `agenda_commenter`, et les internes `agenda__mettre_en_file`, `agenda__libelle_case`, `agenda__verifier_equipe`, `agenda_reserver_mails`
- les déclencheurs `agenda__garde_transition` et `agenda__absence_signaler`
- `lib/agenda/{salles,types,grille,semaine,mails,envoi}.ts`, `components/admin/agenda/{AgendaAdmin,Grille,CaseDetail,MesConges,rpc}.tsx`, la route `/api/agenda/tache`

---

## Règles pour l'exécutant

1. **Lire `AGENTS.md` à la racine.** Cette version de Next.js a des ruptures d'API. Avant d'utiliser une API Next que tu n'as pas déjà vue employée dans ce dépôt, lis le guide correspondant dans `node_modules/next/dist/docs/`.
2. **Base de production.** Le projet `nuehdfyscqnkckudkqhe` contient les vraies données du cabinet. Migrations avec `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration`, lectures avec `..._execute_sql`, `project_id` passé explicitement. **Ne jamais utiliser les outils `mcp__supabase__*`**, qui pointent sur un autre projet.
3. **Ne créer que les objets de ce plan.** Ne pas toucher `user_roles`, `is_practitioner()`, `profiles`, `articles`, ni aucune table `klub_*` ou `site_*`. **Une seule modification d'objet existant est prévue**, par la tâche 1 : remplacer la contrainte `agenda_mails_type_check` pour y ajouter trois types. Aucun autre `alter`, aucun `drop`.
4. **Tout essai destructif dans `begin; … rollback;`.**
5. **`profiles.id` n'est pas `profiles.user_id`.** La première est la clé propre de la table, la seconde référence `auth.users`. Elles ne coïncident sur aucune ligne. Tout ce qui se joint à `auth.users` passe par `user_id`.
6. **Lint React Compiler** : pas de `setState` dans le corps d'un effet, pas de mutation pendant le rendu. Le motif du dépôt est `window.setTimeout(() => void charger(), 0)`. `npm run lint` doit finir **sans aucun avertissement** ; s'il en apparaît un, il vient de toi.
7. **Le code de ce plan n'a jamais été compilé.** Si une signature du dépôt diffère de ce qu'il écrit, **suis le dépôt** et dis précisément ce qui différait. Ce n'est pas une faute — c'est arrivé deux fois sur les plans précédents.
8. **Commits.** `git add <chemins explicites>`, jamais `-a` ni `-am`. Messages en français, au style des commits existants.
9. Ne rien pousser et n'ouvrir aucune PR avant la tâche 7.

## Carte des fichiers

| Fichier | Responsabilité |
|---|---|
| `supabase/migrations/20260926130000_agenda_echanges.sql` | Les deux tables, leur RLS, les trois types de mail |
| `supabase/migrations/20260926130100_agenda_echanges_fonctions.sql` | Les quatre transitions et l'application d'un accord |
| `supabase/tests/agenda_echanges.sql` | Scénarios : les quatre effets, les refus, les droits |
| `lib/agenda/types.ts` | Ajouter `Echange` et `Exception` |
| `lib/agenda/occupation.ts` | Qui tient une case à une date : exception, puis vœu, puis absence |
| `lib/agenda/occupation.test.ts` | Tests unitaires de `occupation.ts` |
| `components/admin/agenda/DemanderEchange.tsx` | Le formulaire de demande, ouvert depuis une case |
| `components/admin/agenda/Echanges.tsx` | La vue : à répondre, mes demandes, à arbitrer |
| `components/admin/agenda/CaseDetail.tsx` | Le bouton « demander un échange » |
| `components/admin/agenda/Grille.tsx` | Lire l'occupant par `occupation.ts` |
| `components/admin/agenda/AgendaAdmin.tsx` | Le quatrième onglet, le chargement des échanges et des exceptions |

---

### Task 0: Espace de travail

- [ ] **Step 1: Vérifier l'état de départ**

```bash
cd /Users/lucas/Desktop/mugitu-biarritz-admin
git status --short
git log --oneline -2
```

Attendu : arbre propre, branche `feature/agenda-echanges`, dernier commit `d597f67 agenda : un échange ponctuel porte sur une semaine, pas une date`.

- [ ] **Step 2: Vérifier les tests existants**

Run: `npm test`
Attendu : 47 tests passent.

---

### Task 1: Les deux tables

**Files:**
- Create: `supabase/migrations/20260926130000_agenda_echanges.sql`

- [ ] **Step 1: Écrire la migration**

```sql
-- Agenda du cabinet : les échanges de créneau, et l'occupation datée
-- qu'un accord produit.
--
-- Un échange se joue à trois temps : le demandeur propose, le titulaire de
-- la case accepte ou refuse, puis un gérant tranche. Le gérant tranche même
-- quand les deux praticiens sont d'accord, pour la raison qui vaut déjà pour
-- un retrait : une case accordée engage le cabinet, et lui seul voit la
-- grille entière.
--
-- Aucune de ces deux tables ne s'écrit directement : tout passe par les
-- fonctions de la migration suivante. Un accord modifie des lignes qui
-- n'appartiennent pas à celui qui le déclenche, ce qu'aucune politique RLS
-- ne sait exprimer.

create table public.agenda_echanges (
  id uuid primary key default gen_random_uuid(),
  demandeur_id uuid not null references auth.users (id) on delete cascade,
  -- La case voulue. Si son vœu disparaît, la demande n'a plus d'objet.
  voeu_cible_id uuid not null references public.agenda_voeux (id) on delete cascade,
  -- Ce qu'on donne en retour. `null` = on demande sans rendre. Si le vœu
  -- offert disparaît, la demande change de nature en silence : on la
  -- supprime plutôt que de la laisser devenir une demande à sens unique.
  voeu_offert_id uuid references public.agenda_voeux (id) on delete cascade,
  portee text not null check (portee in ('ponctuel', 'definitif')),
  -- Le lundi de la semaine concernée. Un échange ponctuel porte sur une
  -- semaine et non sur une date : la date de chaque côté se déduit du jour
  -- de son propre vœu, ce qui permet d'échanger un mardi contre un jeudi.
  semaine date,
  motif text not null check (length(btrim(motif)) > 0),
  statut text not null default 'propose'
    check (statut in ('propose', 'accepte_pair', 'refuse_pair', 'valide', 'refuse', 'annule')),
  pair_le timestamptz,
  decide_par uuid references auth.users (id) on delete set null,
  decide_le timestamptz,
  created_at timestamptz not null default now(),
  -- La semaine est exigée pour un ponctuel et interdite pour un définitif.
  constraint agenda_echanges_semaine check ((portee = 'ponctuel') = (semaine is not null)),
  -- Et c'est bien un lundi : 1 = lundi au sens ISO.
  constraint agenda_echanges_lundi check (semaine is null or extract(isodow from semaine) = 1)
);

create index agenda_echanges_cible on public.agenda_echanges (voeu_cible_id, statut);
create index agenda_echanges_demandeur on public.agenda_echanges (demandeur_id, statut);
create index agenda_echanges_arbitrage on public.agenda_echanges (statut, created_at);

create table public.agenda_exceptions (
  id uuid primary key default gen_random_uuid(),
  jour date not null,
  salle text not null check (salle in ('lurra', 'airea', 'etera', 'sua', 'ura')),
  moment text not null check (moment in ('matin', 'aprem')),
  user_id uuid not null references auth.users (id) on delete cascade,
  -- D'où elle vient. Mise à null si la demande est purgée : l'échange a eu
  -- lieu, et supprimer sa trace ne doit pas défaire l'occupation.
  echange_id uuid references public.agenda_echanges (id) on delete set null,
  created_at timestamptz not null default now(),
  -- Une case n'a qu'un occupant à une date donnée.
  unique (jour, salle, moment)
);

create index agenda_exceptions_semaine on public.agenda_exceptions (jour);
create index agenda_exceptions_personne on public.agenda_exceptions (user_id, jour);

alter table public.agenda_echanges enable row level security;
alter table public.agenda_exceptions enable row level security;

-- Lecture pour toute l'équipe : la vision d'ensemble est le but de l'outil,
-- et savoir qui a demandé quoi fait partie de la discussion.
create policy agenda_echanges_lecture on public.agenda_echanges
  for select to authenticated using (public.site_est_equipe());

create policy agenda_exceptions_lecture on public.agenda_exceptions
  for select to authenticated using (public.site_est_equipe());

-- Aucune politique d'écriture sur les échanges : les quatre fonctions de la
-- migration suivante en ont le monopole.

-- Une exception posée par erreur doit pouvoir se défaire, sinon une case est
-- bloquée à une date pour toujours. Réservé aux gérants.
create policy agenda_exceptions_suppression on public.agenda_exceptions
  for delete to authenticated using (public.site_est_super_admin());

revoke all on public.agenda_echanges from anon;
revoke all on public.agenda_exceptions from anon;
grant select on public.agenda_echanges to authenticated;
grant select, delete on public.agenda_exceptions to authenticated;

-- Trois types de mail rejoignent la file.
alter table public.agenda_mails drop constraint agenda_mails_type_check;
alter table public.agenda_mails add constraint agenda_mails_type_check
  check (type in ('voeu_valide', 'voeu_refuse', 'retrait_demande', 'retrait_tranche',
                  'commentaire', 'absence',
                  'echange_propose', 'echange_pair', 'echange_tranche'));
```

- [ ] **Step 2: Appliquer la migration**

Outil `apply_migration`, `project_id` = `nuehdfyscqnkckudkqhe`, `name` = `agenda_echanges`.

- [ ] **Step 3: Vérifier les objets et les droits**

```sql
select
  (select count(*) from information_schema.tables
    where table_schema='public' and table_name in ('agenda_echanges','agenda_exceptions')) as tables,
  (select count(*) from pg_policies where schemaname='public'
    and tablename in ('agenda_echanges','agenda_exceptions')) as politiques,
  (select count(*) from information_schema.role_table_grants
    where table_schema='public' and table_name in ('agenda_echanges','agenda_exceptions')
      and grantee='anon') as droits_anon,
  (select pg_get_constraintdef(con.oid) from pg_constraint con
     join pg_class c on c.oid = con.conrelid
    where c.relname='agenda_mails' and con.conname='agenda_mails_type_check') as type_mail;
```

Attendu : `tables` 2, `politiques` 3, `droits_anon` 0, et `type_mail` contenant les trois nouveaux types.

- [ ] **Step 4: Vérifier que les contraintes de cohérence mordent**

```sql
begin;
do $$
declare
  v_hugo uuid; v_voeu uuid;
begin
  select id into v_hugo from auth.users where email = 'hugo.daminato@gmail.com';
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_hugo, 'sua', 2, 'matin', 'valide') returning id into v_voeu;

  -- Un ponctuel sans semaine est refusé.
  begin
    insert into public.agenda_echanges (demandeur_id, voeu_cible_id, portee, motif)
    values (v_hugo, v_voeu, 'ponctuel', 'Essai');
    assert false, 'un ponctuel sans semaine est accepté';
  exception when check_violation then null;
  end;

  -- Un définitif avec semaine est refusé.
  begin
    insert into public.agenda_echanges (demandeur_id, voeu_cible_id, portee, semaine, motif)
    values (v_hugo, v_voeu, 'definitif', '2026-10-05', 'Essai');
    assert false, 'un définitif avec semaine est accepté';
  exception when check_violation then null;
  end;

  -- Une semaine qui n'est pas un lundi est refusée.
  begin
    insert into public.agenda_echanges (demandeur_id, voeu_cible_id, portee, semaine, motif)
    values (v_hugo, v_voeu, 'ponctuel', '2026-10-07', 'Essai');
    assert false, 'une semaine qui n''est pas un lundi est acceptée';
  exception when check_violation then null;
  end;

  -- Et un lundi passe.
  insert into public.agenda_echanges (demandeur_id, voeu_cible_id, portee, semaine, motif)
  values (v_hugo, v_voeu, 'ponctuel', '2026-10-05', 'Essai');
end $$;
rollback;
select 'contraintes des échanges : OK' as resultat,
       (select count(*) from public.agenda_echanges) as echanges,
       (select count(*) from public.agenda_voeux) as voeux;
```

Attendu : `contraintes des échanges : OK`, `echanges` 0, `voeux` égal au nombre réel de vœux en base avant l'essai.

Le 5 octobre 2026 est un lundi, le 7 un mercredi : vérifié au calendrier.

- [ ] **Step 5: Commit**

```bash
git add supabase/migrations/20260926130000_agenda_echanges.sql
git commit -m "$(cat <<'EOF'
agenda : les tables des échanges et des occupations datées

Un échange ponctuel porte sur une semaine, pas une date : la date de
chaque côté se déduit du jour de son propre vœu, ce qui permet d'échanger
un mardi contre un jeudi. Deux contraintes le tiennent — la semaine est
exigée pour un ponctuel, interdite pour un définitif, et c'est bien un
lundi.

Aucune politique d'écriture sur les échanges : les fonctions de la
migration suivante en ont le monopole, parce qu'un accord modifie des
lignes qui n'appartiennent pas à celui qui le déclenche.

Une exception se supprime, mais par un gérant seulement : sans cela une
case posée par erreur resterait bloquée à cette date pour toujours.
EOF
)"
```

---

### Task 2: Les quatre transitions

**Files:**
- Create: `supabase/migrations/20260926130100_agenda_echanges_fonctions.sql`

- [ ] **Step 1: Écrire la migration**

```sql
-- Agenda : les quatre transitions d'un échange, et l'application d'un accord.
--
-- Codes levés : AGENDA_DROITS, AGENDA_VOEU, AGENDA_STATUT, AGENDA_MOTIF,
-- AGENDA_SOI_MEME, AGENDA_SEMAINE, AGENDA_CASE_PRISE.

-- Le nom affichable d'un compte, pour les mails.
create or replace function public.agenda__nom(p_user uuid)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  -- profiles.user_id référence auth.users ; profiles.id est une autre clé.
  select coalesce(p.first_name || ' ' || p.last_name, u.email)
    from auth.users u
    left join public.profiles p on p.user_id = u.id
   where u.id = p_user;
$$;

revoke all on function public.agenda__nom(uuid) from public, anon, authenticated;

-- Le libellé d'un échange, pour les mails et les fils.
create or replace function public.agenda__libelle_echange(p_echange uuid)
returns text
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  e record; c record; o record; v_texte text;
begin
  select * into e from public.agenda_echanges where id = p_echange;
  if not found then return ''; end if;
  select * into c from public.agenda_voeux where id = e.voeu_cible_id;

  v_texte := public.agenda__nom(e.demandeur_id) || ' demande '
          || public.agenda__libelle_case(c.salle, c.jour, c.moment);

  if e.voeu_offert_id is not null then
    select * into o from public.agenda_voeux where id = e.voeu_offert_id;
    v_texte := v_texte || ', en échange de ' || public.agenda__libelle_case(o.salle, o.jour, o.moment);
  else
    v_texte := v_texte || ', sans contrepartie';
  end if;

  if e.portee = 'ponctuel' then
    v_texte := v_texte || ', pour la semaine du ' || to_char(e.semaine, 'DD/MM/YYYY');
  else
    v_texte := v_texte || ', de façon définitive';
  end if;

  return v_texte;
end;
$$;

revoke all on function public.agenda__libelle_echange(uuid) from public, anon, authenticated;

-- 1. Proposer un échange.
create or replace function public.agenda_proposer_echange(
  p_cible uuid, p_offert uuid, p_portee text, p_semaine date, p_motif text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  c record; o record; v_id uuid;
begin
  perform public.agenda__verifier_equipe();
  if p_motif is null or length(btrim(p_motif)) = 0 then raise exception 'AGENDA_MOTIF'; end if;
  if p_portee not in ('ponctuel', 'definitif') then raise exception 'AGENDA_STATUT'; end if;

  select * into c from public.agenda_voeux where id = p_cible;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if c.statut <> 'valide' then raise exception 'AGENDA_STATUT'; end if;
  if c.user_id = auth.uid() then raise exception 'AGENDA_SOI_MEME'; end if;

  if p_offert is not null then
    select * into o from public.agenda_voeux where id = p_offert;
    if not found then raise exception 'AGENDA_VOEU'; end if;
    if o.user_id <> auth.uid() then raise exception 'AGENDA_DROITS'; end if;
    if o.statut <> 'valide' then raise exception 'AGENDA_STATUT'; end if;
  end if;

  if p_portee = 'ponctuel' then
    if p_semaine is null then raise exception 'AGENDA_SEMAINE'; end if;
    -- Un lundi, et pas une semaine déjà passée : un échange rétroactif
    -- n'arrange personne et poserait une exception invisible.
    if extract(isodow from p_semaine) <> 1 then raise exception 'AGENDA_SEMAINE'; end if;
    if p_semaine < date_trunc('week', current_date)::date then raise exception 'AGENDA_SEMAINE'; end if;
  elsif p_semaine is not null then
    raise exception 'AGENDA_SEMAINE';
  end if;

  insert into public.agenda_echanges (demandeur_id, voeu_cible_id, voeu_offert_id, portee, semaine, motif)
  values (auth.uid(), p_cible, p_offert, p_portee,
          case when p_portee = 'ponctuel' then p_semaine end, btrim(p_motif))
  returning id into v_id;

  perform public.agenda__mettre_en_file('echange_propose', c.user_id,
    'Demande d''échange de créneau',
    public.agenda__libelle_echange(v_id) || chr(10) || chr(10) || btrim(p_motif));

  return v_id;
end;
$$;

revoke all on function public.agenda_proposer_echange(uuid, uuid, text, date, text) from public, anon;
grant execute on function public.agenda_proposer_echange(uuid, uuid, text, date, text) to authenticated;

-- 2. Le titulaire de la case répond.
create or replace function public.agenda_repondre_echange(p_echange uuid, p_accepte boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  e record; c record; v_gerant record; v_libelle text;
begin
  perform public.agenda__verifier_equipe();

  select * into e from public.agenda_echanges where id = p_echange for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if e.statut <> 'propose' then raise exception 'AGENDA_STATUT'; end if;

  select * into c from public.agenda_voeux where id = e.voeu_cible_id;
  if c.user_id <> auth.uid() then raise exception 'AGENDA_DROITS'; end if;

  v_libelle := public.agenda__libelle_echange(p_echange);

  update public.agenda_echanges
     set statut = case when p_accepte then 'accepte_pair' else 'refuse_pair' end,
         pair_le = now()
   where id = p_echange;

  if p_accepte then
    -- Les deux sont d'accord : c'est aux gérants de trancher.
    for v_gerant in select user_id from public.site_super_admins loop
      perform public.agenda__mettre_en_file('echange_pair', v_gerant.user_id,
        'Échange à arbitrer', v_libelle || chr(10) || chr(10)
        || public.agenda__nom(c.user_id) || ' est d''accord.');
    end loop;
  else
    perform public.agenda__mettre_en_file('echange_pair', e.demandeur_id,
      'Votre demande d''échange est refusée',
      v_libelle || chr(10) || chr(10) || public.agenda__nom(c.user_id) || ' a refusé.');
  end if;
end;
$$;

revoke all on function public.agenda_repondre_echange(uuid, boolean) from public, anon;
grant execute on function public.agenda_repondre_echange(uuid, boolean) to authenticated;

-- 3. Un gérant tranche, et l'accord s'applique.
create or replace function public.agenda_trancher_echange(
  p_echange uuid, p_accorde boolean, p_commentaire text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  e record; c record; o record;
  v_libelle text;
  v_jour_cible date;
  v_jour_offert date;
begin
  if not coalesce(public.site_est_super_admin(), false) then raise exception 'AGENDA_DROITS'; end if;

  select * into e from public.agenda_echanges where id = p_echange for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  -- Un gérant ne tranche pas ce que le pair n'a pas accepté.
  if e.statut <> 'accepte_pair' then raise exception 'AGENDA_STATUT'; end if;

  select * into c from public.agenda_voeux where id = e.voeu_cible_id for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if e.voeu_offert_id is not null then
    select * into o from public.agenda_voeux where id = e.voeu_offert_id for no key update;
  end if;

  v_libelle := public.agenda__libelle_echange(p_echange);

  if p_accorde then
    if e.portee = 'ponctuel' then
      -- La date de chaque côté se déduit du jour de son propre vœu.
      v_jour_cible := e.semaine + (c.jour - 1);

      -- Deux échanges accordés sur la même case à la même date : on lève un
      -- code lisible plutôt que de laisser remonter la violation d'unicité,
      -- dont le message brut n'apprendrait rien au gérant.
      if exists (select 1 from public.agenda_exceptions
                  where jour = v_jour_cible and salle = c.salle and moment = c.moment) then
        raise exception 'AGENDA_EXCEPTION_PRISE';
      end if;

      insert into public.agenda_exceptions (jour, salle, moment, user_id, echange_id)
      values (v_jour_cible, c.salle, c.moment, e.demandeur_id, p_echange);

      if e.voeu_offert_id is not null then
        v_jour_offert := e.semaine + (o.jour - 1);
        if exists (select 1 from public.agenda_exceptions
                    where jour = v_jour_offert and salle = o.salle and moment = o.moment) then
          raise exception 'AGENDA_EXCEPTION_PRISE';
        end if;
        insert into public.agenda_exceptions (jour, salle, moment, user_id, echange_id)
        values (v_jour_offert, o.salle, o.moment, c.user_id, p_echange);
      end if;
    else
      -- Définitif : les vœux changent de propriétaire. On retire d'abord un
      -- éventuel vœu du receveur sur cette case, sinon l'unicité
      -- (user_id, salle, jour, moment) refuse le changement.
      perform set_config('agenda.transition', '1', true);

      delete from public.agenda_voeux
       where user_id = e.demandeur_id and salle = c.salle and jour = c.jour
         and moment = c.moment and id <> c.id;
      update public.agenda_voeux set user_id = e.demandeur_id where id = c.id;

      if e.voeu_offert_id is not null then
        delete from public.agenda_voeux
         where user_id = c.user_id and salle = o.salle and jour = o.jour
           and moment = o.moment and id <> o.id;
        update public.agenda_voeux set user_id = c.user_id where id = o.id;
      end if;

      perform set_config('agenda.transition', '', true);
    end if;
  end if;

  update public.agenda_echanges
     set statut = case when p_accorde then 'valide' else 'refuse' end,
         decide_par = auth.uid(), decide_le = now()
   where id = p_echange;

  perform public.agenda__mettre_en_file('echange_tranche', e.demandeur_id,
    case when p_accorde then 'Échange accordé' else 'Échange refusé' end,
    v_libelle || chr(10) || chr(10) || coalesce(btrim(p_commentaire), ''));
  perform public.agenda__mettre_en_file('echange_tranche', c.user_id,
    case when p_accorde then 'Échange accordé' else 'Échange refusé' end,
    v_libelle || chr(10) || chr(10) || coalesce(btrim(p_commentaire), ''));
end;
$$;

revoke all on function public.agenda_trancher_echange(uuid, boolean, text) from public, anon;
grant execute on function public.agenda_trancher_echange(uuid, boolean, text) to authenticated;

-- 4. Le demandeur annule, tant que rien n'est tranché.
create or replace function public.agenda_annuler_echange(p_echange uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  e record;
begin
  perform public.agenda__verifier_equipe();

  select * into e from public.agenda_echanges where id = p_echange for no key update;
  if not found then raise exception 'AGENDA_VOEU'; end if;
  if e.demandeur_id <> auth.uid() then raise exception 'AGENDA_DROITS'; end if;
  if e.statut not in ('propose', 'accepte_pair') then raise exception 'AGENDA_STATUT'; end if;

  update public.agenda_echanges set statut = 'annule' where id = p_echange;
end;
$$;

revoke all on function public.agenda_annuler_echange(uuid) from public, anon;
grant execute on function public.agenda_annuler_echange(uuid) to authenticated;
```

- [ ] **Step 2: Appliquer la migration**

Outil `apply_migration`, `project_id` = `nuehdfyscqnkckudkqhe`, `name` = `agenda_echanges_fonctions`.

- [ ] **Step 3: Vérifier les droits d'exécution**

```sql
select p.proname,
       has_function_privilege('anon', p.oid, 'execute') as anon,
       has_function_privilege('authenticated', p.oid, 'execute') as authentifie
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public' and p.proname like 'agenda%echange%' or p.proname = 'agenda__nom'
order by p.proname;
```

Attendu : `anon` faux partout ; `authentifie` vrai pour `agenda_proposer_echange`, `agenda_repondre_echange`, `agenda_trancher_echange`, `agenda_annuler_echange` ; faux pour `agenda__nom` et `agenda__libelle_echange`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260926130100_agenda_echanges_fonctions.sql
git commit -m "$(cat <<'EOF'
agenda : les quatre transitions d'un échange

Un gérant ne tranche que ce que le pair a accepté : agenda_trancher_echange
exige le statut accepte_pair.

Sur un échange définitif, les vœux changent de propriétaire. On retire
d'abord un éventuel vœu du receveur sur la même case, sinon l'unicité
(user_id, salle, jour, moment) refuse le changement. Et le drapeau de
session agenda.transition est posé, parce que le déclencheur de garde
interdit sinon de toucher aux lignes.

Un ponctuel refuse une semaine passée : un échange rétroactif n'arrange
personne et poserait une exception que personne ne verrait.
EOF
)"
```

---

### Task 3: Les scénarios

**Files:**
- Create: `supabase/tests/agenda_echanges.sql`

- [ ] **Step 1: Écrire le fichier**

```sql
-- Échanges de créneau. Tout se passe dans une transaction annulée : rien
-- n'est écrit. Lancer avec l'outil MCP execute_sql (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « échanges : scénarios OK ».
--
-- Les quatre effets d'un accord sont vérifiés un par un, parce que c'est là
-- que tout se joue : deux portées, avec ou sans contrepartie.

begin;

-- BLOC PARCOURS ET DROITS
do $$
declare
  v_lucas uuid; v_hugo uuid; v_kine uuid;
  v_cible uuid; v_offert uuid; v_ech uuid;
  v_lundi date := (date_trunc('week', current_date) + interval '7 days')::date;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  assert v_lucas is not null and v_hugo is not null and v_kine is not null, 'E0 comptes absents';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);

  -- Kine tient sua mardi matin, Hugo tient ura jeudi après-midi.
  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_kine, 'sua', 2, 'matin', 'valide') returning id into v_cible;
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_hugo, 'ura', 4, 'aprem', 'valide') returning id into v_offert;
  perform set_config('agenda.transition', '', true);

  -- E1. On ne demande pas sa propre case.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_proposer_echange(v_cible, null, 'definitif', null, 'La mienne');
    assert false, 'E1 on demande sa propre case';
  exception when raise_exception then assert sqlerrm = 'AGENDA_SOI_MEME', 'E1 ' || sqlerrm;
  end;

  -- E2. On n'offre pas la case d'un autre.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_proposer_echange(v_cible, v_offert, 'definitif', null, 'Pas à moi');
    assert false, 'E2 on offre la case d''un autre';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'E2 ' || sqlerrm;
  end;

  -- E3. Une semaine passée est refusée.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_proposer_echange(v_cible, null, 'ponctuel',
      (date_trunc('week', current_date) - interval '7 days')::date, 'Trop tard');
    assert false, 'E3 une semaine passée est acceptée';
  exception when raise_exception then assert sqlerrm = 'AGENDA_SEMAINE', 'E3 ' || sqlerrm;
  end;

  -- E4. Hugo propose, et le titulaire est prévenu.
  v_ech := public.agenda_proposer_echange(v_cible, v_offert, 'ponctuel', v_lundi, 'Je dépanne un patient.');
  assert (select statut from public.agenda_echanges where id = v_ech) = 'propose', 'E4a';
  assert exists (select 1 from public.agenda_mails where type = 'echange_propose'), 'E4b';

  -- E5. Un tiers ne répond pas à sa place.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_repondre_echange(v_ech, true);
    assert false, 'E5 un tiers répond pour le titulaire';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'E5 ' || sqlerrm;
  end;

  -- E6. Un gérant ne tranche pas avant le pair.
  begin
    perform public.agenda_trancher_echange(v_ech, true, null);
    assert false, 'E6 un gérant tranche avant le pair';
  exception when raise_exception then assert sqlerrm = 'AGENDA_STATUT', 'E6 ' || sqlerrm;
  end;

  -- E7. Le titulaire accepte, les gérants sont prévenus.
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  perform public.agenda_repondre_echange(v_ech, true);
  assert (select statut from public.agenda_echanges where id = v_ech) = 'accepte_pair', 'E7a';
  assert exists (select 1 from public.agenda_mails where type = 'echange_pair'), 'E7b';

  -- E8. Un praticien ne tranche pas.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_trancher_echange(v_ech, true, null);
    assert false, 'E8 un praticien tranche un échange';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'E8 ' || sqlerrm;
  end;

  -- E9. Effet « ponctuel avec contrepartie » : deux exceptions croisées,
  -- chacune à la date de son propre jour.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_trancher_echange(v_ech, true, 'D''accord.');
  assert (select statut from public.agenda_echanges where id = v_ech) = 'valide', 'E9a';
  assert exists (select 1 from public.agenda_exceptions
                  where jour = v_lundi + 1 and salle = 'sua' and moment = 'matin' and user_id = v_hugo), 'E9b';
  assert exists (select 1 from public.agenda_exceptions
                  where jour = v_lundi + 3 and salle = 'ura' and moment = 'aprem' and user_id = v_kine), 'E9c';
  assert (select count(*) from public.agenda_exceptions where echange_id = v_ech) = 2, 'E9d';
  -- Les vœux n'ont pas bougé : un ponctuel ne touche pas la semaine type.
  assert (select user_id from public.agenda_voeux where id = v_cible) = v_kine, 'E9e';
  assert (select user_id from public.agenda_voeux where id = v_offert) = v_hugo, 'E9f';

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC EFFET PONCTUEL SANS CONTREPARTIE
do $$
declare
  v_lucas uuid; v_hugo uuid; v_kine uuid; v_cible uuid; v_ech uuid;
  v_lundi date := (date_trunc('week', current_date) + interval '14 days')::date;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);

  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_kine, 'etera', 5, 'matin', 'valide') returning id into v_cible;
  perform set_config('agenda.transition', '', true);

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  v_ech := public.agenda_proposer_echange(v_cible, null, 'ponctuel', v_lundi, 'Sans contrepartie.');
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  perform public.agenda_repondre_echange(v_ech, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_trancher_echange(v_ech, true, null);

  -- Une seule exception, celle de la case cible.
  assert (select count(*) from public.agenda_exceptions where echange_id = v_ech) = 1, 'F1a';
  assert exists (select 1 from public.agenda_exceptions
                  where jour = v_lundi + 4 and salle = 'etera' and moment = 'matin' and user_id = v_hugo), 'F1b';

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC EFFET DÉFINITIF
do $$
declare
  v_lucas uuid; v_hugo uuid; v_kine uuid;
  v_cible uuid; v_offert uuid; v_ech uuid; v_ech2 uuid; v_cible2 uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);

  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_kine, 'lurra', 1, 'matin', 'valide') returning id into v_cible;
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_hugo, 'airea', 3, 'aprem', 'valide') returning id into v_offert;
  perform set_config('agenda.transition', '', true);

  -- G1. Définitif avec contrepartie : les deux vœux changent de propriétaire.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  v_ech := public.agenda_proposer_echange(v_cible, v_offert, 'definitif', null, 'On troque pour de bon.');
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  perform public.agenda_repondre_echange(v_ech, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_trancher_echange(v_ech, true, null);

  assert (select user_id from public.agenda_voeux where id = v_cible) = v_hugo, 'G1a';
  assert (select user_id from public.agenda_voeux where id = v_offert) = v_kine, 'G1b';
  -- Un définitif ne pose aucune exception.
  assert not exists (select 1 from public.agenda_exceptions where echange_id = v_ech), 'G1c';
  -- Les deux vœux restent accordés.
  assert (select statut from public.agenda_voeux where id = v_cible) = 'valide', 'G1d';

  -- G2. Définitif sans contrepartie : la case change de main, sans retour.
  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_kine, 'sua', 6, 'matin', 'valide') returning id into v_cible2;
  perform set_config('agenda.transition', '', true);

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  v_ech2 := public.agenda_proposer_echange(v_cible2, null, 'definitif', null, 'Je la reprends.');
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  perform public.agenda_repondre_echange(v_ech2, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_trancher_echange(v_ech2, true, null);

  assert (select user_id from public.agenda_voeux where id = v_cible2) = v_hugo, 'G2a';
  assert (select count(*) from public.agenda_voeux where id = v_cible2) = 1, 'G2b';

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC REFUS ET ANNULATION
do $$
declare
  v_lucas uuid; v_hugo uuid; v_kine uuid; v_cible uuid; v_ech uuid;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  select u.id into v_kine  from auth.users u where u.email = 'jbc.kine@gmail.com';
  delete from public.site_super_admins where user_id in (v_hugo, v_kine);

  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_kine, 'ura', 7, 'aprem', 'valide') returning id into v_cible;
  perform set_config('agenda.transition', '', true);

  -- H1. Le pair refuse : rien ne change, et l'affaire s'arrête là.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  v_ech := public.agenda_proposer_echange(v_cible, null, 'definitif', null, 'Essai refusé.');
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  perform public.agenda_repondre_echange(v_ech, false);
  assert (select statut from public.agenda_echanges where id = v_ech) = 'refuse_pair', 'H1a';
  assert (select user_id from public.agenda_voeux where id = v_cible) = v_kine, 'H1b';

  -- H2. Un gérant ne peut plus rien en faire.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_trancher_echange(v_ech, true, null);
    assert false, 'H2 un gérant tranche un échange refusé par le pair';
  exception when raise_exception then assert sqlerrm = 'AGENDA_STATUT', 'H2 ' || sqlerrm;
  end;

  -- H3. Le demandeur annule tant que rien n'est tranché.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  v_ech := public.agenda_proposer_echange(v_cible, null, 'definitif', null, 'À annuler.');
  perform public.agenda_annuler_echange(v_ech);
  assert (select statut from public.agenda_echanges where id = v_ech) = 'annule', 'H3';

  -- H4. Un tiers n'annule pas la demande d'un autre.
  v_ech := public.agenda_proposer_echange(v_cible, null, 'ponctuel',
    (date_trunc('week', current_date) + interval '21 days')::date, 'Pas la mienne à annuler.');
  perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  begin
    perform public.agenda_annuler_echange(v_ech);
    assert false, 'H4 un tiers annule la demande d''un autre';
  exception when raise_exception then assert sqlerrm = 'AGENDA_DROITS', 'H4 ' || sqlerrm;
  end;

  -- H4b. Deux échanges accordés sur la même case à la même date : le second
  -- lève un code lisible, pas une violation d'unicité brute.
  declare
    v_lundi2 date := (date_trunc('week', current_date) + interval '28 days')::date;
    v_a uuid; v_b uuid; v_autre_cible uuid;
  begin
    perform set_config('agenda.transition', '1', true);
    insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
    values (v_kine, 'airea', 2, 'matin', 'valide') returning id into v_autre_cible;
    perform set_config('agenda.transition', '', true);

    perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
    v_a := public.agenda_proposer_echange(v_autre_cible, null, 'ponctuel', v_lundi2, 'Premier.');
    v_b := public.agenda_proposer_echange(v_autre_cible, null, 'ponctuel', v_lundi2, 'Second.');
    perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
    perform public.agenda_repondre_echange(v_a, true);
    perform public.agenda_repondre_echange(v_b, true);
    perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
    perform public.agenda_trancher_echange(v_a, true, null);
    begin
      perform public.agenda_trancher_echange(v_b, true, null);
      assert false, 'H4b deux échanges accordés sur la même case et la même date';
    exception when raise_exception then
      assert sqlerrm = 'AGENDA_EXCEPTION_PRISE', 'H4b ' || sqlerrm;
    end;

    -- Ce bloc a promené l'identité de session : on la remet sur le pair,
    -- pour que H5 ne parte pas avec celle du gérant.
    perform set_config('request.jwt.claims', json_build_object('sub', v_kine, 'role', 'authenticated')::text, true);
  end;

  -- H5. Le gérant refuse un échange que le pair avait accepté : rien ne bouge.
  perform public.agenda_repondre_echange(v_ech, true);
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.agenda_trancher_echange(v_ech, false, 'Pas cette semaine.');
  assert (select statut from public.agenda_echanges where id = v_ech) = 'refuse', 'H5a';
  assert not exists (select 1 from public.agenda_exceptions where echange_id = v_ech), 'H5b';

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC ÉCRITURES DIRECTES ET ANON
do $$
declare
  v_hugo uuid; v_cible uuid;
begin
  select u.id into v_hugo from auth.users u where u.email = 'hugo.daminato@gmail.com';
  perform set_config('agenda.transition', '1', true);
  insert into public.agenda_voeux (user_id, salle, jour, moment, statut)
  values (v_hugo, 'lurra', 2, 'aprem', 'valide') returning id into v_cible;
  perform set_config('agenda.transition', '', true);

  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  set local role authenticated;

  -- I1. On n'insère pas un échange à la main.
  begin
    insert into public.agenda_echanges (demandeur_id, voeu_cible_id, portee, motif)
    values (v_hugo, v_cible, 'definitif', 'Direct');
    assert false, 'I1 écriture directe dans agenda_echanges';
  exception when insufficient_privilege then null;
  end;

  -- I2. On n'insère pas une exception à la main : l'arbitrage est le seul chemin.
  begin
    insert into public.agenda_exceptions (jour, salle, moment, user_id)
    values (current_date + 7, 'lurra', 'matin', v_hugo);
    assert false, 'I2 écriture directe dans agenda_exceptions';
  exception when insufficient_privilege then null;
  end;

  reset role;
  perform set_config('request.jwt.claims', '', true);
end $$;

set local role anon;
do $$
begin
  begin
    assert (select count(*) from public.agenda_echanges) = 0, 'P1 anon lit les échanges';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.agenda_proposer_echange(gen_random_uuid(), null, 'definitif', null, 'x');
    assert false, 'P2 anon propose un échange';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'échanges : scénarios OK' as resultat;
```

- [ ] **Step 2: Lancer les scénarios**

Outil `execute_sql`, `project_id` = `nuehdfyscqnkckudkqhe`, `query` = le contenu du fichier, **en une seule fois**.
Attendu : `[{"resultat":"échanges : scénarios OK"}]`.

Si un `assert` échoue, le message nomme le scénario (`E9b`, `G1a`…). Deux lectures : le scénario est mal écrit, ou les migrations des tâches 1-2 ont un vrai défaut. **Ne pas modifier le scénario pour le faire passer sans avoir établi laquelle des deux.**

- [ ] **Step 3: Vérifier que rien n'a persisté**

```sql
select
  (select count(*) from public.agenda_echanges) as echanges,
  (select count(*) from public.agenda_exceptions) as exceptions,
  (select count(*) from public.agenda_voeux) as voeux,
  (select count(*) from public.agenda_mails) as mails,
  (select count(*) from public.site_super_admins) as super_admins;
```

Attendu : `echanges` 0, `exceptions` 0, `mails` 0, `super_admins` 2, et `voeux` égal au nombre de vrais vœux posés par l'équipe avant l'essai.

- [ ] **Step 4: Commit**

```bash
git add supabase/tests/agenda_echanges.sql
git commit -m "$(cat <<'EOF'
agenda : scénarios des échanges de créneau

Les quatre effets d'un accord sont vérifiés un par un — c'est là que tout
se joue. Le plus important est E9 : un échange ponctuel croisé pose deux
exceptions, chacune à la date de son propre jour, et ne touche pas la
semaine type.

Les refus aussi : le pair refuse et rien ne change, le gérant refuse et
rien ne change, un gérant ne tranche pas ce que le pair n'a pas accepté,
et personne n'insère un échange ni une exception à la main.

H4b couvre le cas qui aurait fait remonter une violation d'unicité brute
à l'écran : deux échanges accordés sur la même case à la même date.
EOF
)"
```

---

### Task 4: Qui tient une case à une date

**Files:**
- Create: `lib/agenda/occupation.ts`
- Test: `lib/agenda/occupation.test.ts`
- Modify: `lib/agenda/types.ts`

- [ ] **Step 1: Écrire le test qui échoue**

`lib/agenda/occupation.test.ts` :

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { occupantALaDate } from "./occupation.ts";
import type { Absence, Exception, Voeu } from "./types.ts";

const voeu = (id: string, user: string, jour: number): Voeu => ({
  id,
  user_id: user,
  salle: "sua",
  jour,
  moment: "matin",
  statut: "valide",
  decide_par: null,
  decide_le: null,
});

const exc = (jour: string, user: string): Exception => ({
  id: `x-${jour}`,
  jour,
  salle: "sua",
  moment: "matin",
  user_id: user,
  echange_id: null,
});

const abs = (user: string, du: string, au: string): Absence => ({
  id: `a-${user}-${du}`,
  user_id: user,
  du,
  au,
  motif: null,
});

// Semaine du lundi 21 septembre 2026 ; le mardi est le 22.
const LUNDI = "2026-09-21";

test("sans rien, la case est libre", () => {
  const o = occupantALaDate([], [], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, null);
  assert.equal(o.absent, false);
  assert.equal(o.origine, "libre");
});

test("le vœu accordé tient la case", () => {
  const o = occupantALaDate([voeu("1", "u1", 2)], [], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u1");
  assert.equal(o.origine, "voeu");
});

test("une exception écrase le vœu à sa date", () => {
  const o = occupantALaDate([voeu("1", "u1", 2)], [exc("2026-09-22", "u2")], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u2");
  assert.equal(o.origine, "exception");
});

test("une exception d’une autre semaine ne change rien", () => {
  const o = occupantALaDate([voeu("1", "u1", 2)], [exc("2026-09-29", "u2")], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u1");
  assert.equal(o.origine, "voeu");
});

test("une exception d’un autre jour de la semaine ne change rien", () => {
  const o = occupantALaDate([voeu("1", "u1", 2)], [exc("2026-09-23", "u2")], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u1");
});

test("un titulaire absent garde sa case, mais l’écran le dit", () => {
  const o = occupantALaDate([voeu("1", "u1", 2)], [], [abs("u1", "2026-09-21", "2026-09-25")], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u1");
  assert.equal(o.absent, true);
});

test("l’absence suit l’occupant réel, pas le titulaire du vœu", () => {
  // u2 prend la case par exception, et c'est u2 qui est absent.
  const o = occupantALaDate(
    [voeu("1", "u1", 2)],
    [exc("2026-09-22", "u2")],
    [abs("u2", "2026-09-22", "2026-09-22")],
    "sua",
    2,
    "matin",
    LUNDI,
  );
  assert.equal(o.userId, "u2");
  assert.equal(o.absent, true);
});

test("un vœu seulement proposé ne tient pas la case", () => {
  const propose = { ...voeu("1", "u1", 2), statut: "propose" as const };
  const o = occupantALaDate([propose], [], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, null);
  assert.equal(o.origine, "libre");
});

test("un retrait demandé tient encore la case", () => {
  const retrait = { ...voeu("1", "u1", 2), statut: "retrait_demande" as const };
  const o = occupantALaDate([retrait], [], [], "sua", 2, "matin", LUNDI);
  assert.equal(o.userId, "u1");
});
```

- [ ] **Step 2: Lancer le test pour le voir échouer**

Run: `node --test lib/agenda/occupation.test.ts`
Attendu : ÉCHEC, `ERR_MODULE_NOT_FOUND` pour `./occupation.ts`.

- [ ] **Step 3: Ajouter les deux types**

À la fin de `lib/agenda/types.ts` :

```ts
export type Exception = {
  id: string;
  /** `AAAA-MM-JJ` : une date réelle, pas un jour de la semaine. */
  jour: string;
  salle: string;
  moment: string;
  user_id: string;
  echange_id: string | null;
};

export type StatutEchange = "propose" | "accepte_pair" | "refuse_pair" | "valide" | "refuse" | "annule";

export type Echange = {
  id: string;
  demandeur_id: string;
  voeu_cible_id: string;
  voeu_offert_id: string | null;
  portee: "ponctuel" | "definitif";
  /** Le lundi de la semaine concernée, `null` pour un définitif. */
  semaine: string | null;
  motif: string;
  statut: StatutEchange;
  pair_le: string | null;
  decide_par: string | null;
  decide_le: string | null;
  created_at: string;
};
```

- [ ] **Step 4: Écrire `lib/agenda/occupation.ts`**

```ts
import { dateDuJour } from "./semaine.ts";
import type { Absence, Exception, Voeu } from "./types.ts";

/**
 * Qui tient une case à une date donnée.
 *
 * Trois couches, dans cet ordre : l'exception si elle existe pour cette
 * date et cette case, sinon le vœu accordé, et par-dessus l'absence de
 * celui qui tient — qui ne lui retire rien, mais que l'écran signale.
 *
 * Pur, sans accès réseau : lu tel quel par les tests `node --test`.
 */

/** Deux statuts tiennent une case : un retrait demandé ne libère rien tant qu'il n'est pas tranché. */
const TIENNENT = ["valide", "retrait_demande"];

export type Occupation = {
  userId: string | null;
  /** D'où vient l'occupant : une exception datée, la semaine type, ou personne. */
  origine: "exception" | "voeu" | "libre";
  /** L'occupant réel est absent ce jour-là. */
  absent: boolean;
};

export function occupantALaDate(
  voeux: Voeu[],
  exceptions: Exception[],
  absences: Absence[],
  salle: string,
  jour: number,
  moment: string,
  lundi: string,
): Occupation {
  const date = dateDuJour(lundi, jour);

  const exception = exceptions.find(
    (x) => x.jour === date && x.salle === salle && x.moment === moment,
  );
  if (exception) {
    return {
      userId: exception.user_id,
      origine: "exception",
      absent: estAbsent(absences, exception.user_id, date),
    };
  }

  const tenu = voeux.find(
    (v) => v.salle === salle && v.jour === jour && v.moment === moment && TIENNENT.includes(v.statut),
  );
  if (tenu) {
    return { userId: tenu.user_id, origine: "voeu", absent: estAbsent(absences, tenu.user_id, date) };
  }

  return { userId: null, origine: "libre", absent: false };
}

function estAbsent(absences: Absence[], userId: string, date: string): boolean {
  return absences.some((a) => a.user_id === userId && a.du <= date && date <= a.au);
}
```

- [ ] **Step 5: Lancer les tests**

Run: `npm test`
Attendu : 56 tests passent (47 existants + 9 nouveaux).

- [ ] **Step 6: Vérifier types et lint**

Run: `npx tsc --noEmit && npm run lint`
Attendu : aucune sortie, aucune erreur, aucun avertissement.

- [ ] **Step 7: Commit**

```bash
git add lib/agenda/occupation.ts lib/agenda/occupation.test.ts lib/agenda/types.ts
git commit -m "$(cat <<'EOF'
agenda : qui tient une case à une date

Trois couches dans l'ordre : l'exception datée, puis le vœu accordé, puis
l'absence de celui qui tient — qui ne lui retire rien, mais que l'écran
signale.

Le cas qui demandait un test : l'absence suit l'occupant réel, pas le
titulaire du vœu. Quand une exception donne la case à quelqu'un d'autre,
c'est son absence à lui qui compte.
EOF
)"
```

---

### Task 5: Demander un échange depuis une case

**Files:**
- Create: `components/admin/agenda/DemanderEchange.tsx`
- Modify: `components/admin/agenda/CaseDetail.tsx`

- [ ] **Step 1: Écrire le formulaire**

`components/admin/agenda/DemanderEchange.tsx` :

```tsx
"use client";

import { useState } from "react";
import { libelleCase } from "@/lib/agenda/salles";
import { lundiDe } from "@/lib/agenda/semaine";
import type { Voeu } from "@/lib/agenda/types";

/**
 * Le formulaire de demande d'échange, ouvert depuis la case qu'on veut.
 *
 * Le demandeur choisit la portée, offre ou non une de ses cases, et
 * explique. Rien ne se décide ici : la base refait tous les contrôles, et
 * le titulaire puis un gérant ont le dernier mot.
 */

const CHAMP: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 8,
  border: "1px solid rgba(0,56,80,.16)",
  fontSize: 13.5,
  fontFamily: "inherit",
};

export default function DemanderEchange({
  cible,
  mesVoeux,
  occupe,
  onProposer,
  onAnnuler,
}: {
  cible: Voeu;
  /** Mes propres vœux accordés, offrables en contrepartie. */
  mesVoeux: Voeu[];
  occupe: boolean;
  onProposer: (args: {
    cible: string;
    offert: string | null;
    portee: "ponctuel" | "definitif";
    semaine: string | null;
    motif: string;
  }) => Promise<boolean>;
  onAnnuler: () => void;
}) {
  const [portee, setPortee] = useState<"ponctuel" | "definitif">("ponctuel");
  const [offert, setOffert] = useState("");
  const [semaine, setSemaine] = useState(() => lundiDe(new Date().toISOString().slice(0, 10)));
  const [motif, setMotif] = useState("");

  const valide = motif.trim().length > 0 && (portee === "definitif" || semaine.length === 10);

  return (
    <div
      style={{
        border: "1px solid rgba(4,164,155,.4)",
        background: "rgba(4,164,155,.05)",
        borderRadius: 12,
        padding: 14,
        marginBottom: 12,
      }}
    >
      <p style={{ margin: "0 0 10px", fontSize: 13.5, fontWeight: 600, color: "#003850" }}>
        Demander {libelleCase(cible.salle, cible.jour, cible.moment)}
      </p>

      <div style={{ display: "grid", gap: 10 }}>
        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>Pour quand</span>
          <select style={CHAMP} value={portee} onChange={(e) => setPortee(e.target.value as "ponctuel" | "definitif")}>
            <option value="ponctuel">Une seule semaine</option>
            <option value="definitif">De façon définitive</option>
          </select>
        </label>

        {portee === "ponctuel" ? (
          <label style={{ display: "grid", gap: 4 }}>
            <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>
              La semaine concernée — indiquez un lundi
            </span>
            <input
              type="date"
              style={CHAMP}
              value={semaine}
              onChange={(e) => setSemaine(e.target.value ? lundiDe(e.target.value) : "")}
            />
          </label>
        ) : null}

        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>
            Ce que vous donnez en retour (facultatif)
          </span>
          <select style={CHAMP} value={offert} onChange={(e) => setOffert(e.target.value)}>
            <option value="">Rien : je demande sans rendre</option>
            {mesVoeux.map((v) => (
              <option key={v.id} value={v.id}>
                {libelleCase(v.salle, v.jour, v.moment)}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 11.5, color: "rgba(0,56,80,.6)" }}>Pourquoi</span>
          <textarea rows={2} style={CHAMP} value={motif} onChange={(e) => setMotif(e.target.value)} />
        </label>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="button"
          disabled={occupe || !valide}
          onClick={() =>
            void onProposer({
              cible: cible.id,
              offert: offert || null,
              portee,
              semaine: portee === "ponctuel" ? semaine : null,
              motif,
            })
          }
          style={{
            padding: "7px 14px",
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
          Envoyer la demande
        </button>
        <button
          type="button"
          onClick={onAnnuler}
          style={{
            background: "none",
            border: "none",
            color: "rgba(0,56,80,.6)",
            fontSize: 12.5,
            cursor: "pointer",
            padding: 0,
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}
```

Le champ de semaine ramène toute date saisie à son lundi par `lundiDe` : la base exige un lundi, autant ne pas faire échouer la demande pour ça.

- [ ] **Step 2: Ajouter le bouton dans le détail d'une case**

Dans `components/admin/agenda/CaseDetail.tsx` :

Ajouter aux imports :

```tsx
import DemanderEchange from "./DemanderEchange";
```

Ajouter deux entrées aux props du composant, après `estGerant` :

```tsx
  /** Mes propres vœux accordés, offrables en contrepartie d'un échange. */
  mesVoeuxAccordes: Voeu[];
  onProposerEchange: (args: {
    cible: string;
    offert: string | null;
    portee: "ponctuel" | "definitif";
    semaine: string | null;
    motif: string;
  }) => Promise<boolean>;
```

Ajouter un état, à côté de `texte` et `occupe` :

```tsx
  const [demande, setDemande] = useState(false);
```

Et, juste avant le champ de message en bas du panneau, insérer :

```tsx
        {e.occupant && e.occupant.user_id !== moi ? (
          demande ? (
            <DemanderEchange
              cible={e.occupant}
              mesVoeux={mesVoeuxAccordes}
              occupe={occupe}
              onProposer={async (args) => {
                setOccupe(true);
                const ok = await onProposerEchange(args);
                setOccupe(false);
                if (ok) {
                  setDemande(false);
                  onFermer();
                }
                return ok;
              }}
              onAnnuler={() => setDemande(false)}
            />
          ) : (
            <Bouton ton="neutre" disabled={occupe} onClick={() => setDemande(true)}>
              Demander un échange
            </Bouton>
          )
        ) : null}
```

- [ ] **Step 3: Vérifier**

Run: `npx tsc --noEmit`
Attendu : une erreur sur `AgendaAdmin.tsx`, qui ne passe pas encore les deux nouvelles entrées. C'est attendu — la tâche 6 les branche. Ne pas commiter avant.

---

### Task 6: La vue des échanges et la projection

**Files:**
- Create: `components/admin/agenda/Echanges.tsx`
- Modify: `components/admin/agenda/Grille.tsx`, `components/admin/agenda/AgendaAdmin.tsx`

- [ ] **Step 1: Écrire la vue des échanges**

`components/admin/agenda/Echanges.tsx` :

```tsx
"use client";

import { libelleCase } from "@/lib/agenda/salles";
import type { Echange, Personne, Voeu } from "@/lib/agenda/types";

/**
 * Les échanges : ce qui attend une réponse de moi, ce que j'ai demandé, et
 * pour les gérants ce qui attend un arbitrage.
 *
 * La demande ne se lance pas ici mais depuis une case de la grille : c'est
 * en regardant la grille qu'on voit ce qu'on veut.
 */

const CARTE: React.CSSProperties = {
  background: "#fff",
  borderRadius: 12,
  padding: 14,
  marginBottom: 10,
  boxShadow: "0 2px 10px rgba(60,40,30,.06)",
  fontSize: 13,
};

const LIBELLE_STATUT: Record<Echange["statut"], string> = {
  propose: "en attente de réponse",
  accepte_pair: "en attente d’arbitrage",
  refuse_pair: "refusé par le titulaire",
  valide: "accordé",
  refuse: "refusé",
  annule: "annulé",
};

export default function Echanges({
  echanges,
  voeux,
  personnes,
  moi,
  estGerant,
  occupe,
  onRepondre,
  onTrancher,
  onAnnuler,
}: {
  echanges: Echange[];
  voeux: Voeu[];
  personnes: Record<string, Personne>;
  moi: string;
  estGerant: boolean;
  occupe: boolean;
  onRepondre: (id: string, accepte: boolean) => Promise<boolean>;
  onTrancher: (id: string, accorde: boolean) => Promise<boolean>;
  onAnnuler: (id: string) => Promise<boolean>;
}) {
  const voeuDe = (id: string | null) => (id ? (voeux.find((v) => v.id === id) ?? null) : null);
  const titulaire = (e: Echange) => voeuDe(e.voeu_cible_id)?.user_id ?? null;

  const aRepondre = echanges.filter((e) => e.statut === "propose" && titulaire(e) === moi);
  const miennes = echanges.filter((e) => e.demandeur_id === moi);
  const aArbitrer = estGerant ? echanges.filter((e) => e.statut === "accepte_pair") : [];

  const ligne = (e: Echange) => {
    const c = voeuDe(e.voeu_cible_id);
    const o = voeuDe(e.voeu_offert_id);
    return (
      <>
        <p style={{ margin: "0 0 4px", fontWeight: 600, color: "#003850" }}>
          {personnes[e.demandeur_id]?.nom ?? "—"} demande{" "}
          {c ? libelleCase(c.salle, c.jour, c.moment) : "une case disparue"}
        </p>
        <p style={{ margin: "0 0 4px", fontSize: 12.5, color: "rgba(0,56,80,.7)" }}>
          {o ? `En échange de ${libelleCase(o.salle, o.jour, o.moment)}` : "Sans contrepartie"}
          {" · "}
          {e.portee === "ponctuel" ? `semaine du ${jour(e.semaine)}` : "définitif"}
          {" · "}
          {LIBELLE_STATUT[e.statut]}
        </p>
        <p style={{ margin: "0 0 8px", fontSize: 12.5 }}>{e.motif}</p>
      </>
    );
  };

  const rien = (quoi: string) => (
    <p style={{ fontSize: 13, color: "rgba(0,56,80,.6)", marginBottom: 18 }}>{quoi}</p>
  );

  return (
    <div>
      <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#003850" }}>On attend votre réponse</h3>
      {aRepondre.length === 0
        ? rien("Personne ne demande un de vos créneaux.")
        : aRepondre.map((e) => (
            <div key={e.id} style={CARTE}>
              {ligne(e)}
              <Bouton ton="ok" disabled={occupe} onClick={() => void onRepondre(e.id, true)}>
                J’accepte
              </Bouton>
              <Bouton ton="non" disabled={occupe} onClick={() => void onRepondre(e.id, false)}>
                Je refuse
              </Bouton>
            </div>
          ))}

      {estGerant ? (
        <>
          <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#003850" }}>À arbitrer</h3>
          {aArbitrer.length === 0
            ? rien("Aucun échange n’attend votre arbitrage.")
            : aArbitrer.map((e) => (
                <div key={e.id} style={CARTE}>
                  {ligne(e)}
                  <p style={{ margin: "0 0 8px", fontSize: 12, color: "rgba(0,56,80,.6)" }}>
                    {personnes[titulaire(e) ?? ""]?.nom ?? "—"} est d’accord.
                  </p>
                  <Bouton ton="ok" disabled={occupe} onClick={() => void onTrancher(e.id, true)}>
                    Accorder
                  </Bouton>
                  <Bouton ton="non" disabled={occupe} onClick={() => void onTrancher(e.id, false)}>
                    Refuser
                  </Bouton>
                </div>
              ))}
        </>
      ) : null}

      <h3 style={{ margin: "0 0 8px", fontSize: 14, color: "#003850" }}>Mes demandes</h3>
      {miennes.length === 0
        ? rien("Vous n’avez demandé aucun échange.")
        : miennes.map((e) => (
            <div key={e.id} style={CARTE}>
              {ligne(e)}
              {e.statut === "propose" || e.statut === "accepte_pair" ? (
                <Bouton ton="neutre" disabled={occupe} onClick={() => void onAnnuler(e.id)}>
                  Annuler ma demande
                </Bouton>
              ) : null}
            </div>
          ))}
    </div>
  );
}

function Bouton({
  ton,
  children,
  ...reste
}: { ton: "ok" | "non" | "neutre" } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const fond = ton === "ok" ? "#04A49B" : ton === "non" ? "#EE806C" : "rgba(0,56,80,.08)";
  return (
    <button
      type="button"
      {...reste}
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        border: "none",
        background: fond,
        color: ton === "neutre" ? "#003850" : "#fff",
        fontSize: 12,
        fontWeight: 600,
        cursor: reste.disabled ? "not-allowed" : "pointer",
        opacity: reste.disabled ? 0.55 : 1,
        marginRight: 8,
      }}
    >
      {children}
    </button>
  );
}

function jour(iso: string | null): string {
  if (!iso) return "?";
  const [an, mois, j] = iso.split("-");
  return `${Number(j)}/${mois}/${an}`;
}
```

- [ ] **Step 2: Lire l'occupant par `occupation.ts` dans la grille**

Dans `components/admin/agenda/Grille.tsx`, remplacer l'import :

```tsx
import { absentLe, dateDuJour } from "@/lib/agenda/semaine";
import type { Absence } from "@/lib/agenda/types";
```

par :

```tsx
import { occupantALaDate } from "@/lib/agenda/occupation";
import type { Absence, Exception } from "@/lib/agenda/types";
```

Ajouter une entrée facultative aux props, après `absences` :

```tsx
  exceptions?: Exception[];
```

Puis remplacer le calcul de `absent` par une lecture des trois couches. Le bloc actuel :

```tsx
                  const absent =
                    lundi != null &&
                    absences != null &&
                    e.occupant != null &&
                    absentLe(absences, e.occupant.user_id, dateDuJour(lundi, i + 1));
```

devient :

```tsx
                  // En vue « cabinet » on lit l'occupant réel de la date :
                  // l'exception datée l'emporte sur la semaine type.
                  const occ =
                    lundi != null
                      ? occupantALaDate(voeux, exceptions ?? [], absences ?? [], salle.id, i + 1, m.id, lundi)
                      : null;
                  const absent = occ?.absent ?? false;
                  const parEchange = occ?.origine === "exception";
```

Et le rendu du nom :

```tsx
                      {mode === "cabinet" && nomOccupant ? (
                        <span style={absent ? { textDecoration: "line-through", opacity: 0.5 } : undefined}>
                          {nomOccupant}
                          {absent ? " · absent" : ""}
                        </span>
                      ) : null}
```

devient :

```tsx
                      {mode === "cabinet" && (occ?.userId ?? nomOccupant) ? (
                        <span style={absent ? { textDecoration: "line-through", opacity: 0.5 } : undefined}>
                          {occ?.userId ? (personnes[occ.userId]?.nom ?? "—") : nomOccupant}
                          {parEchange ? " · échangé" : ""}
                          {absent ? " · absent" : ""}
                        </span>
                      ) : null}
```

- [ ] **Step 3: Brancher le quatrième onglet**

Dans `components/admin/agenda/AgendaAdmin.tsx` :

Ajouter aux imports :

```tsx
import type { Echange, Exception } from "@/lib/agenda/types";
import Echanges from "./Echanges";
```

Remplacer le type `Onglet` par :

```tsx
type Onglet = "mienne" | "cabinet" | "conges" | "echanges";
```

Ajouter trois états :

```tsx
  const [echanges, setEchanges] = useState<Echange[]>([]);
  const [exceptions, setExceptions] = useState<Exception[]>([]);
  const [occupeEchange, setOccupeEchange] = useState(false);
```

Dans `charger`, étendre le `Promise.all` :

```tsx
    const [v, p, c, ab, ex, xc] = await Promise.all([
      sb.from("agenda_voeux").select("*"),
      sb.from("profiles").select("user_id, first_name, last_name"),
      sb.from("agenda_commentaires").select("*").order("created_at"),
      sb.from("agenda_absences").select("*").order("du"),
      sb.from("agenda_echanges").select("*").order("created_at", { ascending: false }),
      sb.from("agenda_exceptions").select("*").order("jour"),
    ]);
```

et, avant `setErreur(null)` :

```tsx
    setEchanges((ex.data ?? []) as Echange[]);
    setExceptions((xc.data ?? []) as Exception[]);
```

Ajouter les quatre actions, après `retirerAbsence` :

```tsx
  const agirEchange = useCallback(
    async (nom: string, args: Record<string, unknown>) => {
      setOccupeEchange(true);
      const r = await appeler(nom, args);
      setOccupeEchange(false);
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

  const proposerEchange = useCallback(
    (args: {
      cible: string;
      offert: string | null;
      portee: "ponctuel" | "definitif";
      semaine: string | null;
      motif: string;
    }) =>
      agirEchange("agenda_proposer_echange", {
        p_cible: args.cible,
        p_offert: args.offert,
        p_portee: args.portee,
        p_semaine: args.semaine,
        p_motif: args.motif,
      }),
    [agirEchange],
  );
```

Et, dans la liste des onglets, la quatrième entrée :

```tsx
            ["echanges", "Les échanges"],
```

Enfin, étendre l'aiguillage du rendu. Le bloc `{onglet === "conges" ? … : <Grille … />}` devient :

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
      ) : onglet === "echanges" ? (
        <Echanges
          echanges={echanges}
          voeux={voeux}
          personnes={personnes}
          moi={acces.userId ?? ""}
          estGerant={acces.estSuperAdmin}
          occupe={occupeEchange}
          onRepondre={(id, accepte) =>
            agirEchange("agenda_repondre_echange", { p_echange: id, p_accepte: accepte })
          }
          onTrancher={(id, accorde) =>
            agirEchange("agenda_trancher_echange", { p_echange: id, p_accorde: accorde, p_commentaire: null })
          }
          onAnnuler={(id) => agirEchange("agenda_annuler_echange", { p_echange: id })}
        />
      ) : (
        <Grille
          voeux={voeux}
          personnes={personnes}
          moi={acces.userId ?? ""}
          mode={onglet === "mienne" ? "mien" : "cabinet"}
          lundi={onglet === "cabinet" ? lundi : undefined}
          absences={onglet === "cabinet" ? absences : undefined}
          exceptions={onglet === "cabinet" ? exceptions : undefined}
          onCase={(salle, jour, moment) =>
            onglet === "mienne" ? void basculer(salle, jour, moment) : setOuverte({ salle, jour, moment })
          }
        />
      )}
```

Et passer les deux nouvelles entrées à `CaseDetail` :

```tsx
        <CaseDetail
          {...ouverte}
          voeux={voeux}
          commentaires={commentaires}
          personnes={personnes}
          moi={acces.userId ?? ""}
          estGerant={acces.estSuperAdmin}
          mesVoeuxAccordes={voeux.filter((v) => v.user_id === acces.userId && v.statut === "valide")}
          onProposerEchange={proposerEchange}
          onFermer={() => setOuverte(null)}
          onAgir={agir}
        />
```

- [ ] **Step 4: Ajouter les codes d'erreur des échanges**

Dans `components/admin/agenda/rpc.ts`, ajouter trois entrées à `ERREURS` :

```ts
  AGENDA_SOI_MEME: "Ce créneau est déjà le vôtre.",
  AGENDA_SEMAINE: "Indiquez un lundi, dans une semaine qui n’est pas passée.",
  AGENDA_EXCEPTION_PRISE: "Ce créneau a déjà été échangé à cette date.",
```

- [ ] **Step 5: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 56 tests, aucune erreur, aucun avertissement, `/admin/agenda` dans les routes.

Si le lint refuse quelque chose, corriger au minimum et le signaler.

- [ ] **Step 6: Commit**

```bash
git add components/admin/agenda/DemanderEchange.tsx components/admin/agenda/Echanges.tsx components/admin/agenda/CaseDetail.tsx components/admin/agenda/Grille.tsx components/admin/agenda/AgendaAdmin.tsx components/admin/agenda/rpc.ts
git commit -m "$(cat <<'EOF'
agenda : demander, accepter et arbitrer un échange

La demande se lance depuis la case qu'on veut, parce que c'est en
regardant la grille qu'on voit ce qu'on cherche. La vue des échanges ne
sert qu'à répondre, suivre et arbitrer.

La grille lit désormais l'occupant réel d'une date par occupation.ts :
l'exception datée l'emporte sur la semaine type, et la case le dit —
« échangé ».

Le champ de semaine ramène toute date saisie à son lundi : la base
l'exige, autant ne pas faire échouer la demande pour ça.
EOF
)"
```

---

### Task 7: Vérification d'ensemble et mise en ligne

- [ ] **Step 1: Tout vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 56 tests, aucune erreur, aucun avertissement, `/admin/agenda` et `/api/agenda/tache` dans les routes.

Relancer les trois fichiers de scénarios avec `execute_sql`, chacun en une seule fois :
- `supabase/tests/agenda.sql` → `agenda : scénarios OK`
- `supabase/tests/agenda_absences.sql` → `absences : scénarios OK`
- `supabase/tests/agenda_echanges.sql` → `échanges : scénarios OK`

- [ ] **Step 2: Contrôle des droits effectifs**

Outil `get_advisors`, `project_id` = `nuehdfyscqnkckudkqhe`, `type` = `security`.
Attendu : aucune nouvelle alerte hors « authenticated can execute security definer » pour les quatre fonctions d'échange, qui vérifient les droits dans leur corps. `agenda_echanges` et `agenda_exceptions` ne doivent **pas** apparaître sous « RLS enabled, no policy ».

- [ ] **Step 3: Vérifier que la production est intacte**

```sql
select
  (select count(*) from public.site_super_admins) as super_admins,
  (select count(*) from public.user_roles) as roles,
  (select count(*) from public.articles) as articles,
  (select count(*) from public.klub_seances) as seances_klub,
  (select count(*) from public.agenda_voeux) as voeux,
  (select count(*) from public.agenda_echanges) as echanges,
  (select count(*) from public.agenda_exceptions) as exceptions;
```

Attendu : `super_admins` 2, `roles` 13, `articles` 23, `seances_klub` inchangé. Les trois derniers valent ce que l'équipe a réellement posé depuis la mise en ligne de l'agenda.

- [ ] **Step 4: Pousser et ouvrir la PR**

```bash
git push -u origin feature/agenda-echanges
gh pr create --base main --title "Agenda du cabinet : échanges de créneau" --body "$(cat <<'EOF'
Dernière des trois livraisons de l'agenda (C1c). Se dépanner entre praticiens sans passer par WhatsApp.

**Le parcours, à trois temps**
1. Le demandeur désigne une case tenue par quelqu'un, pour une semaine ou pour de bon, en offrant ou non une des siennes, et explique
2. Le titulaire accepte ou refuse
3. Un gérant tranche — même quand les deux sont d'accord, parce qu'une case accordée engage le cabinet et que lui seul voit la grille entière

Le demandeur peut annuler tant que rien n'est tranché.

**Un échange ponctuel porte sur une semaine, pas une date.** La date de chaque côté se déduit du jour de son propre vœu, ce qui permet d'échanger un mardi contre un jeudi — le cas courant. La spec donnait un champ de date unique : corrigé en écrivant ce plan.

**Les quatre effets d'un accord**, chacun couvert par son scénario :
| Portée | Effet |
|---|---|
| définitif, avec offre | Les deux vœux changent de propriétaire |
| définitif, sans offre | Le vœu cible change de propriétaire |
| ponctuel, avec offre | Deux `agenda_exceptions` croisées dans la semaine |
| ponctuel, sans offre | Une `agenda_exceptions` |

**La lecture d'une case** passe maintenant par trois couches, dans `lib/agenda/occupation.ts` : l'exception datée, puis le vœu accordé, puis l'absence de celui qui tient. L'absence suit l'occupant **réel** — quand une exception donne la case à quelqu'un d'autre, c'est son absence à lui qui compte.

**Ce qu'aucune politique RLS ne saurait faire**, et pourquoi tout passe par des fonctions : un accord modifie des lignes qui n'appartiennent pas à celui qui le déclenche. Les deux tables n'ont aucune politique d'écriture. Une exception se supprime, mais par un gérant seulement, sinon une case posée par erreur resterait bloquée à cette date pour toujours.

Spec : `docs/superpowers/specs/2026-09-25-agenda-cabinet-design.md`
Plan : `docs/superpowers/plans/2026-09-26-agenda-echanges.md`

Vérifications : 56 tests, `tsc`, lint sans avertissement, build, et les trois fichiers de scénarios sur la base de production en transaction annulée. Les deux migrations sont déjà appliquées.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Demander la fusion**

Ne pas fusionner sans l'accord de Lucas. Lui signaler ce qu'il doit essayer lui-même sur la prévisualisation, avec deux comptes praticiens et le sien :

- un praticien demande la case d'un autre pour une semaine, en offrant une des siennes ;
- le titulaire reçoit le mail, accepte, et Lucas et JB reçoivent la demande d'arbitrage ;
- Lucas accorde, puis se place sur la semaine concernée dans la vue du cabinet : les deux cases doivent afficher « échangé » avec les noms croisés ;
- la semaine suivante, elles doivent être revenues à leurs titulaires.

---

## Ce que ce plan ne fait pas

- Les méthodes de réservation du Mugi Klub, dont le lien vers un groupe WhatsApp : chantier suivant.
- Les notifications sur les articles et le Klub, et le récapitulatif quotidien : chantier C2.
- Le parcours de prise en main dans l'admin : chantier C3.
- La publication des présences sur le site : hors périmètre de la spec.
