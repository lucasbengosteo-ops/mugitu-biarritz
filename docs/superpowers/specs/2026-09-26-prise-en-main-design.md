# Back-office : la prise en main dans l'écran

Date : 26 septembre 2026
Statut : validé à l'oral, en relecture
Branche : `feature/prise-en-main`
Chantier C3, le dernier du découpage. C1a, C1b, C1c et les méthodes de réservation du Klub sont en production ; C2, le récapitulatif quotidien, est en cours sur une autre branche.

## Objectif

Un praticien qui se connecte pour la première fois sait quoi faire, sans qu'on lui envoie un document. Aujourd'hui, un guide existe hors du site : il faut le partager, il se périme à chaque écran qui bouge, et personne ne le relit.

## Décisions prises

| Sujet | Décision |
|---|---|
| Forme | Une carte « Premiers pas » sur le tableau de bord, pas une visite guidée |
| Étapes | Quatre, dont deux constatées dans les données et deux cochées à la main |
| Disparition | Quand les quatre sont faites, ou quand la personne la masque |
| Portée | Chacun a la sienne ; rien n'est partagé |
| Réapparition | Jamais, une fois masquée — c'est une prise en main, pas un rappel |

## Pourquoi pas une visite guidée

Une visite en fenêtres successives se fige sur des sélecteurs et des positions d'écran. L'admin a changé six fois en dix jours : la coque, le tableau de bord, les événements, l'agenda, les congés, les échanges. Une visite écrite aujourd'hui serait fausse la semaine prochaine, et personne ne s'en apercevrait — un guide faux est pire qu'un guide absent, parce qu'il fait douter l'utilisateur plutôt que l'outil.

Une carte qui dit « voici les quatre choses à faire » et qui coche ce qui est déjà fait ne dépend d'aucune position d'écran. Elle survit aux refontes, et elle se corrige en une ligne.

## Hors périmètre

Une aide contextuelle par écran. Une recherche dans l'aide. Une visite guidée, donc. La traduction en basque. Le remplacement du guide extérieur, qui reste utile à qui veut une vue d'ensemble avant de se connecter — la carte y renvoie.

## 1. Les quatre étapes

| Étape | Constatée comment | Pourquoi elle |
|---|---|---|
| **Posez vos demi-journées** dans l'agenda du cabinet | vrai dès que la personne a un vœu, quel qu'en soit l'état | c'est la seule chose qu'on attend de chacun, et elle bloque l'arbitrage des salles |
| **Déclarez vos absences** à venir | vrai dès qu'une absence existe, **ou** quand la personne coche « je n'en ai pas » | sans ça la grille annonce des présences fausses |
| **Lisez comment marche le Mugi Klub** | cochée à la main | rien dans les données ne dit qu'on a lu quelque chose |
| **Écrivez ou relisez un article** | vrai dès que la personne est propriétaire d'un article, **ou** quand elle coche « pas pour moi » | tout le monde n'écrit pas, et forcer une étape qu'on ne fera jamais garde la carte à l'écran pour rien |

Deux étapes ont donc un échappatoire explicite. C'est délibéré : une liste où l'on ne peut pas dire « pas moi » ne se termine jamais, et une liste qui ne se termine jamais se masque.

Pour Lucas et Jean-Baptiste, une cinquième ligne s'ajoute, **quand C2 sera en production** : « Choisissez si vous voulez le récapitulatif quotidien », cochée dès qu'ils ont touché au réglage. Elle ne s'affiche pas pour les autres, qui ne le reçoivent pas.

## 2. Le modèle

### `site_prise_en_main`

| Colonne | Type | Note |
|---|---|---|
| `user_id` | uuid, clé primaire, référence `auth.users` | |
| `cochees` | text[], défaut `'{}'` | les étapes cochées à la main |
| `masquee` | boolean, défaut faux | la carte a été écartée |
| `updated_at` | timestamptz | |

Chacun lit et écrit **sa** ligne, et rien d'autre. L'absence de ligne vaut « rien de coché, carte visible » : on ne crée pas une ligne pour les onze comptes à l'avance.

Les étapes constatées dans les données ne sont **pas** stockées : elles se recalculent à chaque affichage, depuis les vœux, les absences et les articles que la personne possède. Stocker un état déductible, c'est se garantir qu'il divergera.

`cochees` n'est pas contraint à une liste fermée de valeurs. Une étape retirée du code laisse une chaîne orpheline dans le tableau, ce qui est sans effet ; une contrainte, elle, empêcherait de renommer une étape sans migration.

## 3. L'écran

En tête du tableau de bord, au-dessus des blocs, tant que la carte n'est ni terminée ni masquée.

- Un titre, « Premiers pas », et une phrase : ce qu'on attend, et que ça se fait en dix minutes.
- Les quatre lignes, chacune avec son état, son lien vers la rubrique concernée, et pour celles qui l'admettent le bouton « pas pour moi ».
- Un lien vers le guide extérieur, pour qui veut le détail.
- « Masquer » en bas, qui écarte la carte définitivement.

Quand les quatre sont faites, la carte affiche une dernière fois « Vous avez tout vu » et disparaît au chargement suivant — un pas de plus que de s'évanouir sans rien dire.

Sur téléphone, les lignes s'empilent. Rien d'autre à prévoir.

## 4. Ce qu'on vérifie

1. **Tests unitaires** (`node --test`) sur le calcul des étapes, qui est une fonction pure : une personne sans rien a quatre étapes ouvertes ; un vœu en ferme une ; une absence en ferme une ; une coche manuelle ferme celle qui l'admet ; les quatre fermées donnent « terminé » ; la cinquième étape n'existe que pour un gérant.
2. **Scénarios SQL** (`supabase/tests/prise_en_main.sql`, transaction annulée) : chacun n'écrit que sa propre ligne, ne lit pas celle d'un autre, et `anon` n'a aucun droit.
3. **Build et lint** : `npm run build`, `npm run lint`, `npm test`.
4. **Parcours en prévisualisation**, avec un compte praticien qui n'a jamais rien posé : les quatre étapes sont ouvertes, poser un vœu en ferme une au rechargement, « pas pour moi » ferme celle de l'article, masquer la fait disparaître et elle ne revient pas.

## 5. Ce qui reste à décider plus tard

- Une aide par écran, si les questions se répètent toujours sur le même.
- Un rappel aux comptes qui ne se sont jamais connectés : c'est un mail, donc le chantier des notifications, pas celui-ci.
- Le sort du guide extérieur, une fois que la carte aura vécu : le garder à jour ou le laisser s'éteindre.
