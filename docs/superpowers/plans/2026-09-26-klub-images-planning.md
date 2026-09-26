# Mugi Klub, images et nouveau planning (chantier D) — plan d'implémentation

> **Pour les exécutants agentiques :** SOUS-COMPÉTENCE REQUISE — utiliser `superpowers:subagent-driven-development` (recommandé) ou `superpowers:executing-plans` pour exécuter ce plan tâche par tâche. Les étapes se suivent en cochant les cases (`- [ ]`).

**But :** chaque séance du Klub peut porter une image, et le planning public devient une liste chronologique illustrée — une séance à la une, des filtres par type, des cartes où l'image domine.

**Architecture :** deux colonnes (`image`, `image_focus`) sur les séances et les créneaux, héritées par un déclencheur neuf et écrites par une fonction dédiée neuve, sur le chemin déjà tracé par le lien de réservation. Le planning est préparé par une fonction pure et testée ; l'affichage est un composant serveur, sauf les filtres, seul morceau interactif.

**Pile :** Next.js 16 App Router, React 19, `next/image`, Supabase (projet `nuehdfyscqnkckudkqhe`), `node --test`.

**Spec :** `docs/superpowers/specs/2026-09-26-klub-images-planning-design.md`.

---

## Règles pour l'exécutant

1. **Lire `AGENTS.md` à la racine.** Cette version de Next.js a des ruptures d'API. Avant d'utiliser une API Next que tu n'as pas déjà vue employée dans ce dépôt, lis le guide correspondant dans `node_modules/next/dist/docs/`. `next/image` est déjà employé par `components/site/ArticleCards.tsx` : c'est le modèle à suivre.
2. **Base de production, en service.** Projet `nuehdfyscqnkckudkqhe` : 23 articles, 2 créneaux et 11 séances du Klub, l'agenda du cabinet. Migrations avec `mcp__4497d48a-79cd-4b24-bdf1-1339728e2b85__apply_migration`, lectures avec `..._execute_sql`, `project_id` explicite. **Jamais les outils `mcp__supabase__*`.**
3. **Une seule fonction existante est reprise** : `klub__seance_publique`, dont le corps complet est donné. **Ne touche à aucune autre fonction `klub_*`**, en particulier `klub_tache`, `klub_admin_creer_seance`, `klub_admin_modifier_seance`, `klub_admin_sauver_creneau`, ni au déclencheur `klub__heriter_reservation`.
4. **Ne jamais mettre en pause ni supprimer le projet Supabase.** Le site vitrine tourne entièrement dessus.
5. **Tout essai destructif dans `begin; … rollback;`.**
6. **Lint React Compiler** : pas de `setState` dans le corps d'un effet, pas de mutation pendant le rendu. `npm run lint` doit finir **sans aucun avertissement**.
7. **Le code de ce plan n'a jamais été compilé.** Si une signature du dépôt diffère, suis le dépôt et dis précisément ce qui différait.
8. **Commits.** `git add <chemins explicites>`, jamais `-a` ni `-am`. Messages en français. Termine chaque message par `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
9. Ne rien pousser et n'ouvrir aucune PR avant la tâche 6.

## Carte des fichiers

| Fichier | Responsabilité |
|---|---|
| `supabase/migrations/20260926180000_klub_images.sql` | Colonnes, contraintes, héritage, écriture, JSON public |
| `supabase/tests/klub_images.sql` | Scénarios |
| `lib/klub/planning.ts` | Préparer le planning : à la une, jours, types, filtres |
| `lib/klub/planning.test.ts` | Tests |
| `lib/klub/types.ts` | Deux champs de plus sur `ChampsSeance` |
| `components/admin/ImageDrop.tsx` | Aperçus de recadrage paramétrables |
| `components/admin/klub/ChampsSeanceForm.tsx` | Le dépôt d'image |
| `components/admin/klub/KlubSeances.tsx`, `KlubSeanceDetail.tsx`, `KlubCreneaux.tsx` | L'appel à `klub_admin_image` |
| `components/site/klub/KlubVisuel.tsx` | L'image, ou le panneau de couleur |
| `components/site/klub/KlubALaUne.tsx` | La séance à la une |
| `components/site/klub/KlubCarte.tsx` | La carte, refaite |
| `components/site/klub/KlubListe.tsx` | Les filtres et la liste, côté navigateur |
| `components/site/klub/KlubPlanning.tsx` | L'assemblage, côté serveur |
| `components/site/klub/KlubSemaines.tsx` | Supprimé |
| `app/mugi-klub/seance/[id]/page.tsx` | L'image en tête de la page de séance |

---

### Task 0: Espace de travail

- [ ] **Step 1: Vérifier l'état de départ**

```bash
cd /Users/lucas/Desktop/mugitu-biarritz-admin
git status --short
git log --oneline -1
```

Attendu : arbre propre, branche `feature/klub-images-planning`.

- [ ] **Step 2: Vérifier les tests existants**

Run: `npm test`
Attendu : 73 tests passent.

---

### Task 1: La base

**Files:**
- Create: `supabase/migrations/20260926180000_klub_images.sql`

- [ ] **Step 1: Écrire la migration**

```sql
-- Mugi Klub : une image par séance ou par créneau.
--
-- Modèle des couvertures d'articles (`cover`, `cover_focus`) : une même image
-- est recadrée à plusieurs formats — large à la une, carrée dans la liste —
-- et `object-fit: cover` coupe au centre, ce qui décapite un sujet placé haut.
-- D'où le point focal.
--
-- Même chemin que le lien de réservation : un déclencheur pour l'héritage et
-- une fonction dédiée pour l'écriture, plutôt que de retranscrire trois
-- fonctions plpgsql qui tournent en production.

alter table public.klub_seances
  add column image text,
  add column image_focus text not null default '50% 50%';

alter table public.klub_creneaux
  add column image text,
  add column image_focus text not null default '50% 50%';

alter table public.klub_seances add constraint klub_seances_image_https
  check (image is null or image like 'https://%');
alter table public.klub_creneaux add constraint klub_creneaux_image_https
  check (image is null or image like 'https://%');

-- Héritage depuis le créneau : `klub_tache()` liste ses colonnes une par une,
-- une image posée sur un créneau ne descendrait jamais sans ce déclencheur.
create or replace function public.klub__heriter_image()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  c record;
begin
  if new.creneau_id is null or new.image is not null then return new; end if;

  select image, image_focus into c from public.klub_creneaux where id = new.creneau_id;
  if c.image is null then return new; end if;

  new.image := c.image;
  new.image_focus := c.image_focus;
  return new;
end;
$$;

revoke all on function public.klub__heriter_image() from public, anon, authenticated;

create trigger klub_seances_heriter_image
  before insert on public.klub_seances
  for each row execute function public.klub__heriter_image();

-- Poser ou retirer l'image d'une séance ou d'un créneau.
-- Codes levés : KLUB_DROITS (par klub__verifier_droits), KLUB_CIBLE, KLUB_URL.
create or replace function public.klub_admin_image(
  p_cible text, p_id uuid, p_image text, p_focus text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_image text := nullif(btrim(coalesce(p_image, '')), '');
  v_focus text := coalesce(nullif(btrim(coalesce(p_focus, '')), ''), '50% 50%');
begin
  perform public.klub__verifier_droits();
  if p_cible not in ('seance', 'creneau') then raise exception 'KLUB_CIBLE'; end if;
  if v_image is not null and v_image not like 'https://%' then raise exception 'KLUB_URL'; end if;

  if p_cible = 'seance' then
    update public.klub_seances set image = v_image, image_focus = v_focus where id = p_id;
  else
    update public.klub_creneaux set image = v_image, image_focus = v_focus where id = p_id;
  end if;
  if not found then raise exception 'KLUB_CIBLE'; end if;
end;
$$;

revoke all on function public.klub_admin_image(text, uuid, text, text) from public, anon;
grant execute on function public.klub_admin_image(text, uuid, text, text) to authenticated;

-- Le JSON public porte les deux clés. Corps repris de la version en
-- production, deux clés en plus et rien d'autre.
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
    'image', s.image,
    'image_focus', s.image_focus,
    'places_restantes', case when s.inscription_requise then greatest(
      s.capacite - (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'confirmee'), 0) end,
    'nb_attente', (select count(*) from public.klub_inscriptions i where i.seance_id = s.id and i.statut = 'attente')
  );
$$;
```

**Avant d'appliquer**, relis la définition en production de `klub__seance_publique` avec `pg_get_functiondef` et vérifie qu'elle est identique au corps ci-dessus **aux deux clés `image` et `image_focus` près**. Si elle a changé depuis l'écriture de ce plan, arrête-toi et signale-le.

- [ ] **Step 2: Appliquer la migration**

Outil `apply_migration`, `project_id` = `nuehdfyscqnkckudkqhe`, `name` = `klub_images`.

- [ ] **Step 3: Vérifier**

```sql
select
  (select count(*) from information_schema.columns where table_schema='public'
     and table_name in ('klub_seances','klub_creneaux') and column_name in ('image','image_focus')) as colonnes,
  (select count(*) from pg_trigger where tgname = 'klub_seances_heriter_image') as declencheur,
  (select count(*) from pg_trigger where tgname = 'klub_seances_heriter_reservation') as declencheur_resa_intact,
  has_function_privilege('anon', 'public.klub_admin_image(text,uuid,text,text)', 'execute') as image_anon,
  (select public.klub__seance_publique(s) ? 'image' from public.klub_seances s limit 1) as json_porte_image,
  jsonb_array_length(public.klub_planning(now(), now() + interval '30 days')) as planning_repond;
```

Attendu : `colonnes` 4, `declencheur` 1, `declencheur_resa_intact` 1, `image_anon` faux, `json_porte_image` vrai, `planning_repond` au moins 1.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260926180000_klub_images.sql
git commit -m "$(cat <<'EOF'
klub : une image par séance ou par créneau

Modèle des couvertures d'articles, avec son point focal : une même image
est recadrée large à la une et carrée dans la liste, et un recadrage au
centre décapite un sujet placé haut.

Même chemin que le lien de réservation — un déclencheur d'héritage et une
fonction dédiée —, pour ne retranscrire aucune fonction de production.
Seule klub__seance_publique est reprise, deux clés de plus.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: Les scénarios

**Files:**
- Create: `supabase/tests/klub_images.sql`

- [ ] **Step 1: Écrire le fichier**

```sql
-- Images du Mugi Klub. Tout se passe dans une transaction annulée : rien
-- n'est écrit. Lancer avec l'outil MCP execute_sql
-- (projet nuehdfyscqnkckudkqhe).
-- Succès : la dernière requête renvoie « images : scénarios OK ».

begin;

do $$
declare
  v_lucas uuid;
  v_creneau uuid;
  v_seance uuid;
  v_heritee uuid;
  v_json jsonb;
  v_img constant text := 'https://nuehdfyscqnkckudkqhe.supabase.co/storage/v1/object/public/site-medias/klub/essai.webp';
begin
  select u.id into v_lucas from auth.users u where u.email = 'lucas.bengosteo@gmail.com';
  assert v_lucas is not null, 'I0 compte absent';

  -- Chaque bloc pose son identité au début plutôt que d'hériter de celle
  -- d'un bloc précédent.
  perform set_config('request.jwt.claims', json_build_object('sub', v_lucas, 'role', 'authenticated')::text, true);

  insert into public.klub_creneaux (jour, heure, duree_min, type, titre, inscription_requise, capacite)
  values (3, '18:00', 60, 'atelier', 'Essai image', true, 8) returning id into v_creneau;
  insert into public.klub_seances (debut, duree_min, type, titre, inscription_requise, capacite)
  values (now() + interval '9 days', 60, 'atelier', 'Essai image', true, 8) returning id into v_seance;

  -- I1. Une adresse qui n'est pas en https est refusée par la contrainte.
  begin
    update public.klub_seances set image = 'http://exemple.fr/a.jpg' where id = v_seance;
    assert false, 'I1 une image http est acceptée';
  exception when check_violation then null;
  end;

  -- I2. La fonction pose une image et son point focal.
  perform public.klub_admin_image('seance', v_seance, v_img, '50% 20%');
  assert (select image from public.klub_seances where id = v_seance) = v_img, 'I2a';
  assert (select image_focus from public.klub_seances where id = v_seance) = '50% 20%', 'I2b';

  -- I3. Un point focal vide revient au centre.
  perform public.klub_admin_image('seance', v_seance, v_img, '');
  assert (select image_focus from public.klub_seances where id = v_seance) = '50% 50%', 'I3';

  -- I4. Elle retire l'image.
  perform public.klub_admin_image('seance', v_seance, null, null);
  assert (select image from public.klub_seances where id = v_seance) is null, 'I4';

  -- I5. Elle refuse une adresse qui n'est pas en https, avec un code lisible.
  begin
    perform public.klub_admin_image('seance', v_seance, 'javascript:alert(1)', null);
    assert false, 'I5 une adresse javascript est acceptée';
  exception when raise_exception then assert sqlerrm = 'KLUB_URL', 'I5 ' || sqlerrm;
  end;

  -- I6. Une cible inexistante est refusée.
  begin
    perform public.klub_admin_image('seance', gen_random_uuid(), v_img, null);
    assert false, 'I6 une séance inexistante est acceptée';
  exception when raise_exception then assert sqlerrm = 'KLUB_CIBLE', 'I6 ' || sqlerrm;
  end;

  -- I7. Le créneau transmet son image et son point focal à la séance qu'il engendre.
  perform public.klub_admin_image('creneau', v_creneau, v_img, '30% 40%');
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, inscription_requise, capacite)
  values (v_creneau, now() + interval '16 days', 60, 'atelier', 'Essai image', true, 8)
  returning id into v_heritee;
  assert (select image from public.klub_seances where id = v_heritee) = v_img, 'I7a';
  assert (select image_focus from public.klub_seances where id = v_heritee) = '30% 40%', 'I7b';

  -- I8. Une séance qui arrive avec sa propre image ne l'écrase pas.
  insert into public.klub_seances (creneau_id, debut, duree_min, type, titre, inscription_requise, capacite, image)
  values (v_creneau, now() + interval '23 days', 60, 'atelier', 'Essai image', true, 8,
          'https://exemple.fr/propre.jpg')
  returning id into v_heritee;
  assert (select image from public.klub_seances where id = v_heritee) = 'https://exemple.fr/propre.jpg', 'I8';

  -- I9. L'héritage du lien de réservation n'est pas dérangé.
  assert (select count(*) from pg_trigger where tgname = 'klub_seances_heriter_reservation') = 1, 'I9';

  -- I10. Le JSON public porte les deux clés.
  perform public.klub_admin_image('seance', v_seance, v_img, '50% 20%');
  v_json := public.klub__seance_publique((select s from public.klub_seances s where s.id = v_seance));
  assert v_json->>'image' = v_img, 'I10a ' || v_json::text;
  assert v_json->>'image_focus' = '50% 20%', 'I10b';

  perform set_config('request.jwt.claims', '', true);
end $$;

set local role anon;
do $$
begin
  begin
    perform public.klub_admin_image('seance', gen_random_uuid(), 'https://exemple.fr/a.jpg', null);
    assert false, 'P1 anon pose une image';
  exception when insufficient_privilege then null;
  end;
end $$;
reset role;

rollback;
select 'images : scénarios OK' as resultat;
```

- [ ] **Step 2: Lancer les scénarios**

Outil `execute_sql`, `project_id` = `nuehdfyscqnkckudkqhe`, le fichier **en entier, en une seule fois**.
Attendu : `[{"resultat":"images : scénarios OK"}]`.

Si un `assert` échoue, **ne modifie pas le scénario pour le faire passer sans avoir établi si c'est lui ou la migration qui a tort.**

- [ ] **Step 3: Vérifier que rien n'a persisté**

```sql
select
  (select count(*) from public.klub_creneaux) as creneaux,
  (select count(*) from public.klub_seances) as seances,
  (select count(*) from public.klub_seances where image is not null) as seances_illustrees;
```

Attendu : `creneaux` 2, `seances` 11 — ou davantage si le cron en a engendré de nouvelles entre-temps —, `seances_illustrees` 0.

- [ ] **Step 4: Commit**

```bash
git add supabase/tests/klub_images.sql
git commit -m "$(cat <<'EOF'
klub : scénarios des images

Onze scénarios. Les deux qui comptent : un créneau transmet son image et
son point focal aux séances qu'il engendre, et une séance qui arrive avec
sa propre image ne l'écrase pas.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: Préparer le planning

**Files:**
- Create: `lib/klub/planning.ts`, `lib/klub/planning.test.ts`
- Modify: `lib/klub/types.ts`, et les littéraux qui construisent `ChampsSeance`

- [ ] **Step 1: Ajouter les deux champs au type**

Dans `lib/klub/types.ts`, ajouter à `ChampsSeance`, après `reservation_libelle` :

```ts
  /** L'image de la séance, et son point focal en « x% y% ». */
  image: string | null;
  image_focus: string;
```

`tsc` va nommer tous les littéraux qui construisent ce type. Ce sont les mêmes six qu'au chantier des méthodes de réservation — `lib/klub/format.test.ts`, `lib/klub/mails.test.ts`, `lib/klub/regles-envoi.test.ts`, `components/admin/klub/KlubSeances.tsx`, `KlubCreneaux.tsx`, `KlubSeanceDetail.tsx`. Complète-les avec `image: null, image_focus: "50% 50%"`, **sauf `KlubSeanceDetail.tsx`**, qui doit reprendre `s.image` et `s.image_focus` — sinon ouvrir une séance illustrée puis l'enregistrer effacerait son image.

- [ ] **Step 2: Écrire le test qui échoue**

`lib/klub/planning.test.ts` :

```ts
import assert from "node:assert/strict";
import test from "node:test";
import { filtrerJours, preparerPlanning } from "./planning.ts";
import type { KlubType, SeancePublique } from "./types.ts";

let n = 0;
const s = (debut: string, type: KlubType = "small", statut: "publiee" | "annulee" = "publiee"): SeancePublique => ({
  id: `s${++n}`,
  debut,
  statut,
  type,
  titre: "Prépa des danseurs",
  description: "",
  intervenant: "Jean-Baptiste",
  duree_min: 60,
  capacite: 12,
  prix_libelle: "15 €",
  inscription_requise: true,
  reservation_url: null,
  reservation_libelle: null,
  image: null,
  image_focus: "50% 50%",
  places_restantes: 12,
  nb_attente: 0,
});

// Lundi 28 septembre 2026, minuit UTC.
const MAINTENANT = "2026-09-28T00:00:00Z";

test("sans séance, rien à la une et aucun filtre", () => {
  const p = preparerPlanning([], MAINTENANT);
  assert.equal(p.aLaUne, null);
  assert.deepEqual(p.jours, []);
  assert.equal(p.afficherFiltres, false);
});

test("la séance à la une est la prochaine à venir", () => {
  const a = s("2026-10-02T06:00:00Z");
  const b = s("2026-09-28T06:00:00Z");
  assert.equal(preparerPlanning([a, b], MAINTENANT).aLaUne?.id, b.id);
});

test("une séance passée n’est ni à la une ni dans la liste", () => {
  const passee = s("2026-09-25T06:00:00Z");
  const avenir = s("2026-10-02T06:00:00Z");
  const p = preparerPlanning([passee, avenir], MAINTENANT);
  assert.equal(p.aLaUne?.id, avenir.id);
  assert.equal(p.jours.flatMap((j) => j.seances).some((x) => x.id === passee.id), false);
});

test("une séance annulée et déjà passée disparaît aussi", () => {
  const annuleePassee = s("2026-09-21T06:00:00Z", "small", "annulee");
  const avenir = s("2026-10-02T06:00:00Z");
  const p = preparerPlanning([annuleePassee, avenir], MAINTENANT);
  assert.equal(p.jours.flatMap((j) => j.seances).some((x) => x.id === annuleePassee.id), false);
  assert.deepEqual(p.types, [{ type: "small", nombre: 1 }]);
});

test("une séance en cours n’est pas à la une", () => {
  // Commencée à 23 h 30 UTC la veille, une heure : encore en cours à minuit.
  const enCours = s("2026-09-27T23:30:00Z");
  const suivante = s("2026-10-02T06:00:00Z");
  const p = preparerPlanning([enCours, suivante], MAINTENANT);
  assert.equal(p.aLaUne?.id, suivante.id);
});

test("une séance annulée n’est pas à la une, mais reste dans la liste", () => {
  const annulee = s("2026-09-28T06:00:00Z", "small", "annulee");
  const suivante = s("2026-10-02T06:00:00Z");
  const p = preparerPlanning([annulee, suivante], MAINTENANT);
  assert.equal(p.aLaUne?.id, suivante.id);
  assert.equal(p.jours.flatMap((j) => j.seances).some((x) => x.id === annulee.id), true);
});

test("la séance à la une n’est pas répétée dans la liste", () => {
  const a = s("2026-09-28T06:00:00Z");
  const b = s("2026-10-02T06:00:00Z");
  const p = preparerPlanning([a, b], MAINTENANT);
  assert.equal(p.jours.flatMap((j) => j.seances).some((x) => x.id === a.id), false);
});

test("la liste est groupée par jour, dans l’ordre", () => {
  const ouverture = s("2026-09-28T06:00:00Z");
  const matin = s("2026-10-02T06:00:00Z");
  const soir = s("2026-10-02T16:00:00Z");
  const lundi = s("2026-10-05T06:00:00Z");
  const p = preparerPlanning([lundi, soir, ouverture, matin], MAINTENANT);
  assert.deepEqual(
    p.jours.map((j) => j.cle),
    ["2026-10-02", "2026-10-05"],
  );
  assert.deepEqual(
    p.jours[0].seances.map((x) => x.id),
    [matin.id, soir.id],
  );
});

test("un seul type : pas de filtres", () => {
  const p = preparerPlanning([s("2026-09-28T06:00:00Z"), s("2026-10-02T06:00:00Z")], MAINTENANT);
  assert.deepEqual(p.types, [{ type: "small", nombre: 2 }]);
  assert.equal(p.afficherFiltres, false);
});

test("deux types : les filtres apparaissent, dans l’ordre des types", () => {
  const p = preparerPlanning(
    [s("2026-09-29T16:00:00Z", "atelier"), s("2026-09-28T06:00:00Z", "small"), s("2026-10-02T06:00:00Z", "small")],
    MAINTENANT,
  );
  assert.deepEqual(p.types, [
    { type: "small", nombre: 2 },
    { type: "atelier", nombre: 1 },
  ]);
  assert.equal(p.afficherFiltres, true);
});

test("filtrer par type retire les jours devenus vides", () => {
  const p = preparerPlanning(
    [s("2026-09-28T06:00:00Z"), s("2026-09-30T16:00:00Z", "atelier"), s("2026-10-02T06:00:00Z", "small")],
    MAINTENANT,
  );
  const ateliers = filtrerJours(p.jours, "atelier");
  assert.deepEqual(
    ateliers.map((j) => j.cle),
    ["2026-09-30"],
  );
  assert.deepEqual(filtrerJours(p.jours, null), p.jours);
});
```

**Avant de lancer**, vérifie que le 28 septembre 2026 est bien un lundi et que `06:00Z` tombe à 8 h à Paris en septembre et en octobre — l'heure d'été s'arrête le 25 octobre 2026. Toutes les dates du test sont antérieures.

- [ ] **Step 3: Lancer le test pour le voir échouer**

Run: `node --test lib/klub/planning.test.ts`
Attendu : ÉCHEC, `ERR_MODULE_NOT_FOUND` pour `./planning.ts`.

- [ ] **Step 4: Écrire `lib/klub/planning.ts`**

```ts
import { cleJour } from "./format.ts";
import { KLUB_TYPES, type KlubType, type SeancePublique } from "./types.ts";

/**
 * Préparer le planning public du Klub : la séance à la une, la liste
 * groupée par jour, et le compte par type pour les filtres.
 *
 * Pur, sans import d'alias : lu tel quel par les tests `node --test`.
 */

export type Jour = { cle: string; seances: SeancePublique[] };

export type Planning = {
  aLaUne: SeancePublique | null;
  jours: Jour[];
  types: { type: KlubType; nombre: number }[];
  /** Une rangée de filtres à une seule valeur ne filtre rien. */
  afficherFiltres: boolean;
};

export function preparerPlanning(seances: SeancePublique[], maintenant: string | Date): Planning {
  const triees = [...seances].sort((a, b) => a.debut.localeCompare(b.debut));
  const now = new Date(maintenant).getTime();
  const fin = (s: SeancePublique) => new Date(s.debut).getTime() + s.duree_min * 60_000;

  // Une séance terminée n'a rien à faire sur la page : un visiteur ne peut
  // plus s'y inscrire. On le décide sur l'heure, et non sur l'état
  // d'affichage : celui-ci dit « annulée » avant de regarder si la séance est
  // finie, et une séance annulée la semaine dernière serait restée pour
  // toujours. Une séance annulée À VENIR reste, barrée — ceux qui comptaient
  // venir doivent pouvoir le constater.
  const avenir = triees.filter((s) => fin(s) > now);

  // À la une : la prochaine qui n'est ni annulée ni déjà commencée. Une
  // séance en cours reste dans la liste, mais on ne met pas en avant ce à
  // quoi on ne peut plus se joindre.
  const aLaUne = avenir.find((s) => s.statut !== "annulee" && new Date(s.debut).getTime() > now) ?? null;

  const jours: Jour[] = [];
  for (const s of avenir) {
    if (s.id === aLaUne?.id) continue;
    const cle = cleJour(s.debut);
    const dernier = jours[jours.length - 1];
    if (dernier && dernier.cle === cle) dernier.seances.push(s);
    else jours.push({ cle, seances: [s] });
  }

  const types = KLUB_TYPES.map(({ value }) => ({
    type: value,
    nombre: avenir.filter((s) => s.type === value).length,
  })).filter((t) => t.nombre > 0);

  return { aLaUne, jours, types, afficherFiltres: types.length > 1 };
}

/** La liste restreinte à un type ; `null` rend tout. Les jours vidés disparaissent. */
export function filtrerJours(jours: Jour[], type: KlubType | null): Jour[] {
  if (type === null) return jours;
  return jours
    .map((j) => ({ cle: j.cle, seances: j.seances.filter((s) => s.type === type) }))
    .filter((j) => j.seances.length > 0);
}
```

**Vérifie** que `lib/klub/format.ts` exporte bien `cleJour`, et que `lib/klub/types.ts` exporte `KLUB_TYPES` : c'est le cas à l'écriture de ce plan. Et que `format.ts` n'importe que `./types.ts` — sinon `node --test` ne saurait pas résoudre.

- [ ] **Step 5: Lancer les tests**

Run: `npm test`
Attendu : 84 tests passent (73 existants + 11 nouveaux).

- [ ] **Step 6: Vérifier types et lint**

Run: `npx tsc --noEmit && npm run lint`
Attendu : aucune sortie, aucun avertissement.

- [ ] **Step 7: Commit**

```bash
git add lib/klub/planning.ts lib/klub/planning.test.ts lib/klub/types.ts lib/klub/format.test.ts lib/klub/mails.test.ts lib/klub/regles-envoi.test.ts components/admin/klub/KlubSeances.tsx components/admin/klub/KlubCreneaux.tsx components/admin/klub/KlubSeanceDetail.tsx
git commit -m "$(cat <<'EOF'
klub : préparer le planning — à la une, jours et filtres

Une fonction pure et testée. La séance à la une est la prochaine à venir
qui n'est pas annulée ; une séance passée disparaît, une séance annulée
reste barrée, pour que ceux qui comptaient venir le constatent.

Les filtres ne s'affichent qu'à partir de deux types : une rangée à une
seule valeur ne filtre rien, et c'est le cas aujourd'hui.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: L'image dans l'admin

**Files:**
- Modify: `components/admin/ImageDrop.tsx`, `components/admin/klub/ChampsSeanceForm.tsx`, `components/admin/klub/KlubSeances.tsx`, `components/admin/klub/KlubSeanceDetail.tsx`, `components/admin/klub/KlubCreneaux.tsx`, `components/admin/klub/rpc.ts`

- [ ] **Step 1: Rendre les aperçus paramétrables**

`ImageDrop` montre les recadrages des articles, en dur. Le Klub a les siens. Ajouter une entrée facultative, dont la valeur par défaut est la liste actuelle — l'éditeur d'articles ne change donc pas.

Dans `components/admin/ImageDrop.tsx`, ajouter aux props, après `dossier` :

```tsx
  /** Les recadrages à montrer. Par défaut ceux des articles. */
  apercus?: { label: string; ratio: number; largeur: number }[];
```

avec la valeur par défaut `apercus = APERCUS` dans la déstructuration, et remplacer `APERCUS.map(` par `apercus.map(` dans le rendu. **Ne change rien d'autre dans ce fichier** : il sert l'éditeur d'articles, en service.

- [ ] **Step 2: Ajouter le dépôt au formulaire du Klub**

Dans `components/admin/klub/ChampsSeanceForm.tsx`, importer :

```tsx
import ImageDrop from "../ImageDrop";
```

et, en tête du formulaire — avant le titre, puisque c'est ce qu'on voit en premier sur le site —, insérer :

```tsx
      <div>
        <p style={LABEL}>Image</p>
        <ImageDrop
          valeur={valeur.image ?? ""}
          onChange={(url) => set("image", url || null)}
          focus={valeur.image_focus}
          onFocusChange={(f) => set("image_focus", f)}
          dossier="klub"
          apercus={[
            { label: "À la une", ratio: 16 / 10, largeur: 120 },
            { label: "Dans la liste", ratio: 1, largeur: 76 },
          ]}
        />
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(51,51,52,.55)" }}>
          Facultative. Sans image, la séance s’affiche sur un fond à la couleur de son type.
        </p>
      </div>
```

**Vérifie** le nom de la constante de style des libellés dans ce fichier (`LABEL` à l'écriture de ce plan) et la présence de `set`.

- [ ] **Step 3: Appeler `klub_admin_image` après l'enregistrement**

Dans les trois composants qui enregistrent — `KlubSeances.tsx` (création d'une séance), `KlubSeanceDetail.tsx` (modification), `KlubCreneaux.tsx` (créneau) — un appel à `klub_admin_reservation` suit déjà l'enregistrement principal. **Ajoute juste après lui**, sur le même motif :

```tsx
      const img = await appeler("klub_admin_image", {
        p_cible: "seance", // "creneau" dans KlubCreneaux.tsx
        p_id: id,
        p_image: brouillon.image,
        p_focus: brouillon.image_focus,
      });
      if (!img.ok) {
        notifier(`Enregistré, mais l’image n’a pas été posée : ${img.message}`);
      }
```

**Adapte `id`, `brouillon` et `notifier`** aux noms de chaque fichier, exactement comme l'appel à `klub_admin_reservation` qui le précède. Dans `KlubSeances.tsx`, l'appel de réservation n'est fait que si un lien est saisi ; fais de même pour l'image — seulement si `creation.image` est renseignée.

**Cite dans ton rapport les lignes réelles ajoutées dans les trois fichiers.**

- [ ] **Step 4: Ajouter le code d'erreur**

`KLUB_URL` et `KLUB_CIBLE` existent déjà dans `ERREURS_ADMIN` de `components/admin/klub/rpc.ts`. Le message de `KLUB_URL` parle d'un lien ; il vaut aussi pour une image. Rien à ajouter — **vérifie-le**.

- [ ] **Step 5: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint`
Attendu : 84 tests, aucune erreur, aucun avertissement.

- [ ] **Step 6: Commit**

```bash
git add components/admin/ImageDrop.tsx components/admin/klub/ChampsSeanceForm.tsx components/admin/klub/KlubSeances.tsx components/admin/klub/KlubSeanceDetail.tsx components/admin/klub/KlubCreneaux.tsx
git commit -m "$(cat <<'EOF'
klub : déposer une image sur une séance ou un créneau

Le dépôt des couvertures d'articles, avec ses aperçus de recadrage — rendus
paramétrables, pour montrer les deux formats du planning : à la une et
dans la liste. L'éditeur d'articles garde les siens par défaut.

L'image est posée par un appel à klub_admin_image après l'enregistrement,
comme le lien de réservation : un échec se dit sans laisser croire que le
reste a échoué.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: La page publique

**Files:**
- Create: `components/site/klub/KlubVisuel.tsx`, `components/site/klub/KlubALaUne.tsx`, `components/site/klub/KlubListe.tsx`
- Modify: `components/site/klub/KlubCarte.tsx`, `components/site/klub/KlubPlanning.tsx`, `app/mugi-klub/seance/[id]/page.tsx`
- Delete: `components/site/klub/KlubSemaines.tsx`

- [ ] **Step 1: L'image, ou le panneau de couleur**

`components/site/klub/KlubVisuel.tsx` :

```tsx
import Image from "next/image";
import { COULEUR_TYPE, LIBELLE_TYPE, type SeancePublique } from "@/lib/klub/types";

/**
 * L'image d'une séance, ou à défaut un panneau à la couleur de son type.
 *
 * Le panneau n'est pas un cas limite : à l'ouverture du nouveau planning,
 * aucune séance n'a d'image. Il doit tenir seul.
 */
export default function KlubVisuel({
  seance,
  sizes,
  grand = false,
}: {
  seance: SeancePublique;
  sizes: string;
  grand?: boolean;
}) {
  const couleur = COULEUR_TYPE[seance.type];

  if (seance.image) {
    return (
      <Image
        src={seance.image}
        alt=""
        fill
        sizes={sizes}
        style={{ objectFit: "cover", objectPosition: seance.image_focus }}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "flex-end",
        padding: grand ? 22 : 12,
        background: `linear-gradient(140deg, ${couleur} 0%, ${couleur}cc 55%, #003850 140%)`,
        overflow: "hidden",
      }}
    >
      <span
        style={{
          fontSize: grand ? "clamp(34px,5vw,58px)" : 22,
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: "-.03em",
          color: "rgba(255,255,255,.28)",
          textTransform: "uppercase",
        }}
      >
        {LIBELLE_TYPE[seance.type]}
      </span>
    </span>
  );
}
```

- [ ] **Step 2: La séance à la une**

`components/site/klub/KlubALaUne.tsx` :

```tsx
import Link from "next/link";
import { dateLongue, etatPlaces, heure } from "@/lib/klub/format";
import { COULEUR_TYPE, LIBELLE_TYPE, type SeancePublique } from "@/lib/klub/types";
import { klubSeancePath } from "@/lib/routes";
import KlubVisuel from "./KlubVisuel";

/** La prochaine séance, en grand. Sur le modèle de « À la une » de thera.family. */
export default function KlubALaUne({ seance, maintenant }: { seance: SeancePublique; maintenant: string }) {
  const etat = etatPlaces(seance, maintenant);
  const couleur = COULEUR_TYPE[seance.type];
  const quand = dateLongue(seance.debut);
  const externe = etat.ton === "externe" && seance.reservation_url;

  const meta = [
    `${quand.charAt(0).toUpperCase() + quand.slice(1)}, ${heure(seance.debut)}`,
    `${seance.duree_min} min`,
    seance.intervenant,
    seance.prix_libelle,
  ].filter(Boolean);

  return (
    <article
      style={{
        display: "flex",
        flexWrap: "wrap-reverse",
        gap: "clamp(20px,3vw,40px)",
        alignItems: "center",
        marginBottom: "clamp(34px,5vw,56px)",
      }}
    >
      <div style={{ flex: "1 1 320px", minWidth: 0 }}>
        <p style={{ margin: "0 0 12px", fontSize: 12, letterSpacing: "var(--ls-eyebrow)", textTransform: "uppercase", fontWeight: 600, color: "#04A49B" }}>
          Prochaine séance
        </p>
        <span
          style={{
            display: "inline-block",
            marginBottom: 12,
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "var(--ls-label)",
            textTransform: "uppercase",
            color: couleur,
            background: `${couleur}1f`,
          }}
        >
          {LIBELLE_TYPE[seance.type]}
        </span>
        <h3 style={{ margin: "0 0 14px", fontSize: "var(--h2-l)", fontWeight: 700, letterSpacing: "-.025em", lineHeight: 1.05, color: "#003850" }}>
          {seance.titre}
        </h3>
        <p style={{ margin: "0 0 8px", fontSize: 15.5, color: "rgba(51,51,52,.75)" }}>{meta.join(" · ")}</p>
        <p style={{ margin: "0 0 22px", fontSize: 14, fontWeight: 600, color: etat.ton === "complet" ? "#9E4433" : etat.ton === "peu" ? "#C2410C" : "#1F8A5B" }}>
          {etat.texte}
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link
            href={klubSeancePath(seance.id)}
            style={{ padding: "12px 22px", borderRadius: 999, background: "#003850", color: "#fff", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
          >
            Découvrir →
          </Link>
          {externe ? (
            <a
              href={seance.reservation_url ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "12px 22px", borderRadius: 999, border: "1px solid rgba(0,56,80,.2)", color: "#003850", fontSize: 14, fontWeight: 700, textDecoration: "none" }}
            >
              {seance.reservation_libelle || "S’inscrire"} ↗
            </a>
          ) : null}
        </div>
      </div>
      <div
        style={{
          flex: "1 1 360px",
          position: "relative",
          aspectRatio: "16 / 10",
          borderRadius: "var(--r-l)",
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(60,40,30,.10)",
        }}
      >
        <KlubVisuel seance={seance} sizes="(max-width: 900px) 100vw, 600px" grand />
      </div>
    </article>
  );
}
```

`flexWrap: "wrap-reverse"` est voulu : sur téléphone, l'image passe **au-dessus** du texte, comme sur Théra.

- [ ] **Step 3: La carte, refaite**

Remplacer **tout le contenu** de `components/site/klub/KlubCarte.tsx` par :

```tsx
import Link from "next/link";
import { etatPlaces, heure, type EtatPlaces } from "@/lib/klub/format";
import { COULEUR_TYPE, LIBELLE_TYPE, type SeancePublique } from "@/lib/klub/types";
import { klubSeancePath } from "@/lib/routes";
import KlubVisuel from "./KlubVisuel";

const COULEUR_ETAT: Record<EtatPlaces["ton"], string> = {
  ok: "#1F8A5B",
  peu: "#C2410C",
  complet: "#9E4433",
  libre: "#04A49B",
  externe: "#04A49B",
  annulee: "rgba(51,51,52,.5)",
  passee: "rgba(51,51,52,.5)",
};

function action(ton: EtatPlaces["ton"]): string | null {
  if (ton === "ok" || ton === "peu") return "S’inscrire →";
  if (ton === "complet") return "Liste d’attente →";
  if (ton === "externe") return "S’inscrire ↗";
  if (ton === "libre") return "Détails →";
  return null;
}

/**
 * Une séance dans la liste : l'image carrée à gauche, l'essentiel à droite.
 * Sur téléphone l'image passe au-dessus, par le seul jeu de `flex-wrap` —
 * les styles du site sont en ligne, sans feuille de media queries.
 */
export default function KlubCarte({ seance, maintenant }: { seance: SeancePublique; maintenant: string }) {
  const etat = etatPlaces(seance, maintenant);
  const annulee = etat.ton === "annulee";
  const couleur = COULEUR_TYPE[seance.type];
  const meta = [`${heure(seance.debut)} · ${seance.duree_min} min`, seance.intervenant, seance.prix_libelle].filter(Boolean);
  const libelle = action(etat.ton);

  const contenu = (
    <>
      <span
        style={{
          flex: "0 0 132px",
          position: "relative",
          aspectRatio: "1 / 1",
          minHeight: 132,
          borderRadius: "var(--r-m)",
          overflow: "hidden",
        }}
      >
        <KlubVisuel seance={seance} sizes="140px" />
      </span>
      <span style={{ flex: "1 1 220px", minWidth: 0, display: "flex", flexDirection: "column", gap: 6, padding: "4px 2px" }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "var(--ls-label)", textTransform: "uppercase", color: couleur }}>
          {LIBELLE_TYPE[seance.type]}
        </span>
        <span
          style={{
            fontSize: "var(--h3-s)",
            fontWeight: 700,
            color: "#003850",
            lineHeight: 1.2,
            textDecoration: annulee ? "line-through" : "none",
          }}
        >
          {seance.titre}
        </span>
        <span style={{ fontSize: 13.5, color: "rgba(51,51,52,.65)" }}>{meta.join(" · ")}</span>
        <span style={{ marginTop: "auto", paddingTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 12.5, fontWeight: 600, color: COULEUR_ETAT[etat.ton] }}>{etat.texte}</span>
          {libelle ? <span style={{ fontSize: 13, fontWeight: 700, color: "#04A49B" }}>{libelle}</span> : null}
        </span>
      </span>
    </>
  );

  const style: React.CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 16,
    padding: 12,
    borderRadius: "var(--r-l)",
    background: "#fff",
    boxShadow: "0 3px 16px rgba(60,40,30,.06)",
    textDecoration: "none",
    opacity: annulee ? 0.6 : 1,
  };

  return annulee ? (
    <div style={style}>{contenu}</div>
  ) : (
    <Link href={klubSeancePath(seance.id)} style={style} className="mg-inline-hover">
      {contenu}
    </Link>
  );
}
```

Une carte d'inscription externe renvoie vers **la page de la séance**, pas directement vers le lien sortant : c'est là que le visiteur lit la description avant de rejoindre un groupe WhatsApp. Le bouton sortant direct existe à la une.

- [ ] **Step 4: Les filtres et la liste**

`components/site/klub/KlubListe.tsx` :

```tsx
"use client";

import { useState } from "react";
import { dateLongue } from "@/lib/klub/format";
import { filtrerJours, type Jour } from "@/lib/klub/planning";
import { COULEUR_TYPE, LIBELLE_TYPE, type KlubType } from "@/lib/klub/types";
import KlubCarte from "./KlubCarte";

/**
 * La liste du planning, et ses filtres par type. Seul morceau interactif de
 * la page : les séances arrivent préparées du serveur, on ne fait ici que
 * choisir lesquelles montrer.
 */
export default function KlubListe({
  jours,
  types,
  afficherFiltres,
  maintenant,
}: {
  jours: Jour[];
  types: { type: KlubType; nombre: number }[];
  afficherFiltres: boolean;
  maintenant: string;
}) {
  const [choix, setChoix] = useState<KlubType | null>(null);
  const visibles = filtrerJours(jours, choix);

  const pastille = (actif: boolean, couleur = "#003850"): React.CSSProperties => ({
    padding: "7px 14px",
    borderRadius: 999,
    border: `1px solid ${actif ? couleur : "rgba(0,56,80,.15)"}`,
    background: actif ? couleur : "#fff",
    color: actif ? "#fff" : "#003850",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
  });

  return (
    <>
      {afficherFiltres ? (
        <div role="group" aria-label="Filtrer par type" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 26 }}>
          <button type="button" aria-pressed={choix === null} onClick={() => setChoix(null)} style={pastille(choix === null)}>
            Tout
          </button>
          {types.map((t) => (
            <button
              key={t.type}
              type="button"
              aria-pressed={choix === t.type}
              onClick={() => setChoix(t.type)}
              style={pastille(choix === t.type, COULEUR_TYPE[t.type])}
            >
              {LIBELLE_TYPE[t.type]} <span style={{ opacity: 0.7 }}>{t.nombre}</span>
            </button>
          ))}
        </div>
      ) : null}

      {visibles.length === 0 ? (
        <p style={{ margin: 0, padding: "20px 0", fontSize: 15, color: "rgba(51,51,52,.6)" }}>
          Aucune autre séance programmée pour l’instant.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 30 }}>
          {visibles.map((j) => {
            const libelle = dateLongue(`${j.cle}T12:00:00Z`);
            return (
              <section key={j.cle}>
                <h3
                  style={{
                    margin: "0 0 12px",
                    paddingBottom: 10,
                    borderBottom: "1px solid rgba(0,56,80,.1)",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "var(--ls-label)",
                    textTransform: "uppercase",
                    color: "#003850",
                  }}
                >
                  {libelle}
                </h3>
                <div style={{ display: "grid", gap: 12 }}>
                  {j.seances.map((s) => (
                    <KlubCarte key={s.id} seance={s} maintenant={maintenant} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 5: L'assemblage**

Remplacer **tout le contenu** de `components/site/klub/KlubPlanning.tsx` par :

```tsx
import { preparerPlanning } from "@/lib/klub/planning";
import type { SeancePublique } from "@/lib/klub/types";
import KlubALaUne from "./KlubALaUne";
import KlubListe from "./KlubListe";

/**
 * Le planning des quatre semaines à venir : une séance à la une, puis la
 * liste groupée par jour. Préparé côté serveur ; seuls les filtres tournent
 * dans le navigateur.
 */
export default function KlubPlanning({ seances, maintenant }: { seances: SeancePublique[]; maintenant: string }) {
  const p = preparerPlanning(seances, maintenant);

  return (
    <section id="planning" style={{ padding: "var(--sect-base) clamp(16px,4vw,48px)", maxWidth: 1080, margin: "0 auto" }}>
      <h2 style={{ margin: "0 0 clamp(24px,4vw,40px)", fontSize: "var(--h2-l)", fontWeight: 700, letterSpacing: "-.025em", color: "#003850" }}>
        Le planning
      </h2>

      {p.aLaUne === null ? (
        <p style={{ margin: 0, fontSize: 15.5, color: "rgba(51,51,52,.65)" }}>
          Aucune séance programmée pour l’instant. Revenez bientôt.
        </p>
      ) : (
        <>
          <KlubALaUne seance={p.aLaUne} maintenant={maintenant} />
          <KlubListe jours={p.jours} types={p.types} afficherFiltres={p.afficherFiltres} maintenant={maintenant} />
        </>
      )}
    </section>
  );
}
```

`KlubPlanning` ne reçoit plus `semaines`. Dans `app/mugi-klub/page.tsx`, retire la prop `semaines={liste}` de l'appel — mais **garde** le calcul de `liste`, qui sert encore à borner la requête `getPlanning(du, au)`.

Puis supprime `components/site/klub/KlubSemaines.tsx`, qui n'est plus importé nulle part : **vérifie-le d'abord avec une recherche**.

- [ ] **Step 6: L'image sur la page de la séance**

Dans `app/mugi-klub/seance/[id]/page.tsx`, une séance illustrée doit montrer son image — sinon le visiteur qui a cliqué sur une carte illustrée la perd en arrivant. Juste **après** le `<PageHero … />`, insérer :

```tsx
        {s.image ? (
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 clamp(16px,4vw,48px)" }}>
            <div
              style={{
                position: "relative",
                aspectRatio: "16 / 7",
                borderRadius: "var(--r-l)",
                overflow: "hidden",
                boxShadow: "0 10px 40px rgba(60,40,30,.10)",
              }}
            >
              <Image
                src={s.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1080px) 100vw, 1080px"
                style={{ objectFit: "cover", objectPosition: s.image_focus }}
              />
            </div>
          </div>
        ) : null}
```

et ajoute `import Image from "next/image";` en tête du fichier. Sans image, la page ne change pas.

- [ ] **Step 7: Vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 84 tests, aucune erreur, aucun avertissement, build vert.

- [ ] **Step 8: Commit**

```bash
git add components/site/klub/KlubVisuel.tsx components/site/klub/KlubALaUne.tsx components/site/klub/KlubListe.tsx components/site/klub/KlubCarte.tsx components/site/klub/KlubPlanning.tsx app/mugi-klub/page.tsx "app/mugi-klub/seance/[id]/page.tsx"
git rm components/site/klub/KlubSemaines.tsx
git commit -m "$(cat <<'EOF'
klub : le planning devient une liste chronologique illustrée

Sur le modèle de la page Événements de thera.family : la prochaine séance
à la une, des filtres par type, des cartes où l'image domine. La structure
vient de Théra, l'apparence reste celle de Mugitu.

Plus de flèches de semaine : avec deux séances par semaine, chaque semaine
affichait deux petites cartes perdues dans une grille vide, et les
suivantes restaient cachées.

Sans image, une séance s'affiche sur un panneau à la couleur de son type.
Ce n'est pas un cas limite : aucune séance n'est illustrée à l'ouverture.

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Vérification, relecture visuelle et PR

- [ ] **Step 1: Tout vérifier**

Run: `npm test && npx tsc --noEmit && npm run lint && npm run build`
Attendu : 84 tests, aucune erreur, aucun avertissement.

Relancer avec `execute_sql`, chacun en une seule fois : `supabase/tests/klub.sql`, `supabase/tests/klub_reservation.sql`, `supabase/tests/klub_images.sql`. **`klub.sql` est le point de vigilance** : il éprouve le parcours d'inscription, et `klub__seance_publique` a été reprise.

- [ ] **Step 2: Relecture visuelle en local**

L'outil de prévisualisation lit ses serveurs dans `/Users/lucas/Desktop/.claude/launch.json`, **pas dans le dépôt**, et ses commandes ne démarrent pas dans ce dossier. Une entrée qui lance `npx next` télécharge Next depuis le registre ; une entrée existante peut servir un autre dossier. Ajoute donc une entrée qui force le répertoire :

```json
{ "name": "klub-planning", "runtimeExecutable": "sh",
  "runtimeArgs": ["-c", "cd /Users/lucas/Desktop/mugitu-biarritz-admin && ./node_modules/.bin/next dev -p 3011"],
  "port": 3011 }
```

Démarre-le, ouvre `/mugi-klub`, et vérifie **en capture** : la séance à la une avec son panneau de couleur, la liste groupée par date, l'absence de filtres (un seul type aujourd'hui), et le rendu en largeur de téléphone (375 px) — l'image doit passer au-dessus du texte, à la une comme dans les cartes.

Arrête le serveur et **retire l'entrée ajoutée** : ce fichier appartient à Lucas.

- [ ] **Step 3: Pousser et ouvrir la PR**

```bash
git push -u origin feature/klub-images-planning
gh pr create --base main --title "Mugi Klub : les images et le nouveau planning" --body "$(cat <<'EOF'
Chantier D. Le planning public du Mugi Klub devient une liste chronologique illustrée, et chaque séance peut porter une image.

**Ce qui n'allait pas.** Le Klub ne publie que la prépa des danseurs, deux fois par semaine. Chaque semaine affichait deux petites cartes de texte perdues dans une grille de colonnes vides, derrière des flèches qui cachaient les semaines suivantes. Aucune image ; le prix et la description ne s'obtenaient qu'en cliquant.

**Ce que la page fait maintenant**, sur le modèle de la page Événements de thera.family — la structure, pas l'apparence, qui reste celle de Mugitu :
- **la prochaine séance à la une**, en grand, avec son image, ses informations et, quand l'inscription se fait ailleurs, un bouton « S'inscrire ↗ » ;
- **des filtres par type**, qui n'apparaissent qu'à partir de deux types — une rangée à une seule valeur ne filtre rien, et c'est le cas aujourd'hui ;
- **la liste des quatre semaines**, groupée par date, en cartes où l'image domine. Plus de flèches.

**Sans image, la page tient seule.** Une séance sans image s'affiche sur un panneau à la couleur de son type. Ce n'est pas un cas limite : à l'ouverture, aucune séance n'est illustrée.

**Côté base**, même chemin que le lien de réservation : deux colonnes, un déclencheur d'héritage depuis le créneau et une fonction dédiée à l'écriture, pour ne retranscrire aucune des trois fonctions d'écriture du Klub. Seule `klub__seance_publique` est reprise, deux clés de plus.

**Côté admin**, le dépôt d'image des articles, avec ses aperçus de recadrage — rendus paramétrables pour montrer les deux formats du planning. L'éditeur d'articles garde les siens.

Spec : `docs/superpowers/specs/2026-09-26-klub-images-planning-design.md`
Plan : `docs/superpowers/plans/2026-09-26-klub-images-planning.md`

Vérifications : 84 tests, `tsc`, lint sans avertissement, build, les trois fichiers de scénarios du Klub sur la base de production en transaction annulée, et une relecture visuelle en local sur bureau et sur téléphone.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

- [ ] **Step 4: Ne pas fusionner**

Lucas n'a pas autorisé la fusion de ce chantier. Laisse la PR ouverte.

---

## Ce que ce plan ne fait pas

- Le choix des images, qui revient à Lucas et Jean-Baptiste.
- Les séances passées, qui ne concernent plus un visiteur.
- Une page par type de séance.
