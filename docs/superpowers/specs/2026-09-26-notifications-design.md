# Back-office : le récapitulatif de ce qui bouge

Date : 26 septembre 2026
Statut : validé à l'oral, en relecture
Branche : `feature/notifications`
Chantier C2. C1a, C1b et C1c sont en production, ainsi que les méthodes de réservation du Klub.

## Objectif

Lucas et Jean-Baptiste reçoivent un mail par jour disant ce qui a bougé dans l'espace d'administration : séances et ateliers créés ou annulés, articles publiés ou mis à relire, vœux posés, conflits nouveaux, absences déclarées, échanges demandés. Un seul mail, et rien du tout les jours sans rien.

## Décisions prises

| Sujet | Décision |
|---|---|
| Destinataires | Lucas et Jean-Baptiste seulement |
| Rythme | Une fois par jour, et rien si rien ne s'est passé |
| Source | Des déclencheurs en base, pas l'interface |
| Ce qui est adressé | Reste immédiat, et ne se coupe pas |
| Préférence | Chacun des deux peut couper son récapitulatif |
| Heure | 7 h, heure de Paris, sur les vingt-quatre heures écoulées |

## Pourquoi seulement eux deux

Le piège de ce chantier n'est pas technique. Onze personnes et « toute modification dans l'espace », c'est plusieurs mails par jour chacun ; au bout de trois semaines plus personne ne les ouvre, et le jour où un mail compte vraiment il est noyé. Un système de notification que les gens filtrent est pire que pas de notification : il donne l'illusion que l'information est passée.

Les neuf autres continuent donc de ne recevoir que **ce qui leur est adressé**, et qui existe déjà : une décision sur leur vœu, un retrait tranché, un commentaire sur leur créneau, un échange qu'on leur propose, une confirmation d'inscription au Klub. Ces messages ont un destinataire nommé et une action attendue. Ils ne se coupent pas — une décision qui se perd n'est pas une décision.

## Hors périmètre

Les notifications par téléphone. Un fil d'activité dans l'interface : le tableau de bord montre déjà ce qui demande une action. Les récapitulatifs hebdomadaires ou mensuels. Le choix, par personne, de quels types d'événements figurent au récapitulatif : on commence par tout ou rien.

## 1. Ce qui existe déjà

- `agenda_mails` et sa fonction de réservation `agenda_reserver_mails`, vidées par `/api/agenda/tache` toutes les cinq minutes ; `klub_mails` et `/api/klub/tache`, chaque minute. Deux files, deux routes, la même mécanique éprouvée : file d'attente, reprises, verrou `for update skip locked`.
- `agenda__mettre_en_file(type, destinataire, sujet, corps)`, qui n'écrit rien à celui qui agit.
- `site_super_admins`, deux lignes : Lucas et Jean-Baptiste.
- `lib/agenda/envoi.ts` et `lib/agenda/mails.ts` : l'envoi par Brevo et l'habillage d'un message.
- Les tables dont les changements nous intéressent : `articles`, `klub_seances`, `klub_creneaux`, `agenda_voeux`, `agenda_commentaires`, `agenda_absences`, `agenda_echanges`.

## 2. Le modèle

### `site_evenements`

| Colonne | Type | Note |
|---|---|---|
| `id` | uuid, clé primaire | |
| `quoi` | text | le type d'événement, contrainte `check` |
| `sujet` | text | de quoi il retourne, déjà lisible : « Prépa des danseurs, vendredi 8 h » |
| `qui` | uuid, nullable, référence `auth.users` | l'auteur du geste, quand on le connaît |
| `lien` | text, nullable | la rubrique où aller voir |
| `created_at` | timestamptz | |

Les types, tenus par une contrainte pour qu'un déclencheur ne puisse pas en inventer un que le récapitulatif ignorerait en silence :

| `quoi` | Quand |
|---|---|
| `seance_creee`, `seance_annulee` | une séance du Klub apparaît ou est annulée |
| `creneau_modifie` | un créneau hebdomadaire change |
| `article_publie`, `article_a_relire` | un article passe en `publie` ou en `relecture` |
| `voeu_pose` | un praticien demande une case de l'agenda |
| `absence_declaree` | une absence est posée |
| `echange_demande` | un échange de créneau est proposé |

**Rien sur les commentaires ni sur les décisions.** Ceux-là sont déjà adressés à quelqu'un, et les faire figurer au récapitulatif les dirait deux fois.

`site_evenements` est fermée à `anon` **et** à `authenticated` : personne ne la lit depuis le navigateur, seuls les déclencheurs y écrivent et la clé de service la relit.

### Les déclencheurs

Un par table concernée, `after insert or update`, `security definer`. **En base et non dans l'interface** : un article publié directement en SQL doit produire le même événement qu'un article publié depuis l'écran. L'interface, on oublie de l'appeler ; un déclencheur, non.

Chacun ne pose une ligne que sur une transition réelle — un article qui passe de `brouillon` à `publie`, pas un article publié qu'on réenregistre. Sans cette condition, corriger une coquille dans un article publié annoncerait sa publication une seconde fois.

### `site_reglages_mail`

| Colonne | Type | Note |
|---|---|---|
| `user_id` | uuid, clé primaire, référence `auth.users` | |
| `recap` | boolean, défaut vrai | recevoir le récapitulatif quotidien |
| `updated_at` | timestamptz | |

Chacun lit et écrit **sa** ligne, et rien d'autre. L'absence de ligne vaut « oui » : on ne crée pas une ligne pour tout le monde à l'avance.

Seul le récapitulatif se coupe. Il n'y a pas de réglage pour ce qui est adressé.

## 3. L'envoi

### La fonction qui compose

`site_recap_du_jour()`, `security definer`, réservée à la clé de service. Elle prend les événements des vingt-quatre dernières heures, les regroupe par type, et met un mail en file dans `agenda_mails` — la file existante, avec un type `recap` — pour chaque super-admin dont le réglage ne dit pas non.

**S'il n'y a aucun événement, elle ne met rien en file.** C'est la règle qui fait qu'on ouvrira encore ce mail dans six mois.

Elle renvoie ce qu'elle a fait — le nombre d'événements et de mails posés — pour que la route puisse le journaliser.

### La route

`/api/site/recap`, protégée par `CRON_SECRET` comme les deux autres, appelée une fois par jour par un cron Vercel. **Les crons Vercel sont en UTC** : 7 h à Paris, c'est `0 5 * * *` en heure d'été et `0 6 * * *` en heure d'hiver. On pose `0 5 * * *` et on assume qu'en hiver le mail arrive à 6 h ; une heure de décalage sur un récapitulatif quotidien ne vaut pas la complexité d'un décalage calculé.

La route ne fait qu'appeler la fonction. L'envoi lui-même reste le travail de `/api/agenda/tache`, qui vide la file toutes les cinq minutes : un seul chemin d'envoi, déjà éprouvé, et un mail qui part au plus tard cinq minutes après avoir été composé.

### Le texte

Regroupé par thème, dans l'ordre : le Klub, les actualités, l'agenda. Chaque ligne dit qui a fait quoi. Un lien par thème vers la rubrique concernée. Pas de mise en scène : ce mail se lit en quinze secondes ou il ne sert à rien.

## 4. L'écran

Une ligne dans le panneau d'administration, sous le nom du compte : « Récapitulatif quotidien », avec une case à cocher. Elle n'apparaît que pour Lucas et Jean-Baptiste, puisque eux seuls le reçoivent.

Pas de rubrique de réglages pour un seul interrupteur.

## 5. Ce qu'on vérifie

1. **Scénarios SQL** (`supabase/tests/notifications.sql`, transaction annulée) : publier un article pose un événement, le réenregistrer n'en pose pas un second ; créer une séance en pose un ; un vœu posé en pose un, une décision sur ce vœu n'en pose pas ; `site_recap_du_jour()` met un mail par super-admin qui ne l'a pas coupé, et zéro quand il n'y a aucun événement ; `anon` et `authenticated` ne lisent pas `site_evenements` ; chacun n'écrit que son propre réglage.
2. **Tests unitaires** (`node --test`) sur la composition du texte : le regroupement par thème, le pluriel, et le cas où un thème est vide.
3. **Build et lint** : `npm run build`, `npm run lint`, `npm test`.
4. **Un essai réel** : appeler la route avec le secret, vérifier qu'un mail part et le lire.

## 6. Ce qui reste à décider plus tard

- Choisir par personne quels types figurent au récapitulatif, si tout ou rien se révèle trop grossier.
- Fusionner les files `agenda_mails` et `klub_mails`, maintenant que la première porte aussi le récapitulatif : le nom devient faux avant la mécanique.
- Ouvrir le récapitulatif au reste de l'équipe, si l'un d'eux le demande — l'écran et la préférence le permettent déjà.
