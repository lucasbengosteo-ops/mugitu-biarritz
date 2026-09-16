# Migrations du Mugi Klub

Ces fichiers ont été appliqués à la base de l'app (projet `nuehdfyscqnkckudkqhe`) avec l'outil MCP Supabase `apply_migration`, pas avec la CLI.

## Historique en base

La table `supabase_migrations.schema_migrations` ne porte ni les mêmes numéros ni toujours les mêmes noms que ces fichiers. Les correctifs appliqués en cours de route ont ensuite été fondus dans les fichiers du dépôt.

| Version en base | Nom en base | Fichier du dépôt |
|---|---|---|
| 20260915223421 | `klub_tables` | `20260915120000_klub_tables.sql` |
| 20260915223607 | `klub_visiteur` | `20260915120100_klub_visiteur.sql` |
| 20260915223637 | `klub_visiteur_correctif_1` | fondu dans les fichiers ci-dessus |
| 20260915223731 | `klub_visiteur_correctif_2` | fondu dans les fichiers ci-dessus |
| 20260915231915 | `klub_verrous_et_index` | fondu dans les fichiers ci-dessus |
| 20260915232745 | `klub_admin_tache` | `20260915120200_klub_admin_tache.sql` |
| 20260916115420 | `klub_admin_correctifs` | `20260915120250_klub_admin_correctifs.sql` |
| 20260916120747 | `klub_anti_abus` | `20260915120260_klub_anti_abus.sql` |
| 20260916123402 | `klub_admin_retours` | `20260915120270_klub_admin_retours.sql` |
| 20260916124804 | `klub_droits_equipe` | `20260915120280_klub_droits_equipe.sql` |

L'état final est le même. Vérifié le 16 septembre 2026 : pour les 23 fonctions `klub*` décrites ici, le md5 du corps en base (`md5(prosrc)` dans `pg_proc`) est identique au md5 du corps de leur dernière définition dans ces fichiers. `klub_events_touch()` n'est pas dans le dépôt : elle appartient à l'ancienne table `klub_events`, à supprimer à la mise en ligne.

## Dépendances hors dépôt

Ces fichiers supposent des objets déjà présents en base et absents de ce dépôt :

- la table `public.user_roles` et son type de rôle ;
- la fonction `public.is_practitioner()` ;
- le schéma `extensions` (`extensions.gen_random_bytes` pour les jetons) ;
- le schéma `auth` de Supabase (`auth.uid()`).

## À ne pas faire

Ne pas lancer `supabase db push` sur ces fichiers sans réfléchir : la CLI ne les reconnaîtrait pas dans l'historique et tenterait de les rejouer. Pour une nouvelle base, les appliquer dans l'ordre des numéros après avoir créé les objets listés plus haut.

Les scénarios de test sont dans `supabase/tests/klub.sql`.
