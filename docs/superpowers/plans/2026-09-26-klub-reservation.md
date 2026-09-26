# Mugi Klub, méthodes de réservation — plan d'implémentation

> **Pour les exécutants agentiques :** SOUS-COMPÉTENCE REQUISE — utiliser `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans` pour exécuter ce plan tâche par tâche. Les étapes se suivent en cochant les cases (`- [ ]`).

**But :** une séance du Klub peut s'inscrire ailleurs. Le planning public renvoie alors vers un lien — le groupe WhatsApp de la prépa des danseurs — au lieu de proposer un formulaire que personne n'utilise.

**Architecture :** deux colonnes nullables sur `klub_seances` et `klub_creneaux`, et **aucune colonne de mode** : « ailleurs » est un cas particulier de « pas d'inscription chez nous », ce qu'une contrainte rend explicite. Une seule fonction existante est modifiée, celle qui construit le JSON public ; l'héritage depuis le créneau passe par un déclencheur neuf, et l'écriture par une fonction dédiée neuve — plutôt que de retranscrire trois fonctions plpgsql qui tournent en production.

**Pile :** Next.js 16 App Router, React 19, Supabase (projet `nuehdfyscqnkckudkqhe`), `node --test`.

**Spec :** `docs/superpowers/specs/2026-09-26-klub-reservation-design.md`.

---

## Règles pour l'exécutant

1. **Lire `AGENTS.md` à la racine.** Cette version de Next.js a des ruptures d'API. Avant d'utiliser une API Next que tu n'as pas déjà vue employée dans ce dépôt, lis le guide correspondant dans `node_modules/next/dist/docs/`.
2. **Base de production.** Le projet `nuehdfyscqnkckudkqhe` contient les vraies données du cabinet — 13 séances du Klub, des inscrits réels, un agenda en service. Migrations avec `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration`, lectures avec `..._execute_sql`, `project_id` passé explicitement. **Ne jamais utiliser les outils `mcp__supabase__*`**, qui pointent sur un autre projet.
3. **Ne créer que les objets de ce plan.** Une seule fonction existante est à remplacer, `klub__seance_publique`, et son corps complet est donné. **Ne touche à aucune autre fonction `klub_*`**, en particulier pas `klub_tache`, `klub_admin_creer_seance`, `klub_admin_modifier_seance` ni `klub_admin_sauver_creneau` : c'est tout l'objet du détour par un déclencheur et une fonction dédiée.
4. **Tout essai destructif dans `begin; … rollback;`.** Ne crée ni ne modifie aucune séance réelle.
5. **Lint React Compiler** : pas de `setState` dans le corps d'un effet, pas de mutation pendant le rendu. `npm run lint` doit finir **sans aucun avertissement** ; s'il en apparaît un, il vient de toi.
6. **Le code de ce plan n'a jamais été compilé.** Si une signature du dépôt diffère de ce qu'il écrit, **suis le dépôt** et dis précisément ce qui différait.
7. **Commits.** `git add <chemins explicites>`, jamais `-a` ni `-am`. Messages en français, au style des commits existants.
8. Ne rien pousser et n'ouvrir aucune PR avant la tâche 6.

## Carte des fichiers

| Fichier | Responsabilité |
|---|---|
| `supabase/migrations/20260926150000_klub_reservation.sql` | Les deux colonnes, la contrainte, le déclencheur d'héritage, la fonction d'écriture, le JSON public |
| `supabase/tests/klub_reservation.sql` | Scénarios, en transaction annulée |
| `lib/klub/types.ts` | Les deux champs sur `ChampsSeance` |
| `lib/klub/format.ts` | Le libellé de disponibilité pour une séance externe |
| `lib/klub/format.test.ts` | Tests du libellé |
| `lib/klub/mails.test.ts`, `lib/klub/regles-envoi.test.ts` | Leurs objets d'appui gagnent les deux champs |
| `components/admin/klub/KlubSeances.tsx` | Le brouillon d'une séance neuve |
| `components/admin/klub/ChampsSeanceForm.tsx` | Les deux champs, visibles quand l'inscription n'est pas requise |
| `components/admin/klub/KlubSeanceDetail.tsx`, `KlubCreneaux.tsx` | L'appel à `klub_admin_reservation` après l'enregistrement |
| `components/site/klub/KlubCarte.tsx` | Le ton `externe` sur la carte |
| `app/mugi-klub/seance/[id]/page.tsx` | Le bouton à la place du formulaire |

---

### Task 0: Espace de travail

- [ ] **Step 1: Vérifier l'état de départ**

```bash
cd /Users/lucas/Desktop/mugitu-biarritz-admin
git status --short
git log --oneline -2
```

Attendu : arbre propre, branche `feature/klub-reservation`, dernier commit `e2e28a0 klub : n'abîmer aucune fonction d'écriture pour deux colonnes`.

- [ ] **Step 2: Vérifier les tests existants**

Run: `npm test`
Attendu : 56 tests passent.

---

### Task 1: La base

**Files:**
- Create: `supabase/migrations/20260926150000_klub_reservation.sql`

- [ ] **Step 1: Écrire la migration**

```sql
-- Mugi Klub : l'inscription peut se faire ailleurs.
--
-- La prépa des danseurs se remplit par un groupe WhatsApp. Le planning
-- public doit y renvoyer, au lieu de proposer un formulaire que personne
-- n'utilise.
--
-- Aucune colonne de mode : « ailleurs » est un cas particulier de « pas
-- d'inscription chez nous ». Les fonctions en production traitent déjà
-- `inscription_requise = false` comme « ne pas compter de place, ne pas
-- accepter d'inscription, ne rien mettre en file » — exactement ce qu'il
-- faut ici. La contrainte rend l'invariant explicite : il n'y a que trois
-- états, et pas de quatrième.

alter table public.klub_seances
  add column reservation_url text,
  add column reservation_libelle text;

alter table public.klub_creneaux
  add column reservation_url text,
  add column reservation_libelle text;

-- Un lien n'a de sens que si l'inscription ne se fait pas chez nous.
alter table public.klub_seances add constraint klub_seances_reservation
  check (reservation_url is null or inscription_requise = false);
alter table public.klub_creneaux add constraint klub_creneaux_reservation
  check (reservation_url is null or inscription_requise = false);

-- Un bouton du site public ne pointe que vers du https. Un `http://` ou un
-- `javascript:` n'a rien à y faire.
alter table public.klub_seances add constraint klub_seances_reservation_https
  check (reservation_url is null or reservation_url like 'https://%');
alter table public.klub_creneaux add constraint klub_creneaux_reservation_https
  check (reservation_url is null or reservation_url like 'https://%');

-- Héritage depuis le créneau.
--
-- `klub_tache()` engendre les séances en listant ses colonnes une par une :
-- les deux nouvelles ne descendraient jamais. Plutôt que de retranscrire
-- cette fonction, qui tourne en production, un déclencheur remplit les
-- colonnes vides depuis le créneau. Ça vaut pour la génération d'aujourd'hui
-- comme pour toute autre à venir.
create or replace function public.klub__heriter_reservation()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  c record;
begin
  if new.creneau_id is null then return new; end if;
  if new.reservation_url is not null then return new; end if;

  select reservation_url, reservation_libelle into c
    from public.klub_creneaux where id = new.creneau_id;
  if c.reservation_url is null then return new; end if;

  -- On n'hérite que si la séance est cohérente avec un lien : sinon la
  -- contrainte refuserait la ligne et la génération entière échouerait.
  if new.inscription_requise then return new; end if;

  new.reservation_url := c.reservation_url;
  new.reservation_libelle := coalesce(new.reservation_libelle, c.reservation_libelle);
  return new;
end;
$$;

revoke all on function public.klub__heriter_reservation() from public, anon, authenticated;

create trigger klub_seances_heriter_reservation
  before insert on public.klub_seances
  for each row execute function public.klub__heriter_reservation();

-- Poser ou retirer le lien, sur une séance ou sur un créneau.
--
-- Fonction dédiée plutôt que trois réécritures : `klub_admin_creer_seance`,
-- `klub_admin_modifier_seance` et `klub_admin_sauver_creneau` font entre
-- 1 200 et 3 500 caractères de plpgsql et tournent en production. L'écran
-- appelle celle-ci après avoir enregistré le reste.
--
-- Codes levés : KLUB_DROITS (par klub__verifier_droits), KLUB_CIBLE,
-- KLUB_URL, KLUB_RESERVATION_REQUISE.
create or replace function public.klub_admin_reservation(
  p_cible text, p_id uuid, p_url text, p_libelle text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_url text := nullif(btrim(coalesce(p_url, '')), '');
  v_libelle text := nullif(btrim(coalesce(p_libelle, '')), '');
  v_requise boolean;
begin
  perform public.klub__verifier_droits();
  if p_cible not in ('seance', 'creneau') then raise exception 'KLUB_CIBLE'; end if;
  if v_url is not null and v_url not like 'https://%' then raise exception 'KLUB_URL'; end if;

  if p_cible = 'seance' then
    select inscription_requise into v_requise from public.klub_seances where id = p_id;
    if not found then raise exception 'KLUB_CIBLE'; end if;
    if v_url is not null and v_requise then raise exception 'KLUB_RESERVATION_REQUISE'; end if;
    update public.klub_seances
       set reservation_url = v_url,
           reservation_libelle = case when v_url is null then null else v_libelle end
     where id = p_id;
  else
    select inscription_requise into v_requise from public.klub_creneaux where id = p_id;
    if not found then raise exception 'KLUB_CIBLE'; end if;
    if v_url is not null and v_requise then raise exception 'KLUB_RESERVATION_REQUISE'; end if;
    update public.klub_creneaux
       set reservation_url = v_url,
           reservation_libelle = case when v_url is null then null else v_libelle end
     where id = p_id;
  end if;
end;
$$;

revoke all on function public.klub_admin_reservation(text, uuid, text, text) from public, anon;
grant execute on function public.klub_admin_reservation(text, uuid, text, text) to authenticated;

-- Le JSON public porte les deux colonnes. Sans ça, le site ne verrait
-- jamais le lien. Corps repris de la version en production, deux clés en
-- plus et rien d'autre.
create or replace function public.klub__seance_publique(s public.klub_seances)
returns jsonb
language sql
stable
set search_path = ''
as $$
  select jsonb_build_object(
    'id', s.id,
    'debut', s.debut,
    'duree_min', s.duree_min,
    'type', s.type,
    'titre', s.titre,
    'description', s.description,
    'intervenant', s.intervenant,
    'prix_libelle', s.prix_libelle,
    'inscription_requise', s.inscription_requise,
    'capacite', s.capacite,
    'statut', s.statut,
    'reservation_url', s.reservation_url,
    'reservation_libelle', s.reservation_libelle,
    'places_restantes', case when s.inscription_requise then greatest(
      s.capacite - (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'confirmee'), 0) end,
    'nb_attente', (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'attente')
  );
$$;
```

- [ ] **Step 2: Appliquer la migration**

Outil `apply_migration`, `project_id` = `nuehdfyscqnkckudkqhe`, `name` = `klub_reservation`.

- [ ] **Step 3: Vérifier les objets et les droits**

```sql
select
  (select count(*) from information_schema.columns
    where table_schema='public' and table_name in ('klub_seances','klub_creneaux')
      and column_name in ('reservation_url','reservation_libelle')) as colonnes,
  (select count(*) from pg_constraint con join pg_class c on c.oid = con.conrelid
    where c.relname in ('klub_seances','klub_creneaux') and con.conname like '%reservation%') as contraintes,
  (select count(*) from pg_trigger where tgname = 'klub_seances_heriter_reservation') as declencheur,
  has_function_privilege('anon', 'public.klub_admin_reservation(text,uuid,text,text)', 'execute') as reservation_anon,
  has_function_privilege('authenticated', 'public.klub_admin_reservation(text,uuid,text,text)', 'execute') as reservation_equipe,
  (select (public.klub__seance_publique(s) ? 'reservation_url') from public.klub_seances s limit 1) as json_porte_le_lien;
```

Attendu : `colonnes` 4, `contraintes` 4, `declencheur` 1, `reservation_anon` faux, `reservation_equipe` vrai, `json_porte_le_lien` vrai.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260926150000_klub_reservation.sql
git commit -m "$(cat <<'EOF'
klub : l'inscription peut se faire ailleurs

Deux colonnes, un lien et son libellé, sur les séances et les créneaux.
Aucune colonne de mode : « ailleurs » est un cas particulier de « pas
d'inscription chez nous », et la contrainte l'impose — il n'y a que trois
états possibles.

L'héritage depuis le créneau passe par un déclencheur, et l'écriture par
une fonction dédiée, pour ne pas retranscrire trois fonctions plpgsql qui
tournent en production. Seule klub__seance_publique est reprise : sans
elle le site ne verrait jamais le lien.
EOF
)"
```

---

### Task 2: Les scénarios

**Files:**
- Create: `supabase/tests/klub_reservation.sql`

- [ ] **Step 1: Écrire le fichier**

```sql
-- Méthodes de réservation du Mugi Klub. Tout se passe dans une transaction
-- annulée : rien n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « réservation : scénarios OK ».

begin;

do $$
declare
  v_lucas uuid;
  v_hugo uuid;
  v_creneau uuid;
  v_seance uuid;
  v_heritee uuid;
  v_json jsonb;
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  select u.id into v_hugo  from auth.users u where u.email = 'hugo.daminato@gmail.com';
  assert v_lucas is not null and v_hugo is not null, 'R0 comptes absents';

  -- Un créneau et une séance de travail, en entrée libre.
  insert into public.klub_creneaux (jour, heure, duree_min, type, titre, inscription_requise, capacite)
  values (2, '08:00', 60, 'small', 'Essai réservation', false, null) returning id into v_creneau;
  insert into public.klub_seances (debut, duree_min, type, titre, inscription_requise, capacite)
  values (now() + interval '7 days', 60, 'small', 'Essai réservation', false, null) returning id into v_seance;

  -- R1. Une URL qui n'est pas en https est refusée par la contrainte.
  begin
    update public.klub_seances set reservation_url = 'http://exemple.fr' where id = v_seance;
    assert false, 'R1 une URL http est acceptée';
  exception when check_violation then null;
  end;

  -- R2. Un lien sur une séance qui garde son formulaire est refusé.
  begin
    update public.klub_seances
       set inscription_requise = true, reservation_url = 'https://chat.whatsapp.com/abc'
     where id = v_seance;
    assert false, 'R2 un lien coexiste avec le formulaire';
  exception when check_violation then null;
  end;

  -- R3. La fonction pose le lien sur une séance.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);
  perform public.klub_admin_reservation('seance', v_seance, 'https://chat.whatsapp.com/abc', 'S''inscrire sur WhatsApp');
  assert (select reservation_url from public.klub_seances where id = v_seance) = 'https://chat.whatsapp.com/abc', 'R3a';
  assert (select reservation_libelle from public.klub_seances where id = v_seance) = 'S''inscrire sur WhatsApp', 'R3b';

  -- R4. Elle le retire, et le libellé part avec.
  perform public.klub_admin_reservation('seance', v_seance, null, 'Resté seul');
  assert (select reservation_url from public.klub_seances where id = v_seance) is null, 'R4a';
  assert (select reservation_libelle from public.klub_seances where id = v_seance) is null, 'R4b';

  -- R5. Elle refuse une URL qui n'est pas en https, avec un code lisible.
  begin
    perform public.klub_admin_reservation('seance', v_seance, 'javascript:alert(1)', null);
    assert false, 'R5 une URL javascript est acceptée';
  exception when raise_exception then assert sqlerrm = 'KLUB_URL', 'R5 ' || sqlerrm;
  end;

  -- R6. Elle refuse une cible inconnue.
  begin
    perform public.klub_admin_reservation('atelier', v_seance, 'https://exemple.fr', null);
    assert false, 'R6 une cible inconnue est acceptée';
  exception when raise_exception then assert sqlerrm = 'KLUB_CIBLE', 'R6 ' || sqlerrm;
  end;

  -- R7. Elle refuse de poser un lien sur une séance qui garde son formulaire.
  update public.klub_seances set inscription_requise = true, capacite = 8 where id = v_seance;
  begin
    perform public.klub_admin_reservation('seance', v_seance, 'https://exemple.fr', null);
    assert false, 'R7 un lien posé sur une séance à formulaire';
  exception when raise_exception then assert sqlerrm = 'KLUB_RESERVATION_REQUISE', 'R7 ' || sqlerrm;
  end;
  update public.klub_seances set inscription_requise = false, capacite = null where id = v_seance;

  -- R8. Le créneau transmet ses deux colonnes à la séance qu'il engendre.
  perform public.klub_admin_reservation('creneau', v_creneau, 'https://chat.whatsapp.com/xyz', 'Rejoindre le groupe');
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, inscription_requise, capacite)
  values (v_creneau, now() + interval '14 days', 60, 'small', 'Essai réservation', false, null)
  returning id into v_heritee;
  assert (select reservation_url from public.klub_seances where id = v_heritee) = 'https://chat.whatsapp.com/xyz', 'R8a';
  assert (select reservation_libelle from public.klub_seances where id = v_heritee) = 'Rejoindre le groupe', 'R8b';

  -- R9. Une séance à formulaire n'hérite pas : la contrainte l'interdirait,
  -- et faire échouer la génération entière serait pire.
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, inscription_requise, capacite)
  values (v_creneau, now() + interval '21 days', 60, 'small', 'Essai réservation', true, 8)
  returning id into v_heritee;
  assert (select reservation_url from public.klub_seances where id = v_heritee) is null, 'R9';

  -- R10. Le JSON public porte le lien, et aucune place restante.
  v_json := public.klub__seance_publique((select s from public.klub_seances s where s.id = v_seance));
  perform public.klub_admin_reservation('seance', v_seance, 'https://chat.whatsapp.com/abc', null);
  v_json := public.klub__seance_publique((select s from public.klub_seances s where s.id = v_seance));
  assert v_json->>'reservation_url' = 'https://chat.whatsapp.com/abc', 'R10a ' || v_json::text;
  assert v_json->>'reservation_libelle' is null, 'R10b';
  assert v_json->'places_restantes' = 'null'::jsonb, 'R10c ' || v_json::text;

  -- R11. Un praticien ordinaire peut poser un lien : l'écran du Klub est
  -- ouvert à toute l'équipe, comme le tarif.
  perform set_config('request.jwt.claims', json_build_object('sub', v_hugo, 'role', 'authenticated')::text, true);
  perform public.klub_admin_reservation('seance', v_seance, 'https://chat.whatsapp.com/def', null);
  assert (select reservation_url from public.klub_seances where id = v_seance) = 'https://chat.whatsapp.com/def', 'R11';

  perform set_config('request.jwt.claims', '', true);
end $$;

-- BLOC DROITS ANON
set local role anon;
do $$
begin
  begin
    perform public.klub_admin_reservation('seance', gen_random_uuid(), 'https://exemple.fr', null);
    assert false, 'P1 anon pose un lien de réservation';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'réservation : scénarios OK' as resultat;
```

- [ ] **Step 2: Lancer les scénarios**

Outil `execute_sql`, `project_id` = `nuehdfyscqnkckudkqhe`, `query` = le contenu du fichier, **en une seule fois**.
Attendu : `[{"resultat":"réservation : scénarios OK"}]`.

Si un `assert` échoue, le message nomme le scénario. Deux lectures : le scénario est mal écrit, ou la migration a un vrai défaut. **Ne modifie pas le scénario pour le faire passer sans avoir établi laquelle des deux.**

- [ ] **Step 3: Vérifier que rien n'a persisté**

```sql
select
  (select count(*) from public.klub_creneaux) as creneaux,
  (select count(*) from public.klub_seances) as seances,
  (select count(*) from public.klub_seances where reservation_url is not null) as seances_externes,
  (select count(*) from public.klub_inscriptions) as inscriptions;
```

Attendu : `creneaux` 2, `seances` 13, `seances_externes` 0, et `inscriptions` égal au nombre réel d'inscrits — aucun de ces chiffres ne doit avoir bougé.

- [ ] **Step 4: Commit**

```bash
git add supabase/tests/klub_reservation.sql
git commit -m "$(cat <<'EOF'
klub : scénarios des méthodes de réservation

Onze scénarios. Les deux qui comptent : un créneau transmet son lien aux
séances qu'il engendre (R8), et une séance qui garde son formulaire
n'hérite pas — la contrainte le refuserait, et faire échouer la
génération entière serait pire que de ne pas hériter (R9).
EOF
)"
```

---

### Task 3: Le libellé de disponibilité

**Files:**
- Modify: `lib/klub/types.ts`, `lib/klub/format.ts`, `lib/klub/format.test.ts`

- [ ] **Step 1: Écrire les tests qui échouent**

Dans `lib/klub/format.test.ts`, ajouter à la fin du fichier :

```ts
test("une séance dont l’inscription est ailleurs affiche le libellé de son bouton", () => {
  const externe = {
    ...base,
    inscription_requise: false,
    capacite: null,
    places_restantes: null,
    reservation_url: "https://chat.whatsapp.com/abc",
    reservation_libelle: "S’inscrire sur WhatsApp",
  };
  const e = etatPlaces(externe, avant);
  assert.equal(e.texte, "S’inscrire sur WhatsApp");
  assert.equal(e.ton, "externe");
});

test("sans libellé, le bouton dit « S’inscrire »", () => {
  const externe = {
    ...base,
    inscription_requise: false,
    capacite: null,
    places_restantes: null,
    reservation_url: "https://chat.whatsapp.com/abc",
    reservation_libelle: null,
  };
  assert.equal(etatPlaces(externe, avant).texte, "S’inscrire");
});

test("une séance annulée le reste, même avec un lien", () => {
  const externe = {
    ...base,
    statut: "annulee" as const,
    inscription_requise: false,
    capacite: null,
    places_restantes: null,
    reservation_url: "https://chat.whatsapp.com/abc",
    reservation_libelle: "S’inscrire sur WhatsApp",
  };
  assert.equal(etatPlaces(externe, avant).ton, "annulee");
});
```

**Avant d'écrire**, ouvre `lib/klub/format.test.ts` et relève les noms réels des variables d'appui — le plan suppose `base` pour la séance de référence et `avant` pour un instant antérieur au début. Si elles s'appellent autrement, **suis le fichier** et signale-le.

- [ ] **Step 2: Lancer les tests pour les voir échouer**

Run: `node --test lib/klub/format.test.ts`
Attendu : ÉCHEC — `ton` vaut `libre` au lieu de `externe`, et le texte est « Entrée libre ».

- [ ] **Step 3: Ajouter les deux champs au type**

Dans `lib/klub/types.ts`, ajouter à `ChampsSeance`, après `inscription_requise` :

```ts
  /** Quand l'inscription se fait ailleurs : l'adresse, et le texte du bouton. */
  reservation_url: string | null;
  reservation_libelle: string | null;
```

`ChampsSeance` est partagé par la séance et le créneau : les deux formulaires d'admin en héritent, et `SeancePublique` aussi, puisqu'il en dérive.

**Les deux champs sont obligatoires, donc tout littéral qui construit un de ces types doit les porter.** `tsc` va les nommer un par un ; voici la liste relevée, à compléter avec `null` dans chacun :

| Fichier | Quoi |
|---|---|
| `lib/klub/format.test.ts` (~l. 57) | l'objet d'appui des tests |
| `lib/klub/mails.test.ts` (~l. 10) | idem |
| `lib/klub/regles-envoi.test.ts` (~l. 9) | idem |
| `components/admin/klub/KlubSeances.tsx` (~l. 24) | le brouillon d'une séance neuve |
| `components/admin/klub/KlubCreneaux.tsx` (~l. 26) | le brouillon d'un créneau neuf |
| `components/admin/klub/KlubSeanceDetail.tsx` (~l. 49) | le brouillon construit depuis une séance existante : y reprendre `s.reservation_url` et `s.reservation_libelle`, et non `null` |

`components/admin/TableauDeBord.tsx` déclare son propre type de séance, restreint aux champs qu'il lit : il n'a pas à changer. **Vérifie-le** au lieu de le supposer.

Les deux nouveaux champs valent `null` partout dans les littéraux de test, sauf là où un test les renseigne exprès.

- [ ] **Step 4: Étendre le libellé**

Dans `lib/klub/format.ts`, remplacer la ligne du type :

```ts
export type EtatPlaces = { texte: string; ton: "ok" | "peu" | "complet" | "libre" | "annulee" | "passee" };
```

par :

```ts
export type EtatPlaces = {
  texte: string;
  ton: "ok" | "peu" | "complet" | "libre" | "externe" | "annulee" | "passee";
};
```

Et, dans `etatPlaces`, insérer **avant** la ligne `if (!s.inscription_requise)` :

```ts
  // L'inscription se fait ailleurs : on ne connaît ni les places ni les
  // inscrits, donc on ne montre qu'un bouton. « Entrée libre » serait faux,
  // puisqu'il faut bien s'inscrire — juste pas ici.
  if (s.reservation_url) {
    return { texte: s.reservation_libelle || "S’inscrire", ton: "externe" };
  }
```

L'ordre compte : les branches « annulée », « terminée » et « en cours » restent devant, parce qu'une séance passée ne doit plus proposer de s'inscrire.

- [ ] **Step 5: Lancer les tests**

Run: `npm test`
Attendu : 59 tests passent (56 existants + 3 nouveaux).

- [ ] **Step 6: Vérifier types et lint**

Run: `npx tsc --noEmit && npm run lint`

`tsc` va signaler les endroits qui n'ont pas prévu le ton `externe` — `components/site/klub/KlubCarte.tsx` a une fonction `action(ton)` et une table `COULEUR_ETAT`. Complète-les :

- dans `COULEUR_ETAT`, `externe` prend la même couleur que `libre` ;
- dans `action(ton)`, `externe` renvoie le même libellé que `libre`, ou `null` si c'est ce que fait `libre`.

**Ouvre le fichier et suis ce qu'il fait réellement** plutôt que ces deux phrases — je ne l'ai pas lu en écrivant ce plan. L'important est que la carte d'une séance externe se comporte comme une carte d'entrée libre, cliquable vers la page de séance. **Cite dans ton rapport ce que tu as trouvé et ce que tu as ajouté.**

Aucun avertissement de lint ne doit subsister.

- [ ] **Step 7: Commit**

```bash
git add lib/klub/types.ts lib/klub/format.ts lib/klub/format.test.ts lib/klub/mails.test.ts lib/klub/regles-envoi.test.ts components/site/klub/KlubCarte.tsx components/admin/klub/KlubSeances.tsx components/admin/klub/KlubCreneaux.tsx components/admin/klub/KlubSeanceDetail.tsx
git commit -m "$(cat <<'EOF'
klub : le libellé d'une séance dont l'inscription est ailleurs

Un ton « externe » qui passe devant « entrée libre » : il faut bien
s'inscrire, juste pas ici, donc « Entrée libre » serait faux. Les branches
annulée, terminée et en cours restent devant — une séance passée ne
propose plus de s'inscrire.

Le libellé du bouton vient de la base, et vaut « S'inscrire » quand il est
vide.
EOF
)"
```

---

### Task 4: Les champs dans l'admin

**Files:**
- Modify: `components/admin/klub/ChampsSeanceForm.tsx`, `components/admin/klub/KlubSeanceDetail.tsx`, `components/admin/klub/KlubCreneaux.tsx`

- [ ] **Step 1: Ajouter les deux champs au formulaire**

Dans `components/admin/klub/ChampsSeanceForm.tsx`, juste après le `</label>` qui ferme la case « Inscription requise (places comptées) », insérer :

```tsx
      {!valeur.inscription_requise && (
        <div
          style={{
            border: "1px solid rgba(0,56,80,.12)",
            borderRadius: 10,
            padding: 12,
            display: "grid",
            gap: 10,
          }}
        >
          <p style={{ margin: 0, fontSize: 12.5, color: "rgba(0,56,80,.7)" }}>
            L’inscription se fait ailleurs ? Donnez le lien : les visiteurs seront renvoyés dessus, et le
            site ne comptera aucune place. Laissez vide pour une entrée libre sans inscription.
          </p>
          <div>
            <label style={LABEL} htmlFor={`${prefixe}-resa-url`}>
              Lien d’inscription (https)
            </label>
            <input
              id={`${prefixe}-resa-url`}
              style={CHAMP}
              placeholder="https://chat.whatsapp.com/…"
              value={valeur.reservation_url ?? ""}
              onChange={(e) => set("reservation_url", e.target.value.trim() || null)}
            />
          </div>
          <div>
            <label style={LABEL} htmlFor={`${prefixe}-resa-libelle`}>
              Texte du bouton
            </label>
            <input
              id={`${prefixe}-resa-libelle`}
              style={CHAMP}
              placeholder="S’inscrire sur WhatsApp"
              value={valeur.reservation_libelle ?? ""}
              onChange={(e) => set("reservation_libelle", e.target.value || null)}
            />
          </div>
        </div>
      )}
```

Et, dans le `onChange` de la case « Inscription requise », vider les deux colonnes quand on la recoche — sinon la contrainte refuserait l'enregistrement. Le bloc actuel :

```tsx
          onChange={(e) => {
            const requise = e.target.checked;
            if (!requise && valeur.capacite !== null) derniereCapacite.current = valeur.capacite;
            const capacite = requise ? (valeur.capacite ?? derniereCapacite.current) : null;
            onChange((d) => ({ ...d, inscription_requise: requise, capacite }));
          }}
```

devient :

```tsx
          onChange={(e) => {
            const requise = e.target.checked;
            if (!requise && valeur.capacite !== null) derniereCapacite.current = valeur.capacite;
            const capacite = requise ? (valeur.capacite ?? derniereCapacite.current) : null;
            onChange((d) => ({
              ...d,
              inscription_requise: requise,
              capacite,
              // Un lien et un formulaire ne coexistent pas : la base le refuse.
              reservation_url: requise ? null : d.reservation_url,
              reservation_libelle: requise ? null : d.reservation_libelle,
            }));
          }}
```

- [ ] **Step 2: Appeler la fonction après l'enregistrement**

Dans `components/admin/klub/KlubSeanceDetail.tsx` et `components/admin/klub/KlubCreneaux.tsx`, repérer l'endroit où l'enregistrement appelle `klub_admin_modifier_seance` / `klub_admin_creer_seance` / `klub_admin_sauver_creneau` via le helper `appeler` de `./rpc`.

Juste après un enregistrement réussi, et **avant** le rechargement, ajouter un second appel :

```tsx
      const resa = await appeler("klub_admin_reservation", {
        p_cible: "seance", // "creneau" dans KlubCreneaux.tsx
        p_id: id,
        p_url: draft.reservation_url,
        p_libelle: draft.reservation_libelle,
      });
      if (!resa.ok) {
        notifier(`Enregistré, mais le lien d’inscription n’a pas été posé : ${resa.message}`);
      }
```

**Adapte les noms** — `draft`, `id`, `notifier` — à ceux du fichier : je n'ai pas lu ces deux composants en écrivant ce plan, et je le dis plutôt que d'inventer du code qui ne collerait pas. **Cite dans ton rapport les lignes réelles que tu as ajoutées**, dans les deux fichiers.

L'important est le comportement : un échec du second appel ne doit pas laisser croire que tout a échoué, puisque le reste **est** enregistré. C'est le prix du détour par une fonction dédiée, et il doit être dit à l'écran.

Pour une séance qu'on vient de créer, l'identifiant est celui que renvoie `klub_admin_creer_seance`.

- [ ] **Step 3: Ajouter les codes d'erreur**

Dans `components/admin/klub/rpc.ts`, ajouter à `ERREURS_ADMIN` :

```ts
  KLUB_URL: "Le lien doit commencer par https://",
  KLUB_CIBLE: "Cette séance ou ce créneau n’existe plus.",
  KLUB_RESERVATION_REQUISE: "Décochez « inscription requise » avant de donner un lien d’inscription.",
```

- [ ] **Step 4: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint`
Attendu : 59 tests, aucune erreur, aucun avertissement.

Ne pas commiter : le commit est celui de la tâche 5.

---

### Task 5: Le bouton sur la page publique

**Files:**
- Modify: `app/mugi-klub/seance/[id]/page.tsx`

- [ ] **Step 1: Ajouter la branche du bouton**

Dans `app/mugi-klub/seance/[id]/page.tsx`, à côté de la branche `etat.ton === "libre"`, ajouter :

```tsx
            {etat.ton === "externe" && s.reservation_url && (
              <>
                <p style={texte}>
                  L’inscription à cette séance se fait en dehors du site. Suivez le lien pour vous inscrire.
                </p>
                <p style={{ margin: "14px 0 0" }}>
                  <a
                    href={s.reservation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      padding: "11px 20px",
                      borderRadius: 999,
                      background: "#04A49B",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    {s.reservation_libelle || "S’inscrire"}
                  </a>
                </p>
                {lienPlanning}
              </>
            )}
```

`rel="noopener noreferrer"` n'est pas décoratif : le lien sort du site, vers une adresse qu'un praticien a saisie.

Vérifie aussi la condition de la ligne 94 environ, qui choisit un texte selon `etat.ton` : elle énumère `complet`, `ok` et `peu`. Le ton `externe` n'en fait pas partie, donc elle n'a pas à changer — **confirme-le en lisant** plutôt qu'en le supposant.

- [ ] **Step 2: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 59 tests, aucune erreur, aucun avertissement, et le build passe.

- [ ] **Step 3: Commit**

```bash
git add components/admin/klub/ChampsSeanceForm.tsx components/admin/klub/KlubSeanceDetail.tsx components/admin/klub/KlubCreneaux.tsx components/admin/klub/rpc.ts app/mugi-klub/seance/\[id\]/page.tsx
git commit -m "$(cat <<'EOF'
klub : poser un lien d'inscription, et le bouton côté public

Les deux champs n'apparaissent que si l'inscription n'est pas requise, et
recocher la case les vide — un lien et un formulaire ne coexistent pas,
la base le refuse.

L'écran enregistre d'abord la séance, puis pose le lien par un second
appel. Si ce second appel échoue, le message le dit sans laisser croire
que le reste a échoué : c'est le prix du détour par une fonction dédiée,
choisi pour ne pas retranscrire trois fonctions de production.

Le lien sort du site vers une adresse saisie à la main : rel="noopener
noreferrer" n'est pas décoratif.
EOF
)"
```

---

### Task 6: Vérification, PR et mise en ligne

- [ ] **Step 1: Tout vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 59 tests, aucune erreur, aucun avertissement, build vert.

Relancer les fichiers de scénarios avec `execute_sql`, chacun en une seule fois :
- `supabase/tests/klub.sql` → son message de succès habituel
- `supabase/tests/klub_reservation.sql` → `réservation : scénarios OK`

`supabase/tests/klub.sql` est **le point de vigilance de cette tâche** : il éprouve le parcours d'inscription, et cette livraison a remplacé `klub__seance_publique`. Si l'un de ses `assert` échoue, c'est une régression réelle.

- [ ] **Step 2: Contrôle des droits effectifs**

Outil `get_advisors`, `project_id` = `nuehdfyscqnkckudkqhe`, `type` = `security`.
Attendu : aucune nouvelle alerte hors `klub_admin_reservation` sous « authenticated can execute security definer », qui vérifie les droits dans son corps.

- [ ] **Step 3: Vérifier que la production est intacte**

```sql
select
  (select count(*) from public.klub_creneaux) as creneaux,
  (select count(*) from public.klub_seances) as seances,
  (select count(*) from public.klub_inscriptions) as inscriptions,
  (select count(*) from public.klub_seances where reservation_url is not null) as externes,
  (select count(*) from public.articles) as articles,
  (select count(*) from public.agenda_voeux) as voeux;
```

Attendu : `creneaux` 2, `seances` 13, `externes` 0 — personne n'a encore posé de lien —, `articles` 23, et `inscriptions` comme `voeux` au moins égaux à ce qu'ils étaient.

- [ ] **Step 4: Pousser et ouvrir la PR**

```bash
git push -u origin feature/klub-reservation
gh pr create --base main --title "Mugi Klub : chacun sa méthode de réservation" --body "$(cat <<'EOF'
Une séance du Klub peut s'inscrire ailleurs. La prépa des danseurs se remplit par un groupe WhatsApp : le planning public y renvoie, au lieu de proposer un formulaire que personne n'utilise.

**Aucune colonne de mode.** « Ailleurs » est un cas particulier de « pas d'inscription chez nous », et une contrainte l'impose. Trois états, pas de quatrième :

| `inscription_requise` | `reservation_url` | Ce que voit le visiteur |
|---|---|---|
| `true` | forcément `null` | Le formulaire, les places, la liste d'attente |
| `false` | `null` | « Entrée libre, sans inscription » |
| `false` | renseignée | Un bouton vers le lien, et aucun compteur |

`places_restantes` était déjà `null` quand l'inscription ne se fait pas chez nous : l'absence de compteur est acquise au niveau des données, pas seulement à l'écran.

**Une seule fonction existante reprise.** `klub__seance_publique`, vingt lignes, sans laquelle le site ne verrait jamais le lien. Pour le reste, deux objets neufs plutôt que trois réécritures :

- un déclencheur d'héritage depuis le créneau, parce que `klub_tache()` liste ses colonnes une par une. Sans lui, un créneau externe engendrerait des séances internes — et ça ne se verrait qu'à la semaine suivante.
- une fonction dédiée pour poser le lien, parce que les trois fonctions d'écriture font entre 1 200 et 3 500 caractères de plpgsql et tournent en production depuis dix jours. Les retranscrire pour deux colonnes, c'était risquer d'en abîmer une autre partie pour un gain nul.

Le prix de ce détour est assumé et visible : l'écran enregistre d'abord, pose le lien ensuite, et dit clairement si le second appel échoue plutôt que de laisser croire que tout a échoué.

**Ce qui ne demandait aucun développement** : le tarif. Le champ est déjà libre et l'écran ouvert à toute l'équipe — Jean-Baptiste peut poser le sien lui-même, sur la séance ou sur le créneau.

**Un lien posé sur un créneau ne vaut que pour les séances à venir**, comme toutes les autres colonnes aujourd'hui. Les séances déjà engendrées se reprennent une par une.

Spec : `docs/superpowers/specs/2026-09-26-klub-reservation-design.md`
Plan : `docs/superpowers/plans/2026-09-26-klub-reservation.md`

Vérifications : 59 tests, `tsc`, lint sans avertissement, build, et les scénarios du Klub relancés sur la base de production en transaction annulée — dont ceux du parcours d'inscription, puisque cette livraison remplace la fonction qui construit le JSON public.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 5: Fusionner**

Lucas a autorisé la fusion de ce chantier sans nouvelle validation, **à deux conditions** : la CI verte et les scénarios passés. Vérifie les deux, puis fusionne en squash, comme tout le dépôt :

```bash
gh pr merge <numéro> --squash --delete-branch=false
```

Si la CI échoue, ou si un scénario ne passe pas, **ne fusionne pas** : l'autorisation ne couvre pas ce cas.

- [ ] **Step 6: Poser le lien de la prépa des danseurs**

Une fois en production, il reste à faire ce pour quoi tout ça existe. Lucas ou Jean-Baptiste ouvre `/admin/mugi-klub`, onglet Créneaux, les deux créneaux « Prépa des danseurs », décoche « inscription requise », colle l'adresse du groupe WhatsApp et enregistre.

**Nous n'avons pas cette adresse** : elle ne figure nulle part dans le dépôt ni dans la base. C'est à eux de la poser, et c'est à signaler explicitement dans le rapport final.

Les séances déjà engendrées gardent leur formulaire : les reprendre une par une, ou les laisser s'éteindre.

---

## Ce que ce plan ne fait pas

- Récupérer les inscrits depuis un service externe.
- Le paiement en ligne.
- Le parcours de prise en main dans l'admin : chantier suivant.
